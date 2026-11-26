'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Calendar,
  Users,
  Car,
  Utensils,
  Hotel,
  PenTool,
  CheckCircle2,
  ExternalLink,
  Copy,
  RotateCcw,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  Layers,
  FileUp,
  UploadCloud,
  X,
  Loader2,
  DollarSign,
  Share2
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ManualDayPlan {
  dayNumber: number;
  title: string;
  fromCity: string;
  enRouteStops: string[];
  toCity: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  guidedTour: boolean;
  sightseeingPoints: string[];
}

interface HotelItem {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  roomCategory: string;
  category: string;
  stayDates: string;
  basePrice: number;
  extraBedPrice: number;
  childWithoutBedPrice: number;
}

interface KidDetail {
  childIndex: number;
  age: number;
  bedType: 'extra_bed' | 'without_bed';
  notes: string;
}

const VEHICLE_OPTIONS = [
  'AC Sedan (Dzire / Etios)',
  'AC SUV (Innova Crysta)',
  'AC Innova (Standard)',
  'AC Ertiga / Rumion',
  'Tempo Traveller (12 Seater)',
  'Tempo Traveller (16 Seater)',
  'AC Toyota Fortuner',
  'Dedicated Private Cab'
];

function getDefaultMealsForDay(dayNumber: number, totalDays: number, plan: string): { breakfast: boolean; lunch: boolean; dinner: boolean } {
  const p = plan.toLowerCase();
  const isFirst = dayNumber === 1;
  const isLast = dayNumber === totalDays;

  if (p.includes('room only') || p.includes('ep')) {
    return { breakfast: false, lunch: false, dinner: false };
  }
  if (p.includes('breakfast only') || p.includes('cp')) {
    return { breakfast: !isFirst, lunch: false, dinner: false };
  }
  if (p.includes('all meals') || p.includes('apai') || p.includes('breakfast, lunch & dinner')) {
    return { breakfast: !isFirst, lunch: true, dinner: !isLast };
  }
  // Default: Breakfast & Dinner (MAP)
  return { breakfast: !isFirst, lunch: false, dinner: !isLast };
}

