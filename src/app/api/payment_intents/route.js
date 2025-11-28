import { NextResponse } from 'next/server'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const { amount, currency, payment_method_types, automatic_payment_methods } = await req.json()

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'amount and currency are required' },
        { status: 400 }
      )
    }

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: payment_method_types,
      automatic_payment_methods: automatic_payment_methods,
    })

    return NextResponse.json({ clientSecret: intent.client_secret })
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}
