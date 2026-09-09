'use client'

import { TripReviewsSection } from '@/components/trip-reviews-section'
import { useState, useMemo, useEffect, useRef, use } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { TripHeroCarousel } from '@/components/trip-hero-carousel'
import { RequestCallbackDialog } from '@/components/request-callback-dialog'
import { DownloadTourPdfDialog } from '@/components/download-tour-pdf-dialog'
import { RiWhatsappLine } from 'react-icons/ri'
import { trips } from '@/lib/data'
import { destinationItineraryImages } from '@/lib/section-mappings'
import { MapPin, Calendar, Users, Star, Phone, MessageCircle, ChevronDown, Download, X, Check, ChevronLeft, ChevronRight, Car, Hotel, Camera, Utensils, Plane, Building2, FileText, User, Share2, Sparkles, Compass } from 'lucide-react'
import { contactEmail, contactPhone, contactPhoneDisplay, instagramUrl } from '@/lib/contact'
import { TripGallerySection } from '@/components/trip-gallery-section'
import Image from 'next/image'


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
  if (lower.includes('phu quoc') || lower === 'phu') return 'Phu Quoc';
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
  if (lower.includes('cochin') || lower.includes('kochi')) return 'Kochi';
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
  if (lower.includes('phuentsholing') || lower.includes('phuntsholing')) return 'Phuentsholing';
  if (lower.includes('siliguri')) return 'Siliguri';
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

function getStaySummary(itinerary: any[]): string {
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

function getFirstNarrativeParagraph(description: string | string[]): string {
  if (!Array.isArray(description)) {
    return description
  }

  let inHighlights = false
  for (let i = 0; i < description.length; i++) {
    const item = description[i].trim()
    const lowerItem = item.toLowerCase()

    if (lowerItem.startsWith('highlights of the')) {
      inHighlights = true
      continue
    }

    if (inHighlights) {
      const isNarrative = item.length > 80 ||
        lowerItem.startsWith('arrive') ||
        lowerItem.startsWith('after') ||
        lowerItem.startsWith('today') ||
        lowerItem.startsWith('check out') ||
        lowerItem.startsWith('for ')

      if (isNarrative) {
        return item
      }
      continue
    }

    const isExcluded = lowerItem.startsWith('meals') ||
      lowerItem.startsWith('overnight') ||
      lowerItem === 'dinner' ||
      lowerItem === ' dinner' ||
      lowerItem.includes('breakfast')

    if (!isExcluded) {
      return item.replace(/^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i, '').trim()
    }
  }

  return description[0] ? description[0].replace(/^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i, '').trim() : ''
}


function parseDayForSummary(description: string | string[]) {
  const result = {
    transfers: [] as string[],
    hotels: [] as string[],
    sightseeing: [] as string[],
    meals: [] as string[]
  }

  if (!Array.isArray(description)) {
    return result
  }

  description.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()

    if (lower.startsWith('highlights of the')) return

    if (lower.startsWith('meals:') || lower.startsWith('meals :') || lower.includes('meals') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
      const foundMeals: string[] = []
      if (lower.includes('breakfast')) foundMeals.push('Breakfast')
      if (lower.includes('lunch')) foundMeals.push('Lunch')
      if (lower.includes('dinner')) foundMeals.push('Dinner')
      if (foundMeals.length > 0) {
        foundMeals.forEach(m => {
          if (!result.meals.includes(m)) result.meals.push(m)
        })
      } else {
        result.meals.push(trimmed.replace(/^meals\s*:\s*/i, '').trim())
      }
    } else if (
      lower.startsWith('accommodation:') || lower.startsWith('accommodation :') || lower.startsWith('hotel:') || lower.startsWith('hotels:') ||
      lower.includes('overnight stay') || lower.includes('stay in') || lower.includes('hotel') ||
      lower.includes('resort') || lower.includes('check-in') || lower.includes('check in') ||
      lower.includes('check out') || lower.includes('check-out') || lower.includes('camp')
    ) {
      const rawName = trimmed
        .replace(/^accommodation\s*:\s*/i, '')
        .replace(/^hotels?\s*:\s*/i, '')
        .replace(/overnight stay near/i, '')
        .replace(/overnight stay in/i, '')
        .replace(/overnight stay at/i, '')
        .replace(/overnight stay/i, '')
        .replace(/stay in/i, '')
        .replace(/check.in at/i, '')
        .replace(/^[:\s\-\.\,]+/, '')
        .replace(/[.\s]+$/, '')
        .trim();
      const hotelName = rawName || 'Hotel'
      if (!result.hotels.includes(hotelName)) result.hotels.push(hotelName)
    } else if (
      lower.startsWith('transfer:') || lower.startsWith('transfer :') || lower.startsWith('transfers:') ||
      lower.includes('transfer') || lower.includes('pick you up') || lower.includes('pick up') ||
      lower.includes('airport') || lower.includes('drive to') || lower.includes('travel to') ||
      lower.includes('proceed to') || lower.includes('reach') || lower.includes('railway') ||
      lower.includes('station') || lower.includes('cab')
    ) {
      const clean = trimmed.replace(/^transfers?\s*:\s*/i, '').trim()
      if (!result.transfers.includes(clean)) result.transfers.push(clean)
    } else {
      const clean = trimmed.replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences)\s*:\s*/i, '').trim()
      if (!result.sightseeing.includes(clean)) result.sightseeing.push(clean)
    }
  })

  return result
}

function parseDayItinerarySummary(day: { day: number; title: string; description: string | string[] }) {
  const transfers: string[] = []
  const experiences: string[] = []

  const lines = Array.isArray(day.description)
    ? day.description
    : typeof day.description === 'string'
      ? day.description.split('\n').filter(l => l.trim().length > 0)
      : []

  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()

    // Skip highlights header
    if (lower.startsWith('highlights of the')) return

    // Skip hotels / accommodation completely
    if (
      lower.startsWith('accommodation:') || lower.startsWith('accommodation :') ||
      lower.startsWith('hotel:') || lower.startsWith('hotels:') || lower.startsWith('stay:') ||
      lower.startsWith('stay in') || lower.startsWith('overnight stay')
    ) {
      return
    }

    // Skip meals
    if (lower.startsWith('meals:') || lower.startsWith('meal:') || lower.startsWith('meals :') || lower === 'meals included' || lower === 'dinner' || lower === 'breakfast') {
      return
    }

    // Check if transfer
    if (
      lower.startsWith('transfer:') || lower.startsWith('transfer :') || lower.startsWith('transfers:') ||
      lower.startsWith('transfers :') || lower.startsWith('pickup:') || lower.startsWith('drop:') ||
      lower.startsWith('flight:') || lower.startsWith('train:') ||
      lower.includes('airport transfer') || lower.includes('private transfer') ||
      lower.includes('sleeper bus transfer') || lower.includes('overnight train to') ||
      lower.includes('pick you up') || lower.includes('drop off at') ||
      lower.startsWith('drive to') || lower.startsWith('drive from') || lower.startsWith('travel to')
    ) {
      const clean = trimmed
        .replace(/^(transfer|transfers|pickup|drop|flight|train)\s*:\s*/i, '')
        .trim()
      if (clean && !transfers.includes(clean)) {
        transfers.push(clean)
      }
      return
    }

    // Sightseeing & Experiences
    const clean = trimmed
      .replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences|activity|experience)\s*:\s*/i, '')
      .trim()

    if (
      clean &&
      !lower.startsWith('overnight stay') &&
      !lower.startsWith('check-in') &&
      !lower.startsWith('check in') &&
      !experiences.includes(clean)
    ) {
      experiences.push(clean)
    }
  })

  // If no items were parsed (e.g. single narrative description), include the cleaned narrative as experience
  if (transfers.length === 0 && experiences.length === 0 && typeof day.description === 'string' && day.description.trim()) {
    experiences.push(day.description.trim())
  }

  return { transfers, experiences }
}

function getTripSummaryDetails(trip: typeof trips[0]) {
  if (trip.summaryDetails) {
    return {
      accommodation: trip.summaryDetails.accommodation || [],
      meals: trip.summaryDetails.meals || [],
      transfers: trip.summaryDetails.transfers || [],
      activities: trip.summaryDetails.activities || [],
    }
  }

  // Fallback: extract unique hotels, meals, transfers, activities from itinerary
  const hotelsList: string[] = []
  const transfersList: string[] = []
  const mealsList: string[] = []
  const activitiesList: string[] = []

  if (trip.itinerary && Array.isArray(trip.itinerary)) {
    trip.itinerary.forEach((day) => {
      const summary = parseDayForSummary(day.description)
      summary.hotels.forEach((h) => {
        if (!hotelsList.includes(h)) hotelsList.push(h)
      })
      summary.transfers.forEach((t) => {
        if (!transfersList.includes(t)) transfersList.push(t)
      })
      summary.meals.forEach((m) => {
        if (!mealsList.includes(m)) mealsList.push(m)
      })
      summary.sightseeing.forEach((s) => {
        if (!activitiesList.includes(s)) activitiesList.push(s)
      })
    })
  }

  const accommodation = trip.stays && trip.stays.length > 0
    ? trip.stays
    : hotelsList.length > 0
      ? hotelsList
      : trip.staySummary
        ? [trip.staySummary]
        : [`${Math.max(1, trip.duration - 1)} Nights Hotel Accommodation`]

  const meals = mealsList.length > 0
    ? mealsList
    : [`${Math.max(1, trip.duration - 1)} Breakfasts included as per plan`]

  const transfers = transfersList.length > 0
    ? transfersList
    : ['Airport pick-up, drop-off and all sightseeing transfers in private vehicle']

  const activities = trip.highlights && trip.highlights.length > 0
    ? trip.highlights
    : activitiesList

  return { accommodation, meals, transfers, activities }
}


