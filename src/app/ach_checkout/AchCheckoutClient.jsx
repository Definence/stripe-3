'use client'

import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: {
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setIsProcessing(false)
    }
  }

  return (
    <div className='w-full max-w-md mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>ACH Payment</h1>
      <div className='mb-4 p-4 bg-blue-50 dark:bg-blue-900 rounded'>
        <p className='text-sm mb-2'>
          <strong>Amount:</strong> $99.00 USD
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          Pay securely via ACH (US Bank Account). You'll be asked to verify your bank account.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <PaymentElement />
        </div>
        {errorMessage && (
          <div className='mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded'>
            {errorMessage}
          </div>
        )}
        <button
          type='submit'
          disabled={!stripe || isProcessing}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded transition-colors'
        >
          {isProcessing ? 'Processing...' : 'Pay $99.00'}
        </button>
      </form>
      <div className='mt-4 text-xs text-gray-500 dark:text-gray-400'>
        <p>
          Test ACH account numbers:
        </p>
        <ul className='list-disc list-inside mt-2'>
          <li>Routing: 110000000</li>
          <li>Account: 000123456789</li>
        </ul>
      </div>
    </div>
  )
}

export default function AchCheckoutClient({ clientSecret }) {
  if (!clientSecret) return null

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
        },
      }}
    >
      <CheckoutForm />
    </Elements>
  )
}
