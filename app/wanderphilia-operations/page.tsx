'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Send,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  FileText,
  Percent,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Layers,
  Edit3,
  Save,
  LogOut,
  IndianRupee,
  MessageSquare,
  Compass,
  CheckSquare,
  Square,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  PartyPopper,
  Trophy,
  Camera,
  Ticket,
  Plus,
  Trash2,
  Paperclip,
  Upload
} from 'lucide-react';
import { OperationsBooking, OperationsHotelItem, OperationsStatus, OperationsSummaryStats } from '@/types/operations';
import { calculateRoomsAndBeds, isExtraBed, isWithoutBed } from '@/lib/zoho-pricing';

// City normalization helper matching Zoho CRM master data keys
function normalizeCityKey(city: string): string {
  if (!city) return '';
  return city
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Helper to match vehicle state with booking destination and cities
function matchVehicleState(vehicleState: string, destination: string, cities: string[] = []): boolean {
  if (!vehicleState) return true;
  const vStateClean = vehicleState.toLowerCase().replace(/[^a-z0-9]/g, '');
  const destClean = (destination || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (vStateClean === destClean || destClean.includes(vStateClean) || vStateClean.includes(destClean)) {
    return true;
  }

  const stateAliases: Record<string, string[]> = {
    rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'jawai', 'bikaner', 'pushkar', 'ranthambore', 'mountabu'],
    himachal: ['himachalpradesh', 'spiti', 'spitivalley', 'manali', 'shimla', 'dharamshala', 'jibhi', 'kasol', 'dalhousie'],
    himachalpradesh: ['himachal', 'spiti', 'spitivalley', 'manali', 'shimla', 'dharamshala', 'jibhi', 'kasol', 'dalhousie'],
    uttarakhand: ['rishikesh', 'haridwar', 'dehradun', 'mussoorie', 'nainital', 'jimcorbett', 'auli'],
    kashmir: ['srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'jammu', 'ladakh', 'leh'],
    kerala: ['kochi', 'munnar', 'thekkady', 'alleppey', 'kumarakom', 'kovalam', 'wayanad'],
    maharashtra: ['mumbai', 'pune', 'lonavala', 'mahabaleshwar', 'alibaug', 'shirdi', 'nashik'],
    goa: ['northgoa', 'southgoa', 'panaji', 'calangute'],
    karnataka: ['bangalore', 'coorg', 'mysore', 'chikmagalur', 'hampi', 'gokarna'],
    tamilnadu: ['chennai', 'ooty', 'kodaikanal', 'madurai', 'rameswaram', 'kanyakumari', 'pondicherry'],
    sikkim: ['gangtok', 'darjeeling', 'pelling', 'lachung', 'namchi'],
    andaman: ['portblair', 'havelock', 'neilisland']
  };

  const aliases = stateAliases[vStateClean];
  if (aliases) {
    if (aliases.some(a => destClean.includes(a) || a.includes(destClean))) {
      return true;
    }
    for (const c of cities) {
      const cClean = c.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (aliases.some(a => cClean.includes(a) || a.includes(cClean))) {
        return true;
      }
    }
  }

  return false;
}

// Helper to match vendor state/city with booking destination and cities
function matchVendorState(vendorState: string, vendorCity: string, destination: string, cities: string[] = []): boolean {
  if (!vendorState && !vendorCity) return true;
  const vStateClean = (vendorState || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const vCityClean = (vendorCity || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const destClean = (destination || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (vStateClean && (vStateClean === destClean || destClean.includes(vStateClean) || vStateClean.includes(destClean))) {
    return true;
  }
  if (vCityClean && (vCityClean === destClean || destClean.includes(vCityClean) || vCityClean.includes(destClean))) {
    return true;
  }

  const stateAliases: Record<string, string[]> = {
    rajasthan: ['jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'jawai', 'bikaner', 'pushkar', 'ranthambore', 'mountabu'],
    himachal: ['himachalpradesh', 'spiti', 'spitivalley', 'manali', 'shimla', 'dharamshala', 'jibhi', 'kasol', 'dalhousie'],
    himachalpradesh: ['himachal', 'spiti', 'spitivalley', 'manali', 'shimla', 'dharamshala', 'jibhi', 'kasol', 'dalhousie'],
    uttarakhand: ['rishikesh', 'haridwar', 'dehradun', 'mussoorie', 'nainital', 'jimcorbett', 'auli'],
    kashmir: ['srinagar', 'gulmarg', 'pahalgam', 'sonamarg', 'jammu', 'ladakh', 'leh'],
    kerala: ['kochi', 'munnar', 'thekkady', 'alleppey', 'kumarakom', 'kovalam', 'wayanad'],
    maharashtra: ['mumbai', 'pune', 'lonavala', 'mahabaleshwar', 'alibaug', 'shirdi', 'nashik'],
    goa: ['northgoa', 'southgoa', 'panaji', 'calangute'],
    karnataka: ['bangalore', 'coorg', 'mysore', 'chikmagalur', 'hampi', 'gokarna'],
    tamilnadu: ['chennai', 'ooty', 'kodaikanal', 'madurai', 'rameswaram', 'kanyakumari', 'pondicherry'],
    sikkim: ['gangtok', 'darjeeling', 'pelling', 'lachung', 'namchi'],
    andaman: ['portblair', 'havelock', 'neilisland']
  };

  const aliases = stateAliases[vStateClean] || stateAliases[destClean];
  if (aliases) {
    if (vStateClean && aliases.some(a => destClean.includes(a) || a.includes(destClean))) return true;
    if (vCityClean && aliases.some(a => a.includes(vCityClean) || vCityClean.includes(a))) return true;
    for (const c of cities) {
      const cClean = c.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (aliases.some(a => cClean.includes(a) || a.includes(cClean))) return true;
      if (vCityClean && (vCityClean === cClean || cClean.includes(vCityClean) || vCityClean.includes(cClean))) return true;
    }
  }

  return false;
}

export default function WanderphiliaOperationsPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);
  const [opsToken, setOpsToken] = useState<string>('');

  // Dashboard Data State
  const [bookings, setBookings] = useState<OperationsBooking[]>([]);
  const [stats, setStats] = useState<OperationsSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hotels' | 'transport' | 'activities' | 'itinerary' | 'payments'>('hotels');

  // Zoho Master Data State
  const [masterData, setMasterData] = useState<{
    hotelsByCity: Record<string, any[]>;
    vehicles: any[];
    vendors?: any[];
    destinations: string[];
    citiesByDestination: Record<string, string[]>;
    experiencesByCity: Record<string, any[]>;
    stats?: {
      activitiesCount?: number;
      hotelsCount?: number;
      vehiclesCount?: number;
      vendorsCount?: number;
    };
  } | null>(null);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState<boolean>(false);

  // Active Booking Editing State
  const [activeBooking, setActiveBooking] = useState<OperationsBooking | null>(null);
  const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
  const [isSyncingFinance, setIsSyncingFinance] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [financeModalState, setFinanceModalState] = useState<'idle' | 'confirm' | 'celebrating' | 'error'>('idle');
  const [financeSyncError, setFinanceSyncError] = useState<string | null>(null);

  // Zoho Master Data Hotel Swap Modal State
  const [swapModalHotelIndex, setSwapModalHotelIndex] = useState<number | null>(null);
  const [swapSourceType, setSwapSourceType] = useState<'zoho' | 'custom'>('zoho');
  const [swapCity, setSwapCity] = useState<string>('');
  const [swapHotelId, setSwapHotelId] = useState<string>('');
  const [swapHotelName, setSwapHotelName] = useState<string>('');
  const [swapHotelCategory, setSwapHotelCategory] = useState<string>('');
  const [salesSelectedCategory, setSalesSelectedCategory] = useState<string>('');
  const [salesSelectedRoomCategory, setSalesSelectedRoomCategory] = useState<string>('');
  const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
  const [swapRoomCategory, setSwapRoomCategory] = useState<string>('');
  const [swapB2BCostPerNight, setSwapB2BCostPerNight] = useState<number>(0);
  const [swapExtraBedPrice, setSwapExtraBedPrice] = useState<number>(0);
  const [swapNights, setSwapNights] = useState<number>(1);
  const [swapRooms, setSwapRooms] = useState<number>(1);
  const [swapManualTotalCost, setSwapManualTotalCost] = useState<string>('');
  const [swapProofUrl, setSwapProofUrl] = useState<string>('');
  const [swapProofFileName, setSwapProofFileName] = useState<string>('');
  const [isUploadingProof, setIsUploadingProof] = useState<string | null>(null);
  const [missingProofsList, setMissingProofsList] = useState<string[]>([]);
  const [showAllVehicleStates, setShowAllVehicleStates] = useState<boolean>(false);
  const [showAllVendors, setShowAllVendors] = useState<boolean>(false);
  const [isCustomVendor, setIsCustomVendor] = useState<boolean>(false);

  // Activity modal & search state
  const [activityModalDayIdx, setActivityModalDayIdx] = useState<number | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState<string>('');

  // Check saved token on mount
  useEffect(() => {
    const savedToken =
      localStorage.getItem('wanderphilia_ops_token') ||
      sessionStorage.getItem('wanderphilia_ops_token') ||
      localStorage.getItem('wanderphilia_sales_token');
    if (savedToken) {
      setOpsToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Zoho CRM Master Data
  const fetchZohoMasterData = useCallback(async () => {
    setIsLoadingMasterData(true);
    try {
      const res = await fetch('/api/zoho/master-data');
      const data = await res.json();
      if (data && data.success) {
        setMasterData(data);
      }
    } catch (err) {
      console.error('[Operations] Failed to load Zoho Master Data:', err);
    } finally {
      setIsLoadingMasterData(false);
    }
  }, []);

  // Flatten all experiences from masterData across all cities
  const allZohoExperiences = useMemo(() => {
    if (!masterData?.experiencesByCity) return [];
    const list: any[] = [];
    Object.entries(masterData.experiencesByCity).forEach(([cityKey, exps]) => {
      if (Array.isArray(exps)) {
        exps.forEach(e => list.push({ ...e, cityKey }));
      }
    });
    return list;
  }, [masterData?.experiencesByCity]);

  // Match an experience name with Zoho CRM
  const matchZohoActivity = useCallback((name: string, city?: string) => {
    if (!name || allZohoExperiences.length === 0) return null;
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanCity = (city || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    // 1. Match name + city
    let found = allZohoExperiences.find(e => {
      const eCity = (e.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const eName = (e.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      return (!cleanCity || eCity === cleanCity || cleanCity.includes(eCity) || eCity.includes(cleanCity)) &&
        (eName === cleanName || eName.includes(cleanName) || cleanName.includes(eName));
    });

    // 2. Fallback to name only
    if (!found) {
      found = allZohoExperiences.find(e => {
        const eName = (e.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return eName === cleanName || eName.includes(cleanName) || cleanName.includes(eName);
      });
    }

    return found || null;
  }, [allZohoExperiences]);

  // Helper to resolve hotel stay dates and nights details
  const getHotelStayDetails = useCallback((hotel: any, index: number, allHotels: any[], travelStartDate?: string) => {
    let checkIn = '';
    let checkOut = '';
    const nights = Number(hotel.nights || 1);

    // Try calculating exact calendar dates from travelStartDate
    let baseDate: Date | null = null;
    if (travelStartDate) {
      if (/^\d{4}-\d{2}-\d{2}/.test(travelStartDate)) {
        baseDate = new Date(travelStartDate);
      } else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}/.test(travelStartDate)) {
        const [d, m, y] = travelStartDate.split(/[\/\-]/);
        baseDate = new Date(Number(y), Number(m) - 1, Number(d));
      }
    }

    if (baseDate && !isNaN(baseDate.getTime())) {
      let cumulativeNights = 0;
      for (let i = 0; i < index; i++) {
        cumulativeNights += Number(allHotels[i]?.nights || 1);
      }
      const inDate = new Date(baseDate);
      inDate.setDate(inDate.getDate() + cumulativeNights);
      const outDate = new Date(inDate);
      outDate.setDate(outDate.getDate() + nights);

      checkIn = inDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      checkOut = outDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } else {
      // Fallback: parse from hotel.dates or hotel.stayDates if provided
      const raw = (hotel.dates || hotel.stayDates || '').replace(/\(\d+\s*Nts?\)/gi, '').trim();
      const parts = raw.split(/\s*(?:→|->|to|–|-)\s*/);
      if (parts.length >= 2) {
        checkIn = parts[0].trim();
        checkOut = parts[1].trim();
      } else if (parts[0]) {
        checkIn = parts[0].trim();
        checkOut = `${nights}N Stay`;
      } else {
        checkIn = `Day ${index + 1}`;
        checkOut = `Day ${index + 1 + nights}`;
      }
    }

    return { checkIn, checkOut, nights, rangeStr: `${checkIn} → ${checkOut}` };
  }, []);

  // Helper to resolve hotel stay dates (backwards compatibility)
  const getHotelStayDates = useCallback((hotel: any, index: number, allHotels: any[], travelStartDate?: string) => {
    return getHotelStayDetails(hotel, index, allHotels, travelStartDate).rangeStr;
  }, [getHotelStayDetails]);

  // Calculation of extra beds required for the currently active booking
  const bookingExtraBedCalc = useMemo(() => {
    if (!activeBooking) return { billableExtraBeds: 0, childWithoutBedCount: 0 };

    let extraBedKids = 0;
    let childWithoutBedCount = 0;
    if (Array.isArray(activeBooking.childrenDetails)) {
      activeBooking.childrenDetails.forEach(c => {
        if (isExtraBed(c.bedPreference)) extraBedKids++;
        else if (isWithoutBed(c.bedPreference)) childWithoutBedCount++;
      });
    } else if (Number(activeBooking.kids) > 0) {
      extraBedKids = Number(activeBooking.kids);
    }

    const roomCalc = calculateRoomsAndBeds({
      adults: Number(activeBooking.adults) || 2,
      sharingType: activeBooking.sharingType || 'Double Sharing',
      totalKidsCount: Number(activeBooking.kids) || 0,
      initialExtraBedCount: extraBedKids,
    });

    return {
      billableExtraBeds: roomCalc.billableExtraBeds,
      childWithoutBedCount,
    };
  }, [activeBooking]);

  // Helper to resolve accurate Extra Bed Details, Child Without Bed, Per Night Price, and B2B costs per hotel
  const getHotelExtraBedDetails = useCallback((hotel: OperationsHotelItem) => {
    // 1. Extra bed count
    let count = typeof hotel.extraBedCount === 'number' ? hotel.extraBedCount : undefined;
    if (count === undefined && activeBooking) {
      count = bookingExtraBedCalc.billableExtraBeds;
    }
    count = count || 0;

    // 2. Extra bed rate per night
    let rate = typeof hotel.extraBedPrice === 'number' && hotel.extraBedPrice > 0 ? hotel.extraBedPrice : 0;

    // 3. Child without bed count
    let childCount = typeof hotel.childWithoutBedCount === 'number' ? hotel.childWithoutBedCount : undefined;
    if (childCount === undefined && activeBooking) {
      childCount = bookingExtraBedCalc.childWithoutBedCount;
    }
    childCount = childCount || 0;

    // 4. Child without bed rate per night
    let childRate = typeof hotel.childWithoutBedPrice === 'number' && hotel.childWithoutBedPrice > 0 ? hotel.childWithoutBedPrice : 0;

    // 5. Look up Zoho CRM master data if any rate is missing
    let pricePerNight = typeof hotel.pricePerNight === 'number' && hotel.pricePerNight > 0 ? hotel.pricePerNight : 0;

    if (masterData?.hotelsByCity) {
      const cityKey = normalizeCityKey(hotel.city);
      const cityHotels = masterData.hotelsByCity[cityKey] || [];
      const matchedH = cityHotels.find(h =>
        (hotel.hotelId && String(h.id) === String(hotel.hotelId)) ||
        (hotel.hotelName && h.hotelName.toLowerCase().trim() === hotel.hotelName.toLowerCase().trim())
      );
      if (matchedH?.rooms) {
        const roomMatch = matchedH.rooms.find((r: any) =>
          r.roomCategory.toLowerCase().trim() === (hotel.roomCategory || '').toLowerCase().trim()
        ) || matchedH.rooms[0];
        if (roomMatch) {
          if (roomMatch.pricePerNight && Number(roomMatch.pricePerNight) > 0) {
            pricePerNight = Number(roomMatch.pricePerNight);
          }
          if (rate === 0 && count > 0 && roomMatch.extraBedPrice) {
            rate = Number(roomMatch.extraBedPrice) || 0;
          }
          if (childRate === 0 && childCount > 0 && (roomMatch.childWithoutBed || roomMatch.childWithoutBedPrice)) {
            childRate = Number(roomMatch.childWithoutBed || roomMatch.childWithoutBedPrice) || 0;
          }
        }
      }
    }

    if (pricePerNight === 0) {
      pricePerNight = Number(hotel.b2bCostPerNight || hotel.basePrice || 0);
    }
    if (rate === 0 && count > 0) {
      rate = 1200;
    }

    const nights = Number(hotel.nights) || 1;
    const rooms = Number(hotel.roomsCount || activeBooking?.roomsCount || 1);

    const hotelRoomTotal = pricePerNight * nights * rooms;
    const extraBedTotal = typeof hotel.extraBedTotalCost === 'number' && hotel.extraBedTotalCost > 0
      ? hotel.extraBedTotalCost
      : (rate * count * nights);

    const childNoBedTotal = typeof hotel.childWithoutBedTotalCost === 'number' && hotel.childWithoutBedTotalCost > 0
      ? hotel.childWithoutBedTotalCost
      : (childRate * childCount * nights);

    const calculatedB2BTotal = hotelRoomTotal + extraBedTotal + childNoBedTotal;

    const b2bTotal = hotel.isManualCost && typeof hotel.b2bTotalCost === 'number' && hotel.b2bTotalCost > 0
      ? hotel.b2bTotalCost
      : calculatedB2BTotal;

    return {
      count,
      rate,
      extraBedTotal,
      childCount,
      childRate,
      childNoBedTotal,
      pricePerNight,
      hotelRoomTotal,
      calculatedB2BTotal,
      b2bTotal,
      nights,
      rooms,
    };
  }, [activeBooking, bookingExtraBedCalc, masterData?.hotelsByCity]);

  // Fetch bookings when authenticated
  const fetchBookings = useCallback(
    async (tokenToUse?: string) => {
      const token = tokenToUse || opsToken;
      if (!token) return;

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/operations/bookings?status=${selectedStatusFilter}&search=${encodeURIComponent(searchQuery)}`,
          {
            headers: {
              'x-operations-token': token,
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings || []);
          setStats(data.stats || null);
          if (!activeBookingId && data.bookings?.length > 0) {
            setActiveBookingId(data.bookings[0].id);
            setActiveBooking(data.bookings[0]);
          } else if (activeBookingId) {
            const match = data.bookings?.find((b: OperationsBooking) => b.id === activeBookingId);
            if (match) setActiveBooking(match);
          }
        } else if (res.status === 401) {
          setIsAuthenticated(false);
          localStorage.removeItem('wanderphilia_ops_token');
        }
      } catch (err) {
        console.error('Failed to load operations bookings:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [opsToken, selectedStatusFilter, searchQuery, activeBookingId]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchZohoMasterData();
    }
  }, [isAuthenticated, fetchBookings, fetchZohoMasterData]);

  // Handle PIN verification
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsVerifyingPin(true);
    setPinError(null);

    try {
      const res = await fetch('/api/operations/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput.trim(), portal: 'operations' })
      });
      const data = await res.json();

      if (data.success && data.token) {
        setOpsToken(data.token);
        localStorage.setItem('wanderphilia_ops_token', data.token);
        setIsAuthenticated(true);
        setPinInput('');
        fetchBookings(data.token);
        fetchZohoMasterData();
      } else {
        setPinError(data.error || 'Invalid passcode. Access denied.');
      }
    } catch (err) {
      setPinError('Connection error. Please try again.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderphilia_ops_token');
    sessionStorage.removeItem('wanderphilia_ops_token');
    setIsAuthenticated(false);
    setOpsToken('');
    setActiveBooking(null);
  };

  const handleSelectBooking = (booking: OperationsBooking) => {
    setActiveBookingId(booking.id);
    setActiveBooking(booking);
    setSaveSuccessMessage(null);
  };

  // Experiences Breakdown: Company Paid (Wanderphilia) vs Vendor Paid (Transport Vendor)
  const experiencesBreakdown = useMemo(() => {
    let wanderphiliaTotal = 0;
    const wanderphiliaList: string[] = [];
    let vendorTotal = 0;
    const vendorList: string[] = [];
    const pax = activeBooking?.numberOfGuests || activeBooking?.adults || 2;

    (activeBooking?.dayActivities || []).forEach(day => {
      const dayCity = day.city || day.fromCity || activeBooking?.destination;
      const expsToScan = (Array.isArray(day.experiences) && day.experiences.some((e: any) => typeof e === 'object' || (typeof e === 'string' && e.trim())))
        ? day.experiences
        : (day.title ? [day.title] : []);

      expsToScan.forEach((exp: any) => {
        const expName = typeof exp === 'string' ? exp : (exp.name || exp.title || '');
        if (!expName || !expName.trim()) return;

        let cost = 0;
        if (typeof exp === 'object' && exp.cost !== undefined && exp.cost !== null) {
          cost = Number(exp.cost) || 0;
        } else {
          const m = matchZohoActivity(expName, dayCity);
          if (m) {
            cost = m.privateCost > 0 ? m.privateCost : ((m.ppCost || 0) * pax);
          }
        }

        const paidBy = (typeof exp === 'object' && exp.paidBy) ? exp.paidBy : 'wanderphilia';

        // Only include in costed lists if cost > 0
        if (cost > 0) {
          const formattedLine = `${expName.trim()} (₹${cost.toLocaleString('en-IN')})`;
          if (paidBy === 'vendor') {
            vendorTotal += cost;
            vendorList.push(formattedLine);
          } else {
            wanderphiliaTotal += cost;
            wanderphiliaList.push(formattedLine);
          }
        }
      });
    });

    return {
      wanderphiliaTotal,
      wanderphiliaListText: wanderphiliaList.join('\n'),
      wanderphiliaCount: wanderphiliaList.length,
      vendorTotal,
      vendorListText: vendorList.join('\n'),
      vendorCount: vendorList.length,
      totalAll: wanderphiliaTotal + vendorTotal,
    };
  }, [activeBooking?.dayActivities, activeBooking?.numberOfGuests, activeBooking?.adults, activeBooking?.destination, matchZohoActivity]);

  // Compute live profit margins, client pre-tax costs and category comparisons
  const liveMargins = useMemo(() => {
    if (!activeBooking) {
      return {
        sellingPrice: 0,
        sellingWithoutTaxes: 0,
        gstAmount: 0,
        b2bHotelTotal: 0,
        b2bTransportTotal: 0,
        b2bGrandTotal: 0,
        clientHotelTotal: 0,
        clientTransportTotal: 0,
        hotelDiff: 0,
        transportDiff: 0,
        profit: 0,
        marginPct: 0,
        marginOnBasePct: 0,
      };
    }

    const sellingPrice = Number(activeBooking.totalQuotationAmount || 0);
    // Base amount without 5% GST
    const sellingWithoutTaxes = (activeBooking as any).baseAmount || (activeBooking as any).baseQuotationAmount || Math.round(sellingPrice / 1.05);
    const gstAmount = Math.max(0, sellingPrice - sellingWithoutTaxes);

    const b2bHotelTotal = (activeBooking.hotels || []).reduce(
      (sum, h) => {
        const extra = getHotelExtraBedDetails(h);
        return sum + (h.isManualCost && typeof h.b2bTotalCost === 'number' && h.b2bTotalCost > 0 ? h.b2bTotalCost : extra.b2bTotal);
      },
      0
    );
    const b2bTransportTotal = Number(activeBooking.transport?.b2bTotalCost || 0);
    const b2bGrandTotal = b2bHotelTotal + b2bTransportTotal;
    const profit = sellingPrice - b2bGrandTotal;
    const marginPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;
    const marginOnBasePct = sellingWithoutTaxes > 0 ? Math.round(((sellingWithoutTaxes - b2bGrandTotal) / sellingWithoutTaxes) * 100) : marginPct;

    // Transport Client Quoted Cost (Fixed rate quoted to client, independent of B2B vendor negotiations)
    const transportDays = Number(activeBooking.transport?.totalDays || activeBooking.noOfDays || 1);
    let clientTransportTotal = 0;
    if (activeBooking.transport?.clientQuotationCost && Number(activeBooking.transport.clientQuotationCost) > 0) {
      clientTransportTotal = Number(activeBooking.transport.clientQuotationCost);
    } else if ((activeBooking as any).clientTransportTotal && Number((activeBooking as any).clientTransportTotal) > 0) {
      clientTransportTotal = Number((activeBooking as any).clientTransportTotal);
    } else if ((activeBooking as any).quotedTransportAmount && Number((activeBooking as any).quotedTransportAmount) > 0) {
      clientTransportTotal = Number((activeBooking as any).quotedTransportAmount);
    } else {
      // 1. Try extracting rate from vehicle type label, e.g. "Seden (1-3 Pax) - ₹4000/day"
      const vType = String(activeBooking.transport?.vehicleType || (activeBooking as any).vehicleType || '');
      const rateMatch = vType.match(/₹\s*(\d+)/);
      let vehicleDailyRate = rateMatch ? Number(rateMatch[1]) : 0;

      // 2. Try looking up in masterData vehicles
      if (vehicleDailyRate === 0 && masterData?.vehicles) {
        const vClean = vType.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchedV = masterData.vehicles.find((v: any) => {
          const mClean = (v.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          return mClean === vClean || vClean.includes(mClean) || mClean.includes(vClean);
        });
        if (matchedV?.cost) {
          vehicleDailyRate = Number(matchedV.cost) || 0;
        }
      }

      // 3. Fallback based on vehicle category
      if (vehicleDailyRate === 0) {
        const vLower = vType.toLowerCase();
        if (vLower.includes('sedan') || vLower.includes('seden') || vLower.includes('dzire') || vLower.includes('etios')) {
          vehicleDailyRate = 4000;
        } else if (vLower.includes('ertiga') || vLower.includes('rumion')) {
          vehicleDailyRate = 4500;
        } else if (vLower.includes('crysta')) {
          vehicleDailyRate = 6500;
        } else if (vLower.includes('innova')) {
          vehicleDailyRate = 5500;
        } else if (vLower.includes('tempo') || vLower.includes('traveller')) {
          vehicleDailyRate = 7500;
        } else {
          vehicleDailyRate = 4000;
        }
      }

      clientTransportTotal = vehicleDailyRate * transportDays;
    }
    const transportDiff = clientTransportTotal - b2bTransportTotal;

    // Hotels Client Quoted Cost
    let clientHotelTotal = 0;
    (activeBooking.hotels || []).forEach(h => {
      const extra = getHotelExtraBedDetails(h);
      const nights = Number(h.nights || 1);
      const rooms = Number(h.roomsCount || activeBooking.roomsCount || 1);

      if (h.clientQuotationCost && Number(h.clientQuotationCost) > 0) {
        clientHotelTotal += Number(h.clientQuotationCost);
      } else if (h.basePrice && Number(h.basePrice) > 0) {
        const clientCost = (Number(h.basePrice) * nights * rooms) + extra.extraBedTotal + extra.childNoBedTotal;
        clientHotelTotal += clientCost;
      } else {
        const b2bCost = h.isManualCost && typeof h.b2bTotalCost === 'number' && h.b2bTotalCost > 0
          ? h.b2bTotalCost
          : extra.b2bTotal;
        clientHotelTotal += b2bCost;
      }
    });

    if (clientHotelTotal <= 0 && (activeBooking as any).clientHotelsTotal && Number((activeBooking as any).clientHotelsTotal) > 0) {
      clientHotelTotal = Number((activeBooking as any).clientHotelsTotal);
    }
    if (clientHotelTotal <= 0) {
      clientHotelTotal = b2bHotelTotal;
    }
    const hotelDiff = clientHotelTotal - b2bHotelTotal;

    return {
      sellingPrice,
      sellingWithoutTaxes,
      gstAmount,
      b2bHotelTotal,
      b2bTransportTotal,
      b2bGrandTotal,
      clientHotelTotal,
      clientTransportTotal,
      hotelDiff,
      transportDiff,
      profit,
      marginPct,
      marginOnBasePct,
    };
  }, [activeBooking, getHotelExtraBedDetails, experiencesBreakdown]);

  // Compute if all hotels are booked
  const allHotelsConfirmed = useMemo(() => {
    if (!activeBooking?.hotels || activeBooking.hotels.length === 0) return false;
    return activeBooking.hotels.every(h => h.status === 'confirmed');
  }, [activeBooking?.hotels]);

  // Save changes to backend
  const handleSaveChanges = async () => {
    if (!activeBooking) return;
    setIsSavingChanges(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    try {
      const syncedHotels = (activeBooking.hotels || []).map(h => {
        const extra = getHotelExtraBedDetails(h);
        return {
          ...h,
          pricePerNight: extra.pricePerNight,
          b2bCostPerNight: extra.pricePerNight,
          extraBedPrice: extra.rate,
          extraBedCount: extra.count,
          extraBedTotalCost: extra.extraBedTotal,
          childWithoutBedPrice: extra.childRate,
          childWithoutBedCount: extra.childCount,
          childWithoutBedTotalCost: extra.childNoBedTotal,
          b2bTotalCost: h.isManualCost && typeof h.b2bTotalCost === 'number' && h.b2bTotalCost > 0 ? h.b2bTotalCost : extra.b2bTotal,
        };
      });

      const updatedData: Partial<OperationsBooking> = {
        ...activeBooking,
        hotels: syncedHotels,
        totalB2BHotelCost: liveMargins.b2bHotelTotal,
        totalB2BTransportCost: liveMargins.b2bTransportTotal,
        totalB2BCost: liveMargins.b2bGrandTotal,
        grossMarginAmount: liveMargins.profit,
        grossMarginPercentage: liveMargins.marginPct,
        isAllHotelsBooked: allHotelsConfirmed,
        updatedAt: new Date().toISOString()
      };

      const res = await fetch(`/api/operations/bookings/${activeBooking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-operations-token': opsToken,
          Authorization: `Bearer ${opsToken}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setActiveBooking(data.booking);
        setBookings(prev => prev.map(b => (b.id === data.booking.id ? data.booking : b)));
        setSaveSuccessMessage('Operations changes saved successfully!');
        setTimeout(() => setSaveSuccessMessage(null), 3500);
      } else {
        setSaveErrorMessage(data.error || 'Failed to save changes.');
        setTimeout(() => setSaveErrorMessage(null), 4000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveErrorMessage('Error connecting to operations server.');
      setTimeout(() => setSaveErrorMessage(null), 4000);
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Push to Zoho CRM Finance Module (Celebration Themed Flow)
  const handleInitiateSyncFinance = () => {
    if (!activeBooking) return;

    // Compulsory proof verification for manual cost overrides
    const missing: string[] = [];
    (activeBooking.hotels || []).forEach((h, idx) => {
      if (h.isManualCost && !h.proofUrl) {
        missing.push(`Hotel: ${h.hotelName || h.city || `Hotel #${idx + 1}`}`);
      }
    });
    if (activeBooking.transport?.isManualCost && !activeBooking.transport.proofUrl) {
      missing.push(`Transport: ${activeBooking.transport.vehicleType || 'Vehicle'}`);
    }
    (activeBooking.dayActivities || []).forEach((day: any, dIdx: number) => {
      (day.experiences || []).forEach((exp: any) => {
        const cost = typeof exp === 'object' ? Number(exp.cost || 0) : 0;
        const isManual = typeof exp === 'object' && Boolean(exp.isManualCost);
        const hasProof = typeof exp === 'object' && Boolean(exp.proofUrl);
        if (isManual && cost > 0 && !hasProof) {
          const name = typeof exp === 'object' ? (exp.name || exp.title || 'Experience') : String(exp);
          missing.push(`Experience (Day ${day.dayNumber || dIdx + 1}): ${name}`);
        }
      });
    });

    if (missing.length > 0) {
      setMissingProofsList(missing);
      return;
    }

    setMissingProofsList([]);
    setFinanceSyncError(null);
    setFinanceModalState('confirm');
  };

  const handleConfirmSyncFinance = async () => {
    if (!activeBooking) return;
    setIsSyncingFinance(true);
    setFinanceSyncError(null);

    try {
      const res = await fetch('/api/operations/sync-finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-operations-token': opsToken,
          Authorization: `Bearer ${opsToken}`
        },
        body: JSON.stringify({
          bookingId: activeBooking.id,
          zohoDealId: activeBooking.bookingId,
          inquiryId: activeBooking.inquiryId,
          customerName: activeBooking.customerName,
          sellingPrice: activeBooking.totalQuotationAmount,
          advancePaid: activeBooking.advanceAmountPaid,
          balanceDue: activeBooking.balancePendingAmount,
          hotelCost: liveMargins.b2bHotelTotal,
          transportCost: liveMargins.b2bTransportTotal,
          totalB2BCost: liveMargins.b2bGrandTotal,
          profitMargin: liveMargins.profit,
          profitMarginPct: liveMargins.marginPct,
          utrNumber: activeBooking.utrNumber,
          hotels: activeBooking.hotels,
          transport: activeBooking.transport,
          dayActivities: activeBooking.dayActivities,
          experiencesTotalCost: experiencesBreakdown.wanderphiliaTotal,
          experiencesListWithCost: experiencesBreakdown.wanderphiliaListText,
          extraAmountPaidByTransportVendor: experiencesBreakdown.vendorTotal,
          extraAmountDetails: experiencesBreakdown.vendorListText,
        })
      });

      const data = await res.json();
      if (data.success) {
        setFinanceModalState('celebrating');
        setActiveBooking(prev =>
          prev
            ? {
              ...prev,
              opsStatus: 'synced_to_finance',
              isSyncToFinance: true,
              syncedToFinanceAt: new Date().toISOString()
            }
            : null
        );
        fetchBookings();
      } else {
        setFinanceSyncError(data.error || 'Could not complete Zoho CRM Finance push.');
        setFinanceModalState('error');
      }
    } catch (err: any) {
      console.error('Finance sync error:', err);
      setFinanceSyncError(err?.message || 'Network error communicating with Zoho Finance API.');
      setFinanceModalState('error');
    } finally {
      setIsSyncingFinance(false);
    }
  };

  // Open Swap Modal for a hotel
  const handleOpenSwapModal = (hotelIndex: number) => {
    if (!activeBooking || !activeBooking.hotels[hotelIndex]) return;
    const targetHotel = activeBooking.hotels[hotelIndex];

    const initialCat = targetHotel.category || activeBooking.hotelCategory || 'Deluxe';
    const initialRoomCat = targetHotel.roomCategory || activeBooking.roomCategory || 'Standard Room';

    setSwapModalHotelIndex(hotelIndex);
    setSwapCity(targetHotel.city || '');
    setSwapHotelCategory(initialCat);
    setSalesSelectedCategory(initialCat);
    setSalesSelectedRoomCategory(initialRoomCat);
    setShowAllCategories(false);

    setSwapHotelName(targetHotel.hotelName || '');
    setSwapHotelId(targetHotel.hotelId || '');
    setSwapRoomCategory(initialRoomCat);

    const extraBedDetails = getHotelExtraBedDetails(targetHotel);
    setSwapB2BCostPerNight(extraBedDetails.pricePerNight || 0);
    setSwapExtraBedPrice(targetHotel.extraBedPrice !== undefined && targetHotel.extraBedPrice > 0 ? targetHotel.extraBedPrice : extraBedDetails.rate);
    setSwapNights(targetHotel.nights || 1);
    setSwapRooms(targetHotel.roomsCount || activeBooking.roomsCount || 1);
    setSwapManualTotalCost(String(targetHotel.b2bTotalCost || ''));
    setSwapProofUrl(targetHotel.proofUrl || '');
    setSwapProofFileName(targetHotel.proofFileName || '');

    // Check if city exists in Zoho master data
    const cityKey = normalizeCityKey(targetHotel.city);
    const cityHotels = masterData?.hotelsByCity?.[cityKey] || [];
    setSwapSourceType(cityHotels.length > 0 ? 'zoho' : 'custom');

    // Auto-match existing hotel in Zoho by ID or name
    if (cityHotels.length > 0) {
      const match = cityHotels.find(h =>
        (targetHotel.hotelId && String(h.id) === String(targetHotel.hotelId)) ||
        (targetHotel.hotelName && h.hotelName.toLowerCase().trim() === targetHotel.hotelName.toLowerCase().trim())
      );
      if (match) {
        setSwapHotelId(String(match.id));
        if (match.category) setSwapHotelCategory(match.category);
        if (match.rooms && match.rooms.length > 0) {
          const roomMatch = match.rooms.find((r: any) =>
            r.roomCategory.toLowerCase().trim() === initialRoomCat.toLowerCase().trim()
          ) || match.rooms[0];
          setSwapRoomCategory(roomMatch.roomCategory);
          const resolvedB2BPrice = Number(roomMatch.pricePerNight || roomMatch.basePrice || 0);
          setSwapB2BCostPerNight(resolvedB2BPrice);
          if (roomMatch.extraBedPrice !== undefined) {
            setSwapExtraBedPrice(Number(roomMatch.extraBedPrice) || 0);
          }
        }
      }
    }
  };

  // All Zoho hotels for the currently selected city
  const allZohoHotelsInCity = useMemo(() => {
    if (!masterData?.hotelsByCity || !swapCity) return [];
    const cityKey = normalizeCityKey(swapCity);
    return masterData.hotelsByCity[cityKey] || [];
  }, [masterData, swapCity]);

  // Unique categories available in this city (Only real categories from Zoho CRM, no stars)
  const availableCategoriesInCity = useMemo(() => {
    const cats = new Set<string>();
    allZohoHotelsInCity.forEach(h => {
      const cat = (h.category || '').trim();
      if (cat && !cat.toLowerCase().includes('star') && !cat.includes('★')) {
        cats.add(cat);
      }
    });
    return Array.from(cats);
  }, [allZohoHotelsInCity]);

  // Filtered hotels strictly based on the sales selected category or active category filter
  const availableZohoHotelsForCity = useMemo(() => {
    if (showAllCategories || !swapHotelCategory) {
      return allZohoHotelsInCity;
    }
    const cleanCat = swapHotelCategory.toLowerCase().trim();
    const matched = allZohoHotelsInCity.filter(h => {
      const hCat = (h.category || '').toLowerCase().trim();
      return hCat === cleanCat || hCat.includes(cleanCat) || cleanCat.includes(hCat);
    });
    return matched.length > 0 ? matched : allZohoHotelsInCity;
  }, [allZohoHotelsInCity, swapHotelCategory, showAllCategories]);

  // Selected Zoho hotel object
  const selectedZohoHotelObj = useMemo(() => {
    if (!swapHotelId) {
      if (swapHotelName) {
        return allZohoHotelsInCity.find(h => h.hotelName.toLowerCase().trim() === swapHotelName.toLowerCase().trim()) || null;
      }
      return null;
    }
    return allZohoHotelsInCity.find(h => String(h.id) === String(swapHotelId)) || null;
  }, [allZohoHotelsInCity, swapHotelId, swapHotelName]);

  // Available room categories for selected Zoho hotel
  const availableRoomsForSelectedHotel: any[] = useMemo(() => {
    if (!selectedZohoHotelObj?.rooms || !Array.isArray(selectedZohoHotelObj.rooms)) return [];
    return selectedZohoHotelObj.rooms;
  }, [selectedZohoHotelObj]);

  // Handle hotel selection from Zoho dropdown
  const handleSelectZohoHotel = (hId: string) => {
    setSwapHotelId(hId);
    const found = allZohoHotelsInCity.find(h => String(h.id) === String(hId));
    if (found) {
      setSwapHotelName(found.hotelName);
      if (found.category) {
        setSwapHotelCategory(found.category);
      }
      if (found.rooms && found.rooms.length > 0) {
        // Match sales selected room category if available
        const matchingRoom = found.rooms.find((r: any) =>
          r.roomCategory.toLowerCase().trim() === salesSelectedRoomCategory.toLowerCase().trim()
        );
        const chosenRoom = matchingRoom || found.rooms[0];
        setSwapRoomCategory(chosenRoom.roomCategory);
        setSwapB2BCostPerNight(chosenRoom.pricePerNight || chosenRoom.basePrice || 0);
      } else {
        setSwapRoomCategory(salesSelectedRoomCategory || 'Standard Room');
        setSwapB2BCostPerNight(found.pricePerNight || found.basePrice || 0);
      }
    }
  };

  // Handle room category selection from Zoho hotel
  const handleSelectZohoRoomCategory = (roomCatName: string) => {
    setSwapRoomCategory(roomCatName);
    const roomMatch = availableRoomsForSelectedHotel.find((r: any) => r.roomCategory === roomCatName);
    if (roomMatch) {
      const perNight = Number(roomMatch.pricePerNight || roomMatch.basePrice || 0);
      setSwapB2BCostPerNight(perNight);
      if (roomMatch.extraBedPrice !== undefined) {
        setSwapExtraBedPrice(Number(roomMatch.extraBedPrice) || 0);
      }
    }
  };

  // Filtered vehicles strictly based on activeBooking destination & state
  const availableVehiclesForBooking = useMemo(() => {
    if (!masterData?.vehicles || masterData.vehicles.length === 0) return [];
    if (showAllVehicleStates || !activeBooking) return masterData.vehicles;

    const dest = activeBooking.destination || '';
    const hotelCities = (activeBooking.hotels || []).map(h => h.city).filter(Boolean);

    const filtered = masterData.vehicles.filter(v =>
      matchVehicleState(v.state, dest, hotelCities)
    );

    return filtered.length > 0 ? filtered : masterData.vehicles;
  }, [masterData?.vehicles, activeBooking, showAllVehicleStates]);

  // Filtered vendors strictly based on activeBooking destination & state
  const availableVendorsForBooking = useMemo(() => {
    if (!masterData?.vendors || masterData.vendors.length === 0) return [];
    if (showAllVendors || !activeBooking) return masterData.vendors;

    const dest = activeBooking.destination || '';
    const hotelCities = (activeBooking.hotels || []).map(h => h.city).filter(Boolean);

    const filtered = masterData.vendors.filter(v =>
      matchVendorState(v.state, v.city, dest, hotelCities)
    );

    return filtered.length > 0 ? filtered : masterData.vendors;
  }, [masterData?.vendors, activeBooking, showAllVendors]);

  // Auto-select transport from itinerary option and auto-calculate B2B cost
  useEffect(() => {
    if (!activeBooking || !masterData?.vehicles || masterData.vehicles.length === 0) return;

    const currentVehType = (activeBooking.transport?.vehicleType || '').trim();
    const currentCost = Number(activeBooking.transport?.b2bTotalCost || 0);
    const days = Number(activeBooking.noOfDays || 1);

    // Try matching vehicle from masterData
    const matchVeh = masterData.vehicles.find(v => {
      const vClean = v.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const curClean = currentVehType.toLowerCase().replace(/[^a-z0-9]/g, '');
      return vClean === curClean || curClean.includes(vClean) || vClean.includes(curClean);
    }) || availableVehiclesForBooking[0] || masterData.vehicles[0];

    const needsTypeUpdate = !currentVehType || currentVehType === 'Dedicated Private Cab';
    const needsCostUpdate = currentCost === 0 && matchVeh && matchVeh.cost > 0 && !activeBooking.transport?.isManualCost;

    if (needsTypeUpdate || needsCostUpdate) {
      const targetVehName = (matchVeh && (needsTypeUpdate || !currentVehType)) ? matchVeh.name : currentVehType;
      const targetCost = needsCostUpdate ? (matchVeh.cost * days) : currentCost;

      if (activeBooking.transport?.vehicleType === targetVehName && activeBooking.transport?.b2bTotalCost === targetCost) {
        return;
      }

      setActiveBooking(prev => {
        if (!prev) return null;
        return {
          ...prev,
          transport: {
            ...prev.transport,
            vehicleType: targetVehName,
            b2bTotalCost: targetCost,
            totalDays: days,
            costPerDay: matchVeh?.cost || prev.transport?.costPerDay || 0
          }
        };
      });
    }
  }, [activeBookingId, masterData?.vehicles, availableVehiclesForBooking]);

  // Apply Hotel Swap
  const handleApplyHotelSwap = () => {
    if (!activeBooking || swapModalHotelIndex === null) return;

    let computedTotalCost = 0;
    let finalHotelName = swapHotelName.trim();
    let finalRoomCategory = swapRoomCategory.trim();
    let finalB2BCostPerNight = swapB2BCostPerNight;
    let isManual = false;

    const updatedHotels = [...activeBooking.hotels];
    const prev = updatedHotels[swapModalHotelIndex];
    const extraBedInfo = getHotelExtraBedDetails(prev);
    const extraBeds = prev.extraBedCount !== undefined ? prev.extraBedCount : extraBedInfo.count;
    const extraBedTotal = swapExtraBedPrice * extraBeds * swapNights;

    if (swapSourceType === 'zoho') {
      computedTotalCost = (swapB2BCostPerNight * swapNights * swapRooms) + extraBedTotal;
      isManual = false;
    } else {
      computedTotalCost = Number(swapManualTotalCost) || 0;
      finalB2BCostPerNight = swapNights > 0 ? Math.round(computedTotalCost / swapNights) : computedTotalCost;
      isManual = true;
      if (computedTotalCost > 0 && !swapProofUrl) {
        alert('⚠️ Mandatory Proof Required: Please upload a rate proof screenshot when entering a custom hotel cost.');
        return;
      }
    }

    updatedHotels[swapModalHotelIndex] = {
      ...prev,
      city: swapCity || prev.city,
      hotelName: finalHotelName || prev.hotelName,
      hotelId: swapSourceType === 'zoho' && swapHotelId ? swapHotelId : prev.hotelId,
      category: swapHotelCategory || selectedZohoHotelObj?.category || prev.category || activeBooking.hotelCategory || 'Deluxe',
      roomCategory: finalRoomCategory || prev.roomCategory,
      nights: swapNights,
      roomsCount: swapRooms,
      basePrice: prev.basePrice || swapB2BCostPerNight,
      pricePerNight: swapB2BCostPerNight,
      b2bCostPerNight: swapB2BCostPerNight,
      extraBedPrice: swapExtraBedPrice,
      extraBedCount: extraBeds,
      extraBedTotalCost: extraBedTotal,
      b2bTotalCost: computedTotalCost,
      isManualCost: isManual,
      proofUrl: swapProofUrl || prev.proofUrl || '',
      proofFileName: swapProofFileName || prev.proofFileName || '',
      status: 'confirmed'
    };

    setActiveBooking({
      ...activeBooking,
      hotels: updatedHotels
    });

    setSwapModalHotelIndex(null);
  };

  // Generate WhatsApp driver duty slip
  const generateDriverDutySlip = () => {
    if (!activeBooking) return '';
    const t = activeBooking.transport;
    return `*🚗 WANDERPHILIA CHAUFFEUR DUTY SLIP*\n` +
      `--------------------------------------\n` +
      `*Guest Name:* ${activeBooking.customerName}\n` +
      `*Destination:* ${activeBooking.destination}\n` +
      `*Travel Dates:* ${activeBooking.travelStartDate} to ${activeBooking.travelEndDate} (${activeBooking.duration})\n` +
      `*Guests:* ${activeBooking.adults} Adults, ${activeBooking.kids} Kids (${activeBooking.numberOfGuests} Total)\n` +
      `*Vehicle Assigned:* ${t?.vehicleType || 'Dedicated Cab'}\n` +
      `*Vehicle Number:* ${t?.vehicleNumber || 'TBA'}\n` +
      `*Chauffeur Name:* ${t?.driverName || 'TBA'}\n` +
      `*Chauffeur Contact:* ${t?.driverMobile || 'TBA'}\n` +
      `*Pickup / Notes:* ${t?.notes || 'Direct pickup as per flight / train arrival.'}\n` +
      `--------------------------------------\n` +
      `Have a safe journey with Wanderphilia! 🌟`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Activity / Experience operations handlers
  const getCleanExperienceObject = (day: any, exps: any[], expIdx: number) => {
    const raw = exps[expIdx];
    if (typeof raw === 'string' && raw.trim()) {
      return { name: raw.trim(), status: 'requested', paidBy: 'wanderphilia' as const };
    }
    if (raw && typeof raw === 'object') {
      return {
        ...raw,
        name: raw.name || raw.title || day.title || 'Experience',
        status: raw.status || 'requested',
        paidBy: (raw.paidBy === 'vendor' ? 'vendor' : 'wanderphilia') as 'wanderphilia' | 'vendor'
      };
    }
    return {
      name: day.title || day.description || 'Day Activity',
      status: 'requested',
      paidBy: 'wanderphilia' as const
    };
  };

  const handleUpdateExperienceStatus = (dayIdx: number, expIdx: number, status: string) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const target = getCleanExperienceObject(day, exps, expIdx);
    target.status = status;
    exps[expIdx] = target;
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleUpdateExperienceVoucher = (dayIdx: number, expIdx: number, voucherNumber: string) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const target = getCleanExperienceObject(day, exps, expIdx);
    target.confirmationNumber = voucherNumber;
    exps[expIdx] = target;
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleUpdateExperienceCost = (dayIdx: number, expIdx: number, cost: number) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const target = getCleanExperienceObject(day, exps, expIdx);
    target.cost = cost;
    target.isManualCost = true;
    exps[expIdx] = target;
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleUpdateExperiencePayer = (dayIdx: number, expIdx: number, paidBy: 'wanderphilia' | 'vendor') => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const target = getCleanExperienceObject(day, exps, expIdx);
    target.paidBy = paidBy;
    exps[expIdx] = target;
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleRemoveExperience = (dayIdx: number, expIdx: number) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    if (exps.length > expIdx) {
      exps.splice(expIdx, 1);
    } else {
      day.title = '';
    }
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleProofFileUpload = async (
    file: File,
    targetKey: string,
    onUploaded: (url: string, fileName: string) => void
  ) => {
    if (!file) return;
    setIsUploadingProof(targetKey);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        onUploaded(data.url, file.name);
      } else {
        alert(data.error || 'Failed to upload proof screenshot');
      }
    } catch (err) {
      alert('Upload failed. Please check network connection.');
    } finally {
      setIsUploadingProof(null);
    }
  };

  const handleUpdateHotelProof = (hotelIdx: number, proofUrl: string, proofFileName: string) => {
    if (!activeBooking) return;
    const updated = activeBooking.hotels.map((h, i) =>
      i === hotelIdx ? { ...h, proofUrl, proofFileName } : h
    );
    setActiveBooking({ ...activeBooking, hotels: updated });
  };

  const handleUpdateTransportProof = (proofUrl: string, proofFileName: string) => {
    if (!activeBooking) return;
    setActiveBooking({
      ...activeBooking,
      transport: {
        ...activeBooking.transport,
        proofUrl,
        proofFileName
      }
    });
  };

  const handleUpdateExperienceProof = (
    dayIdx: number,
    expIdx: number,
    proofUrl: string,
    proofFileName: string
  ) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...dayActivities[dayIdx] };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const target = getCleanExperienceObject(day, exps, expIdx);
    target.proofUrl = proofUrl;
    target.proofFileName = proofFileName;
    exps[expIdx] = target;
    day.experiences = exps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
  };

  const handleAddZohoExperienceToDay = (dayIdx: number, zohoExp: any) => {
    if (!activeBooking) return;
    const dayActivities = [...(activeBooking.dayActivities || [])];
    const day = { ...(dayActivities[dayIdx] || { dayNumber: dayIdx + 1, experiences: [] }) };
    const exps = Array.isArray(day.experiences) ? [...day.experiences] : [];
    const pax = activeBooking.numberOfGuests || activeBooking.adults || 2;
    const cost = zohoExp.privateCost && zohoExp.privateCost > 0
      ? zohoExp.privateCost
      : (zohoExp.ppCost || 0) * pax;

    // Filter out empty strings if any
    const validExps = exps.filter(e => typeof e === 'object' || (typeof e === 'string' && e.trim()));

    validExps.push({
      name: zohoExp.name,
      id: zohoExp.id,
      city: zohoExp.city,
      category: zohoExp.category,
      timing: zohoExp.timing,
      openingTime: zohoExp.openingTime,
      closingTime: zohoExp.closingTime,
      ppCost: zohoExp.ppCost,
      privateCost: zohoExp.privateCost,
      cost: cost,
      status: 'requested',
      paidBy: 'wanderphilia',
      confirmationNumber: '',
    });
    day.experiences = validExps;
    dayActivities[dayIdx] = day;
    setActiveBooking({ ...activeBooking, dayActivities });
    setActivityModalDayIdx(null);
  };

  // --------------------------------------------------------------------------
  // 1. PIN LOCKSCREEN (GATEWAY)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
        <div className="w-full max-w-md">
          {/* Logo Branding */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 shadow-xl shadow-orange-500/20 mb-2">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Wanderphilia Operations</h1>
            <p className="text-slate-400 text-xs">
              Executive Hotel B2B &bull; Transport Logistics &bull; Zoho CRM Finance
            </p>
          </div>

          {/* Passcode Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800 text-slate-300">
              <Lock className="w-5 h-5 text-orange-500" />
              <div>
                <h2 className="text-sm font-bold text-white">Restricted Operations Console</h2>
                <p className="text-[11px] text-slate-400">Enter your secure operations passcode to proceed</p>
              </div>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Operations Access PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter PIN code"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono tracking-widest"
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <ShieldCheck className="w-5 h-5 text-emerald-500/80" />
                  </div>
                </div>
              </div>

              {pinError && (
                <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifyingPin}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingPin ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Unlock Operations Console</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <Link href="/wanderphilia-sales" className="text-orange-400 hover:underline flex items-center gap-1 font-semibold">
                Switch to Sales Portal &rarr;
              </Link>
              <span>Wanderphilia &copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. MAIN OPERATIONS WORKSPACE
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* TOP NAVIGATION BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center font-black text-white text-base shadow-md">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">Wanderphilia</span>
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Operations Hub
              </span>
              {masterData && (
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full hidden lg:inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Zoho CRM Master Data Active ({masterData.stats?.hotelsCount || 0} Hotels &bull; {masterData.stats?.vehiclesCount || 0} Vehicles)
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 hidden sm:block">
              Hotel B2B &bull; Transport Logistics &bull; Finance Module Sync
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Guest, Mobile, Inquiry ID or Destination..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Link to Sales Portal */}
          <Link
            href="/wanderphilia-sales"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
            title="Open Sales Command Portal"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sales Hub ⇄</span>
          </Link>

          <button
            onClick={() => {
              fetchBookings();
              fetchZohoMasterData();
            }}
            disabled={isLoading || isLoadingMasterData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
            title="Refresh Bookings & Master Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || isLoadingMasterData ? 'animate-spin text-orange-400' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Lock Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* KPI METRICS BAR */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-3 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max text-xs">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
            <span className="text-slate-400">Total Bookings:</span>
            <span className="font-extrabold text-white">{stats?.totalBookings || bookings.length}</span>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/40 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-800/50">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Action Required:</span>
            <span className="font-extrabold text-white">{stats?.pendingOps || 0}</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-950/40 text-blue-300 px-3 py-1.5 rounded-xl border border-blue-800/50">
            <span>In-Progress:</span>
            <span className="font-extrabold text-white">{stats?.inProgress || 0}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/40 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-800/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Confirmed:</span>
            <span className="font-extrabold text-white">{stats?.confirmed || 0}</span>
          </div>

          <div className="flex items-center gap-2 bg-purple-950/40 text-purple-300 px-3 py-1.5 rounded-xl border border-purple-800/50">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Synced to Finance:</span>
            <span className="font-extrabold text-white">{stats?.syncedToFinance || 0}</span>
          </div>

          {stats?.totalProjectedProfit !== undefined && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-950/60 to-amber-950/60 px-3 py-1.5 rounded-xl border border-orange-500/30 ml-auto">
              <span className="text-orange-300 font-bold">Total Gross Profit:</span>
              <span className="font-black text-amber-300">₹{stats.totalProjectedProfit.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </section>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT COLUMN: BOOKINGS QUEUE */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
          {/* Status Filter Tabs */}
          <div className="p-3 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending_ops', label: 'Action' },
              { id: 'in_progress', label: 'Active' },
              { id: 'ops_confirmed', label: 'Confirmed' },
              { id: 'synced_to_finance', label: 'Finance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${selectedStatusFilter === tab.id
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Bookings Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1.5">
            {bookings.length === 0 ? (
              <div className="p-6 text-center space-y-2 text-slate-500 text-xs">
                <FileText className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                <p>No bookings found matching filter.</p>
                <p className="text-[10px]">Sales can confirm bookings from the Sheet Itinerary page.</p>
              </div>
            ) : (
              bookings.map(b => {
                const isSelected = activeBooking?.id === b.id;
                const statusMeta = {
                  pending_ops: { label: 'Action Required', bg: 'bg-amber-950/60 text-amber-300 border-amber-800' },
                  in_progress: { label: 'In-Progress', bg: 'bg-blue-950/60 text-blue-300 border-blue-800' },
                  issue: { label: 'Issue / Sold Out', bg: 'bg-red-950/60 text-red-300 border-red-800' },
                  ops_confirmed: { label: 'Ops Confirmed', bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800' },
                  synced_to_finance: { label: 'Synced to Finance', bg: 'bg-purple-950/60 text-purple-300 border-purple-800' },
                }[b.opsStatus] || { label: b.opsStatus, bg: 'bg-slate-800 text-slate-300 border-slate-700' };

                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBooking(b)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${isSelected
                      ? 'bg-slate-800/90 border-orange-500/80 shadow-md ring-1 ring-orange-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                        {b.inquiryId}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusMeta.bg}`}>
                        {statusMeta.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-white tracking-tight leading-snug">
                        {b.customerName}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span>{b.destination}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span>{b.noOfNights}N/{b.noOfDays}D</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400">
                        {b.numberOfGuests} Pax ({b.adults}A, {b.kids}K)
                      </span>
                      <span className="font-black text-amber-400">
                        ₹{(b.totalQuotationAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* RIGHT COLUMN: ACTIVE BOOKING OPERATIONS CONSOLE */}
        <main className="flex-1 bg-slate-950 flex flex-col overflow-y-auto">
          {!activeBooking ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-sm">
              <div className="space-y-2">
                <Building2 className="w-12 h-12 mx-auto text-slate-700" />
                <p>Select a booking from the queue to start operations.</p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
              {/* SAVE / UPDATE SUCCESS TOAST */}
              {saveSuccessMessage && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-2xl text-xs text-emerald-300 flex items-center justify-between shadow-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold">{saveSuccessMessage}</span>
                  </div>
                </div>
              )}

              {/* SAVE / UPDATE ERROR TOAST */}
              {saveErrorMessage && (
                <div className="p-3 bg-red-950/80 border border-red-700 rounded-2xl text-xs text-red-300 flex items-center justify-between shadow-lg animate-fade-in">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="font-bold">{saveErrorMessage}</span>
                  </div>
                </div>
              )}

              {/* BOOKING HERO & CRM DETAILS BANNER */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2.5 py-0.5 rounded-lg">
                        {activeBooking.inquiryId}
                      </span>
                      {activeBooking.bookingId && (
                        <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                          Zoho Booking #{activeBooking.bookingId}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-medium">
                        Sales Rep: <strong className="text-white">{activeBooking.salesRepName || 'Sales'}</strong>
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-white tracking-tight mt-1.5">
                      {activeBooking.customerName} - {activeBooking.destination} Tour
                    </h2>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      {activeBooking.customerMobile && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <a href={`tel:${activeBooking.customerMobile}`} className="hover:text-orange-400 underline">
                            {activeBooking.customerMobile}
                          </a>
                        </span>
                      )}
                      {activeBooking.customerEmail && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{activeBooking.customerEmail}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-slate-300 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-orange-400" />
                        <span>{activeBooking.travelStartDate || 'TBA'} &rarr; {activeBooking.travelEndDate || 'TBA'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Operational Status Control Dropdown */}
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status:</span>
                      <select
                        value={activeBooking.opsStatus}
                        onChange={e => setActiveBooking({ ...activeBooking, opsStatus: e.target.value as OperationsStatus })}
                        className="bg-slate-950 border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="pending_ops">🟡 Action Required (Pending)</option>
                        <option value="in_progress">🟠 In-Progress (Bookings Underway)</option>
                        <option value="issue">🔴 Issue / Availability Problem</option>
                        <option value="ops_confirmed">🟢 Ops Confirmed (All Locked)</option>
                        <option value="synced_to_finance">🟣 Synced to Finance (Locked)</option>
                      </select>
                    </div>

                    {activeBooking.itineraryUrl && (
                      <a
                        href={activeBooking.itineraryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-bold hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Client Itinerary Proposal ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* ZOHO CRM OPERATIONS MODULE CONTROL SWITCHES (CustomModule11) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-orange-400" />
                      Zoho CRM Operations Status Flags (CustomModule11)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Syncs automatically to Zoho Deals &amp; Finance
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {/* Transport Booked */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isTransportBooked: !activeBooking.isTransportBooked,
                          transport: {
                            ...activeBooking.transport,
                            status: !activeBooking.isTransportBooked ? 'confirmed' : 'assigned'
                          }
                        })
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${activeBooking.isTransportBooked || activeBooking.transport?.status === 'confirmed'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" />
                        <span>Transport Booked?</span>
                      </span>
                      <span>{activeBooking.isTransportBooked || activeBooking.transport?.status === 'confirmed' ? '✓ Yes' : 'No'}</span>
                    </button>

                    {/* All Hotels Booked */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isAllHotelsBooked: !activeBooking.isAllHotelsBooked
                        })
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${allHotelsConfirmed || activeBooking.isAllHotelsBooked
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>All Hotels Booked?</span>
                      </span>
                      <span>{allHotelsConfirmed || activeBooking.isAllHotelsBooked ? '✓ Yes' : 'No'}</span>
                    </button>

                    {/* Activities Booked */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isActivitiesBooked: !activeBooking.isActivitiesBooked
                        })
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${activeBooking.isActivitiesBooked
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/80 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Activities Booked?</span>
                      </span>
                      <span>{activeBooking.isActivitiesBooked ? '✓ Yes' : 'No'}</span>
                    </button>

                    {/* Manual Calculation */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isManualCalculation: !activeBooking.isManualCalculation
                        })
                      }
                      className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${activeBooking.isManualCalculation
                        ? 'bg-amber-950/60 text-amber-300 border-amber-700/80 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5" />
                        <span>Manual Calc?</span>
                      </span>
                      <span>{activeBooking.isManualCalculation ? 'Manual' : 'Zoho Auto'}</span>
                    </button>
                  </div>
                </div>

                {/* ZOHO FIELD DETAILS GRID */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Guests</span>
                    <span className="font-semibold text-slate-200">
                      {activeBooking.numberOfGuests} ({activeBooking.adults}A, {activeBooking.kids}K)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Duration</span>
                    <span className="font-semibold text-slate-200">
                      {activeBooking.noOfNights}N / {activeBooking.noOfDays}D
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Hotel Category</span>
                    <span className="font-semibold text-orange-400">
                      {activeBooking.hotelCategory || 'Deluxe'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Rooms Count</span>
                    <span className="font-semibold text-slate-200">
                      {activeBooking.roomsCount} Room(s)
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Sharing Type</span>
                    <span className="font-semibold text-slate-200">
                      {activeBooking.sharingType || 'Double Sharing'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Room Category</span>
                    <span className="font-semibold text-slate-200 truncate block">
                      {activeBooking.roomCategory || 'Deluxe Room'}
                    </span>
                  </div>
                </div>

                {/* LIVE PROFITABILITY CARD */}
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  {/* Col 1: Client Selling Price (Without Taxes) */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Client Selling Price
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        Without Taxes
                      </span>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-white">
                      ₹{liveMargins.sellingWithoutTaxes.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-400 space-y-0.5">
                      <span className="block text-slate-400">
                        Total (incl. GST): <strong className="text-slate-300 font-mono">₹{liveMargins.sellingPrice.toLocaleString('en-IN')}</strong>
                      </span>
                      <span className="text-emerald-400 block font-semibold">
                        Advance: ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Col 2: B2B Hotels Total + Client Quoted Comparison */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      B2B Hotels Total
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-200">
                      ₹{liveMargins.b2bHotelTotal.toLocaleString('en-IN')}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 flex-wrap text-[10px]">
                        <span className="text-slate-400">Client Quoted:</span>
                        <strong className="text-amber-300 font-mono">₹{liveMargins.clientHotelTotal.toLocaleString('en-IN')}</strong>
                        <span className={`px-1 py-0.2 rounded font-mono font-bold text-[9px] ${
                          liveMargins.hotelDiff >= 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {liveMargins.hotelDiff >= 0 ? '+' : ''}₹{liveMargins.hotelDiff.toLocaleString('en-IN')} diff
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {activeBooking.hotels?.length || 0} Property Stays
                      </span>
                    </div>
                  </div>

                  {/* Col 3: B2B Transport Total + Client Quoted Comparison */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      B2B Transport Total
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-200">
                      ₹{liveMargins.b2bTransportTotal.toLocaleString('en-IN')}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 flex-wrap text-[10px]">
                        <span className="text-slate-400">Client Quoted:</span>
                        <strong className="text-amber-300 font-mono">₹{liveMargins.clientTransportTotal.toLocaleString('en-IN')}</strong>
                        <span className={`px-1 py-0.2 rounded font-mono font-bold text-[9px] ${
                          liveMargins.transportDiff >= 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {liveMargins.transportDiff >= 0 ? '+' : ''}₹{liveMargins.transportDiff.toLocaleString('en-IN')} diff
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {activeBooking.noOfDays} Days Vehicle Cost
                      </span>
                    </div>
                  </div>

                  {/* Col 4: Activities & Experiences Total */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Activities Total
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-200">
                      ₹{experiencesBreakdown.totalAll.toLocaleString('en-IN')}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                        <span className="text-sky-300 font-mono font-semibold">
                          Co. Paid: ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
                        </span>
                        {experiencesBreakdown.vendorTotal > 0 && (
                          <span className="text-amber-300 font-mono font-semibold">
                            • Vendor: ₹{experiencesBreakdown.vendorTotal.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        {experiencesBreakdown.wanderphiliaCount + experiencesBreakdown.vendorCount} Experiences Included
                      </span>
                    </div>
                  </div>

                  {/* Col 5: Gross Profit */}
                  <div className="space-y-1 bg-gradient-to-br from-orange-950/40 to-amber-950/40 p-2.5 rounded-xl border border-orange-500/30">
                    <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">
                      Gross Profit ({liveMargins.marginPct}%)
                    </span>
                    <div className="text-lg sm:text-xl font-black text-amber-300">
                      ₹{liveMargins.profit.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-amber-400/80 font-bold block">
                      Net Wanderphilia Margin
                    </span>
                  </div>
                </div>

                {/* PAYMENT PROOF RECEIPT ATTACHMENT */}
                {activeBooking.paymentProofUrl && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-600/50 text-xs shadow-md">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-emerald-800/80 border border-emerald-500 flex items-center justify-center shrink-0">
                        <Camera className="w-4 h-4 text-emerald-200" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-200">
                            Bank Payment Proof Attached
                          </span>
                          <span className="text-[10px] bg-emerald-800/60 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                            {activeBooking.paymentMode ? activeBooking.paymentMode.toUpperCase() : 'BANK TRANSFER'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          UTR: <strong className="text-white">{activeBooking.utrNumber || 'N/A'}</strong> &bull; Advance Received: <strong className="text-emerald-400">₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>
                    <a
                      href={activeBooking.paymentProofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Payment Screenshot ↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'hotels'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hotels &amp; B2B Rates ({activeBooking.hotels?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('transport')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'transport'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Transport &amp; Chauffeur Dispatch</span>
                </button>

                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'activities'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Activities &amp; Experiences Operations</span>
                </button>

                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'itinerary'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Itinerary Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeTab === 'payments'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Payment &amp; Bank UTR</span>
                </button>
              </div>

              {/* TAB 1: HOTELS & B2B RATES */}
              {activeTab === 'hotels' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">
                      Hotel Booking Checklist &bull; B2B Cost per Property
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      Tip: Click <strong>Swap Hotel ⇄</strong> to replace with Zoho CRM Master Property or custom hotel.
                    </span>
                  </div>

                  <div className="space-y-3">
                    {activeBooking.hotels?.map((hotel, hIdx) => {
                      const extraBedInfo = getHotelExtraBedDetails(hotel);
                      return (
                        <div
                          key={hotel.id || hIdx}
                          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 transition-all hover:border-slate-700"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs">
                                {hIdx + 1}
                              </span>
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-bold text-sm text-white">{hotel.hotelName}</span>
                                  {hotel.category && (
                                    <span className="text-[10px] font-bold bg-slate-800 text-orange-300 px-2 py-0.5 rounded-md">
                                      {hotel.category}
                                    </span>
                                  )}
                                  {/* Prominent Stay Duration Badge showing 'N' */}
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 font-mono text-xs font-black shadow-xs tracking-wide">
                                    🌙 {getHotelStayDetails(hotel, hIdx, activeBooking.hotels, activeBooking.travelStartDate).nights}N
                                    <span className="text-[10px] text-indigo-200/80 font-semibold font-sans">
                                      ({getHotelStayDetails(hotel, hIdx, activeBooking.hotels, activeBooking.travelStartDate).nights} {getHotelStayDetails(hotel, hIdx, activeBooking.hotels, activeBooking.travelStartDate).nights > 1 ? 'Nights' : 'Night'})
                                    </span>
                                  </span>

                                  {/* Check-in and Check-out Date Badge */}
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-semibold shadow-xs">
                                    <span className="text-[10px] text-amber-400 font-bold uppercase">📅 Check-in:</span>
                                    <strong className="text-white font-extrabold">{getHotelStayDetails(hotel, hIdx, activeBooking.hotels, activeBooking.travelStartDate).checkIn}</strong>
                                    <span className="text-amber-500 font-bold mx-0.5">➔</span>
                                    <span className="text-[10px] text-amber-400 font-bold uppercase">Check-out:</span>
                                    <strong className="text-white font-extrabold">{getHotelStayDetails(hotel, hIdx, activeBooking.hotels, activeBooking.travelStartDate).checkOut}</strong>
                                  </span>
                                  {extraBedInfo.count > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-300 font-mono text-[11px] font-bold shadow-xs">
                                      🛏️ {extraBedInfo.count} Extra Bed{extraBedInfo.count > 1 ? 's' : ''} (+₹{extraBedInfo.extraBedTotal.toLocaleString('en-IN')})
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400">
                                  City: <strong className="text-slate-300">{hotel.city}</strong>
                                </span>
                              </div>
                            </div>

                            {/* Status Selector & Swap Action */}
                            <div className="flex items-center gap-2">
                              <select
                                value={hotel.status}
                                onChange={e => {
                                  const updated = activeBooking.hotels.map((h, i) =>
                                    i === hIdx ? { ...h, status: e.target.value as any } : h
                                  );
                                  setActiveBooking({ ...activeBooking, hotels: updated });
                                }}
                                className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${hotel.status === 'confirmed'
                                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                  : hotel.status === 'sold_out' || hotel.status === 'issue'
                                    ? 'bg-red-950 text-red-300 border-red-700'
                                    : 'bg-amber-950 text-amber-300 border-amber-700'
                                  }`}
                              >
                                <option value="requested">Requested</option>
                                <option value="confirmed">Confirmed ✓</option>
                                <option value="sold_out">Sold Out / Issue ⚠</option>
                              </select>

                              <button
                                type="button"
                                onClick={() => handleOpenSwapModal(hIdx)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-orange-600/20 hover:text-orange-400 hover:border-orange-500/50 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 cursor-pointer transition-all flex items-center gap-1.5"
                              >
                                <span>Swap Hotel ⇄</span>
                              </button>
                            </div>
                          </div>

                          {/* Structured B2B Breakdown Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 sm:p-3.5 items-stretch">
                            {/* Col 1: Room & B2B Night Rate */}
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                                Room &amp; B2B Rate
                              </span>
                              <span className="font-semibold text-slate-200 text-xs block truncate" title={hotel.roomCategory}>
                                {hotel.roomCategory}
                              </span>
                              <div className="flex items-baseline gap-1 mt-0.5">
                                <span className="font-mono font-bold text-xs text-emerald-400">
                                  ₹{extraBedInfo.pricePerNight.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-slate-400">/night</span>
                                <span className="text-[10px] text-slate-500">• {hotel.nights}N &bull; {hotel.roomsCount || 1}R</span>
                              </div>
                            </div>

                            {/* Col 2: Room B2B Subtotal */}
                            <div className="space-y-1 md:border-l md:border-slate-800 md:pl-3">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                                Room B2B Cost
                              </span>
                              <div className="font-mono font-bold text-white text-xs mt-0.5">
                                ₹{extraBedInfo.hotelRoomTotal.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ₹{extraBedInfo.pricePerNight.toLocaleString('en-IN')}/nt &times; {hotel.nights}N &times; {hotel.roomsCount || 1}R
                              </div>
                            </div>

                            {/* Col 3: Extra Bed / Child (No Bed) Cost */}
                            <div className="space-y-1 md:border-l md:border-slate-800 md:pl-3">
                              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                                Extra Bed / Child
                              </span>
                              {extraBedInfo.count > 0 || extraBedInfo.childCount > 0 ? (
                                <div>
                                  <div className="font-mono font-bold text-purple-300 text-xs mt-0.5">
                                    +₹{(extraBedInfo.extraBedTotal + extraBedInfo.childNoBedTotal).toLocaleString('en-IN')}
                                  </div>
                                  <div className="text-[10px] text-slate-400 space-y-0.5 font-mono">
                                    {extraBedInfo.count > 0 && (
                                      <div>{extraBedInfo.count} Bed: ₹{extraBedInfo.rate.toLocaleString('en-IN')}/nt &times; {hotel.nights}N</div>
                                    )}
                                    {extraBedInfo.childCount > 0 && (
                                      <div>{extraBedInfo.childCount} Child: ₹{extraBedInfo.childRate.toLocaleString('en-IN')}/nt &times; {hotel.nights}N</div>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-mono font-semibold text-slate-500 text-xs mt-0.5">₹0</div>
                                  <div className="text-[10px] text-slate-600">No Extra Bed / Child</div>
                                </div>
                              )}
                            </div>

                            {/* Col 4: Total B2B Payable */}
                            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-2.5 space-y-1 md:border-l">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider">
                                  Total B2B Payable
                                </span>
                                {hotel.isManualCost && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold border border-amber-500/40">
                                    Manual
                                  </span>
                                )}
                              </div>
                              <div className="font-mono font-black text-emerald-300 text-base">
                                ₹{extraBedInfo.b2bTotal.toLocaleString('en-IN')}
                              </div>
                              <div className="text-[9px] text-slate-400 font-mono truncate" title={`Room ₹${extraBedInfo.hotelRoomTotal.toLocaleString('en-IN')}${extraBedInfo.extraBedTotal > 0 ? ` + Bed ₹${extraBedInfo.extraBedTotal.toLocaleString('en-IN')}` : ''}${extraBedInfo.childNoBedTotal > 0 ? ` + Child ₹${extraBedInfo.childNoBedTotal.toLocaleString('en-IN')}` : ''}`}>
                                ₹{extraBedInfo.hotelRoomTotal.toLocaleString('en-IN')} (Room)
                                {extraBedInfo.extraBedTotal > 0 && ` + ₹${extraBedInfo.extraBedTotal.toLocaleString('en-IN')} (Bed)`}
                                {extraBedInfo.childNoBedTotal > 0 && ` + ₹${extraBedInfo.childNoBedTotal.toLocaleString('en-IN')} (Child)`}
                              </div>
                              {/* Client Quoted Rate for this property */}
                              {(() => {
                                const currentClientCost = (hotel.clientQuotationCost && hotel.clientQuotationCost > 0)
                                  ? hotel.clientQuotationCost
                                  : (hotel.basePrice && hotel.basePrice > 0)
                                    ? ((hotel.basePrice * (hotel.nights || 1) * (hotel.roomsCount || 1)) + extraBedInfo.extraBedTotal + extraBedInfo.childNoBedTotal)
                                    : extraBedInfo.b2bTotal;
                                const diff = currentClientCost - extraBedInfo.b2bTotal;
                                return (
                                  <div className="text-[9px] font-mono mt-1 pt-1 border-t border-emerald-900/50 flex items-center justify-between gap-1 flex-wrap">
                                    <div className="flex items-center gap-1">
                                      <span className="text-slate-400">Client:</span>
                                      <input
                                        type="number"
                                        placeholder={String(currentClientCost)}
                                        value={hotel.clientQuotationCost || ''}
                                        onChange={e => {
                                          const val = Number(e.target.value) || 0;
                                          const updated = activeBooking.hotels.map((h, i) =>
                                            i === hIdx ? { ...h, clientQuotationCost: val } : h
                                          );
                                          setActiveBooking({ ...activeBooking, hotels: updated });
                                        }}
                                        className="w-16 bg-slate-900/90 border border-slate-700 rounded px-1 py-0.5 text-amber-300 text-[10px] font-mono font-bold focus:outline-none focus:border-amber-500"
                                        title="Click to edit actual hotel rate sent to client"
                                      />
                                    </div>
                                    <span className={diff >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                      {diff >= 0 ? '+' : ''}₹{diff.toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                );
                              })()}
                            </div>

                            {/* Col 5: Booking Ref & Rate Proof */}
                            <div className="space-y-1.5 md:border-l md:border-slate-800 md:pl-3">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                                Booking Ref / Voucher #
                              </span>
                              <input
                                type="text"
                                placeholder="e.g. VOUCH-9812"
                                value={hotel.confirmationNumber || ''}
                                onChange={e => {
                                  const updated = activeBooking.hotels.map((h, i) =>
                                    i === hIdx ? { ...h, confirmationNumber: e.target.value } : h
                                  );
                                  setActiveBooking({ ...activeBooking, hotels: updated });
                                }}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 font-mono"
                              />

                              {/* Rate Proof / Voucher Attachment */}
                              <div className="pt-0.5 flex items-center justify-between gap-1.5">
                                {hotel.proofUrl ? (
                                  <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <a href={hotel.proofUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[90px]">
                                      Proof ↗
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateHotelProof(hIdx, '', '')}
                                      className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                                      title="Remove proof"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <label className={`cursor-pointer inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold border transition ${
                                    hotel.isManualCost
                                      ? 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse hover:bg-red-900'
                                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                  }`}>
                                    <Paperclip className="w-3 h-3 shrink-0" />
                                    <span>{hotel.isManualCost ? '⚠️ Proof Req.' : '+ Proof'}</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      className="hidden"
                                      onChange={e => {
                                        const f = e.target.files?.[0];
                                        if (f) handleProofFileUpload(f, `hotel-${hIdx}`, (url, name) => {
                                          handleUpdateHotelProof(hIdx, url, name);
                                        });
                                      }}
                                    />
                                  </label>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: TRANSPORT & CHAUFFEUR DISPATCH */}
              {activeTab === 'transport' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Car className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="font-bold text-white text-sm">Assigned Transport &amp; Chauffeur Details</h3>
                          <span className="text-[10px] text-slate-400">
                            Synced with Zoho CRM Vehicles &bull; Matches CustomModule11
                          </span>
                        </div>
                      </div>

                      <select
                        value={activeBooking.transport?.status || 'assigned'}
                        onChange={e => {
                          setActiveBooking({
                            ...activeBooking,
                            transport: { ...activeBooking.transport, status: e.target.value as any }
                          });
                        }}
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${activeBooking.transport?.status === 'confirmed'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                      >
                        <option value="assigned">Vehicle Assigned</option>
                        <option value="confirmed">Transport Confirmed ✓</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      {/* Vehicle Type (Zoho dropdown strictly filtered by state or custom) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Vehicle Type ({showAllVehicleStates ? 'All States' : `State: ${activeBooking.destination || 'State'}`})
                          </label>
                          {masterData?.vehicles && masterData.vehicles.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAllVehicleStates(!showAllVehicleStates)}
                              className="text-[9px] text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                            >
                              {showAllVehicleStates ? `← Filter for ${activeBooking.destination || 'State'}` : `All States (${masterData.vehicles.length})`}
                            </button>
                          )}
                        </div>
                        {availableVehiclesForBooking.length > 0 ? (
                          <select
                            value={activeBooking.transport?.vehicleType || ''}
                            onChange={e => {
                              const selType = e.target.value;
                              const matchVeh = masterData?.vehicles?.find(v => v.name === selType);
                              const days = activeBooking.transport?.totalDays || activeBooking.noOfDays || 1;
                              const perDay = (matchVeh && matchVeh.cost) ? matchVeh.cost : (activeBooking.transport?.costPerDay || 0);
                              let newCost = perDay * days;
                              if (activeBooking.transport?.isManualCost && activeBooking.transport?.b2bTotalCost) {
                                newCost = activeBooking.transport.b2bTotalCost;
                              }
                              setActiveBooking({
                                ...activeBooking,
                                transport: {
                                  ...activeBooking.transport,
                                  vehicleType: selType,
                                  costPerDay: perDay,
                                  totalDays: days,
                                  b2bTotalCost: newCost
                                }
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="">-- Select Vehicle ({showAllVehicleStates ? 'All States' : (activeBooking.destination || 'State')}) --</option>
                            {availableVehiclesForBooking.map(v => (
                              <option key={v.id || v.name} value={v.name}>
                                {v.name} ({v.minCapacity}-{v.maxCapacity} Pax) - ₹{v.cost}/day
                              </option>
                            ))}
                            <option value="Custom Vehicle">Custom / Other Vehicle</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={activeBooking.transport?.vehicleType || ''}
                            onChange={e => {
                              setActiveBooking({
                                ...activeBooking,
                                transport: { ...activeBooking.transport, vehicleType: e.target.value }
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                          />
                        )}
                      </div>

                      {/* Vendor Name (Zoho CRM Vendors Module & Vehicle Vendors Filtered by State) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">
                            Transport Vendor ({showAllVendors ? 'All States' : `State: ${activeBooking.destination || 'State'}`})
                          </label>
                          {masterData?.vendors && masterData.vendors.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setShowAllVendors(!showAllVendors)}
                              className="text-[9px] text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                            >
                              {showAllVendors ? `← Filter for ${activeBooking.destination || 'State'}` : `All Vendors (${masterData.vendors.length})`}
                            </button>
                          )}
                        </div>

                        {isCustomVendor ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={activeBooking.transport?.vendorName || ''}
                              placeholder="Type custom vendor name..."
                              onChange={e => {
                                setActiveBooking({
                                  ...activeBooking,
                                  transport: { ...activeBooking.transport, vendorName: e.target.value }
                                });
                              }}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-500"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => setIsCustomVendor(false)}
                              className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-lg font-bold whitespace-nowrap cursor-pointer"
                              title="Switch back to Zoho Vendors list"
                            >
                              List ↩
                            </button>
                          </div>
                        ) : (
                          <select
                            value={
                              availableVendorsForBooking.some(v => v.id === activeBooking.transport?.vendorId || v.name === activeBooking.transport?.vendorName)
                                ? (availableVendorsForBooking.find(v => v.id === activeBooking.transport?.vendorId || v.name === activeBooking.transport?.vendorName)?.id || '')
                                : (activeBooking.transport?.vendorName ? '__custom__' : '')
                            }
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '__custom__') {
                                setIsCustomVendor(true);
                                return;
                              }
                              const selVendor = availableVendorsForBooking.find(v => v.id === val);
                              if (selVendor) {
                                const days = activeBooking.transport?.totalDays || activeBooking.noOfDays || 1;
                                const perDay = (selVendor.costPerDay && selVendor.costPerDay > 0) ? selVendor.costPerDay : (activeBooking.transport?.costPerDay || 0);
                                let newCost = perDay * days;
                                if (activeBooking.transport?.isManualCost && activeBooking.transport?.b2bTotalCost) {
                                  newCost = activeBooking.transport.b2bTotalCost;
                                }

                                setActiveBooking({
                                  ...activeBooking,
                                  transport: {
                                    ...activeBooking.transport,
                                    vendorName: selVendor.name,
                                    vendorId: selVendor.id,
                                    driverMobile: activeBooking.transport?.driverMobile || selVendor.phone || '',
                                    b2bTotalCost: newCost,
                                    costPerDay: perDay,
                                    totalDays: days,
                                  }
                                });
                              } else {
                                setActiveBooking({
                                  ...activeBooking,
                                  transport: {
                                    ...activeBooking.transport,
                                    vendorName: '',
                                    vendorId: undefined
                                  }
                                });
                              }
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="">-- Select Vendor ({showAllVendors ? 'All States' : (activeBooking.destination || 'State')}) --</option>
                            {availableVendorsForBooking.map(v => (
                              <option key={v.id} value={v.id}>
                                {v.name}
                                {v.city ? ` (${v.city})` : (v.state ? ` (${v.state})` : '')}
                                {v.costPerDay ? ` • ₹${v.costPerDay}/day` : ''}
                                {v.phone ? ` • ${v.phone}` : ''}
                              </option>
                            ))}
                            <option value="__custom__">✏️ Custom / Other Vendor</option>
                          </select>
                        )}
                      </div>

                      {/* Per Day Cost */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Per Day Cost (B2B ₹/Day)
                        </label>
                        <input
                          type="number"
                          value={activeBooking.transport?.costPerDay || 0}
                          onChange={e => {
                            const perDay = Number(e.target.value) || 0;
                            const days = activeBooking.transport?.totalDays || activeBooking.noOfDays || 1;
                            setActiveBooking({
                              ...activeBooking,
                              transport: {
                                ...activeBooking.transport,
                                costPerDay: perDay,
                                totalDays: days,
                                b2bTotalCost: perDay * days,
                                isManualCost: true
                              }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-emerald-400 font-mono font-bold text-xs"
                        />
                        <span className="text-[9px] text-slate-500 mt-1 block">
                          Cab contract cost per day
                        </span>
                      </div>

                      {/* Vehicle Cost */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Vehicle Cost (B2B Total ₹)
                        </label>
                        <input
                          type="number"
                          value={activeBooking.transport?.b2bTotalCost || 0}
                          onChange={e => {
                            const newTotal = Number(e.target.value) || 0;
                            const days = activeBooking.transport?.totalDays || activeBooking.noOfDays || 1;
                            setActiveBooking({
                              ...activeBooking,
                              transport: {
                                ...activeBooking.transport,
                                b2bTotalCost: newTotal,
                                costPerDay: days > 0 ? Math.round(newTotal / days) : newTotal,
                                isManualCost: true
                              }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-amber-400 font-mono font-bold text-xs"
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                          ₹{(activeBooking.transport?.costPerDay || 0).toLocaleString('en-IN')}/day &times; {activeBooking.transport?.totalDays || activeBooking.noOfDays || 1} Days
                        </span>
                        <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between gap-1 flex-wrap">
                          <span className="text-slate-400 text-[9px]">Client Quoted:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-amber-400 font-bold">₹</span>
                            <input
                              type="number"
                              placeholder={String(liveMargins.clientTransportTotal)}
                              value={activeBooking.transport?.clientQuotationCost || ''}
                              onChange={e => {
                                const val = Number(e.target.value) || 0;
                                setActiveBooking({
                                  ...activeBooking,
                                  transport: {
                                    ...activeBooking.transport,
                                    clientQuotationCost: val
                                  }
                                });
                              }}
                              className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-amber-300 text-[10px] font-mono font-bold focus:outline-none focus:border-amber-500"
                              title="Fixed transport rate quoted to client. Editable by operations."
                            />
                            <span className={`text-[9px] font-mono font-bold ${liveMargins.transportDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              ({liveMargins.transportDiff >= 0 ? '+' : ''}₹{liveMargins.transportDiff.toLocaleString('en-IN')})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transport Vendor Rate Proof / Quotation Attachment */}
                    <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-orange-400" />
                          Transport Vendor Quotation / Rate Proof Screenshot
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {activeBooking.transport?.isManualCost
                            ? '⚠️ Manual transport cost entered: Vendor quotation screenshot proof is mandatory.'
                            : 'Upload vendor rate quotation sheet or WhatsApp rate screenshot.'}
                        </span>
                      </div>

                      {activeBooking.transport?.proofUrl ? (
                        <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <a href={activeBooking.transport.proofUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            View Rate Proof ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => handleUpdateTransportProof('', '')}
                            className="text-slate-400 hover:text-red-400 ml-1 text-xs cursor-pointer"
                            title="Remove proof"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition shrink-0 ${
                          activeBooking.transport?.isManualCost
                            ? 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse hover:bg-red-900'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}>
                          <Upload className="w-3.5 h-3.5" />
                          <span>{activeBooking.transport?.isManualCost ? '⚠️ Upload Mandatory Proof' : 'Upload Proof'}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) handleProofFileUpload(f, 'transport', (url, name) => {
                                handleUpdateTransportProof(url, name);
                              });
                            }}
                          />
                        </label>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2 border-t border-slate-800">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Chauffeur / Driver Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Ramesh Kumar"
                          value={activeBooking.transport?.driverName || ''}
                          onChange={e => {
                            setActiveBooking({
                              ...activeBooking,
                              transport: { ...activeBooking.transport, driverName: e.target.value }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Driver Contact Mobile
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. +91 9876543210"
                          value={activeBooking.transport?.driverMobile || ''}
                          onChange={e => {
                            setActiveBooking({
                              ...activeBooking,
                              transport: { ...activeBooking.transport, driverMobile: e.target.value }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Vehicle Plate # / Cab Number
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. RJ-14-TA-5544"
                          value={activeBooking.transport?.vehicleNumber || ''}
                          onChange={e => {
                            setActiveBooking({
                              ...activeBooking,
                              transport: { ...activeBooking.transport, vehicleNumber: e.target.value }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono uppercase"
                        />
                      </div>
                    </div>

                    {/* WhatsApp Duty Slip Quick Action */}
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-white block">WhatsApp Driver Duty Slip</span>
                        <span className="text-[10px] text-slate-400">
                          One-click formatted dispatch details ready to send to chauffeur or vendor.
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(generateDriverDutySlip(), 'duty_slip')}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {copiedText === 'duty_slip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedText === 'duty_slip' ? 'Slip Copied!' : 'Copy Duty Slip'}</span>
                        </button>

                        {activeBooking.transport?.driverMobile && (
                          <a
                            href={`https://wa.me/${activeBooking.transport.driverMobile.replace(/[^0-9]/g, '').startsWith('91') ? activeBooking.transport.driverMobile.replace(/[^0-9]/g, '') : `91${activeBooking.transport.driverMobile.replace(/[^0-9]/g, '')}`}?text=${encodeURIComponent(generateDriverDutySlip())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <span>Send WhatsApp 📲</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITIES & EXPERIENCES OPERATIONS */}
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  {/* Top Header Card with KPI counters */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white text-sm">
                              Day-Wise Activities &amp; Sightseeing Operations
                            </h3>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/80 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Zoho CRM Master Synced
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            Live rates from Zoho Activities &amp; Experiences master module &bull; Matches Operations &amp; Finance subform
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Activities Booked?</span>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveBooking({
                              ...activeBooking,
                              isActivitiesBooked: !activeBooking.isActivitiesBooked
                            })
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${activeBooking.isActivitiesBooked
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                            }`}
                        >
                          {activeBooking.isActivitiesBooked ? 'All Confirmed ✓' : 'Pending Booking'}
                        </button>
                      </div>
                    </div>

                    {/* Experiences Payer Split Cards (Zoho Finance CustomModule10 Integration) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-sky-500/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-sky-400 flex items-center gap-1.5">
                            🏢 Company Paid
                          </span>
                          <span className="text-[10px] bg-sky-950 text-sky-300 font-mono px-1.5 py-0.5 rounded border border-sky-700">
                            {experiencesBreakdown.wanderphiliaCount} Exps
                          </span>
                        </div>
                        <div className="text-base font-black text-sky-300 font-mono">
                          ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          Syncs to: <strong className="text-slate-300">Experiences Total Cost</strong> &amp; List
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1.5">
                            🚗 Vendor Paid
                          </span>
                          <span className="text-[10px] bg-amber-950 text-amber-300 font-mono px-1.5 py-0.5 rounded border border-amber-700">
                            {experiencesBreakdown.vendorCount} Exps
                          </span>
                        </div>
                        <div className="text-base font-black text-amber-300 font-mono">
                          ₹{experiencesBreakdown.vendorTotal.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[10px] text-slate-400 block leading-tight">
                          Syncs to: <strong className="text-slate-300">Extra amount paid by transport vendor</strong>
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Total All Experiences
                          </span>
                          <div className="text-base font-black text-white font-mono mt-0.5">
                            ₹{experiencesBreakdown.totalAll.toLocaleString('en-IN')}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {activeBooking.dayActivities?.length || 0} Days &bull; {activeBooking.numberOfGuests || activeBooking.adults || 2} Pax
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Day-by-Day Cards */}
                  {activeBooking.dayActivities && activeBooking.dayActivities.length > 0 ? (
                    <div className="space-y-4">
                      {activeBooking.dayActivities.map((day: any, dIdx: number) => {
                        const dayNum = day.dayNumber || dIdx + 1;
                        let stayDateStr = '';
                        if (activeBooking.travelStartDate && /^\d{4}-\d{2}-\d{2}$/.test(activeBooking.travelStartDate)) {
                          try {
                            const d = new Date(activeBooking.travelStartDate);
                            d.setDate(d.getDate() + (dayNum - 1));
                            stayDateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', weekday: 'short', year: 'numeric' });
                          } catch (_) { }
                        }

                        // Parse experiences
                        const expsList: any[] = [];
                        if (Array.isArray(day.experiences)) {
                          day.experiences.forEach((item: any, eIdx: number) => {
                            if (typeof item === 'string') {
                              if (item.trim()) expsList.push({ name: item.trim(), originalIdx: eIdx, status: 'requested', paidBy: 'wanderphilia' });
                            } else if (item && typeof item === 'object') {
                              const name = item.name || item.title || '';
                              if (name.trim()) expsList.push({ ...item, name: name.trim(), originalIdx: eIdx });
                            }
                          });
                        }
                        if (expsList.length === 0 && day.title) {
                          expsList.push({ name: day.title, originalIdx: 0, status: 'requested', paidBy: 'wanderphilia' });
                        }

                        const dayCity = day.city || day.fromCity || activeBooking.destination;
                        const pax = activeBooking.numberOfGuests || activeBooking.adults || 2;

                        return (
                          <div
                            key={dIdx}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 transition-all shadow-md"
                          >
                            {/* Day Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-xs">
                                  Day {dayNum}
                                </span>
                                {stayDateStr && (
                                  <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-2.5 py-0.5 rounded-lg">
                                    📅 {stayDateStr}
                                  </span>
                                )}
                                <span className="text-xs text-slate-300 font-bold">
                                  📍 {dayCity}
                                </span>
                                {day.stayLocation && (
                                  <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                    Stay: {day.stayLocation}
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setActivityModalDayIdx(dIdx);
                                  setActivitySearchQuery('');
                                }}
                                className="px-3 py-1.5 bg-orange-600/20 hover:bg-orange-600 text-orange-300 hover:text-white border border-orange-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Attraction from Zoho CRM</span>
                              </button>
                            </div>

                            {/* Attractions List for this Day */}
                            {expsList.length > 0 ? (
                              <div className="divide-y divide-slate-800/80 space-y-1">
                                {expsList.map((exp: any, eIdx: number) => {
                                  const expName = exp.name || exp.title || `Experience ${eIdx + 1}`;
                                  const zohoMatch = matchZohoActivity(expName, dayCity);
                                  const ppCost = zohoMatch?.ppCost || 0;
                                  const privateCost = zohoMatch?.privateCost || 0;
                                  const calculatedCost = exp.cost !== undefined
                                    ? exp.cost
                                    : (privateCost > 0 ? privateCost : (ppCost * pax));
                                  const status = exp.status || 'requested';
                                  const voucherNo = exp.confirmationNumber || exp.voucherNumber || '';

                                  return (
                                    <div key={eIdx} className="pt-2.5 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                      {/* Left: Name, Badges, Operating Times */}
                                      <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                          <span className="font-bold text-white text-xs">{expName}</span>
                                          {zohoMatch ? (
                                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono px-2 py-0.2 rounded-md font-bold">
                                              Zoho Master ✓
                                            </span>
                                          ) : (
                                            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.2 rounded-md">
                                              Custom
                                            </span>
                                          )}
                                          {(zohoMatch?.category || exp.category) && (
                                            <span className="text-[10px] bg-slate-800/80 text-orange-300 px-1.5 py-0.2 rounded">
                                              {zohoMatch?.category || exp.category}
                                            </span>
                                          )}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                                          {(zohoMatch?.timing || exp.timing) && (
                                            <span>⏱ Timing: {zohoMatch?.timing || exp.timing}</span>
                                          )}
                                          {zohoMatch?.openingTime && (
                                            <span>🕒 Hours: {zohoMatch.openingTime} - {zohoMatch.closingTime || 'Evening'}</span>
                                          )}
                                          {ppCost > 0 && (
                                            <span className="text-slate-300 font-mono">
                                              B2B: ₹{ppCost.toLocaleString('en-IN')}/pax
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Right: Payer Toggle, Cost, Booking Status, Voucher #, Delete */}
                                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                                        {/* Payer Toggle: Company Paid vs Vendor Paid */}
                                        <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateExperiencePayer(dIdx, exp.originalIdx, 'wanderphilia')}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                                              exp.paidBy !== 'vendor'
                                                ? 'bg-sky-600 text-white shadow-xs'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Company Paid (Wanderphilia will pay -> Experiences Total Cost)"
                                          >
                                            <span>🏢 Company Paid</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleUpdateExperiencePayer(dIdx, exp.originalIdx, 'vendor')}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition flex items-center gap-1 cursor-pointer ${
                                              exp.paidBy === 'vendor'
                                                ? 'bg-amber-600 text-white shadow-xs'
                                                : 'text-slate-400 hover:text-white'
                                            }`}
                                            title="Vendor Paid (Transport vendor will pay -> Extra amount paid by transport vendor)"
                                          >
                                            <span>🚗 Vendor Paid</span>
                                          </button>
                                        </div>

                                        {/* Cost input / display */}
                                        <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-center min-w-[95px]">
                                          <span className="text-[9px] text-slate-500 uppercase font-bold block">
                                            {exp.paidBy === 'vendor' ? 'Vendor Cost' : 'B2B Cost'}
                                          </span>
                                          <div className="flex items-center gap-0.5 justify-center">
                                            <span className="text-xs text-amber-400 font-bold">₹</span>
                                            <input
                                              type="number"
                                              value={calculatedCost || ''}
                                              onChange={e => handleUpdateExperienceCost(dIdx, exp.originalIdx, Number(e.target.value) || 0)}
                                              className="w-16 bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 rounded text-center"
                                              placeholder="0"
                                            />
                                          </div>
                                        </div>

                                        {/* Status Dropdown */}
                                        <select
                                          value={status}
                                          onChange={e => handleUpdateExperienceStatus(dIdx, exp.originalIdx, e.target.value)}
                                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${
                                            status === 'confirmed'
                                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                              : status === 'voucher_issued'
                                              ? 'bg-blue-950 text-blue-300 border-blue-700'
                                              : status === 'free'
                                              ? 'bg-slate-800 text-slate-300 border-slate-700'
                                              : 'bg-amber-950 text-amber-300 border-amber-700'
                                          }`}
                                        >
                                          <option value="requested">Requested</option>
                                          <option value="confirmed">Confirmed ✓</option>
                                          <option value="voucher_issued">Voucher Issued</option>
                                          <option value="free">Not Required / Free</option>
                                        </select>

                                        {/* Ticket / Voucher input */}
                                        <input
                                          type="text"
                                          placeholder="Ticket / Ref #"
                                          value={voucherNo}
                                          onChange={e => handleUpdateExperienceVoucher(dIdx, exp.originalIdx, e.target.value)}
                                          className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                                        />

                                        {/* Proof Screenshot Attachment */}
                                        {(() => {
                                          const rawExp = activeBooking.dayActivities?.[dIdx]?.experiences?.[exp.originalIdx];
                                          const hasProof = typeof rawExp === 'object' && Boolean(rawExp.proofUrl);
                                          const isManual = typeof rawExp === 'object' && Boolean(rawExp.isManualCost);
                                          const costVal = Number(calculatedCost) || 0;

                                          if (hasProof) {
                                            return (
                                              <div className="flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 px-2 py-1 rounded-lg text-[10px] font-bold shrink-0">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                                <a href={rawExp.proofUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                  Proof ↗
                                                </a>
                                                <button
                                                  type="button"
                                                  onClick={() => handleUpdateExperienceProof(dIdx, exp.originalIdx, '', '')}
                                                  className="text-slate-400 hover:text-red-400 ml-0.5 cursor-pointer"
                                                  title="Remove proof"
                                                >
                                                  ✕
                                                </button>
                                              </div>
                                            );
                                          }

                                          if (isManual && costVal > 0) {
                                            return (
                                              <label className="cursor-pointer px-2 py-1 rounded-lg bg-red-950/80 border border-red-500/60 text-red-300 text-[10px] font-bold flex items-center gap-1 hover:bg-red-900 animate-pulse shrink-0" title="Upload Proof Screenshot for this manual cost">
                                                <Camera className="w-3 h-3 shrink-0" />
                                                <span>Proof Req.</span>
                                                <input
                                                  type="file"
                                                  accept="image/*,application/pdf"
                                                  className="hidden"
                                                  onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleProofFileUpload(f, `exp-${dIdx}-${exp.originalIdx}`, (url, name) => {
                                                      handleUpdateExperienceProof(dIdx, exp.originalIdx, url, name);
                                                    });
                                                  }}
                                                />
                                              </label>
                                            );
                                          }

                                          return (
                                            <label className="cursor-pointer px-1.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[10px] flex items-center gap-1 transition shrink-0" title="Attach voucher/receipt screenshot">
                                              <Paperclip className="w-3 h-3 shrink-0" />
                                              <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={e => {
                                                  const f = e.target.files?.[0];
                                                  if (f) handleProofFileUpload(f, `exp-${dIdx}-${exp.originalIdx}`, (url, name) => {
                                                    handleUpdateExperienceProof(dIdx, exp.originalIdx, url, name);
                                                  });
                                                }}
                                              />
                                            </label>
                                          );
                                        })()}

                                        {/* Delete Button */}
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveExperience(dIdx, exp.originalIdx)}
                                          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition cursor-pointer"
                                          title="Remove attraction"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="py-4 text-center text-slate-500 text-xs space-y-1">
                                <p>No specific ticketed attractions added for Day {dayNum} yet.</p>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActivityModalDayIdx(dIdx);
                                    setActivitySearchQuery('');
                                  }}
                                  className="text-orange-400 hover:underline font-bold text-xs cursor-pointer"
                                >
                                  + Select from Zoho Master Experiences
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 text-xs space-y-2 bg-slate-900 border border-slate-800 rounded-2xl">
                      <Compass className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                      <p className="text-white font-bold">No day-wise activities configured yet.</p>
                      <p className="text-slate-400 text-[11px]">
                        Activities will be auto-populated from itinerary days or you can add them manually.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ITINERARY OVERVIEW */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                          <Compass className="w-4 h-4 text-orange-400" />
                          <span>Day-Wise Itinerary &amp; Travel Plan</span>
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-black">
                            {activeBooking.selectedOptionTitle || `Option ${activeBooking.selectedOptionNumber}`}
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {activeBooking.duration} &bull; {activeBooking.destination} &bull; {activeBooking.numberOfGuests} Guests ({activeBooking.adults} Adults{activeBooking.kids > 0 ? `, ${activeBooking.kids} Kids` : ''})
                        </p>
                      </div>
                      {activeBooking.itineraryUrl && (
                        <a
                          href={activeBooking.itineraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-orange-600/20 transition-all shrink-0"
                        >
                          <span>Open Live Web Itinerary</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Assigned Hotel Category
                        </span>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-orange-400" />
                          <span className="text-white font-black text-xs">{activeBooking.hotelCategory || 'Deluxe'}</span>
                          <span className="text-slate-400 font-mono text-[11px]">({activeBooking.roomsCount} Rooms, {activeBooking.sharingType || 'Double Sharing'})</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Sales Handover Notes
                        </span>
                        <div className="text-slate-300 italic text-xs">
                          &ldquo;{activeBooking.salesNotes || 'No specific notes entered by sales.'}&rdquo;
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DAY-BY-DAY CARDS */}
                  {Array.isArray(activeBooking.dayActivities) && activeBooking.dayActivities.length > 0 ? (
                    <div className="space-y-3">
                      {activeBooking.dayActivities.map((act: any, aIdx: number) => {
                        const dayNum = act.dayNumber || aIdx + 1;
                        let stayDateStr = '';
                        if (activeBooking.travelStartDate && /^\d{4}-\d{2}-\d{2}$/.test(activeBooking.travelStartDate)) {
                          try {
                            const d = new Date(activeBooking.travelStartDate);
                            d.setDate(d.getDate() + (dayNum - 1));
                            stayDateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', weekday: 'short' });
                          } catch (_) { }
                        }

                        // Parse meals
                        const mealsList: string[] = [];
                        if (act.breakfast) mealsList.push('Breakfast');
                        if (act.lunch) mealsList.push('Lunch');
                        if (act.dinner) mealsList.push('Dinner');

                        // Experiences
                        const exps: Array<{ name: string; desc?: string }> = [];
                        if (Array.isArray(act.experiences)) {
                          act.experiences.forEach((exp: any, eIdx: number) => {
                            if (typeof exp === 'string' && exp.trim()) {
                              const desc = Array.isArray(act.descriptions) ? act.descriptions[eIdx] : '';
                              exps.push({ name: exp.trim(), desc });
                            } else if (exp && typeof exp === 'object' && exp.name) {
                              exps.push({ name: exp.name, desc: exp.description || exp.desc || '' });
                            }
                          });
                        }
                        if (exps.length === 0 && act.title) {
                          exps.push({ name: act.title, desc: act.description || '' });
                        }

                        // En route
                        const enRoute = act.enRouteSpot || (Array.isArray(act.enRouteExperiences) ? act.enRouteExperiences.join(', ') : act.enRouteExperiences);

                        return (
                          <div
                            key={dayNum}
                            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all shadow-md text-xs"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-xs">
                                  Day {dayNum}
                                </span>
                                {stayDateStr && (
                                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] font-bold">
                                    📅 {stayDateStr}
                                  </span>
                                )}
                                <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                                  <span>{act.city || activeBooking.destination}</span>
                                  {act.city2 && act.city2 !== act.city && (
                                    <>
                                      <ArrowRight className="w-3 h-3 text-slate-400" />
                                      <span className="text-orange-300 font-black">{act.city2}</span>
                                    </>
                                  )}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                {mealsList.length > 0 ? (
                                  <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 font-black text-[11px] flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>{mealsList.join(' & ')}</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 text-[11px]">
                                    No Meals
                                  </span>
                                )}

                                {Boolean(act.guidedTour) && (
                                  <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-600/70 text-amber-300 font-extrabold text-[11px] flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    <span>Guided Tour Included</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* En-route Spot */}
                            {enRoute && (
                              <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-amber-200">
                                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span className="font-bold text-[11px]">En-Route Sightseeing / Stop:</span>
                                <span className="font-semibold text-white">{enRoute}</span>
                              </div>
                            )}

                            {/* Sightseeing & Activities */}
                            {exps.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                  Sightseeing &amp; Planned Experiences ({exps.length})
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                  {exps.map((eItem, eI) => (
                                    <div
                                      key={eI}
                                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col justify-between"
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                          {eI + 1}
                                        </div>
                                        <div>
                                          <span className="text-white font-bold text-xs block">
                                            {eItem.name}
                                          </span>
                                          {eItem.desc && (
                                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                                              {eItem.desc}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Custom day notes if any */}
                            {act.customActivities && (
                              <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                                <span className="font-bold text-slate-400">Custom Day Note: </span>
                                {act.customActivities}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
                      <p className="text-sm font-semibold">No day-by-day activities saved for this option yet.</p>
                      <p className="text-xs text-slate-500 mt-1">Open the live itinerary link to view the published version.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: PAYMENTS & BANK UTR */}
              {activeTab === 'payments' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-bold text-white text-sm">Client Payment &amp; Bank Transfer Verification</h3>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                        Advance Verified
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Quotation</span>
                        <span className="text-base font-black text-white">
                          ₹{(activeBooking.totalQuotationAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Advance Paid</span>
                        <span className="text-base font-black text-emerald-400">
                          ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Balance Due</span>
                        <span className="text-base font-black text-amber-400">
                          ₹{(activeBooking.balancePendingAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Payment Mode</label>
                        <input
                          type="text"
                          value={activeBooking.paymentMode}
                          disabled
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 uppercase"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Bank UTR / Transaction Ref #
                        </label>
                        <input
                          type="text"
                          value={activeBooking.utrNumber || 'TBA'}
                          disabled
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-emerald-400 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Payment Date</label>
                        <input
                          type="text"
                          value={activeBooking.paymentDate || 'Today'}
                          disabled
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTTOM ACTION BAR */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl z-20">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Last updated: {new Date(activeBooking.updatedAt).toLocaleTimeString('en-GB')}</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={isSavingChanges}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-700 shadow-sm"
                  >
                    {isSavingChanges ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save All Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInitiateSyncFinance}
                    disabled={isSyncingFinance}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${activeBooking.opsStatus === 'synced_to_finance'
                      ? 'bg-purple-950/90 hover:bg-purple-900/90 text-purple-200 border border-purple-600/80 shadow-purple-900/20'
                      : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-600/30'
                      }`}
                  >
                    {isSyncingFinance ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Syncing to Zoho Finance...</span>
                      </>
                    ) : activeBooking.opsStatus === 'synced_to_finance' ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                        <span>Update in Finance (Zoho CRM) ↻</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Finance (Zoho CRM) 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL: SWAP HOTEL WITH ZOHO CRM MASTER DATA */}
      {swapModalHotelIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Swap Alternate Hotel</h3>
                <span className="text-[11px] text-slate-400">
                  Select from live Zoho CRM Hotels strictly filtered by category &amp; room rate
                </span>
              </div>
              <button
                onClick={() => setSwapModalHotelIndex(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Sales Booking Handover Reference Banner */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3.5 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Sales Team Booking Selection (Handover Reference)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Selected Category</span>
                  <span className="font-extrabold text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-lg inline-block mt-0.5">
                    {salesSelectedCategory || 'Standard'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Selected Room Category</span>
                  <span className="font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded-lg inline-block mt-0.5 truncate max-w-full">
                    {salesSelectedRoomCategory || 'Standard Room'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Stay Details</span>
                  <span className="font-semibold text-slate-300 block mt-0.5">
                    {swapCity} &bull; {swapNights}N &bull; {swapRooms}R
                  </span>
                </div>
              </div>
            </div>

            {/* Source Switcher: Zoho Master vs Manual */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSwapSourceType('zoho')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${swapSourceType === 'zoho'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Zoho CRM Hotel Master
              </button>
              <button
                type="button"
                onClick={() => setSwapSourceType('custom')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${swapSourceType === 'custom'
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Custom / Offline Hotel
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* City Selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={swapCity}
                  onChange={e => setSwapCity(e.target.value)}
                  placeholder="e.g. Jaipur, Jodhpur, Jawai, Udaipur"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {swapSourceType === 'zoho' ? (
                <>
                  {/* Category Filter Pills (Filters out other categories so only selected category hotels appear) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">
                        Hotel Category Filter ({showAllCategories ? 'Showing All' : `Strictly: ${swapHotelCategory}`})
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAllCategories(!showAllCategories)}
                        className="text-[10px] text-orange-400 hover:text-orange-300 font-bold underline cursor-pointer"
                      >
                        {showAllCategories ? `← Re-filter by ${swapHotelCategory || 'Category'}` : `Show All Categories (${allZohoHotelsInCity.length})`}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {/* Sales Chosen Category Pill */}
                      {salesSelectedCategory && (
                        <button
                          type="button"
                          onClick={() => {
                            setSwapHotelCategory(salesSelectedCategory);
                            setShowAllCategories(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${!showAllCategories && swapHotelCategory.toLowerCase().trim() === salesSelectedCategory.toLowerCase().trim()
                            ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                          <span>{salesSelectedCategory} (Sales Selection)</span>
                        </button>
                      )}

                      {/* Other Categories in City */}
                      {availableCategoriesInCity
                        .filter(c => c.toLowerCase().trim() !== salesSelectedCategory.toLowerCase().trim())
                        .map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setSwapHotelCategory(cat);
                              setShowAllCategories(false);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${!showAllCategories && swapHotelCategory.toLowerCase().trim() === cat.toLowerCase().trim()
                              ? 'bg-orange-600 text-white border-orange-500 shadow-sm'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                          >
                            {cat}
                          </button>
                        ))}

                      <button
                        type="button"
                        onClick={() => setShowAllCategories(true)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${showAllCategories
                          ? 'bg-slate-700 text-white border-slate-600'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                      >
                        All ({allZohoHotelsInCity.length})
                      </button>
                    </div>
                  </div>

                  {/* Zoho Hotel Dropdown (strictly filtered by category) */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Available Hotels in {swapCity} ({availableZohoHotelsForCity.length} in {showAllCategories ? 'All Categories' : swapHotelCategory})
                    </label>
                    {availableZohoHotelsForCity.length > 0 ? (
                      <select
                        value={swapHotelId}
                        onChange={e => handleSelectZohoHotel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">-- Select {swapHotelCategory || 'Category'} Hotel --</option>
                        {availableZohoHotelsForCity.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.hotelName} — ({h.category || 'Hotel'}) — B2B from ₹{(h.rooms?.[0]?.pricePerNight || h.pricePerNight || h.basePrice || 0).toLocaleString('en-IN')}/nt
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-300 text-[11px] space-y-1">
                        <p>No Zoho hotels registered under &ldquo;{swapHotelCategory}&rdquo; in {swapCity}.</p>
                        <p className="text-[10px] text-slate-400">
                          Click <strong>Show All Categories</strong> above to view {allZohoHotelsInCity.length} other hotels in this city, or switch to <strong>Custom / Offline Hotel</strong>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Zoho Room Category & Live B2B Pricing (Interactive Cards) */}
                  {availableRoomsForSelectedHotel.length > 0 ? (
                    <div className="space-y-2 pt-1 border-t border-slate-800/80">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">
                          Room Categories &amp; B2B Rates for {swapHotelName}
                        </label>
                        <span className="text-[10px] text-slate-500">
                          Click card to select room category
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
                        {availableRoomsForSelectedHotel.map((r: any, rIdx: number) => {
                          const isSelected = swapRoomCategory.toLowerCase().trim() === r.roomCategory.toLowerCase().trim();
                          const matchesSales = salesSelectedRoomCategory.toLowerCase().trim() === r.roomCategory.toLowerCase().trim();
                          return (
                            <div
                              key={rIdx}
                              onClick={() => handleSelectZohoRoomCategory(r.roomCategory)}
                              className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${isSelected
                                ? 'bg-orange-950/60 border-orange-500 text-white ring-1 ring-orange-500/50 shadow-sm'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-xs truncate">{r.roomCategory}</span>
                                {matchesSales && (
                                  <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-bold shrink-0">
                                    ✓ Sales Choice
                                  </span>
                                )}
                              </div>
                              <div className="mt-1.5 flex items-center justify-between text-[11px]">
                                <span className="font-black text-amber-400">
                                  ₹{(r.pricePerNight || r.basePrice || 0).toLocaleString('en-IN')}
                                  <span className="text-[9px] text-slate-400 font-normal"> /night (Per Night Price)</span>
                                </span>
                                {r.extraBedPrice > 0 && (
                                  <span className="text-[10px] text-slate-500 font-medium">
                                    +₹{r.extraBedPrice} ex.bed
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Manual Room Category & Price Adjuster */}
                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2.5 text-xs">
                        <div className="flex items-center gap-1.5 flex-1 min-w-[130px]">
                          <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                            Active Room:
                          </span>
                          <input
                            type="text"
                            value={swapRoomCategory}
                            onChange={e => setSwapRoomCategory(e.target.value)}
                            placeholder="Room Category"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                            ₹ Per Night:
                          </span>
                          <input
                            type="number"
                            value={swapB2BCostPerNight}
                            onChange={e => setSwapB2BCostPerNight(Number(e.target.value) || 0)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-amber-400 font-bold font-mono text-xs"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-purple-400 font-bold uppercase whitespace-nowrap">
                            🛏️ Ex.Bed/Nt:
                          </span>
                          <input
                            type="number"
                            value={swapExtraBedPrice}
                            onChange={e => setSwapExtraBedPrice(Number(e.target.value) || 0)}
                            className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-purple-300 font-bold font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ) : swapHotelId && (
                    <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                        Room Category:
                      </span>
                      <input
                        type="text"
                        value={swapRoomCategory}
                        onChange={e => setSwapRoomCategory(e.target.value)}
                        placeholder="e.g. Deluxe Room"
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white text-xs"
                      />
                      <span className="text-[10px] text-slate-400 font-bold uppercase whitespace-nowrap">
                        Rate / Night:
                      </span>
                      <input
                        type="number"
                        value={swapB2BCostPerNight}
                        onChange={e => setSwapB2BCostPerNight(Number(e.target.value) || 0)}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-amber-400 font-bold font-mono text-xs"
                      />
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  {(() => {
                    const extraBeds = activeBooking ? bookingExtraBedCalc.billableExtraBeds : 0;
                    const bedTotal = swapExtraBedPrice * extraBeds * swapNights;
                    const roomTotal = swapB2BCostPerNight * swapNights * swapRooms;
                    const grandTotal = roomTotal + bedTotal;
                    return (
                      <div className={`grid ${extraBeds > 0 ? 'grid-cols-4' : 'grid-cols-3'} gap-2.5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center`}>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">B2B Rate / Night</span>
                          <span className="font-bold text-slate-200 text-xs">₹{swapB2BCostPerNight.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Room Cost</span>
                          <span className="font-bold text-slate-200 text-xs">₹{roomTotal.toLocaleString('en-IN')}</span>
                          <span className="text-[9px] text-slate-500 block">{swapNights}N &bull; {swapRooms}R</span>
                        </div>
                        {extraBeds > 0 && (
                          <div>
                            <span className="text-[10px] text-purple-400 block uppercase font-bold">Extra Bed</span>
                            <span className="font-bold text-purple-300 text-xs">+₹{bedTotal.toLocaleString('en-IN')}</span>
                            <span className="text-[9px] text-slate-500 block">{extraBeds} Bed &bull; ₹{swapExtraBedPrice}/nt</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-emerald-400 block font-bold uppercase">Total B2B</span>
                          <span className="font-black text-emerald-400 text-sm">
                            ₹{grandTotal.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  {/* Custom Hotel Fields */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Custom Hotel Name
                    </label>
                    <input
                      type="text"
                      value={swapHotelName}
                      onChange={e => setSwapHotelName(e.target.value)}
                      placeholder="Enter hotel property name"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Hotel Category
                      </label>
                      <input
                        type="text"
                        value={swapHotelCategory}
                        onChange={e => setSwapHotelCategory(e.target.value)}
                        placeholder="e.g. Deluxe, Luxury, 4-Star"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Room Category
                      </label>
                      <input
                        type="text"
                        value={swapRoomCategory}
                        onChange={e => setSwapRoomCategory(e.target.value)}
                        placeholder="e.g. Deluxe Room, Superior View"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Total B2B Cost (₹)
                    </label>
                    <input
                      type="number"
                      value={swapManualTotalCost}
                      onChange={e => setSwapManualTotalCost(e.target.value)}
                      placeholder="Enter negotiated total B2B cost"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-amber-400 font-mono font-bold"
                    />
                  </div>

                  {/* Compulsory Proof Upload for Custom Hotel */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <label className="text-[10px] font-bold text-amber-300 uppercase flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-amber-400" />
                        Hotel Rate Proof Screenshot (Compulsory)
                      </span>
                      {swapProofUrl && (
                        <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Attached
                        </span>
                      )}
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{swapProofUrl ? 'Change Screenshot' : 'Upload Proof Screenshot'}</span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) handleProofFileUpload(f, 'swap-hotel', (url, name) => {
                              setSwapProofUrl(url);
                              setSwapProofFileName(name);
                            });
                          }}
                        />
                      </label>
                      {swapProofUrl && (
                        <a
                          href={swapProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-indigo-300 hover:underline font-mono truncate max-w-[200px]"
                        >
                          View Uploaded ↗
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSwapModalHotelIndex(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyHotelSwap}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-orange-600/30"
              >
                Confirm Swap &bull; Recalculate Margin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CELEBRATION THEMED FINANCE SYNC MODAL */}
      {financeModalState !== 'idle' && activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
          {/* Animated Falling Confetti Particles (when celebrating) */}
          {financeModalState === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {Array.from({ length: 45 }).map((_, i) => {
                const left = (i * 2.2) + '%';
                const delay = (i % 9) * 0.18 + 's';
                const duration = 2.2 + (i % 6) * 0.35 + 's';
                const bgColors = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f97316', '#eab308'];
                const color = bgColors[i % bgColors.length];
                const size = 7 + (i % 6);
                return (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left,
                      top: '-20px',
                      width: `${size}px`,
                      height: `${size * 1.6}px`,
                      backgroundColor: color,
                      opacity: 0.95,
                      borderRadius: i % 2 === 0 ? '2px' : '50%',
                      transform: `rotate(${i * 22}deg)`,
                      animation: `fallConfettiRibbon ${duration} ease-in-out infinite`,
                      animationDelay: delay
                    }}
                  />
                );
              })}
              <style>{`
                @keyframes fallConfettiRibbon {
                  0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
                  50% { transform: translateY(260px) rotate(180deg) translateX(18px) scale(1.1); }
                  100% { transform: translateY(650px) rotate(360deg) translateX(-18px) scale(0.9); opacity: 0; }
                }
              `}</style>
            </div>
          )}

          <div className="relative z-30 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl shadow-amber-500/10 text-white">
            {/* Top Close Button (if not syncing) */}
            {!isSyncingFinance && (
              <button
                onClick={() => setFinanceModalState('idle')}
                className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer text-sm font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            )}

            {/* STATE 1: CELEBRATION CONFIRMATION CARD */}
            {financeModalState === 'confirm' && (
              <div className="space-y-4">
                <div className="text-center space-y-1.5 pt-2">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <PartyPopper className="w-7 h-7 text-white animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Lock &amp; Sync to Zoho Finance 🎉
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Push final B2B supplier costs, verified vouchers, and lock profitability margins in Zoho CRM Finance module.
                  </p>
                </div>

                {/* Booking & Financials Summary Card */}
                <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Customer</span>
                      <strong className="text-sm text-white">{activeBooking.customerName}</strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Tour &bull; Duration</span>
                      <strong className="text-orange-400">{activeBooking.destination} ({activeBooking.noOfNights}N/{activeBooking.noOfDays}D)</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Selling Price</span>
                      <span className="text-sm font-black text-white">
                        ₹{(activeBooking.totalQuotationAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Advance Received</span>
                      <span className="text-sm font-black text-emerald-400">
                        ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Hotel B2B Cost</span>
                      <span className="text-xs font-bold text-slate-200">
                        ₹{liveMargins.b2bHotelTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Transport B2B Cost</span>
                      <span className="text-xs font-bold text-slate-200">
                        ₹{liveMargins.b2bTransportTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-sky-500/40">
                      <span className="text-[10px] font-bold text-sky-400 block uppercase">Experiences (Company Paid)</span>
                      <span className="text-xs font-bold text-sky-300">
                        ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-amber-500/40">
                      <span className="text-[10px] font-bold text-amber-400 block uppercase">Vendor Paid (Extra Amt)</span>
                      <span className="text-xs font-bold text-amber-300">
                        ₹{experiencesBreakdown.vendorTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Net Gross Profit Highlight Badge */}
                  <div className="p-3 bg-gradient-to-r from-amber-950/70 via-orange-950/70 to-amber-950/70 rounded-xl border border-amber-500/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-extrabold text-amber-400 block">Net Gross Margin</span>
                        <span className="text-[10px] text-slate-300">Total Wanderphilia Profit</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-amber-300">
                        ₹{liveMargins.profit.toLocaleString('en-IN')}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">
                        {liveMargins.marginPct}% Margin
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setFinanceModalState('idle')}
                    disabled={isSyncingFinance}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmSyncFinance}
                    disabled={isSyncingFinance}
                    className="flex-1 px-5 py-2.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSyncingFinance ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Pushing to Zoho Finance...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-200" />
                        <span>Confirm &amp; Push to Finance 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STATE 2: CELEBRATION SUCCESS SCREEN */}
            {financeModalState === 'celebrating' && (
              <div className="text-center space-y-4 py-2 animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/30">
                  <div className="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">
                    Booking Synced to Finance! 🎉
                  </h3>
                  <p className="text-xs text-emerald-300 font-semibold">
                    Congratulations! All supplier B2B costs &amp; margin are locked in Zoho CRM.
                  </p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2.5 max-w-sm mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Customer:</span>
                    <strong className="text-white">{activeBooking.customerName}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Locked Net Profit:</span>
                    <strong className="text-amber-400 text-sm font-black">
                      ₹{liveMargins.profit.toLocaleString('en-IN')} ({liveMargins.marginPct}%)
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Zoho Deal Status:</span>
                    <span className="bg-purple-950 text-purple-300 border border-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Synced to Finance ✓
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFinanceModalState('idle')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 cursor-pointer transition-all"
                >
                  Awesome! Back to Dashboard 🚀
                </button>
              </div>
            )}

            {/* STATE 3: ERROR SCREEN */}
            {financeModalState === 'error' && (
              <div className="text-center space-y-4 py-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-red-950/80 border border-red-700/80 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Finance Sync Warning</h3>
                  <p className="text-xs text-red-300">
                    {financeSyncError || 'Could not complete Zoho CRM Finance push.'}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setFinanceModalState('idle')}
                    className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmSyncFinance}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MANDATORY PROOFS MISSING WARNING MODAL */}
      {missingProofsList.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-red-500/60 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl text-white animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-300">
                  Mandatory Rate Proof Missing!
                </h3>
                <span className="text-xs text-slate-400">
                  Manual cost override detected without proof screenshot
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed bg-red-950/40 border border-red-900/50 p-3 rounded-xl">
              As per Operations policy, if you manually edit the cost of any Hotel, Transport, or Experience, attaching vendor quotation or screenshot proof is <strong>mandatory</strong> before syncing to Finance.
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Proofs ({missingProofsList.length} items):
              </span>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 max-h-48 overflow-y-auto">
                {missingProofsList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-amber-300 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setMissingProofsList([])}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-lg shadow-red-600/30"
              >
                Understood, Upload Proof
              </button>
            </div>
          </div>
        </div>
      )}
      {activityModalDayIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Add Attraction from Zoho CRM
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Day {activityModalDayIdx + 1} &bull; City: <strong className="text-slate-300">{activeBooking?.dayActivities?.[activityModalDayIdx]?.city || activeBooking?.destination}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActivityModalDayIdx(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search attraction name, fort, temple, safari, food tour..."
                  value={activitySearchQuery}
                  onChange={e => setActivitySearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  autoFocus
                />
              </div>
            </div>

            {/* Attractions List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {(() => {
                const targetCity = (activeBooking?.dayActivities?.[activityModalDayIdx]?.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                const cleanQuery = activitySearchQuery.toLowerCase().trim();

                const filtered = allZohoExperiences.filter(exp => {
                  const expName = (exp.name || '').toLowerCase();
                  const expCity = (exp.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
                  const expDest = (exp.destination || '').toLowerCase();

                  if (cleanQuery) {
                    return expName.includes(cleanQuery) || expCity.includes(cleanQuery) || expDest.includes(cleanQuery);
                  }
                  return targetCity ? (expCity === targetCity || expCity.includes(targetCity) || targetCity.includes(expCity)) : true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                      <p>No Zoho master activities found matching &ldquo;{activitySearchQuery}&rdquo;.</p>
                      <button
                        type="button"
                        onClick={() => setActivitySearchQuery('')}
                        className="text-orange-400 hover:underline font-bold text-xs cursor-pointer"
                      >
                        Clear search filter
                      </button>
                    </div>
                  );
                }

                return filtered.map((exp: any, idx: number) => {
                  const pax = activeBooking?.numberOfGuests || activeBooking?.adults || 2;
                  const estimatedCost = exp.privateCost && exp.privateCost > 0
                    ? exp.privateCost
                    : ((exp.ppCost || 0) * pax);

                  return (
                    <div
                      key={exp.id || idx}
                      className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all text-xs"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-xs">{exp.name}</span>
                          {exp.city && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-md">
                              {exp.city}
                            </span>
                          )}
                          {exp.category && (
                            <span className="text-[10px] bg-orange-950/60 text-orange-300 border border-orange-900 px-1.5 py-0.2 rounded">
                              {exp.category}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                          {exp.timing && <span>⏱ {exp.timing}</span>}
                          {exp.openingTime && <span>🕒 {exp.openingTime} - {exp.closingTime || 'Close'}</span>}
                          {exp.ppCost > 0 && <span className="text-slate-300 font-mono">B2B: ₹{exp.ppCost}/pax</span>}
                          {exp.privateCost > 0 && <span className="text-slate-300 font-mono">Private: ₹{exp.privateCost}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right pr-2">
                          <span className="text-[9px] text-slate-500 block uppercase font-bold">Total ({pax} Pax)</span>
                          <span className="font-bold text-amber-400 font-mono text-xs">
                            ₹{estimatedCost.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddZohoExperienceToDay(activityModalDayIdx, exp)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-md"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
              <span>{allZohoExperiences.length} total Zoho master activities available</span>
              <button
                type="button"
                onClick={() => setActivityModalDayIdx(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
