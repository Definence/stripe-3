'use client'
import React from 'react'

export default function ExternalCheckoutClient() {
  return (
    <div className="flex items-center justify-center w-full py-8">
      <form action='/api/checkout_sessions' method='POST'>
        <button
          type='submit'
          className='inline-flex items-center justify-center rounded-full bg-[#635bff] hover:bg-[#5851ff] text-white px-6 h-11 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#635bff] transition'
        >
          External Checkout
        </button>
      </form>
    </div>
  )
}
