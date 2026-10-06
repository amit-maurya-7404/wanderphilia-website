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
  FileCheck,
  CheckCheck,
  Clock,
  Download
} from 'lucide-react';
import { ItineraryBookModal, ItineraryPaymentType } from './itinerary-book-modal';
import { ItineraryPaymentRecord } from '@/types/itinerary';

interface ItineraryPaymentSectionProps {
  itineraryId?: string;
  destination?: string;
  totalQuotationAmount?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  payments?: ItineraryPaymentRecord[];
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
  advanceAmountPaid = 0,
  balancePendingAmount,
  payments = [],
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
  const [selectedPaymentType, setSelectedPaymentType] = useState<ItineraryPaymentType>('token');

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const alreadyPaid = Number(advanceAmountPaid || 0);
  const tenPercentAmount = Math.round(totalQuotationAmount * 0.1);
  const fiftyPercentAmount = Math.round(totalQuotationAmount * 0.5);
  const remainingAdvanceAmount = Math.max(0, fiftyPercentAmount - alreadyPaid);
  const remainingBalanceAmount = Math.max(0, totalQuotationAmount - alreadyPaid);

  const isFullyPaid = alreadyPaid >= totalQuotationAmount && totalQuotationAmount > 0;
  const isAdvancePaid = alreadyPaid >= fiftyPercentAmount && !isFullyPaid;
  const isTokenPaid = alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount;

