import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';

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

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import { ItineraryClientActions } from '@/components/itinerary/itinerary-client-actions';
import { ItineraryFlowchartSection } from '@/components/itinerary/itinerary-flowchart-section';
import { ItineraryPaymentSection } from '@/components/itinerary/itinerary-payment-section';
import {
  MapPin,
  Calendar,
  Users,
  Hotel,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Utensils,
  Car,
  Plane,
  Download,
  Share2,
  Phone,
  ArrowRight,
  Compass,
  Star,
  Clock,
  Crown,
  CreditCard,
  Building2,
  FileText,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay, contactEmail } from '@/lib/contact';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getItinerary(id: string): Promise<ItineraryDocument | null> {
  try {
    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    const itinerary = await collection.findOne({
      $or: [{ id: id }, { slug: id }]
    });

    if (!itinerary) return null;

    return {
      ...itinerary,
      _id: itinerary._id?.toString(),
      createdAt: itinerary.createdAt ? new Date(itinerary.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: itinerary.updatedAt ? new Date(itinerary.updatedAt).toISOString() : new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Error fetching itinerary]:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const itinerary = await getItinerary(id);

  if (!itinerary) {
    return {
      title: 'Itinerary Not Found | Wanderphilia',
      description: 'The requested luxury travel itinerary could not be found.',
    };
  }

  const title = `${itinerary.destination?.toUpperCase()} ITINERARY | Wanderphilia Exclusive`;
  const description = itinerary.description || `Custom luxury travel itinerary for ${itinerary.destination} curated by Wanderphilia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: itinerary.heroImage ? [{ url: itinerary.heroImage }] : [],
    },
  };
}

export default async function ItineraryPage({ params }: PageProps) {
  const { id } = await params;
  const itinerary = await getItinerary(id);

  if (!itinerary) {
    notFound();
  }

  const leadName = itinerary.leadDetails?.name || itinerary.rawZohoData?.Full_Name || (itinerary.rawZohoData?.First_Name ? `${itinerary.rawZohoData.First_Name} ${itinerary.rawZohoData.Last_Name || ''}`.trim() : '') || 'Valued Traveler';
  const firstName = itinerary.leadDetails?.firstName || itinerary.rawZohoData?.First_Name || (leadName && leadName !== 'Valued Traveler' ? leadName.split(' ')[0] : 'Your');
  const possessiveName = firstName.endsWith('s') || firstName.endsWith('S') ? `${firstName}'` : `${firstName}'s`;
  const destination = itinerary.destination || itinerary.rawZohoData?.Destinations || itinerary.rawZohoData?.Destination || 'Rajasthan';
  const numDays = itinerary.noOfDays || (itinerary.rawZohoData?.No_of_Days ? Number(itinerary.rawZohoData.No_of_Days) : (itinerary.dayPlans?.length || 5));
  const numNights = itinerary.noOfNights || (itinerary.rawZohoData?.No_of_Nights ? Number(itinerary.rawZohoData.No_of_Nights) : (numDays > 1 ? numDays - 1 : 1));
  const travelStyle = itinerary.travelStyle || itinerary.leadDetails?.travelStyle || itinerary.rawZohoData?.Travel_Style || 'Family Trip';
  const tripType = itinerary.tripType || itinerary.leadDetails?.tripType || itinerary.rawZohoData?.Trip_Type || 'Customised Trip';
  const guests = itinerary.leadDetails?.guests || itinerary.rawZohoData?.Number_Of_Guest || itinerary.rawZohoData?.Number_Of_Guests || 2;
  const heroImage = itinerary.heroImage || '/images/about_hero4.jpg';

  // Format: «Leads.No. of Nights» Nights / «Leads.No. of Days» Days Royal «Leads.Destinations» Escape
  const proposalTitle = `${numNights} Nights / ${numDays} Days Royal ${destination} Escape`;

  // Extract cities list for route pill (e.g. Paro ➔ Thimphu ➔ Punakha)
  const routeCities: string[] = [];
  if (itinerary.dayPlans && itinerary.dayPlans.length > 0) {
    itinerary.dayPlans.forEach(d => {
      const loc = d.stayLocation || d.title;
      const city = loc.split(/[,-]/)[0].trim();
      if (city && !routeCities.includes(city)) {
        routeCities.push(city);
      }
    });
  }
  if (routeCities.length === 0) {
    routeCities.push(destination);
  }

  // 6 Collage images from dummy pool
  const collageImages = itinerary.galleryImages && itinerary.galleryImages.length >= 6
    ? itinerary.galleryImages.slice(0, 6)
    : [
      heroImage,
      '/images/about_hero4.jpg',
      '/images/about_hero5.jpg',
      '/images/himachal.jpg',
      '/images/kashmir.jpg',
      '/images/bali.jpg',
      '/images/bhutan1.jpg',
      '/images/bhutan2.jpg',
      '/images/singapore1.jpg',
      '/images/gallery1.jpeg',
      '/images/gallery4.jpg',
      '/images/gallery11.jpg'
    ];

  const vehicleType = itinerary.vehicleType || itinerary.leadDetails?.vehicleType || itinerary.rawZohoData?.Vehicle_Type || 'Private AC Sedan / SUV';
  const roomCategory = itinerary.roomCategory || itinerary.leadDetails?.preferredRoomCategory || itinerary.rawZohoData?.Preferred_Room_Category || 'Luxury';
  const mealPlan = itinerary.mealPlan || itinerary.leadDetails?.mealPlan || itinerary.rawZohoData?.Meal_Plan || 'Breakfast & Dinner';

  // Dynamic experience items extracted in order from Zoho subform (Experiences 1, 2, 3...)
  const dynamicExperiences: string[] = [];
  const seenExp = new Set<string>();

  // 1. Direct from raw subform if present
  const rawSubform = itinerary.rawZohoData?.rawLeadData?.Activities_and_Experiences_1 || itinerary.rawZohoData?.Activities_and_Experiences_1;
  if (Array.isArray(rawSubform)) {
    rawSubform.forEach(row => {
      // En-route experiences
      const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? row.En_Route_Experiences ?? row.En_route ?? row.Enroute ?? row.en_route_experiences;
      const enRouteName = (typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : (typeof rawEnRoute === 'string' ? rawEnRoute : '')).trim();
      if (enRouteName && !seenExp.has(enRouteName.toLowerCase())) {
        seenExp.add(enRouteName.toLowerCase());
        dynamicExperiences.push(enRouteName.toLowerCase().startsWith('en-route') ? enRouteName : `En-route Experience: ${enRouteName}`);
      }

      // Experiences 1, 2, 3, 4 up to 10
      for (let e = 1; e <= 10; e++) {
        const expKey = e === 1 ? (row.Experiences_and_activities || row.Experiences_1) : row[`Experiences_${e}`];
        if (!expKey) continue;
        const expName = (typeof expKey === 'object' && expKey !== null ? expKey.name : (typeof expKey === 'string' ? expKey : '')).trim();
        if (expName && !seenExp.has(expName.toLowerCase())) {
          seenExp.add(expName.toLowerCase());
          dynamicExperiences.push(expName);
        }
      }
    });
  }

  // 2. From parsed dayActivities if raw subform wasn't directly accessible
  if (dynamicExperiences.length === 0 && itinerary.rawZohoData?.dayActivities && Array.isArray(itinerary.rawZohoData.dayActivities)) {
    itinerary.rawZohoData.dayActivities.forEach((da: any) => {
      if (da.enRouteExperiences) {
        const er = String(da.enRouteExperiences).trim();
        if (er && !seenExp.has(er.toLowerCase())) {
          seenExp.add(er.toLowerCase());
          dynamicExperiences.push(er.toLowerCase().startsWith('en-route') ? er : `En-route Experience: ${er}`);
        }
      }
      (da.experiences || []).forEach((exp: any) => {
        const name = (exp.name || '').trim();
        if (name && !seenExp.has(name.toLowerCase())) {
          seenExp.add(name.toLowerCase());
          dynamicExperiences.push(name);
        }
      });
    });
  }

  // 3. Fallback from dayPlans activities
  if (dynamicExperiences.length === 0 && itinerary.dayPlans && Array.isArray(itinerary.dayPlans)) {
    itinerary.dayPlans.forEach((dp: any) => {
      (dp.activities || []).forEach((act: string) => {
        const trimmed = typeof act === 'string' ? act.trim() : '';
        if (
          trimmed &&
          !trimmed.toLowerCase().includes('arrival') &&
          !trimmed.toLowerCase().includes('departure') &&
          !trimmed.toLowerCase().includes('transfer') &&
          !seenExp.has(trimmed.toLowerCase())
        ) {
          seenExp.add(trimmed.toLowerCase());
          dynamicExperiences.push(trimmed);
        }
      });
    });
  }

  // Exact Inclusions List constructed in strict Zoho Mail-Merge order
  const displayInclusions: string[] = [
    `Private ${vehicleType} for the complete ${destination} itinerary and Airport Transfers.`,
    `Accomodation in ${roomCategory} Properties For ${numNights} Nights.`,
    `Meals ${mealPlan} ( Breakfast Except 1st Day , Dinner Last Day )`,
    `Driver allowance, fuel, toll taxes, parking charges and applicable road taxes.`,
    `All transfers and sightseeing as per the day-wise itinerary. Entry fees are excluded unless specifically mentioned.`,
    ...dynamicExperiences,
    `Assistance during hotel check-in and check-out.`,
    `Applicable taxes included in the quoted package, wherever applicable.`
  ];

  // Exact Exclusions List as per Zoho Proposal Template
  const displayExclusions: string[] = [
    `5% GST.`,
    `Early check-in (Before 1:00 PM) & Late Check-out (After 11:00 AM) at the hotel.`,
    `Any additional expenses of personal nature.`,
    `Additional accommodation/food costs incurred due to any delayed travel.`,
    `Any lunch and other meals not mentioned in Package Inclusions.`,
    `Any Airfare / Rail fare other than what is mentioned in "Inclusions" or any type of transportation.`,
    `Monument entry fees during Sightseeing.`,
    `Additional Costs due to Flight Cancellations, Landslides, Roadblocks, and other natural calamities.`,
    `Any other services not specified above in inclusions.`
  ];

  return (
    <div className={`${sansBody.className} min-h-screen bg-[#ECE8E1] text-stone-900 selection:bg-[#6E1E14] selection:text-white pb-16`}>

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
          </div>

          <ItineraryClientActions
            itineraryId={itinerary.id}
            title={itinerary.title || proposalTitle}
            leadName={leadName}
            destination={destination}
          />
        </div>
      </header>

      {/* DOCUMENT CONTAINER (A4 / Canva Sheet Style Pages) */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 pt-6 space-y-10">

        {/* ========================================================= */}
        {/* PAGE 1: COVER PAGE (EXACT ZOHO PROPOSAL TEMPLATE MATCH)   */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[900px] flex flex-col justify-between relative print:shadow-none print:border-0 print:rounded-none print:m-0 print:p-0 page-break-after">

          {/* Top Header & Zoho Merge Fields Section */}
          <div className="pt-10 pb-6 px-6 sm:px-12 text-center relative space-y-3">

            {/* Logo: Wanderphilia Clickable Official Logo Image */}
            <div className="flex flex-col items-center justify-center mb-0">
              <Link
                href="/"
                title="Wanderphilia Home"
                className="inline-flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <img
                  src="/images/Made_LOGO.png"
                  alt="Wanderphilia Logo"
                  className="h-14 sm:h-40 w-auto object-contain"
                />
              </Link>
              {/* <span className="text-xs sm:text-sm text-stone-600 font-semibold mt-1 tracking-wide">
                India&apos;s most trusted travel community
              </span> */}
            </div>

            {/* Subheader: [FirstName]'s exclusive itinerary */}
            <div className="pt-2 flex items-center justify-center gap-2 flex-wrap">
              <span className={`${cursiveFont.className} text-3xl sm:text-4xl md:text-5xl font-bold text-[#FF6E0B] tracking-wide inline-block drop-shadow-2xs`}>
                {possessiveName}
              </span>
              <span className={`${playfair.className} text-xl sm:text-2xl md:text-3xl font-black text-[#7A2B20] tracking-tight`}>
                exclusive itinerary
              </span>
            </div>

            {/* Main Proposal Heading: «Leads.No. of Nights» Nights / «Leads.No. of Days» Days Royal «Leads.Destinations» Escape */}
            <div className="px-2 sm:px-6 pt-1">
              <h1 className={`${playfair.className} text-2xl sm:text-4xl md:text-5xl font-black text-[#7A2B20] tracking-tight leading-tight`}>
                {proposalTitle}
              </h1>
            </div>

            {/* Travel Style: «Leads.Travel Style» */}
            <div className="pt-0.5">
              <p className="text-sm sm:text-base font-bold text-[#7A2B20]/90">
                {travelStyle}
              </p>
            </div>
          </div>

          {/* Full-Width / Clean Rectangular Destination Hero Photo (Matching Zoho Image 2) */}
          <div className="px-6 sm:px-12 grow flex items-center justify-center my-3">
            <div className="relative w-full max-w-2xl h-[380px] sm:h-[450px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={heroImage}
                alt={destination}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {itinerary.description && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3.5 rounded-xl text-white text-xs sm:text-sm font-medium leading-relaxed italic border border-white/20">
                  &ldquo;{itinerary.description}&rdquo;
                </div>
              )}
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
                      Route:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {itinerary.rawZohoData?.hotels && itinerary.rawZohoData.hotels.length > 0
                        ? itinerary.rawZohoData.hotels.map((h: any) => `${h.nights}N ${h.city || h.hotelName}`).join(' | ')
                        : `${numNights} Nights Curated Luxury Stay`}
                    </div>

                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Stay:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {routeCities.join(' → ')}
                    </div>

                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Style & Guests:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {travelStyle} • {guests} Guests • {tripType}
                    </div>
                  </div>

                  {/* <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Vehicle & Chauffeur:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      Private AC Vehicle + Dedicated Tour Chauffeur | Relaxed Pace
                    </div>
                  </div> */}
                </div>

                {/* Theme Highlights Pills */}
                <div className="pt-4 border-t border-[#6E1E14]/15">
                  <div className="text-xs sm:text-sm font-black text-[#6E1E14] uppercase tracking-wider leading-relaxed">
                    {destination} — CULTURE • LUXURY • LOCAL LIFE • FOOD • ADVENTURE • NATURE • SLOW EXPERIENCES
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: 2x3 Photo Collage (6 photos) */}
              <div className="grid grid-cols-2 gap-2.5 bg-stone-100 p-2.5 rounded-2xl border border-stone-200 shadow-inner">
                {collageImages.map((img, i) => (
                  <div key={i} className="relative h-28 sm:h-36 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    <Image
                      src={img}
                      alt={`Highlight ${i + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Bottom Rust Bar */}
          <div className="bg-[#6E1E14] text-white py-3 px-6 text-center text-[10px] sm:text-xs font-bold tracking-wide">
            Wanderphilia Exclusive Private Travel Proposal
          </div>
        </section>

        {/* ========================================================= */}
        {/* PAGE 3 & 4: FLOWCHART DAY-BY-DAY ITINERARY               */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-6 sm:p-10 space-y-8 relative print:shadow-none print:border-0 print:rounded-none page-break-after">

          {/* Centered Travel Itinerary Header */}
          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-6">
            <h2 className={`${playfair.className} text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase underline decoration-[#6E1E14]/40 decoration-2 underline-offset-8`}>
              Detailed Flow-Chart Itinerary
            </h2>

            {/* Route Arrows Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-extrabold text-stone-800">
              <span className="text-[#6E1E14] font-black">{numNights} Nights {numDays} Days → </span>
              <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                {itinerary.rawZohoData?.hotels && itinerary.rawZohoData.hotels.length > 0
                  ? itinerary.rawZohoData.hotels.map((h: any) => `${h.nights}N ${h.city || h.hotelName}`).join(' | ')
                  : `${numNights} Nights Curated Luxury Stay`}
              </div>
            </div>
          </div>

          {/* Interactive Flow Chart Timeline Section */}
          {itinerary.dayPlans && (
            <ItineraryFlowchartSection
              dayPlans={itinerary.dayPlans}
              destination={destination}
              defaultImages={collageImages}
            />
          )}

        </section>

        {/* ========================================================= */}
        {/* PAGE 5: HOTEL & STAY DETAILS + INCLUSIONS & EXCLUSIONS    */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-6 sm:p-10 space-y-8 relative print:shadow-none print:border-0 print:rounded-none page-break-after">

          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-4">
            <h2 className={`${playfair.className} text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase`}>
              Hotel & Stay Details
            </h2>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              Handpicked Luxury Accommodations & Inclusions
            </p>
          </div>

          {/* 5-Star / Boutique Properties Table */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#6E1E14] flex items-center gap-1.5">
              <Hotel className="w-4 h-4 text-[#6E1E14]" /> Curated Luxury Properties
            </h3>

            <div className="overflow-x-auto rounded-xl border-2 border-[#6E1E14] shadow-xs">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#6E1E14] text-white uppercase text-[11px] font-black tracking-wider">
                    <th className="p-3.5 border-r border-white/20">Destination</th>
                    <th className="p-3.5 border-r border-white/20">Hotel</th>
                    <th className="p-3.5">Room Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6E1E14]/20 font-semibold text-stone-900 bg-white">
                  {itinerary.rawZohoData?.hotels && itinerary.rawZohoData.hotels.length > 0 ? (
                    itinerary.rawZohoData.hotels.map((h: any, idx: number) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-[#FFF8F5]' : 'bg-white'}>
                        <td className="p-3.5 border-r border-[#6E1E14]/20 uppercase font-bold text-[#6E1E14]">
                          {h.city || destination} ({h.nights}N)
                        </td>
                        <td className="p-3.5 border-r border-[#6E1E14]/20 font-extrabold">
                          {h.hotelName}
                        </td>
                        <td className="p-3.5">
                          {roomCategory}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-[#FFF8F5]">
                      <td className="p-3.5 border-r border-[#6E1E14]/20 uppercase font-bold text-[#6E1E14]">
                        {destination} ({numNights}N)
                      </td>
                      <td className="p-3.5 border-r border-[#6E1E14]/20 font-extrabold">
                        {itinerary.hotelName || 'Curated 5-Star Luxury Resort'}
                      </td>
                      <td className="p-3.5">
                        {roomCategory}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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
                {displayInclusions.map((inc, i) => (
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
                {displayExclusions.map((exc, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Rust Bar */}
          <div className="bg-[#6E1E14] text-white py-3 px-6 text-center text-[10px] sm:text-xs font-bold tracking-wide rounded-xl">
            Wanderphilia Exclusive Private Travel Proposal • Inclusions & Exclusions
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
              Clear Guidelines, Flexible Policies & Direct Payment Process
            </p>
          </div>

          {/* 1. PAYMENT TERMS */}
          <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900 border-b border-amber-100 pb-2.5">
              <CreditCard className="w-4 h-4 text-amber-700" />
              <span>Payment Terms</span>
            </div>
            <ul className="space-y-2 text-xs font-semibold text-stone-700 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>50% booking advance payment is required to confirm the booking and secure all travel services.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>Balance 50% payment must be received at least 15 days prior to departure.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>All bookings are subject to availability and confirmation from respective suppliers at the time of payment.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                <span>Any increase in taxes, government levies, fuel surcharges, or currency fluctuations before final payment may be charged additionally.</span>
              </li>
            </ul>
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
            <ItineraryPaymentSection />
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

      {/* Print Specific CSS to ensure clean multi-page A4 PDF output */}
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
