'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trip } from '@/lib/data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import OTPLogin from '@/components/otp-login'
import { AuthUtils } from '@/lib/auth-utils'
import { ChevronDown, CreditCard, User, Mail, Phone, Lock } from 'lucide-react'
import { gtag } from '@/lib/gtag'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'

interface BookingPackageClientProps {
  trip: Trip
  slug: string
}

export default function BookingPackageClient({ trip, slug }: BookingPackageClientProps) {
  const router = useRouter()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)

  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [pricingOpen, setPricingOpen] = useState(true)

  const parsePriceValue = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0

  const costingItems = trip.costingDetails && trip.costingDetails.length > 0
    ? trip.costingDetails
    : [{ label: 'Package Price', value: `₹${(trip.price || 0).toLocaleString('en-IN')}` }]

  const [costingQuantities, setCostingQuantities] = useState<number[]>(() => {
    return costingItems.map((_, idx) => (idx === 0 ? 1 : 0))
  })

  useEffect(() => {
    setCostingQuantities(costingItems.map((_, idx) => (idx === 0 ? 1 : 0)))
  }, [trip])

  // Contact Form states
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [errors, setErrors] = useState<{ fullName?: string; mobileNumber?: string; emailAddress?: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)

  type BookingDateOption = {
    month: string
    label: string
    startDate?: string
    endDate?: string
  }

  const bookingDateOptions: BookingDateOption[] = trip.batchDates && trip.batchDates.length > 0
    ? trip.batchDates.flatMap((batch) =>
        batch.ranges.map((range) => ({
          month: batch.month,
          label: range,
        }))
      )
    : trip.dates.map((date) => ({
        month: new Date(date.startDate).toLocaleString('default', { month: 'short' }),
        label: `${date.startDate} - ${date.endDate}`,
        startDate: date.startDate,
        endDate: date.endDate,
      }))

  const monthTabs = [
    'All',
    ...Array.from(new Set(bookingDateOptions.map((option) => option.month)))
  ]

  const filteredDates =
    selectedMonth === 'All'
      ? bookingDateOptions
      : bookingDateOptions.filter((option) => option.month === selectedMonth)

  const selectedBookingOption = filteredDates[selectedDateIndex] || filteredDates[0]

  const parseBatchRange = (label: string) => {
    const [start, end] = label.split(' - ').map((part) => part.trim())
    return {
      startDate: start || label,
      endDate: end || start || label,
    }
  }

  const selectedDateValue = selectedBookingOption
    ? selectedBookingOption.startDate && selectedBookingOption.endDate
      ? { startDate: selectedBookingOption.startDate, endDate: selectedBookingOption.endDate }
      : parseBatchRange(selectedBookingOption.label)
    : { startDate: '', endDate: '' }

  const subtotal =
    costingItems.reduce<number>(
      (sum, item, idx) => sum + parsePriceValue(item.value) * (costingQuantities[idx] || 0),
      0
    )

  const gst = Math.round(subtotal * 0.05)
  const total = subtotal + gst

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required'
    }
    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required'
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }
    if (!emailAddress.trim()) {
      newErrors.emailAddress = 'Email Address is required'
    } else if (!/\S+@\S+\.\S+/.test(emailAddress.trim())) {
      newErrors.emailAddress = 'Please enter a valid email address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleProceedToPayment = async () => {
    gtag.event({
      action: 'click',
      category: 'Booking',
      label: `Proceed to Payment: ${trip.title}`,
    })

    if (!validateForm()) {
      const el = document.getElementById('contact-info-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    setIsProcessing(true)

    try {
      // Calculate total number of guests from quantities
      const totalGuests = costingQuantities.reduce((sum, q) => sum + q, 0);

      // Get selected pricing options descriptions
      const selectedPricingOptions = costingItems
        .map((item, idx) => ({ label: item.label, qty: costingQuantities[idx] }))
        .filter(opt => opt.qty > 0)
        .map(opt => `${opt.label} (Qty: ${opt.qty})`)
        .join(', ');

      // Determine the sharing type based on selected options (find first option with qty > 0)
      let sharingType = '';
      const selectedIndex = costingQuantities.findIndex(q => q > 0);
      if (selectedIndex !== -1) {
        const label = costingItems[selectedIndex].label;
        if (/double/i.test(label)) {
          sharingType = 'Double Sharing';
        } else if (/triple/i.test(label)) {
          sharingType = 'Triple Sharing';
        } else if (/quad/i.test(label)) {
          sharingType = 'Quad Sharing';
        } else if (/single/i.test(label)) {
          sharingType = 'Single Sharing';
        }
      }

      // 0. Create lead in Zoho CRM
      try {
        await fetch('/api/checkout/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName,
            mobileNumber: mobileNumber,
            email: emailAddress,
            tripSlug: slug,
            numberOfGuests: totalGuests,
            pricingOptions: selectedPricingOptions || 'No sharing options selected',
            sharingType: sharingType
          })
        })
      } catch (zohoError) {
        console.error('[Zoho CRM Lead Creation Error]:', zohoError)
      }

      // 1. Create order on the server side
      const selectedDate = selectedDateValue
      const startDate = selectedDate.startDate
      const endDate = selectedDate.endDate

      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          quantities: costingQuantities,
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
            const selectedDate = selectedDateValue
            const start = selectedDate.startDate
            const end = selectedDate.endDate

            // 2. Verify payment signature on server side
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                fullName: fullName,
                emailAddress: emailAddress,
                mobileNumber: mobileNumber,
                tripTitle: trip.title,
                startDate: start,
                endDate: end,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // 3. Redirect to success page
              router.push(
                `/payment/success?orderId=${order.id}&paymentId=${
                  response.razorpay_payment_id
                }&slug=${slug}&total=${total}&name=${encodeURIComponent(
                  fullName
                )}&startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(
                  end
                )}&email=${encodeURIComponent(emailAddress)}&phone=${encodeURIComponent(mobileNumber)}`
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
          name: fullName,
          email: emailAddress,
          contact: mobileNumber,
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

  const handleLoginSuccess = () => {
    setShowLoginDialog(false)
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
                      className={`rounded-full px-4 py-2 text-sm transition-colors ${selectedMonth === month
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      onClick={() => {
                        setSelectedMonth(month)
                        setSelectedDateIndex(0)
                      }}
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
                      className={`rounded-xl border p-4 text-left transition-all ${selectedDateIndex === index
                        ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      onClick={() => setSelectedDateIndex(index)}
                    >
                      <p className="font-semibold text-slate-900">
                        {date.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PRICING */}
            {costingItems && costingItems.length > 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <button
                  onClick={() => setPricingOpen(!pricingOpen)}
                  className="w-full flex justify-between items-center px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">Pricing Options</span>
                  <ChevronDown className={`transition-transform duration-300 ${pricingOpen ? 'rotate-180' : ''}`} />
                </button>

                {pricingOpen && (
                  <div className="p-4 space-y-3 bg-slate-50 border-t border-gray-100">
                    {costingItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center shadow-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.value}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            className="h-9 w-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-slate-700 transition-colors"
                            onClick={() => {
                              const copy = [...costingQuantities]
                              copy[idx] = Math.max((copy[idx] || 0) - 1, 0)
                              setCostingQuantities(copy)
                            }}
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-semibold text-slate-900">{costingQuantities[idx] || 0}</span>
                          <button
                            className="h-9 w-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center font-bold text-slate-700 transition-colors"
                            onClick={() => {
                              const copy = [...costingQuantities]
                              copy[idx] = (copy[idx] || 0) + 1
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

            {/* CONTACT INFORMATION */}
            <div id="contact-info-section" className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                  <User size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>
                  <p className="text-xs text-gray-500">Provide details for booking confirmation and payment receipt</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Full Name <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }))
                    }}
                    className={`rounded-xl border-slate-200 h-11 ${errors.fullName ? 'border-red-500 focus-visible:ring-red-500/20' : 'focus-visible:ring-primary/20'}`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                    <Input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={mobileNumber}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '')
                        setMobileNumber(val)
                        if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: undefined }))
                      }}
                      className={`rounded-xl border-slate-200 h-11 ${errors.mobileNumber ? 'border-red-500 focus-visible:ring-red-500/20' : 'focus-visible:ring-primary/20'}`}
                    />
                    {errors.mobileNumber && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Email Address <span className="text-red-500">*</span></label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value)
                        if (errors.emailAddress) setErrors(prev => ({ ...prev, emailAddress: undefined }))
                      }}
                      className={`rounded-xl border-slate-200 h-11 ${errors.emailAddress ? 'border-red-500 focus-visible:ring-red-500/20' : 'focus-visible:ring-primary/20'}`}
                    />
                    {errors.emailAddress && (
                      <p className="text-xs text-red-500 mt-1 font-medium">{errors.emailAddress}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                  <span className="font-medium text-slate-900">
                    {selectedBookingOption ? selectedBookingOption.label : 'TBA'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Riders selected</span>
                  <span className="font-medium text-slate-900">
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
                className="w-full justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl"
                onClick={handleProceedToPayment}
                disabled={subtotal === 0 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Proceed to Payment
                  </>
                )}
              </Button>
            </div>
          </aside>
        </section>
      </main>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 flex items-center justify-between lg:hidden z-50">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-lg font-bold text-slate-900">
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
        <Button
          onClick={handleProceedToPayment}
          disabled={subtotal === 0 || isProcessing}
          className="font-bold px-6 h-11 rounded-xl bg-primary text-white"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </Button>
      </div>

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={trip.title}
        price={total}
      />

      <Footer />

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Login Required to Proceed
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 mb-6">
              Please login with OTP before continuing to payment.
            </DialogDescription>
            <OTPLogin embedded onSuccess={handleLoginSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}