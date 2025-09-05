import DelayedChargeClient from './DelayedChargeClient'
import { stripe } from '../../lib/stripe'

export default async function DelayedChargeServer() {
  const amount = 9900
  const currency = 'usd'

  // Create a PaymentIntent with capture_method: 'manual' for delayed charge
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    capture_method: 'manual',
    payment_method_types: ['card', 'klarna'],
    // automatic_payment_methods: { enabled: true }
  })

  return <DelayedChargeClient clientSecret={intent.client_secret} />
}
