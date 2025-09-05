'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function KlarnaCheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`
      }
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      console.error(error.message);
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsSubmitting(false)
  }

  // props https://docs.stripe.com/js/elements_object/create_payment_element
  const paymentElementOptions = {
    layout: 'accordion',
    defaultValues: {
      billingDetails: {
        name: 'Sample Name',
        address: {
          line1: '215 Clayton street',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
          postal_code: '94117'
        }
      }
    },
  }

  return (
    <div className='w-full max-w-md mx-auto flex items-center justify-center py-8'>
      <div className='w-full bg-white rounded-xl shadow p-6'>
        <div className='flex flex-col gap-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Pay with Klarna</h2>
            <p className='text-xs text-gray-500 mt-1'>Buy now, pay later with Klarna</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='border border-gray-200 rounded-md px-3 py-3 mb-4'>
              <PaymentElement id='payment-element' options={paymentElementOptions} />
            </div>

            <button
              type='submit'
              disabled={!stripe || isSubmitting}
              className='w-full h-11 inline-flex items-center justify-center rounded-md bg-[#ffb3c7] hover:bg-[#ff9bb3] text-white px-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition'
            >
              {isSubmitting ? 'Processing...' : 'Pay with Klarna'}
            </button>
          </form>

          {message ? <p className='text-sm text-red-600 mt-2'>{message}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default function KlarnaCheckoutClient({ clientSecret }) {
  if (!clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <KlarnaCheckoutForm />
    </Elements>
  )
}
