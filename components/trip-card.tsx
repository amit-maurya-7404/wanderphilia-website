'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Trip } from '@/lib/data'
import { gtag } from '@/lib/gtag'
import {
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Tag,
  Plane,
  Building2,
  Camera,
  Utensils,
  FileText,
  User,
  Star,
} from 'lucide-react'

type TripCardProps = Trip

function cleanLocation(loc: string): string {
  let clean = loc.trim()
    .replace(/^(in|at|near|stay in|stay at|stay near|camps near|camp near|hotel in|hotel at|homestay in|homestay at|campsite near|resort in|resort at)\s+/i, '')
    .replace(/\.$/, '')
    .trim();

  const lower = clean.toLowerCase();

  if (lower.includes('leh')) return 'Leh';
  if (lower.includes('nubra')) return 'Nubra';
  if (lower.includes('pangong')) return 'Pangong';
  if (lower.includes('turtuk')) return 'Turtuk';
  if (lower.includes('kargil')) return 'Kargil';
  if (lower.includes('srinagar')) return 'Srinagar';
  if (lower.includes('jispa')) return 'Jispa';
  if (lower.includes('sarchu')) return 'Sarchu';
  if (lower.includes('manali')) return 'Manali';
  if (lower.includes('kasol')) return 'Kasol';
  if (lower.includes('kheerganga')) return 'Kheerganga';
  if (lower.includes('tirthan')) return 'Tirthan';
  if (lower.includes('jibhi')) return 'Jibhi';
  if (lower.includes('tosh')) return 'Tosh';
  if (lower.includes('bir')) return 'Bir';
  if (lower.includes('shangarh')) return 'Shangarh';
  if (lower.includes('shimla')) return 'Shimla';
  if (lower.includes('kalpa')) return 'Kalpa';
  if (lower.includes('kaza')) return 'Kaza';
  if (lower.includes('chandra') || lower.includes('chandratal')) return 'Chandratal';
  if (lower.includes('rampur')) return 'Rampur';
  if (lower.includes('tabo')) return 'Tabo';
  if (lower.includes('guwahati')) return 'Guwahati';
  if (lower.includes('cherrapunji')) return 'Cherrapunji';
  if (lower.includes('shnongpdeng')) return 'Shnongpdeng';
  if (lower.includes('shillong')) return 'Shillong';
  if (lower.includes('hanoi')) return 'Hanoi';
  if (lower.includes('ha long') || lower.includes('halong')) return 'Ha Long Bay';
  if (lower.includes('da nang') || lower.includes('danang')) return 'Da Nang';
  if (lower.includes('ho chi minh')) return 'Ho Chi Minh';
  if (lower.includes('hoi an')) return 'Hoi An';
  if (lower.includes('saigon')) return 'Saigon';
  if (lower.includes('phu quoc') || lower.includes('phu')) return 'Phu Quoc';
  if (lower.includes('sapa')) return 'Sapa';
  if (lower.includes('ubud')) return 'Ubud';
  if (lower.includes('seminyak')) return 'Seminyak';
  if (lower.includes('nusa penida') || lower.includes('nusa')) return 'Nusa Penida';
  if (lower.includes('thimphu')) return 'Thimphu';
  if (lower.includes('punakha')) return 'Punakha';
  if (lower.includes('paro')) return 'Paro';
  if (lower.includes('lataguri')) return 'Lataguri';
  if (lower.includes('gangtok')) return 'Gangtok';
  if (lower.includes('lachen')) return 'Lachen';
  if (lower.includes('lachung')) return 'Lachung';
  if (lower.includes('gulmarg')) return 'Gulmarg';
  if (lower.includes('pahalgam')) return 'Pahalgam';
  if (lower.includes('munnar')) return 'Munnar';
  if (lower.includes('thekkady')) return 'Thekkady';
  if (lower.includes('alleppey')) return 'Alleppey';
  if (lower.includes('kovalam')) return 'Kovalam';
  if (lower.includes('cochin') || lower.includes('kochi')) return 'Cochin';
  if (lower.includes('udaipur')) return 'Udaipur';
  if (lower.includes('jodhpur')) return 'Jodhpur';
  if (lower.includes('jaisalmer')) return 'Jaisalmer';
  if (lower.includes('jaipur')) return 'Jaipur';
  if (lower.includes('pushkar')) return 'Pushkar';
  if (lower.includes('port blair') || lower.includes('port')) return 'Port Blair';
  if (lower.includes('havelock')) return 'Havelock';
  if (lower.includes('neil')) return 'Neil Island';
  if (lower.includes('dharamshala') || lower.includes('dharmshala')) return 'Dharamshala';
  if (lower.includes('dalhousie')) return 'Dalhousie';
  if (lower.includes('amritsar')) return 'Amritsar';
  if (lower.includes('rishikesh')) return 'Rishikesh';
  if (lower.includes('chopta')) return 'Chopta';
  if (lower.includes('joshimath')) return 'Joshimath';
  if (lower.includes('mussoorie')) return 'Mussoorie';
  if (lower.includes('haridwar')) return 'Haridwar';
  if (lower.includes('barkot')) return 'Barkot';
  if (lower.includes('uttarkashi')) return 'Uttarkashi';
  if (lower.includes('guptkashi')) return 'Guptkashi';
  if (lower.includes('kedarnath')) return 'Kedarnath';
  if (lower.includes('badrinath')) return 'Badrinath';
  if (lower.includes('ooty')) return 'Ooty';
  if (lower.includes('kodaikanal')) return 'Kodaikanal';
  if (lower.includes('coimbatore')) return 'Coimbatore';
  if (lower.includes('north goa')) return 'North Goa';
  if (lower.includes('south goa')) return 'South Goa';
  if (lower.includes('goa')) return 'Goa';
  if (lower.includes('pelling')) return 'Pelling';
  if (lower.includes('darjeeling')) return 'Darjeeling';
  if (lower.includes('hanle')) return 'Hanle';
  if (lower.includes('phuentsholing')) return 'Phuentsholing';
  if (lower.includes('gili')) return 'Gili Island';
  if (lower.includes('kuta')) return 'Kuta';
  if (lower.includes('pattaya')) return 'Pattaya';
  if (lower.includes('bangkok')) return 'Bangkok';
  if (lower.includes('phuket')) return 'Phuket';
  if (lower.includes('krabi')) return 'Krabi';
  if (lower.includes('koh phangan') || lower.includes('koh')) return 'Koh Phangan';
  if (lower.includes('singapore')) return 'Singapore';
  if (lower.includes('gushaini')) return 'Gushaini';
  if (lower.includes('chitkul')) return 'Chitkul';
  if (lower.includes('nako')) return 'Nako';
  if (lower.includes('tso moriri') || lower.includes('tso')) return 'Tso Moriri';
  if (lower.includes('aritar')) return 'Aritar';
  if (lower.includes('rishikhola')) return 'Rishikhola';

  if (clean.length < 15) {
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  }
  return clean.split(' ')[0];
}

