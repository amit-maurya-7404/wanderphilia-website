'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

export function MobileBottomNavConditional() {
  const pathname = usePathname()
  // Hide on trips detail pages and package detail pages
  const hideMobileNav = (pathname?.startsWith('/trips/') ?? false) || (pathname?.match(/^\/category\/[^/]+\/[^/]+/) ?? false)

  return <>{!hideMobileNav && <MobileBottomNav />}</>
}
