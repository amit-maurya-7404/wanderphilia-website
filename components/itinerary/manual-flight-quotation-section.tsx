'use client';

import React from 'react';
import { Playfair_Display } from 'next/font/google';
import { Plane, Luggage, ShieldCheck, AlertCircle, Clock, Info } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#6E1E14]/15 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#8B261D]">
            <Plane className="w-3.5 h-3.5 text-[#8B261D]" />
            <span>Flight Schedule & Timing</span>
          </div>
          <h2 className={`${playfair.className} text-xl sm:text-2xl font-black text-stone-900 mt-0.5`}>
            Preferred Flights
          </h2>
        </div>
        <div className="bg-amber-100/90 border border-amber-300 text-amber-900 text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Verified Flight Route</span>
        </div>
      </div>

      {/* FLIGHT OPTIONS LIST */}
      <div className="space-y-6">
        {flightQuotations.map((option, optIdx) => {
          const isExcluded = Boolean(option.isExcludedFromPackage);

          return (
            <div
              key={option.optionId || optIdx}
              className="space-y-4"
            >
              {/* FLIGHT SECTORS (RENDERED IN EXACT BOARDING-PASS TICKET STYLE AS REFERENCE) */}
              <div className="space-y-4 sm:space-y-5">
                {option.sectors.map((sector, secIdx) => {
                  const depParsed = parseAirportCity(sector.fromCity);
                  const arrParsed = parseAirportCity(sector.toCity);

                  const fromCode = sector.fromCode || depParsed.code || 'DEP';
                  const toCode = sector.toCode || arrParsed.code || 'ARR';
                  const fromCity = depParsed.name || sector.fromCity;
                  const toCity = arrParsed.name || sector.toCity;
                  const fromAirport = sector.fromAirport || (fromCity.includes('Airport') ? fromCity : `${fromCity} Airport`);
                  const toAirport = sector.toAirport || (toCity.includes('Airport') ? toCity : `${toCity} Airport`);
                  const durationStr = sector.duration || '3 h 35 m';
                  const stopsStr = sector.stops || 'Non Stop';
                  const cabinClassStr = sector.cabinClass || 'ECONOMY';

                  return (
                    <div
                      key={secIdx}
                      className="rounded-2xl border border-stone-200/90 shadow-md overflow-hidden bg-white hover:border-[#6E1E14]/40 hover:shadow-lg transition-all"
                    >
                      {/* 1. TOP HEADER BAR (DARK PLUM / DEEP MAROON BANNER AS IN REFERENCE SCREENSHOT) */}
                      <div className="bg-[#2D121E] text-white text-center py-2.5 px-4 space-y-0.5">
                        <div className="text-base sm:text-lg font-black tracking-wider flex items-center justify-center gap-2">
                          <span>{fromCode}</span>
                          <span className="text-amber-400 font-bold">→</span>
                          <span>{toCode}</span>
                        </div>
                        <div className="text-[11px] sm:text-xs text-white/80 font-medium tracking-wide">
                          {stopsStr} | {durationStr} | {cabinClassStr}
                        </div>
                      </div>

                      {/* 2. TICKET MAIN BODY */}
                      <div className="p-4 sm:p-6 space-y-4">
                        {/* AIRLINE ROW */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <div className="flex items-center gap-2.5">
                            {/* FLY91 / Airline Emblem Badge */}
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300/80 flex items-center justify-center shrink-0 shadow-2xs">
                              {/* Vector wing icon mimicking FLY91 brand mark */}
                              <svg viewBox="0 0 24 24" className="w-5 h-5 text-teal-700" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z" opacity="0.2"/>
                                <path d="M4 12c0-2.21.9-4.21 2.34-5.66l8.83 8.83C13.89 15.7 12.98 16 12 16c-2.21 0-4-1.79-4-4z" fill="#0D9488" />
                                <path d="M12 4c2.21 0 4 1.79 4 4 0 .98-.3 1.89-.83 2.66l-5.83-5.83C10.11 4.3 11.02 4 12 4z" fill="#F59E0B" />
                              </svg>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-stone-900 text-sm sm:text-base tracking-tight">
                                {sector.airline}
                              </span>
                              <span className="text-stone-300 font-bold">|</span>
                              <span className="font-extrabold text-stone-700 text-xs sm:text-sm">
                                {sector.flightNumber}
                              </span>
                            </div>
                          </div>

                          {sector.journeyType && (
                            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-stone-100 text-stone-800 px-2.5 py-1 rounded-md border border-stone-200 shrink-0">
                              {sector.journeyType}
                            </span>
                          )}
                        </div>

                        {/* AIRLINE SCHEDULE ROW (RESPONSIVE 3-COLUMN GRID) */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6 py-1">
                          {/* DEPARTURE (LEFT) */}
                          <div className="text-left space-y-0.5">
                            <div className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-none">
                              {sector.departureTime}
                            </div>
                            <div className="text-[11px] sm:text-xs font-semibold text-stone-500 pt-0.5">
                              {sector.departureDate}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 pt-1 leading-tight">
                              {fromCity}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight line-clamp-2">
                              {fromAirport}
                            </div>
                          </div>

                          {/* FLIGHT PATH GRAPHIC (CENTER) */}
                          <div className="flex flex-col items-center justify-center px-1 sm:px-3 shrink-0">
                            <div className="text-[10px] sm:text-xs font-bold text-stone-500 mb-1">
                              {durationStr}
                            </div>
                            <div className="flex items-center gap-1 w-20 sm:w-36 my-1">
                              <div className="h-[2px] flex-1 bg-stone-200 border-t border-dashed border-stone-400" />
                              <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center shadow-2xs">
                                <Plane className="w-3.5 h-3.5 text-stone-700" />
                              </div>
                              <div className="h-[2px] flex-1 bg-stone-200 border-t border-dashed border-stone-400" />
                            </div>
                            <span className="text-[9px] sm:text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full mt-0.5">
                              {stopsStr}
                            </span>
                          </div>

                          {/* ARRIVAL (RIGHT) */}
                          <div className="text-right space-y-0.5">
                            <div className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-none">
                              {sector.arrivalTime}
                            </div>
                            <div className="text-[11px] sm:text-xs font-semibold text-stone-500 pt-0.5">
                              {sector.arrivalDate || sector.departureDate}
                            </div>
                            <div className="text-xs sm:text-sm font-black text-stone-900 pt-1 leading-tight">
                              {toCity}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium leading-tight line-clamp-2">
                              {toAirport}
                            </div>
                          </div>
                        </div>

                        {/* TICKET FOOTER: BAGGAGE & DETAILS */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-[10px] sm:text-xs text-stone-600">
                          <div className="flex items-center gap-1.5 text-stone-700 bg-stone-100/90 px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-medium">
                            <Luggage className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                            <span>Baggage: <strong className="text-stone-900 font-bold">{sector.baggage || '15 kg Check-in + 7 kg Cabin'}</strong></span>
                          </div>
                          {sector.refundPolicy && (
                            <span className={`text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                              sector.refundPolicy.toLowerCase().includes('non')
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {sector.refundPolicy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 3. FLIGHT PRICING & FARE DETAILS (SHOWN SEPARATELY BELOW THE FLIGHT DETAILS) */}
              <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-5 sm:p-6 text-white shadow-xl border border-amber-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-300">
                      <Plane className="w-3.5 h-3.5 text-amber-300" />
                      <span>Flight Fare Summary (Indicative Fares)</span>
                    </div>
                    <h4 className={`${playfair.className} text-lg sm:text-xl font-black text-white`}>
                      Airfare Details & Pricing
                    </h4>
                  </div>
                  {isExcluded ? (
                    <div className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Not Included in Package Quotation
                    </div>
                  ) : (
                    <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] sm:text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Flight Fare Included
                    </div>
                  )}
                </div>

                {/* PRICING NUMBERS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Per Person Price */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-1.5">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
                      Estimated Cost Per Person
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      {option.perPersonPrice ? `₹${option.perPersonPrice.toLocaleString('en-IN')}/-` : '₹30,000/-'}
                      <span className="text-xs font-normal text-stone-300 ml-1">/ person</span>
                    </div>
                    <span className="text-[10px] text-stone-400 leading-tight">
                      Round-trip Return Flights (Navi Mumbai ↔ Agatti, Lakshadweep)
                    </span>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 sm:p-4 border border-white/15 flex flex-col justify-between space-y-1.5">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-300">
                      Total Flights Cost ({option.paxDetails || '14 Adults'})
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-amber-300">
                      {option.totalPrice > 0 ? `₹${option.totalPrice.toLocaleString('en-IN')}/-` : '₹4,20,000/-'}
                    </div>
                    <span className="text-[10px] text-stone-400 leading-tight">
                      {option.paxDetails ? `${option.paxDetails}` : '14 Adults × ₹30,000 per person'}
                    </span>
                  </div>
                </div>

                {/* IMPORTANT NOTICE BOX */}
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-3.5 text-xs text-amber-200/95 flex items-start gap-2.5 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-300 block mb-0.5">
                      {isExcluded ? 'Separate Airfare Notice:' : 'Dynamic Airfare Notice:'}
                    </span>
                    <span>
                      {option.note || 'Flight costs of ₹30,000 per person are separate and NOT included in the land package quotation above. Airfares are dynamic and will be booked at actual live market rates at the time of final booking confirmation.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