function renderItineraryDescription(
  description: string | string[],
  day?: { day: number; title: string; description: string | string[]; image?: string },
  trip?: any
) {
  const lines = Array.isArray(description)
    ? description
    : typeof description === 'string'
      ? description.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

  const timelinePoints: { text: string; type: 'transfer' | 'experience' | 'activity' }[] = [];
  let accommodation: string | null = null;
  const meals: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    // Skip highlights section headers
    if (lower.startsWith('highlights of the')) return;

    // Check if Meals
    if (
      lower.startsWith('meals:') || lower.startsWith('meal:') || lower.startsWith('meals :') ||
      lower === 'meals included' || lower === 'dinner' || lower === 'breakfast'
    ) {
      const clean = trimmed.replace(/^meals?\s*:\s*/i, '').trim();
      if (clean) {
        if (clean.toLowerCase().includes('breakfast') && !meals.includes('Breakfast')) meals.push('Breakfast');
        if (clean.toLowerCase().includes('lunch') && !meals.includes('Lunch')) meals.push('Lunch');
        if (clean.toLowerCase().includes('dinner') && !meals.includes('Dinner')) meals.push('Dinner');
        if (meals.length === 0) meals.push(clean);
      }
      return;
    }

    // Check if Accommodation / Hotel
    if (
      lower.startsWith('accommodation:') || lower.startsWith('accommodation :') ||
      lower.startsWith('hotel:') || lower.startsWith('hotels:') ||
      lower.startsWith('stay:') || lower.startsWith('stay in')
    ) {
      const hotel = trimmed
        .replace(/^(accommodation|hotels?|stay)\s*:\s*/i, '')
        .replace(/^[:\s\-\.\,]+/, '')
        .replace(/[.\s]+$/, '')
        .trim();
      if (hotel && !accommodation) {
        accommodation = hotel;
      }
      return;
    }

    // Check if Transfer
    if (
      lower.startsWith('transfer:') || lower.startsWith('transfer :') || lower.startsWith('transfers:') ||
      lower.startsWith('transfers :') || lower.startsWith('pickup:') || lower.startsWith('drop:') ||
      lower.startsWith('flight:') || lower.startsWith('train:')
    ) {
      const clean = trimmed
        .replace(/^(transfer|transfers|pickup|drop|flight|train)\s*:\s*/i, '')
        .trim();
      if (clean) {
        timelinePoints.push({ text: clean, type: 'transfer' });
      }
      return;
    }

    // Check if Sightseeing / Experience
    if (
      lower.startsWith('sightseeing:') || lower.startsWith('sightseeing & experiences:') ||
      lower.startsWith('sightseeing & experiences :') || lower.startsWith('activities:') ||
      lower.startsWith('experiences:') || lower.startsWith('activity:') || lower.startsWith('experience:')
    ) {
      const clean = trimmed
        .replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences|activity|experience)\s*:\s*/i, '')
        .trim();
      if (clean) {
        timelinePoints.push({ text: clean, type: 'experience' });
      }
      return;
    }

    // Check if line is an overnight stay narrative (extract accommodation if not already set)
    if (
      !accommodation &&
      (lower.startsWith('overnight stay') || lower.includes('overnight stay in') || lower.includes('overnight stay at') || lower.includes('overnight stay near'))
    ) {
      const match = trimmed.match(/overnight stay\s+(?:in|at|near|into)?\s+([^.]+)/i);
      if (match && match[1]) {
        accommodation = match[1].trim();
      }
    }

    // Otherwise, general narrative/itinerary step
    const clean = trimmed
      .replace(/^(transfer|transfers|accommodation|hotels?|sightseeing(?:\s*&\s*experiences)?|activities|experiences|meals?)\s*:\s*/i, '')
      .trim();
    if (clean) {
      const isTransferLike = lower.includes('pick you up') || lower.includes('airport transfer') || lower.includes('drive to') || lower.includes('proceed to') || lower.includes('travel to');
      timelinePoints.push({ text: clean, type: isTransferLike ? 'transfer' : 'activity' });
    }
  });

  // Fallback for single text paragraph
  if (timelinePoints.length === 0 && typeof description === 'string' && description.trim()) {
    const sentences = description.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    sentences.forEach(s => {
      timelinePoints.push({ text: s.trim(), type: 'activity' });
    });
  }

  // Fallback for accommodation from trip.stays if available and not final departure day
  if (!accommodation && day && trip) {
    const dayNum = day.day || 1;
    const duration = trip.duration || trip.itinerary?.length || 1;
    if (dayNum < duration) {
      if (trip.stays && Array.isArray(trip.stays) && trip.stays.length > 0) {
        const stayIdx = Math.min(dayNum - 1, trip.stays.length - 1);
        const stayItem = trip.stays[stayIdx];
        if (typeof stayItem === 'string') {
          accommodation = stayItem;
        } else if (typeof stayItem === 'object' && stayItem !== null && (stayItem as any).hotel) {
          accommodation = `${(stayItem as any).hotel}${(stayItem as any).city ? ` (${(stayItem as any).city})` : ''}`;
        }
      }
    }
  }

  // Resolve Day Image
  let dayImage: string | null = day?.image || null;
  if (!dayImage && day && trip) {
    const catId = trip?.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || '';
    const customImages = destinationItineraryImages[catId];
    if (customImages && customImages.length > 0) {
      dayImage = customImages[(day.day - 1) % customImages.length];
    } else if (trip?.images && trip.images.length > 0) {
      dayImage = trip.images[(day.day - 1) % trip.images.length];
    } else if (trip?.galleryImages && trip.galleryImages.length > 0) {
      dayImage = trip.galleryImages[(day.day - 1) % trip.galleryImages.length]?.src;
    } else if (trip?.image) {
      dayImage = trip.image;
    }
  }

  if (timelinePoints.length === 0 && !accommodation) {
    return (
      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
        {lines.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden pt-3 pb-1 space-y-3.5">
      {/* Top Section: Flowchart Timeline (Left) + Horizontal Day Image (Right) */}
      <div className="w-full min-w-0 max-w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
        {/* Left Column: Vertical Flow Chart / Timeline */}
        <div className="w-full min-w-0 max-w-full space-y-0 relative pl-1 sm:pl-2">
          {timelinePoints.map((item, idx) => {
            const isLast = idx === timelinePoints.length - 1;
            return (
              <div key={idx} className="relative flex items-start gap-2.5 sm:gap-3.5 group min-w-0 w-full max-w-full">
                {/* Timeline Line & Node */}
                <div className="flex flex-col items-center self-stretch shrink-0">
                  {/* Dot */}
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 group-hover:bg-[#ff5d09] group-hover:scale-125 transition-all mt-1.5 shrink-0 ring-4 ring-slate-100 group-hover:ring-orange-100" />
                  {/* Vertical Connecting Line (dashed) */}
                  {!isLast && (
                    <div className="w-0.5 grow border-l-2 border-dashed border-slate-300 my-1 group-hover:border-orange-300 transition-colors" />
                  )}
                </div>

                {/* Text Content */}
                <div className={`min-w-0 flex-1 max-w-full ${isLast ? 'pb-1' : 'pb-3.5 sm:pb-4'}`}>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed group-hover:text-slate-950 transition-colors break-words">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Horizontal Day Featured Image */}
        {dayImage && (
          <div className="w-full md:w-64 lg:w-72 shrink-0 aspect-[16/10] relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 bg-slate-100 group max-w-full">
            <Image
              src={dayImage}
              alt={day?.title || `Day ${day?.day || 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
          </div>
        )}
      </div>

      {/* Bottom Section: Accommodation Card */}
      {accommodation && (
        <div className="w-full min-w-0 max-w-full bg-white border border-slate-200 rounded-2xl p-3 sm:p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex items-center justify-between gap-2.5 sm:gap-3 flex-wrap mt-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 max-w-full">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/10 border border-amber-200/50 flex items-center justify-center shrink-0">
              <img src="/images/hotel-icon.png" alt="Hotel" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block mb-0.5">
                Accommodation
              </span>
              <p className="font-bold text-slate-800 text-xs sm:text-sm truncate break-words">
                {accommodation}
              </p>
            </div>
          </div>

          {/* Meals badge if available */}
          {meals.length > 0 && (
            <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/70 text-emerald-700 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold shrink-0">
              <Utensils size={12} className="shrink-0 text-emerald-600" />
              <span>Meals: {meals.join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


const SwipeButton = ({ onSwipeComplete, text = "Slide to Book" }: { onSwipeComplete: () => void, text?: string }) => {
  const [isSwiped, setIsSwiped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);

  // Handle Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSwiped) return;
    isDragging.current = true;
    startX.current = e.touches[0].clientX - dragX;
  };

  // Handle Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSwiped) return;
    isDragging.current = true;
    startX.current = e.clientX - dragX;
  };

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging.current || !containerRef.current || !thumbRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const thumbWidth = thumbRef.current.clientWidth;
      const maxDrag = containerWidth - thumbWidth - 8; // padding

      let currentDrag = clientX - startX.current;
      if (currentDrag < 0) currentDrag = 0;
      if (currentDrag > maxDrag) currentDrag = maxDrag;

      setDragX(currentDrag);

      // Check if threshold is reached (e.g. 90% of max drag)
      if (currentDrag >= maxDrag * 0.9) {
        setIsSwiped(true);
        isDragging.current = false;
        setDragX(maxDrag);
        onSwipeComplete();
        // Reset after a delay
        setTimeout(() => {
          setIsSwiped(false);
          setDragX(0);
        }, 3000);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      handleMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleEnd = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (!isSwiped) {
        // Snap back
        setDragX(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isSwiped, onSwipeComplete]);

  return (
    <div
      ref={containerRef}
      className="relative h-14 bg-slate-100 rounded-full p-1 flex items-center justify-start overflow-hidden border border-slate-200 select-none w-full"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-image: linear-gradient(120deg, #94a3b8 25%, #1e293b 50%, #94a3b8 75%);
          background-size: 200% auto;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      {/* Background fill based on drag */}
      <div
        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-20 transition-all duration-75"
        style={{ width: `${dragX + 28}px` }}
      />

      {/* Shimmering Swipe text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xs font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-slate-400 via-slate-700 to-slate-400 bg-[length:200%_auto] animate-shimmer text-center">
          {isSwiped ? "Redirecting..." : text}
        </span>
      </div>

      {/* Slidable thumb */}
      <div
        ref={thumbRef}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        style={{ transform: `translateX(${dragX}px)` }}
        className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing z-10 transition-transform duration-75 select-none"
      >
        {isSwiped ? (
          <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <ChevronRight className="w-6 h-6 text-white animate-pulse" />
        )}
      </div>
    </div>
  );
};

interface PageProps {
  params?: Promise<{ slug: string }> | { slug: string }
}

export default function CatchAllTripDetailPage({ params }: PageProps = {}) {
  type SelectionItem = {
    name: string
    price: number
  }

  const [selections, setSelections] = useState<SelectionItem[]>([])
  const [showFullDesc, setShowFullDesc] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const clientParams = useParams()

  // Safely unwrap params if it is a Promise, otherwise use it directly or fallback to useParams()
  let resolvedParams: any = null
  if (params) {
    if (params instanceof Promise || typeof (params as any).then === 'function') {
      resolvedParams = use(params as Promise<any>)
    } else {
      resolvedParams = params
    }
  }

  const slug = (resolvedParams?.slug || clientParams?.slug) as string | undefined
  console.log("=== CATCH-ALL TRIP PAGE RENDERING ===", { slug, resolvedParams, clientParams })
  const total = selections.reduce((sum, item) => sum + item.price, 0)
  const trip = useMemo(() => slug ? trips.find(t => t.slug === slug) : undefined, [slug])

  // Calculate lowest price from costing table
  const lowestPrice = useMemo(() => {
    if (!trip?.costingDetails || trip.costingDetails.length === 0) {
      return trip?.price || 0
    }

    const prices = trip.costingDetails
      .map(item => {
        // Extract numeric value from price strings like "₹35,000"
        const match = item.value.match(/[\d,]+/)
        return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0
      })
      .filter(price => price > 0)

    return prices.length > 0 ? Math.min(...prices) : trip.price || 0
  }, [trip])

  const [callbackOpen, setCallbackOpen] = useState(false)
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [expandedSummaryDays, setExpandedSummaryDays] = useState<number[]>([1])
  const [activeSummaryDropdown, setActiveSummaryDropdown] = useState<string | null>(null)
  const [expandedSummarySections, setExpandedSummarySections] = useState<string[]>([
    'itinerary',
    'accommodation',
    'meals',
    'transfers',
    'activities'
  ])

  const toggleSummaryDay = (dayNum: number) => {
    setExpandedSummaryDays(prev =>
      prev.includes(dayNum) ? prev.filter(d => d !== dayNum) : [...prev, dayNum]
    )
  }

  const toggleSummarySection = (section: string) => {
    setExpandedSummarySections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  const [activeTab, setActiveTab] = useState('summary')
  const [activeDay, setActiveDay] = useState(1)
  const [isClient, setIsClient] = useState(false)
  const tabContainerRef = useRef<HTMLDivElement>(null)
  const activeTabRef = useRef(activeTab)
  const router = useRouter()

  // Sidebar Callback Form States
  const [inquiryPhone, setInquiryPhone] = useState('')
  const [inquiryEmail, setInquiryEmail] = useState('')
  const [inquiryAgreed, setInquiryAgreed] = useState(false)
  const [inquirySubmitting, setInquirySubmitting] = useState(false)
  const [inquirySuccess, setInquirySuccess] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inquiryPhone) return
    setInquirySubmitting(true)
    try {
      const res = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: inquiryPhone,
          email: inquiryEmail,
          tripTitle: trip?.title,
          tripSlug: trip?.slug,
          price: lowestPrice || trip?.price,
          source: 'Sidebar Callback Form'
        })
      })
      if (res.ok) {
        setInquirySuccess(true)
        setInquiryPhone('')
        setInquiryEmail('')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setInquirySubmitting(false)
    }
  }

  const [notification, setNotification] = useState<string | null>(null)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [downloadPdfModalOpen, setDownloadPdfModalOpen] = useState(false)

  const showNotification = (message: string) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 3000)
  }

  const handleShare = async () => {
    const shareText = `Check out ${trip?.title} on Wanderphilia.`
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: trip?.title,
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    }

    if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        showNotification('Link copied to clipboard!')
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        if (typeof window !== 'undefined') {
          window.prompt('Copy this link:', shareUrl)
        }
      }
    } else {
      if (typeof window !== 'undefined') {
        window.prompt('Copy this link:', shareUrl)
      }
    }
  }

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return resolve()
      if (document.querySelector(`script[src="${src}"]`)) {
        return resolve()
      }
      const script = document.createElement('script')
      script.src = src
      script.async = true
      script.onload = () => resolve()
      script.onerror = (err) => reject(err)
      document.body.appendChild(script)
    })
  }

  const handleDownloadPDF = async (options?: { selectedMonth?: string; dateRange?: { from: string; to: string }; language?: string }) => {
    if (isGeneratingPdf) return
    setIsGeneratingPdf(true)
    try {
      // 1. Dynamically load jsPDF from CDN
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
      const globalWindow = window as any
      if (!globalWindow.jspdf || !globalWindow.jspdf.jsPDF) {
        throw new Error('jsPDF UMD global not found')
      }
      const jsPDFClass = globalWindow.jspdf.jsPDF

      // 2. Import the PDF generator and run it
      const { generateItineraryPDF } = await import('@/lib/pdf-generator')
      await generateItineraryPDF(trip, jsPDFClass, options)
      showNotification('Itinerary PDF downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      showNotification('Failed to generate PDF. Please try again.')
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handleBookNow = () => {
    if (!slug) return
    router.push(`/booking/package/${encodeURIComponent(slug)}`)
  }

  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [activeInclCat, setActiveInclCat] = useState('inclusions')

  useEffect(() => {
    if (!trip) return
    async function fetchGallery() {
      try {
        const response = await fetch('/api/gallery')
        if (response.ok) {
          const data = await response.json()
          const filtered = data.filter((img: any) => img.category === trip?.category?.toLowerCase())
          setGalleryImages(filtered.map((item: any) => item.image))
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchGallery()
  }, [trip])

  const heroMedia = useMemo(() => {
    if (!trip) return []
    return trip.heroMedia || [{ type: 'image' as const, src: trip.image, alt: trip.title }]
  }, [trip])

  const collageImages = useMemo(() => {
    if (!trip) return []

    // Check if there are custom images for this destination in the section-mappings file
    const catId = trip.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || ''
    const customImages = destinationItineraryImages[catId]

    if (customImages && customImages.length >= 4) {
      // Use the trip's main image as the first large image, and the 4 custom mapped images on the right
      const mainImg = heroMedia[0] || { type: 'image' as const, src: trip.image, alt: trip.title }
      return [
        mainImg,
        { type: 'image' as const, src: customImages[0], alt: `${trip.title} gallery 2` },
        { type: 'image' as const, src: customImages[1], alt: `${trip.title} gallery 3` },
        { type: 'image' as const, src: customImages[2], alt: `${trip.title} gallery 4` },
        { type: 'image' as const, src: customImages[3], alt: `${trip.title} gallery 5` },
      ]
    }

    const list = [...heroMedia]

    // Add specific trip images
    if (trip.images && trip.images.length > 0) {
      trip.images.forEach((img: string) => {
        if (!list.some(item => item.src === img)) {
          list.push({ type: 'image' as const, src: img, alt: trip.title })
        }
      })
    }

    // Add category-specific gallery images
    if (galleryImages.length > 0) {
      galleryImages.forEach((img: string) => {
        if (!list.some(item => item.src === img)) {
          list.push({ type: 'image' as const, src: img, alt: trip.title })
        }
      })
    }

    // Fallback: always use the trip's own card image — never use unrelated destination images
    const fallbacks = [trip.image]

    // First, try to add unique fallbacks
    for (const src of fallbacks) {
      if (list.length >= 5) break
      if (!list.some(item => item.src === src)) {
        list.push({ type: 'image' as const, src, alt: `${trip.title} gallery ${list.length + 1}` })
      }
    }

    // If still less than 5, fill with trip.image (better than unrelated images)
    while (list.length < 5) {
      list.push({ type: 'image' as const, src: trip.image, alt: `${trip.title} gallery ${list.length + 1}` })
    }
    return list.slice(0, 5)
  }, [heroMedia, trip, galleryImages])

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add('lightbox-open')
    } else {
      document.body.classList.remove('lightbox-open')
    }
    return () => {
      document.body.classList.remove('lightbox-open')
    }
  }, [lightboxIndex])

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  if (!slug) return null
  if (!trip) return notFound()

  const staySummary = trip.route || trip.staySummary || trip.customRoute || getStaySummary(trip.itinerary)

  const isGroup = trip.title.toLowerCase().includes('group')
  const isInte = trip.tripType === 'International'

  // const inclusionsList = [
  //   {
  //     id: 'flights',
  //     label: 'Flights',
  //     icon: <img src="/images/plane-icon.png" alt="Flights" className="w-full h-full object-contain p-1" />,
  //     optional: !isGroup,
  //   },
  //   {
  //     id: 'hotels',
  //     label: 'Hotels',
  //     icon: <img src="/images/hotel-icon.png" alt="Hotels" className="w-full h-full object-contain p-1" />,
  //     optional: false,
  //   },
  //   {
  //     id: 'sightseeing',
  //     label: 'Sightseeing',
  //     icon: <img src="/images/sighseeing-icon.png" alt="Sightseeing" className="w-full h-full object-contain p-1" />,
  //     optional: false,
  //   },
  //   {
  //     id: 'meals',
  //     label: 'Meal',
  //     icon: <img src="/images/meal-icon.png" alt="Meal" className="w-full h-full object-contain p-1" />,
  //     optional: false,
  //   },
  // ]

  // if (isInte) {
  //   inclusionsList.push({
  //     id: 'visa',
  //     label: 'Visa',
  //     icon: <FileText className="text-indigo-500 w-full h-full p-1" />,
  //     optional: false,
  //   })
  // }

  // if (isGroup) {
  //   inclusionsList.push({
  //     id: 'manager',
  //     label: 'Tour Manager',
  //     icon: <img src="/images/manager-icon.png" alt="Tour Manager" className="w-full h-full object-contain p-1" />,
  //     optional: false,
  //   })
  // }

  const scrollActiveTabIntoView = (tabId: string) => {
    if (typeof window === 'undefined' || !tabContainerRef.current) return

    const container = tabContainerRef.current
    const activeTab = container.querySelector(`[data-tab-id="${tabId}"]`) as HTMLElement

    if (activeTab) {
      const containerRect = container.getBoundingClientRect()
      const tabRect = activeTab.getBoundingClientRect()

      const isTabVisible = tabRect.left >= containerRect.left &&
        tabRect.right <= containerRect.right

      if (!isTabVisible) {
        const scrollLeft = tabRect.left - containerRect.left - (containerRect.width / 2) + (tabRect.width / 2)
        container.scrollTo({
          left: container.scrollLeft + scrollLeft,
          behavior: 'smooth'
        })
      }
    }
  }

  const difficultyColor =
    trip.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
      trip.difficulty === 'Moderate' ? 'bg-amber-100 text-amber-700' :
        'bg-rose-100 text-rose-700'


  const toggleDay = (dayNum: number) => {
    setExpandedDays(prev =>
      prev.includes(dayNum)
        ? prev.filter(d => d !== dayNum)
        : [...prev, dayNum]
    )
  }



  const handleDayClick = (dayNum: number) => {
    if (!expandedDays.includes(dayNum)) {
      setExpandedDays(prev => [...prev, dayNum])
    }
    setActiveDay(dayNum)

    const el = document.getElementById(`itinerary-day-${dayNum}`)
    if (el) {
      const navbarHeight = 140
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    setIsClient(true)
    if (activeTab !== 'itinerary') return
    if (typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const dayNum = parseInt(entry.target.id.replace('itinerary-day-', ''), 10)
            if (!isNaN(dayNum)) {
              setActiveDay(dayNum)
            }
          }
        })
      },
      {
        rootMargin: '-10% 0px -60% 0px',
        threshold: [0.1, 0.5, 0.9]
      }
    )

    trip.itinerary.forEach((day) => {
      const el = document.getElementById(`itinerary-day-${day.day}`)
      if (el) {
        observer.observe(el)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [activeTab, trip.itinerary])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar forceWhiteDesktop={true} />

      {/* STICKY FLOATING TOP-RIGHT ACTION BUTTONS: WHATSAPP, SHARE & DOWNLOAD PDF (MOBILE ONLY) */}
      <div className="fixed top-25 right-6 z-50 flex md:hidden items-center gap-1.5">
        <a
          href={`https://wa.me/919217664099?text=${encodeURIComponent(`Hi! I am interested in ${trip.title}. Please share more details.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-200/90 flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:border-emerald-400 text-[#25D366] hover:text-emerald-600"
        >
          <RiWhatsappLine size={20} />
        </a>
        <button
          type="button"
          onClick={handleShare}
          title="Share Trip"
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-200/90 text-slate-700 hover:text-[#ff5d09] hover:border-orange-300 flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Share2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => setDownloadPdfModalOpen(true)}
          disabled={isGeneratingPdf}
          title="Download Itinerary PDF"
          className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-md hover:shadow-lg border border-slate-200/90 text-slate-700 hover:text-[#ff5d09] hover:border-orange-300 flex items-center justify-center transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {isGeneratingPdf ? (
            <svg className="w-4 h-4 text-[#ff5d09] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Download size={16} />
          )}
        </button>
      </div>

      <main className="grow">
        {/* HERO IMAGE — single if no gallery, collage if gallery exists */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-5 md:px-6 pt-24">
          {(() => {
            const catId = trip?.category?.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '-') || ''
            const customImages = destinationItineraryImages[catId]
            const hasCustomMappedGallery = customImages && customImages.length >= 4

            // True only when there are actual unique images beyond the lone trip.image
            const hasRealGallery =
              hasCustomMappedGallery ||
              (trip.heroMedia && trip.heroMedia.length > 1) ||
              (trip.images && trip.images.length > 0) ||
              galleryImages.length > 0;

            if (!hasRealGallery) {
              /* ── SINGLE IMAGE ── */
              return (
                <div
                  className="relative w-full h-64 sm:h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-xs cursor-pointer group"
                  onClick={() => setLightboxIndex(0)}
                >
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    sizes="100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
              );
            }

            /* ── 5-IMAGE COLLAGE ── */
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-64 sm:h-80 md:h-[450px] rounded-2xl overflow-hidden shadow-xs">
                {/* Image 1 (Left - Large) */}
                <div
                  onClick={() => setLightboxIndex(0)}
                  className="col-span-1 md:col-span-2 md:row-span-2 relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image
                    src={collageImages[0].src}
                    alt={collageImages[0].alt || trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-700"
                    priority
                  />
                </div>

                {/* Image 2 (Top Middle) */}
                <div
                  onClick={() => setLightboxIndex(1)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image src={collageImages[1].src} alt={collageImages[1].alt || 'Gallery 2'} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Image 3 (Top Right) */}
                <div
                  onClick={() => setLightboxIndex(2)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image src={collageImages[2].src} alt={collageImages[2].alt || 'Gallery 3'} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Image 4 (Bottom Middle) */}
                <div
                  onClick={() => setLightboxIndex(3)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image src={collageImages[3].src} alt={collageImages[3].alt || 'Gallery 4'} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>

                {/* Image 5 (Bottom Right) */}
                <div
                  onClick={() => setLightboxIndex(4)}
                  className="hidden md:block relative h-full w-full overflow-hidden cursor-pointer group"
                >
                  <Image src={collageImages[4].src} alt={collageImages[4].alt || 'Gallery 5'} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
            );
          })()}
        </div>



        <div className="max-w-6xl mx-auto px-4 sm:px-5 md:px-0 py-3 sm:py-5">
          <div className="grid lg:grid-cols-[2.5fr_1fr] gap-4 sm:gap-6 lg:gap-8">
            {/* LEFT CONTENT */}
            <div className="space-y-3.5 sm:space-y-4 min-w-0 w-full overflow-hidden">
              {/* HEADER SECTION (Always visible) */}
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  {trip.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2.5 text-slate-600 mb-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={15} className="shrink-0" />
                    <span>{trip.destination}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={15} className="shrink-0" />
                    <span>
                      {trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration}D`}
                    </span>
                  </div>
                </div>

                {/* Stay Summary / Route */}
                {staySummary && (
                  <p className="text-[11px] sm:text-xs font-semibold text-[#ff5d09] mb-2.5 uppercase tracking-wider bg-orange-50 w-fit px-2.5 py-0.5 rounded-md border border-orange-100/60 shadow-3xs">
                    {staySummary.replace(/\s*[-•]\s*/g, ' • ')}
                  </p>
                )}

                {/* <div className="flex flex-wrap gap-3">
                  <Badge className={`${difficultyColor} text-xs sm:text-sm px-3 py-1`}>
                    {trip.difficulty}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 text-xs sm:text-sm px-3 py-1">
                    <Users size={14} className="mr-1" /> {trip.groupSize}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 text-xs sm:text-sm px-3 py-1">
                    <Star size={14} className="mr-1" /> {trip.rating}
                  </Badge>
                </div> */}

                {/* INCLUSIONS ICONS ROW */}
                {/* <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 pt-4 border-t border-slate-100">
                  {inclusionsList.map((inc) => (
                    <div key={inc.id} className="relative flex flex-col items-center p-2 rounded-xl bg-gray-50 border border-gray-100 min-w-[76px] sm:min-w-[84px]">
                      {inc.optional && (
                        <span className="absolute -top-1.5 bg-yellow-300 text-black text-[7px] font-black px-1.5 py-0.2 rounded uppercase border border-white leading-none scale-90">
                          Optional
                        </span>
                      )}
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-white border border-slate-100 flex items-center justify-center mb-1.5 shadow-3xs">
                        {inc.icon}
                      </div>
                      <span className="text-[10px] sm:text-xs text-gray-500 text-center font-bold">
                        {inc.label}
                      </span>
                    </div>
                  ))}
                </div> */}
              </div>

              {/* STICKY TAB NAVBAR */}
              <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
                <div className="flex items-center justify-between w-full">
                  <div
                    ref={tabContainerRef}
                    className="flex overflow-x-auto gap-2 sm:gap-4 py-0 scrollbar-hide pr-32 md:pr-0"
                  >
                    {[
                      { id: 'summary', label: 'Summary' },
                      { id: 'itinerary', label: 'Itinerary' },
                      { id: 'highlights', label: 'Activities & Experiences' },
                      { id: 'inclusions', label: 'Inclusions & Exclusions' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab.id
                          ? 'border-primary text-primary font-bold'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="hidden md:flex items-center gap-1 sm:gap-2 pr-2 sm:pr-4 shrink-0">
                    <a
                      href={`https://wa.me/919217664099?text=${encodeURIComponent(`Hi! I am interested in ${trip.title}. Please share more details.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 hover:bg-emerald-50 rounded-md transition-colors"
                    >
                      <RiWhatsappLine size={17} className="text-[#25D366]" />
                      <span className="hidden md:inline">WhatsApp</span>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-slate-950 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2 sm:px-3"
                      onClick={handleShare}
                    >
                      <Share2 size={16} />
                      <span className="hidden md:inline">Share</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isGeneratingPdf}
                      className="text-slate-600 hover:text-slate-950 font-semibold flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm px-2 sm:px-3 disabled:opacity-50"
                      onClick={() => setDownloadPdfModalOpen(true)}
                    >
                      {isGeneratingPdf ? (
                        <svg className="w-4 h-4 text-slate-600 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <Download size={16} />
                      )}
                      <span className="hidden md:inline">{isGeneratingPdf ? 'Downloading...' : 'Download'}</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* TABS CONTENT RENDERING */}

              {activeTab === 'itinerary' && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-xl font-bold mb-4">Detailed Day-wise Itinerary</h2>

                  <div className="flex gap-5 items-start">
                    {/* Left Sticky Vertical Menu */}
                    <div className="hidden md:block w-32 shrink-0 sticky top-36 self-start space-y-1.5 pr-2.5 border-r border-slate-200">
                      {trip.itinerary.map((day) => (
                        <button
                          key={day.day}
                          onClick={() => handleDayClick(day.day)}
                          className={`w-full text-left py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${activeDay === day.day
                            ? 'bg-primary/10 text-primary border-l-4 border-primary pl-2'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          Day {day.day}
                        </button>
                      ))}
                    </div>

                    {/* Right Scrollable Accordion Cards */}
                    <div className="grow min-w-0 w-full max-w-full space-y-3.5 relative pl-0 border-l border-slate-200/70 border-dashed md:border-0 md:pl-0 overflow-hidden">
                      {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 ? (
                        trip.itinerary.map((day) => (
                          <div
                            key={day.day}
                            id={`itinerary-day-${day.day}`}
                            className={`border rounded-2xl overflow-hidden hover:shadow-xs transition-all duration-300 bg-white min-w-0 w-full max-w-full ${activeDay === day.day ? 'border-primary/50 shadow-xs' : 'border-slate-200'
                              }`}
                          >
                            <button
                              onClick={() => toggleDay(day.day)}
                              className="w-full flex items-start justify-between p-3.5 sm:p-5 bg-white hover:bg-slate-50/50 transition-colors text-left"
                            >
                              <div className="flex items-start gap-2.5 sm:gap-3.5 grow min-w-0">
                                <div className="shrink-0 mt-0.5">
                                  <Badge className="bg-primary/10 text-primary hover:bg-primary/15 text-[10px] font-bold px-2 py-0.5">
                                    Day {day.day}
                                  </Badge>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-sm sm:text-base text-slate-900 break-words">
                                    {day.title}
                                  </h3>
                                  {!expandedDays.includes(day.day) && (
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">
                                      {getFirstNarrativeParagraph(day.description)}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`shrink-0 ml-2 mt-1 text-slate-400 transition-transform ${expandedDays.includes(day.day) ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {expandedDays.includes(day.day) && (
                              <div className="px-3 sm:px-5 pb-3.5 sm:pb-5 bg-white border-t border-slate-100 min-w-0 w-full max-w-full overflow-hidden">
                                {renderItineraryDescription(day.description, day, trip)}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-600">
                          Itinerary details will be available shortly.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inclusions' && (() => {
                const inclCategories = [
                  { id: 'inclusions', label: 'Inclusions', icon: '✓' },
                  { id: 'hotels', label: 'Hotels', icon: '🏨' },
                  { id: 'sightseeing', label: 'Sightseeing', icon: '📸' },
                  { id: 'meals', label: 'Meals', icon: '🍽️' },
                  { id: 'transfer', label: 'Transfer', icon: '🚗' },
                  { id: 'exclusions', label: 'Exclusions', icon: '✕' },
                  { id: 'payment', label: 'Payment Policy', icon: '💳' },
                  { id: 'cancellation', label: 'Cancellation Policy', icon: '📝' },
                ];

                function categorise(items: string[]) {
                  const r: Record<string, string[]> = { hotels: [], sightseeing: [], meals: [], transfer: [] };
                  items.forEach(item => {
                    const l = item.toLowerCase();
                    if (l.includes('stay') || l.includes('hotel') || l.includes('camp') || l.includes('resort') || l.includes('accommodation') || l.includes('night')) {
                      r.hotels.push(item);
                    }
                    if (l.includes('sightseeing') || l.includes('visit') || l.includes('tour') || l.includes('excursion') || l.includes('trek') || l.includes('safari') || l.includes('entry') || l.includes('permit') || l.includes('guide') || l.includes('cable car') || l.includes('ride') || l.includes('bridge') || l.includes('cave') || l.includes('trail') || l.includes('shooting') || l.includes('boattrip') || l.includes('boat')) {
                      r.sightseeing.push(item);
                    }
                    if (l.includes('meal') || l.includes('breakfast') || l.includes('lunch') || l.includes('dinner') || l.includes('food') || l.includes('beverage') || l.includes('water') || l.includes('tea') || l.includes('coffee')) {
                      r.meals.push(item);
                    }
                    if (l.includes('transfer') || l.includes('cab') || l.includes('transport') || l.includes('vehicle') || l.includes('driver') || l.includes('pick') || l.includes('drop') || l.includes('taxi') || l.includes('bus') || l.includes('flight') || l.includes('train') || l.includes('airport') || l.includes('minibus')) {
                      r.transfer.push(item);
                    }
                  });
                  return r;
                }

                const incl = categorise(trip.included);
                const excl = categorise(trip.notIncluded);
                const curIncl = (() => {
                  const list = [...(incl[activeInclCat] || [])];
                  if (activeInclCat === 'meals' && trip.summaryDetails?.meals && trip.summaryDetails.meals.length > 0) {
                    trip.summaryDetails.meals.forEach((m: string) => {
                      if (!list.some(existing => existing.toLowerCase().includes(m.toLowerCase()))) {
                        list.unshift(m);
                      }
                    });
                  }
                  return list;
                })();
                const curExcl = excl[activeInclCat] || [];
                const activeMeta = inclCategories.find(c => c.id === activeInclCat);

                return (
                  <div className="animate-in fade-in duration-300 w-full min-w-0">
                    <div className="flex gap-0 md:gap-6 items-start flex-col md:flex-row w-full min-w-0">

                      {/* LEFT — vertical category nav (desktop) */}
                      <div className="hidden md:flex flex-col w-36 shrink-0 sticky top-36 self-start border-r border-slate-200">
                        {inclCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setActiveInclCat(cat.id)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-semibold border-l-2 transition-all cursor-pointer ${activeInclCat === cat.id
                              ? 'border-orange-400 text-orange-500 bg-orange-50/60'
                              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* Mobile Accordions (mobile only) */}
                      <div className="block md:hidden space-y-3 w-full min-w-0">
                        {inclCategories.map(cat => {
                          const isExpanded = activeInclCat === cat.id;
                          const curCatIncl = (() => {
                            const list = [...(incl[cat.id] || [])];
                            if (cat.id === 'meals' && trip.summaryDetails?.meals && trip.summaryDetails.meals.length > 0) {
                              trip.summaryDetails.meals.forEach((m: string) => {
                                if (!list.some(existing => existing.toLowerCase().includes(m.toLowerCase()))) {
                                  list.unshift(m);
                                }
                              });
                            }
                            return list;
                          })();
                          return (
                            <div key={cat.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
                              {/* Accordion Trigger */}
                              <button
                                onClick={() => setActiveInclCat(activeInclCat === cat.id ? '' : cat.id)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="text-base shrink-0 font-bold">{cat.icon}</span>
                                  <span>{cat.label}</span>
                                </span>
                                <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Accordion Content */}
                              {isExpanded && (
                                <div className="px-5 py-4 space-y-3 border-t border-slate-100 bg-white">
                                  {/* Special All Inclusions rendering */}
                                  {cat.id === 'inclusions' ? (
                                    trip.included && trip.included.length > 0 ? (
                                      trip.included.map((item, i) => (
                                        <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                                          <span>{item}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-slate-400 italic">No inclusions listed.</p>
                                    )
                                  ) : cat.id === 'hotels' ? (
                                    trip.stays && trip.stays.length > 0 ? (
                                      trip.stays.map((stay, i) => (
                                        <div key={i} className="flex gap-2.5 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                          <span className="text-indigo-500 shrink-0 mt-0.5">🏨</span>
                                          <span className="font-semibold text-slate-800">{stay}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-slate-400 italic">Hotel details will be available shortly.</p>
                                    )
                                  ) : cat.id === 'exclusions' ? (
                                    trip.notIncluded.map((item, i) => (
                                      <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                                        <span>{item}</span>
                                      </div>
                                    ))
                                  ) : cat.id === 'payment' ? (
                                    trip.paymentPolicy && trip.paymentPolicy.length > 0 ? trip.paymentPolicy.map((item, i) => (
                                      <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </div>
                                    )) : (
                                      <p className="text-sm text-slate-400 italic">Standard payment terms apply.</p>
                                    )
                                  ) : cat.id === 'cancellation' ? (
                                    trip.cancellationPolicy && trip.cancellationPolicy.length > 0 ? trip.cancellationPolicy.map((item, i) => (
                                      <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </div>
                                    )) : (
                                      <p className="text-sm text-slate-400 italic">Standard cancellation policy applies.</p>
                                    )
                                  ) : (
                                    /* Standard category inclusions */
                                    curCatIncl.length > 0 ? curCatIncl.map((item, i) => (
                                      <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                                        <span>{item}</span>
                                      </div>
                                    )) : (
                                      <p className="text-sm text-slate-400 italic">No specific {cat.label.toLowerCase()} inclusions listed.</p>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* RIGHT — content cards (desktop only) */}
                      <div className="hidden md:block grow space-y-4 min-w-0 w-full">

                        {/* All Inclusions card */}
                        {activeInclCat === 'inclusions' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base font-bold">✓</span>
                              <h3 className="font-bold text-sm tracking-wide">Inclusions</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {trip.included && trip.included.length > 0 ? (
                                trip.included.map((item, i) => (
                                  <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                                    <span>{item}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-400 italic">No inclusions listed.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Hotels card — only show stays */}
                        {activeInclCat === 'hotels' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base">🏨</span>
                              <h3 className="font-bold text-sm tracking-wide">Hotels</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {trip.stays && trip.stays.length > 0 ? (
                                trip.stays.map((stay, i) => (
                                  <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                    <span className="text-indigo-500 shrink-0 mt-0.5">🏨</span>
                                    <span className="font-semibold text-slate-800">{stay}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-400 italic">Hotel details will be available shortly.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Category card (Sightseeing, Meals, Transfer) */}
                        {activeInclCat !== 'inclusions' && activeInclCat !== 'hotels' && activeInclCat !== 'exclusions' && activeInclCat !== 'payment' && activeInclCat !== 'cancellation' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base">{activeMeta?.icon}</span>
                              <h3 className="font-bold text-sm tracking-wide">{activeMeta?.label}</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {curIncl.length > 0 ? curIncl.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                                  <span>{item}</span>
                                </div>
                              )) : (
                                <p className="text-sm text-slate-400 italic">No specific {activeMeta?.label.toLowerCase()} inclusions listed.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Payment policy card */}
                        {activeInclCat === 'payment' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base">💳</span>
                              <h3 className="font-bold text-sm tracking-wide">Payment Policy</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {trip.paymentPolicy && trip.paymentPolicy.length > 0 ? trip.paymentPolicy.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                  <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                                  <span>{item}</span>
                                </div>
                              )) : (
                                <p className="text-sm text-slate-400 italic">Standard payment terms apply.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Cancellation policy card */}
                        {activeInclCat === 'cancellation' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base">📝</span>
                              <h3 className="font-bold text-sm tracking-wide">Cancellation Policy</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {trip.cancellationPolicy && trip.cancellationPolicy.length > 0 ? trip.cancellationPolicy.map((item, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                                  <span>{item}</span>
                                </div>
                              )) : (
                                <p className="text-sm text-slate-400 italic">Standard cancellation policy applies.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Exclusions card */}
                        {(activeInclCat === 'exclusions' || curExcl.length > 0) && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-rose-500 to-rose-400 text-white">
                              <span className="text-base">✕</span>
                              <h3 className="font-bold text-sm tracking-wide">Exclusions</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {(activeInclCat === 'exclusions' ? trip.notIncluded : curExcl).map((item, i) => (
                                <div key={i} className="flex gap-3 items-start text-sm text-slate-700 leading-relaxed border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'summary' && (() => {
                const summaryOverview = getTripSummaryDetails(trip);
                const isItinOpen = expandedSummarySections.includes('itinerary');
                const isAccOpen = expandedSummarySections.includes('accommodation');
                const isMealsOpen = expandedSummarySections.includes('meals');
                const isTransOpen = expandedSummarySections.includes('transfers');
                const isActOpen = expandedSummarySections.includes('activities');

                const activitiesCount = (() => {
                  if (trip.inclusionsSummary?.experiences && typeof trip.inclusionsSummary.experiences === 'number') {
                    return trip.inclusionsSummary.experiences;
                  }
                  if (summaryOverview.activities && summaryOverview.activities.length > 0) {
                    if (typeof summaryOverview.activities[0] === 'object' && 'items' in (summaryOverview.activities[0] as any)) {
                      return (summaryOverview.activities as any[]).reduce((sum, g) => sum + (g.items?.length || 0), 0);
                    }
                    return summaryOverview.activities.length;
                  }
                  return trip.highlights?.length || 0;
                })();

                const transfersCount = (() => {
                  if (trip.inclusionsSummary?.transfers && typeof trip.inclusionsSummary.transfers === 'number') {
                    return trip.inclusionsSummary.transfers;
                  }
                  if (trip.itinerary && Array.isArray(trip.itinerary)) {
                    const dayTransfers = trip.itinerary.reduce((sum, day) => sum + parseDayItinerarySummary(day).transfers.length, 0);
                    if (dayTransfers > 0) return dayTransfers;
                  }
                  return summaryOverview.transfers.length || 0;
                })();

                const hotelsCount = (() => {
                  if (trip.inclusionsSummary?.hotels && typeof trip.inclusionsSummary.hotels === 'number') {
                    return trip.inclusionsSummary.hotels;
                  }
                  return summaryOverview.accommodation.length || (trip.stays ? trip.stays.length : 0) || 1;
                })();

                const mealsCount = (() => {
                  if (trip.inclusionsSummary?.meals && typeof trip.inclusionsSummary.meals === 'number') {
                    return trip.inclusionsSummary.meals;
                  }
                  if (summaryOverview.meals && summaryOverview.meals.length > 0) {
                    const mealNum = summaryOverview.meals[0].match(/\d+/);
                    if (mealNum) return parseInt(mealNum[0], 10);
                    return summaryOverview.meals.length;
                  }
                  return Math.max(1, trip.duration - 1);
                })();

                return (
                  <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-300">
                    {/* TRIP SUMMARY CONTENT */}
                    {trip.itinerary && trip.itinerary.length > 0 && (
                      <div className="space-y-2.5">
                        {/* 4 QUICK COUNT BUTTONS WITH NUMBERS */}
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pb-2 border-b border-slate-200/70">
                          {/* Activities Button */}
                          <button
                            type="button"
                            onClick={() => setActiveSummaryDropdown(prev => prev === 'activities' ? null : 'activities')}
                            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2 rounded-md text-xs font-semibold transition-all cursor-pointer shadow-3xs ${activeSummaryDropdown === 'activities'
                              ? 'bg-[#ff5d09] text-white border border-[#ff5d09]'
                              : 'bg-slate-200 text-black border border-slate-200/90 hover:border-orange-300 hover:text-[#ff5d09]'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Sparkles size={13} className={`shrink-0 ${activeSummaryDropdown === 'activities' ? 'text-white' : 'text-[#ff5d09]'}`} />
                              <span className="truncate">{activitiesCount} Activities</span>
                            </div>
                            <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${activeSummaryDropdown === 'activities' ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Transfers Button */}
                          <button
                            type="button"
                            onClick={() => setActiveSummaryDropdown(prev => prev === 'transfers' ? null : 'transfers')}
                            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer shadow-3xs ${activeSummaryDropdown === 'transfers'
                              ? 'bg-blue-600 text-white border border-blue-600'
                              : 'bg-slate-200 text-black border border-slate-200/90 hover:border-blue-300 hover:text-blue-600'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Car size={13} className={`shrink-0 ${activeSummaryDropdown === 'transfers' ? 'text-white' : 'text-blue-500'}`} />
                              <span className="truncate">{transfersCount} Transfers</span>
                            </div>
                            <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${activeSummaryDropdown === 'transfers' ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Meals Button */}
                          <button
                            type="button"
                            onClick={() => setActiveSummaryDropdown(prev => prev === 'meals' ? null : 'meals')}
                            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer shadow-3xs ${activeSummaryDropdown === 'meals'
                              ? 'bg-emerald-600 text-white border border-emerald-600'
                              : 'bg-slate-200 text-black border border-slate-200/90 hover:border-emerald-300 hover:text-emerald-600'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Utensils size={13} className={`shrink-0 ${activeSummaryDropdown === 'meals' ? 'text-white' : 'text-emerald-500'}`} />
                              <span className="truncate">{mealsCount} Meals</span>
                            </div>
                            <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${activeSummaryDropdown === 'meals' ? 'rotate-180' : ''}`} />
                          </button>

                          {/* Hotels Button */}
                          <button
                            type="button"
                            onClick={() => setActiveSummaryDropdown(prev => prev === 'hotels' ? null : 'hotels')}
                            className={`w-full sm:w-auto flex items-center justify-between sm:justify-start gap-1.5 px-2.5 sm:px-3 py-2 rounded-md text-xs font-bold transition-all cursor-pointer shadow-3xs ${activeSummaryDropdown === 'hotels'
                              ? 'bg-indigo-600 text-white border border-indigo-600'
                              : 'bg-slate-200 text-black border border-slate-200/90 hover:border-indigo-300 hover:text-indigo-600'
                              }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Hotel size={13} className={`shrink-0 ${activeSummaryDropdown === 'hotels' ? 'text-white' : 'text-indigo-500'}`} />
                              <span className="truncate">{hotelsCount} Hotels</span>
                            </div>
                            <ChevronDown size={11} className={`shrink-0 transition-transform duration-200 ${activeSummaryDropdown === 'hotels' ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {/* DROPDOWN POPUP PANEL */}
                        {activeSummaryDropdown && (
                          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-3.5 shadow-sm space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                              <div className="flex items-center gap-2">
                                {activeSummaryDropdown === 'activities' && (
                                  <>
                                    <Sparkles size={15} className="text-[#ff5d09]" />
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                                      Activities & Experiences ({activitiesCount})
                                    </h4>
                                  </>
                                )}
                                {activeSummaryDropdown === 'transfers' && (
                                  <>
                                    <Car size={15} className="text-blue-600" />
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                                      Transfers & Transit ({transfersCount})
                                    </h4>
                                  </>
                                )}
                                {activeSummaryDropdown === 'meals' && (
                                  <>
                                    <Utensils size={15} className="text-emerald-600" />
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                                      Meal Inclusions ({mealsCount})
                                    </h4>
                                  </>
                                )}
                                {activeSummaryDropdown === 'hotels' && (
                                  <>
                                    <Hotel size={15} className="text-indigo-600" />
                                    <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wide">
                                      Hotel Accommodations ({hotelsCount})
                                    </h4>
                                  </>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => setActiveSummaryDropdown(null)}
                                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </div>

                            {/* Dropdown Content: Activities */}
                            {activeSummaryDropdown === 'activities' && (
                              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {summaryOverview.activities.length > 0 &&
                                  typeof summaryOverview.activities[0] === 'object' &&
                                  'items' in (summaryOverview.activities[0] as any) ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(summaryOverview.activities as any[]).map((group, gIdx) => (
                                      <div key={gIdx} className="bg-orange-50/20 border border-orange-100/70 rounded-lg p-2.5 space-y-1">
                                        {group.city && (
                                          <div className="flex items-center gap-1.5 text-[#ff5d09] font-extrabold text-[11px] uppercase tracking-wider pb-1 border-b border-orange-100/50">
                                            <MapPin size={11} />
                                            <span>{group.city}</span>
                                          </div>
                                        )}
                                        <ul className="space-y-1">
                                          {group.items.map((it: string, itIdx: number) => (
                                            <li key={itIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d09] mt-1.5 shrink-0" />
                                              <span>{it}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {(summaryOverview.activities as string[]).map((item, idx) => (
                                      <div key={idx} className="flex items-start gap-2 p-2 bg-orange-50/20 border border-orange-100/60 rounded-md text-xs text-slate-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d09] mt-1.5 shrink-0" />
                                        <span>{item}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Dropdown Content: Transfers */}
                            {activeSummaryDropdown === 'transfers' && (
                              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {summaryOverview.transfers.map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-2 p-2 bg-blue-50/30 border border-blue-100/60 rounded-md text-xs text-slate-800">
                                    <Car size={13} className="text-blue-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Dropdown Content: Meals */}
                            {activeSummaryDropdown === 'meals' && (
                              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {summaryOverview.meals.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 bg-emerald-50/30 border border-emerald-100/60 rounded-md text-xs text-slate-800">
                                    <Utensils size={13} className="text-emerald-500 shrink-0" />
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Dropdown Content: Hotels */}
                            {activeSummaryDropdown === 'hotels' && (
                              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                                {summaryOverview.accommodation.map((item, idx) => {
                                  const isObj = typeof item === 'object' && item !== null;
                                  const city = isObj ? (item as any).city : '';
                                  const hotel = isObj ? (item as any).hotel : item;
                                  return (
                                    <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-indigo-50/30 border border-indigo-100/60 rounded-md text-xs text-slate-800">
                                      <div className="flex items-center gap-2 min-w-0">
                                        <Hotel size={13} className="text-indigo-500 shrink-0" />
                                        {city && (
                                          <span className="font-extrabold text-[#ff5d09] uppercase text-[10px] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 shrink-0">
                                            {city}
                                          </span>
                                        )}
                                        <span className="font-semibold text-slate-800 truncate">{hotel}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        {trip.itinerary.map((day) => {
                          const dayData = parseDayItinerarySummary(day);
                          const isDayOpen = expandedSummaryDays.includes(day.day);
                          return (
                            <div
                              key={day.day}
                              className="bg-white border border-slate-200/90 rounded-lg overflow-hidden shadow-3xs transition-all"
                            >
                              {/* Day Accordion Trigger with Light Gray Background */}
                              <button
                                type="button"
                                onClick={() => toggleSummaryDay(day.day)}
                                className="w-full flex items-center justify-between gap-2.5 px-3 py-2.5 sm:px-3.5 sm:py-2.5 bg-slate-100/90 hover:bg-slate-200/70 transition-colors text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="shrink-0 px-2 py-0.5 rounded bg-[#ff5d09] text-white font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider">
                                    Day {day.day}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs sm:text-sm leading-snug truncate">
                                    {day.title}
                                  </span>
                                </div>
                                <ChevronDown
                                  size={15}
                                  className={`shrink-0 text-slate-500 transition-transform duration-200 ${isDayOpen ? 'rotate-180 text-[#ff5d09]' : ''}`}
                                />
                              </button>

                              {/* Day Accordion Content */}
                              {isDayOpen && (
                                <div className="p-3 bg-white space-y-2.5 border-t border-slate-200/60">
                                  {/* Transfers Section */}
                                  {dayData.transfers.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-blue-600 font-extrabold text-[11px] uppercase tracking-wider">
                                        <Car size={13} className="text-blue-500 shrink-0" />
                                        <span>Transfers</span>
                                      </div>
                                      <div className="bg-blue-50/40 rounded-lg p-2.5 sm:p-2 border border-blue-100/60 space-y-1.5">
                                        {dayData.transfers.map((t, tIdx) => (
                                          <div
                                            key={tIdx}
                                            className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                            <span className="font-medium text-slate-800">{t}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Sightseeing & Experiences Section */}
                                  {dayData.experiences.length > 0 && (
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-1.5 text-[#ff5d09] font-extrabold text-[11px] uppercase tracking-wider">
                                        <Sparkles size={13} className="text-[#ff5d09] shrink-0" />
                                        <span>Sightseeing & Experiences</span>
                                      </div>
                                      <div className="bg-orange-50/30 rounded-lg p-2.5 sm:p-3 border border-orange-100/60 space-y-1.5">
                                        {dayData.experiences.map((exp, eIdx) => (
                                          <div
                                            key={eIdx}
                                            className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5d09] mt-1.5 shrink-0" />
                                            <span className="font-medium text-slate-800">{exp}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {dayData.transfers.length === 0 && dayData.experiences.length === 0 && (
                                    <p className="text-xs text-slate-400 italic">No specific transfers or sightseeing listed for this day.</p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* INCLUSIONS & EXCLUSIONS SIDE BY SIDE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 items-start pt-1">
                      {/* INCLUSIONS CARD (LEFT) */}
                      <div className="bg-white border-2 border-emerald-500/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col">
                        <div className="flex items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3 bg-emerald-50/50 border-b border-emerald-100 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-2 text-emerald-700">
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-3xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <span>Inclusions</span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                            {trip.included?.length || 0} Included
                          </span>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 flex-1 bg-white">
                          {trip.included && trip.included.length > 0 ? (
                            trip.included.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                              >
                                <span className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                                  ✓
                                </span>
                                <span className="font-medium text-slate-800">{item}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No inclusions listed.</p>
                          )}
                        </div>
                      </div>

                      {/* EXCLUSIONS CARD (RIGHT) */}
                      <div className="bg-white border-2 border-rose-400/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col">
                        <div className="flex items-center justify-between px-3.5 py-3 sm:px-4 sm:py-3 bg-rose-50/50 border-b border-rose-100 text-slate-800 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                          <div className="flex items-center gap-2 text-rose-700">
                            <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-3xs">
                              <X size={12} strokeWidth={3} />
                            </div>
                            <span>Exclusions</span>
                          </div>
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full">
                            {trip.notIncluded?.length || 0} Excluded
                          </span>
                        </div>
                        <div className="p-3 sm:p-4 space-y-2.5 flex-1 bg-white">
                          {trip.notIncluded && trip.notIncluded.length > 0 ? (
                            trip.notIncluded.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                              >
                                <span className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">
                                  ✕
                                </span>
                                <span className="font-medium text-slate-800">{item}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No exclusions listed.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {activeTab === 'highlights' && (() => {
                const summaryOverview = getTripSummaryDetails(trip);
                return (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="rounded-2xl overflow-hidden border-2 border-[#ff5d09] bg-white shadow-2xs">
                      {/* White Header Bar with Orange Border */}
                      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-white text-slate-900 font-extrabold text-sm uppercase tracking-wider border-b border-orange-100">
                        <Sparkles size={18} className="text-[#ff5d09]" />
                        <span>Activities & Experiences</span>
                      </div>

                      <div className="p-4 sm:p-6 bg-slate-50/40">
                        {summaryOverview.activities.length > 0 &&
                          typeof summaryOverview.activities[0] === 'object' &&
                          'items' in (summaryOverview.activities[0] as any) ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {(summaryOverview.activities as any[]).map((group, gIdx) => (
                              <div
                                key={gIdx}
                                className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-3xs hover:border-orange-200 transition-all flex flex-col"
                              >
                                {group.city && (
                                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 text-orange-600 font-extrabold text-xs sm:text-sm uppercase tracking-wider">
                                    <MapPin size={16} className="text-orange-500 shrink-0" />
                                    <span>{group.city}</span>
                                  </div>
                                )}
                                <ul className="space-y-2.5 flex-1">
                                  {group.items.map((it: string, itIdx: number) => (
                                    <li
                                      key={itIdx}
                                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                                      <span className="font-medium text-slate-800">{it}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            {(summaryOverview.activities as string[]).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-3 p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-3xs hover:border-orange-200 transition-colors"
                              >
                                <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}



              {/* MOBILE CTA */}
              <div className="lg:hidden space-y-3">
                <Button size="lg" className="w-full font-bold" onClick={() => setCallbackOpen(true)}>
                  {trip.showGetQuoteOnly ? (
                    <>
                      <MessageCircle size={18} /> Get Quote
                    </>
                  ) : (
                    <>
                      <Phone size={18} /> Enquire Now
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="hidden lg:block space-y-[3vh]">
              <div className="lg:sticky lg:top-32 space-y-4">
                {/* PRICE CARD */}
                <Card className="p-6 shadow-md border-slate-200/80 space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      {selections.length > 0 ? 'Current Selection' : 'Starting Price'}
                    </p>
                    {lowestPrice > 0 ? (
                      <>
                        <p className="text-3xl font-extrabold text-primary mt-1">
                          ₹{(selections.length > 0 ? total : lowestPrice).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 font-medium">
                          {selections.length > 0 ? `${selections.length} item${selections.length > 1 ? 's' : ''} selected` : 'per person'}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-bold text-primary mt-1">
                        Price on Request
                      </p>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {trip.showGetQuoteOnly ? (
                      <Button
                        size="lg"
                        className="w-full justify-center bg-primary hover:bg-primary/95 text-white font-bold"
                        onClick={() => setCallbackOpen(true)}
                      >
                        <MessageCircle size={18} /> Get Quote
                      </Button>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="w-full justify-center font-extrabold bg-gradient-to-r from-orange-600 via-[#ff5d09] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-premium-pulse cursor-pointer relative overflow-hidden"
                          onClick={handleBookNow}
                        >
                          <style>{`
                            @keyframes heartbeat {
                              0%, 100% { transform: scale(1); }
                              50% { transform: scale(1.025); }
                            }
                            .animate-premium-pulse {
                              animation: heartbeat 2.5s infinite ease-in-out;
                            }
                          `}</style>
                          <Phone size={18} className="animate-pulse" /> Book Now
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full justify-center font-bold"
                          onClick={() => setCallbackOpen(true)}
                        >
                          <MessageCircle size={18} /> Request Callback
                        </Button>
                      </>
                    )}
                  </div>
                </Card>

                {/* INLINE CALLBACK CARD */}
                <Card className="p-5 border-slate-200/80 bg-linear-to-b from-white to-slate-50/30 shadow-md">
                  <h3 className="font-bold text-sm text-slate-950 mb-1 flex items-center gap-2">
                    📞 Want us to call you?
                  </h3>
                  <p className="text-[11px] text-slate-500 mb-4 font-medium">
                    Share details to get expert assistance
                  </p>

                  {inquirySuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center animate-in fade-in duration-300">
                      <p className="font-bold text-sm">🎉 Callback Requested!</p>
                      <p className="text-xs mt-1 leading-relaxed">Our travel expert will contact you shortly.</p>
                      <button
                        onClick={() => setInquirySuccess(false)}
                        className="mt-3 text-xs text-primary font-bold hover:underline cursor-pointer"
                      >
                        Request another callback
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Mobile Number</label>
                        <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                          <span className="bg-slate-50 border-r border-slate-200 px-3 py-2 text-xs font-bold text-slate-500 flex items-center">+91</span>
                          <input
                            type="tel"
                            required
                            placeholder="Enter 10-digit number"
                            pattern="[0-9]{10}"
                            value={inquiryPhone}
                            onChange={(e) => setInquiryPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="px-3 py-1.5 text-xs w-full outline-hidden bg-transparent font-medium"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="name@email.com"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          className="px-3 py-2 text-xs w-full rounded-xl border border-slate-200 bg-white outline-hidden shadow-2xs font-medium"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="agree-checkbox"
                          required
                          checked={inquiryAgreed}
                          onChange={(e) => setInquiryAgreed(e.target.checked)}
                          className="mt-1 rounded-sm border-slate-300 text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                        />
                        <label htmlFor="agree-checkbox" className="text-[9px] text-slate-500 leading-snug cursor-pointer select-none font-medium">
                          I accept the <a href="/privacy-policy" target="_blank" className="text-primary hover:underline font-semibold">Privacy Policy</a> and authorize Wanderphilia to contact me with details.
                        </label>
                      </div>

                      <Button
                        type="submit"
                        disabled={inquirySubmitting || !inquiryAgreed}
                        className="w-full py-2 rounded-xl font-bold text-xs bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/10 transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {inquirySubmitting ? 'Requesting...' : 'Get a Callback ↗'}
                      </Button>
                    </form>
                  )}
                </Card>

                {/* CONTACT CARD */}
                <Card className="p-[2.5vw] border-slate-200/80">
                  <h3 className="font-bold text-sm mb-1">Need Help?</h3>
                  <p className="text-xs text-slate-500 mb-4 font-medium">
                    Contact our travel experts anytime
                  </p>

                  <div className="space-y-2 text-xs font-semibold">
                    <a
                      href={`mailto:${contactEmail}`}
                      className="flex items-center gap-2 text-primary hover:underline"
                    >
                      <span>{contactEmail}</span>
                    </a>
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-2 text-slate-700 hover:text-primary"
                    >
                      <Phone size={14} />
                      {contactPhoneDisplay}
                    </a>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-700 hover:text-primary"
                    >
                      <MessageCircle size={14} />
                      Instagram
                    </a>
                  </div>
                </Card>

                {/* DOWNLOAD ITINERARY */}
                <Button
                  variant="outline"
                  className="w-full font-bold text-xs justify-center cursor-pointer"
                  disabled={isGeneratingPdf}
                  onClick={handleDownloadPDF}
                >
                  {isGeneratingPdf ? (
                    <svg className="w-4 h-4 mr-2 animate-spin text-slate-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <Download size={14} className="mr-2" />
                  )}
                  {isGeneratingPdf ? 'Generating PDF...' : 'Download Itinerary'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white lg:hidden border-t shadow-2xl">
        <div className="max-w-6xl mx-auto px-[4vw] py-[3vh] flex items-center justify-between gap-3">
          <div>
            {lowestPrice > 0 ? (
              <>
                <p className="text-xs text-slate-500">
                  {selections.length > 0 ? 'Total selected' : 'Starting at'}
                </p>
                <p className="text-lg font-bold">₹{(selections.length > 0 ? total : lowestPrice).toLocaleString('en-IN')}</p>
              </>
            ) : (
              <p className="text-md font-bold text-slate-700">Price on Request</p>
            )}
          </div>
          {trip.showGetQuoteOnly ? (
            <Button onClick={() => setCallbackOpen(true)} className="shrink-0 bg-primary hover:bg-primary/95 text-white font-bold rounded-2xl h-12">
              Get Quote
            </Button>
          ) : (
            <div className="grow min-w-0">
              <SwipeButton onSwipeComplete={handleBookNow} text="Slide to Book" />
            </div>
          )}
        </div>
      </div>

      {/* ADD BOTTOM PADDING FOR MOBILE */}
      <div className="h-[12vh] lg:h-0 min-h-20 lg:min-h-0" />

      {/* REVIEWS SECTION */}
      <TripReviewsSection
        tripSlug={trip.slug}
        categoryId={trip.category.toLowerCase()}
      />

      {/* GALLERY SECTION */}
      <div id="gallery">
        <TripGallerySection
          categoryId={trip.category.toLowerCase()}
          categoryName={trip.destination}
        />
      </div>

      <Footer />

      <RequestCallbackDialog
        open={callbackOpen}
        onOpenChange={setCallbackOpen}
        title={trip.title}
        price={lowestPrice}
        isQuote={trip.showGetQuoteOnly}
      />

      <DownloadTourPdfDialog
        open={downloadPdfModalOpen}
        onOpenChange={setDownloadPdfModalOpen}
        trip={trip}
        onDownload={handleDownloadPDF}
      />

      {/* CUSTOM FULLSCREEN IMAGE LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-xs select-none">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <X size={24} />
          </button>

          {/* Prev button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev === 0 ? collageImages.length - 1 : prev! - 1))}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
            <Image
              src={collageImages[lightboxIndex].src}
              alt={collageImages[lightboxIndex].alt || 'Gallery'}
              fill
              className="object-contain"
            />
          </div>

          {/* Next button */}
          <button
            onClick={() => setLightboxIndex((prev) => (prev === collageImages.length - 1 ? 0 : prev! + 1))}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer z-50"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-5 text-white/70 text-sm font-semibold z-50">
            {lightboxIndex + 1} / {collageImages.length}
            r          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 animate-in slide-in-from-bottom-5 font-semibold text-xs flex items-center gap-2 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {notification}
        </div>
      )}
    </div>
  )
}
