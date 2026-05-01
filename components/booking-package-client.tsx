'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trip } from '@/lib/data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { ChevronDown, CreditCard } from 'lucide-react'

interface BookingPackageClientProps {
  trip: Trip
  slug: string
}

export default function BookingPackageClient({ trip, slug }: BookingPackageClientProps) {
  const router = useRouter()

  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [pricingOpen, setPricingOpen] = useState(true)

  const parsePriceValue = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0

  const [costingQuantities, setCostingQuantities] = useState<number[]>(
    trip.costingDetails?.map((_, idx) => (idx === 0 ? 1 : 0)) ?? []
  )

  const dateOptions = trip.dates ?? []

  const monthTabs = [
    'All',
    ...Array.from(
      new Set(
        dateOptions.map((date) =>
          new Date(date.startDate).toLocaleString('default', { month: 'short' })
        )
      )
    ),
  ]

  const filteredDates =
    selectedMonth === 'All'
      ? dateOptions
      : dateOptions.filter(
        (date) =>
          new Date(date.startDate).toLocaleString('default', { month: 'short' }) ===
          selectedMonth
      )

  const subtotal =
    trip.costingDetails?.reduce<number>(
      (sum, item, idx) => sum + parsePriceValue(item.value) * (costingQuantities[idx] || 0),
      0
    ) ?? 0

  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  const handleProceedToPayment = () => {
    router.push(`/payment?slug=${encodeURIComponent(slug)}`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar forceWhiteDesktop />
      

      <main className="grow pt-20">

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-16 grid gap-6 lg:gap-10 lg:grid-cols-[2fr_1fr]">

          {/* LEFT SIDE */}
          <div className="space-y-6">

            {/* TRIP DETAILS */}
            <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {trip.title}
              </h2>

              <div className="mt-6">

                {/* MONTH FILTER */}
                <div className="flex flex-wrap gap-2">
                  {monthTabs.map((month) => (
                    <button
                      key={month}
                      className={`rounded-full px-4 py-2 text-sm ${selectedMonth === month
                        ? 'bg-primary text-white'
                        : 'bg-slate-100'
                        }`}
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month}
                    </button>
                  ))}
                </div>

                {/* DATES */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredDates.map((date, index) => (
                    <button
                      key={index}
                      className="rounded-xl border p-4 text-left"
                      onClick={() => setSelectedDateIndex(index)}
                    >
                      <p className="font-semibold">
                        {date.startDate} - {date.endDate}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICING */}
            {trip.costingDetails && (
              <div className="rounded-3xl border bg-white shadow-sm">
                <button
                  onClick={() => setPricingOpen(!pricingOpen)}
                  className="w-full flex justify-between px-5 py-4"
                >
                  <span className="font-semibold">Pricing</span>
                  <ChevronDown />
                </button>

                {pricingOpen && (
                  <div className="p-4 space-y-3 bg-slate-50">
                    {trip.costingDetails.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.value}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className="h-9 w-9 bg-gray-200 rounded-full"
                            onClick={() => {
                              const copy = [...costingQuantities]
                              copy[idx] = Math.max((copy[idx] || 0) - 1, 0)
                              setCostingQuantities(copy)
                            }}
                          >
                            -
                          </button>
                          <span>{costingQuantities[idx]}</span>
                          <button
                            className="h-9 w-9 bg-gray-200 rounded-full"
                            onClick={() => {
                              const copy = [...costingQuantities]
                              copy[idx]++
                              setCostingQuantities(copy)
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT SIDE */}
          <aside className="hidden lg:block space-y-6">
            <div className="sticky top-24 rounded-4xl border border-gray-200 bg-white p-8 shadow-sm">

              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
                  Amount to pay
                </p>
                <h2 className="text-3xl font-bold text-slate-900 mt-3">
                  ₹{total.toLocaleString('en-IN')}
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Final amount including GST
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-700 mb-6">
                <div className="flex justify-between">
                  <span>Batch</span>
                  <span>
                    {dateOptions[selectedDateIndex]
                      ? `${dateOptions[selectedDateIndex].startDate} - ${dateOptions[selectedDateIndex].endDate}`
                      : 'TBA'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Riders selected</span>
                  <span>
                    {costingQuantities.reduce((sum, qty) => sum + qty, 0)}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-sm text-slate-700 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-semibold text-slate-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full justify-center gap-2"
                onClick={handleProceedToPayment}
                disabled={subtotal === 0}
              >
                Proceed to Payment
              </Button>
            </div>
          </aside>

        </section>
      </main>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex items-center justify-between lg:hidden z-9999">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-slate-900">
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
        <Button
          onClick={handleProceedToPayment}
          disabled={subtotal === 0}
        >
          Pay Now
        </Button>
      </div>

      <Footer />
    </div>
  )
}