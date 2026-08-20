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
import { trips } from '@/lib/data'
import { destinationItineraryImages } from '@/lib/section-mappings'
import { MapPin, Calendar, Users, Star, Phone, MessageCircle, ChevronDown, Download, X, ChevronLeft, ChevronRight, Car, Hotel, Camera, Utensils, Plane, Building2, FileText, User } from 'lucide-react'
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
      return item
    }
  }

  return description[0] || ''
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

    if (lower.includes('meals') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
      const foundMeals: string[] = []
      if (lower.includes('breakfast')) foundMeals.push('Breakfast')
      if (lower.includes('lunch')) foundMeals.push('Lunch')
      if (lower.includes('dinner')) foundMeals.push('Dinner')
      if (foundMeals.length > 0) {
        foundMeals.forEach(m => {
          if (!result.meals.includes(m)) result.meals.push(m)
        })
      } else {
        result.meals.push(trimmed)
      }
    } else if (
      lower.includes('overnight stay') || lower.includes('stay in') || lower.includes('hotel') ||
      lower.includes('resort') || lower.includes('check-in') || lower.includes('check in') ||
      lower.includes('check out') || lower.includes('check-out') || lower.includes('camp')
    ) {
      const rawName = trimmed
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
      lower.includes('transfer') || lower.includes('pick you up') || lower.includes('pick up') ||
      lower.includes('airport') || lower.includes('drive to') || lower.includes('travel to') ||
      lower.includes('proceed to') || lower.includes('reach') || lower.includes('railway') ||
      lower.includes('station') || lower.includes('cab')
    ) {
      if (!result.transfers.includes(trimmed)) result.transfers.push(trimmed)
    } else {
      if (!result.sightseeing.includes(trimmed)) result.sightseeing.push(trimmed)
    }
  })

  return result
}


