'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, ShieldAlert, MessageCircle, BookOpen } from 'lucide-react'

const navItems = [
  { href: '/trips', label: 'Trips', Icon: Compass },
//   { href: '/contact', label: 'SOS', Icon: ShieldAlert },
  { href: '/contact', label: 'Chat', Icon: MessageCircle },
  { href: '/blog', label: 'Stories', Icon: BookOpen },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="mx-0 mb-0  border border-slate-800/90 bg-white backdrop-blur-3xl shadow-2xl shadow-slate-950/40">
        <nav className="grid grid-cols-3  divide-x divide-transparent">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.Icon
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold transition-all ${isActive ? 'text-white bg-slate-500  overflow-hidden' : 'text-slate-400 hover:text-white hover:bg-slate-900/70'}`}
              >
                <div className="inline-flex items-center justify-center rounded-2xl p-1 text-lg">
                  <Icon className="h-4 w-4" />
                </div>
                <span className='text-[3vw]'>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
