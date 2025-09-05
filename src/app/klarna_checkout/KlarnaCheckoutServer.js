import KlarnaCheckoutClient from './KlarnaCheckoutClient'
import { stripe } from '../../lib/stripe'

export default async function KlarnaCheckoutServer() {
  const amount = 9900
  const currency = 'usd'

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['klarna', 'card'],
  })

  return <KlarnaCheckoutClient clientSecret={intent.client_secret} />
}
