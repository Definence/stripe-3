import AchCheckoutClient from './AchCheckoutClient'
import { stripe } from '../../lib/stripe'

export default async function AchCheckoutServer({ searchParams }) {
  const amount = 9900 // $99.00
  const currency = 'usd'

  // Create a PaymentIntent with ACH (us_bank_account) as the payment method
  // The Payment Element will handle mandate collection automatically
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['us_bank_account', 'card'],
  })

  return <AchCheckoutClient clientSecret={intent.client_secret} />
}
