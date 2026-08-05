'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import type { Trip } from '@/lib/data'
import { gtag } from '@/lib/gtag'

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
}: TripCardProps) {
  const [callbackOpen, setCallbackOpen] = useState(false)
  const ignoreClickRef = useRef(false)

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
  const routeSummary = itinerary?.length
    ? itinerary.slice(0, 4).map((day) => `${day.day}D ${day.title}`).join(' • ') + (itinerary.length > 4 ? ` • +${itinerary.length - 4}` : '')
    : destination

  const staySummary = getStaySummary(itinerary)

  return (
    <div
      onClick={() => {
        if (callbackOpen || ignoreClickRef.current) return
        gtag.event({
          action: 'click',
          category: 'Navigation',
          label: `Trip Card: ${title}`,
        });
        window.open(`/trips/${slug}`, '_blank')
      }}
      className="group relative overflow-hidden rounded-lg shadow-xl h-[50vh] md:h-[60vh] cursor-pointer"
    >
      {/* IMAGE */}
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />

      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      {/* TOP PRICE BADGE */}
      <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
        {showGetQuoteOnly || displayPrice === 0 ? 'Get Quote' : `₹${displayPrice.toLocaleString('en-IN')} onwards`}
      </div>

      {/* BOTTOM CONTENT */}
      <div className="absolute bottom-0 w-full p-4 text-white">

        {/* TITLE */}
        <h3 className="text-md font-bold leading-snug line-clamp-2">
          {title}
        </h3>

        {/* ROUTE / TAG */}
        <p className="text-xs text-gray-300 mt-1 line-clamp-1">
          {routeSummary}
        </p>

        {/* STAY SUMMARY */}
        {staySummary && (
          <p className="text-xs text-sky-400 font-semibold mt-1 line-clamp-1">
            {staySummary}
          </p>
        )}

        {/* DETAILS ROW */}
        <div className="flex items-center justify-between mt-2.5 text-xs">
          <span>🕒 {duration}D / {duration - 1}N</span>
          <span>⭐ {rating.toFixed(1)}</span>
        </div>

        {/* DATE / LOCATION */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
          <span>{destination}</span>
        </div>
      </div>
    </div>
  )
}
