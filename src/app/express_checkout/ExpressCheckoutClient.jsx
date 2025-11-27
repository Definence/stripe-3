'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function ExpressCheckoutForm() {
  const stripe = useStripe()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [paymentRequest, setPaymentRequest] = useState(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [paymentRequestStatus, setPaymentRequestStatus] = useState('checking')

  useEffect(() => {
    if (!stripe) return

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

      // The payment method is already created by the Payment Request API
      // We just need to handle it
      try {
        console.log('paymentMethod', ev.paymentMethod)
        setMessage(`Created PaymentMethod: ${ev.paymentMethod.id}`)
        ev.complete('success')
      } catch (error) {
        ev.complete('fail')
        setMessage(error.message || 'Unable to process payment method.')
      } finally {
        setIsSubmitting(false)
      }
    }

    pr.on('paymentmethod', handlePaymentMethod)

    return () => {
      mounted = false
      pr.off('paymentmethod', handlePaymentMethod)
    }
  }, [stripe])

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20'>
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

export default function ExpressCheckoutClient(props) {
  return (
    <Elements stripe={stripePromise}>
      <ExpressCheckoutForm {...props} />
    </Elements>
  )
}
