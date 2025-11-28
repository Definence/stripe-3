'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentRequestButtonElement, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function ExpressCheckoutForm({ clientSecret }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [paymentRequestStatus, setPaymentRequestStatus] = useState('checking')

  useEffect(() => {
    if (!stripe || !clientSecret) return

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Total',
        amount: 9900,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    let mounted = true

    pr.canMakePayment().then((result) => {
      console.log('canMakePayment result:', result)
      if (result && mounted) {
        console.log('Payment method available:', result)
        console.log('Available methods:', {
          applePay: result.applePay,
          googlePay: result.googlePay,
        })
        setPaymentRequest(pr)
        setCanMakePayment(true)
        setPaymentRequestStatus('available')
      } else {
        console.log('Payment method not available - result:', result)
        setPaymentRequestStatus('not-available')
      }
    }).catch((error) => {
      console.error('Error checking canMakePayment:', error)
      setPaymentRequestStatus('error')
    })

    const handlePaymentMethod = async (ev) => {
      setIsSubmitting(true)
      setMessage('')

      try {
        // Confirm the payment intent with the payment method from the Payment Request API
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: true }
        )

        if (confirmError) {
          // Show error to customer
          ev.complete('fail')
          setMessage(confirmError.message || 'Payment failed')
        } else if (paymentIntent) {
          // Payment succeeded or requires additional action
          if (paymentIntent.status === 'succeeded') {
            ev.complete('success')
            setMessage(`Payment succeeded! PaymentIntent ID: ${paymentIntent.id}`)
          } else if (paymentIntent.status === 'requires_action') {
            // Additional action required (e.g., 3D Secure)
            // The handleActions: true option should handle this automatically
            // But if it doesn't, we need to wait for the next action
            ev.complete('success')
            setMessage('Payment requires additional authentication. Please complete the verification.')
          } else {
            ev.complete('success')
            setMessage(`Payment status: ${paymentIntent.status}`)
          }
        } else {
          ev.complete('success')
          setMessage('Payment processed')
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        ev.complete('fail')
        setMessage(error.message || 'Unable to process payment.')
      } finally {
        setIsSubmitting(false)
      }
    }

    pr.on('paymentmethod', handlePaymentMethod)

    return () => {
      mounted = false
      pr.off('paymentmethod', handlePaymentMethod)
    }
  }, [stripe, clientSecret])

  const handlePaymentElementSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setMessage('')

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/success`
        }
      })

      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message)
        } else {
          setMessage('An unexpected error occurred.')
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setMessage(error.message || 'Unable to process payment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const paymentElementOptions = {
    paymentMethods: {
      googlePay: 'always',
    },
  }

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-2 sm:p-2 pb-20 gap-16'>
      <main className='flex flex-col gap-[16px] row-start-2 items-center sm:items-start'>
        <h1 className='text-2xl font-semibold tracking-tight'>Express Checkout</h1>
        <div className='w-full max-w-md flex flex-col gap-4'>
          <div className='w-full bg-white rounded-xl shadow p-6'>
            <div className='flex flex-col gap-4'>
              {paymentRequestStatus === 'checking' && (
                <div className='text-sm text-gray-500'>Checking for express payment methods...</div>
              )}

              {paymentRequestStatus === 'not-available' && (
                <div className='flex flex-col gap-4'>
                  <div className='text-sm text-red-600 font-semibold'>
                    Express payment methods not available
                  </div>
                  <div className='text-xs text-gray-500 space-y-2'>
                    <p>Apple Pay and Google Pay require:</p>
                    <ul className='list-disc list-inside space-y-1 ml-2'>
                      <li>HTTPS connection (or localhost)</li>
                      <li>Supported browser (Safari for Apple Pay, Chrome for Google Pay)</li>
                      <li>Device with wallet configured</li>
                      <li>Valid payment method in wallet</li>
                    </ul>
                    <p className='mt-2'>Check the browser console for more details.</p>
                  </div>
                </div>
              )}

              {paymentRequestStatus === 'error' && (
                <div className='text-sm text-red-600'>
                  Error checking payment availability. Please check the console.
                </div>
              )}

              {canMakePayment && paymentRequest && (
                <div className='flex flex-col gap-4'>
                  <div className='text-sm text-gray-600'>
                    Pay with Apple Pay or Google Pay
                  </div>
                  <div id="payment-request-button" className='w-full' style={{ minHeight: '48px' }}>
                    <PaymentRequestButtonElement
                      options={{
                        paymentRequest,
                        style: {
                          paymentRequestButton: {
                            theme: 'dark',
                            height: '48px',
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {clientSecret && (
                <div className='flex flex-col gap-4'>
                  <div className='text-sm text-gray-600 font-semibold mt-4'>
                    As an alternative, use Payment Element
                  </div>
                  <form onSubmit={handlePaymentElementSubmit} className='flex flex-col gap-4'>
                    <PaymentElement options={paymentElementOptions} />
                    <button
                      type='submit'
                      disabled={!stripe || !elements || isSubmitting}
                      className='mt-2 inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? 'Processing...' : 'Pay $99.00'}
                    </button>
                  </form>
                </div>
              )}

              {isSubmitting && (
                <div className='text-sm text-gray-500'>Processing payment...</div>
              )}

              {message && (
                <div className='text-sm text-gray-600 mt-2 break-all p-3 bg-gray-50 rounded'>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ExpressCheckoutClient({ clientSecret, amount, currency, ...props }) {
  if (!clientSecret) {
    return (
      <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20'>
        <main className='flex flex-col gap-[16px] row-start-2 items-center sm:items-start'>
          <div className='text-sm text-gray-500'>Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <ExpressCheckoutForm clientSecret={clientSecret} {...props} />
    </Elements>
  )
}
