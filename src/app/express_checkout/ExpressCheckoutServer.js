import ExpressCheckoutClient from './ExpressCheckoutClient'

export default async function ExpressCheckoutServer({ searchParams }) {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      "Order canceled -- continue to shop around and checkout when you're ready."
    )
  }

  return <ExpressCheckoutClient />
}
