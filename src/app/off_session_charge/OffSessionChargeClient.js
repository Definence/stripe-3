'use client'

import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useMemo, useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

function OffSessionChargeForm({ customerId }) {
  const stripe = useStripe()
  const elements = useElements()
  const [savedPaymentMethodId, setSavedPaymentMethodId] = useState(null)
  const [status, setStatus] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isCharging, setIsCharging] = useState(false)

  const canCharge = useMemo(() => Boolean(savedPaymentMethodId && customerId), [savedPaymentMethodId, customerId])

  const handleSavePaymentMethod = useCallback(async () => {
    if (!stripe || !elements) return
    setIsSaving(true)
    setStatus('')
    try {
      const { error, setupIntent } = await stripe.confirmSetup({
        elements,
        confirmParams: {},
        redirect: 'if_required'
      })

      if (error) {
        setStatus(error.message || 'Failed to save payment method')
        return
      }

      if (setupIntent?.status === 'succeeded' || setupIntent?.status === 'requires_action' || setupIntent?.status === 'processing') {
        const paymentMethodId = setupIntent.payment_method
        setSavedPaymentMethodId(typeof paymentMethodId === 'string' ? paymentMethodId : paymentMethodId?.id || null)
        setStatus('Payment method saved')
      } else {
        setStatus(`Unexpected status: ${setupIntent?.status || 'unknown'}`)
      }
    } finally {
      setIsSaving(false)
    }
  }, [stripe, elements])

  const handleCharge = useCallback(async () => {
    if (!canCharge) return
    setIsCharging(true)
    setStatus('')
    try {
      const res = await fetch('/api/off_session_charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 9900,
          currency: 'usd',
          customerId,
          paymentMethodId: savedPaymentMethodId
        })
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus(data.error || 'Charge failed')
        return
      }
      setStatus('Charge succeeded')
    } catch (e) {
      setStatus(e.message || 'Charge failed')
    } finally {
      setIsCharging(false)
    }
  }, [canCharge, customerId, savedPaymentMethodId])

  return (
    <div className='w-full max-w-md mx-auto flex flex-col gap-4 py-8'>
      <PaymentElement />
      <button
        className='rounded-md px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow disabled:opacity-70'
        onClick={handleSavePaymentMethod}
        disabled={isSaving}
      >
        {isSaving ? 'Saving…' : 'Save payment method'}
      </button>
      <button
        className='rounded-md px-4 py-2 bg-emerald-600 text-white disabled:opacity-50'
        onClick={handleCharge}
        disabled={!canCharge || isCharging}
      >
        {isCharging ? 'Charging…' : 'Charge off-session ($99.00)'}
      </button>
      {status ? (
        <p className='text-sm text-gray-600'>{status}</p>
      ) : null}
    </div>
  )
}

export default function OffSessionChargeClient({ clientSecret, customerId }) {
  if (!clientSecret) return null

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <OffSessionChargeForm customerId={customerId} />
    </Elements>
  )
}
