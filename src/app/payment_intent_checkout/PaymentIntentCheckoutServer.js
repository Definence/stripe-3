import PaymentIntentCheckoutClient from './PaymentIntentCheckoutClient'
import { stripe } from '../../lib/stripe'

export default async function PaymentIntentCheckoutServer({ searchParams }) {
  const amount = 9900
  const currency = 'usd'

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    automatic_payment_methods: { enabled: true }
  })

  return <PaymentIntentCheckoutClient clientSecret={intent.client_secret} />
}
