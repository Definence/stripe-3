import KlarnaCheckoutClient from './KlarnaCheckoutClient'
import { stripe } from '../../lib/stripe'

//
// basic info https://docs.stripe.com/payments/klarna
// test integration https://docs.stripe.com/payments/klarna/accept-a-payment?platform=web&ui=API#testmode-guide
// stripe component info https://docs.stripe.com/payments/payment-element
// payments quickstart https://docs.stripe.com/payments/quickstart
// 150 - pay in 4 or 6 payments financing
// 300 - pay in 4 or  6-12 payments financing
// 500 - pay in 4 or 6-12 payments financing
// 800 - pay in 4 or 6-12 payments financing
// 1000 - pay in 4 or 12-18 payments financing
// 1500 - pay in 4 or 12-18 payments financing
// 2000 - pay in 4 or 18-24 payments financing
// 2100 - 18-24 payments financing
// 2500 - 18-24 payments financing
// 3000 - 18-24 payments financing
// 4000 - 24 payments financing
// 5000 - 24 payments financing
// 6000 - 24 payments financing
// 8000 - 24 payments financing
// 10000 - 24 payments financing

export default async function KlarnaCheckoutServer() {
  const amount = 1800 // in dollars
  const currency = 'usd'

  const intent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency,
    payment_method_types: ['klarna', 'card'],
  })

  return <KlarnaCheckoutClient clientSecret={intent.client_secret} />
}
