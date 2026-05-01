'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCategoriesByType } from '@/lib/trip-categories'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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
       className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-500 ease-in-out ${isScrolled
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50'
        : 'bg-transparent backdrop-blur-sm '
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <img src="/images/LOGO.png" alt="Wanderphilia Logo" className="w-22 h-22" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className={`text-sm font-semibold transition-colors cursor-pointer ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              Home
            </Link>

            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
                India Trips
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 border border-gray-100">
                {getCategoriesByType('India').map((category) => (
                  <Link
                    key={category.id}
                    href={`/trips/${category.id}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2" />
                <Link href="/upcoming-tours" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All India Trips
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
                International
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 border border-gray-100">
                {getCategoriesByType('International').map((category) => (
                  <Link
                    key={category.id}
                    href={`/trips/${category.id}`}
                    className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2" />
                <Link href="/upcoming-tours" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All International
                </Link>
              </div>
            </div>

            <Link href="/upcoming-tours" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              Upcoming Tours
            </Link>
            <Link href="/honeymoon" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              Honeymoon
            </Link>
            <Link href="/blog" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              Blog
            </Link>
            <Link href="/about" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              About Us
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="px-6 py-2 rounded-lg font-semibold transition-all bg-primary hover:bg-primary/90 text-white">
              <Link href="/upcoming-tours">Explore Now</Link>
            </Button>
          </div>

          <div className="md:hidden relative z-[1000]">
            <button
              className="p-3 h-12 w-12 flex items-center justify-center rounded-lg transition-all duration-300 border-2 focus:outline-none focus:ring-2 bg-white shadow-lg border-gray-200"
              onTouchStart={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsMobileOpen((prev) => !prev)
              }}
              onClick={(e) => {
                // Only handle click on desktop/touch devices that don't support touch
                if (!('ontouchstart' in window)) {
                  e.preventDefault()
                  e.stopPropagation()
                  setIsMobileOpen((prev) => !prev)
                }
              }}
              aria-label="Toggle menu"
              type="button"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed top-20 left-0 w-full h-[calc(100vh-80px)] z-[9998] bg-white border-t border-gray-200 text-gray-700 shadow-xl overflow-y-auto md:hidden" onClick={() => setIsMobileOpen(false)}>
          {/* <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50" onClick={(e) => e.stopPropagation()}>
            <span className="text-lg font-semibold text-gray-900">Menu</span>
            <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Close menu">
              <X size={20} className="text-gray-600" />
            </button>
          </div> */}
          <div className="flex flex-col gap-0" onClick={(e) => e.stopPropagation()}>
            <Link href="/" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
              Home
            </Link>
            <div className="border-t border-gray-100">
              <button className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === 'india' ? null : 'india')}>
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
              <Link href="/upcoming-tours" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
                View All India Trips
              </Link>
            </div>
          )}
        </div>
        <div className="border-t border-gray-100">
          <button className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === 'international' ? null : 'international')}>
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
              <Link href="/upcoming-tours" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
                View All International
              </Link>
            </div>
          )}
        </div>
        <Link href="/upcoming-tours" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100" onClick={() => setIsMobileOpen(false)}>
          Upcoming Tours
        </Link>
        <Link href="/honeymoon" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
          Honeymoon
        </Link>
        <Link href="/blog" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
          Blog
        </Link>
        <Link href="/about" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
          About Us
        </Link>
        <div className="border-t border-gray-100 px-4 py-4">
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white py-3">
            <Link href="/trips" onClick={() => setIsMobileOpen(false)}>
              Explore Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
    </nav >
  )
}
