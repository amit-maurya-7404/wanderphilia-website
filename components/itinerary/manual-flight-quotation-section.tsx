'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { Plane, Luggage, ShieldCheck, AlertCircle } from 'lucide-react';
import { FlightQuotationOption } from '@/types/manual-itinerary';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900']
});

interface ManualFlightQuotationSectionProps {
  flightQuotations: FlightQuotationOption[];
}

function parseAirportCity(str: string): { code: string; name: string } {
  if (!str) return { code: '', name: '' };
  const match1 = str.match(/^([A-Za-z]{3})\s*\((.*?)\)$/);
  if (match1) {
    return { code: match1[1].toUpperCase(), name: match1[2].trim() };
  }
  const match2 = str.match(/^(.*?)\s*\(([A-Za-z]{3})\)$/);
  if (match2) {
    return { code: match2[2].toUpperCase(), name: match2[1].trim() };
  }
  return { code: str.trim(), name: '' };
}

export function ManualFlightQuotationSection({ flightQuotations }: ManualFlightQuotationSectionProps) {
  if (!flightQuotations || flightQuotations.length === 0) return null;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b-2 border-[#6E1E14]/15 pb-2 sm:pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#8B261D]">
            <Plane className="w-3.5 h-3.5 text-[#8B261D]" />
            <span>Flight Quotations & Schedule</span>
          </div>
          <h2 className={`${playfair.className} text-xl sm:text-2xl font-black text-stone-900 mt-0.5`}>
            Recommended Flight Options
          </h2>
        </div>
        <div className="bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Taxes & Baggage Included</span>
        </div>
      </div>

      {/* FLIGHT OPTIONS LIST */}
      <div className="space-y-4 sm:space-y-5">
        {flightQuotations.map((option, optIdx) => (
          <div
            key={option.optionId || optIdx}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden"
          >
            {/* OPTION TOP HEADER BANNER */}
            <div className="bg-gradient-to-r from-[#6E1E14] via-[#85251B] to-stone-900 p-2.5 sm:p-4 text-white flex flex-row items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-amber-300 block truncate">
                  {option.optionTitle || `Flight Option ${optIdx + 1}`}
                </span>
                <div className="text-[11px] sm:text-xs font-semibold text-white/90 truncate">
                  {option.paxDetails || '2 Adults, 2 Children (All Flights Included)'}
                </div>
              </div>

              {/* TOTAL PRICE PILL */}
              <div className="bg-white/15 backdrop-blur-md border border-white/20 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-right shrink-0">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                  Total Flights Cost
                </span>
                <span className="text-base sm:text-xl font-black text-white block leading-tight">
                  {option.totalPrice > 0 ? `₹${option.totalPrice.toLocaleString('en-IN')}/-` : 'On Request'}
                </span>
              </div>
            </div>

            {/* FLIGHT SECTORS LIST */}
            <div className="p-1.5 sm:p-3 space-y-2 bg-stone-50/70">
              {option.sectors.map((sector, secIdx) => {
                const dep = parseAirportCity(sector.fromCity);
                const arr = parseAirportCity(sector.toCity);

                return (
                  <div
                    key={secIdx}
                    className="bg-white rounded-xl p-2.5 sm:p-3.5 border border-stone-200/90 shadow-2xs space-y-2 hover:border-amber-400/80 transition-all"
                  >
                    {/* SECTOR HEADER: AIRLINE + FLIGHT CODE + REFUND POLICY + DATE */}
                    <div className="flex items-center justify-between gap-1.5 border-b border-stone-100 pb-1.5 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <span className="font-black text-stone-900 text-xs sm:text-sm truncate">
                          {sector.airline}
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                          {sector.flightNumber}
                        </span>
                        {sector.refundPolicy && (
                          <span
                            className={`text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                              sector.refundPolicy.toLowerCase().includes('non')
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {sector.refundPolicy}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-[#8B261D] bg-amber-50/90 px-2 py-0.5 rounded border border-amber-200/70 shrink-0">
                        {sector.departureDate}
                      </span>
                    </div>

                    {/* AIRLINE SCHEDULE ROW (Responsive 1fr-auto-1fr Grid) */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1.5 sm:gap-3 py-1">
                      {/* DEPARTURE */}
                      <div className="text-left min-w-0 pr-1">
                        <div className="text-base sm:text-xl font-black text-stone-900 tracking-tight leading-none">
                          {sector.departureTime}
                        </div>
                        <div className="text-xs sm:text-sm font-black text-[#8B261D] mt-1 leading-none">
                          {dep.code}
                        </div>
                        {dep.name && (
                          <div className="text-[10px] sm:text-xs font-semibold text-stone-700 leading-tight truncate mt-0.5">
                            {dep.name}
                          </div>
                        )}
                        <div className="text-[8px] sm:text-[9px] font-bold text-stone-600 uppercase tracking-wider mt-0.5">
                          Departure
                        </div>
                      </div>

                      {/* FLIGHT PATH & DURATION GRAPHIC */}
                      <div className="flex flex-col items-center justify-center px-1 shrink-0">
                        <div className="text-[9px] sm:text-[11px] font-bold text-stone-600 text-center leading-none">
                          {sector.duration}
                        </div>
                        <div className="w-16 sm:w-28 flex items-center justify-center gap-1 my-1">
                          <div className="h-[1.5px] bg-stone-300 flex-1 relative">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#8B261D] absolute top-1/2 left-0 -translate-y-1/2" />
                          </div>
                          <Plane className="w-3.5 h-3.5 text-[#8B261D] shrink-0" />
                          <div className="h-[1.5px] bg-stone-300 flex-1 relative">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 absolute top-1/2 right-0 -translate-y-1/2" />
                          </div>
                        </div>
                        <div className="text-[8px] sm:text-[10px] font-bold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80 text-center leading-tight whitespace-nowrap">
                          {sector.stops}
                        </div>
                      </div>

                      {/* ARRIVAL */}
                      <div className="text-right min-w-0 pl-1">
                        <div className="text-base sm:text-xl font-black text-stone-900 tracking-tight leading-none">
                          {sector.arrivalTime}
                        </div>
                        <div className="text-xs sm:text-sm font-black text-[#8B261D] mt-1 leading-none">
                          {arr.code}
                        </div>
                        {arr.name && (
                          <div className="text-[10px] sm:text-xs font-semibold text-stone-700 leading-tight truncate mt-0.5">
                            {arr.name}
                          </div>
                        )}
                        <div className="text-[8px] sm:text-[9px] font-bold text-stone-600 uppercase tracking-wider mt-0.5">
                          Arrival
                        </div>
                      </div>
                    </div>

                    {/* FOOTER: BAGGAGE & DETAILS */}
                    <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-stone-100 text-[10px] sm:text-[11px] text-stone-600">
                      <div className="flex items-center gap-1 text-stone-700 bg-stone-100/90 px-2 py-0.5 rounded text-[10px]">
                        <Luggage className="w-3 h-3 text-emerald-700 shrink-0" />
                        <span>Baggage: <strong className="text-stone-900 font-bold">{sector.baggage}</strong></span>
                      </div>
                      <span className="text-stone-600 text-[9px] sm:text-[10px]">
                        {sector.paxDetails || '2 Adults + 2 Children'}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* DYNAMIC FARE NOTICE */}
              <div className="bg-amber-50/90 rounded-lg p-2 sm:p-2.5 border border-amber-200/90 flex items-start gap-1.5 text-[10px] sm:text-xs text-amber-950 font-medium leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {option.note || 'Airline ticket pricing is dynamic. Fares are valid as of now and subject to real-time seat availability at the time of final ticket issuance.'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
