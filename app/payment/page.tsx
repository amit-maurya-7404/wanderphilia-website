'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, CheckCircle, CreditCard, ChevronRight } from 'lucide-react'
import { trips, Trip } from '@/lib/data'

export default function PaymentPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, phone } = useAuth()

  const [trip, setTrip] = useState<Trip | null>(null)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [quantities, setQuantities] = useState<number[]>([])
  const [subtotal, setSubtotal] = useState(0)
  const [gst, setGst] = useState(0)
  const [total, setTotal] = useState(0)

  // Form states
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneState, setPhoneState] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (phone) {
      setPhoneState(phone)
    }
  }, [phone])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const slug = searchParams.get('slug')
      const start = searchParams.get('startDate') || ''
      const end = searchParams.get('endDate') || ''
      const qtyStr = searchParams.get('quantities') || ''

      setStartDate(start)
      setEndDate(end)

      if (slug) {
        const foundTrip = trips.find((t) => t.slug === slug)
        if (foundTrip) {
          setTrip(foundTrip)
          const parsedQtys = qtyStr ? qtyStr.split(',').map(Number) : []
          setQuantities(parsedQtys)

          // Calculate subtotal
          const parsePriceValue = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0
          let sub = 0
          if (foundTrip.costingDetails && parsedQtys.length > 0) {
            sub = foundTrip.costingDetails.reduce((sum, item, idx) => {
              const qty = parsedQtys[idx] || 0
              return sum + parsePriceValue(item.value) * qty
            }, 0)
          }

          if (sub === 0) {
            sub = foundTrip.price || 0
          }

          const calculatedGst = Math.round(sub * 0.05)
          const calculatedTotal = sub + calculatedGst

          setSubtotal(sub)
          setGst(calculatedGst)
          setTotal(calculatedTotal)
        }
      }
    }
  }, [])

  const handlePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!trip || total === 0) return

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter your first and last name.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email address.')
      return
    }
    if (!phoneState.trim() || phoneState.length < 10) {
      alert('Please enter a valid phone number.')
      return
    }
    if (!agreeTerms) {
      alert('You must agree to the Terms & Conditions to proceed.')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create order on the server side
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: trip.slug,
          quantities,
          startDate,
          endDate,
        }),
      })

      if (!orderRes.ok) {
        throw new Error('Failed to initiate secure order transaction.')
      }

      const order = await orderRes.json()
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        alert('Payment gateway is not configured. Please contact support.')
        setIsProcessing(false)
        return
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Wanderphilia',
        description: `Booking for ${trip.title}`,
        image: '/images/logo.png',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // 2. Verify payment signature on server side
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                fullName: `${firstName} ${lastName}`,
                emailAddress: email,
                mobileNumber: phoneState,
                tripTitle: trip.title,
                startDate: startDate,
                endDate: endDate,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // 3. Redirect to success page
              router.push(
                `/payment/success?orderId=${order.id}&paymentId=${
                  response.razorpay_payment_id
                }&slug=${trip.slug}&total=${total}&name=${encodeURIComponent(
                  firstName + ' ' + lastName
                )}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(
                  endDate
                )}`
              )
            } else {
              alert('Payment verification failed. Please try again.')
            }
          } catch (err) {
            console.error('Signature verification error:', err)
            alert('A verification error occurred. Please contact support.')
          }
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phoneState,
        },
        theme: {
          color: '#EAB308', // Amber / Brand Primary Yellow
        },
      }

      // Check if window.Razorpay exists, if not load it dynamically
      if (!(window as any).Razorpay) {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
        document.body.appendChild(script)
      } else {
        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error: any) {
      console.error('Payment checkout error:', error)
      alert(error.message || 'An error occurred during checkout.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-700 font-semibold animate-pulse">Checking login status...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar forceWhiteDesktop />

      <main className="grow pt-20">
        {/* Header Section */}
        <section className="bg-white border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                Secure Booking Checkout
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                Confirm your travelers details and pay securely using Razorpay
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>Select Date</span>
              <ChevronRight size={14} />
              <span className="text-primary font-bold">Checkout</span>
              <ChevronRight size={14} />
              <span>Confirmation</span>
            </div>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side: Customer & Billing Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 bg-amber-400 text-slate-900 rounded-full text-sm font-bold">1</span>
                  Contact Information
                </h2>

                <form onSubmit={handlePayment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">FIRST NAME</label>
                      <Input
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1">LAST NAME</label>
                      <Input
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">EMAIL ADDRESS</label>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-xl border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">MOBILE NUMBER</label>
                    <Input
                      type="tel"
                      placeholder="9876543210"
                      value={phoneState}
                      onChange={(e) => setPhoneState(e.target.value)}
                      required
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </form>
              </div>

              {/* Payment Methods Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 bg-amber-400 text-slate-900 rounded-full text-sm font-bold">2</span>
                  Payment Gateway
                </h2>
                <p className="text-sm text-slate-500 mb-6">
                  Click below to open the secure Razorpay modal where you can pay using Credit/Debit Card, UPI, Netbanking, or Wallets.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { name: 'Razorpay Secure', icon: '🛡️', desc: 'UPI, Cards, Netbanking' },
                    { name: 'UPI Checkout', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                    { name: 'Cards Payment', icon: '💳', desc: 'Visa, MasterCard, RuPay' },
                  ].map((method, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePayment()}
                      type="button"
                      className="flex flex-col items-center justify-center border border-slate-200 rounded-2xl p-4 text-center hover:border-amber-400 hover:bg-amber-50/30 transition-all group"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{method.icon}</div>
                      <p className="text-sm font-bold text-slate-900">{method.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{method.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Terms Agreement */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded text-amber-500 accent-amber-500 border-slate-300"
                    />
                    <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-amber-600 font-semibold hover:underline">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" target="_blank" className="text-amber-600 font-semibold hover:underline">
                        Privacy Policy
                      </a>{' '}
                      of Wanderphilia.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Side: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 md:p-8 sticky top-24 space-y-6">
                <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Order Summary</h2>

                {trip ? (
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-500 font-medium shrink-0">Package</span>
                      <span className="font-semibold text-slate-900 text-right">{trip.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Duration</span>
                      <span className="font-semibold text-slate-900">
                        {trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration} Days`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Travelers</span>
                      <span className="font-semibold text-slate-900">
                        {quantities.reduce((a, b) => a + b, 0) || 1} Person(s)
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-slate-500 font-medium shrink-0">Dates</span>
                      <span className="font-semibold text-slate-900 text-right">
                        {startDate && endDate ? `${startDate} to ${endDate}` : 'TBA'}
                      </span>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Subtotal</span>
                        <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">GST (5%)</span>
                        <span className="font-semibold text-slate-900">₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                        <span className="text-base font-bold text-slate-900">Total</span>
                        <span className="text-2xl font-extrabold text-amber-500">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Loading package details...</p>
                )}

                <Button
                  onClick={() => handlePayment()}
                  disabled={isProcessing || !trip || total === 0}
                  size="lg"
                  className="w-full gap-2 flex items-center justify-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl h-12 shadow-xs transition-all"
                >
                  <Lock size={16} />
                  {isProcessing ? 'Initiating Payment...' : `Pay ₹${total.toLocaleString('en-IN')} Securely`}
                </Button>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 text-xs text-slate-500">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Secure 256-Bit SSL Checkout</p>
                    <p className="mt-0.5">Your payment is encrypted and securely processed by Razorpay.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
