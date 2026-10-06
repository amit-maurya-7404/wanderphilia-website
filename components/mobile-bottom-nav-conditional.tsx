'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

export function MobileBottomNavConditional() {
  const pathname = usePathname() || ''
  
  // Hide on trip detail pages, christmas & new year detail pages, booking, itinerary, etc.
  const hideMobileNav =
    pathname.startsWith('/trips/') ||
    pathname.startsWith('/christmas-new-year/trips/') ||
    pathname.startsWith('/christmas-and-new-year/trips/') ||
    /^\/christmas-new-year\/[^/]+\/[^/]+/.test(pathname) ||
    /^\/christmas-and-new-year\/[^/]+\/[^/]+/.test(pathname) ||
    /^\/category\/[^/]+\/[^/]+/.test(pathname) ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/itinerary') ||
    pathname.startsWith('/manual-itinerary') ||
    pathname.startsWith('/itinerary-custom') ||
    pathname.startsWith('/admin')

  return <>{!hideMobileNav && <MobileBottomNav />}</>
}