function getStaySummary(itinerary: Trip['itinerary']): string {
  if (!itinerary || !itinerary.length) return '';

  const stays: string[] = [];
  itinerary.forEach((day, index) => {
    let descLines: string[] = [];
    if (typeof day.description === 'string') {
      descLines = [day.description];
    } else if (Array.isArray(day.description)) {
      descLines = day.description;
    }

    const hasOvernightJourney = descLines.some(line => /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(line)) ||
      /overnight journey|overnight travel|overnight transit|overnight volvo/i.test(day.title);

    if (hasOvernightJourney) {
      return;
    }

    let stayFound = false;
    for (const line of descLines) {
      const match = line.match(/Overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i);
      if (match) {
        const loc = cleanLocation(match[1]);
        if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
          stays.push(loc);
          stayFound = true;
          break;
        }
      }
    }
    if (!stayFound) {
      const titleMatch = day.title.match(/Overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i);
      if (titleMatch) {
        const loc = cleanLocation(titleMatch[1]);
        if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
          stays.push(loc);
          stayFound = true;
        }
      }
    }
    if (!stayFound) {
      for (const line of descLines) {
        const match = line.match(/(?:check in to your hotel in|check-in to your hotel in|check in to|check-in to|reach|arrive in|arrive at)\s+([^.]+)/i);
        if (match) {
          const loc = cleanLocation(match[1]);
          if (loc && loc.toLowerCase() !== 'the' && loc.toLowerCase() !== 'your' && loc.toLowerCase() !== 'hotel' && loc.toLowerCase() !== 'camp') {
            if (index < itinerary.length - 1) {
              stays.push(loc);
              stayFound = true;
              break;
            }
          }
        }
      }
    }
  });

  const grouped: { loc: string; nights: number }[] = [];
  stays.forEach((loc) => {
    if (grouped.length > 0 && grouped[grouped.length - 1].loc === loc) {
      grouped[grouped.length - 1].nights++;
    } else {
      grouped.push({ loc, nights: 1 });
    }
  });

  return grouped.map(g => `${g.nights}N ${g.loc}`).join(' - ');
}

