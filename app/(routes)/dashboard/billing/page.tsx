import { PricingTable } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='mt-5 p-6 bg-white rounded-2xl shadow-md'>
      <h2 className='text-2xl font-bold'>Join Subscription</h2>
      <PricingTable />
    </div>
  )
}

export default page
