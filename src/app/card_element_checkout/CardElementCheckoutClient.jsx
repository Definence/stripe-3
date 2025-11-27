'use client'

import { useState } from 'react'
import { Elements, PaymentMethodMessagingElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const pmOptions = {
  amount: 9900,
  currency: 'USD',
  countryCode: 'US',
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setMessage('')

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setIsSubmitting(false)
      setMessage('Card input not ready.')
      return
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (result.error) {
      setMessage(result.error.message || 'Unable to create payment method.')
    } else {
      console.log('paymentMethod', result.paymentMethod)
      setMessage(`Created PaymentMethod: ${result.paymentMethod.id}`)
    }

    setIsSubmitting(false)
  }

  return (
    <div className='font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-[16px] row-start-2 items-center sm:items-start'>
        <h1 className='text-2xl font-semibold tracking-tight'>Checkout</h1>
        <div className='w-full max-w-md flex flex-col gap-4'>
          <form onSubmit={handleSubmit} className='w-full bg-white rounded-xl shadow p-6'>
            <div className='flex flex-col gap-2'>
              <label className='text-sm font-semibold text-gray-600'>Card details</label>
              <div className='border rounded px-3 py-3'>
                <CardElement options={{ hidePostalCode: true }} />
              </div>

              <PaymentMethodMessagingElement options={pmOptions} />

              <button
                type='submit'
                disabled={!stripe || isSubmitting}
                className='mt-4 inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium disabled:opacity-50'
              >
                {isSubmitting ? 'Processing...' : 'Pay'}
              </button>
              {message ? <p className='text-sm text-gray-600 mt-2 break-all'>{message}</p> : null}
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default function CheckoutClient(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  )
}
