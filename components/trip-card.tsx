'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Phone, MessageCircle, Star } from 'lucide-react'
import type { Trip } from '@/lib/data'
import { contactPhone } from '@/lib/contact'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'

type TripCardProps = Trip

export function TripCard({
  title,
  image,
  destination,
  duration,
  price,
  rating,
  slug,
  itinerary,
}: TripCardProps) {
  const router = useRouter()
  const [callbackOpen, setCallbackOpen] = useState(false)

  const originalPrice = Math.round(price * 1.3)
  const savings = originalPrice - price
  const routeSummary = itinerary?.length
    ? itinerary.slice(0, 4).map((day) => `${day.day}D ${day.title}`).join(' • ') + (itinerary.length > 4 ? ` • +${itinerary.length - 4}` : '')
    : destination

  return (
    <div
      onClick={() => router.push(`/trips/${slug}`)}
      className="group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full flex flex-col hover:-translate-y-2"
    >
      <div className="relative h-64 overflow-hidden bg-slate-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 left-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-lg">
          Save INR {savings.toLocaleString('en-IN')}
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col grow">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
            <span>{duration} days &amp; {Math.max(duration - 1, 1)} nights</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <Star size={14} /> {rating.toFixed(1)}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-snug line-clamp-2">
            {title}
          </h3>

          {/* <p className="text-sm text-slate-600 leading-6 line-clamp-2">
            {routeSummary}
          </p> */}

          <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-orange-900">
            Summer Holiday Sale!
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div >
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Starting price</p>
              {/* <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-500 line-through">
                    INR {originalPrice.toLocaleString('en-IN')}
                  </p>
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Save INR {savings.toLocaleString('en-IN')}
                  </span>
                </div> */}
              <div className='flex flex-row text-center items-center gap-1'>
                <p className="mt-2 text-2xl font-bold text-primary">
                  INR {price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs pt-3 text-slate-500">/Adult</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 grid-cols-[auto_1fr]">
            <a
              href={`tel:${contactPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <Phone size={18} />
            </a>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setCallbackOpen(true)
              }}
              className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <MessageCircle size={18} />
              Request Callback
            </button>
          </div>
          <RequestCallbackDialog
            open={callbackOpen}
            onOpenChange={setCallbackOpen}
            title={title}
            price={price}
          />
        </div>
      </div>
    </div>
  )
}
