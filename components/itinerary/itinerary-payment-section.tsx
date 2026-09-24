'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Copy, 
  Check, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  CheckCircle2
} from 'lucide-react';

export function ItineraryPaymentSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldId: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* OPTION 1: Direct Bank Account Transfer */}
        <div className="bg-white rounded-2xl border-2 border-[#6E1E14]/30 overflow-hidden shadow-md flex flex-col justify-between">
          <div className="bg-gradient-to-r from-[#5C1810] to-[#7E2419] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">1) ACCOUNT TRANSFER</span>
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
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">2) BY UPI</span>
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
    </div>
  );
}
