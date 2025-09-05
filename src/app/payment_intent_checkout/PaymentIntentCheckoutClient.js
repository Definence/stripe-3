'use client'

import { useEffect, useState } from 'react'
import { Elements, PaymentMethodMessagingElement, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function CheckoutForm() {
  return (
    <div className='w-full max-w-md mx-auto min-h-screen flex items-center justify-center'>
        <PaymentElement />
    </div>
  )
}

export default function PaymentIntentCheckoutClient() {
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function createIntent() {
      try {
        const res = await fetch('/api/payment_intents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 9900, currency: 'usd' })
        })
        const json = await res.json()
        if (mounted) setClientSecret(json.clientSecret || '')
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false)
      }
    }
    createIntent()
    return () => { mounted = false }
  }, [])

  if (loading || !clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  )
}


