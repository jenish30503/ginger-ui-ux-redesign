import { Suspense } from 'react'
import { Marketplace } from '@/components/ginger/marketplace'

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Marketplace />
    </Suspense>
  )
}
