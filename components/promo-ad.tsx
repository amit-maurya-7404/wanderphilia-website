'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { RequestCallbackDialog } from './request-callback-dialog'

export function PromoAdCard() {
  const pathname = usePathname() || ''
  const [isOpen, setIsOpen] = useState(false)

  // Disable completely on all itinerary pages, booking, checkout, payment, and admin
  const isExcluded =
    pathname.startsWith('/itinerary') ||
    pathname.startsWith('/manual-itinerary') ||
    pathname.startsWith('/itinerary-custom') ||
    pathname.startsWith('/booking') ||
    pathname.startsWith('/payment') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/admin')

  useEffect(() => {
    if (isExcluded) return

    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('callback_popup_shown')
    if (shown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem('callback_popup_shown', 'true')
    }, 8000) // 8 seconds

    return () => clearTimeout(timer)
  }, [isExcluded])

  if (isExcluded) {
    return null
  }

  return (
    <RequestCallbackDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="General Inquiry"
      price={0}
    />
  )
}
