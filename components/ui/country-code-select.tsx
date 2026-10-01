'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  ALL_COUNTRY_CODES,
  POPULAR_COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  getCountryByDialCode,
  getFlagUrl,
  CountryCode,
} from '@/lib/country-codes'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, Search, Check, X } from 'lucide-react'

export interface CountryCodeSelectProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  variant?: 'light' | 'dark' | 'outline' | 'ghost'
  id?: string
}

function FlagImage({ code, name, className = '' }: { code: string; name: string; className?: string }) {
  const [imgError, setImgError] = useState(false)
  const flagUrl = getFlagUrl(code)

  if (imgError) {
    const country = ALL_COUNTRY_CODES.find((c) => c.code === code)
    return <span className={`text-base leading-none select-none ${className}`}>{country?.flag || '🌐'}</span>
  }

  return (
    <img
      src={flagUrl}
      srcSet={`https://flagcdn.com/w80/${code.toLowerCase()}.png 2x`}
      width={22}
      height={15}
      alt={name}
      loading="lazy"
      onError={() => setImgError(true)}
      className={`rounded-xs object-cover shadow-xs border border-black/10 shrink-0 select-none ${className}`}
      style={{ width: '22px', height: '15px' }}
    />
  )
}

export function CountryCodeSelect({
  value = DEFAULT_COUNTRY_CODE,
  onChange,
  disabled = false,
  className = '',
  variant = 'light',
}: CountryCodeSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const selectedCountry = useMemo(() => getCountryByDialCode(value), [value])

  // Focus search input when popover opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
    } else {
      setSearch('')
    }
  }, [open])

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return ALL_COUNTRY_CODES

    return ALL_COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.dialCode.includes(query) ||
        c.code.toLowerCase().includes(query)
    )
  }, [search])

  const handleSelect = (country: CountryCode) => {
    onChange(country.dialCode)
    setOpen(false)
  }

  const triggerVariantStyles = {
    light: 'bg-slate-50 hover:bg-slate-100 border-r border-slate-200 text-slate-800 active:bg-slate-200',
    dark: 'bg-slate-900 hover:bg-slate-800 border-r border-slate-800 text-slate-100 active:bg-slate-700',
    outline: 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-800',
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold transition-all outline-hidden cursor-pointer select-none shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
            triggerVariantStyles[variant]
          } ${className}`}
        >
          <FlagImage code={selectedCountry.code} name={selectedCountry.name} />
          <span className="text-[11px] sm:text-xs font-bold tracking-tight">{selectedCountry.dialCode}</span>
          <ChevronDown
            size={13}
            className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180 text-orange-500' : ''}`}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className="z-[99999999] w-72 sm:w-80 p-0 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
      >
        {/* Header / Search input */}
        <div className="p-2.5 border-b border-slate-100 bg-slate-50/80">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code (e.g. +91, India)..."
              className="w-full pl-8 pr-7 py-2 text-xs font-medium bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-slate-900 placeholder:text-slate-400 shadow-2xs transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Countries List */}
        <div className="max-h-64 overflow-y-auto overflow-x-hidden p-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {/* Popular Section (Only when no active search) */}
          {!search && (
            <div className="mb-2">
              <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                Popular Destinations
              </div>
              <div className="space-y-0.5">
                {POPULAR_COUNTRY_CODES.map((country) => {
                  const isSelected = selectedCountry.dialCode === country.dialCode && selectedCountry.code === country.code
                  return (
                    <button
                      key={`pop-${country.code}-${country.dialCode}`}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer group ${
                        isSelected
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FlagImage code={country.code} name={country.name} />
                        <span className="truncate text-slate-900 group-hover:text-black">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span
                          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {country.dialCode}
                        </span>
                        {isSelected && <Check size={14} className="text-orange-600 ml-0.5" />}
                      </div>
                    </button>
                  )
                })}
              </div>
              <div className="my-1.5 border-t border-slate-100" />
            </div>
          )}

          {/* All / Filtered List */}
          <div>
            {!search && (
              <div className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                All Countries
              </div>
            )}

            {filteredCountries.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No countries found for &ldquo;{search}&rdquo;
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredCountries.map((country) => {
                  const isSelected = selectedCountry.dialCode === country.dialCode && selectedCountry.code === country.code
                  return (
                    <button
                      key={`all-${country.code}-${country.dialCode}`}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer group ${
                        isSelected
                          ? 'bg-orange-50 text-orange-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-100/80 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FlagImage code={country.code} name={country.name} />
                        <span className="truncate text-slate-900 group-hover:text-black">{country.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span
                          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${
                            isSelected
                              ? 'bg-orange-500 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {country.dialCode}
                        </span>
                        {isSelected && <Check size={14} className="text-orange-600 ml-0.5" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
