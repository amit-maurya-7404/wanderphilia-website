'use client';

import { useState } from 'react';
import { Share2, Download, Phone, Check } from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay } from '@/lib/contact';

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
}: ItineraryClientActionsProps) {
  const [copied, setCopied] = useState(false);

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

  const cleanPhone = contactPhoneDisplay.replace(/\s+/g, '');
  const whatsappMessage = encodeURIComponent(
    `Hi Wanderphilia Team! I'm reviewing my custom luxury itinerary (${itineraryId}) for ${destination} for ${leadName}. I'd love to discuss the details and next steps!`
  );
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${whatsappMessage}`;
  const callUrl = `tel:+91${cleanPhone}`;

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 print:hidden">
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

      {/* 3. Direct Call Icon (No Pop-up Form) */}
      <a
        href={callUrl}
        aria-label="Call Wanderphilia"
        title={`Call +91 ${contactPhoneDisplay}`}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-orange-50 text-orange-600 border border-stone-300/80 hover:border-orange-300 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <Phone className="w-4 h-4 text-[#FF6E0B]" />
      </a>

      {/* 4. WhatsApp Icon (Direct WhatsApp - No Pop-up Form) */}
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
  );
}
