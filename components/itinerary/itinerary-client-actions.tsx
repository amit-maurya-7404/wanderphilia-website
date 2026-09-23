'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RequestCallbackDialog } from '@/components/request-callback-dialog';
import { Share2, Download, Phone, Check, Copy, MessageCircle, Sparkles } from 'lucide-react';
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
      <div className="flex flex-wrap items-center gap-2.5 print:hidden">
        {/* Share Button */}
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              <span className="text-emerald-700 font-bold">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Share Itinerary</span>
            </>
          )}
        </Button>

        {/* Print / Save PDF Button */}
        <Button
          onClick={handlePrint}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-md border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs shadow-sm transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          <span>Save as PDF</span>
        </Button>

        {/* Request Callback / Customization Button */}
        <Button
          onClick={() => setCallbackOpen(true)}
          size="sm"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm transition cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5 text-orange-400" />
          <span>Request Callback</span>
        </Button>

        {/* Direct WhatsApp Concierge Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <RiWhatsappLine className="w-4 h-4" />
          <span>WhatsApp Specialist</span>
        </a>
      </div>

      {/* Floating Bottom Action Bar for Mobile & Quick Booking */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 p-3.5 shadow-2xl md:hidden print:hidden">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-orange-600">
              Ref: {itineraryId}
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {destination}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCallbackOpen(true)}
              size="sm"
              variant="outline"
              className="text-xs font-bold rounded-xl border-slate-300 py-4 px-3"
            >
              Call Me
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md"
            >
              <RiWhatsappLine className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
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
