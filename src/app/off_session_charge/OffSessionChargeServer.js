import OffSessionChargeClient from './OffSessionChargeClient'
import { stripe } from '../../lib/stripe'

export default async function OffSessionChargeServer() {
  // Create a Customer for saving the payment method
  const customer = await stripe.customers.create({})

  // Create a SetupIntent to collect and save a payment method for off-session use
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ['card'],
    usage: 'off_session'
  })

  return (
    <OffSessionChargeClient
      clientSecret={setupIntent.client_secret}
      customerId={customer.id}
    />
  )
}