  const openCheckout = (type: ItineraryPaymentType) => {
    setSelectedPaymentType(type);
    setBookModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. PRIMARY ONLINE BOOKING CARD (RAZORPAY - MULTI-STAGE INSTALLMENTS) */}
      {totalQuotationAmount > 0 && (
        <div className="bg-gradient-to-br from-[#6E1E14] via-[#5C1810] to-[#3D0F0A] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-amber-500/40 relative overflow-hidden space-y-6">
          
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-black shadow-md">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                  OFFICIAL ONLINE PAYMENT GATEWAY
                </span>
                <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Pay Online via Razorpay
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> Instant Tax Invoice Generated
              </span>
            </div>
          </div>

          {/* 3-Stage Progress Timeline */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
              <div className="flex items-center gap-2">
                <span className="text-stone-300">Total Quotation:</span>
                <span className="font-black text-white text-sm">₹{totalQuotationAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">
                  Paid: <b>₹{alreadyPaid.toLocaleString('en-IN')}</b>
                </span>
                <span className="text-amber-300">
                  Pending: <b>₹{remainingBalanceAmount.toLocaleString('en-IN')}</b>
                </span>
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-bold">
              
              {/* Step 1: 10% Token */}
              <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                alreadyPaid >= tenPercentAmount
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-stone-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-black">Step 1</span>
                  {alreadyPaid >= tenPercentAmount ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <div className="pt-1 font-black text-xs text-white">
                  10% Token (₹{tenPercentAmount.toLocaleString('en-IN')})
                </div>
                <div className="text-[9px] text-stone-400">
                  {alreadyPaid >= tenPercentAmount ? '✓ Token Paid' : 'Booking Token'}
                </div>
              </div>

              {/* Step 2: 50% Advance */}
              <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                alreadyPaid >= fiftyPercentAmount
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : (isTokenPaid ? 'bg-amber-950/50 border-amber-500/60 text-amber-200' : 'bg-white/5 border-white/10 text-stone-300')
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-black">Step 2</span>
                  {alreadyPaid >= fiftyPercentAmount ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <div className="pt-1 font-black text-xs text-white">
                  50% Advance (₹{fiftyPercentAmount.toLocaleString('en-IN')})
                </div>
                <div className="text-[9px] text-stone-400">
                  {alreadyPaid >= fiftyPercentAmount ? '✓ Advance Paid' : 'Lock Resorts & Cab'}
                </div>
              </div>

              {/* Step 3: Full Payment */}
              <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                isFullyPaid
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-stone-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase font-black">Step 3</span>
                  {isFullyPaid ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                  )}
                </div>
                <div className="pt-1 font-black text-xs text-white">
                  Full Cleared (100%)
                </div>
                <div className="text-[9px] text-stone-400">
                  {isFullyPaid ? '✓ 100% Cleared' : '15 Days Before Trip'}
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC PAYMENT CARDS BASED ON CURRENT STATUS */}

          {/* CASE A: 0% PAID (FRESH PROPOSAL) -> 3 OPTIONS */}
          {alreadyPaid <= 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Option 1: 10% Token Amount */}
              <div 
                onClick={() => openCheckout('token')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Option 1
                  </span>
                  <span className="text-xs text-amber-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Select <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/90 uppercase tracking-wide">
                    Pay 10% Token Amount
                  </div>
                  <div className="text-2xl font-black text-amber-300 pt-0.5">
                    ₹{tenPercentAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-stone-300/90 leading-tight">
                  Instantly locks your booking inquiry and proposal. Remaining advance payable next.
                </p>
              </div>

              {/* Option 2: 50% Advance Amount */}
              <div 
                onClick={() => openCheckout('advance')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Recommended
                  </span>
                  <span className="text-xs text-amber-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Select <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/90 uppercase tracking-wide">
                    Pay 50% Advance Booking
                  </div>
                  <div className="text-2xl font-black text-amber-300 pt-0.5">
                    ₹{fiftyPercentAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-stone-300/90 leading-tight">
                  Locks in luxury resort & private chauffeur. Balance ₹{fiftyPercentAmount.toLocaleString('en-IN')} due 15 days before departure.
                </p>
              </div>

              {/* Option 3: 100% Full Payment */}
              <div 
                onClick={() => openCheckout('full')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    100% Cleared
                  </span>
                  <span className="text-xs text-emerald-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Select <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/90 uppercase tracking-wide">
                    Pay Full Package (100%)
                  </div>
                  <div className="text-2xl font-black text-white pt-0.5">
                    ₹{totalQuotationAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-stone-300/90 leading-tight">
                  Zero pending balance with full tax invoice issued immediately.
                </p>
              </div>

            </div>
          )}

          {/* CASE B: 10% TOKEN PAID -> SHOW REMAINING ADVANCE (40%) & REMAINING BALANCE (90%) */}
          {isTokenPaid && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Box 1: 10% TOKEN ALREADY PAID */}
              <div className="bg-emerald-950/40 rounded-2xl p-4 border border-emerald-500/50 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Paid
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wide">
                    10% Token Amount
                  </div>
                  <div className="text-2xl font-black text-emerald-300 pt-0.5">
                    ₹{alreadyPaid.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-emerald-200/80 leading-tight">
                  ✓ Token confirmed & attached in Zoho CRM.
                </p>
              </div>

              {/* Box 2: OPTION 1 -> REMAINING 40% ADVANCE */}
              <div 
                onClick={() => openCheckout('remaining_advance')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border-2 border-amber-400/60 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Next Step
                  </span>
                  <span className="text-xs text-amber-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Pay Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/90 uppercase tracking-wide">
                    Pay Remaining Advance (40%)
                  </div>
                  <div className="text-2xl font-black text-amber-300 pt-0.5">
                    ₹{remainingAdvanceAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-stone-300/90 leading-tight">
                  Completes 50% advance to lock in hotels & chauffeur. Balance ₹{fiftyPercentAmount.toLocaleString('en-IN')} due 15 days before travel.
                </p>
              </div>

              {/* Box 3: OPTION 2 -> REMAINING 90% BALANCE */}
              <div 
                onClick={() => openCheckout('remaining_balance')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    Clear Balance
                  </span>
                  <span className="text-xs text-emerald-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Pay All <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-[11px] font-black text-white/90 uppercase tracking-wide">
                    Pay Remaining Balance (90%)
                  </div>
                  <div className="text-2xl font-black text-white pt-0.5">
                    ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[10px] text-stone-300/90 leading-tight">
                  100% cleared tour confirmation with zero pending balance.
                </p>
              </div>

            </div>
          )}

          {/* CASE C: 50% ADVANCE PAID -> SHOW FINAL 50% REMAINING BALANCE */}
          {isAdvancePaid && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Box 1: 50% ADVANCE ALREADY PAID */}
              <div className="bg-emerald-950/40 rounded-2xl p-5 border border-emerald-500/50 space-y-2 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-400 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Advance Cleared
                  </span>
                  <CheckCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide">
                    50% Booking Advance Received
                  </div>
                  <div className="text-3xl font-black text-emerald-300 pt-0.5">
                    ₹{alreadyPaid.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-tight">
                  ✓ Luxury properties and chauffeur services are confirmed for your travel dates.
                </p>
              </div>

              {/* Box 2: REMAINING 50% BALANCE PAYMENT */}
              <div 
                onClick={() => openCheckout('remaining_balance')}
                className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-5 border-2 border-amber-400/80 transition-all duration-200 hover:scale-[1.02] cursor-pointer space-y-2 group flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Final Payment
                  </span>
                  <span className="text-xs text-amber-200 font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Pay Now <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-xs font-black text-white/90 uppercase tracking-wide">
                    Pay Remaining 50% Balance
                  </div>
                  <div className="text-3xl font-black text-amber-300 pt-0.5">
                    ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <p className="text-[11px] text-stone-300/90 leading-tight">
                  Due 15 days before departure. Clears full tour invoice and finalizes confirmation voucher kit.
                </p>
              </div>

            </div>
          )}

          {/* CASE D: 100% FULLY PAID */}
          {isFullyPaid && (
            <div className="bg-emerald-950/60 rounded-2xl p-6 border-2 border-emerald-500 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center mx-auto shadow-md">
                <CheckCheck className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-400">
                  ✓ 100% Fully Cleared & Confirmed
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white pt-2">
                  Tour Package Fully Paid!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-200 max-w-md mx-auto">
                  Total amount of <b>₹{totalQuotationAmount.toLocaleString('en-IN')}</b> has been cleared. All luxury services are confirmed.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-stone-100 text-stone-900 text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#6E1E14]" />
                  <span>Download Latest Tax Invoice (PDF)</span>
                </a>
              </div>
            </div>
          )}

          {/* Direct CTA Trigger Button (if not fully paid) */}
          {!isFullyPaid && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => openCheckout(isTokenPaid ? 'remaining_advance' : (isAdvancePaid ? 'remaining_balance' : 'token'))}
                type="button"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-black px-7 py-3.5 rounded-xl shadow-lg transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isTokenPaid ? 'Pay Remaining Advance (40%)' : (isAdvancePaid ? 'Pay Remaining 50% Balance' : 'Book & Pay Online (Razorpay)')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-white/80 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>UPI (GPay, PhonePe, Paytm), All Cards, Netbanking & Wallets</span>
              </div>
            </div>
          )}

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
          advanceAmountPaid={alreadyPaid}
          balancePendingAmount={balancePendingAmount}
          initialPaymentType={selectedPaymentType}
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
