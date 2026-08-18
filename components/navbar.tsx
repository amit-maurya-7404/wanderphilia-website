'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCategoriesByType } from '@/lib/trip-categories'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  forceWhiteDesktop?: boolean
}

export function Navbar({ forceWhiteDesktop }: NavbarProps) {
  const pathname = usePathname()
  const isAboutPage = pathname === '/about'
  const [isDesktop, setIsDesktop] = useState<boolean | undefined>(undefined)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)


  useEffect(() => {
    const updateDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5)
    }

    updateDesktop()
    handleScroll()
    window.addEventListener('resize', updateDesktop)
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('resize', updateDesktop)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isMobileOpen])

  const navBackground = isDesktop === undefined
    ? 'white'
    : isDesktop
      ? isScrolled || forceWhiteDesktop
        ? 'rgba(255,255,255,0.95)'   // scroll or forced white → solid white
        : 'rgba(255,255,255,0.15)'   // top → glass
      : 'white'

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-9999 transition-all duration-500 ease-in-out
    ${isScrolled || forceWhiteDesktop
          ? 'backdrop-blur-md shadow-lg border-b border-gray-200/50'
          : 'backdrop-blur-md backdrop-saturate-150'
        }
    ${isDesktop === false || isDesktop === undefined ? 'bg-white' : ''}
  `}
      style={{ backgroundColor: navBackground }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <img src="/images/Made_LOGO.png" alt="Wanderphilia Logo" className="w-50 h-22" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {/* <Link href="/" className={`text-sm font-semibold transition-colors cursor-pointer ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700 hover:text-primary' : 'text-white/80 hover:text-primary'}`}>
              Home
            </Link> */}

            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700  hover:text-primary' : 'text-white  hover:text-primary'}`}>
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
                <Link href="/india-trips" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All India Trips
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex text-center gap-1 ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700  hover:text-primary' : 'text-white hover:text-primary'}`}>
                International Trips
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
                <Link href="/international-trips" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All International
                </Link>
              </div>
            </div>

            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700  hover:text-primary' : 'text-white  hover:text-primary'}`}>
                Upcoming Group Trips
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 border border-gray-100">
                <Link
                  href="/trips/leh-ladakh"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Ladakh
                </Link>
                <Link
                  href="/trips/spiti"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Spiti
                </Link>
                <Link
                  href="/trips/bhutan"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Bhutan
                </Link>
                <Link
                  href="/trips/kashmir"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Kashmir
                </Link>
                <Link
                  href="/trips/himachal"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Himachal
                </Link>
                <Link
                  href="/trips/thailand"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Thailand
                </Link>
                <Link
                  href="/trips/vietnam"

                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Vietnam
                </Link>

                <div className="border-t border-gray-200 my-2" />
                <Link href="/upcoming-tours" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All Upcoming Trips
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700  hover:text-primary' : 'text-white  hover:text-primary'}`}>
                Honeymoon Getaway
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-50 border border-gray-100">
                <Link
                  href="/trips/singapore"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Singapore
                </Link>
                <Link
                  href="/trips/sikkim"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Sikkim
                </Link>
                <Link
                  href="/trips/thailand"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Thailand
                </Link>
                <Link
                  href="/trips/kashmir"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Kashmir
                </Link>
                <Link
                  href="/trips/himachal"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Himachal
                </Link>
                <Link
                  href="/trips/bhutan"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Bhutan
                </Link>
                <Link
                  href="/trips/vietnam"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Vietnam
                </Link>
                <Link
                  href="/trips/bali"
                  className="block px-4 py-3 text-gray-700 hover:bg-primary/10 hover:text-primary font-medium text-sm rounded-lg mx-2 transition-colors"
                >
                  Bali
                </Link>


                <div className="border-t border-gray-200 my-2" />
                <Link href="/honeymoon" className="block px-4 py-3 text-primary font-bold text-sm rounded-lg mx-2 hover:bg-primary/5 transition-colors">
                  View All Honeymoon Getaways
                </Link>

              </div>
            </div>
            <Link href="/blog" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700   hover:text-primary' : 'text-white  hover:text-primary'}`}>
              Blog
            </Link>
            <Link href="/about" className={`text-sm font-semibold transition-colors ${isScrolled || isAboutPage || forceWhiteDesktop ? 'text-gray-700  hover:text-primary' : 'text-white  hover:text-primary'}`}>
              About Us
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="px-6 py-2 rounded-lg font-semibold transition-all bg-primary hover:bg-primary/90 text-white">
              <a href="tel:+919217664099">
                Contact Us
              </a>
            </Button>
          </div>

          <div className="md:hidden relative z-1000 flex items-center gap-3">
            <a
              href="tel:+919217664099"
              className="p-3 h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 border-2 bg-white shadow-lg border-gray-200 text-slate-700 hover:bg-slate-100"
              aria-label="Call us"
            >
              <Phone size={20} />
            </a>
            <button
              className="p-3 h-12 w-12 flex items-center justify-center rounded-full transition-all duration-300 border-2 focus:outline-none focus:ring-2 bg-white shadow-lg border-gray-200"
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
        <div className="fixed top-20 left-0 w-full h-[calc(100vh-80px)] z-9998 bg-white border-t border-gray-200 text-gray-700 shadow-xl overflow-y-auto md:hidden" onClick={() => setIsMobileOpen(false)}>
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
                  <Link href="/india-trips" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
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
                  <Link href="/international-trips" className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
                    View All International
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100">
              <button className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === 'upcoming' ? null : 'upcoming')}>
                Upcoming Group Trips
                <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'upcoming' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'upcoming' && (
                <div className="bg-gray-50 py-2 border-t border-gray-100">
                  <Link
                    href="/trips/leh-ladakh"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Ladakh
                  </Link>
                  <Link
                    href="/trips/spiti"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Spiti
                  </Link>
                  <Link
                    href="/trips/bhutan"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Bhutan
                  </Link>
                  <Link
                    href="/trips/kashmir"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Kashmir
                  </Link>
                  <Link
                    href="/trips/himachal"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Himachal
                  </Link>
                  <Link
                    href="/trips/thailand"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Thailand
                  </Link>
                  <Link
                    href="/trips/vietnam"

                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Vietnam
                  </Link>

                  <div className="border-t border-gray-200 my-1" />
                  <Link
                    href="/upcoming-tours"

                    className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    View All Upcoming Trips
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t border-gray-100">
              <button className="w-full text-left px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between" onClick={() => setOpenDropdown(openDropdown === 'honeymoon' ? null : 'honeymoon')}>
                Honeymoon Getaway
                <ChevronDown size={18} className={`transition-transform duration-300 ${openDropdown === 'honeymoon' ? 'rotate-180' : ''}`} />
              </button>
              {openDropdown === 'honeymoon' && (
                <div className="bg-gray-50 py-2 border-t border-gray-100">
                  <Link
                    href="/trips/singapore"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Singapore
                  </Link>
                  <Link
                    href="/trips/sikkim"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Sikkim
                  </Link>
                  <Link
                    href="/trips/thailand"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Thailand
                  </Link>
                  <Link
                    href="/trips/kashmir"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Kashmir
                  </Link>
                  <Link
                    href="/trips/himachal"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Himachal
                  </Link>
                  <Link
                    href="/trips/bhutan"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Bhutan
                  </Link>
                  <Link
                    href="/trips/vietnam"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Vietnam
                  </Link>
                  <Link
                    href="/trips/bali"
                    className="block px-6 py-3 text-sm text-gray-600 hover:text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    Bali
                  </Link>
                  <div className="border-t border-gray-200 my-1" />
                  <Link
                    href="/honeymoon"
                    className="block px-6 py-3 text-sm font-semibold text-primary hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      setIsMobileOpen(false)
                      setOpenDropdown(null)
                    }}
                  >
                    View All Honeymoon Getaways
                  </Link>
                </div>
              )}
            </div>
            <Link href="/blog" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
              Blog
            </Link>
            <Link href="/about" className="px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsMobileOpen(false)}>
              About Us
            </Link>
            <div className="border-t border-gray-100 px-4 py-4">
              <Button asChild className="w-full rounded-lg font-semibold transition-all bg-primary hover:bg-primary/90 text-white">
                <a href="tel:+919217664099">
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      )
      }
    </nav >
  )
}
