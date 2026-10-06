'use client';

import { useState } from 'react';
import { RequestCallbackDialog } from '@/components/request-callback-dialog';
import { Share2, Download, Phone, Check, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay } from '@/lib/contact';
import { ItineraryBookModal, ItineraryPaymentType } from './itinerary-book-modal';

interface ItineraryClientActionsProps {
  itineraryId: string;
  title: string;
  leadName?: string;
  destination: string;
  totalQuotationAmount?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  email?: string;
  mobile?: string;
  zohoLeadId?: string;
  inquiryId?: string;
  numDays?: number;
  numNights?: number;
  travelStartDate?: string;
  travelEndDate?: string;
}

export function ItineraryClientActions({
  itineraryId,
  title,
  leadName = 'Valued Traveler',
  destination,
  totalQuotationAmount = 0,
  advanceAmountPaid = 0,
  balancePendingAmount,
  email = '',
  mobile = '',
  zohoLeadId,
  inquiryId,
  numDays,
  numNights,
  travelStartDate,
  travelEndDate,
}: ItineraryClientActionsProps) {
  const [copied, setCopied] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const alreadyPaid = Number(advanceAmountPaid || 0);
  const fiftyPercentAmount = Math.round(totalQuotationAmount * 0.5);
  const isFullyPaid = alreadyPaid >= totalQuotationAmount && totalQuotationAmount > 0;
  const isAdvancePaid = alreadyPaid >= fiftyPercentAmount && !isFullyPaid;
  const isTokenPaid = alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount;

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wanderphilia Luxury Itinerary: ${title}`,
          text: `Check out this bespoke luxury travel itinerary for ${destination} curated by Wanderphilia.`,
          url: url
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Wanderphilia Team! I'm reviewing my custom luxury itinerary (${itineraryId}) for ${destination} for ${leadName}. I'd love to discuss the details and next steps!`
  );
  const whatsappUrl = `https://wa.me/91${contactPhoneDisplay}?text=${whatsappMessage}`;

  const defaultPaymentType: ItineraryPaymentType = alreadyPaid <= 0
    ? 'token'
    : (isTokenPaid ? 'remaining_advance' : 'remaining_balance');

  return (
    <>
      <div className="flex items-center gap-2 sm:gap-2.5 print:hidden">
        {/* Primary Book / Pay Now Button (if quotation amount exists) */}
        {totalQuotationAmount > 0 && (
          isFullyPaid ? (
            <a
              href={`/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] sm:text-xs font-black px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Invoice</span>
            </a>
          ) : (
            <button
              onClick={() => setBookModalOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 bg-[#6E1E14] hover:bg-[#5C1810] text-white text-[11px] sm:text-xs font-black px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {isTokenPaid ? 'Pay Advance' : (isAdvancePaid ? 'Pay Balance' : 'Book Now')}
              </span>
            </button>
          )
        )}

        {/* 1. Share Icon */}
        <button
          onClick={handleShare}
          type="button"
          aria-label="Share Itinerary"
          title={copied ? "Link Copied!" : "Share Itinerary"}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300/80 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <Share2 className="w-4 h-4 text-stone-700" />
          )}
        </button>

        {/* 2. Download / Save PDF Icon */}
        <button
          onClick={handlePrint}
          type="button"
          aria-label="Download PDF"
          title="Save as PDF"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300/80 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-stone-700" />
        </button>

        {/* 3. Call Icon */}
        <button
          onClick={() => setCallbackOpen(true)}
          type="button"
          aria-label="Request Callback"
          title="Request a Call"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-orange-50 text-orange-600 border border-stone-300/80 hover:border-orange-300 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Phone className="w-4 h-4 text-[#FF6E0B]" />
        </button>

        {/* 4. WhatsApp Icon */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Specialist"
          title="Chat on WhatsApp"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RiWhatsappLine className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </a>
      </div>

      {/* Booking & Online Payment Modal */}
      {totalQuotationAmount > 0 && (
        <ItineraryBookModal
          open={bookModalOpen}
          onOpenChange={setBookModalOpen}
          itineraryId={itineraryId}
          destination={destination}
          proposalTitle={title}
          totalQuotationAmount={totalQuotationAmount}
          advanceAmountPaid={alreadyPaid}
          balancePendingAmount={balancePendingAmount}
          initialPaymentType={defaultPaymentType}
          initialLeadName={leadName !== 'Valued Traveler' ? leadName : ''}
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

      {/* Callback Dialog Modal */}
      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={`Custom Itinerary: ${title} (${itineraryId})`}
        price={0}
        isQuote={true}
      />
    </>
  );
}
