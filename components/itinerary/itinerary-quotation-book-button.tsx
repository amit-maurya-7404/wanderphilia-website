'use client';

import React, { useState } from 'react';
import { CreditCard, ArrowRight, ShieldCheck, Check, CheckCircle2, Download } from 'lucide-react';
import { ItineraryBookModal, ItineraryPaymentType } from './itinerary-book-modal';

interface ItineraryQuotationBookButtonProps {
  itineraryId: string;
  destination: string;
  proposalTitle?: string;
  perAdultPrice?: number;
  adults?: number;
  baseAmount?: number;
  gstPercentage?: number;
  tcsPercentage?: number;
  totalQuotationAmount: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
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
  proposalTitle,
  perAdultPrice,
  adults,
  baseAmount,
  gstPercentage,
  tcsPercentage,
  totalQuotationAmount,
  advanceAmountPaid = 0,
  balancePendingAmount,
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
  const [defaultPaymentType, setDefaultPaymentType] = useState<ItineraryPaymentType>('token');

  if (!totalQuotationAmount || totalQuotationAmount <= 0) {
    return null;
  }

  const alreadyPaid = Number(advanceAmountPaid || 0);
  const tenPercentAmount = Math.round(totalQuotationAmount * 0.1);
  const fiftyPercentAmount = Math.round(totalQuotationAmount * 0.5);
  const remainingAdvanceAmount = Math.max(0, fiftyPercentAmount - alreadyPaid);
  const remainingBalanceAmount = Math.max(0, totalQuotationAmount - alreadyPaid);

  const isFullyPaid = alreadyPaid >= totalQuotationAmount;
  const isAdvancePaid = alreadyPaid >= fiftyPercentAmount && !isFullyPaid;
  const isTokenPaid = alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount;

  const handleOpen = (type?: ItineraryPaymentType) => {
    if (type) {
      setDefaultPaymentType(type);
    } else {
      if (alreadyPaid <= 0) setDefaultPaymentType('token');
      else if (isTokenPaid) setDefaultPaymentType('remaining_advance');
      else setDefaultPaymentType('remaining_balance');
    }
    setModalOpen(true);
  };

  if (isFullyPaid) {
    if (variant === 'floating') return null;

    return (
      <div className="bg-emerald-500/20 backdrop-blur-md rounded-2xl p-4 border border-emerald-400/50 flex items-center justify-between gap-3 text-white mt-2 print:hidden">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs sm:text-sm font-bold">
            <span className="text-emerald-300 font-black">100% Cleared: </span>
            Tour package is fully paid and confirmed!
          </div>
        </div>
        <a
          href={`/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl transition cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Invoice</span>
        </a>
      </div>
    );
  }

  return (
    <>
      {variant === 'card' ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 print:hidden">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                {isTokenPaid ? 'Token Cleared' : (isAdvancePaid ? 'Advance Cleared' : 'Easy Installments')}
              </span>
              <span className="text-xs font-bold text-amber-200/90">
                {alreadyPaid > 0 ? `₹${alreadyPaid.toLocaleString('en-IN')} Paid so far` : '3 Flexible Options'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 font-medium">
              {isTokenPaid ? (
                <>Pay <b>Remaining Advance (₹{remainingAdvanceAmount.toLocaleString('en-IN')})</b> or <b>Full Balance (₹{remainingBalanceAmount.toLocaleString('en-IN')})</b>.</>
              ) : isAdvancePaid ? (
                <>Pay <b>Final 50% Balance (₹{remainingBalanceAmount.toLocaleString('en-IN')})</b> due 15 days before travel.</>
              ) : (
                <>Pay <b>10% Token (₹{tenPercentAmount.toLocaleString('en-IN')})</b>, <b>50% Advance (₹{fiftyPercentAmount.toLocaleString('en-IN')})</b> or <b>Full (₹{totalQuotationAmount.toLocaleString('en-IN')})</b> online via Razorpay.</>
              )}
            </p>
          </div>

          <button
            onClick={() => handleOpen()}
            type="button"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 text-stone-950" />
            <span>
              {isTokenPaid ? 'Pay Remaining Advance' : (isAdvancePaid ? 'Complete Full Payment' : 'Book & Pay Online')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : variant === 'floating' ? (
        /* Floating Sticky Bottom Bar for Mobile & Quick Actions */
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto bg-stone-950/95 backdrop-blur-lg border border-amber-500/30 text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 print:hidden animate-fade-in">
          <div className="space-y-0.5 pl-1">
            <span className="text-[10px] uppercase font-black text-amber-400 tracking-wider block">
              {alreadyPaid > 0 ? `Pending Balance` : `Total Quotation`}
            </span>
            <div className="text-base sm:text-lg font-black text-white leading-none">
              ₹{(remainingBalanceAmount > 0 ? remainingBalanceAmount : totalQuotationAmount).toLocaleString('en-IN')}
            </div>
            {alreadyPaid > 0 && (
              <span className="text-[9px] text-emerald-400 font-bold block pt-0.5">
                ✓ ₹{alreadyPaid.toLocaleString('en-IN')} Paid
              </span>
            )}
          </div>

          <button
            onClick={() => handleOpen()}
            type="button"
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <CreditCard className="w-4 h-4 text-stone-950" />
            <span>
              {isTokenPaid ? 'Pay Advance' : (isAdvancePaid ? 'Complete Full Payment' : 'Book Now')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => handleOpen()}
          type="button"
          className="inline-flex items-center gap-2 bg-[#6E1E14] hover:bg-[#5C1810] text-white text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider print:hidden"
        >
          <CreditCard className="w-4 h-4 text-amber-300" />
          <span>
            {isTokenPaid ? 'Pay Remaining Advance' : (isAdvancePaid ? 'Complete Full Payment' : 'Book Now & Pay Online')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      <ItineraryBookModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        itineraryId={itineraryId}
        destination={destination}
        proposalTitle={proposalTitle}
        perAdultPrice={perAdultPrice}
        adults={adults}
        baseAmount={baseAmount}
        gstPercentage={gstPercentage}
        tcsPercentage={tcsPercentage}
        totalQuotationAmount={totalQuotationAmount}
        advanceAmountPaid={alreadyPaid}
        balancePendingAmount={balancePendingAmount}
        initialPaymentType={defaultPaymentType}
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