function renderItineraryDescription(description: string | string[]) {
  if (!Array.isArray(description)) {
    return (
      <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
        {description}
      </p>
    )
  }

  const categories: {
    type: 'Transfer' | 'Hotels' | 'Sightseeing' | 'Meals';
    content: string[];
  }[] = [];

  description.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    // Skip highlights section headers
    if (lower.startsWith('highlights of the')) return;

    let category: 'Transfer' | 'Hotels' | 'Sightseeing' | 'Meals' = 'Sightseeing';

    if (lower.includes('meals') || lower.includes('breakfast') || lower.includes('lunch') || lower.includes('dinner')) {
      category = 'Meals';
    } else if (
      lower.includes('overnight stay') || lower.includes('stay in') || lower.includes('hotel') ||
      lower.includes('resort') || lower.includes('check-in') || lower.includes('check in') ||
      lower.includes('check out') || lower.includes('check-out') || lower.includes('camp')
    ) {
      category = 'Hotels';
    } else if (
      lower.includes('transfer') || lower.includes('pick you up') || lower.includes('pick up') ||
      lower.includes('airport') || lower.includes('drive to') || lower.includes('travel to') ||
      lower.includes('proceed to') || lower.includes('reach') || lower.includes('railway') ||
      lower.includes('station') || lower.includes('cab')
    ) {
      category = 'Transfer';
    }

    const existing = categories.find(c => c.type === category);
    if (existing) {
      existing.content.push(trimmed);
    } else {
      categories.push({ type: category, content: [trimmed] });
    }
  });

  // Show in order: Transfer → Hotels → Sightseeing → Meals
  const order: Record<string, number> = { Transfer: 1, Hotels: 2, Sightseeing: 3, Meals: 4 };
  categories.sort((a, b) => order[a.type] - order[b.type]);

  if (categories.length === 0) {
    return (
      <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
        {description.map((point, idx) => (
          <li key={idx}>{point}</li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-3 pt-3">
      {categories.map((cat, idx) => {

        /* ── TRANSFER ────────────────────────────────── */
        if (cat.type === 'Transfer') {
          return (
            <div key={idx} className="flex gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-sm transition-shadow">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/images/car-icon.png" alt="Car" className="w-12 h-12 object-contain" />
              </div>
              {/* Content */}
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Transfer</p>
                {cat.content.map((text, i) => (
                  <p key={i} className="text-sm text-slate-700 font-medium leading-relaxed">{text}</p>
                ))}
              </div>
            </div>
          );
        }

        /* ── HOTELS (hidden) ─────────────────────────── */
        if (cat.type === 'Hotels') return null;

        /* ── SIGHTSEEING ─────────────────────────────── */
        if (cat.type === 'Sightseeing') {
          return (
            <div key={idx} className="flex gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:shadow-sm transition-shadow">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <img src="/images/sighseeing-icon.png" alt="Sightseeing" className="w-12 h-12 object-contain" />
              </div>
              {/* Content */}
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Sightseeing</p>
                <div className="space-y-1">
                  {cat.content.map((text, i) => (
                    <p key={i} className="text-sm text-slate-700 leading-relaxed">{text}</p>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        /* ── MEALS (small badge row) ──────────────────── */
        if (cat.type === 'Meals') {
          return (
            <div key={idx} className="flex flex-wrap gap-2 pt-1">
              {cat.content.map((text, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full">
                  <Utensils size={11} />
                  {text.replace(/meals included|meals/i, '').replace(/^[:\s\-]+/, '').trim() || text}
                </span>
              ))}
            </div>
          );
        }

        return null;
      })}
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
  const [activeTab, setActiveTab] = useState('itinerary')
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

  const handleBookNow = () => {
    if (!slug) return
    router.push(`/booking/package/${encodeURIComponent(slug)}`)
  }

  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [activeInclCat, setActiveInclCat] = useState('hotels')

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

  const staySummary = getStaySummary(trip.itinerary)

  const isGroup = trip.title.toLowerCase().includes('group')
  const isInte = trip.tripType === 'International'

  const inclusionsList = [
    {
      id: 'flights',
      label: 'Flights',
      icon: <img src="/images/plane-icon.png" alt="Flights" className="w-full h-full object-contain p-1" />,
      optional: !isGroup,
    },
    {
      id: 'hotels',
      label: 'Hotels',
      icon: <img src="/images/hotel-icon.png" alt="Hotels" className="w-full h-full object-contain p-1" />,
      optional: false,
    },
    {
      id: 'sightseeing',
      label: 'Sightseeing',
      icon: <img src="/images/sighseeing-icon.png" alt="Sightseeing" className="w-full h-full object-contain p-1" />,
      optional: false,
    },
    {
      id: 'meals',
      label: 'Meal',
      icon: <img src="/images/meal-icon.png" alt="Meal" className="w-full h-full object-contain p-1" />,
      optional: false,
    },
  ]

  if (isInte) {
    inclusionsList.push({
      id: 'visa',
      label: 'Visa',
      icon: <FileText className="text-indigo-500 w-full h-full p-1" />,
      optional: false,
    })
  }

  if (isGroup) {
    inclusionsList.push({
      id: 'manager',
      label: 'Tour Manager',
      icon: <img src="/images/manager-icon.png" alt="Tour Manager" className="w-full h-full object-contain p-1" />,
      optional: false,
    })
  }

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



        <div className="max-w-6xl mx-auto px-[4vw] sm:px-[5vw] md:px-0 py-[4vh] sm:py-[5vh] md:py-[6vh]">
          <div className="grid lg:grid-cols-[2.5fr_1fr] gap-[4vw] lg:gap-[3vw]">
            {/* LEFT CONTENT */}
            <div className="space-y-[6vh] min-w-0 w-full overflow-hidden">
              {/* HEADER SECTION (Always visible) */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  {trip.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="shrink-0" />
                    <span className="text-sm sm:text-base">{trip.destination}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} className="shrink-0" />
                    <span className="text-sm sm:text-base">
                      {trip.nights ? `${trip.nights}N / ${trip.duration}D` : `${trip.duration}D`}
                    </span>
                  </div>
                </div>

                {/* Stay Summary / Route */}
                {staySummary && (
                  <p className="text-xs sm:text-sm font-semibold text-[#ff5d09] mb-4 uppercase tracking-wider bg-orange-50 w-fit px-3 py-1 rounded-lg border border-orange-100/60 shadow-3xs">
                    {staySummary.replace(/\s*-\s*/g, ' • ')}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Badge className={`${difficultyColor} text-xs sm:text-sm px-3 py-1`}>
                    {trip.difficulty}
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-700 text-xs sm:text-sm px-3 py-1">
                    <Users size={14} className="mr-1" /> {trip.groupSize}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-700 text-xs sm:text-sm px-3 py-1">
                    <Star size={14} className="mr-1" /> {trip.rating}
                  </Badge>
                </div>

                {/* INCLUSIONS ICONS ROW */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-5 pt-4 border-t border-slate-100">
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
                </div>
              </div>

              {/* STICKY TAB NAVBAR */}
              <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
                <div className="flex w-fit overflow-hidden">
                  <div
                    ref={tabContainerRef}
                    className="flex w-fit overflow-x-auto gap-2 sm:gap-4 py-0 mr-auto scrollbar-hide"
                  >
                    {[
                      { id: 'itinerary', label: 'Itinerary' },
                      { id: 'inclusions', label: 'Inclusions' },
                      { id: 'summary', label: 'Summary' },
                      { id: 'highlights', label: 'Highlights' },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        data-tab-id={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab.id
                          ? 'border-primary text-primary font-bold'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
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
                    <div className="grow space-y-3.5 relative pl-0 border-l border-slate-200/70 border-dashed md:border-0 md:pl-0">
                      {Array.isArray(trip.itinerary) && trip.itinerary.length > 0 ? (
                        trip.itinerary.map((day) => (
                          <div
                            key={day.day}
                            id={`itinerary-day-${day.day}`}
                            className={`border rounded-2xl overflow-hidden hover:shadow-xs transition-all duration-300 bg-white ${activeDay === day.day ? 'border-primary/50 shadow-xs' : 'border-slate-200'
                              }`}
                          >
                            <button
                              onClick={() => toggleDay(day.day)}
                              className="w-full flex items-start justify-between p-4 sm:p-5 bg-white hover:bg-slate-50/50 transition-colors text-left"
                            >
                              <div className="flex items-start gap-3.5 grow">
                                <div className="shrink-0 mt-0.5">
                                  <Badge className="bg-primary/10 text-primary hover:bg-primary/15 text-[10px] font-bold px-2 py-0.5">
                                    Day {day.day}
                                  </Badge>
                                </div>
                                <div className="min-w-0">
                                  <h3 className="font-bold text-sm sm:text-base text-slate-955">
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
                              <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-slate-50/40 border-t border-slate-100">
                                {renderItineraryDescription(day.description)}
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
                  { id: 'hotels', label: 'Hotels', icon: '🏨' },
                  { id: 'sightseeing', label: 'Sightseeing', icon: '📸' },
                  { id: 'meals', label: 'Meals', icon: '🍽️' },
                  { id: 'transfer', label: 'Transfer', icon: '🚗' },
                  { id: 'others', label: 'Others', icon: '✦' },
                  { id: 'exclusions', label: 'Exclusions', icon: '✕' },
                  { id: 'payment', label: 'Payment Policy', icon: '💳' },
                  { id: 'cancellation', label: 'Cancellation Policy', icon: '📝' },
                ];

                function categorise(items: string[]) {
                  const r: Record<string, string[]> = { hotels: [], sightseeing: [], meals: [], transfer: [], others: [] };
                  items.forEach(item => {
                    const l = item.toLowerCase();
                    if (l.includes('stay') || l.includes('hotel') || l.includes('camp') || l.includes('resort') || l.includes('accommodation') || l.includes('night'))
                      r.hotels.push(item);
                    else if (l.includes('sightseeing') || l.includes('visit') || l.includes('tour') || l.includes('excursion') || l.includes('trek') || l.includes('safari') || l.includes('entry') || l.includes('permit'))
                      r.sightseeing.push(item);
                    else if (l.includes('meal') || l.includes('breakfast') || l.includes('lunch') || l.includes('dinner') || l.includes('food') || l.includes('beverage'))
                      r.meals.push(item);
                    else if (l.includes('transfer') || l.includes('cab') || l.includes('transport') || l.includes('vehicle') || l.includes('driver') || l.includes('pick') || l.includes('drop') || l.includes('taxi') || l.includes('bus') || l.includes('flight') || l.includes('train') || l.includes('airport'))
                      r.transfer.push(item);
                    else
                      r.others.push(item);
                  });
                  return r;
                }

                const incl = categorise(trip.included);
                const excl = categorise(trip.notIncluded);
                const curIncl = incl[activeInclCat] || [];
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
                          const curCatIncl = incl[cat.id] || [];
                          return (
                            <div key={cat.id} className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-3xs">
                              {/* Accordion Trigger */}
                              <button
                                onClick={() => setActiveInclCat(activeInclCat === cat.id ? '' : cat.id)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left font-bold text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 transition-colors"
                              >
                                <span className="flex items-center gap-2.5">
                                  <span className="text-base shrink-0">{cat.icon}</span>
                                  <span>{cat.label}</span>
                                </span>
                                <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Accordion Content */}
                              {isExpanded && (
                                <div className="px-5 py-4 space-y-3 border-t border-slate-100 bg-white">
                                  {/* Special Stays rendering inside Hotels */}
                                  {cat.id === 'hotels' && trip.stays && trip.stays.length > 0 && (
                                    <div className="mb-3 pb-3 border-b border-slate-100">
                                      <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Your Accommodation</p>
                                      {trip.stays.map((stay, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                          <span className="text-indigo-500 shrink-0 mt-0.5">🏨</span>
                                          <span className="text-sm font-semibold text-slate-800">{stay}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Special Exclusions rendering */}
                                  {cat.id === 'exclusions' ? (
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

                        {/* Hotels/Generic card — show stays at top, then inclusions */}
                        {activeInclCat !== 'exclusions' && activeInclCat !== 'payment' && activeInclCat !== 'cancellation' && (
                          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                            <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                              <span className="text-base">{activeMeta?.icon}</span>
                              <h3 className="font-bold text-sm tracking-wide">{activeMeta?.label}</h3>
                            </div>
                            <div className="bg-white px-5 py-4 space-y-3">
                              {/* Show stays/hotel names from trip.stays when Hotels tab is active */}
                              {activeInclCat === 'hotels' && trip.stays && trip.stays.length > 0 && (
                                <div className="mb-3 pb-3 border-b border-slate-100">
                                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Your Accommodation</p>
                                  {trip.stays.map((stay, i) => (
                                    <div key={i} className="flex gap-2 items-start">
                                      <span className="text-indigo-500 shrink-0 mt-0.5">🏨</span>
                                      <span className="text-sm font-semibold text-slate-800">{stay}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
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

              {activeTab === 'summary' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                    {/* Blue Header Bar */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-3xs">
                      <Calendar size={18} />
                      <h3 className="font-extrabold text-sm uppercase tracking-wider">Day Wise Summary</h3>
                    </div>

                    <div className="bg-slate-50/50 p-4 sm:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {trip.itinerary.map((day) => {
                          const summary = parseDayForSummary(day.description);
                          return (
                            <div key={day.day} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-3xs hover:border-blue-200 transition-colors flex flex-col justify-between">
                              <div className="space-y-3">
                                {/* Day Tag & Title */}
                                <div className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100">
                                  <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-extrabold text-[10px] uppercase tracking-wider px-2 py-0.5 shrink-0 mt-0.5">
                                    Day {day.day}
                                  </Badge>
                                  <h4 className="font-bold text-sm text-slate-800 leading-snug line-clamp-2">
                                    {day.title}
                                  </h4>
                                </div>

                                {/* Summary List Items */}
                                <div className="space-y-2.5 pt-1">
                                  {/* Hotels */}
                                  {summary.hotels.length > 0 && (
                                    <div className="flex gap-2 items-start text-xs sm:text-sm text-slate-700">
                                      <span className="p-1 bg-indigo-50 text-indigo-500 rounded-md shrink-0">
                                        <Hotel size={13} />
                                      </span>
                                      <span className="font-semibold">{summary.hotels.join(', ')}</span>
                                    </div>
                                  )}

                                  {/* Transfers */}
                                  {summary.transfers.length > 0 && (
                                    <div className="flex gap-2 items-start text-xs sm:text-sm text-slate-700">
                                      <span className="p-1 bg-blue-50 rounded-md shrink-0 flex items-center justify-center w-[21px] h-[21px]">
                                        <img src="/images/car-icon.png" alt="Car" className="w-3.5 h-3.5 object-contain" />
                                      </span>
                                      <span className="font-medium line-clamp-2">{summary.transfers.join(', ')}</span>
                                    </div>
                                  )}

                                  {/* Sightseeing */}
                                  {summary.sightseeing.length > 0 && (
                                    <div className="flex gap-2 items-start text-xs sm:text-sm text-slate-700">
                                      <span className="p-1 bg-purple-50 rounded-md shrink-0 flex items-center justify-center w-[21px] h-[21px]">
                                        <img src="/images/sighseeing-icon.png" alt="Sightseeing" className="w-3.5 h-3.5 object-contain" />
                                      </span>
                                      <span className="font-medium line-clamp-2">{summary.sightseeing.join(', ')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Meals at the bottom of the card */}
                              {summary.meals.length > 0 && (
                                <div className="mt-3 pt-2.5 border-t border-slate-100 flex gap-2 items-center text-xs sm:text-sm text-emerald-700 bg-emerald-50/50 px-2 py-1 rounded-lg w-fit">
                                  <span className="text-emerald-500 shrink-0">
                                    <Utensils size={12} />
                                  </span>
                                  <span className="font-bold text-[11px] uppercase tracking-wider">{summary.meals.join(', ')}</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'highlights' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-2xs">
                    {/* Orange Header Bar */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-3xs">
                      <Star size={18} className="fill-amber-300 text-amber-300" />
                      <h3 className="font-extrabold text-sm uppercase tracking-wider">Tour Highlights</h3>
                    </div>

                    <div className="bg-slate-50/30 p-5 sm:p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trip.highlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-4 bg-white border border-slate-200/80 rounded-2xl flex items-start gap-3 hover:border-orange-200 hover:shadow-2xs transition-all duration-300 group"
                          >
                            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xs shrink-0 group-hover:bg-orange-100 transition-colors">
                              {idx + 1}
                            </div>
                            <p className="text-slate-700 text-sm font-semibold leading-relaxed pt-1">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}



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
                  className="w-full font-bold text-xs justify-center"
                  onClick={() => alert('Download feature coming soon!')}
                >
                  <Download size={14} /> Download Itinerary
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
    </div>
  )
}
