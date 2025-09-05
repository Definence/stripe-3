import CardElementCheckoutClient from './CardElementCheckoutClient'

export default async function CheckoutServer({ searchParams }) {
  const { canceled } = await searchParams

  if (canceled) {
    console.log(
      'Order canceled -- continue to shop around and checkout when you’re ready.'
    )
  }

  return <CardElementCheckoutClient />
}
