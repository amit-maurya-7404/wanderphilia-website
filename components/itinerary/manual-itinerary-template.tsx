'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ManualItinerary } from '@/types/manual-itinerary';
import { ManualFlowchartSection } from './manual-flowchart-section';
import { ManualFlightQuotationSection } from './manual-flight-quotation-section';
import { ManualOptionSwitcher } from './manual-option-switcher';
import { ItineraryClientActions } from './itinerary-client-actions';
import { ItineraryPaymentSection } from './itinerary-payment-section';
import { ItineraryBookModal, ItineraryPaymentType } from './itinerary-book-modal';
import {
  MapPin,
  Calendar,
  Users,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Utensils,
  Car,
  Plane,
  CreditCard,
  Building2,
  HeartHandshake,
  Star,
  ExternalLink,
  Luggage,
  Lock,
  ArrowRight,
  Check
} from 'lucide-react';
import { Parachute } from '@/components/parachute-icon';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay, contactEmail } from '@/lib/contact';
import { isInternationalTrip } from '@/lib/ai-itinerary';
import { Playfair_Display, Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const sansBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const cursiveFont = Dancing_Script({
  subsets: ['latin'],
  weight: ['700'],
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

interface ManualItineraryTemplateProps {
  itinerary: ManualItinerary;
}

export function ManualItineraryTemplate({ itinerary }: ManualItineraryTemplateProps) {
  // Multi-option state management & deep linking
  const defaultOptId = itinerary.options?.find(o => o.isDefault)?.id || itinerary.options?.[0]?.id || 'option-1';
  const [selectedOptionId, setSelectedOptionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const optParam = urlParams.get('opt') || urlParams.get('option');
      if (optParam && itinerary.options && itinerary.options.length > 0) {
        const found = itinerary.options.find(
          o => o.id.toLowerCase() === optParam.toLowerCase() ||
               o.title.toLowerCase().includes(optParam.toLowerCase())
        );
        if (found) return found.id;
      }
    }
    return defaultOptId;
  });

  const handleSelectOption = (optId: string) => {
    setSelectedOptionId(optId);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('opt', optId);
      window.history.replaceState(null, '', url.toString());
    }
  };

  // Active Option resolving
  const activeOption = itinerary.options && itinerary.options.length > 0
    ? (itinerary.options.find(o => o.id === selectedOptionId) || itinerary.options[0])
    : null;

  const leadName = itinerary.leadName || 'Valued Traveler';
  const cleanedName = leadName.replace(/^(Mr\.|Mr|Mrs\.|Mrs|Ms\.|Ms|Dr\.|Dr|Shri)\s+/i, '').trim();
  const isFamilyOrGroup = /(&\s*Family|and\s*Family|\bFamily\b|\bTeam\b|\bGroup\b)/i.test(cleanedName);
  const displayName = cleanedName && cleanedName !== 'Valued Traveler'
    ? (isFamilyOrGroup ? cleanedName : cleanedName.split(' ')[0])
    : 'Your';
  const firstName = displayName;
  const possessiveName = displayName.toLowerCase() === 'your'
    ? 'Your'
    : (displayName.endsWith('s') || displayName.endsWith('S') ? `${displayName}'` : `${displayName}'s`);
  const destination = itinerary.destination || 'Selected Destination';
  const numDays = activeOption?.numDays || itinerary.numDays || 5;
  const numNights = activeOption?.numNights || itinerary.numNights || 4;
  const travelStyle = itinerary.travelStyle || 'Curated Travel Experience';
  const tripType = itinerary.tripType || 'Customised Tour';
  const heroImage = itinerary.heroImage || '/images/about_hero4.jpg';
  const vehicleType = activeOption?.vehicleType || itinerary.vehicleType || 'Private AC Vehicle';
  const mealPlan = activeOption?.mealPlan || itinerary.mealPlan || 'Breakfast & Dinner';

  // Dynamic overrides per option
  const currentAccommodations = activeOption?.accommodations || itinerary.accommodations || [];
  const currentPerAdultPrice = activeOption?.perAdultPrice ?? itinerary.perAdultPrice;
  const currentPerKidPrice = activeOption?.perKidPrice ?? itinerary.perKidPrice;
  const currentBaseAmount = activeOption?.baseAmount ?? itinerary.baseAmount;
  const isIntl = isInternationalTrip(destination, itinerary.tripType || '');
  const currentGstPct = activeOption?.gstPercentage !== undefined ? activeOption.gstPercentage : (itinerary.gstPercentage !== undefined ? itinerary.gstPercentage : 5);
  const currentTcsPct = isIntl
    ? (activeOption?.tcsPercentage !== undefined ? activeOption.tcsPercentage : (itinerary.tcsPercentage !== undefined ? itinerary.tcsPercentage : 2))
    : 0;
  const currentGstAmount = activeOption?.gstAmount ?? (currentBaseAmount ? Math.round(currentBaseAmount * (currentGstPct / 100)) : itinerary.gstAmount);
  const currentTcsAmount = activeOption?.tcsAmount ?? (currentBaseAmount && currentTcsPct > 0 ? Math.round(currentBaseAmount * (currentTcsPct / 100)) : itinerary.tcsAmount);
  const currentFinalQuotationAmount = activeOption?.finalQuotationAmount ?? itinerary.finalQuotationAmount ?? (currentBaseAmount ? currentBaseAmount + (currentGstAmount || 0) + (currentTcsAmount || 0) : undefined);
  const currentChildPricingNote = activeOption?.childPricingNote || itinerary.childPricingNote;
  const currentFlightQuotations = activeOption?.flightQuotations || itinerary.flightQuotations;
  const currentDayPlans = activeOption?.dayPlans || itinerary.dayPlans;
  const currentInclusions = activeOption?.inclusions || itinerary.inclusions || [];
  const currentExclusions = activeOption?.exclusions || itinerary.exclusions || [];
  const currentDuration = activeOption?.duration || itinerary.duration || (itinerary.dates ? `${numNights} Nights / ${numDays} Days | ${itinerary.dates}` : `${numNights} Nights / ${numDays} Days`);

  // Route cities breakdown
  const routeDisplay = itinerary.route || destination;
  const staySummary = activeOption?.routeSummary || itinerary.routeSummary || `${numNights}N ${destination}`;

  // 6 Collage images for Page 2
  const isTadobaDest = destination.toLowerCase().includes('tadoba') || (itinerary.id && itinerary.id.toLowerCase().includes('tadoba'));
  const isRajasthanDest = destination.toLowerCase().includes('rajasthan') || (itinerary.id && itinerary.id.toLowerCase().includes('rajasthan')) || (itinerary.id && itinerary.id.toLowerCase().includes('4002b3f4'));
  const isVietnamDest = destination.toLowerCase().includes('vietnam') || (itinerary.id && itinerary.id.toLowerCase().includes('vietnam'));
  const isAlibaugDest = destination.toLowerCase().includes('alibaug') || (itinerary.id && itinerary.id.toLowerCase().includes('alibaug'));

  const defaultCollage = isTadobaDest ? [
    '/images/tadoba/tadoba_safari.jpg',
    '/images/tadoba/tadoba_lake.jpg',
    '/images/tadoba/tadoba_resort.jpg',
    '/images/tadoba/tadoba_deer.jpg',
    '/images/tadoba/tadoba_leopard.jpg',
    '/images/tadoba/tadoba_sunset.jpg'
  ] : (isRajasthanDest ? [
    '/images/Rajasthan/rajasthan1.jpeg',
    '/images/Rajasthan/rajasthan2.jpeg',
    '/images/Rajasthan/rajasthan3.jpeg',
    '/images/Rajasthan/rajasthan4.jpeg',
    '/images/Rajasthan/rajasthan5.jpg',
    '/images/Rajasthan/rajasthan6.jpg'
  ] : (isVietnamDest ? [
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png',
    '/images/vietnam-couple.png',
    '/images/vietnam-dreamy.png',
    '/images/vietnam-exotic.png',
    '/images/vietnam-highlights.png'
  ] : (isAlibaugDest ? [
    '/images/alibaug/hero.jpg',
    '/images/alibaug/beach-tents.jpg',
    '/images/alibaug/beach-camping-sunset.jpg',
    '/images/alibaug/beach-cinema-night.jpg',
    '/images/alibaug/dj-night.jpg',
    '/images/alibaug/surfing-lesson.jpg'
  ] : [
    heroImage,
    '/images/himachal.jpg',
    '/images/himachal2.jpg',
    '/images/himachal3.jpg',
    '/images/himachal4.jpg',
    '/images/himachal5.jpg'
  ])));

  const collageImages = itinerary.galleryImages && itinerary.galleryImages.length >= 6
    ? itinerary.galleryImages.slice(0, 6)
    : defaultCollage;

  // Payment stage calculations
  const alreadyPaid = Number(itinerary.advanceAmountPaid || 0);
  const totalQuotationAmount = Number(currentFinalQuotationAmount || 0);
  const remainingBalanceAmount = Math.max(0, totalQuotationAmount - alreadyPaid);
  const tenPercentAmount = Math.round(totalQuotationAmount * 0.1);
  const fiftyPercentAmount = Math.round(totalQuotationAmount * 0.5);
  const isFullyPaid = alreadyPaid >= totalQuotationAmount && totalQuotationAmount > 0;
  const isAdvancePaid = alreadyPaid >= fiftyPercentAmount && !isFullyPaid;
  const isTokenPaid = alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount;

  // Online Booking Feature Flag:
  // Disabled for all past itineraries already sent to clients. Only active for new itineraries or when explicitly enabled.
  const isOnlineBookingEnabled = Boolean(itinerary.enableOnlineBooking);
  const isFullPaymentOnly = Boolean(itinerary.fullPaymentOnly);

  // Book Modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState<ItineraryPaymentType>('token');

  const handleOpenBookModal = (type: ItineraryPaymentType = 'token') => {
    if (!isOnlineBookingEnabled) return;
    setSelectedPaymentType(type);
    setIsBookModalOpen(true);
  };

  const rawDatesStr = (activeOption as any)?.dates || itinerary.dates || '';
  const travelStartDate = rawDatesStr ? rawDatesStr.split(/[–—-]/)[0]?.trim() : undefined;
  const travelEndDate = rawDatesStr ? rawDatesStr.split(/[–—-]/)[1]?.trim() : undefined;

  return (
    <div className={`${sansBody.className} min-h-screen bg-[#ECE8E1] text-stone-900 selection:bg-[#6E1E14] selection:text-white ${isOnlineBookingEnabled ? 'pb-24 sm:pb-32' : 'pb-10 sm:pb-16'} print:pb-0`}>

      {/* Top Floating Control Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 py-2.5 px-3 sm:px-8 shadow-2xs print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-1.5">
              <img src="/images/Made_LOGO.png" alt="Wanderphilia" className="h-12 w-auto object-contain" />
            </Link>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span className="text-[11px] sm:text-xs font-bold text-stone-600 hidden sm:inline">
              Ref: <span className="text-[#6E1E14] font-mono font-black">{itinerary.id}</span>
            </span>

            {alreadyPaid > 0 && (
              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{isFullyPaid ? '✓ 100% Fully Paid' : (isAdvancePaid ? '✓ 50% Advance Paid' : '✓ 10% Token Paid')}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOnlineBookingEnabled && !isFullyPaid && (
              <button
                type="button"
                onClick={() => handleOpenBookModal('token')}
                className="hidden sm:inline-flex items-center gap-1.5 bg-[#6E1E14] hover:bg-[#5C1810] text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-xs transition hover:scale-105 active:scale-95 uppercase tracking-wider cursor-pointer"
              >
                <Lock className="w-3 h-3 text-amber-300" />
                <span>Book Now</span>
              </button>
            )}

            <ItineraryClientActions
              itineraryId={itinerary.id}
              title={itinerary.title}
              leadName={leadName}
              destination={destination}
              totalQuotationAmount={totalQuotationAmount}
              numDays={numDays}
              numNights={numNights}
            />
          </div>
        </div>
      </header>

      {/* DOCUMENT CONTAINER (A4 / Canva Sheet Style Pages) */}
      <main className="max-w-4xl mx-auto px-0 sm:px-4 pt-6 space-y-10">

        {/* ========================================================= */}
        {/* PAGE 1: COVER PAGE (DUPLICATE PROPOSAL TEMPLATE MATCH)    */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[900px] flex flex-col justify-between relative print:shadow-none print:border-0 print:rounded-none print:m-0 print:p-0 page-break-after">

          {/* Top Header & Merge Fields Section */}
          <div className="pt-10 pb-6 px-6 sm:px-12 text-center relative space-y-3">

            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-0">
              <Link
                href="/"
                title="Wanderphilia Home"
                className="inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <img
                  src="/images/Made_LOGO.png"
                  alt="Wanderphilia Logo"
                  className="h-20 sm:h-36 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Subheader */}
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className={`${cursiveFont.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF6E0B] tracking-wide inline-block drop-shadow-2xs`}>
                {possessiveName}
              </span>
              <span className={`${playfair.className} text-xl sm:text-2xl md:text-3xl font-black text-[#7A2B20] tracking-tight`}>
                itinerary
              </span>
            </div>

            {/* Main Proposal Heading */}
            <div className="px-2 sm:px-6 pt-1">
              <h1 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl font-black text-[#7A2B20] tracking-tight leading-tight`}>
                {itinerary.title}
              </h1>
            </div>

            {/* Duration / Dates & Style */}
            <div className="pt-0.5 space-y-1">
              <p className="text-sm sm:text-base font-extrabold text-[#6E1E14]">
                {itinerary.duration}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-600">
                {travelStyle} • {tripType}
              </p>
            </div>
          </div>

          {/* Destination Hero Photo */}
          <div className="px-6 sm:px-12 grow flex items-center justify-center my-3">
            <div className="relative w-full max-w-2xl h-[380px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <SafeImage
                src={heroImage}
                alt={destination}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl text-white text-xs sm:text-sm font-medium leading-relaxed border border-white/20 text-center">
                Route: <strong className="text-amber-300 font-bold">{routeDisplay}</strong>
              </div>
            </div>
          </div>

          {/* Bottom Rust Contact Bar */}
          <div className="bg-[#6E1E14] text-white py-4 px-6 text-center text-[11px] sm:text-xs font-bold tracking-wide flex flex-wrap items-center justify-center gap-x-4 gap-y-1 shadow-inner">
            <span>+91 {contactPhoneDisplay}</span>
            <span>•</span>
            <span>{contactEmail}</span>
            <span>•</span>
            <span>www.wanderphilia.com</span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* MULTI-QUOTATION OPTION SWITCHER (IF MULTIPLE OPTIONS EXIST) */}
        {/* ========================================================= */}
        {itinerary.options && itinerary.options.length > 1 && (
          <ManualOptionSwitcher
            options={itinerary.options}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
            itinerarySlug={itinerary.slug || itinerary.id}
          />
        )}

        {/* ========================================================= */}
        {/* PAGE 2: TRIP OVERVIEW & HIGHLIGHTS COLLAGE                 */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[900px] flex flex-col justify-between relative print:shadow-none print:border-0 print:rounded-none page-break-after">

          {/* Top Rust Bar Accent */}
          <div className="h-3.5 bg-[#6E1E14] w-full" />

          <div className="p-6 sm:p-12 grow flex flex-col justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

              {/* LEFT COLUMN: Big Days + Route + Details */}
              <div className="space-y-6">

                {/* Big Days Badge */}
                <div className="flex items-baseline gap-3">
                  <span className={`${playfair.className} text-6xl sm:text-8xl font-black text-[#5C1810] leading-none`}>
                    {numDays}
                  </span>
                  <div>
                    <div className={`${playfair.className} text-lg sm:text-2xl font-black text-[#5C1810] uppercase tracking-tight`}>
                      Days.
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#7A2B20] uppercase tracking-wider">
                      Unforgettable Experiences.
                    </div>
                  </div>
                </div>

                {/* Structured Route Box */}
                <div className="space-y-4 pt-2 border-t border-[#6E1E14]/15">
                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Trip Duration & Dates:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {currentDuration}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Route:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {routeDisplay}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Night Stay Breakdown:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {staySummary}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Transport & Chauffeur:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {vehicleType} with Dedicated Chauffeur Cum Guide
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Meal Plan:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5 text-[#6E1E14]" />
                      <span>{mealPlan}</span>
                    </div>
                  </div>
                </div>

                {/* Theme Highlights Pills */}
                <div className="pt-4 border-t border-[#6E1E14]/15">
                  <div className="text-xs sm:text-sm font-black text-[#6E1E14] uppercase tracking-wider leading-relaxed">
                    {activeOption?.title ? activeOption.title.toUpperCase() : (itinerary.subtitle ? itinerary.subtitle.toUpperCase() : `${destination.toUpperCase()} TOUR ITINERARY`)}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 2x3 Photo Collage (6 photos) */}
              <div className="grid grid-cols-2 gap-2.5 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 shadow-inner">
                {collageImages.map((img, i) => (
                  <div key={i} className="relative h-28 sm:h-36 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <SafeImage
                      src={img}
                      alt={`Highlight ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

            </div>

            {/* Wanderphilia Moments (if present) */}
            {itinerary.moments && itinerary.moments.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-[#6E1E14]/15">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">✨</span>
                  <h3 className={`${playfair.className} text-base sm:text-lg font-black text-[#6E1E14] uppercase tracking-wider`}>
                    Wanderphilia Moments
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {itinerary.moments.map((moment, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-stone-200/90 shadow-2xs">
                      <span className="text-[#FF6E0B] font-black text-xs shrink-0 mt-0.5">✦</span>
                      <span className="text-xs font-bold text-stone-800 leading-snug">{moment}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Rust Bar */}
          <div className="bg-[#6E1E14] text-white py-3 px-6 text-center text-[10px] sm:text-xs font-bold tracking-wide">
            Wanderphilia {destination} Travel Proposal
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE 3 & 4: FLOWCHART DAY-BY-DAY ITINERARY               */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-3 sm:p-10 space-y-8 relative print:shadow-none print:border-0 print:rounded-none page-break-after">

          {/* Centered Travel Itinerary Header */}
          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-6">
            <h2 className={`${playfair.className} text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase underline decoration-[#6E1E14]/40 decoration-2 underline-offset-8`}>
              Detailed Flow-Chart Itinerary
            </h2>

            {/* Route Arrows Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-extrabold text-stone-800">
              <span className="text-[#6E1E14] font-black">{numNights} Nights {numDays} Days → </span>
              <span className="text-stone-900">{staySummary}</span>
            </div>
          </div>

          {/* Interactive Flow Chart Timeline Section */}
          <ManualFlowchartSection
            dayPlans={currentDayPlans}
            destination={destination}
            defaultImages={collageImages}
          />

        </section>

        {/* ========================================================= */}
        {/* PAGE 5: ACCOMMODATION, INCLUSIONS & EXCLUSIONS + CARRY BAG */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-3 sm:p-8 md:p-10 space-y-6 sm:space-y-8 relative print:shadow-none print:border-0 print:rounded-none page-break-after">

          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-4">
            <h2 className={`${playfair.className} text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase`}>
              Accommodation, Inclusions & Exclusions
            </h2>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              Complete Trip Inclusions, Stay Plan & Essentials Checklist
            </p>
          </div>

          {/* Accommodations Table */}
          {currentAccommodations && currentAccommodations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#6E1E14] flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-[#6E1E14]" /> Handpicked Accommodations
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-emerald-600" />
                    {mealPlan}
                  </span>
                  {activeOption && (
                    <span className="text-[10px] sm:text-xs font-bold bg-amber-100 text-[#6E1E14] px-2.5 py-0.5 rounded-full border border-amber-300">
                      {activeOption.badge || activeOption.title}
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border-2 border-[#6E1E14] shadow-xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#6E1E14] text-white uppercase text-[11px] font-black tracking-wider">
                      <th className="p-3.5 border-r border-white/20">Destination</th>
                      <th className="p-3.5 border-r border-white/20">Duration</th>
                      <th className="p-3.5 border-r border-white/20">Property Name</th>
                      <th className="p-3.5">Room Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#6E1E14]/20 font-semibold text-stone-900 bg-white">
                    {currentAccommodations.map((acc, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-[#FFF8F5]' : 'bg-white'}>
                        <td className="p-3.5 border-r border-[#6E1E14]/20 uppercase font-bold text-[#6E1E14]">
                          {acc.city}
                        </td>
                        <td className="p-3.5 border-r border-[#6E1E14]/20 font-extrabold">
                          {acc.nights} Night{acc.nights > 1 ? 's' : ''}
                        </td>
                        <td className="p-3.5 border-r border-[#6E1E14]/20 font-extrabold">
                          {acc.hotelName || 'Deluxe Property'}
                        </td>
                        <td className="p-3.5">
                          {acc.roomCategory || 'Triple Sharing Basis'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inclusions & Exclusions Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">

            {/* INCLUSIONS CARD */}
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-600/30 shadow-xs space-y-4">
              <div className="text-xs sm:text-sm uppercase font-black tracking-wider text-emerald-800 flex items-center gap-2 pb-2 border-b border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <span>Inclusions</span>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-stone-700 leading-relaxed">
                {currentInclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* EXCLUSIONS CARD */}
            <div className="bg-white p-6 rounded-2xl border-2 border-rose-600/30 shadow-xs space-y-4">
              <div className="text-xs sm:text-sm uppercase font-black tracking-wider text-rose-800 flex items-center gap-2 pb-2 border-b border-rose-100">
                <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-rose-700" />
                </div>
                <span>Exclusions</span>
              </div>
              <ul className="space-y-2.5 text-xs font-semibold text-stone-700 leading-relaxed">
                {currentExclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* 🎒 IMPORTANT THINGS TO CARRY */}
          {itinerary.thingsToCarry && itinerary.thingsToCarry.length > 0 && (
            <div className="bg-amber-50/70 p-6 rounded-2xl border-2 border-amber-300/80 shadow-xs space-y-3">
              <div className="text-xs sm:text-sm uppercase font-black tracking-wider text-amber-950 flex items-center gap-2 pb-2 border-b border-amber-200">
                <Luggage className="w-4 h-4 text-amber-700" />
                <span>🎒 Important Things to Carry:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                {itinerary.thingsToCarry.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/80 backdrop-blur-xs p-3 rounded-xl border border-amber-200/80 shadow-2xs">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span className="text-xs font-bold text-stone-800">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PACKAGE QUOTATION & INVESTMENT SUMMARY CARD */}
          {(currentFinalQuotationAmount || currentPerAdultPrice) && (
            <div className="bg-gradient-to-br from-[#6E1E14] via-[#5C1810] to-stone-900 rounded-2xl p-5 sm:p-8 text-white shadow-xl space-y-5 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                      Tour Quotation
                    </span>
                    {activeOption && (
                      <span className="text-[10px] bg-amber-400/30 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-400/40">
                        {activeOption.badge || activeOption.title}
                      </span>
                    )}
                  </div>
                  <h3 className={`${playfair.className} text-xl sm:text-2xl font-black text-white`}>
                    Investment & Pricing Summary
                  </h3>
                </div>
                <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {(activeOption?.kids ?? itinerary.kids) && (activeOption?.kids ?? itinerary.kids)! > 0
                    ? `${(activeOption?.adults ?? itinerary.adults) || 2} Adults + ${activeOption?.kids ?? itinerary.kids} Kids (Family Tour)`
                    : (activeOption?.adults ?? itinerary.adults) === 1
                      ? 'Per Person Rate (1 Guest)'
                      : `${(activeOption?.adults ?? itinerary.adults) || 2} Adults Included`}
                </div>
              </div>

              {/* Pricing calculations */}
              {(() => {
                const adultsCount = (activeOption?.adults ?? itinerary.adults) || 2;
                const baseTotal = currentBaseAmount || (currentFinalQuotationAmount ? Math.round(currentFinalQuotationAmount / (currentTcsPct > 0 ? (1 + (currentGstPct + currentTcsPct)/100) : (1 + currentGstPct/100))) : 638400);
                const gstPct = currentGstPct;
                const tcsPct = currentTcsPct;
                const gstTotal = currentGstAmount !== undefined ? currentGstAmount : Math.round(baseTotal * (gstPct / 100));
                const tcsTotal = currentTcsAmount !== undefined ? currentTcsAmount : (tcsPct > 0 ? Math.round(baseTotal * (tcsPct / 100)) : 0);
                const grandTotal = currentFinalQuotationAmount || (baseTotal + gstTotal + tcsTotal);

                const hasKidPrice = Boolean(currentPerKidPrice && currentPerKidPrice > 0);
                const adultBase = currentPerAdultPrice || Math.round(baseTotal / adultsCount);
                const adultGst = Math.round(adultBase * (gstPct / 100));
                const adultTcs = tcsPct > 0 ? Math.round(adultBase * (tcsPct / 100)) : 0;
                const adultGrand = adultBase + adultGst + adultTcs;

                const kidBase = currentPerKidPrice || 0;
                const kidGst = Math.round(kidBase * (gstPct / 100));
                const kidTcs = tcsPct > 0 ? Math.round(kidBase * (tcsPct / 100)) : 0;
                const kidGrand = kidBase + kidGst + kidTcs;

                if (hasKidPrice) {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                      {/* 1. Per Adult Cost */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                            <span>Cost Per Adult</span>
                            <Users className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="text-lg sm:text-xl font-black text-white">
                            ₹{adultBase.toLocaleString('en-IN')}/-
                          </div>
                          <div className="space-y-0.5 pt-0.5 text-[10px] sm:text-[11px] text-amber-200/95 font-semibold leading-tight">
                            <div>+ {gstPct}% GST: ₹{adultGst.toLocaleString('en-IN')}/-</div>
                            {tcsTotal > 0 && <div>+ {tcsPct}% TCS: ₹{adultTcs.toLocaleString('en-IN')}/-</div>}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/15 text-[11px] text-white/90 font-medium flex items-center justify-between">
                          <span className="text-white/70">Grand Total:</span>
                          <span className="text-amber-300 font-black text-xs sm:text-sm">₹{adultGrand.toLocaleString('en-IN')}/-</span>
                        </div>
                      </div>

                      {/* 2. Child Cost (With Extra Bed) */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                            <span>Child with Extra Bed</span>
                            <Users className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="text-lg sm:text-xl font-black text-white">
                            ₹{kidBase.toLocaleString('en-IN')}/-
                          </div>
                          <div className="space-y-0.5 pt-0.5 text-[10px] sm:text-[11px] text-amber-200/95 font-semibold leading-tight">
                            <div>+ {gstPct}% GST: ₹{kidGst.toLocaleString('en-IN')}/-</div>
                            {tcsTotal > 0 && <div>+ {tcsPct}% TCS: ₹{kidTcs.toLocaleString('en-IN')}/-</div>}
                          </div>
                          <div className="text-[10px] text-emerald-300 font-bold pt-1 leading-tight">
                            Dedicated Extra Bed Included
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/15 text-[11px] text-white/90 font-medium flex items-center justify-between">
                          <span className="text-white/70">Grand Total:</span>
                          <span className="text-amber-300 font-black text-xs sm:text-sm">₹{kidGrand.toLocaleString('en-IN')}/-</span>
                        </div>
                      </div>

                      {/* 3. Total Package Cost */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                            <span>Total Family Cost</span>
                            <Parachute size={16} className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="text-lg sm:text-xl font-black text-white">
                            ₹{baseTotal.toLocaleString('en-IN')}/-
                          </div>
                          <div className="space-y-0.5 pt-0.5 text-[10px] sm:text-[11px] text-amber-200/95 font-semibold leading-tight">
                            <div>+ {gstPct}% GST: ₹{gstTotal.toLocaleString('en-IN')}/-</div>
                            {tcsTotal > 0 && <div>+ {tcsPct}% TCS: ₹{tcsTotal.toLocaleString('en-IN')}/-</div>}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-white/15 text-[11px] text-white/90 font-medium flex items-center justify-between">
                          <span className="text-white/70">Grand Total:</span>
                          <span className="text-amber-300 font-black text-xs sm:text-sm">₹{grandTotal.toLocaleString('en-IN')}/-</span>
                        </div>
                      </div>

                      {/* 4. Flexible Payment Stages */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 space-y-1">
                        <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
                          <span>{isFullPaymentOnly ? 'Payment Terms' : 'Flexible Payment Stages'}</span>
                          <CreditCard className="w-4 h-4 text-emerald-300" />
                        </div>
                        {isFullPaymentOnly ? (
                          <div className="text-[11px] text-white/90 space-y-1 pt-0.5 font-semibold">
                            <div>• 100% Full Payment: ₹{grandTotal.toLocaleString('en-IN')}/-</div>
                            <div className="text-[10px] text-amber-200/90 font-normal leading-tight">
                              Full amount is payable in a single transaction to confirm booking.
                            </div>
                          </div>
                        ) : (
                          <div className="text-[11px] text-white/90 space-y-0.5 pt-0.5 font-semibold">
                            <div>• 10% Token: ₹{Math.round(grandTotal * 0.10).toLocaleString('en-IN')}/- (Locks proposal)</div>
                            <div>• 50% Advance: ₹{Math.round(grandTotal * 0.50).toLocaleString('en-IN')}/- (Due in 7 days)</div>
                            <div>• Final Balance: Due 15 days before travel</div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                // Standard Per Guest layout when no kid price
                const basePerGuest = Math.round(baseTotal / adultsCount);
                const gstPerGuest = Math.round(gstTotal / adultsCount);
                const tcsPerGuest = tcsTotal > 0 ? Math.round(tcsTotal / adultsCount) : 0;
                const grandTotalPerGuest = Math.round(grandTotal / adultsCount);

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {/* 1. Cost Per Guest (Base + Taxes + Grand Total) */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                          <span>Cost Per Guest</span>
                          <Users className="w-4 h-4 text-amber-300" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white">
                          ₹{basePerGuest.toLocaleString('en-IN')}/-
                        </div>
                        <div className="space-y-0.5 pt-0.5 text-[11px] text-amber-200/95 font-semibold leading-tight">
                          <div>+ {gstPct}% GST: ₹{gstPerGuest.toLocaleString('en-IN')}/-</div>
                          {tcsTotal > 0 && <div>+ {tcsPct}% TCS: ₹{tcsPerGuest.toLocaleString('en-IN')}/-</div>}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/15 text-[11px] text-white/90 font-medium flex items-center justify-between">
                        <span className="text-white/70">Grand Total:</span>
                        <span className="text-amber-300 font-black text-xs sm:text-sm">₹{grandTotalPerGuest.toLocaleString('en-IN')}/-</span>
                      </div>
                    </div>

                    {/* 2. Total Package Cost (Base + Taxes + Grand Total) */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center justify-between">
                          <span>Total Package Cost</span>
                          <Parachute size={16} className="w-4 h-4 text-amber-300" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white">
                          ₹{baseTotal.toLocaleString('en-IN')}/-
                        </div>
                        <div className="space-y-0.5 pt-0.5 text-[11px] text-amber-200/95 font-semibold leading-tight">
                          <div>+ {gstPct}% GST: ₹{gstTotal.toLocaleString('en-IN')}/-</div>
                          {tcsTotal > 0 && <div>+ {tcsPct}% TCS: ₹{tcsTotal.toLocaleString('en-IN')}/-</div>}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/15 text-[11px] text-white/90 font-medium flex items-center justify-between">
                        <span className="text-white/70">Grand Total:</span>
                        <span className="text-amber-300 font-black text-xs sm:text-sm">₹{grandTotal.toLocaleString('en-IN')}/-</span>
                      </div>
                    </div>

                    {/* 3. Flexible Payment Stages */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 space-y-1 sm:col-span-2 md:col-span-1">
                      <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-emerald-300 flex items-center justify-between">
                        <span>{isFullPaymentOnly ? 'Payment Terms' : 'Flexible Payment Stages'}</span>
                        <CreditCard className="w-4 h-4 text-emerald-300" />
                      </div>
                      {isFullPaymentOnly ? (
                        <div className="text-[11px] text-white/90 space-y-1 pt-0.5 font-semibold">
                          <div>• 100% Full Payment: ₹{grandTotal.toLocaleString('en-IN')}/-</div>
                          <div className="text-[10px] text-amber-200/90 font-normal leading-tight">
                            Full amount is payable in a single transaction to confirm booking.
                          </div>
                        </div>
                      ) : (
                        <div className="text-[11px] text-white/90 space-y-0.5 pt-0.5 font-semibold">
                          <div>• 10% Token: ₹{Math.round(grandTotal * 0.10).toLocaleString('en-IN')}/- (Locks dates & proposal)</div>
                          <div>• 50% Advance: ₹{Math.round(grandTotal * 0.50).toLocaleString('en-IN')}/- (Due in 7 days)</div>
                          <div>• Final Balance: Due 15 days before departure</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Child Pricing & Sharing Note (if provided) */}
              {currentChildPricingNote && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-amber-400/40 text-xs text-amber-200/95 font-medium flex items-start gap-2.5">
                  <span className="text-amber-300 font-bold shrink-0">ℹ</span>
                  <span>{currentChildPricingNote}</span>
                </div>
              )}

              {/* INTERACTIVE PAYMENT INSTALLMENT OPTIONS */}
              {isOnlineBookingEnabled && !isFullyPaid && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 space-y-3.5 mt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Payment Options • Online Booking</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        Choose Your Installment & Book Instantly
                      </h4>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                      Razorpay Verified
                    </span>
                  </div>

                  {alreadyPaid <= 0 ? (
                    /* 3 OPTIONS FOR FRESH BOOKINGS (0% PAID) */
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* 1. 10% Token Payment */}
                      <div className="bg-white/95 rounded-xl p-3.5 border-2 border-amber-200/80 shadow-xs flex flex-col justify-between space-y-3 text-stone-900 transition hover:shadow-md hover:border-amber-400">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-amber-100 text-amber-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              10% Token
                            </span>
                            <span className="text-[10px] font-bold text-stone-500">Stage 1</span>
                          </div>
                          <h5 className="text-xs font-black text-stone-900">Token Amount</h5>
                          <div className="text-lg sm:text-xl font-black text-[#6E1E14]">
                            ₹{tenPercentAmount.toLocaleString('en-IN')}/-
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            Locks your itinerary proposal, dates & slot reservations. 50% advance payable within 7 days.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('token')}
                          className="w-full h-9 rounded-lg bg-stone-900 hover:bg-[#6E1E14] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-amber-300" />
                          <span>Book with 10% Token</span>
                        </button>
                      </div>

                      {/* 2. 50% Advance Payment (Recommended) */}
                      <div className="bg-white/95 rounded-xl p-3.5 border-2 border-amber-400 shadow-md ring-2 ring-amber-400/20 flex flex-col justify-between space-y-3 text-stone-900 transition hover:shadow-lg relative">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-amber-400 text-stone-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              ★ Recommended
                            </span>
                            <span className="text-[10px] font-bold text-amber-800">Stage 2</span>
                          </div>
                          <h5 className="text-xs font-black text-stone-900">50% Advance</h5>
                          <div className="text-lg sm:text-xl font-black text-[#6E1E14]">
                            ₹{fiftyPercentAmount.toLocaleString('en-IN')}/-
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            Locks handpicked hotel stays, activities & dedicated chauffeur transport. Balance due 15 days before departure.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('advance')}
                          className="w-full h-9 rounded-lg bg-[#6E1E14] hover:bg-[#5C1810] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-amber-300" />
                          <span>Book with 50% Advance</span>
                        </button>
                      </div>

                      {/* 3. 100% Full Payment */}
                      <div className="bg-white/95 rounded-xl p-3.5 border-2 border-emerald-300 shadow-xs flex flex-col justify-between space-y-3 text-stone-900 transition hover:shadow-md hover:border-emerald-500">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              ✓ 100% Cleared
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700">One-Shot</span>
                          </div>
                          <h5 className="text-xs font-black text-stone-900">Full Payment</h5>
                          <div className="text-lg sm:text-xl font-black text-stone-900">
                            ₹{totalQuotationAmount.toLocaleString('en-IN')}/-
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            Zero pending dues, instant confirmed booking kit & official GST tax invoice sent immediately.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('full')}
                          className="w-full h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                          <span>Pay Full 100%</span>
                        </button>
                      </div>
                    </div>
                  ) : isTokenPaid ? (
                    /* 2 OPTIONS WHEN 10% TOKEN IS ALREADY PAID */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Remaining Advance (40%) */}
                      <div className="bg-white/95 rounded-xl p-3.5 border-2 border-amber-400 shadow-md flex flex-col justify-between space-y-3 text-stone-900">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-amber-400 text-stone-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              Next Stage (40%)
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-stone-900">Pay Remaining Advance</h5>
                          <div className="text-lg sm:text-xl font-black text-[#6E1E14]">
                            ₹{Math.max(0, fiftyPercentAmount - alreadyPaid).toLocaleString('en-IN')}/-
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            Completes 50% advance to lock hotel stays. Final balance due 15 days before travel.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('remaining_advance')}
                          className="w-full h-9 rounded-lg bg-[#6E1E14] hover:bg-[#5C1810] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-amber-300" />
                          <span>Pay Remaining Advance</span>
                        </button>
                      </div>

                      {/* Remaining Full Balance (90%) */}
                      <div className="bg-white/95 rounded-xl p-3.5 border-2 border-emerald-300 shadow-xs flex flex-col justify-between space-y-3 text-stone-900">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                              Clear All Dues
                            </span>
                          </div>
                          <h5 className="text-xs font-black text-stone-900">Clear Full Balance</h5>
                          <div className="text-lg sm:text-xl font-black text-stone-900">
                            ₹{remainingBalanceAmount.toLocaleString('en-IN')}/-
                          </div>
                          <p className="text-[10px] text-stone-600 leading-tight">
                            Clears 100% quotation immediately with 0 balance pending.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('remaining_balance')}
                          className="w-full h-9 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                          <span>Pay Remaining Balance</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* REMAINING 50% BALANCE */
                    <div className="bg-white/95 rounded-xl p-3.5 border-2 border-[#6E1E14] shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-900">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="bg-amber-400 text-stone-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                          Final Stage
                        </span>
                        <h5 className="text-sm font-black text-stone-900">Pay Remaining 50% Balance</h5>
                        <p className="text-[10px] text-stone-600">Due 15 days before departure to release all hotel vouchers & chauffeur transport.</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-xl font-black text-[#6E1E14]">
                          ₹{remainingBalanceAmount.toLocaleString('en-IN')}/-
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenBookModal('remaining_balance')}
                          className="h-10 px-5 rounded-lg bg-[#6E1E14] hover:bg-[#5C1810] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5 text-amber-300" />
                          <span>Pay Balance Now</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* LIVE VERIFIED PAYMENT STATUS CARD (IF ALREADY PAID) */}
              {isOnlineBookingEnabled && alreadyPaid > 0 && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-emerald-400/40 space-y-2 mt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                        {isFullyPaid ? '✓ 100% Tour Confirmed & Cleared' : (isAdvancePaid ? '✓ 50% Advance Paid & Locked' : '✓ 10% Token Paid & Proposal Locked')}
                      </span>
                    </div>
                    <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                      Payment Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                    <div className="bg-emerald-950/50 p-3 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-stone-300 font-semibold">Total Paid to Date:</span>
                      <span className="font-black text-emerald-300 text-sm sm:text-base">₹{alreadyPaid.toLocaleString('en-IN')}/-</span>
                    </div>

                    <div className="bg-amber-950/50 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
                      <span className="text-stone-300 font-semibold">Remaining Balance:</span>
                      <span className="font-black text-amber-300 text-sm sm:text-base">₹{remainingBalanceAmount.toLocaleString('en-IN')}/-</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-200/90 font-medium pt-0.5">
                    {isTokenPaid ? (
                      <>Next Stage: <b>₹{(fiftyPercentAmount - alreadyPaid).toLocaleString('en-IN')} Advance</b> payable within 7 days. Final balance due 15 days before travel.</>
                    ) : isAdvancePaid ? (
                      <>Next Stage: <b>Final Balance ₹{remainingBalanceAmount.toLocaleString('en-IN')}</b> payable 15 days before departure.</>
                    ) : (
                      <>All hotel stays & private chauffeur transport are fully confirmed. Zero pending dues!</>
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ✈️ FLIGHT QUOTATIONS & SCHEDULE (Placed below the Tour Quotation) */}
          {currentFlightQuotations && currentFlightQuotations.length > 0 && (
            <ManualFlightQuotationSection flightQuotations={currentFlightQuotations} />
          )}

          {/* Bottom Rust Bar */}
          <div className="bg-[#6E1E14] text-white py-3 px-6 text-center text-[10px] sm:text-xs font-bold tracking-wide rounded-xl">
            Wanderphilia Travel Proposal • Inclusions & Exclusions
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE 6: PAYMENT TERMS, CANCELLATION, POLICIES & SIGN-OFF */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-6 sm:p-10 space-y-8 relative print:shadow-none print:border-0 print:rounded-none">

          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-4">
            <h2 className={`${playfair.className} text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase`}>
              Payment Terms & Policies
            </h2>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              Clear Guidelines, Flexible Policies & Direct Booking Process
            </p>
          </div>

          {/* 1. PAYMENT TERMS */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-100 pb-2.5">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>Payment Terms & Timelines</span>
            </div>
            {isFullPaymentOnly ? (
              <ul className="space-y-2 text-xs font-semibold text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span><b>100% Full Payment at Booking:</b> 100% full amount is payable in a single transaction at the time of booking to confirm and lock beachfront camping tents, buffet meals, DJ setup, bonfire, and group activities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span><b>Single Installment:</b> No split installments or partial token options apply for this event. 100% clearance confirms your team reservation immediately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span>All bookings are subject to availability and campsite confirmation at the time of receipt of full payment.</span>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-xs font-semibold text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span><b>10% Token Amount:</b> Locks your itinerary proposal, dates and begins slot reservations.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span><b>50% Advance Payment:</b> Payable within <b>7 days</b> of token payment to confirm hotel stays and private transport.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span><b>Final Balance Payment:</b> Must be received at least <b>15 days prior to departure</b> to release final confirmation vouchers and driver allocation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                  <span>All bookings are subject to availability and confirmation from respective suppliers at the time of payment.</span>
                </li>
              </ul>
            )}
          </div>

          {/* 2. CANCELLATION POLICY */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-[#5C1810] border-b border-stone-100 pb-2.5">
              <AlertTriangle className="w-4 h-4 text-[#6E1E14]" />
              <span>Cancellation Policy</span>
            </div>
            <p className="text-xs font-bold text-stone-700">
              In the event of cancellation by the guest:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase">More than 30 days before departure</span>
                <span className="font-extrabold text-[#6E1E14] text-xs pt-1">Cancellation charges as per actual expenses incurred and supplier policies.</span>
              </div>
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase">30 to 16 days before departure</span>
                <span className="font-extrabold text-[#6E1E14] text-xs pt-1">50% of the total package cost.</span>
              </div>
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase">15 to 08 days before departure</span>
                <span className="font-extrabold text-[#6E1E14] text-xs pt-1">75% of the total package cost.</span>
              </div>
              <div className="bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200 flex flex-col justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase">07 days or less / No Show</span>
                <span className="font-extrabold text-[#6E1E14] text-xs pt-1">100% of the total package cost.</span>
              </div>
            </div>
            <p className="text-[11px] text-stone-500 italic pt-1">
              * Flights, visas, travel insurance, permits, attraction tickets, and other non-refundable services shall be charged as per the cancellation policy of the respective service providers.
            </p>
          </div>

          {/* 3. FORCE MAJEURE & OUR COMMITMENT */}
          <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 border-b border-blue-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Wanderphilia Force Majeure Policy</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed font-medium">
              In the event travel is affected due to war, armed conflict, government-imposed travel restrictions, airport closures, natural disasters, civil unrest, pandemics, or any other circumstances beyond the control of the traveller or the company:
            </p>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>We will make every effort to obtain refunds, waivers, or credits from airlines, hotels, and other suppliers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>Any amount successfully recovered from suppliers shall be passed on to the guest.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>In addition, we will offer either a <b>Credit Note valid for 12 months</b> from the original travel date for the recoverable booking value.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>Any unrecoverable charges levied by airlines, hotels, transport providers, visa authorities, or other suppliers shall remain payable by the guest.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                <span>Wanderphilia shall not be liable for any indirect losses, consequential expenses, or costs arising from such force majeure events.</span>
              </li>
            </ul>

            {/* Our Commitment Callout */}
            <div className="bg-gradient-to-r from-stone-900 to-[#5C1810] text-white p-4 sm:p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Our Commitment</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-stone-200">
                &ldquo;While unforeseen circumstances can affect travel plans, our priority is always to provide practical solutions, maximum flexibility, and fair outcomes for our guests while working closely with all travel partners to minimize financial impact.&rdquo;
              </p>
            </div>
          </div>

          {/* 4. PAYMENT PROCESS (BANK + UPI) */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#5C1810] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#6E1E14]" />
              <span>Payment Process</span>
            </h3>
            <ItineraryPaymentSection
              itineraryId={itinerary.id}
              destination={destination}
              proposalTitle={itinerary.title}
              perAdultPrice={currentPerAdultPrice || itinerary.perAdultPrice || 170772}
              adults={(activeOption?.adults ?? itinerary.adults) || 4}
              baseAmount={currentBaseAmount || itinerary.baseAmount || 638400}
              gstPercentage={currentGstPct || itinerary.gstPercentage || 5}
              tcsPercentage={currentTcsPct}
              totalQuotationAmount={totalQuotationAmount || 683088}
              advanceAmountPaid={alreadyPaid}
              balancePendingAmount={remainingBalanceAmount}
              paymentStage={itinerary.paymentStage}
              leadName={leadName}
              email={itinerary.email}
              mobile={itinerary.mobile}
              zohoLeadId={itinerary.zohoLeadId}
              inquiryId={itinerary.inquiryId}
              numDays={numDays}
              numNights={numNights}
              travelStartDate={travelStartDate}
              travelEndDate={travelEndDate}
              onOpenBookModal={isOnlineBookingEnabled ? handleOpenBookModal : undefined}
            />
          </div>

          {/* 5. THANK YOU & FOUNDER SIGN-OFF */}
          <div className="bg-white rounded-2xl border-2 border-[#6E1E14]/30 p-8 text-center space-y-5 shadow-xs">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#6E1E14]">
                With Gratitude
              </span>
              <h3 className={`${playfair.className} text-xl sm:text-3xl font-black text-stone-900`}>
                Thank you for choosing Wanderphilia
              </h3>
            </div>

            <div className="pt-2 border-t border-stone-200 max-w-xs mx-auto">
              <div className={`${playfair.className} font-black text-lg sm:text-xl text-[#5C1810]`}>
                Bhavin Thakker
              </div>
              <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Founder, Wanderphilia
              </div>
            </div>

            {/* Action Buttons: CHECK OUR REVIEWS & WHATSAPP */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/review"
                target="_blank"
                className="inline-flex items-center gap-2 bg-[#6E1E14] hover:bg-[#5C1810] text-white text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>CHECK OUR REVIEWS</span>
                <ExternalLink className="w-3.5 h-3.5 text-white/80" />
              </Link>

              <a
                href={`https://wa.me/91${contactPhoneDisplay}?text=Hi%20Bhavin,%20I%20have%20reviewed%20my%20proposal%20for%20${destination}%20(${itinerary.id})`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-black px-5 py-3 rounded-xl shadow-md transition hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RiWhatsappLine className="w-4 h-4 text-white" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Bottom Rust Bar */}
          <div className="bg-[#6E1E14] text-white py-3 px-6 text-center text-[10px] sm:text-xs font-bold tracking-wide rounded-xl">
            Wanderphilia Experiences Private Limited • Official Proposal Document
          </div>
        </section>

      </main>

      {/* ========================================================= */}
      {/* FLOATING STICKY BOTTOM BAR ("BOOK NOW") */}
      {/* ========================================================= */}
      {isOnlineBookingEnabled && (
        <>
          <aside aria-label="Book proposal action bar" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] p-3 sm:p-4 print:hidden">
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                    <Parachute size={11} className="w-3 h-3 text-amber-900" /> Official Proposal
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-500 font-bold hidden sm:inline">
                    Ref: {itinerary.id}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-xl font-black text-stone-900 tracking-tight">
                    ₹{totalQuotationAmount.toLocaleString('en-IN')}/-
                  </span>
                  <span className="text-[10px] sm:text-xs text-stone-500 font-medium hidden md:inline">
                    Total for {(activeOption?.kids ?? itinerary.kids) ? `${(activeOption?.adults ?? itinerary.adults) || 2} Adults + ${activeOption?.kids ?? itinerary.kids} Kids` : `${(activeOption?.adults ?? itinerary.adults) || 2} Adults`} ({currentGstPct}% GST{currentTcsPct > 0 ? ` & ${currentTcsPct}% TCS` : ''} included)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {isFullyPaid ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBookModal('full')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition hover:scale-105 active:scale-95"
                  >
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>✓ Tour Confirmed (View Invoice)</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenBookModal('token')}
                      className="hidden sm:inline-flex bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 font-black text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      Pay 10% Token (₹{tenPercentAmount.toLocaleString('en-IN')})
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBookModal('token')}
                      className="bg-gradient-to-r from-[#6E1E14] via-[#8A261A] to-[#6E1E14] hover:from-[#5C1810] hover:to-[#7A2016] text-white font-black text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-[#6E1E14]/30 flex items-center gap-2 cursor-pointer transition hover:scale-105 active:scale-95 uppercase tracking-wider ring-2 ring-amber-400/40"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* SECURE ONLINE BOOKING MODAL */}
          <ItineraryBookModal
            open={isBookModalOpen}
            onOpenChange={setIsBookModalOpen}
            itineraryId={itinerary.id}
            destination={destination}
            proposalTitle={itinerary.title}
            perAdultPrice={currentPerAdultPrice || itinerary.perAdultPrice}
            adults={(activeOption?.adults ?? itinerary.adults) || 2}
            baseAmount={currentBaseAmount || itinerary.baseAmount}
            gstPercentage={currentGstPct || itinerary.gstPercentage || 5}
            tcsPercentage={currentTcsPct}
            totalQuotationAmount={totalQuotationAmount}
            advanceAmountPaid={alreadyPaid}
            balancePendingAmount={remainingBalanceAmount}
            initialPaymentType={selectedPaymentType}
            initialLeadName={leadName}
            initialEmail={itinerary.email}
            initialPhone={itinerary.mobile}
            zohoLeadId={itinerary.zohoLeadId}
            inquiryId={itinerary.inquiryId}
            numDays={numDays}
            numNights={numNights}
            travelStartDate={travelStartDate}
            travelEndDate={travelEndDate}
          />
        </>
      )}

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .page-break-after {
            page-break-after: always;
            break-after: page;
          }
          header, nav, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