function formatStaySummary(stayStr: string, maxItems: number = 5): string {
  if (!stayStr) return '';
  const parts = stayStr.split(/\s*-\s*/);
  if (parts.length <= maxItems) {
    return parts.join(' • ');
  }
  const shown = parts.slice(0, maxItems).join(' • ');
  const remaining = parts.length - maxItems;
  return `${shown} + ${remaining} more`;
}

export function TripCard({
  title,
  image,
  destination,
  duration,
  price,
  rating,
  slug,
  category,
  itinerary,
  costingDetails,
  showGetQuoteOnly,
  heroMedia,
  tripType,
}: TripCardProps) {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const ignoreClickRef = useRef(false)
  const [imgIndex, setImgIndex] = useState(0)

  const lowestPrice = costingDetails?.length
    ? costingDetails
      .map((item) => {
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : NaN
      })
      .filter((value) => !Number.isNaN(value) && value > 0)
      .reduce((min, value) => Math.min(min, value), Infinity)
    : price

  const displayPrice = Number.isFinite(lowestPrice) ? lowestPrice : price
  const staySummary = getStaySummary(itinerary)

  // Construct images array
  const images = [image]
  if (heroMedia && heroMedia.length > 0) {
    heroMedia.forEach((m) => {
      if (m.type === 'image' && m.src && !images.includes(m.src)) {
        images.push(m.src)
      }
    })
  }

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // Badges logic (using brand orange colors)
  const isMostBooked = rating >= 4.7
  const badgeText = isMostBooked ? 'Most Booked' : 'Deal Available'
  const badgeBg = isMostBooked ? 'bg-[#ff5d09]' : 'bg-[#ff8713]'
  const badgeIcon = isMostBooked ? <ThumbsUp size={11} className="fill-white" /> : <Tag size={11} className="fill-white" />

  // Inclusions logic
  const isGroup = title.toLowerCase().includes('group')
  const isInte = tripType === 'International'

  const inclusions = [
    {
      id: 'flights',
      label: 'Flights',
      icon: <Plane size={20} className="text-orange-500" />,
      optional: !isGroup,
    },
    {
      id: 'hotels',
      label: 'Hotels',
      icon: <Building2 size={20} className="text-blue-500" />,
      optional: false,
    },
    {
      id: 'sightseeing',
      label: 'Sightseeing',
      icon: <Camera size={20} className="text-sky-500" />,
      optional: false,
    },
    {
      id: 'meals',
      label: 'Meal',
      icon: <Utensils size={20} className="text-amber-600" />,
      optional: false,
    },
  ]

  if (isInte) {
    inclusions.push({
      id: 'visa',
      label: 'Visa',
      icon: <FileText size={20} className="text-indigo-500" />,
      optional: false,
    })
  }

  if (isGroup) {
    inclusions.push({
      id: 'manager',
      label: 'Tour Manager',
      icon: <User size={20} className="text-teal-600" />,
      optional: false,
    })
  }

  // Price calculations
  const originalPrice = displayPrice > 0 ? Math.round((displayPrice * 1.15) / 100) * 100 : 0

  return (
    <div
      onClick={() => {
        if (callbackOpen || ignoreClickRef.current) return
        gtag.event({
          action: 'click',
          category: 'Navigation',
          label: `Trip Card: ${title}`,
        })
        window.open(`/trips/${slug}`, '_blank')
      }}
      className="group flex flex-col h-[445px] md:h-[480px] bg-white rounded-2xl border border-orange-300 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full"
    >
      {/* IMAGE / CAROUSEL */}
      <div className="relative w-full h-44 md:h-48 lg:h-52 overflow-hidden bg-gray-100 flex-shrink-0">
        <Image
          src={images[imgIndex]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Navigation Arrows (Desktop only, hidden on mobile for smooth card swiping) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 shadow-md items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={handleNextImg}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 shadow-md items-center justify-center text-gray-700 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </>
        )}

        {/* Badge Overlay */}
        <div className={`absolute top-3 left-3 ${badgeBg} text-white text-[10px] md:text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm`}>
          {badgeIcon}
          <span>{badgeText}</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 md:p-4 flex flex-col flex-grow">

        {/* TAGS & RATING */}
        <div className="flex items-center justify-between mb-2 gap-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1">
            <span className="text-[2.6vw] md:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600">
              {duration - 1}N/{duration}D
            </span>
            <span className="text-[2.6vw] md:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 border border-orange-100 text-[#ff6e0b]">
              {isGroup ? 'Group Tour' : 'Customised Tour'}
            </span>
            <span className="text-[2.6vw] md:text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 text-gray-600">
              {displayPrice > 40000 ? 'Premium' : displayPrice > 20000 ? 'Standard' : 'Value'}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-[3vw] md:text-xs font-bold text-gray-700 flex-shrink-0">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
            <span className="text-gray-400 font-normal">({rating >= 4.8 ? '1.5k' : rating >= 4.6 ? '1.2k' : '940'})</span>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="text-[4.2vw] md:text-base font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.2rem] md:min-h-[2.5rem] mb-1 group-hover:text-[#ff6e0b] transition-colors flex-shrink-0">
          {title}
        </h3>

        {/* ROUTE / STOPS */}
        <p className="text-[3.4vw] md:text-xs text-gray-500 leading-normal mb-2 flex-shrink-0">
          {staySummary ? formatStaySummary(staySummary) : destination}
        </p>

        {/* DYNAMIC INCLUSIONS */}
        <div className="flex items-center gap-1 justify-between mt-auto pt-0 border-t border-gray-50 flex-shrink-0">
          {inclusions.map((inc) => (
            <div key={inc.id} className="relative flex flex-col items-center flex-1 min-w-0 py-1">
              {inc.optional && (
                <span className="absolute -top-1 bg-yellow-300 text-black text-[6px] md:text-[7px] font-black px-0.5 rounded-xs uppercase scale-90 border border-white leading-none">
                  Optional
                </span>
              )}
              <div className="w-7 h-7 md:w-8 md:h-8 rounded bg-gray-50 border border-gray-100 flex items-center justify-center mb-1">
                {inc.icon}
              </div>
              <span className="text-[2.6vw] md:text-[9px] text-gray-500 text-center font-medium truncate w-full">
                {inc.label}
              </span>
            </div>
          ))}
        </div>

        {/* DASHED LINE DIVIDER */}
        <div className="border-t border-dashed border-gray-200 my-3 flex-shrink-0" />

        {/* PRICING & BUTTON */}
        <div className="flex items-center justify-between mt-auto pt-1 flex-shrink-0 gap-2">
          <div>
            {showGetQuoteOnly || displayPrice === 0 ? (
              <div>
                <span className="text-sm md:text-base font-extrabold text-gray-900 block leading-tight">Price on Request</span>
                <span className="text-[8px] md:text-[9px] text-gray-400 block font-medium">Starting price per adult</span>
              </div>
            ) : (
              <div>
                {originalPrice > 0 && (
                  <div className="flex items-center gap-1 leading-none mb-0.5">
                    <span className="text-[9px] md:text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
                    <span className="bg-[#ff6e0b] text-white text-[8px] md:text-[9px] font-bold px-1 rounded">15% OFF</span>
                  </div>
                )}
                <div className="flex flex-col md:flex-row md:items-baseline gap-0.5 leading-tight">
                  <span className="text-sm md:text-base lg:text-lg font-extrabold text-gray-900">₹{displayPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[7px] md:text-[9px] text-gray-400 font-medium">Starting price per adult</span>
                </div>
              </div>
            )}
          </div>

          <button className="bg-[#ff6e0b] hover:bg-[#e05f00] text-white font-semibold text-[3.8vw] md:text-xs lg:text-sm py-1.5 px-3 md:py-2 md:px-4 rounded-full transition-all flex-shrink-0 cursor-pointer shadow-sm hover:shadow-md animate-shimmer">
            View Details
          </button>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .animate-shimmer {
          position: relative;
          overflow: hidden;
        }
        .animate-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-150%) skewX(-25deg);
          animation: shimmer-sweep 2.2s infinite ease-in-out;
          pointer-events: none;
          z-index: 10;
        }
      `}} />
    </div>
  )
}
