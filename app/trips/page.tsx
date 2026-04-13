import { Suspense } from 'react'
import TripsClient from '@/components/TripsClient'

export default function TripsPage() {
  return (
    <Suspense fallback={<div>Loading trips...</div>}>
      <TripsClient />
    </Suspense>
  )
}