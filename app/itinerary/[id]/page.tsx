import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { ItineraryDocument } from '@/types/itinerary';
import { ItineraryClientActions } from '@/components/itinerary/itinerary-client-actions';
import { ItineraryFlowchartSection } from '@/components/itinerary/itinerary-flowchart-section';
import {
  MapPin,
  Calendar,
  Users,
  Hotel,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
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
  Crown
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

  const leadName = itinerary.leadDetails?.name || 'Valued Traveler';
  const destination = itinerary.destination || 'Exotic Journey';
  const numDays = itinerary.dayPlans?.length || 5;
  const numNights = numDays > 1 ? numDays - 1 : 1;
  const heroImage = itinerary.heroImage || '/images/about_hero4.jpg';

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

  return (
    <div className="min-h-screen bg-[#ECE8E1] text-slate-900 font-sans selection:bg-[#6E1E14] selection:text-white pb-16">
      
      {/* Top Floating Control Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50 py-3 px-4 sm:px-8 shadow-xs print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/Made_LOGO.png" alt="Wanderphilia" className="h-9 w-auto object-contain" />
            </Link>
            <span className="text-stone-300">|</span>
            <span className="text-xs font-bold text-stone-600">
              Itinerary: <span className="text-[#6E1E14] font-mono font-black">{itinerary.id}</span>
            </span>
          </div>

          <ItineraryClientActions
            itineraryId={itinerary.id}
            title={itinerary.title || `${destination} Itinerary`}
            leadName={leadName}
            destination={destination}
          />
        </div>
      </header>

      {/* DOCUMENT CONTAINER (A4 / Canva Sheet Style Pages) */}
      <main className="max-w-4xl mx-auto px-2 sm:px-4 pt-6 space-y-10">

        {/* ========================================================= */}
        {/* PAGE 1: CANVA COVER PAGE                                  */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 min-h-[900px] flex flex-col justify-between relative print:shadow-none print:border-0 print:rounded-none print:m-0 print:p-0 page-break-after">
          
          {/* Top Decorative Banner & Header */}
          <div className="pt-8 pb-6 px-6 sm:px-12 text-center relative">
            {/* Top Prayer Flags Motif (SVG) */}
            <div className="flex justify-center items-center gap-1.5 mb-5 opacity-90">
              <span className="w-5 h-6 bg-amber-400 rotate-6 rounded-xs shadow-xs" />
              <span className="w-5 h-6 bg-red-600 -rotate-3 rounded-xs shadow-xs" />
              <span className="w-5 h-6 bg-emerald-600 rotate-3 rounded-xs shadow-xs" />
              <span className="w-5 h-6 bg-blue-600 -rotate-6 rounded-xs shadow-xs" />
              <span className="w-5 h-6 bg-orange-500 rotate-4 rounded-xs shadow-xs" />
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#FF6E0B] flex items-center justify-center text-white font-black text-xl shadow-md">
                  W
                </div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#FF6E0B]">
                  Wanderphilia
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6E1E14] font-extrabold mt-0.5">
                India&apos;s most trusted travel community
              </span>
            </div>

            {/* Main Destination Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-[#5C1810] tracking-tight uppercase font-serif mt-2">
              {destination} Itinerary
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm font-bold text-[#7A2B20] uppercase tracking-wider mt-2.5">
              {itinerary.subTitle || 'The Soul of ' + destination} | Wanderphilia Exclusive
            </p>

            {leadName && (
              <div className="inline-block mt-3 bg-[#6E1E14]/10 text-[#6E1E14] border border-[#6E1E14]/20 text-xs font-bold px-4 py-1 rounded-full">
                Specially Curated For: <span className="font-extrabold">{leadName}</span>
              </div>
            )}
          </div>

          {/* Arched Architectural Photo Framing */}
          <div className="px-6 sm:px-14 grow flex items-center justify-center my-4">
            <div className="relative w-full max-w-lg h-[400px] sm:h-[480px] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-2xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src={heroImage}
                alt={destination}
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
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
                  <span className="text-6xl sm:text-8xl font-black text-[#5C1810] font-serif leading-none">
                    {numDays}
                  </span>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-[#5C1810] uppercase tracking-tight">
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
                      {routeCities.join(' → ')}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Stay:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      {itinerary.rawZohoData?.hotels && itinerary.rawZohoData.hotels.length > 0
                        ? itinerary.rawZohoData.hotels.map((h: any) => `${h.nights}N ${h.city || h.hotelName}`).join(' | ')
                        : `${numNights} Nights Curated Luxury Stay`}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-extrabold text-stone-500 tracking-wider">
                      Style:
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                      Private Vehicle + Private Guide | Relaxed Pace | Unwind Experiences
                    </div>
                  </div>
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
            <h2 className="text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase font-serif underline decoration-[#6E1E14]/40 decoration-2 underline-offset-8">
              Detailed Flow-Chart Itinerary
            </h2>
            
            {/* Route Arrows Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:text-sm font-extrabold text-stone-800">
              <span className="text-[#6E1E14] font-black">{numNights} Nights {numDays} Days</span>
              {routeCities.map((city, cIdx) => (
                <span key={cIdx} className="inline-flex items-center gap-1.5 uppercase bg-white border border-stone-300 px-2.5 py-0.5 rounded-md shadow-2xs">
                  <span>{city}</span>
                  {cIdx < routeCities.length - 1 && <span className="text-[#6E1E14] font-black">➔</span>}
                </span>
              ))}
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
        {/* PAGE 5: HOTEL & STAY DETAILS (CANVA TABLE STYLE)          */}
        {/* ========================================================= */}
        <section className="bg-[#FAF8F5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 p-6 sm:p-12 space-y-8 relative print:shadow-none print:border-0 print:rounded-none page-break-after">
          
          <div className="text-center space-y-2 border-b-2 border-[#6E1E14]/20 pb-4">
            <h2 className="text-2xl sm:text-4xl font-black text-[#5C1810] tracking-tight uppercase font-serif">
              Hotel & Stay Details
            </h2>
            <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">
              Handpicked Luxury Accommodations
            </p>
          </div>

          {/* 5-Star / Boutique Properties Table */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#6E1E14]">
              Curated Luxury Properties
            </h3>

            <div className="overflow-x-auto rounded-xl border-2 border-[#6E1E14] shadow-sm">
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
                          {itinerary.roomCategory || 'Deluxe Room / Luxury Suite'}
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
                        {itinerary.roomCategory || 'Royal Luxury Suite'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inclusions & Exclusions Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inclusions
              </div>
              <ul className="space-y-2 text-xs font-semibold text-stone-700">
                {itinerary.inclusions && itinerary.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="text-xs uppercase font-extrabold tracking-wider text-stone-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#6E1E14]" /> Concierge & Assistance
              </div>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                24/7 dedicated trip concierge support on WhatsApp with verified local chauffeurs and VIP assistance throughout your stay.
              </p>
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${contactPhoneDisplay}?text=Hi%20Wanderphilia,%20I%20am%20reviewing%20my%20itinerary%20${itinerary.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#6E1E14] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
                >
                  <RiWhatsappLine className="w-4 h-4" />
                  <span>Connect with Concierge</span>
                </a>
              </div>
            </div>
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
