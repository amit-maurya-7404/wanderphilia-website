'use client';

import { useState } from 'react';
import { RequestCallbackDialog } from '@/components/request-callback-dialog';
import { Share2, Download, Phone, Check } from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay } from '@/lib/contact';

interface ItineraryClientActionsProps {
  itineraryId: string;
  title: string;
  leadName?: string;
  destination: string;
}

export function ItineraryClientActions({
  itineraryId,
  title,
  leadName = 'Valued Traveler',
  destination
}: ItineraryClientActionsProps) {
  const [copied, setCopied] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

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

  return (
    <>
      {/* Top Navbar: 4 Icons Only (Share, Download, Call, WhatsApp) */}
      <div className="flex items-center gap-2 sm:gap-2.5 print:hidden">
        {/* 1. Share Icon */}
        <button
          onClick={handleShare}
          type="button"
          aria-label="Share Itinerary"
          title={copied ? "Link Copied!" : "Share Itinerary"}
          className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300/80 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative"
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
          className="w-9 h-9 rounded-full bg-white hover:bg-stone-100 text-stone-700 border border-stone-300/80 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-stone-700" />
        </button>

        {/* 3. Call Icon */}
        <button
          onClick={() => setCallbackOpen(true)}
          type="button"
          aria-label="Request Callback"
          title="Request a Call"
          className="w-9 h-9 rounded-full bg-white hover:bg-orange-50 text-orange-600 border border-stone-300/80 hover:border-orange-300 shadow-2xs flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
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
          className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <RiWhatsappLine className="w-5 h-5 text-white" />
        </a>
      </div>

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
