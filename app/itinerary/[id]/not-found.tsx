import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Compass, ArrowLeft, Phone, Search } from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay } from '@/lib/contact';

export default function ItineraryNotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      <Navbar />

      <main className="grow flex items-center justify-center px-4 sm:px-6 py-28">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
          <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-center mx-auto text-orange-500 shadow-sm">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200/60">
              Itinerary Expired or Not Found
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Journey Awaits
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              We couldn&apos;t find the custom travel itinerary you requested. It may have expired or the link might be incomplete.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Explore Wanderphilia Trips</span>
            </Link>

            <a
              href={`https://wa.me/91${contactPhoneDisplay}?text=Hi%20Wanderphilia,%20I%20am%20looking%20for%20a%20custom%20luxury%20itinerary.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-2xl transition shadow-md"
            >
              <RiWhatsappLine className="w-4 h-4" />
              <span>Ask a Travel Specialist</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
