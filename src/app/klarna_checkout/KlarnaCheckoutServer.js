import KlarnaCheckoutClient from './KlarnaCheckoutClient'
import { stripe } from '../../lib/stripe'

//
// basic info https://docs.stripe.com/payments/klarna
// test integration https://docs.stripe.com/payments/klarna/accept-a-payment?platform=web&ui=API#testmode-guide
// stripe component info https://docs.stripe.com/payments/payment-element
// payments quickstart https://docs.stripe.com/payments/quickstart
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
