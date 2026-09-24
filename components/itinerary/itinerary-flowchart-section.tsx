'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ItineraryDayPlan } from '@/types/itinerary';
import { ChevronDown, ChevronUp, Utensils, MapPin, Hotel as HotelIcon } from 'lucide-react';

interface ItineraryFlowchartSectionProps {
  dayPlans: ItineraryDayPlan[];
  destination: string;
  defaultImages: string[];
}

const guaranteedDummyImages = [
  '/images/about_hero4.jpg',
  '/images/about_hero5.jpg',
  '/images/himachal.jpg',
  '/images/kashmir.jpg',
  '/images/bali.jpg',
  '/images/bhutan1.jpg',
  '/images/bhutan2.jpg',
  '/images/singapore1.jpg',
  '/images/thailand.jpg',
  '/images/gallery1.jpeg',
  '/images/gallery4.jpg',
  '/images/gallery11.jpg',
  '/images/gallery15.JPG',
  '/images/gallery26.JPG'
];

export function ItineraryFlowchartSection({
  dayPlans,
  destination,
  defaultImages = []
}: ItineraryFlowchartSectionProps) {
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

  const imagePool = defaultImages.length > 0 ? defaultImages : guaranteedDummyImages;

  return (
    <div className="w-full space-y-6">
      {dayPlans.map((day, idx) => {
        const dayNum = day.day || idx + 1;
        const isExpanded = !!expandedDays[dayNum];
        
        // Ensure image is a valid local path
        let dayImage = day.image;
        if (!dayImage || dayImage.startsWith('http') || !dayImage.startsWith('/')) {
          dayImage = imagePool[idx % imagePool.length];
        }

        // Extract or construct timeline milestones
        const milestones = (day.timeline && day.timeline.length > 0)
          ? day.timeline
          : (day.activities && day.activities.length > 0)
            ? day.activities
            : [
                `Arrive in ${day.stayLocation || destination} and meet your tour representative.`,
                `Check-in to your luxury property and refresh.`,
                day.description,
                `Enjoy dinner and an overnight stay in ${day.stayLocation || destination}.`
              ];

        return (
          <div
            key={dayNum}
            id={`flowchart-day-${dayNum}`}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all duration-300"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleDay(dayNum)}
              className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 hover:bg-stone-50/80 transition cursor-pointer"
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* Orange Day Badge */}
                <span className="inline-flex items-center justify-center bg-orange-100 text-orange-800 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0 border border-orange-200 shadow-2xs">
                  Day {dayNum}
                </span>

                {/* Catchy Day Headline */}
                <h3 className="text-base sm:text-lg font-black text-stone-900 tracking-tight leading-snug">
                  {day.title}
                </h3>
              </div>

              <div className="p-1.5 rounded-full bg-stone-100 text-stone-600 shrink-0 mt-1 sm:mt-0">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {/* Accordion Body (Flowchart Timeline) */}
            {isExpanded && (
              <div className="px-6 sm:px-8 pb-8 pt-2 border-t border-stone-100 space-y-6">
                
                {/* Stay / Location Sub-bar - Only shown when hotel/stay is booked */}
                {day.stayLocation && day.stayLocation.trim().length > 0 && (
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-500 pb-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    <span>Location: <strong className="text-stone-800">{day.stayLocation}</strong></span>
                  </div>
                )}

                {/* Two-Column: Left Timeline, Right Image */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: Dotted Flowchart Line & Step Nodes */}
                  <div className="md:col-span-7 space-y-5 relative pl-7 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-sky-300">
                    {milestones.map((milestone, mIdx) => {
                      // Check for **Bold Title**: Description format
                      const boldMatch = milestone.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
                      const colonIdx = !boldMatch ? milestone.indexOf(': ') : -1;

                      return (
                        <div key={mIdx} className="relative group">
                          {/* Circular Step Node Dot */}
                          <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-3 border-sky-500 group-hover:scale-125 group-hover:border-orange-500 transition-all shadow-xs" />

                          {/* Milestone Narrative Text */}
                          <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-relaxed group-hover:text-stone-950 transition-colors">
                            {boldMatch ? (
                              <>
                                <strong className="text-stone-900 font-bold">{boldMatch[1]}: </strong>
                                <span>{boldMatch[2]}</span>
                              </>
                            ) : colonIdx > 0 ? (
                              <>
                                <strong className="text-stone-900 font-bold">{milestone.slice(0, colonIdx)}: </strong>
                                <span>{milestone.slice(colonIdx + 2)}</span>
                              </>
                            ) : (
                              milestone
                            )}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* RIGHT: Photo Card */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden shadow-md border-2 border-white bg-stone-100">
                      <Image
                        src={dayImage}
                        alt={day.title || 'Day highlight'}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                </div>

                {/* Meals & Hotel Summary Strip */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between flex-wrap gap-3 text-xs font-bold text-[#6E1E14]">
                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Meals: <strong className="text-stone-900">{day.meals || 'Breakfast & Dinner'}</strong></span>
                  </div>
                  {day.stayLocation && day.stayLocation.trim().length > 0 && (
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <HotelIcon className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                      <span>Hotel: <strong className="text-stone-900">{day.stayLocation}</strong></span>
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
