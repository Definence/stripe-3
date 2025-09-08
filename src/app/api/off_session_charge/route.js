import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const { amount, currency, customerId, paymentMethodId } = await req.json()

    if (!amount || !currency || !customerId || !paymentMethodId) {
      return NextResponse.json(
        { error: 'amount, currency, customerId, and paymentMethodId are required' },
        { status: 400 }
      )
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      automatic_payment_methods: { enabled: true }
    })

    return NextResponse.json({ id: intent.id, status: intent.status })
  } catch (err) {
    // For some cards, a mandate or customer_action may be required.
    // We surface the error message; the demo keeps things simple.
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}


