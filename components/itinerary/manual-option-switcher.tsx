'use client';

import React, { useState } from 'react';
import { ManualItineraryOption } from '@/types/manual-itinerary';
import { Sparkles, CheckCircle, Copy, Check, Share2, ArrowRight } from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900']
});

interface ManualOptionSwitcherProps {
  options: ManualItineraryOption[];
  selectedOptionId: string;
  onSelectOption: (optionId: string) => void;
  itinerarySlug: string;
}

export function ManualOptionSwitcher({
  options,
  selectedOptionId,
  onSelectOption,
  itinerarySlug
}: ManualOptionSwitcherProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!options || options.length <= 1) return null;

  const handleCopyOptionLink = (e: React.MouseEvent, opt: ManualItineraryOption, index: number) => {
    e.stopPropagation();
    const optParam = opt.id || `opt-${index + 1}`;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${baseUrl}/itinerary/${itinerarySlug}?opt=${encodeURIComponent(optParam)}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedId(opt.id);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-[#3B0E09] to-[#6E1E14] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl border-2 border-amber-400/40 space-y-4 my-6 print:hidden">
      {/* HEADER WITH BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Multi-Quotation Options Available</span>
          </div>
          <h3 className={`${playfair.className} text-xl sm:text-2xl font-black text-white`}>
            Select Your Preferred Package Option
          </h3>
        </div>
        <p className="text-stone-300 text-xs sm:text-sm font-medium">
          Click any option below to compare hotels, pricing & inclusions in real time
        </p>
      </div>

      {/* OPTIONS GRID */}
      <div className={`grid grid-cols-1 ${options.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-3 sm:gap-4 pt-1`}>
        {options.map((opt, idx) => {
          const isSelected = opt.id === selectedOptionId;
          const displayPrice = opt.perAdultPrice
            ? `₹${opt.perAdultPrice.toLocaleString('en-IN')}/- per adult`
            : (opt.finalQuotationAmount ? `₹${opt.finalQuotationAmount.toLocaleString('en-IN')}/- total` : 'Custom Quote');

          return (
            <div
              key={opt.id || idx}
              onClick={() => onSelectOption(opt.id)}
              className={`relative rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-white text-stone-900 shadow-2xl border-3 border-amber-400 scale-[1.01] sm:scale-102 ring-4 ring-amber-400/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-amber-300/60'
              }`}
            >
              {/* TOP ROW: BADGE & SELECTION INDICATOR */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                      isSelected
                        ? 'bg-[#6E1E14] text-white'
                        : 'bg-amber-400 text-stone-950 font-extrabold'
                    }`}
                  >
                    {opt.badge || `Option ${idx + 1}`}
                  </span>
                  {opt.isDefault && !opt.badge && (
                    <span className="text-[9px] font-bold bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded">
                      Standard
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* DIRECT SHARE LINK BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyOptionLink(e, opt, idx)}
                    title="Copy direct link for this option"
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        : 'bg-white/15 hover:bg-white/25 text-white'
                    }`}
                  >
                    {copiedId === opt.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] text-emerald-600 font-bold hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] hidden sm:inline">Share</span>
                      </>
                    )}
                  </button>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-white/40 text-transparent'
                    }`}
                  >
                    <CheckCircle className={`w-4 h-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                </div>
              </div>

              {/* OPTION TITLE & SUBTITLE */}
              <div className="space-y-1 min-w-0">
                <h4 className={`text-base sm:text-lg font-black leading-tight ${isSelected ? 'text-stone-900' : 'text-white'}`}>
                  {opt.title}
                </h4>
                {opt.subtitle && (
                  <p className={`text-xs font-medium line-clamp-2 leading-snug ${isSelected ? 'text-stone-600' : 'text-stone-300'}`}>
                    {opt.subtitle}
                  </p>
                )}
              </div>

              {/* HOTEL PROPERTY SNIPPETS */}
              {opt.accommodations && opt.accommodations.length > 0 && (
                <div className={`p-2 rounded-xl text-[11px] font-semibold space-y-1 ${
                  isSelected ? 'bg-amber-50/80 text-amber-950 border border-amber-200/80' : 'bg-black/20 text-stone-200 border border-white/10'
                }`}>
                  <div className="text-[9px] uppercase font-bold tracking-wider opacity-80">
                    Featured Properties:
                  </div>
                  <div className="truncate">
                    {opt.accommodations.map(a => `${a.hotelName || 'Deluxe Hotel'} (${a.city})`).join(' • ')}
                  </div>
                </div>
              )}

              {/* PRICE PILL & ACTION FOOTER */}
              <div className={`pt-2.5 border-t flex items-center justify-between gap-2 ${
                isSelected ? 'border-stone-200' : 'border-white/15'
              }`}>
                <div>
                  <span className={`text-[9px] uppercase font-bold tracking-wider block ${
                    isSelected ? 'text-stone-600' : 'text-amber-300'
                  }`}>
                    Investment
                  </span>
                  <span className={`text-base sm:text-lg font-black block leading-none ${
                    isSelected ? 'text-[#6E1E14]' : 'text-white'
                  }`}>
                    {displayPrice}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white/15 text-white group-hover:bg-white/25'
                  }`}
                >
                  <span>{isSelected ? 'Selected' : 'View Plan'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
