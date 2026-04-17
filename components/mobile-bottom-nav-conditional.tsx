'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from '@/components/mobile-bottom-nav'

export function MobileBottomNavConditional() {
  const pathname = usePathname()
  const hideMobileNav = pathname?.startsWith('/trips/') ?? false

  return <>{!hideMobileNav && <MobileBottomNav />}</>
}
