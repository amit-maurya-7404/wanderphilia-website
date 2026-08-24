'use client'

import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Phone, Mail, X, Check, Compass, Sparkles, ShieldCheck } from 'lucide-react'

interface RequestCallbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  price: number
  isQuote?: boolean
}

export function RequestCallbackDialog({ open, onOpenChange, title, price, isQuote }: RequestCallbackDialogProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in all details.')
      return
    }

    if (phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit phone number.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          title,
          price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send callback request')
      }

      setSuccess(true)

      // Auto-close dialog after 3 seconds
      setTimeout(() => {
        onOpenChange(false)
        // Reset state after transition finishes
        setTimeout(() => {
          setSuccess(false)
          setName('')
          setPhone('')
          setEmail('')
        }, 300)
      }, 3000)
    } catch (err) {
      setError('Failed to send your request. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        className="md:max-w-3xl lg:max-w-4xl p-0 overflow-hidden border-0 shadow-2xl bg-white rounded-3xl"
      >
        <DialogTitle className="sr-only">
          {isQuote ? 'Request a Free Quote' : 'Request Callback'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Fill in this form to speak to a travel expert.
        </DialogDescription>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.4fr] w-full min-h-[480px]">

          {/* LEFT PANEL - Premium Brand Banner Image (Hidden on Mobile) */}
          <div className="hidden md:flex relative flex-col justify-between p-8 text-white overflow-hidden bg-slate-900">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 hover:scale-100 transition-transform duration-10000"
              style={{ backgroundImage: "url('/images/about_hero4.jpg')" }}
            />
            {/* Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/40" />

            {/* Content Overlays */}
            <div className="relative z-10" />

            <div className="relative z-10 space-y-4 mb-2">
              <h3 className="text-2xl font-black leading-tight tracking-tight">
                Your Dream Escape is Just a Callback Away! ✈️
              </h3>

              <div className="space-y-3 pt-2">
                {[
                  { text: 'Customized bespoke itineraries tailored to you', icon: <Sparkles size={13} className="text-orange-400" /> },
                  { text: '24/7 dedicated support from trip curators', icon: <ShieldCheck size={13} className="text-orange-400" /> },
                  { text: 'Exclusive access to direct local rates & deals', icon: <Compass size={13} className="text-orange-400" /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start text-xs font-semibold text-slate-200/90 leading-relaxed">
                    <span className="p-1 bg-white/10 rounded-md shrink-0 mt-0.5">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Small Footer Text */}
            <div className="relative z-10 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              Trusted by 10k+ Travelers worldwide
            </div>
          </div>

          {/* RIGHT PANEL - Interactive Form / Success Panel */}
          <div className="relative flex flex-col justify-center bg-white min-h-[420px] overflow-hidden rounded-3xl md:rounded-l-none">

            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition duration-200 cursor-pointer">
              <X size={16} />
              <span className="sr-only">Close</span>
            </DialogClose>

            {/* Form & Content Padding Wrapper */}
            <div className="p-7 sm:p-9 md:p-10 grow flex flex-col justify-center">
              {success ? (
                /* SUCCESS STATE SCREEN */
                <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-300 space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 mb-2 shadow-sm animate-bounce">
                    <Check size={26} strokeWidth={3} />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Request Received!</h4>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Hi <span className="font-bold text-slate-900 capitalize">{name || 'there'}</span>, your request has been successfully registered.
                  </p>
                  <div className="p-3 bg-orange-50/50 border border-orange-100/50 rounded-2xl max-w-xs mx-auto text-xs text-orange-800 font-semibold leading-relaxed">
                    📞 An expert travel designer will call you back within 30 minutes!
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase pt-2">
                    Window will close automatically
                  </p>
                </div>
              ) : (
                /* FORM INTERFACE */
                <div className="animate-in fade-in duration-300">
                  <div className="mb-6">
                    <div className="flex justify-center mb-5">
                      <img
                        src="/images/Made_LOGO.png"
                        alt="Wanderphilia Logo"
                        className="h-20 w-auto object-contain"
                      />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                      {isQuote ? 'Get a Free Quote' : "Don't Just Dream, Travel! 🔥"}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {isQuote
                        ? 'Share your requirements and our designers will customize a bespoke itinerary for you.'
                        : 'Leave your mobile number and email. Our experts will call you to plan your holiday.'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4.5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="callback-name" className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        Full Name
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                          <User size={15} />
                        </span>
                        <Input
                          id="callback-name"
                          type="text"
                          required
                          disabled={loading}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="pl-10.5 py-5 w-full rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs font-semibold placeholder:text-slate-400/80 transition"
                        />
                      </div>
                    </div>

                    {/* Phone Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="callback-phone" className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        Phone Number
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                          <Phone size={15} />
                        </span>
                        <Input
                          id="callback-phone"
                          type="tel"
                          required
                          disabled={loading}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/[^\d+-\s]/g, ''))}
                          placeholder="Enter your phone number"
                          className="pl-10.5 py-5 w-full rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs font-semibold placeholder:text-slate-400/80 transition"
                        />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="callback-email" className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                        Email Address
                      </label>
                      <div className="relative group">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                          <Mail size={15} />
                        </span>
                        <Input
                          id="callback-email"
                          type="email"
                          required
                          disabled={loading}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="pl-10.5 py-5 w-full rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-xs font-semibold placeholder:text-slate-400/80 transition"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2 animate-in slide-in-from-top-1">
                        ⚠️ {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-extrabold text-sm py-5 rounded-xl shadow-lg shadow-orange-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending Request...
                        </span>
                      ) : (
                        isQuote ? 'Get My Free Quote ↗' : 'Connect with Travel Expert ↗'
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
