'use client'

import { useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { contactEmail, contactPhoneDisplayInternational } from '@/lib/contact'
import { MessageCircle, Phone } from 'lucide-react'

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
      setError('Please enter your name, phone number, and email.')
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
      setName('')
      setPhone('')
      setEmail('')

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
          <DialogTitle className="sr-only">
            {isQuote ? 'Quote Requested' : 'Request Callback'}
          </DialogTitle>

          <DialogDescription className="sr-only">
            {isQuote
              ? 'Thank you for requesting a quote.'
              : 'Fill this form to request a callback from our team.'}
          </DialogDescription>

          <div className="bg-white px-6 py-12 sm:px-8 sm:py-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
            <p className="text-slate-600 mb-4">
              {isQuote
                ? 'Your quote request has been sent successfully.'
                : 'Your callback request has been sent successfully.'}
            </p>
            <p className="text-sm text-slate-500">Our team will contact you soon at {phone} or {email}</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay onClick={(e) => e.preventDefault()} />
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-xl rounded-4xl p-0 mt-[5vh] overflow-hidden"
      >
        <DialogTitle className="sr-only">
          {isQuote ? 'Request a Free Quote' : 'Request Callback'}
        </DialogTitle>

        <div className="bg-white px-6 py-6 sm:px-8 sm:py-6 relative">
          {/* Close Button */}
          <div className="absolute top-4 right-4">
            <DialogClose className="inline-flex items-center justify-center w-12 h-12 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              {/* <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> */}
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>

          <div className='relative p-0 mb-0 text-center'>
            <div className='text-2xl font-bold text-slate-900 mb-2'>
              {isQuote ? 'Get a Free Quote' : "Don't Just Dream, Travel 🔥"}
            </div>
            <p className="text-slate-600 mb-4">
              {isQuote
                ? 'Please share your details to customize your dream escape!'
                : 'Allow us to call you back!'}
            </p>
          </div>

          <div className="mt-[2vh]">
            <form onSubmit={handleSubmit} className=" space-y-4">
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
              <div>
                <label htmlFor="callback-email" className="text-sm font-semibold text-slate-700">
                  Email
                </label>
                <Input
                  id="callback-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your email"
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
                {loading ? 'Sending...' : (isQuote ? 'Get Quote' : 'Connect with an Expert')}
              </Button>
            </form>
          </div>





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
