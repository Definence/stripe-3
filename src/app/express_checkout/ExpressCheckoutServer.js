import ExpressCheckoutClient from './ExpressCheckoutClient'
import { stripe } from '../../lib/stripe'

export default async function ExpressCheckoutServer({ searchParams }) {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you're ready."
    )
  }

  const amount = 9900
  const currency = 'usd'
  const paymentMethodTypes = ['card']

  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    capture_method: 'automatic',
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'always',
    },
  })

  return (
    <ExpressCheckoutClient
      clientSecret={intent.client_secret}
      amount={amount}
      currency={currency.toUpperCase()}
    />
  )
}
