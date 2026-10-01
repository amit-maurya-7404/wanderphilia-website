'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phone, Mail, CheckCircle } from 'lucide-react'
import { Parachute } from '@/components/parachute-icon'
import { CountryCodeSelect } from '@/components/ui/country-code-select'
import { DEFAULT_COUNTRY_CODE } from '@/lib/country-codes'

interface NoPackagesCallbackFormProps {
  nights: number | null
  destinationName: string
}

export function NoPackagesCallbackForm({ nights, destinationName }: NoPackagesCallbackFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim() || !email.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          countryCode,
          email,
          title: `Custom Request: ${nights ? `${nights} Nights` : 'Custom Duration'} in ${destinationName}`,
          price: 0,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send callback request')
      }

      setSuccess(true)
      setName('')
      setPhone('')
      setEmail('')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again or chat with us.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-xl mx-auto bg-emerald-50/50 border border-emerald-200 rounded-3xl p-8 text-center shadow-xs">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-4">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Request Received!</h3>
        <p className="text-slate-600 mb-4">
          Thank you! Our travel expert will contact you soon to customize your {nights ? `${nights} nights` : ''} trip to {destinationName}.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-orange-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
      {/* Decorative top gradient bar */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 to-[#ff6e0b]" />

      <div className="flex items-center gap-2 mb-3">
        <span className="p-1 rounded-md bg-orange-50 text-[#ff6e0b]">
          <Parachute size={16} />
        </span>
        <span className="text-xs font-black uppercase tracking-widest text-[#ff6e0b]">
          Custom Holiday
        </span>
      </div>

      <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mb-2">
        Looking for a {nights ? `${nights} Nights` : ''} Plan in {destinationName}?
      </h3>
      <p className="text-xs md:text-sm text-gray-500 mb-6 leading-relaxed">
        We don't have a ready-made package for this specific duration right now, but we specialize in custom-tailoring itineraries! Fill in your details below and a travel expert will customize your package free of cost.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label htmlFor="custom-name" className="text-[10px] md:text-xs font-bold text-gray-500 mb-1.5">
              Full Name
            </label>
            <Input
              id="custom-name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="rounded-xl border-gray-200 focus:border-[#ff6e0b] focus:ring-1 focus:ring-[#ff6e0b]"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="custom-phone" className="text-[10px] md:text-xs font-bold text-gray-500 mb-1.5">
              Phone Number
            </label>
            <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-[#ff6e0b] focus-within:ring-1 focus-within:ring-[#ff6e0b] transition">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
                disabled={loading}
              />
              <Input
                id="custom-phone"
                type="tel"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={loading}
                className="border-0 shadow-none focus-visible:ring-0 rounded-none flex-1 text-xs md:text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="custom-email" className="text-[10px] md:text-xs font-bold text-gray-500 mb-1.5">
              Email Address
            </label>
            <Input
              id="custom-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="rounded-xl border-gray-200 focus:border-[#ff6e0b] focus:ring-1 focus:ring-[#ff6e0b]"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Phone size={13} />
              <span>+91 92176 64099</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail size={13} />
              <span>contact@wanderphilia.com</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-[#ff6e0b] hover:bg-[#e05f00] text-white font-bold px-6 py-3 rounded-full transition-all cursor-pointer shadow-xs"
          >
            {loading ? 'Sending...' : 'Get Custom Itinerary'}
          </Button>
        </div>
      </form>
    </div>
  )
}
