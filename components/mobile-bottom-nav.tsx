'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen } from 'lucide-react'

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0  left-0 right-0 z-50 md:hidden">
      <div className="border border-slate-800/90  bg-white shadow-2xl">
        <nav className="grid grid-cols-3">

          {/* CALL */}
          <a
            href="tel:+919217664099"
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <img src="/images/phone-call.png" alt="Call" className="h-5 w-5" />
            <span className="text-[3vw]">Call</span>
          </a>

          {/* WHATSAPP */}
          <a
            href="https://wa.me/919217664099?text=Hey!%20I'm%20interested%20in%20your%20trips"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <img src="/images/whatsapp.png" alt="WhatsApp" className="h-5 w-5" />
            <span className="text-[3vw]">WhatsApp</span>
          </a>

          {/* STORIES */}
          <Link
            href="/blog"
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 text-[10.5px] font-semibold transition-all ${
              pathname === '/blog'
                ? 'text-white bg-slate-500'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[3vw]">Stories</span>
          </Link>

        </nav>
      </div>
    </div>
  )
}