export default function ManualItineraryCreationPage() {
  // Sync / Load Existing Itinerary ID State
  const [syncInput, setSyncInput] = useState('');
  const [loadingSync, setLoadingSync] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loadedItineraryId, setLoadedItineraryId] = useState<string | null>(null);

  // Client & Lead Info
  const [inquiryId, setInquiryId] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [destination, setDestination] = useState('');
  const [destinationType, setDestinationType] = useState('India');
  const [travelStyle, setTravelStyle] = useState('Family Trip');

  // Dates & Duration
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noOfDays, setNoOfDays] = useState(6);
  const [noOfNights, setNoOfNights] = useState(5);

  // Pax Breakdown
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [kidsDetails, setKidsDetails] = useState<KidDetail[]>([]);
  const [sharingType, setSharingType] = useState('Double Sharing');
  const [roomsCount, setRoomsCount] = useState(1);

  // Vehicle & Meal Plan
  const [vehicleType, setVehicleType] = useState('AC Innova Crysta');
  const [mealPlan, setMealPlan] = useState('Breakfast & Dinner');

  // Hotels State
  const [hotels, setHotels] = useState<HotelItem[]>([
    { index: 1, hotelName: '', city: '', nights: 5, roomCategory: 'Deluxe Room', category: 'Deluxe', stayDates: '', basePrice: 0, extraBedPrice: 0, childWithoutBedPrice: 0 }
  ]);

  // Manual Day-by-Day Itinerary State
  const [manualDays, setManualDays] = useState<ManualDayPlan[]>([
    {
      dayNumber: 1,
      title: 'Arrival & Welcome',
      fromCity: '',
      enRouteStops: [],
      toCity: '',
      breakfast: false,
      lunch: false,
      dinner: true,
      guidedTour: true,
      sightseeingPoints: ['Arrive, meet and greet by our driver / representative, transfer to hotel.']
    }
  ]);

  // Curated Wanderphilia Moments (Pure Experiences)
  const [customMoments, setCustomMoments] = useState<string[]>([]);
  const [newMomentText, setNewMomentText] = useState('');

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    'Accommodation on twin/triple sharing basis as per selected package.',
    'Meals Breakfast & Dinner (Breakfast except 1st Day, Dinner on last day).',
    'Dedicated private cab for all transfers, sightseeing, tolls, parking, and driver allowance.',
    '24x7 on-trip assistance from Wanderphilia concierge team.'
  ]);
  const [exclusions, setExclusions] = useState<string[]>([
    'Airfare / Train tickets unless explicitly mentioned.',
    'Lunch or any additional meals not specified in inclusions.',
    'Monument entry fees, camera tickets, adventure activities and personal expenses.',
    '5% GST applicable extra.'
  ]);
  const [newInclusionText, setNewInclusionText] = useState('');
  const [newExclusionText, setNewExclusionText] = useState('');

  // Costing & Quotation
  const [baseQuotation, setBaseQuotation] = useState<string>('');
  const [marginPercent, setMarginPercent] = useState<string>('10');
  const [finalQuotation, setFinalQuotation] = useState<string>('');
  const [perAdultPrice, setPerAdultPrice] = useState<string>('');
  const [perKidPrice, setPerKidPrice] = useState<string>('');
  const [advanceAmount, setAdvanceAmount] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  // Online Payment Toggles
  const [enableTokenPayment, setEnableTokenPayment] = useState(true);
  const [enableAdvancePayment, setEnableAdvancePayment] = useState(true);
  const [enableFullPayment, setEnableFullPayment] = useState(true);

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState<any>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Smart AI Multimodal Builder State
  const [multimodalFiles, setMultimodalFiles] = useState<File[]>([]);
  const [multimodalPrompt, setMultimodalPrompt] = useState('');
  const [isMultimodalParsing, setIsMultimodalParsing] = useState(false);
  const [multimodalProgress, setMultimodalProgress] = useState('');
  const [multimodalSummary, setMultimodalSummary] = useState('');
  const [multimodalErrors, setMultimodalErrors] = useState<string[]>([]);

  // Update total days/nights when manualDays length changes
  useEffect(() => {
    if (manualDays.length > 0) {
      setNoOfDays(manualDays.length);
      setNoOfNights(Math.max(1, manualDays.length - 1));
    }
  }, [manualDays.length]);

  // Sync meal plan selection across all manual day cards
  const handleMealPlanChange = (newMeal: string) => {
    setMealPlan(newMeal);
    setManualDays(prev => {
      const tot = prev.length;
      return prev.map(day => {
        const dMeals = getDefaultMealsForDay(day.dayNumber, tot, newMeal);
        return {
          ...day,
          breakfast: dMeals.breakfast,
          lunch: dMeals.lunch,
          dinner: dMeals.dinner
        };
      });
    });
  };

  // Helper to generate a catchy narrative heading for a manual day
  const generateCatchyHeadingForDay = (day: ManualDayPlan, idx: number, total: number): string => {
    const dayNum = day.dayNumber || idx + 1;
    const from = String(day.fromCity || '').trim();
    const to = String(day.toCity || '').trim();
    const isCityTransfer = from && to && from.toLowerCase() !== to.toLowerCase();

    const pts = (Array.isArray(day.sightseeingPoints) ? day.sightseeingPoints : []).map(p =>
      String(p).replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '').trim()
    );
    const notable: string[] = [];

    pts.forEach(p => {
      const m = p.match(/(?:visit|explore|discover|trek to|walk across|reach|marvel at|witness|admire|experience)\s+([^,\.\|;]{4,35})/i) ||
                p.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}(?:\s+(?:Monastery|Temple|Bridge|Lake|Valley|Village|Fort|Palace|Pass|Market|River|Gompa|Sanctuary|Camp|Ridge))?)/);
      if (m && m[1]) {
        const candidate = m[1].replace(/^(the|a|an)\s+/i, '').trim();
        if (candidate.length > 3 && !notable.some(n => n.toLowerCase() === candidate.toLowerCase())) {
          notable.push(candidate);
        }
      }
    });

    const stops = (Array.isArray(day.enRouteStops) ? day.enRouteStops : []).map(s => String(s).trim()).filter(Boolean);
    const highlights = [...notable, ...stops].slice(0, 2);

    let baseRoute = '';
    if (idx === 0) {
      baseRoute = isCityTransfer ? `Arrive in ${to}` : `Arrival & Welcome in ${to || destination || 'Himalayas'}`;
    } else if (idx === total - 1 && total > 1) {
      baseRoute = isCityTransfer ? `${from} → ${to} Departure` : `${to || 'Departure'} | Journey Concludes`;
    } else if (isCityTransfer) {
      baseRoute = `${from} → ${to}`;
    } else {
      baseRoute = `${to || 'Local Exploration'}`;
    }

    if (highlights.length > 0) {
      return `Day ${dayNum} — ${baseRoute} | ${highlights.join(' & ')}`;
    }
    return `Day ${dayNum} — ${baseRoute}`;
  };

  const handleRegenerateAllDayTitles = () => {
    setManualDays(prev => {
      const tot = prev.length;
      return prev.map((day, idx) => ({
        ...day,
        title: generateCatchyHeadingForDay(day, idx, tot)
      }));
    });
  };

  const handleRegenerateSingleDayTitle = (dIdx: number) => {
    setManualDays(prev => {
      const tot = prev.length;
      return prev.map((day, idx) => {
        if (idx !== dIdx) return day;
        return {
          ...day,
          title: generateCatchyHeadingForDay(day, idx, tot)
        };
      });
    });
  };

  // Day Card operations
  const addManualDay = () => {
    setManualDays(prev => {
      const newDayNum = prev.length + 1;
      const lastDay = prev[prev.length - 1];
      const fromCity = lastDay ? lastDay.toCity : '';
      const defMeals = getDefaultMealsForDay(newDayNum, newDayNum, mealPlan);
      return [
        ...prev,
        {
          dayNumber: newDayNum,
          title: `Day ${newDayNum} — Exploration`,
          fromCity,
          enRouteStops: [],
          toCity: fromCity || destination || '',
          breakfast: defMeals.breakfast,
          lunch: defMeals.lunch,
          dinner: defMeals.dinner,
          guidedTour: true,
          sightseeingPoints: ['Sightseeing & local exploration.']
        }
      ];
    });
  };

  const updateManualDay = (idx: number, field: keyof ManualDayPlan, val: any) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const moveManualDay = (idx: number, direction: -1 | 1) => {
    setManualDays(prev => {
      const target = idx + direction;
      if (target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy.map((d, i) => ({ ...d, dayNumber: i + 1 }));
    });
  };

  const deleteManualDay = (idx: number) => {
    if (manualDays.length <= 1) return;
    setManualDays(prev => prev.filter((_, i) => i !== idx).map((d, i) => ({ ...d, dayNumber: i + 1 })));
  };

  const toggleManualMeal = (idx: number, meal: 'breakfast' | 'lunch' | 'dinner') => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [meal]: !copy[idx][meal] };
      return copy;
    });
  };

  const toggleManualGuide = (idx: number) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], guidedTour: !copy[idx].guidedTour };
      return copy;
    });
  };

  const addManualPoint = (dayIdx: number) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[dayIdx] = {
        ...copy[dayIdx],
        sightseeingPoints: [...copy[dayIdx].sightseeingPoints, '']
      };
      return copy;
    });
  };

  const updateManualPoint = (dayIdx: number, pointIdx: number, val: string) => {
    setManualDays(prev => {
      const copy = [...prev];
      const pts = [...copy[dayIdx].sightseeingPoints];
      pts[pointIdx] = val;
      copy[dayIdx] = { ...copy[dayIdx], sightseeingPoints: pts };
      return copy;
    });
  };

  const deleteManualPoint = (dayIdx: number, pointIdx: number) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[dayIdx] = {
        ...copy[dayIdx],
        sightseeingPoints: copy[dayIdx].sightseeingPoints.filter((_, i) => i !== pointIdx)
      };
      return copy;
    });
  };

  const addEnRouteStop = (dayIdx: number) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[dayIdx] = {
        ...copy[dayIdx],
        enRouteStops: [...copy[dayIdx].enRouteStops, '']
      };
      return copy;
    });
  };

  const updateEnRouteStop = (dayIdx: number, stopIdx: number, val: string) => {
    setManualDays(prev => {
      const copy = [...prev];
      const stops = [...copy[dayIdx].enRouteStops];
      stops[stopIdx] = val;
      copy[dayIdx] = { ...copy[dayIdx], enRouteStops: stops };
      return copy;
    });
  };

  const deleteEnRouteStop = (dayIdx: number, stopIdx: number) => {
    setManualDays(prev => {
      const copy = [...prev];
      copy[dayIdx] = {
        ...copy[dayIdx],
        enRouteStops: copy[dayIdx].enRouteStops.filter((_, i) => i !== stopIdx)
      };
      return copy;
    });
  };

  // Sync / Load an existing generated manual itinerary into the form
  const handleLoadExistingItinerary = async () => {
    const rawQuery = syncInput.trim();
    if (!rawQuery) {
      setSyncMsg({ text: 'Please enter an Itinerary ID or URL.', type: 'info' });
      return;
    }

    setLoadingSync(true);
    setSyncMsg(null);

    try {
      const res = await fetch(`/api/itinerary/fetch-existing?query=${encodeURIComponent(rawQuery)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.found || !data.itinerary) {
        throw new Error(data.message || 'No saved manual itinerary found with this ID or link.');
      }

      const doc = data.itinerary;
      const targetId = doc.id || doc.slug || '';
      setLoadedItineraryId(targetId);

      // Populate basic info
      const raw = doc.rawZohoData || {};
      const lead = doc.leadDetails || {};
      const fName = lead.firstName || raw.First_Name || '';
      const lName = lead.lastName || raw.Last_Name || '';
      const cName = lead.name || raw.Full_Name || raw.leadName || doc.title || [fName, lName].filter(Boolean).join(' ') || '';
      setFirstName(fName);
      setLastName(lName);
      setFullName(cName);
      setEmail(lead.email || raw.Email || '');
      setMobile(lead.mobile || lead.phone || raw.Mobile || raw.Phone || '');
      setDepartureCity(doc.departureCity || lead.departureCity || raw.Departure_City || '');

      setInquiryId(doc.inquiryId || raw.Inquiry_ID || raw.inquiryId || targetId);
      setDestination(doc.destination || raw.Destination || '');
      if (doc.destinationType || raw.Destination_Type) setDestinationType(doc.destinationType || raw.Destination_Type);
      if (doc.travelStyle || raw.Travel_Style) setTravelStyle(doc.travelStyle || raw.Travel_Style);

      if (doc.startDate || lead.startDate) setStartDate(doc.startDate || lead.startDate);
      if (doc.endDate || lead.endDate) setEndDate(doc.endDate || lead.endDate);

      // Pax
      setAdults(Number(doc.adults ?? lead.adults ?? 2));
      setKids(Number(doc.kids ?? lead.kids ?? 0));
      if (Array.isArray(doc.kidsDetails) && doc.kidsDetails.length > 0) setKidsDetails(doc.kidsDetails);
      if (doc.vehicleType || raw.Vehicle_Type) setVehicleType(doc.vehicleType || raw.Vehicle_Type);
      if (doc.mealPlan || doc.stay?.mealPlan) setMealPlan(doc.mealPlan || doc.stay?.mealPlan);

      // Manual Days
      const incomingDays = (Array.isArray(doc.manualDayPlans) && doc.manualDayPlans.length > 0)
        ? doc.manualDayPlans
        : (Array.isArray(raw.manualDayPlans) ? raw.manualDayPlans : (Array.isArray(doc.dayPlans) ? doc.dayPlans : []));

      if (incomingDays.length > 0) {
        const normalized = incomingDays.map((md: any, idx: number) => ({
          dayNumber: md.dayNumber || idx + 1,
          title: md.title || `Day ${idx + 1}`,
          fromCity: md.fromCity || '',
          enRouteStops: Array.isArray(md.enRouteStops) ? md.enRouteStops : [],
          toCity: md.toCity || md.stayCity || md.city || '',
          breakfast: Boolean(md.breakfast),
          lunch: Boolean(md.lunch),
          dinner: Boolean(md.dinner),
          guidedTour: md.guidedTour !== undefined ? Boolean(md.guidedTour) : true,
          sightseeingPoints: (Array.isArray(md.sightseeingPoints) && md.sightseeingPoints.length > 0)
            ? md.sightseeingPoints
            : (Array.isArray(md.points) ? md.points : (Array.isArray(md.timeline) ? md.timeline : ['Sightseeing & local exploration.']))
        }));
        setManualDays(normalized);
      }

      // Moments & Highlights
      if (Array.isArray(doc.moments) && doc.moments.length > 0) {
        setCustomMoments(doc.moments);
      } else if (Array.isArray(raw.moments) && raw.moments.length > 0) {
        setCustomMoments(raw.moments);
      } else if (Array.isArray(doc.highlights) && doc.highlights.length > 0) {
        setCustomMoments(doc.highlights);
      }

      // Hotels
      const incomingHotels = (Array.isArray(doc.hotels) && doc.hotels.length > 0)
        ? doc.hotels
        : (Array.isArray(raw.hotels) ? raw.hotels : []);
      if (incomingHotels.length > 0) {
        setHotels(incomingHotels.map((h: any, idx: number) => ({
          index: h.index || idx + 1,
          hotelName: h.hotelName || '',
          city: h.city || '',
          nights: Number(h.nights) || 1,
          roomCategory: h.roomCategory || '',
          category: h.category || 'Deluxe',
          stayDates: h.stayDates || '',
          basePrice: Number(h.basePrice) || 0,
          extraBedPrice: Number(h.extraBedPrice) || 0,
          childWithoutBedPrice: Number(h.childWithoutBedPrice) || 0
        })));
      }

      // Inclusions / Exclusions
      if (Array.isArray(doc.inclusions) && doc.inclusions.length > 0) setInclusions(doc.inclusions);
      if (Array.isArray(doc.exclusions) && doc.exclusions.length > 0) setExclusions(doc.exclusions);

      // Costing
      if (doc.baseQuotationAmount !== undefined) setBaseQuotation(String(doc.baseQuotationAmount));
      if (doc.marginPercentage !== undefined) setMarginPercent(String(doc.marginPercentage));
      if (doc.finalQuotationAmount !== undefined) setFinalQuotation(String(doc.finalQuotationAmount));
      if (doc.perAdultPrice !== undefined) setPerAdultPrice(String(doc.perAdultPrice));
      if (doc.perKidPrice !== undefined) setPerKidPrice(String(doc.perKidPrice));
      if (doc.advanceAmountPaid !== undefined) setAdvanceAmount(String(doc.advanceAmountPaid));
      if (doc.balancePendingAmount !== undefined) setBalanceAmount(String(doc.balancePendingAmount));

      setSyncMsg({
        text: `Loaded Itinerary "${targetId}" successfully! You can modify any details below and click "Update Live Itinerary" to save.`,
        type: 'success'
      });
    } catch (err: any) {
      setSyncMsg({ text: err.message || 'Error loading itinerary.', type: 'error' });
    } finally {
      setLoadingSync(false);
    }
  };

  // Reset Form
  const handleReset = () => {
    if (window.confirm('Reset this form to blank state?')) {
      setLoadedItineraryId(null);
      setSyncInput('');
      setSyncMsg(null);
      setInquiryId('');
      setFullName('');
      setFirstName('');
      setLastName('');
      setEmail('');
      setMobile('');
      setDepartureCity('');
      setDestination('');
      setStartDate('');
      setEndDate('');
      setNoOfDays(6);
      setNoOfNights(5);
      setAdults(2);
      setKids(0);
      setKidsDetails([]);
      setHotels([{ index: 1, hotelName: '', city: '', nights: 5, roomCategory: 'Deluxe Room', category: 'Deluxe', stayDates: '', basePrice: 0, extraBedPrice: 0, childWithoutBedPrice: 0 }]);
      setManualDays([{
        dayNumber: 1,
        title: 'Arrival & Welcome',
        fromCity: '',
        enRouteStops: [],
        toCity: '',
        breakfast: false,
        lunch: false,
        dinner: true,
        guidedTour: true,
        sightseeingPoints: ['Arrive, meet and greet by our driver / representative, transfer to hotel.']
      }]);
      setCustomMoments([]);
      setBaseQuotation('');
      setFinalQuotation('');
      setPerAdultPrice('');
      setPerKidPrice('');
      setAdvanceAmount('');
      setBalanceAmount('');
      setGenSuccess(null);
      setGenError(null);
    }
  };

  // Multimodal Parse (AI Itinerary Builder)
  const handleMultimodalParse = async () => {
    if (multimodalFiles.length === 0 && !multimodalPrompt.trim()) return;
    setIsMultimodalParsing(true);
    setMultimodalProgress('Analyzing files & text with Groq AI...');
    setMultimodalSummary('');
    setMultimodalErrors([]);

    try {
      const formData = new FormData();
      if (multimodalPrompt.trim()) formData.append('prompt', multimodalPrompt.trim());
      multimodalFiles.forEach(f => formData.append('files', f));

      const res = await fetch('/api/ai/parse-multimodal-itinerary', {
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to parse with AI.');

      const data = json.data;
      if (data.destination) setDestination(data.destination);
      if (data.destinationType) setDestinationType(data.destinationType);
      if (data.travelStyle) setTravelStyle(data.travelStyle);
      if (data.startDate) setStartDate(data.startDate);
      if (data.endDate) setEndDate(data.endDate);

      // Lead info
      if (data.leadTraveler?.name) {
        setFullName(data.leadTraveler.name);
        const parts = String(data.leadTraveler.name).trim().split(' ');
        setFirstName(parts[0] || '');
        setLastName(parts.slice(1).join(' ') || '');
      }
      if (data.leadTraveler?.phone) setMobile(data.leadTraveler.phone);
      if (data.leadTraveler?.email) setEmail(data.leadTraveler.email);
      if (data.leadTraveler?.departureCity) setDepartureCity(data.leadTraveler.departureCity);

      if (data.adults !== undefined) setAdults(Number(data.adults));
      if (data.kids !== undefined) setKids(Number(data.kids));

      if (data.vehicleType) setVehicleType(data.vehicleType);
      if (data.mealPlan) handleMealPlanChange(data.mealPlan);

      // Day Plans
      const incomingDays = (Array.isArray(data.dayPlans) && data.dayPlans.length > 0)
        ? data.dayPlans
        : (Array.isArray(data.days) ? data.days : []);

      if (incomingDays.length > 0) {
        const mappedDays: ManualDayPlan[] = incomingDays.map((dp: any, idx: number) => {
          const rawPoints = Array.isArray(dp.sightseeingPoints) && dp.sightseeingPoints.length > 0
            ? dp.sightseeingPoints
            : (Array.isArray(dp.timeline) ? dp.timeline : (Array.isArray(dp.activities) ? dp.activities : []));
          const cleanPoints = rawPoints.map((p: any) => String(p).trim()).filter(Boolean);

          return {
            dayNumber: dp.day || dp.dayNumber || idx + 1,
            title: dp.title || `Day ${idx + 1} — Exploration`,
            fromCity: dp.fromCity || '',
            enRouteStops: Array.isArray(dp.enRouteStops) ? dp.enRouteStops : [],
            toCity: dp.toCity || dp.stayLocation || destination || '',
            breakfast: Boolean(dp.meals?.breakfast),
            lunch: Boolean(dp.meals?.lunch),
            dinner: Boolean(dp.meals?.dinner),
            guidedTour: dp.guidedTour !== undefined ? Boolean(dp.guidedTour) : true,
            sightseeingPoints: cleanPoints.length > 0 ? cleanPoints : ['Sightseeing & local exploration.']
          };
        });
        setManualDays(mappedDays);
        setNoOfDays(mappedDays.length);
        setNoOfNights(Math.max(1, mappedDays.length - 1));
      }

      // Hotels
      if (Array.isArray(data.hotelStays) && data.hotelStays.length > 0) {
        setHotels(data.hotelStays.map((hs: any, idx: number) => ({
          index: idx + 1,
          hotelName: hs.hotelName || '',
          city: hs.city || destination,
          nights: Number(hs.nights) || 1,
          roomCategory: hs.roomCategory || 'Deluxe Room',
          category: hs.category || 'Deluxe',
          stayDates: '',
          basePrice: 0,
          extraBedPrice: 0,
          childWithoutBedPrice: 0
        })));
      }

      // Pure Moments
      if (Array.isArray(data.moments) && data.moments.length > 0) {
        setCustomMoments(data.moments);
      }

      // Costing
      if (data.pricing?.baseAmount) setBaseQuotation(String(data.pricing.baseAmount));
      if (data.pricing?.finalQuotationAmount) setFinalQuotation(String(data.pricing.finalQuotationAmount));
      if (data.pricing?.perAdultPrice) setPerAdultPrice(String(data.pricing.perAdultPrice));
      if (data.pricing?.perKidPrice) setPerKidPrice(String(data.pricing.perKidPrice));
      if (data.pricing?.advanceAmount) setAdvanceAmount(String(data.pricing.advanceAmount));

      setMultimodalSummary(`Successfully parsed ${incomingDays.length} days and details into the form!`);
    } catch (err: any) {
      setMultimodalErrors([err.message || 'AI parsing error.']);
    } finally {
      setIsMultimodalParsing(false);
      setMultimodalProgress('');
    }
  };

  // Generate or Update Itinerary Submission
  const handleSubmitItinerary = async () => {
    if (!destination.trim()) {
      setGenError('Destination is required.');
      return;
    }
    setGenerating(true);
    setGenError(null);
    setGenSuccess(null);

    const payload = {
      targetItineraryId: loadedItineraryId || undefined,
      existingId: loadedItineraryId || undefined,
      inquiryId: inquiryId || undefined,
      firstName,
      lastName,
      fullName: fullName || `${firstName} ${lastName}`.trim() || 'Valued Guest',
      email,
      mobile,
      departureCity,
      destination,
      destinationType,
      startDate,
      endDate,
      noOfDays: manualDays.length,
      noOfNights: Math.max(1, manualDays.length - 1),
      adults: Number(adults) || 2,
      kids: Number(kids) || 0,
      kidsDetails: kidsDetails.slice(0, Number(kids) || 0),
      roomsCount: Number(roomsCount) || 1,
      sharingType,
      travelStyle,
      tripType: 'Customised Trip',
      vehicleType,
      mealPlan,
      hotels: hotels.filter(h => h.hotelName.trim().length > 0),
      isManualItinerary: true,
      creationMode: 'manual',
      manualDayPlans: manualDays.map(md => ({
        dayNumber: md.dayNumber,
        title: md.title,
        fromCity: md.fromCity,
        enRouteStops: md.enRouteStops,
        toCity: md.toCity,
        stayCity: md.toCity,
        city: md.toCity,
        breakfast: md.breakfast,
        lunch: md.lunch,
        dinner: md.dinner,
        guidedTour: md.guidedTour,
        sightseeingPoints: md.sightseeingPoints.filter(p => p && p.trim())
      })),
      moments: customMoments.filter(m => m && m.trim()),
      inclusions: inclusions.filter(s => s && s.trim()),
      exclusions: exclusions.filter(s => s && s.trim()),
      baseQuotationAmount: baseQuotation ? Number(baseQuotation) : undefined,
      marginPercentage: marginPercent ? Number(marginPercent) : undefined,
      finalQuotationAmount: finalQuotation ? Number(finalQuotation) : undefined,
      perAdultPrice: perAdultPrice ? Number(perAdultPrice) : undefined,
      perKidPrice: perKidPrice ? Number(perKidPrice) : undefined,
      advanceAmountPaid: advanceAmount ? Number(advanceAmount) : undefined,
      balancePendingAmount: balanceAmount ? Number(balanceAmount) : undefined,
      specialRequirements,
      enableTokenPayment,
      enableAdvancePayment,
      enableFullPayment
    };

    try {
      const res = await fetch('/api/sheet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to generate itinerary.');

      setGenSuccess(data);
      if (data.id || data.slug) {
        setLoadedItineraryId(data.id || data.slug);
      }
    } catch (err: any) {
      setGenError(err.message || 'Error occurred while saving itinerary.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar forceWhiteDesktop />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Top Control Bar: Title & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-500 border border-sky-400/40 flex items-center justify-center text-white shadow-lg shrink-0">
              <PenTool className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  Manual Itinerary Studio
                </h1>
                <span className="text-[10px] font-extrabold bg-sky-950 text-sky-300 border border-sky-600/60 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sequential ID &amp; In-Place Updates
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Create &amp; edit point-by-point narrative itineraries with automatic sequence IDs and live link reloads.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sheet-itinerary"
              className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-orange-400" />
              <span>Sheet Subform Mode</span>
            </Link>
            <Link
              href="/wanderphilia-sales"
              className="px-3.5 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Sales Command Hub</span>
            </Link>
          </div>
        </div>

        {/* Sync / Load Existing Itinerary Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-white block">
                Load / Edit Existing Manual Itinerary:
              </span>
              <span className="text-[11px] text-slate-400">
                Enter an ID (e.g. <code className="text-amber-300 font-mono">heer-001</code>, <code className="text-amber-300 font-mono">MAN-001</code>) or full URL to reload all fields and update the same link.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Input
              type="text"
              placeholder="e.g. heer-001 or MAN-001..."
              value={syncInput}
              onChange={e => setSyncInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleLoadExistingItinerary();
                }
              }}
              className="h-9 bg-slate-950 border border-slate-700 text-xs w-full md:w-60 text-white placeholder:text-slate-500 font-mono font-semibold"
            />
            <Button
              type="button"
              onClick={handleLoadExistingItinerary}
              disabled={loadingSync}
              variant="outline"
              size="sm"
              className="h-9 px-4 text-xs font-bold border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-950/70 rounded-xl cursor-pointer shrink-0 transition"
            >
              {loadingSync ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Sync / Load'}
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="h-9 px-3 text-xs font-bold border border-red-500/40 bg-red-950/30 text-red-300 hover:bg-red-950/60 rounded-xl cursor-pointer shrink-0 transition"
              title="Reset Form"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Sync Status / Loaded Banner */}
        {syncMsg && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-xs border ${
            syncMsg.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300'
              : syncMsg.type === 'error'
              ? 'bg-red-950/50 border-red-500/50 text-red-300'
              : 'bg-blue-950/50 border-blue-500/50 text-blue-300'
          }`}>
            <span>{syncMsg.text}</span>
            {loadedItineraryId && (
              <span className="font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Target: {loadedItineraryId}
              </span>
            )}
          </div>
        )}

        {/* Smart AI Multimodal Itinerary Builder */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-indigo-400/40 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/40 border border-purple-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                Smart AI Itinerary Builder
                <span className="text-[10px] bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2.5 py-0.5 rounded-full">
                  Groq Multimodal
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Paste raw itinerary text, flight quotes, hotel rates, or upload screenshots/PDFs. AI will automatically structure all days, hotels, and highlights!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <label className="cursor-pointer border-2 border-dashed border-indigo-400/40 hover:border-indigo-400/80 bg-white/5 hover:bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition flex-1 group">
                <UploadCloud className="w-6 h-6 text-indigo-300 group-hover:scale-110 transition mb-1" />
                <span className="text-xs font-bold text-white">Upload PDFs or Screenshots</span>
                <span className="text-[10px] text-slate-400">PDF, PNG, JPG, WEBP</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={e => {
                    if (e.target.files) setMultimodalFiles(Array.from(e.target.files));
                  }}
                  className="hidden"
                />
              </label>

              <div className="flex-2 flex flex-col">
                <Textarea
                  value={multimodalPrompt}
                  onChange={e => setMultimodalPrompt(e.target.value)}
                  placeholder="Paste complete day-wise itinerary, supplier text, or instructions (e.g. Day 1 Chandigarh to Narkanda, Day 2 Narkanda to Sangla, Cost 24,590 per person)..."
                  className="w-full h-28 bg-slate-950/80 border border-indigo-400/40 text-xs text-white placeholder:text-slate-400 rounded-xl p-3 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                />
              </div>
            </div>

            {multimodalFiles.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-indigo-300">Files ({multimodalFiles.length}):</span>
                {multimodalFiles.map((file, idx) => (
                  <span key={idx} className="bg-indigo-900/60 border border-indigo-400/50 rounded-lg px-2.5 py-1 text-xs text-white flex items-center gap-1.5">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => setMultimodalFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Parsed with 8,192 token limit + regex day-splitter to ensure no days are truncated.
              </span>
              <Button
                type="button"
                onClick={handleMultimodalParse}
                disabled={isMultimodalParsing || (multimodalFiles.length === 0 && !multimodalPrompt.trim())}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs h-9 px-5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition"
              >
                {isMultimodalParsing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>{multimodalProgress || 'Parsing with Groq AI...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Auto-Generate Itinerary with AI</span>
                  </>
                )}
              </Button>
            </div>

            {multimodalSummary && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{multimodalSummary}</span>
              </div>
            )}

            {multimodalErrors.length > 0 && (
              <div className="p-3 bg-red-500/20 border border-red-400/40 rounded-xl text-red-200 text-xs">
                {multimodalErrors.map((err, i) => <p key={i}>• {err}</p>)}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 1: TRAVELER & CLIENT DETAILS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              1. Traveler &amp; Client Details
            </h2>
            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg">
              {loadedItineraryId ? `Editing ID: ${loadedItineraryId}` : 'New Sequential ID will be assigned'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Lead / Client Name</label>
              <Input
                type="text"
                placeholder="e.g. Heer"
                value={fullName}
                onChange={e => {
                  setFullName(e.target.value);
                  const p = e.target.value.trim().split(' ');
                  setFirstName(p[0] || '');
                  setLastName(p.slice(1).join(' ') || '');
                }}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mobile / WhatsApp</label>
              <Input
                type="text"
                placeholder="e.g. +91 9876543210"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
              <Input
                type="email"
                placeholder="client@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Departure City</label>
              <Input
                type="text"
                placeholder="e.g. Chandigarh"
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Destination</label>
              <Input
                type="text"
                placeholder="e.g. Spiti Valley"
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-bold text-amber-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Destination Type</label>
              <select
                value={destinationType}
                onChange={e => setDestinationType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white font-medium text-xs h-9 rounded-xl px-3 focus:outline-none"
              >
                <option value="India">Domestic (India)</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Travel Style</label>
              <Input
                type="text"
                placeholder="e.g. Private Road Trip"
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-300 mb-1">Adults</label>
                <Input
                  type="number"
                  min={1}
                  value={adults}
                  onChange={e => setAdults(Number(e.target.value) || 1)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-bold text-center"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-300 mb-1">Kids</label>
                <Input
                  type="number"
                  min={0}
                  value={kids}
                  onChange={e => setKids(Number(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-bold text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: VEHICLE & MEAL PLAN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-400" />
              2. Vehicle &amp; Meal Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Vehicle Selection</label>
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white font-medium text-xs h-9 rounded-xl px-3 focus:outline-none"
              >
                {VEHICLE_OPTIONS.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                <span>Meal Plan</span>
                <span className="text-emerald-400 font-normal text-[11px]">(Auto-syncs B/L/D across days)</span>
              </label>
              <select
                value={mealPlan}
                onChange={e => handleMealPlanChange(e.target.value)}
                className="w-full bg-slate-950 border border-sky-500/60 text-white font-bold text-xs h-9 rounded-xl px-3 focus:outline-none focus:border-sky-400"
              >
                <option value="Breakfast & Dinner">🍽️ Breakfast &amp; Dinner (MAP / MAPAI)</option>
                <option value="Breakfast Only">☕ Breakfast Only (CP)</option>
                <option value="All Meals">🍱 All Meals (Breakfast, Lunch &amp; Dinner / APAI)</option>
                <option value="Room Only">🛏️ Room Only (EP) - No Meals</option>
                <option value="Jain Breakfast & Dinner">🌱 Jain Breakfast &amp; Dinner (Pure Veg)</option>
                <option value="Jain All Meals">🌱 Jain All Meals (Pure Veg)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: HOTEL STAYS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Hotel className="w-4 h-4 text-orange-400" />
              3. Hotel Stays ({hotels.length} Properties)
            </h2>
            <Button
              type="button"
              onClick={() => {
                setHotels(prev => [
                  ...prev,
                  { index: prev.length + 1, hotelName: '', city: destination, nights: 1, roomCategory: 'Deluxe Room', category: 'Deluxe', stayDates: '', basePrice: 0, extraBedPrice: 0, childWithoutBedPrice: 0 }
                ]);
              }}
              variant="outline"
              size="sm"
              className="h-8 text-xs font-bold border border-slate-700 bg-slate-950 text-slate-300 hover:text-white rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Add Hotel
            </Button>
          </div>

          <div className="space-y-3">
            {hotels.map((h, hIdx) => (
              <div key={hIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Stay City</label>
                  <Input
                    type="text"
                    value={h.city}
                    onChange={e => {
                      const copy = [...hotels];
                      copy[hIdx].city = e.target.value;
                      setHotels(copy);
                    }}
                    placeholder="e.g. Kaza"
                    className="h-8 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Hotel Name</label>
                  <Input
                    type="text"
                    value={h.hotelName}
                    onChange={e => {
                      const copy = [...hotels];
                      copy[hIdx].hotelName = e.target.value;
                      setHotels(copy);
                    }}
                    placeholder="e.g. Dragon Mud House"
                    className="h-8 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Room Category</label>
                  <Input
                    type="text"
                    value={h.roomCategory}
                    onChange={e => {
                      const copy = [...hotels];
                      copy[hIdx].roomCategory = e.target.value;
                      setHotels(copy);
                    }}
                    placeholder="e.g. Deluxe Room"
                    className="h-8 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Nights</label>
                    <Input
                      type="number"
                      min={1}
                      value={h.nights}
                      onChange={e => {
                        const copy = [...hotels];
                        copy[hIdx].nights = Number(e.target.value) || 1;
                        setHotels(copy);
                      }}
                      className="h-8 bg-slate-900 border border-slate-700 text-xs text-white rounded-lg text-center font-bold"
                    />
                  </div>
                  {hotels.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setHotels(prev => prev.filter((_, i) => i !== hIdx))}
                      className="text-slate-500 hover:text-red-400 p-1.5 mt-3.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DAY-BY-DAY ITINERARY (MANUAL HIGHLIGHTS MODE) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-sky-400" />
                4. Day-by-Day Itinerary (Point-by-Point Highlights Mode)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Custom narrative headings, route movements, en-route stops, and exact milestone sightseeing points.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
                {manualDays.length} Days Planned
              </span>
              <Button
                type="button"
                onClick={handleRegenerateAllDayTitles}
                variant="outline"
                size="sm"
                className="h-9 text-xs border border-amber-500/50 bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                title="Auto-generate or regenerate narrative headings for all days based on route & highlights"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ✨ Generate / Regenerate Day Headings
              </Button>
              <Button
                type="button"
                onClick={addManualDay}
                variant="outline"
                size="sm"
                className="h-9 text-xs border border-sky-500 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Day
              </Button>
            </div>
          </div>

          {/* Responsive Day Cards */}
          <div className="space-y-4">
            {manualDays.map((day, dIdx) => (
              <div
                key={dIdx}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 transition-all hover:border-sky-500/40"
              >
                {/* Top bar: Badge, Title Input, Meals, Guide, Reorder */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-[280px]">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-500 text-white font-black flex items-center justify-center text-sm shrink-0 shadow-md">
                      D{day.dayNumber}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">
                          Day {day.dayNumber} Narrative Heading
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRegenerateSingleDayTitle(dIdx)}
                          className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Regen
                        </button>
                      </div>
                      <Input
                        type="text"
                        value={day.title}
                        onChange={e => updateManualDay(dIdx, 'title', e.target.value)}
                        placeholder={`e.g. Day ${day.dayNumber} — Arrival & Exploration`}
                        className="text-xs h-9 bg-slate-900 border border-slate-700 text-white font-semibold rounded-xl w-full"
                      />
                    </div>
                  </div>

                  {/* Meals, Guide & Actions */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold px-1.5 uppercase">Meals:</span>
                      <button
                        type="button"
                        onClick={() => toggleManualMeal(dIdx, 'breakfast')}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                          day.breakfast ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 bg-slate-800/50'
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleManualMeal(dIdx, 'lunch')}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                          day.lunch ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 bg-slate-800/50'
                        }`}
                      >
                        L
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleManualMeal(dIdx, 'dinner')}
                        className={`w-7 h-7 rounded-lg text-xs font-black transition ${
                          day.dinner ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 bg-slate-800/50'
                        }`}
                      >
                        D
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleManualGuide(dIdx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                        day.guidedTour
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      Guide: <strong className="font-extrabold">{day.guidedTour ? 'Yes ✓' : 'No'}</strong>
                    </button>

                    <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                      <button
                        type="button"
                        disabled={dIdx === 0}
                        onClick={() => moveManualDay(dIdx, -1)}
                        className="text-slate-400 hover:text-white disabled:opacity-30 p-1.5 rounded-lg hover:bg-slate-800"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={dIdx === manualDays.length - 1}
                        onClick={() => moveManualDay(dIdx, 1)}
                        className="text-slate-400 hover:text-white disabled:opacity-30 p-1.5 rounded-lg hover:bg-slate-800"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={manualDays.length <= 1}
                        onClick={() => deleteManualDay(dIdx)}
                        className="text-slate-400 hover:text-red-400 disabled:opacity-30 p-1.5 rounded-lg hover:bg-red-950/40"
                        title="Delete Day"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Route Row: From City, En-Route Stops, To City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      From City (Start)
                    </label>
                    <Input
                      type="text"
                      value={day.fromCity}
                      onChange={e => updateManualDay(dIdx, 'fromCity', e.target.value)}
                      placeholder="e.g. Chandigarh"
                      className="text-xs h-9 bg-slate-950 border border-slate-700 text-white rounded-xl"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        En-Route Stops ({day.enRouteStops.length})
                      </label>
                      <button
                        type="button"
                        onClick={() => addEnRouteStop(dIdx)}
                        className="text-[10px] text-sky-400 hover:text-sky-300 font-bold"
                      >
                        + Add Stop
                      </button>
                    </div>
                    {day.enRouteStops.length === 0 ? (
                      <div className="text-[11px] text-slate-500 italic py-1.5 px-2 bg-slate-950/60 rounded-lg border border-slate-800">
                        None. Click &ldquo;+ Add Stop&rdquo; for scenic halts.
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {day.enRouteStops.map((stop, sIdx) => (
                          <div key={sIdx} className="flex items-center gap-1.5">
                            <Input
                              type="text"
                              value={stop}
                              onChange={e => updateEnRouteStop(dIdx, sIdx, e.target.value)}
                              placeholder="e.g. Nako Lake / Khab Sangam"
                              className="text-xs h-8 bg-slate-950 border border-slate-700 text-white rounded-lg flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => deleteEnRouteStop(dIdx, sIdx)}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      To / Stay City (Night Halt)
                    </label>
                    <Input
                      type="text"
                      value={day.toCity}
                      onChange={e => updateManualDay(dIdx, 'toCity', e.target.value)}
                      placeholder="e.g. Narkanda"
                      className="text-xs h-9 bg-slate-950 border border-slate-700 text-white font-bold rounded-xl text-sky-300"
                    />
                  </div>
                </div>

                {/* Sightseeing Points */}
                <div className="space-y-2 bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Milestone Sightseeing &amp; Activities ({day.sightseeingPoints.length} Points)
                    </label>
                    <button
                      type="button"
                      onClick={() => addManualPoint(dIdx)}
                      className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Point
                    </button>
                  </div>

                  <div className="space-y-2">
                    {day.sightseeingPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-slate-800 text-slate-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                          {pIdx + 1}
                        </span>
                        <Input
                          type="text"
                          value={pt}
                          onChange={e => updateManualPoint(dIdx, pIdx, e.target.value)}
                          placeholder="e.g. Visit Key Monastery, one of the oldest in Spiti Valley..."
                          className="text-xs h-8 bg-slate-950 border border-slate-700 text-white rounded-lg flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => deleteManualPoint(dIdx, pIdx)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Delete Point"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: PURE WANDERPHILIA MOMENTS (EXPERIENCES ONLY) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                5. Wanderphilia Moments (Curated Authentic Experiences Only)
              </h2>
              <p className="text-xs text-slate-400">
                Notice: Pure experiences only (e.g. Stargazing at Kaza, Hot Stone Bath, River Rafting). No generic logistics.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-300 bg-amber-950/50 border border-amber-600/40 px-2.5 py-1 rounded-lg">
              {customMoments.length} Moments Curated
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={newMomentText}
              onChange={e => setNewMomentText(e.target.value)}
              placeholder="e.g. Witness the breathtaking confluence of Spiti and Pin Rivers at Dhankar"
              className="text-xs h-9 bg-slate-950 border border-slate-700 text-white rounded-xl flex-1"
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (newMomentText.trim()) {
                    setCustomMoments(prev => [...prev, newMomentText.trim()]);
                    setNewMomentText('');
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (newMomentText.trim()) {
                  setCustomMoments(prev => [...prev, newMomentText.trim()]);
                  setNewMomentText('');
                }
              }}
              className="h-9 px-4 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {customMoments.map((moment, idx) => (
              <div key={idx} className="bg-slate-950 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-200 flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold shrink-0">✦</span>
                  <span className="text-[11px] leading-tight font-medium">{moment}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCustomMoments(prev => prev.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-red-400 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 6: INCLUSIONS & EXCLUSIONS */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            6. Package Inclusions &amp; Exclusions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Package Inclusions ({inclusions.length})
              </span>
              <div className="space-y-2">
                {inclusions.map((inc, iIdx) => (
                  <div key={iIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 text-xs font-bold">✔</span>
                    <Input
                      type="text"
                      value={inc}
                      onChange={e => {
                        const copy = [...inclusions];
                        copy[iIdx] = e.target.value;
                        setInclusions(copy);
                      }}
                      className="text-xs h-7 bg-transparent border-0 text-slate-200 flex-1 p-0 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setInclusions(prev => prev.filter((_, i) => i !== iIdx))}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="text"
                  placeholder="Add custom inclusion..."
                  value={newInclusionText}
                  onChange={e => setNewInclusionText(e.target.value)}
                  className="text-xs h-8 bg-slate-950 border border-slate-700 text-white rounded-lg flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newInclusionText.trim()) {
                      setInclusions(prev => [...prev, newInclusionText.trim()]);
                      setNewInclusionText('');
                    }
                  }}
                  className="h-8 px-3 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Exclusions */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <X className="w-3.5 h-3.5" /> Package Exclusions ({exclusions.length})
              </span>
              <div className="space-y-2">
                {exclusions.map((exc, eIdx) => (
                  <div key={eIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
                    <span className="text-rose-400 text-xs font-bold">✖</span>
                    <Input
                      type="text"
                      value={exc}
                      onChange={e => {
                        const copy = [...exclusions];
                        copy[eIdx] = e.target.value;
                        setExclusions(copy);
                      }}
                      className="text-xs h-7 bg-transparent border-0 text-slate-200 flex-1 p-0 focus-visible:ring-0"
                    />
                    <button
                      type="button"
                      onClick={() => setExclusions(prev => prev.filter((_, i) => i !== eIdx))}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Input
                  type="text"
                  placeholder="Add custom exclusion..."
                  value={newExclusionText}
                  onChange={e => setNewExclusionText(e.target.value)}
                  className="text-xs h-8 bg-slate-950 border border-slate-700 text-white rounded-lg flex-1"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newExclusionText.trim()) {
                      setExclusions(prev => [...prev, newExclusionText.trim()]);
                      setNewExclusionText('');
                    }
                  }}
                  className="h-8 px-3 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: PRICING & QUOTATION */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            7. Costing &amp; Quoted Investment
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Total Base Package Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g. 73770"
                value={baseQuotation}
                onChange={e => setBaseQuotation(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Per Adult Quoted Price (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g. 24590"
                value={perAdultPrice}
                onChange={e => setPerAdultPrice(e.target.value)}
                className="bg-slate-950 border border-emerald-500/50 text-xs text-emerald-300 rounded-xl h-9 font-mono font-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Child Quoted Price (₹) (Optional)
              </label>
              <Input
                type="number"
                placeholder="Optional"
                value={perKidPrice}
                onChange={e => setPerKidPrice(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl h-9 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Total Final Quoted Amount (₹)
              </label>
              <Input
                type="number"
                placeholder="e.g. 73770"
                value={finalQuotation}
                onChange={e => setFinalQuotation(e.target.value)}
                className="bg-slate-950 border border-amber-500/50 text-xs text-amber-300 rounded-xl h-9 font-mono font-black"
              />
            </div>
          </div>
        </div>

        {/* SUBMISSION & LINK GENERATION CARD */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 border-2 border-sky-500/50 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                {loadedItineraryId ? `Update Live Itinerary: ${loadedItineraryId}` : 'Publish New Manual Itinerary'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {loadedItineraryId
                  ? 'Changes will be saved directly into the existing link. The client URL will not change!'
                  : 'An automatic sequential unique ID (e.g. heer-001, MAN-001) will be assigned.'}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleSubmitItinerary}
              disabled={generating}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-sm h-12 px-8 rounded-xl shadow-lg cursor-pointer transition flex items-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Saving Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{loadedItineraryId ? `Update Live Itinerary (${loadedItineraryId}) ↗` : 'Generate Manual Itinerary ↗'}</span>
                </>
              )}
            </Button>
          </div>

          {genError && (
            <div className="p-3.5 bg-red-950/60 border border-red-500/60 rounded-xl text-red-300 text-xs font-semibold">
              Error: {genError}
            </div>
          )}

          {genSuccess && (
            <div className="p-4 bg-emerald-950/70 border-2 border-emerald-500/80 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 text-sm font-black">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{genSuccess.updated ? 'Itinerary Updated Successfully Live!' : 'Itinerary Generated Successfully!'}</span>
                <span className="font-mono text-xs bg-emerald-900/60 px-2.5 py-0.5 rounded border border-emerald-500/40 text-white">
                  ID: {genSuccess.id}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
                <Input
                  readOnly
                  value={genSuccess.publicUrl || `https://wanderphilia.com${genSuccess.url}`}
                  className="bg-slate-950 border border-emerald-500/50 text-xs text-white font-mono h-10 rounded-xl flex-1 select-all"
                />
                <Button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(genSuccess.publicUrl || `https://wanderphilia.com${genSuccess.url}`)}
                  className="h-10 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Link
                </Button>
                <a
                  href={genSuccess.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-1.5 inline-flex justify-center items-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Open Itinerary ↗
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
