'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Compass, ShieldAlert, MessageCircle, BookOpen, ChevronUp } from 'lucide-react'

const navItems = [
  { href: '/trips', label: 'Trips', Icon: Compass, showDropdown: true },
  { href: '/contact', label: 'Chat', Icon: MessageCircle },
  { href: '/blog', label: 'Stories', Icon: BookOpen },
]

const dropdownItems = [
  { label: 'Upcoming Trips', hash: '#upcoming-tours' },
  { label: 'India Trips', hash: '#india-trips' },
  { label: 'International Trips', hash: '#international-trips' },
  { label: 'Honeymoon Trips', hash: '#honeymoon-trips' },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleTripClick = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleDropdownNavigation = (hash: string) => {
    setDropdownOpen(false)
    // Navigate to home page with hash for smooth scroll
    if (pathname === '/') {
      // Already on home, just scroll to element
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to home with hash
      router.push(`/${hash}`)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute bottom-16 left-0 right-0 bg-white border-t border-slate-200 shadow-2xl shadow-slate-950/40">
          <div className="grid grid-cols-1">
            {dropdownItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleDropdownNavigation(item.hash)}
                className="px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100 last:border-b-0"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="mx-0 mb-0 border border-slate-800/90 bg-white backdrop-blur-3xl shadow-2xl shadow-slate-950/40">
        <nav className="grid grid-cols-3 divide-x divide-transparent">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.showDropdown && pathname?.includes('trips'))
            const Icon = item.Icon
            return (
              <div key={item.href + item.label}>
                {item.showDropdown ? (
                  <button
                    onClick={handleTripClick}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold transition-all w-full ${
                      isActive || dropdownOpen
                        ? 'text-white bg-slate-500 overflow-hidden'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-2xl p-1 text-lg relative">
                      <Icon className="h-4 w-4" />
                      {dropdownOpen && (
                        <ChevronUp className="absolute h-3 w-3 text-white" style={{ top: '-4px', right: '-4px' }} />
                      )}
                    </div>
                    <span className="text-[3vw]">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold transition-all ${
                      isActive ? 'text-white bg-slate-500 overflow-hidden' : 'text-slate-400 hover:text-white hover:bg-slate-900/70'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center rounded-2xl p-1 text-lg">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[3vw]">{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
