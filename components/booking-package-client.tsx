'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trip, getUpcomingBatchDates, getUpcomingTripDates, parseBatchDateRange } from '@/lib/data'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import OTPLogin from '@/components/otp-login'
import { AuthUtils } from '@/lib/auth-utils'
import { ChevronDown, CreditCard, User, Mail, Phone, Lock, MessageSquare } from 'lucide-react'
import { RiWhatsappLine } from 'react-icons/ri'
import { gtag } from '@/lib/gtag'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { CountryCodeSelect } from '@/components/ui/country-code-select'
import { DEFAULT_COUNTRY_CODE } from '@/lib/country-codes'

interface BookingPackageClientProps {
  trip: Trip
  slug: string
}

export default function BookingPackageClient({ trip, slug }: BookingPackageClientProps) {
  const router = useRouter()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [isEnquiring, setIsEnquiring] = useState(false)
  const [enquirySuccessOpen, setEnquirySuccessOpen] = useState(false)

  const [selectedDateIndex, setSelectedDateIndex] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [pricingOpen, setPricingOpen] = useState(true)

  const parsePriceValue = (value: string) => Number(value.replace(/[^0-9]/g, '')) || 0

  const costingItems = trip.costingDetails && trip.costingDetails.length > 0
    ? trip.costingDetails
    : [{ label: 'Package Price', value: `₹${(trip.price || 0).toLocaleString('en-IN')}` }]

  const [costingQuantities, setCostingQuantities] = useState<number[]>(() => {
    if (trip.costingDetails && trip.costingDetails.length > 0) {
      return trip.costingDetails.map((_, idx) => (idx === 0 ? 1 : 0))
    }
    return [1]
  })

  useEffect(() => {
    if (trip.costingDetails && trip.costingDetails.length > 0) {
      setCostingQuantities(trip.costingDetails.map((_, idx) => (idx === 0 ? 1 : 0)))
    } else {
      setCostingQuantities([1])
    }
  }, [trip])

  // Contact Form states
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE)
  const [emailAddress, setEmailAddress] = useState('')
  const [errors, setErrors] = useState<{ fullName?: string; mobileNumber?: string; emailAddress?: string }>({})
  const [isProcessing, setIsProcessing] = useState(false)

  type BookingDateOption = {
    month: string
    label: string
    startDate?: string
    endDate?: string
  }

  // Strictly filter for upcoming dates only (today onwards). Past dates must NEVER be shown.
  const upcomingBatchDates = getUpcomingBatchDates(trip.batchDates)
  const upcomingDates = getUpcomingTripDates(trip.dates)

  const isGroupTrip = upcomingBatchDates.length > 0 || upcomingDates.length > 0

  let bookingDateOptions: BookingDateOption[] = []

  if (upcomingBatchDates.length > 0) {
    bookingDateOptions = upcomingBatchDates.flatMap((batch) =>
      batch.ranges.map((range) => {
        const parsed = parseBatchDateRange(range, batch.month)
        const formatIso = (d: Date) =>
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return {
          month: batch.month,
          label: range,
          startDate: parsed ? formatIso(parsed.startDate) : undefined,
          endDate: parsed ? formatIso(parsed.endDate) : undefined,
        }
      })
    )
  } else if (upcomingDates.length > 0) {
    bookingDateOptions = upcomingDates.map((date) => ({
      month: new Date(date.startDate).toLocaleString('default', { month: 'short' }),
      label: `${date.startDate} - ${date.endDate}`,
      startDate: date.startDate,
      endDate: date.endDate,
    }))
  }

  // Date helper functions
  const formatIsoDate = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const todayIso = formatIsoDate(new Date())

  const defaultDurationDays = trip.duration && trip.duration > 0 ? trip.duration : 7
  const defaultNights = trip.nights !== undefined ? trip.nights : Math.max(0, defaultDurationDays - 1)

  const getInitialStartDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1) // default to tomorrow
    return formatIsoDate(d)
  }

  const getInitialEndDate = (startIso: string) => {
    const s = new Date(startIso)
    if (isNaN(s.getTime())) return startIso
    const e = new Date(s)
    e.setDate(e.getDate() + Math.max(1, defaultDurationDays - 1))
    return formatIsoDate(e)
  }

  const [customStartDate, setCustomStartDate] = useState<string>(getInitialStartDate)
  const [customEndDate, setCustomEndDate] = useState<string>(() => getInitialEndDate(getInitialStartDate()))

  const handleCustomStartDateChange = (newStart: string) => {
    setCustomStartDate(newStart)
    if (newStart) {
      const s = new Date(newStart)
      if (!isNaN(s.getTime())) {
        const autoEnd = new Date(s)
        autoEnd.setDate(autoEnd.getDate() + Math.max(1, defaultDurationDays - 1))
        setCustomEndDate(formatIsoDate(autoEnd))
      }
    }
  }

  const handleCustomEndDateChange = (newEnd: string) => {
    setCustomEndDate(newEnd)
  }

  const formatFriendlyDate = (dateStr?: string) => {
    if (!dateStr) return ''
    try {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      }
      return dateStr
    } catch {
      return dateStr
    }
  }

  const getCustomDuration = () => {
    if (!customStartDate || !customEndDate) {
      return { days: defaultDurationDays, nights: defaultNights }
    }
    const s = new Date(customStartDate)
    const e = new Date(customEndDate)
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return { days: defaultDurationDays, nights: defaultNights }
    }
    const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const diffNights = Math.max(0, diffDays - 1)
    return { days: diffDays, nights: diffNights }
  }

  const currentDuration = getCustomDuration()

  const monthTabs = isGroupTrip
    ? ['All', ...Array.from(new Set(bookingDateOptions.map((option) => option.month)))]
    : []

  const filteredDates = isGroupTrip
    ? (selectedMonth === 'All'
        ? bookingDateOptions
        : bookingDateOptions.filter((option) => option.month === selectedMonth))
    : []

  const selectedBookingOption = filteredDates[selectedDateIndex] || filteredDates[0]

  const parseBatchRange = (label: string) => {
    const [start, end] = label.split(' - ').map((part) => part.trim())
    return {
      startDate: start || label,
      endDate: end || start || label,
    }
  }

  const selectedDateValue = isGroupTrip
    ? (selectedBookingOption
        ? (selectedBookingOption.startDate && selectedBookingOption.endDate
            ? { startDate: selectedBookingOption.startDate, endDate: selectedBookingOption.endDate }
            : parseBatchRange(selectedBookingOption.label))
        : { startDate: '', endDate: '' })
    : {
        startDate: customStartDate,
        endDate: customEndDate,
      }

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

    if (!isGroupTrip && (!customStartDate || !customEndDate)) {
      alert('Please select your travel start and end dates.')
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

      // 0. Create lead in Zoho CRM & trigger email notifications (experiences@wanderphilia.com + customer)
      try {
        await fetch('/api/checkout/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: fullName,
            mobileNumber: mobileNumber,
            countryCode: countryCode,
            email: emailAddress,
            tripSlug: slug,
            tripTitle: trip.title,
            destination: trip.destination,
            numberOfGuests: totalGuests,
            pricingOptions: selectedPricingOptions || 'No sharing options selected',
            sharingType: sharingType,
            startDate: selectedDateValue.startDate,
            endDate: selectedDateValue.endDate,
            subtotal: subtotal,
            gst: gst,
            totalAmount: total
          })
        })
      } catch (initiateError) {
        console.error('[Checkout Initiate Lead/Email Error]:', initiateError)
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

  const whatsappUrl = `https://wa.me/919217664099?text=${encodeURIComponent(
    `Hi Wanderphilia! I want to inquire about customizing "${trip.title}".\n` +
    (isGroupTrip
      ? `Batch: ${selectedBookingOption?.label || 'Upcoming'}\n`
      : `Dates: ${formatFriendlyDate(customStartDate)} to ${formatFriendlyDate(customEndDate)} (${currentDuration.days}D / ${currentDuration.nights}N)\n`) +
    `Guests: ${costingQuantities.reduce((sum, q) => sum + q, 0) || 1}\n` +
    `Please share details & custom quote.`
  )}`

  const handleRequestQuote = async () => {
    gtag.event({
      action: 'click',
      category: 'Enquiry',
      label: `Request Custom Quote: ${trip.title}`,
    })

    if (!validateForm()) {
      const el = document.getElementById('contact-info-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    if (!isGroupTrip && (!customStartDate || !customEndDate)) {
      alert('Please select your preferred travel start and end dates.')
      return
    }

    setIsEnquiring(true)

    try {
      const totalGuests = costingQuantities.reduce((sum, q) => sum + q, 0)
      const selectedPricingOptions = costingItems
        .map((item, idx) => ({ label: item.label, qty: costingQuantities[idx] }))
        .filter((opt) => opt.qty > 0)
        .map((opt) => `${opt.label} (Qty: ${opt.qty})`)
        .join(', ')

      let sharingType = ''
      const selectedIndex = costingQuantities.findIndex((q) => q > 0)
      if (selectedIndex !== -1) {
        const label = costingItems[selectedIndex].label
        if (/double/i.test(label)) sharingType = 'Double Sharing'
        else if (/triple/i.test(label)) sharingType = 'Triple Sharing'
        else if (/quad/i.test(label)) sharingType = 'Quad Sharing'
        else if (/single/i.test(label)) sharingType = 'Single Sharing'
      }

      await fetch('/api/checkout/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          mobileNumber,
          countryCode,
          email: emailAddress,
          tripSlug: slug,
          tripTitle: trip.title,
          destination: trip.destination,
          numberOfGuests: totalGuests || 1,
          pricingOptions: selectedPricingOptions || 'Customized Quote Request',
          sharingType: sharingType || 'Flexible',
          startDate: selectedDateValue.startDate,
          endDate: selectedDateValue.endDate,
          subtotal,
          gst,
          totalAmount: total,
          notes: 'Customer requested a tailored customized quote without online payment.',
        }),
      })

      setEnquirySuccessOpen(true)
    } catch (err) {
      console.error('[Quote Request Error]:', err)
      alert('Could not submit inquiry at this moment. Please reach out to us via WhatsApp.')
    } finally {
      setIsEnquiring(false)
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
            {/* TRIP DETAILS & DATE SELECTION */}
            <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-5">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200 mb-2">
                    {isGroupTrip ? 'Fixed Departure Group Tour' : 'Customized Private Tour'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {trip.title}
                  </h2>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block">Duration</span>
                  <span className="text-sm font-bold text-slate-800">
                    {trip.duration || 6} Days / {trip.nights || (trip.duration ? trip.duration - 1 : 5)} Nights
                  </span>
                </div>
              </div>

              {isGroupTrip ? (
                /* GROUP TRIP: FIXED BATCH DATES */
                <div className="mt-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Select Departure Batch
                  </p>
                  {/* MONTH FILTER */}
                  <div className="flex flex-wrap gap-2">
                    {monthTabs.map((month) => (
                      <button
                        key={month}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-all cursor-pointer ${
                          selectedMonth === month
                            ? 'bg-primary text-white shadow-sm'
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
                        className={`rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                          selectedDateIndex === index
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                        onClick={() => setSelectedDateIndex(index)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-900">
                            {date.label}
                          </p>
                          {selectedDateIndex === index && (
                            <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                              ✓
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* CUSTOMIZED TRIP: START & END DATE SELECTOR */
                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-orange-50/80 border border-orange-200/80 p-4">
                    <p className="text-sm font-bold text-orange-900 flex items-center gap-2">
                      <span className="text-base">✨</span> Choose Your Preferred Travel Dates
                    </p>
                    <p className="text-xs text-orange-700 mt-1 leading-relaxed">
                      This is a customized tour package. Select your travel start and end dates as per your convenience. Our travel specialist will curate your bookings and itinerary for your chosen dates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* START DATE */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 hover:border-slate-300 transition-colors">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Trip Start Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        min={todayIso}
                        value={customStartDate}
                        onChange={(e) => handleCustomStartDateChange(e.target.value)}
                        className="h-12 bg-white rounded-xl border-slate-200 font-medium text-slate-900 focus-visible:ring-primary/20 cursor-pointer"
                      />
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Starts: <span className="text-slate-800 font-semibold">{formatFriendlyDate(customStartDate) || 'Select date'}</span>
                      </p>
                    </div>

                    {/* END DATE */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 hover:border-slate-300 transition-colors">
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                        Trip End Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        min={customStartDate || todayIso}
                        value={customEndDate}
                        onChange={(e) => handleCustomEndDateChange(e.target.value)}
                        className="h-12 bg-white rounded-xl border-slate-200 font-medium text-slate-900 focus-visible:ring-primary/20 cursor-pointer"
                      />
                      <p className="text-xs text-slate-500 mt-2 font-medium">
                        Ends: <span className="text-slate-800 font-semibold">{formatFriendlyDate(customEndDate) || 'Select date'}</span>
                      </p>
                    </div>
                  </div>

                  {/* DURATION PILL */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Selected Duration: <strong className="text-slate-900 font-bold">{currentDuration.days} Days / {currentDuration.nights} Nights</strong></span>
                    </div>
                    <span className="text-slate-500">
                      Standard package is {defaultDurationDays}D / {defaultNights}N
                    </span>
                  </div>
                </div>
              )}
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
                    <div className={`flex rounded-xl border bg-white overflow-hidden h-11 transition ${errors.mobileNumber ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'}`}>
                      <CountryCodeSelect
                        value={countryCode}
                        onChange={setCountryCode}
                        disabled={isProcessing}
                      />
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        value={mobileNumber}
                        maxLength={15}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          setMobileNumber(val)
                          if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: undefined }))
                        }}
                        className="border-0 shadow-none focus-visible:ring-0 rounded-none h-full flex-1 text-sm font-medium"
                      />
                    </div>
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
                <div className="flex justify-between items-start gap-3">
                  <span className="shrink-0 text-slate-500">
                    {isGroupTrip ? 'Batch' : 'Travel Dates'}
                  </span>
                  <span className="font-semibold text-slate-900 text-right">
                    {isGroupTrip
                      ? (selectedBookingOption ? selectedBookingOption.label : 'TBA')
                      : (customStartDate && customEndDate
                          ? `${formatFriendlyDate(customStartDate)} – ${formatFriendlyDate(customEndDate)}`
                          : 'Select dates')
                    }
                  </span>
                </div>

                {!isGroupTrip && (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Trip Type</span>
                    <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">
                      Customized Tour
                    </span>
                  </div>
                )}

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

              <div className="space-y-2.5">
                <Button
                  size="lg"
                  className="w-full justify-center gap-2 bg-gradient-to-r from-orange-600 via-[#ff5d09] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold h-12 rounded-2xl shadow-md shadow-orange-500/20 cursor-pointer"
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

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full justify-center gap-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-bold h-12 rounded-2xl cursor-pointer"
                  onClick={handleRequestQuote}
                  disabled={isEnquiring || isProcessing}
                >
                  {isEnquiring ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent mr-2"></span>
                      Submitting Enquiry...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={16} />
                      Request Custom Quote (No Payment)
                    </>
                  )}
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors"
                >
                  <RiWhatsappLine size={16} className="text-emerald-600" />
                  Customize on WhatsApp
                </a>
              </div>

              <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-center">
                <p className="text-[11px] text-slate-500 leading-snug">
                  ✨ Want to tweak hotels, add flights or customize activities? Click <strong>Request Custom Quote</strong> or chat directly with our planner.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* MOBILE STICKY BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden z-50 gap-2 shadow-2xl">
        <div>
          <p className="text-[10px] text-gray-500 font-medium">Total</p>
          <p className="text-base font-extrabold text-slate-900 leading-tight">
            ₹{total.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRequestQuote}
            disabled={isEnquiring || isProcessing}
            className="font-bold px-3.5 h-11 rounded-xl border-orange-400 text-orange-600 hover:bg-orange-50 text-xs shrink-0 cursor-pointer"
          >
            {isEnquiring ? 'Sending...' : 'Get Quote'}
          </Button>
          <Button
            onClick={handleProceedToPayment}
            disabled={subtotal === 0 || isProcessing}
            className="font-bold px-4 h-11 rounded-xl bg-gradient-to-r from-orange-600 to-[#ff5d09] text-white text-xs shrink-0 cursor-pointer"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>

      {/* ENQUIRY CONFIRMATION DIALOG */}
      <Dialog open={enquirySuccessOpen} onOpenChange={setEnquirySuccessOpen}>
        <DialogContent className="max-w-md p-6 bg-white rounded-3xl">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Custom Quote Request Sent!
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 leading-relaxed">
              Thank you, <strong className="text-slate-800">{fullName || 'traveler'}</strong>! We have received your query for <strong>{trip.title}</strong>
              {!isGroupTrip && customStartDate && customEndDate && (
                <> for <strong>{formatFriendlyDate(customStartDate)} – {formatFriendlyDate(customEndDate)}</strong></>
              )}.
              <br /><br />
              Our destination specialist will connect with you on <strong>{countryCode} {mobileNumber}</strong> within 30 minutes with your customized quote and tailored itinerary.
            </DialogDescription>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-sm shadow-md hover:bg-emerald-600 transition"
              >
                <RiWhatsappLine size={18} />
                Chat Now on WhatsApp
              </a>
              <Button
                variant="outline"
                className="w-full rounded-xl font-semibold"
                onClick={() => setEnquirySuccessOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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