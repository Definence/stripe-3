import PaymentElementCheckoutClient from './PaymentElementCheckoutClient'
import { stripe } from '../../lib/stripe'

export default async function PaymentElementCheckoutServer({ searchParams }) {
  const amount = 9900
  const currency = 'usd'

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    // payment_method_types: ['klarna', 'card'],
    automatic_payment_methods: { enabled: true }
  })

  return <PaymentElementCheckoutClient clientSecret={intent.client_secret} />
}
