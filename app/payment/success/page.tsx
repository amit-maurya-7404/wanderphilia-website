'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Calendar, Users, MapPin, ArrowRight, Lock, Mail, Phone, ShieldCheck, Printer, FileText } from 'lucide-react'
import { trips, Trip } from '@/lib/data'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [name, setName] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [total, setTotal] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const slug = searchParams.get('slug')
      const orderName = searchParams.get('name') || ''
      const payId = searchParams.get('paymentId') || ''
      const ordId = searchParams.get('orderId') || ''
      const amt = Number(searchParams.get('total')) || 0
      const start = searchParams.get('startDate') || ''
      const end = searchParams.get('endDate') || ''
      const mail = searchParams.get('email') || ''
      const ph = searchParams.get('phone') || ''

      setName(orderName)
      setPaymentId(payId)
      setOrderId(ordId)
      setTotal(amt)
      setStartDate(start)
      setEndDate(end)
      setEmail(mail)
      setPhone(ph)

      if (slug) {
        const foundTrip = trips.find((t) => t.slug === slug)
        if (foundTrip) {
          setTrip(foundTrip)
        }
      }
    }
  }, [])

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  // Calculate pricing breakdown based on total
  const subtotal = Math.round(total / 1.05)
  const gst = total - subtotal

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden print:bg-white print:p-0">
      <Navbar forceWhiteDesktop />

      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-10" />

      <main className="grow flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 print:pt-0 print:pb-0">
        <div className="max-w-2xl w-full space-y-8 print:max-w-full">
          {/* Header Success Section */}
          <div className="text-center space-y-4 print:hidden">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-3xl border border-emerald-100/60 shadow-xs animate-pulse">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-500 text-white rounded-2xl shadow-lg">
                <Check size={32} className="stroke-[3.5]" />
              </div>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Booking Confirmed!
              </h1>
              <p className="text-slate-500 font-medium max-w-md mx-auto text-sm sm:text-base">
                Your payment was successfully processed. A confirmation email and itinerary have been sent to you.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-semibold text-emerald-700">
              <Lock size={12} /> Secure 256-Bit SSL Transaction Verified
            </div>
          </div>

          {/* Ticket/Boarding Pass Layout */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden relative print:border-none print:shadow-none">
            {/* Top color strip */}
            <div className="h-2.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-amber-500" />

            {/* Ticket Header (Trip details banner) */}
            <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-900 flex items-end p-6 sm:p-8">
              {trip?.image && (
                <>
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                </>
              )}
              <div className="relative z-10 space-y-1 sm:space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                  {trip?.destination || 'CONFIRMED BOOKING'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {trip?.title || 'Wanderphilia Package Tour'}
                </h2>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
                  <div className="flex items-center gap-1">
                    <Calendar size={13} className="text-amber-400" />
                    <span>{trip?.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip?.duration} Days`}</span>
                  </div>
                  {trip?.difficulty && (
                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase font-semibold tracking-wider">
                      {trip.difficulty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Details Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lead Traveler</span>
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                    <span>{name || 'Valued Traveler'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Dates</span>
                  <div className="text-slate-800 font-semibold flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-400" />
                    <span>{startDate && endDate ? `${startDate} - ${endDate}` : 'Dates TBA'}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Info</span>
                  <div className="text-slate-600 font-medium space-y-1 text-xs">
                    {email && (
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        <span>{email}</span>
                      </div>
                    )}
                    {phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} className="text-slate-400" />
                        <span>{phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                      Confirmed
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-wider">
                      Paid
                    </span>
                  </div>
                </div>
              </div>

              {/* Dotted separator with side cutouts */}
              <div className="relative my-8 -mx-6 sm:-mx-8 flex items-center">
                <div className="w-4 h-8 bg-slate-50 rounded-r-full border-y border-r border-slate-200 absolute left-0 z-10" />
                <div className="grow border-t-2 border-dashed border-slate-200/80 h-0" />
                <div className="w-4 h-8 bg-slate-50 rounded-l-full border-y border-l border-slate-200 absolute right-0 z-10" />
              </div>

              {/* Pricing & Billing Details */}
              <div className="relative">
                {/* Dynamic Paid Stamp */}
                <div className="absolute right-4 top-2 select-none border-4 border-emerald-500/30 text-emerald-500/40 rounded-2xl px-4 py-2 text-xl font-black tracking-widest uppercase rotate-12 scale-110 flex flex-col items-center leading-none border-dashed">
                  <span>PAID</span>
                  <span className="text-[9px] font-bold mt-1 tracking-normal">VERIFIED BY WANDERPHILIA</span>
                </div>

                <div className="max-w-md space-y-3.5 text-slate-600 text-sm">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billing Breakdown</h4>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span className="font-semibold text-slate-800">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-3 text-slate-900 font-extrabold text-lg">
                    <span>Total Paid</span>
                    <span className="text-primary font-black text-xl">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Trust Details & Transaction Identifiers */}
              <div className="border-t border-slate-100 pt-6 mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase">Payment Reference ID</span>
                    <p className="font-mono text-slate-700 font-medium select-all bg-slate-50 rounded-lg p-2 border border-slate-100">{paymentId || 'PAY-REF-TBA'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 uppercase">Order Transaction ID</span>
                    <p className="font-mono text-slate-700 font-medium select-all bg-slate-50 rounded-lg p-2 border border-slate-100">{orderId || 'ORD-REF-TBA'}</p>
                  </div>
                </div>

                {/* Trust Seals row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50 text-center text-[10px] sm:text-xs font-semibold text-slate-400">
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-lg mb-1">🛡️</span>
                    <span>100% Secure SSL</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-lg mb-1">✅</span>
                    <span>Operator Verified</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-lg mb-1">📞</span>
                    <span>24/7 Priority Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Barcode style footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-col items-center sm:items-start gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Wanderphilia Trust Shield</span>
                <span className="text-xs text-slate-600 font-medium">Thank you for traveling with India's most trusted community.</span>
              </div>
              <div className="h-8 flex items-center gap-0.5 opacity-65">
                {/* Stylized Barcode pattern */}
                {[2,4,1,3,1,5,2,1,4,2,3,1,6,1,2,4,1,3,1,2,4,2,1,5,1,2].map((w, i) => (
                  <div key={i} className="bg-slate-800 h-full" style={{ width: `${w}px` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Action Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center print:hidden">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold px-8 shadow-md hover:shadow-lg transition-all h-12"
            >
              <Link href="/">Go to Homepage</Link>
            </Button>
            
            <Button
              onClick={handlePrint}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-100 font-bold gap-2 h-12 transition-all bg-white"
            >
              <Printer size={16} />
              Print Receipt
            </Button>

            <Button
              asChild
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto rounded-2xl text-slate-600 hover:text-slate-900 font-bold gap-2 h-12 hover:bg-slate-100 transition-all"
            >
              <Link href="/upcoming-tours">
                Explore More Tours <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
