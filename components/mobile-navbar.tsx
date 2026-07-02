'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCategoriesByType } from '@/lib/trip-categories'

export function MobileNavbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileOpen])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-9999 transition-all duration-500 ease-in-out md:hidden ${isScrolled
        ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
        : "bg-transparent backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <img src="/images/LOGO.png" alt="Wanderphilia Logo" className="w-16 h-16" />
          </Link>

          {/* Mobile Menu Button */}
          <div className="relative z-100000">
            <button
              className={`p-2 h-10 w-10 flex items-center justify-center cursor-pointer transition-all duration-300 rounded-lg touch-manipulation border-2 focus:outline-none focus:ring-2 ${isScrolled
                  ? 'bg-primary hover:bg-primary/90 border-primary text-white focus:ring-primary/50'
                  : 'bg-white/90 hover:bg-white border-white text-gray-800 focus:ring-white/50'
                }`}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsMobileOpen((prev) => !prev)
              }}
              onTouchStart={(e) => {
                e.preventDefault()
                setIsMobileOpen((prev) => !prev)
              }}
              aria-label="Toggle menu"
              type="button"
            >
              {isMobileOpen ? (
                <X size={20} className={isScrolled ? 'text-white' : 'text-gray-800'} />
              ) : (
                <Menu size={20} className={isScrolled ? 'text-white' : 'text-gray-800'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileOpen && (
          <div
            className="fixed top-16 left-0 w-full h-[calc(100vh-64px)] z-9998 bg-white border-t border-gray-200 text-gray-700 shadow-xl overflow-y-auto"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Mobile Menu Header with Close Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col gap-0" onClick={(e) => e.stopPropagation()}>
              <Link
                href="/"
                className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Home
              </Link>

              {/* India Trips Dropdown */}
              <div className="border-t border-gray-100">
                <button
                  className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  onClick={() => setOpenDropdown(openDropdown === 'india' ? null : 'india')}
                >
                  India Trips
                  <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'india' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'india' && (
                  <div className="bg-gray-50 py-2 border-t border-gray-100">
                    {getCategoriesByType('India').map((category) => (
                      <Link
                        key={category.id}
                        href={`/trips/${category.id}`}
                        className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 my-1" />
                    <Link href="/trips?type=India" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
                      View All India Trips
                    </Link>
                  </div>
                )}
              </div>

              {/* International Dropdown */}
              <div className="border-t border-gray-100">
                <button
                  className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  onClick={() => setOpenDropdown(openDropdown === 'international' ? null : 'international')}
                >
                  International
                  <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'international' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'international' && (
                  <div className="bg-gray-50 py-2 border-t border-gray-100">
                    {getCategoriesByType('International').map((category) => (
                      <Link
                        key={category.id}
                        href={`/trips/${category.id}`}
                        className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                        onClick={() => setIsMobileOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-200 my-1" />
                    <Link href="/trips?type=International" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
                      View All International
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/upcoming-tours"
                className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
                onClick={() => setIsMobileOpen(false)}
              >
                Upcoming Tours
              </Link>
              <Link
                href="/honeymoon"
                className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Honeymoon
              </Link>
              <Link
                href="/blog"
                className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                About Us
              </Link>

              <div className="border-t border-gray-100 px-4 py-4">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                  <Link href="/upcoming-tours" onClick={() => setIsMobileOpen(false)}>Explore Now</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}