'use client';

import React, { useState } from 'react';
import { CreditCard, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { ItineraryBookModal } from './itinerary-book-modal';

interface ItineraryQuotationBookButtonProps {
  itineraryId: string;
  destination: string;
  totalQuotationAmount: number;
  leadName?: string;
  email?: string;
  mobile?: string;
  zohoLeadId?: string;
  inquiryId?: string;
  numDays?: number;
  numNights?: number;
  travelStartDate?: string;
  travelEndDate?: string;
  variant?: 'primary' | 'card' | 'floating';
}

export function ItineraryQuotationBookButton({
  itineraryId,
  destination,
  totalQuotationAmount,
  leadName = '',
  email = '',
  mobile = '',
  zohoLeadId,
  inquiryId,
  numDays,
  numNights,
  travelStartDate,
  travelEndDate,
  variant = 'primary',
}: ItineraryQuotationBookButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!totalQuotationAmount || totalQuotationAmount <= 0) {
    return null;
  }

  const advanceAmount = Math.round(totalQuotationAmount * 0.5);

  return (
    <>
      {variant === 'card' ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 print:hidden">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                Instant Confirmation
              </span>
              <span className="text-xs font-bold text-amber-200/90">
                2 Easy Payment Options
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 font-medium">
              Pay <b>50% Advance (₹{advanceAmount.toLocaleString('en-IN')})</b> or <b>Full Amount (₹{totalQuotationAmount.toLocaleString('en-IN')})</b> online via Razorpay.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            type="button"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 text-stone-950" />
            <span>Book & Pay Online</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : variant === 'floating' ? (
        /* Floating Sticky Bottom Bar for Mobile & Quick Actions */
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto bg-stone-950/90 backdrop-blur-lg border border-amber-500/30 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 print:hidden animate-fade-in">
          <div className="space-y-0.5 pl-1">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider block">
              Quotation Total
            </span>
            <div className="text-base sm:text-lg font-black text-white leading-none">
              ₹{totalQuotationAmount.toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 text-stone-950" />
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          type="button"
          className="inline-flex items-center gap-2 bg-[#6E1E14] hover:bg-[#5C1810] text-white text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider print:hidden"
        >
          <CreditCard className="w-4 h-4 text-amber-300" />
          <span>Book Now & Pay Online</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      <ItineraryBookModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itineraryId={itineraryId}
        destination={destination}
        totalQuotationAmount={totalQuotationAmount}
        initialLeadName={leadName}
        initialEmail={email}
        initialPhone={mobile}
        zohoLeadId={zohoLeadId}
        inquiryId={inquiryId}
        numDays={numDays}
        numNights={numNights}
        travelStartDate={travelStartDate}
        travelEndDate={travelEndDate}
      />
    </>
  );
}
