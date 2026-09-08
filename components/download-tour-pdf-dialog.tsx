'use client'

import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X, Calendar, Phone, FileText, CheckCircle2, User } from 'lucide-react'

interface DownloadTourPdfDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip: any
  onDownload: (options?: { selectedMonth?: string; dateRange?: { from: string; to: string } }) => Promise<void>
}

export function DownloadTourPdfDialog({
  open,
  onOpenChange,
  trip,
  onDownload,
}: DownloadTourPdfDialogProps) {
  const [pdfType, setPdfType] = useState<'predefined' | 'customize'>('predefined')
  const [name, setName] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [phone, setPhone] = useState('')
  const [errors, setErrors] = useState<{ name?: string; month?: string; dateRange?: string; phone?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Generate dynamic upcoming 10 months list for pre-defined option
  const monthOptions = useMemo(() => {
    const list: string[] = []
    const now = new Date()
    for (let i = 0; i < 10; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const monthName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
      list.push(monthName)
    }
    return list
  }, [])

  const handleClose = () => {
    setErrors({})
    setIsSubmitting(false)
    setIsSuccess(false)
    onOpenChange(false)
  }

  const validate = () => {
    const newErrors: { name?: string; month?: string; dateRange?: string; phone?: string } = {}

    // 1. Name validation (Required)
    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = 'Please enter your full name'
    }

    // 2. Phone validation (Required)
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number'
    }

    // 3. Pre Defined validation
    if (pdfType === 'predefined') {
      if (!selectedMonth) {
        newErrors.month = 'Please select a PDF / month'
      }
    }

    // 4. Customize validation
    if (pdfType === 'customize') {
      if (!fromDate || !toDate) {
        newErrors.dateRange = 'Please select travel start and end dates'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    try {
      const cleanPhone = phone.trim().replace(/\D/g, '')
      // 1. Send complete traveler lead details directly to Zoho CRM and email via callback API
      const payload = {
        name: name.trim(),
        phone: cleanPhone,
        email: `${cleanPhone}@wanderphilia.com`,
        tripTitle: trip?.title || 'Trip Package',
        tripSlug: trip?.slug || '',
        price: trip?.price,
        destination: trip?.destination || '',
        startDate: pdfType === 'predefined' ? selectedMonth : fromDate,
        endDate: pdfType === 'customize' ? toDate : undefined,
        source: `PDF Download (${pdfType === 'predefined' ? `Pre Defined: ${selectedMonth}` : `Customize: ${fromDate} to ${toDate}`})`,
        message: `Itinerary PDF Download Request.\nTraveler Name: ${name.trim()}\nMobile: ${cleanPhone}\nType: ${pdfType === 'predefined' ? `Pre Defined Month (${selectedMonth})` : `Customize Travel Dates (${fromDate} to ${toDate})`}`,
      }

      fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(err => console.error('Error logging PDF download lead to Zoho CRM:', err))

      // 2. Trigger the PDF generation
      await onDownload({
        selectedMonth: pdfType === 'predefined' ? selectedMonth : undefined,
        dateRange: pdfType === 'customize' && fromDate && toDate ? { from: fromDate, to: toDate } : undefined,
      })

      setIsSuccess(true)
      setTimeout(() => {
        handleClose()
      }, 1800)
    } catch (err) {
      console.error('PDF Download failed:', err)
      setErrors(prev => ({ ...prev, phone: 'Failed to download PDF. Please try again.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {open && (
        <style>{`
          nav,
          header {
            display: none !important;
          }
        `}</style>
      )}
      <DialogContent
        showCloseButton={false}
        className="w-[92vw] max-w-md p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
      >
        <DialogTitle className="sr-only">Download Tour PDF</DialogTitle>
        <DialogDescription className="sr-only">
          Fill in your name and phone number to download the itinerary PDF.
        </DialogDescription>

        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-orange-100/70 text-[#ff5d09]">
              <FileText size={16} />
            </div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
              Download Tour PDF
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-5 sm:p-6 space-y-4">
          {isSuccess ? (
            <div className="py-6 text-center space-y-2 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={28} />
              </div>
              <h4 className="font-bold text-slate-900 text-base">PDF Download Started!</h4>
              <p className="text-xs text-slate-500">
                Hi {name.trim()}, your itinerary PDF is downloading to your device.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. SELECT PDF TYPE (RADIO OPTIONS) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select PDF Type:
                </label>
                <div className="flex items-center gap-5 pt-0.5">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="pdfType"
                      value="predefined"
                      checked={pdfType === 'predefined'}
                      onChange={() => {
                        setPdfType('predefined')
                        setErrors({})
                      }}
                      className="w-4 h-4 text-[#ff5d09] border-slate-300 focus:ring-[#ff5d09] cursor-pointer accent-[#ff5d09]"
                    />
                    <span>Pre Defined</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-800 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="pdfType"
                      value="customize"
                      checked={pdfType === 'customize'}
                      onChange={() => {
                        setPdfType('customize')
                        setErrors({})
                      }}
                      className="w-4 h-4 text-[#ff5d09] border-slate-300 focus:ring-[#ff5d09] cursor-pointer accent-[#ff5d09]"
                    />
                    <span>Customize</span>
                  </label>
                </div>
              </div>

              {/* 2A. PRE-DEFINED: SELECT A MONTH */}
              {pdfType === 'predefined' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Select a month:
                  </label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => {
                      setSelectedMonth(e.target.value)
                      if (errors.month) setErrors(prev => ({ ...prev, month: undefined }))
                    }}
                    className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm bg-white font-medium transition-all focus:outline-none cursor-pointer ${
                      errors.month
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200 text-rose-800'
                        : 'border-slate-300 focus:border-[#ff5d09] focus:ring-1 focus:ring-[#ff5d09]/20 text-slate-800'
                    }`}
                  >
                    <option value="">-- Choose a PDF / Month --</option>
                    {monthOptions.map((m, idx) => (
                      <option key={idx} value={m}>
                        {m} Departures
                      </option>
                    ))}
                  </select>
                  {errors.month && (
                    <p className="text-[11px] font-medium text-rose-500 pt-0.5">
                      {errors.month}
                    </p>
                  )}
                </div>
              )}

              {/* 2B. CUSTOMIZE: DATE RANGE */}
              {pdfType === 'customize' && (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Select Date Range:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block pb-0.5">From Date:</span>
                        <input
                          type="date"
                          value={fromDate}
                          onChange={(e) => {
                            setFromDate(e.target.value)
                            if (errors.dateRange) setErrors(prev => ({ ...prev, dateRange: undefined }))
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white text-slate-800 focus:outline-none transition-all ${
                            errors.dateRange
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                              : 'border-slate-300 focus:border-[#ff5d09] focus:ring-1 focus:ring-[#ff5d09]/20'
                          }`}
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block pb-0.5">To Date:</span>
                        <input
                          type="date"
                          value={toDate}
                          min={fromDate || undefined}
                          onChange={(e) => {
                            setToDate(e.target.value)
                            if (errors.dateRange) setErrors(prev => ({ ...prev, dateRange: undefined }))
                          }}
                          className={`w-full px-2.5 py-1.5 rounded-lg border text-xs bg-white text-slate-800 focus:outline-none transition-all ${
                            errors.dateRange
                              ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                              : 'border-slate-300 focus:border-[#ff5d09] focus:ring-1 focus:ring-[#ff5d09]/20'
                          }`}
                        />
                      </div>
                    </div>
                    {errors.dateRange && (
                      <p className="text-[11px] font-medium text-rose-500 pt-0.5">
                        {errors.dateRange}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 3. FULL NAME (REQUIRED) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Full Name <span className="text-rose-500">*</span></span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    placeholder="Enter your full name"
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                    }}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs sm:text-sm bg-white text-slate-800 transition-all focus:outline-none ${
                      errors.name
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#ff5d09] focus:ring-1 focus:ring-[#ff5d09]/20'
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[11px] font-medium text-rose-500 pt-0.5">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* 4. MOBILE NUMBER (REQUIRED) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Mobile Number <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">10-digit number</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone size={14} />
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    maxLength={13}
                    placeholder="Enter your mobile number"
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^\d+]/g, ''))
                      if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
                    }}
                    className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs sm:text-sm bg-white text-slate-800 transition-all focus:outline-none ${
                      errors.phone
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                        : 'border-slate-300 focus:border-[#ff5d09] focus:ring-1 focus:ring-[#ff5d09]/20'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] font-medium text-rose-500 pt-0.5">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* 5. DOWNLOAD PDF BUTTON */}
              <div className="pt-2 space-y-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 sm:py-3 rounded-lg bg-[#ff5d09] hover:bg-[#e04f05] text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Preparing Your PDF...</span>
                    </>
                  ) : (
                    <span>Download PDF</span>
                  )}
                </button>

                {/* 6. CLOSE BUTTON AT BOTTOM RIGHT */}
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-1 rounded-full border border-rose-200 hover:border-rose-300 text-rose-500 hover:bg-rose-50 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
