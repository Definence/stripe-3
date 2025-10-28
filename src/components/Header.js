import Link from 'next/link'

export default function Header() {
  return (
    <header className='bg-white border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <Link href='/' className='text-xl font-bold text-gray-900'>
              Stripe Demo
            </Link>
          </div>

          <nav className='hidden md:flex space-x-8'>
            <Link
              href='/external_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              External Checkout
            </Link>
            <Link
              href='/card_element_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              Card Element
            </Link>
            <Link
              href='/payment_element_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              Payment Element
            </Link>
            <Link
              href='/klarna_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              Klarna
            </Link>
            <Link
              href='/express_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              Express Checkout
            </Link>
            <Link
              href='/ach_checkout'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              ACH Payment
            </Link>
            <Link
              href='/off_session_charge'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium'
            >
              Off session Charge
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
