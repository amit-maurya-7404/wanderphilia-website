'use client'

import { useState, useEffect } from 'react'
import { RequestCallbackDialog } from './request-callback-dialog'

export function PromoAdCard() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('callback_popup_shown')
    if (shown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      sessionStorage.setItem('callback_popup_shown', 'true')
    }, 10000) // 10 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <RequestCallbackDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title="General Inquiry"
      price={0}
    />
  )
}
