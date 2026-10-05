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
    <div className="w-full space-y-6">
      {dayPlans.map((day, idx) => {
        const dayNum = day.day || idx + 1;
        const isExpanded = !!expandedDays[dayNum];

        // Ensure image is valid
        let dayImage = day.image;
        if (!dayImage || dayImage.startsWith('http') || !dayImage.startsWith('/')) {
          dayImage = imagePool[idx % imagePool.length];
        }

        return (
          <div
            key={dayNum}
            id={`day-card-${dayNum}`}
            className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Header Accordion Button */}
            <button
              onClick={() => toggleDay(dayNum)}
              className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 hover:bg-stone-50/80 transition cursor-pointer"
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* Orange Day Badge */}
                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-orange-200 shadow-2xs">
                  Day {dayNum}
                </span>

                {/* Day Headline */}
                <h3 className={`${playfair.className} text-base sm:text-xl font-bold text-[#8B2519] tracking-tight leading-snug`}>
                  {day.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {day.durationNote && (
                  <span className="hidden sm:inline-flex items-center gap-1 bg-stone-100 text-stone-600 text-[11px] font-bold px-2.5 py-1 rounded-full border border-stone-200">
                    <Clock className="w-3 h-3 text-orange-600" />
                    {day.durationNote}
                  </span>
                )}
                <div className="p-1.5 rounded-full bg-stone-100 text-stone-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>
            </button>

            {/* Accordion Body */}
            {isExpanded && (
              <div className="px-6 sm:px-8 pb-8 pt-4 border-t border-stone-100 space-y-6">

                {/* Two-Column: Left Itinerary Details, Right Photo */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                  {/* LEFT: Structured Narrative & Flowchart Bullet Points */}
                  <div className="md:col-span-7 space-y-4">

                    {/* Duration Note if present */}
                    {day.durationNote && (
                      <p className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>{day.durationNote}</span>
                      </p>
                    )}

                    {/* Intro Sentence (Clean regular text, no airplane icon) */}
                    {day.intro && (
                      <p className="text-xs sm:text-sm font-medium text-stone-700 leading-relaxed whitespace-pre-line">
                        {day.intro}
                      </p>
                    )}

                    {/* Primary Sightseeing Points (with Dotted Flowchart Line & Step Nodes) */}
                    {day.timeline && day.timeline.length > 0 && (
                      <div className="relative pl-6 space-y-3 py-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-sky-300">
                        {day.timeline.map((item, mIdx) => (
                          <div key={mIdx} className="relative group">
                            {/* Circular Step Node Dot */}
                            <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 group-hover:scale-125 group-hover:border-orange-500 transition-all shadow-2xs" />
                            <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed group-hover:text-stone-950 transition-colors">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sub-sections (Evening, Signature, Optional, Solang Valley, New Year's Eve, etc.) */}
                    {day.sections && day.sections.map((section, sIdx) => {
                      return (
                        <div key={sIdx} className="space-y-2.5 pt-2">
                          {/* Subheading in Clean Bold Typography */}
                          <div className="text-xs sm:text-sm font-bold text-stone-900 tracking-wide">
                            {section.title}
                          </div>

                          {/* Section Note (e.g. Dress up, gather with your fellow travellers...) */}
                          {section.note && (
                            <p className="text-xs sm:text-sm font-medium text-stone-600 leading-relaxed">
                              {section.note}
                            </p>
                          )}

                          {/* Bullet Points under Section (with Dotted Flowchart Line & Step Nodes) */}
                          {section.items && section.items.length > 0 && (
                            <div className="relative pl-6 space-y-3 py-1 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-sky-300">
                              {section.items.map((item, iIdx) => (
                                <div key={iIdx} className="relative group">
                                  {/* Circular Step Node Dot */}
                                  <div className="absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-sky-500 group-hover:scale-125 group-hover:border-orange-500 transition-all shadow-2xs" />
                                  <p className="text-xs sm:text-sm font-semibold text-stone-800 leading-relaxed group-hover:text-stone-950 transition-colors">
                                    {item}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Outro / Notes (e.g. Return to Dalhousie by evening...) */}
                    {day.outro && (
                      <div className="pt-2 text-xs sm:text-sm font-medium text-stone-700 space-y-1">
                        {Array.isArray(day.outro) ? (
                          day.outro.map((out, oIdx) => <p key={oIdx}>{out}</p>)
                        ) : (
                          <p>{day.outro}</p>
                        )}
                      </div>
                    )}

                    {/* Stay Line (e.g. Stay: Dharamshala) */}
                    {day.stayLocation && (
                      <div className="pt-3 text-xs sm:text-sm font-bold text-[#6E1E14]">
                        {day.stayLocation.toLowerCase().startsWith('stay:') || day.stayLocation.toLowerCase().startsWith('trip')
                          ? day.stayLocation
                          : `Stay: ${day.stayLocation}`}
                      </div>
                    )}

                    {/* Sign-Off (e.g. Until the next adventure — Wanderphilia style) */}
                    {day.signOff && (
                      <div className="pt-2 text-xs sm:text-sm font-bold text-[#8B2519] italic">
                        {day.signOff}
                      </div>
                    )}

                  </div>

                    {/* RIGHT: High Quality Destination Photo Card */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-stone-100 group">
                      <SafeImage
                        src={dayImage}
                        alt={day.title || 'Day highlight'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                </div>

                {/* Meals & Hotel Summary Footer Strip */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-3 text-xs font-bold text-[#6E1E14]">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Meals: <strong className="text-stone-900">{day.meals || 'Breakfast & Dinner'}</strong></span>
                  </div>
                  {day.stayLocation && (
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <HotelIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>{day.stayLocation.toLowerCase().startsWith('trip') ? day.stayLocation : `Stay: ${day.stayLocation.replace(/^Stay:\s*/i, '')}`}</span>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
