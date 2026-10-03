'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2,
  CreditCard,
  Sparkles,
  ArrowRight,
  FileCheck
} from 'lucide-react';
import { ItineraryBookModal } from './itinerary-book-modal';

interface ItineraryPaymentSectionProps {
  itineraryId?: string;
  destination?: string;
  totalQuotationAmount?: number;
  leadName?: string;
  email?: string;
  mobile?: string;
  zohoLeadId?: string;
  inquiryId?: string;
  numDays?: number;
  numNights?: number;
  travelStartDate?: string;
  travelEndDate?: string;
}

export function ItineraryPaymentSection({
  itineraryId = '',
  destination = '',
  totalQuotationAmount = 0,
  leadName = '',
  email = '',
  mobile = '',
  zohoLeadId,
  inquiryId,
  numDays,
  numNights,
  travelStartDate,
  travelEndDate,
}: ItineraryPaymentSectionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const advanceAmount = Math.round(totalQuotationAmount * 0.5);

  return (
    <div className="space-y-6">
      
      {/* 1. PRIMARY ONLINE BOOKING CARD (RAZORPAY - 2 PAYMENT TYPES) */}
      {totalQuotationAmount > 0 && (
        <div className="bg-gradient-to-br from-[#6E1E14] via-[#5C1810] to-[#3D0F0A] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-amber-500/40 relative overflow-hidden space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                  RECOMMENDED • INSTANT CONFIRMATION
                </span>
                <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Pay Online via Razorpay Gateway
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> Instant Tax Invoice Generated
              </span>
            </div>
          </div>

          {/* 2 Payment Options Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* OPTION A: 50% Advance */}
            <div 
              onClick={() => setBookModalOpen(true)}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Option 1
                </span>
                <span className="text-xs text-amber-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <div className="text-xs font-black text-white/90 uppercase tracking-wide">
                  Pay Advance / Booking Amount (50%)
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 pt-0.5">
                  ₹{advanceAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-stone-300/90 leading-tight">
                Instantly locks in luxury resort & private chauffeur. Balance ₹{advanceAmount.toLocaleString('en-IN')} due 15 days before departure.
              </p>
            </div>

            {/* OPTION B: 100% Full Payment */}
            <div 
              onClick={() => setBookModalOpen(true)}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="bg-emerald-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Option 2
                </span>
                <span className="text-xs text-emerald-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <div className="text-xs font-black text-white/90 uppercase tracking-wide">
                  Pay Full Tour Package (100%)
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white pt-0.5">
                  ₹{totalQuotationAmount.toLocaleString('en-IN')}
                </div>
              </div>
              <p className="text-[11px] text-stone-300/90 leading-tight">
                100% cleared tour confirmation with zero pending balance and full tax invoice issued immediately.
              </p>
            </div>

          </div>

          {/* Direct Trigger Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => setBookModalOpen(true)}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-black px-7 py-3.5 rounded-xl shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4" />
              <span>Book & Pay Online (Razorpay)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-white/80 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>UPI (GPay, PhonePe, Paytm), All Cards, Netbanking & Wallets</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. DIRECT BANK ACCOUNT & UPI ALTERNATIVE OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* OPTION 1: Direct Bank Account Transfer */}
        <div className="bg-white rounded-2xl border-2 border-[#6E1E14]/30 overflow-hidden shadow-md flex flex-col justify-between">
          <div className="bg-gradient-to-r from-[#5C1810] to-[#7E2419] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">ACCOUNT TRANSFER</span>
                <h4 className="text-sm font-black tracking-tight">Direct Bank Transfer (NEFT / RTGS / IMPS)</h4>
              </div>
            </div>
            <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded text-white/90">IDFC FIRST</span>
          </div>

          <div className="p-5 space-y-3.5 text-xs font-semibold text-stone-800">
            {/* Account Name */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Name</span>
              <span className="text-xs sm:text-sm font-black text-stone-900">
                WANDERPHILIA EXPERIENCES PRIVATE LIMITED
              </span>
            </div>

            {/* Account Number with Copy */}
            <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Account number</span>
                <span className="text-sm sm:text-base font-mono font-black text-[#5C1810]">
                  10280294798
                </span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard('10280294798', 'acc')}
                className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 shadow-2xs transition active:scale-95 cursor-pointer print:hidden"
                title="Copy Account Number"
              >
                {copiedField === 'acc' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-stone-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* IFSC & SWIFT Code with Copy */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">IFSC</span>
                  <span className="text-xs sm:text-sm font-mono font-black text-stone-900">
                    IDFB0040505
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard('IDFB0040505', 'ifsc')}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 transition cursor-pointer print:hidden"
                  title="Copy IFSC"
                >
                  {copiedField === 'ifsc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-stone-500" />}
                </button>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">SWIFT code</span>
                <span className="text-xs sm:text-sm font-mono font-black text-stone-900">
                  IDFBINBBMUM
                </span>
              </div>
            </div>

            {/* Bank Name & Branch */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Bank name</span>
                <span className="font-bold text-stone-900">IDFC FIRST</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Branch</span>
                <span className="font-bold text-stone-900">MUMBAI - FORT BRANCH</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 px-5 py-2.5 border-t border-stone-100 text-[10px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Verified Corporate Current Account</span>
          </div>
        </div>

        {/* OPTION 2: Instant UPI Payment */}
        <div className="bg-white rounded-2xl border-2 border-emerald-700/30 overflow-hidden shadow-md flex flex-col justify-between">
          <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <QrCode className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">BY UPI</span>
                <h4 className="text-sm font-black tracking-tight">Instant UPI Transfer</h4>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-900/50 font-bold px-2 py-0.5 rounded text-emerald-200">Instant</span>
          </div>

          <div className="p-5 space-y-4 text-xs font-semibold text-stone-800 flex-1 flex flex-col justify-center">
            
            {/* UPI ID Box with Copy */}
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Official UPI VPA ID
              </span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm sm:text-base font-mono font-black text-emerald-950 break-all select-all">
                  wanderphiliaexperien@idfcbank
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('wanderphiliaexperien@idfcbank', 'upi')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 shrink-0 cursor-pointer print:hidden"
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Helper */}
            <div className="space-y-1.5 text-[11px] text-stone-600">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Open any UPI app (GPay, PhonePe, Paytm, BHIM).</span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Select &apos;Pay to UPI ID&apos; and enter <b>wanderphiliaexperien@idfcbank</b></span>
              </p>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verify receiver name is <b>WANDERPHILIA EXPERIENCES</b>.</span>
              </p>
            </div>

          </div>

          <div className="bg-emerald-50/40 px-5 py-2.5 border-t border-emerald-100 text-[10px] text-emerald-800 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>100% Encrypted & Bank Secure</span>
            </span>
            <span className="font-bold">Zero Transaction Surcharge</span>
          </div>
        </div>

      </div>

      {/* Booking & Online Payment Modal */}
      {totalQuotationAmount > 0 && (
        <ItineraryBookModal
          open={bookModalOpen}
          onOpenChange={setBookModalOpen}
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
      )}

    </div>
  );
}
