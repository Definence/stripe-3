'use client'

import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm() {
  return (
    <div className='w-full max-w-md mx-auto min-h-screen flex items-center justify-center'>
      <PaymentElement />
    </div>
  )
}

export default function PaymentIntentCheckoutClient({ clientSecret }) {
  if (!clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}