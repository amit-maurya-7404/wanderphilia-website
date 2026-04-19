'use client'

import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contactEmail, contactPhoneDisplayInternational } from '@/lib/contact'
import { MessageCircle, Phone } from 'lucide-react'

interface RequestCallbackDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  price: number
}

export function RequestCallbackDialog({ open, onOpenChange, title, price }: RequestCallbackDialogProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !phone.trim()) {
      setError('Please enter your name and phone number.')
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
          title,
          price,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send callback request')
      }

      setSuccess(true)
      setName('')
      setPhone('')

      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError('Failed to send your request. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="max-w-xl rounded-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Callback Request Success</DialogTitle>
          {/* <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white flex items-center justify-between gap-4">
            {/* <div>
              <p className="text-sm uppercase tracking-[0.3em] font-semibold">Summer Holiday Sale is LIVE</p>
              <p className="mt-1 text-xs text-white/90">Ends in 1d : 3h : 10m</p>
            </div> 
            <DialogClose className="text-white opacity-80 hover:opacity-100">
              <span className="sr-only">Close</span>
              ✕
            </DialogClose>
          </div> */}

          <div className="bg-white px-6 py-12 sm:px-8 sm:py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600 mb-4">Your callback request has been sent successfully.</p>
            <p className="text-sm text-slate-500">Our team will contact you soon at {phone}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-xl rounded-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Request Callback</DialogTitle>
        {/* <div className="bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-4 text-white flex items-center justify-between gap-4">
          {/* <div>
            <p className="text-sm uppercase tracking-[0.3em] font-semibold">Summer Holiday Sale is LIVE</p>
            <p className="mt-1 text-xs text-white/90">Ends in 1d : 3h : 10m</p>
          </div> 
          <DialogClose className="text-white opacity-80 hover:opacity-100">
            <span className="sr-only">Close</span>
            ✕
          </DialogClose>
        </div> */}
        

        <div className="bg-white px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">INR {price.toLocaleString('en-IN')}</span>
                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-semibold">
                  Save INR {Math.round(price * 0.3).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="callback-name" className="text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <Input
                id="callback-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
                disabled={loading}
                className="mt-2"
              />
            </div>
            <div>
              <label htmlFor="callback-phone" className="text-sm font-semibold text-slate-700">
                Phone Number
              </label>
              <Input
                id="callback-phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="9217664099"
                required
                disabled={loading}
                className="mt-2"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary px-5 py-4 text-base font-semibold text-white disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Connect with an Expert'}
            </Button>
          </form>

          {/* <div className="mt-6 rounded-3xl bg-slate-950/5 border border-slate-200 p-4 text-sm text-slate-600">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={16} />
              <span>Call us on {contactPhoneDisplayInternational}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>Email: {contactEmail}</span>
            </div>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
