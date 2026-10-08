'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ManualDayPlan } from '@/types/manual-itinerary';
import {
  ChevronDown,
  ChevronUp,
  Utensils,
  MapPin,
  Clock,
  Hotel as HotelIcon
} from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

function SafeImage({
  src,
  alt,
  fill,
  priority,
  className,
  fallback = '/images/himachal.jpg'
}: {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  return (
    <Image
      src={imgSrc || fallback}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
}

interface ManualFlowchartSectionProps {
  dayPlans: ManualDayPlan[];
  destination?: string;
  defaultImages?: string[];
}

function renderFormattedText(text: string) {
  if (!text) return null;

  // Split by markdown bold **...**
  const parts = text.split(/(\*\*.*?\*\*)/g);

  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
            const inner = part.slice(2, -2);
            return (
              <strong key={pIdx} className="text-stone-900 font-bold">
                {inner}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </>
    );
  }

  // If no markdown bold, check if there is a "Heading: Detail" format
  const colonIdx = text.indexOf(': ');
  if (colonIdx > 0 && colonIdx < 50 && !text.toLowerCase().startsWith('http')) {
    const head = text.slice(0, colonIdx);
    const body = text.slice(colonIdx + 2);
    return (
      <>
        <strong className="text-stone-900 font-bold">{head}: </strong>
        <span>{body}</span>
      </>
    );
  }

  return <span>{text}</span>;
}

const fallbackImages = [
  '/images/himachal.jpg',
  '/images/himachal2.jpg',
  '/images/himachal3.jpg',
  '/images/himachal4.jpg',
  '/images/himachal5.jpg',
  '/images/himachal6.jpg',
  '/images/himachal7.jpg',
  '/images/himachal8.jpg',
  '/images/himachal9.jpg',
  '/images/himachal_hero.jpg'
];

/**
 * Bulletproof helper to format day headings cleanly without duplicate Day or Date prefixes
 */
export function cleanHeadlineText(title: string): string {
  if (!title) return '';
  let clean = title.trim();

  // 1. Strip leading "Day X |", "Day X -", "Day X:", "Day X", etc.
  clean = clean.replace(/^Day\s*\d+\s*[|:–—\-]\s*/i, '');
  clean = clean.replace(/^Day\s*\d+\s+/i, '');

  // 2. Strip leading date expressions e.g. "14 Dec", "14th Dec", "14th December", "14-12-2026", "14 Dec 2026"
  clean = clean.replace(/^\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:\s+\d{4})?\s*[|:–—\-]?\s*/i, '');

  // 3. Strip any residual "Day X |", "Day X:", or dates
  clean = clean.replace(/^Day\s*\d+\s*[|:–—\-]\s*/i, '');
  clean = clean.replace(/^Day\s*\d+\s+/i, '');

  // 4. Strip standalone leading punctuation like "|", "-", ":", "–"
  clean = clean.replace(/^[|:–—\-]\s*/, '');

  // 5. Recursively strip all internal bracketed notes e.g. (Recommended), (Optional), (Enjoy a relaxing...)
  let prev = '';
  while (clean !== prev) {
    prev = clean;
    clean = clean.replace(/\([^()]*\)/g, '').replace(/\[[^[\]]*\]/g, '').trim();
  }

  // 6. Remove duplicate spaces, trailing dashes, commas
  clean = clean.replace(/\s{2,}/g, ' ').replace(/[.,:;–—\s]+$/g, '').trim();

  return clean || title.trim();
}

export function ManualFlowchartSection({
  dayPlans,
  destination = 'Himachal Pradesh',
  defaultImages = []
}: ManualFlowchartSectionProps) {
  // All days expanded by default
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    dayPlans.forEach((d, i) => {
      initial[d.day || i + 1] = true;
    });
    return initial;
  });

  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const imagePool = defaultImages.length > 0 ? defaultImages : fallbackImages;

  return (
    <div className="w-full space-y-5">
      {dayPlans.map((day, idx) => {
        const dayNum = day.day || idx + 1;
        const isExpanded = !!expandedDays[dayNum];

        // Ensure image is valid
        let dayImage = day.image;
        if (!dayImage || dayImage.startsWith('http') || !dayImage.startsWith('/')) {
          dayImage = imagePool[idx % imagePool.length];
        }

        // Clean headline to pure activity title
        const cleanHeadline = cleanHeadlineText(day.title || `Day ${dayNum} Exploration`);

        return (
          <div
            key={dayNum}
            id={`day-card-${dayNum}`}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Header Accordion Button (Clean title only, no truncation) */}
            <button
              onClick={() => toggleDay(dayNum)}
              className="w-full text-left p-3.5 sm:p-5 flex items-start sm:items-center justify-between gap-2.5 sm:gap-4 hover:bg-stone-50/80 transition cursor-pointer"
            >
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                {/* Left: Day Badge with Date underneath */}
                <div className="flex flex-col items-center justify-center shrink-0 min-w-[54px] sm:min-w-[62px]">
                  <span className="w-full inline-flex items-center justify-center bg-orange-100 text-orange-800 text-[10px] sm:text-xs font-black px-2 py-0.5 sm:py-1 rounded-full uppercase tracking-wider border border-orange-200 shadow-2xs text-center">
                    Day {dayNum}
                  </span>
                  {day.date && (
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#8B2519] mt-1 whitespace-nowrap text-center">
                      {day.date}
                    </span>
                  )}
                </div>

                {/* Catchy Day Headline (Full descriptive sentence, NO truncation) */}
                <h3 className="text-xs sm:text-base font-black text-stone-900 tracking-tight leading-snug break-words whitespace-normal flex-1">
                  {cleanHeadline}
                </h3>

                {/* Optional Duration & KM Pill */}
                {day.durationNote && (
                  <span className="hidden md:inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-stone-200 shrink-0">
                    <Clock className="w-3 h-3 text-orange-600 shrink-0" />
                    <span>{day.durationNote}</span>
                  </span>
                )}
              </div>

              {/* Right Chevron Toggle Button */}
              <div className="shrink-0 p-1.5 sm:p-2 rounded-full bg-stone-100 text-stone-600 mt-0.5 sm:mt-0">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Accordion Body */}
            {isExpanded && (
              <div className="px-5 sm:px-8 pb-7 pt-3 border-t border-stone-100 space-y-5">

                {/* Location & Transit Route Strip */}
                <div className="flex items-start gap-2 text-xs text-stone-600 pb-2.5 border-b border-stone-100">
                  <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0 leading-relaxed">
                    <strong className="text-stone-900 font-bold text-xs sm:text-sm">
                      {day.route || (day.stayLocation ? day.stayLocation.split(',').pop()?.trim() : destination)}
                    </strong>
                    {day.durationNote && (
                      <span className="text-stone-500 font-medium text-[11px] sm:text-xs ml-1.5">
                        ({day.durationNote.replace(/^\(?/, '').replace(/\)?$/, '')})
                      </span>
                    )}
                  </div>
                </div>

                {/* Two-Column: Left Timeline Milestones, Right Photo */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">

                  {/* LEFT: Structured Narrative & Flowchart Bullet Points */}
                  <div className="md:col-span-7 space-y-4">

                    {/* Primary Sightseeing Points (with Dotted Flowchart Line & Step Nodes) */}
                    {day.timeline && day.timeline.length > 0 && (
                      <div className="relative pl-6 space-y-3.5 py-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-sky-300">
                        {day.timeline.map((item, mIdx) => (
                          <div key={mIdx} className="relative group">
                            {/* Circular Step Node Dot */}
                            <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 group-hover:scale-125 group-hover:border-orange-500 transition-all shadow-2xs" />
                            <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed group-hover:text-stone-950 transition-colors">
                              {renderFormattedText(item)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sub-sections (Evening, Signature, Optional, etc. for manual itineraries) */}
                    {day.sections && day.sections.map((section, sIdx) => {
                      return (
                        <div key={sIdx} className="space-y-2 pt-2">
                          <div className="text-xs sm:text-sm font-bold text-stone-900 tracking-wide">
                            {section.title}
                          </div>

                          {section.note && (
                            <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                              {section.note}
                            </p>
                          )}

                          {section.items && section.items.length > 0 && (
                            <div className="relative pl-6 space-y-2.5 py-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-sky-300">
                              {section.items.map((it, iIdx) => (
                                <div key={iIdx} className="relative group">
                                  <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 group-hover:scale-125 group-hover:border-orange-500 transition-all shadow-2xs" />
                                  <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed group-hover:text-stone-950 transition-colors">
                                    {it}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Outro / Notes */}
                    {day.outro && (
                      <div className="pt-2 text-xs sm:text-sm font-medium text-stone-700 space-y-1">
                        {Array.isArray(day.outro) ? (
                          day.outro.map((out, oIdx) => <p key={oIdx}>{out}</p>)
                        ) : (
                          <p>{day.outro}</p>
                        )}
                      </div>
                    )}

                    {/* Optional Note Callout */}
                    {day.optionalNote && (
                      <div className="pt-2">
                        <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-300/80 text-amber-950 text-xs font-medium flex items-start gap-2 shadow-2xs">
                          <span className="text-amber-700 font-bold shrink-0 mt-0.5">📌</span>
                          <div className="leading-relaxed">
                            <strong className="font-extrabold uppercase text-[#8B2519]">
                              NOTE:{' '}
                            </strong>
                            <span>
                              {day.optionalNote
                                .replace(/^NOTE:\s*/i, '')
                                .replace(/^Note:\s*/i, '')
                                .replace(/\s*\(on your own\)/gi, '')
                                .replace(/\s*on your own/gi, '')}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sign-Off */}
                    {day.signOff && (
                      <div className="pt-2 text-xs sm:text-sm font-bold text-[#8B2519] italic">
                        {day.signOff}
                      </div>
                    )}

                  </div>

                  {/* RIGHT: High Quality Destination Photo Card */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-stone-100 group">
                      <SafeImage
                        src={dayImage}
                        alt={cleanHeadline || 'Day highlight'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                </div>

                {/* Meals & Stay Footer Strip */}
                {(day.meals || (day.stayLocation && day.stayLocation.trim().length > 0)) && (
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    {day.meals && (
                      <div className="flex items-center gap-1.5 font-bold text-[#6E1E14]">
                        <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>Meals: <strong className="text-stone-900 font-bold">{day.meals}</strong></span>
                      </div>
                    )}
                    {day.stayLocation && day.stayLocation.trim().length > 0 && (
                      <div className="flex items-center gap-1.5 font-medium text-stone-700">
                        <HotelIcon className="w-4 h-4 text-stone-500 shrink-0" />
                        <span>Stay: <strong className="text-stone-900 font-bold">{day.stayLocation.replace(/^Stay:\s*/i, '')}</strong></span>
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
