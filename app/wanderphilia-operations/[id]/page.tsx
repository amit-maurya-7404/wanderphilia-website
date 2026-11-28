'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
  ArrowLeft,
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
  Upload,
  Download
} from 'lucide-react';
import { OperationsBooking, OperationsHotelItem, OperationsStatus, OperationsSummaryStats } from '@/types/operations';
import { calculateRoomsAndBeds, isExtraBed, isWithoutBed } from '@/lib/zoho-pricing';
import { generateVoucherHtml } from '@/lib/voucher-template';

// Helper to compute live work progress and SLA status
function computeBookingSlaAndProgress(b: OperationsBooking) {
  const hotels = b.hotels || [];
  const totalHotels = hotels.length;
  const confirmedHotels = hotels.filter(h => h.status === 'confirmed').length;
  const pendingHotels = Math.max(0, totalHotels - confirmedHotels);

  const isTransportConfirmed = Boolean(b.isTransportBooked || b.transport?.status === 'confirmed');

  let totalExps = 0;
  let confirmedExps = 0;
  if (Array.isArray(b.dayActivities)) {
    b.dayActivities.forEach((day: any) => {
      const exps = day.experiences || day.activities || day.sightseeingPoints || [];
      if (Array.isArray(exps)) {
        exps.forEach((exp: any) => {
          totalExps++;
          const status = typeof exp === 'object' ? exp?.status : 'requested';
          if (status === 'confirmed') confirmedExps++;
        });
      }
    });
  }
  const pendingExps = Math.max(0, totalExps - confirmedExps);

  const isSynced = Boolean(b.opsStatus === 'synced_to_finance' || b.isSyncToFinance);
  const createdTime = new Date(b.createdAt || b.handedOverAt || Date.now()).getTime();
  const hoursElapsed = Math.max(0, Math.round((Date.now() - createdTime) / (1000 * 60 * 60)));
  const isOverdue = !isSynced && hoursElapsed >= 48;
  const daysOverdue = isOverdue ? Math.max(1, Math.floor((hoursElapsed - 48) / 24) + 1) : 0;
  const hoursLeft = !isSynced && !isOverdue ? Math.max(1, 48 - hoursElapsed) : 0;
  const daysLeft = Math.ceil(hoursLeft / 24);

  return {
    totalHotels,
    confirmedHotels,
    pendingHotels,
    isTransportConfirmed,
    totalExps,
    confirmedExps,
    pendingExps,
    isSynced,
    hoursElapsed,
    isOverdue,
    daysOverdue,
    hoursLeft,
    daysLeft,
  };
}

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

export default function SingleBookingOperationsPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const bookingIdParam = decodeURIComponent(Array.isArray(rawId) ? rawId[0] : (rawId || '')).trim();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);
  const [opsToken, setOpsToken] = useState<string>('');

  // Active Booking
  const [activeBooking, setActiveBooking] = useState<OperationsBooking | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState<'hotels' | 'transport' | 'activities' | 'itinerary' | 'finance'>('hotels');

  // Master Data from Zoho CRM
  const [masterData, setMasterData] = useState<{
    hotelsByCity: Record<string, any[]>;
    vehicles: any[];
    vendors?: any[];
    destinations: string[];
    citiesByDestination: Record<string, string[]>;
    experiencesByCity?: Record<string, any[]>;
    sightseeingByCity?: Record<string, any[]>;
    pricingMatrix?: {
      markupPercentage: number;
      defaultTaxPercentage: number;
      defaultTcsPercentage: number;
    };
    stats?: {
      hotelsCount?: number;
      vehiclesCount?: number;
      activitiesCount?: number;
      vendorsCount?: number;
    };
  } | null>(null);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState<boolean>(false);

  // Save changes state
  const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Sync to Finance Modal
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncingFinance, setIsSyncingFinance] = useState<boolean>(false);
  const [syncFinanceSuccess, setSyncFinanceSuccess] = useState<boolean>(false);
  const [syncFinanceResponse, setSyncFinanceResponse] = useState<any>(null);
  const [syncFinanceError, setSyncFinanceError] = useState<string | null>(null);

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
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [showAllVehicleStates, setShowAllVehicleStates] = useState<boolean>(false);
  const [showAllVendors, setShowAllVendors] = useState<boolean>(false);
  const [isCustomVendor, setIsCustomVendor] = useState<boolean>(false);

  // Add Attraction from Zoho Modal State
  const [activityModalDayIdx, setActivityModalDayIdx] = useState<number | null>(null);
  const [activitySearchQuery, setActivitySearchQuery] = useState<string>('');

  // Voucher Preview & Dispatch Modal
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState<boolean>(false);
  const [voucherRecipientEmail, setVoucherRecipientEmail] = useState<string>('');
  const [isSendingVoucher, setIsSendingVoucher] = useState<boolean>(false);
  const [voucherSendSuccess, setVoucherSendSuccess] = useState<string | null>(null);
  const [voucherSendError, setVoucherSendError] = useState<string | null>(null);

  // Check authentication on mount
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

  // Fetch Master Data from Zoho CRM
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

  // Fetch Booking by ID
  const fetchBooking = useCallback(
    async (tokenToUse?: string) => {
      if (!bookingIdParam) return;
      const token =
        tokenToUse ||
        opsToken ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('wanderphilia_ops_token') ||
            sessionStorage.getItem('wanderphilia_ops_token') ||
            localStorage.getItem('wanderphilia_sales_token') ||
            ''
          : '');

      setIsLoading(true);
      setFetchError(null);

      try {
        const res = await fetch(`/api/operations/bookings/${encodeURIComponent(bookingIdParam)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: 'no-store',
        });

        if (res.status === 401) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success && data.booking) {
          setActiveBooking(data.booking);
        } else {
          setFetchError(data.error || 'Operations booking not found.');
        }
      } catch (err: any) {
        setFetchError(err?.message || 'Failed to connect to database.');
      } finally {
        setIsLoading(false);
      }
    },
    [bookingIdParam, opsToken]
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooking();
      fetchZohoMasterData();
    }
  }, [isAuthenticated, fetchBooking, fetchZohoMasterData]);

  // Handle PIN verification
  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim()) return;

    setIsVerifyingPin(true);
    setPinError('');

    try {
      const res = await fetch('/api/operations/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin.trim() }),
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('wanderphilia_ops_token', data.token);
        setOpsToken(data.token);
        setIsAuthenticated(true);
        fetchBooking(data.token);
        fetchZohoMasterData();
      } else {
        setPinError(data.error || 'Incorrect Operations PIN.');
      }
    } catch {
      setPinError('Failed to verify PIN. Please try again.');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wanderphilia_ops_token');
    sessionStorage.removeItem('wanderphilia_ops_token');
    setIsAuthenticated(false);
    setActiveBooking(null);
  };

  // Extra bed helper calculations
  const bookingExtraBedCalc = useMemo(() => {
    if (!activeBooking) return { extraBedCount: 0, childWithoutBedCount: 0 };
    const adults = Number(activeBooking.adults || 0);
    const kids = Number(activeBooking.kids || 0);
    const totalPax = activeBooking.numberOfGuests || (adults + kids) || 2;
    const childrenDetails = activeBooking.childrenDetails || [];

    const initialExtraBedCount = childrenDetails.filter(c => isExtraBed(c.bedPreference)).length;
    const roomCalc = calculateRoomsAndBeds({
      adults,
      sharingType: activeBooking.sharingType || 'Double Sharing',
      totalKidsCount: kids,
      initialExtraBedCount,
    });

    const childWithoutBedCount = childrenDetails.filter(c => isWithoutBed(c.bedPreference)).length;
    let extraBedCount = roomCalc.extraBedCount;

    if (extraBedCount === 0 && childrenDetails.length > 0) {
      extraBedCount = childrenDetails.filter(c => isExtraBed(c.bedPreference)).length;
    }

    if (extraBedCount === 0 && totalPax > 2 && (totalPax % 2 !== 0)) {
      extraBedCount = 1;
    }

    return {
      extraBedCount,
      childWithoutBedCount,
    };
  }, [activeBooking]);

  // Helper to resolve hotel stay dates and nights details
  const getHotelStayDetails = useCallback(
    (hotel: any, index: number, allHotels: any[], travelStartDate?: string) => {
      let checkIn = hotel.checkIn || '';
      let checkOut = hotel.checkOut || '';
      const nights = Number(hotel.nights || 1);

      if (checkIn && checkOut) {
        return { checkIn, checkOut, nights, rangeStr: `${checkIn} → ${checkOut}` };
      }

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
    },
    []
  );

  const getHotelExtraBedDetails = useCallback(
    (hotel: OperationsHotelItem) => {
      const count =
        typeof hotel.extraBedCount === 'number'
          ? hotel.extraBedCount
          : bookingExtraBedCalc.extraBedCount;

      let rate = typeof hotel.extraBedPrice === 'number' ? hotel.extraBedPrice : 0;
      const childCount =
        typeof hotel.childWithoutBedCount === 'number'
          ? hotel.childWithoutBedCount
          : bookingExtraBedCalc.childWithoutBedCount;

      let childRate = typeof hotel.childWithoutBedPrice === 'number' ? hotel.childWithoutBedPrice : 0;
      let pricePerNight = Number(hotel.pricePerNight || 0);

      if (masterData?.hotelsByCity && hotel.city) {
        const cityKey = normalizeCityKey(hotel.city);
        const cityHotels = masterData.hotelsByCity[cityKey] || [];
        const matchedH = cityHotels.find(
          h =>
            (hotel.hotelId && String(h.id) === String(hotel.hotelId)) ||
            (hotel.hotelName && h.hotelName.toLowerCase().trim() === hotel.hotelName.toLowerCase().trim())
        );
        if (matchedH?.rooms) {
          const roomMatch =
            matchedH.rooms.find(
              (r: any) =>
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
      const extraBedTotal =
        typeof hotel.extraBedTotalCost === 'number' && hotel.extraBedTotalCost > 0
          ? hotel.extraBedTotalCost
          : rate * count * nights;

      const childNoBedTotal =
        typeof hotel.childWithoutBedTotalCost === 'number' && hotel.childWithoutBedTotalCost > 0
          ? hotel.childWithoutBedTotalCost
          : childRate * childCount * nights;

      const calculatedB2BTotal = hotelRoomTotal + extraBedTotal + childNoBedTotal;

      const b2bTotal =
        hotel.isManualCost && typeof hotel.b2bTotalCost === 'number' && hotel.b2bTotalCost > 0
          ? hotel.b2bTotalCost
          : typeof hotel.b2bTotalCost === 'number' && hotel.b2bTotalCost > 0
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
    },
    [activeBooking, bookingExtraBedCalc, masterData?.hotelsByCity]
  );

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
  const matchZohoActivity = useCallback(
    (name: string, city?: string) => {
      if (!name || allZohoExperiences.length === 0) return null;
      const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanCity = (city || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      // 1. Match name + city
      let found = allZohoExperiences.find(e => {
        const eCity = (e.city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const eName = (e.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return (
          (!cleanCity || eCity === cleanCity || cleanCity.includes(eCity) || eCity.includes(cleanCity)) &&
          (eName === cleanName || eName.includes(cleanName) || cleanName.includes(eName))
        );
      });

      // 2. Fallback to name only
      if (!found) {
        found = allZohoExperiences.find(e => {
          const eName = (e.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          return eName === cleanName || eName.includes(cleanName) || cleanName.includes(eName);
        });
      }

      return found || null;
    },
    [allZohoExperiences]
  );

  const experiencesBreakdown = useMemo(() => {
    if (!activeBooking?.dayActivities || !Array.isArray(activeBooking.dayActivities)) {
      return {
        wanderphiliaTotal: 0,
        wanderphiliaListText: '',
        wanderphiliaCount: 0,
        vendorTotal: 0,
        vendorListText: '',
        vendorCount: 0,
        totalAll: 0,
      };
    }

    let wanderphiliaTotal = 0;
    const wanderphiliaList: string[] = [];
    let vendorTotal = 0;
    const vendorList: string[] = [];
    const pax = activeBooking.numberOfGuests || (Number(activeBooking.adults || 0) + Number(activeBooking.kids || 0)) || 2;

    activeBooking.dayActivities.forEach((day: any) => {
      const dayCity = day.city || day.fromCity || activeBooking?.destination;
      const expsToScan =
        Array.isArray(day.experiences) && day.experiences.some((e: any) => typeof e === 'object' || (typeof e === 'string' && e.trim()))
          ? day.experiences
          : day.title
          ? [day.title]
          : [];

      expsToScan.forEach((exp: any) => {
        const expName = typeof exp === 'string' ? exp : exp.name || exp.title || '';
        if (!expName || !expName.trim()) return;

        let cost = 0;
        if (typeof exp === 'object' && exp.cost !== undefined && exp.cost !== null) {
          cost = Number(exp.cost) || 0;
        } else {
          const m = matchZohoActivity(expName, dayCity);
          if (m) {
            cost = m.privateCost > 0 ? m.privateCost : (m.ppCost || 0) * pax;
          }
        }

        const paidBy = typeof exp === 'object' && exp.paidBy ? exp.paidBy : 'wanderphilia';

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

  // Live Margins & B2B Costs
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

    const sellingPrice = Number(activeBooking.totalQuotationAmount) || 0;
    const sellingWithoutTaxes = Math.round(sellingPrice / 1.05);
    const gstAmount = sellingPrice - sellingWithoutTaxes;

    let b2bHotelTotal = 0;
    (activeBooking.hotels || []).forEach(h => {
      const extra = getHotelExtraBedDetails(h);
      b2bHotelTotal += extra.b2bTotal;
    });

    const b2bTransportTotal = Number(activeBooking.transport?.b2bTotalCost || 0);
    const b2bGrandTotal = b2bHotelTotal + b2bTransportTotal + experiencesBreakdown.wanderphiliaTotal;
    const profit = sellingPrice - b2bGrandTotal;
    const marginPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;
    const marginOnBasePct =
      sellingWithoutTaxes > 0
        ? Math.round(((sellingWithoutTaxes - b2bGrandTotal) / sellingWithoutTaxes) * 100)
        : marginPct;

    // Transport Client Quoted Cost
    let clientTransportTotal = 0;
    if (activeBooking.transport?.clientQuotationCost && Number(activeBooking.transport.clientQuotationCost) > 0) {
      clientTransportTotal = Number(activeBooking.transport.clientQuotationCost);
    } else {
      const transportDays = Number(activeBooking.transport?.totalDays || activeBooking.noOfDays || 1);
      const vType = activeBooking.transport?.vehicleType || (activeBooking as any).vehicleType || '';
      let vehicleDailyRate = 0;

      if (masterData?.vehicles) {
        const vClean = vType.toLowerCase().replace(/[^a-z0-9]/g, '');
        const matchedV = masterData.vehicles.find((v: any) => {
          const mClean = (v.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
          return mClean === vClean || vClean.includes(mClean) || mClean.includes(vClean);
        });
        if (matchedV?.cost) {
          vehicleDailyRate = Number(matchedV.cost) || 0;
        }
      }

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
        clientHotelTotal += Number(h.basePrice) * nights * rooms + extra.extraBedTotal + extra.childNoBedTotal;
      } else {
        const b2bCost =
          h.isManualCost && typeof h.b2bTotalCost === 'number' && h.b2bTotalCost > 0
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
  }, [activeBooking, getHotelExtraBedDetails, experiencesBreakdown, masterData?.vehicles]);

  const allHotelsConfirmed = useMemo(() => {
    if (!activeBooking?.hotels || activeBooking.hotels.length === 0) return false;
    return activeBooking.hotels.every(h => h.status === 'confirmed');
  }, [activeBooking?.hotels]);

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

  const handleSelectZohoRoomCategory = (roomCat: string) => {
    setSwapRoomCategory(roomCat);
    if (selectedZohoHotelObj?.rooms) {
      const match = selectedZohoHotelObj.rooms.find((r: any) =>
        r.roomCategory.toLowerCase().trim() === roomCat.toLowerCase().trim()
      );
      if (match) {
        setSwapB2BCostPerNight(match.pricePerNight || match.basePrice || 0);
        if (match.extraBedPrice !== undefined) {
          setSwapExtraBedPrice(Number(match.extraBedPrice) || 0);
        }
      }
    }
  };

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
      hotelId: swapSourceType === 'zoho' && swapHotelId ? swapHotelId : undefined,
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

  // Proof File Upload Handler
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
    target.voucherNumber = voucherNumber;
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

  // Copy Chauffeur duty slip
  const generateDriverDutySlip = () => {
    if (!activeBooking) return '';
    const t = activeBooking.transport;
    return `*🚗 WANDERPHILIA CHAUFFEUR DUTY SLIP*\n` +
      `--------------------------------------\n` +
      `*Guest Name:* ${activeBooking.customerName}\n` +
      `*Destination:* ${activeBooking.destination}\n` +
      `*Travel Dates:* ${activeBooking.travelStartDate} to ${activeBooking.travelEndDate} (${activeBooking.noOfNights}N/${activeBooking.noOfDays}D)\n` +
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

  // Save changes
  const handleSaveChanges = async () => {
    if (!activeBooking) return;
    setIsSavingChanges(true);
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    const token =
      opsToken ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('wanderphilia_ops_token') ||
          sessionStorage.getItem('wanderphilia_ops_token') ||
          localStorage.getItem('wanderphilia_sales_token') ||
          ''
        : '');

    try {
      const syncedHotels = (activeBooking.hotels || []).map((h, hIdx) => {
        const extra = getHotelExtraBedDetails(h);
        const currentClientCost =
          typeof h.clientQuotationCost === 'number' && h.clientQuotationCost > 0
            ? h.clientQuotationCost
            : extra.b2bTotal;

        return {
          ...h,
          pricePerNight: extra.pricePerNight,
          extraBedPrice: extra.rate,
          extraBedCount: extra.count,
          extraBedTotalCost: extra.extraBedTotal,
          childWithoutBedPrice: extra.childRate,
          childWithoutBedCount: extra.childCount,
          childWithoutBedTotalCost: extra.childNoBedTotal,
          b2bTotalCost: extra.b2bTotal,
          clientQuotationCost: currentClientCost,
        };
      });

      const transportClientCost =
        typeof activeBooking.transport?.clientQuotationCost === 'number' && activeBooking.transport.clientQuotationCost > 0
          ? activeBooking.transport.clientQuotationCost
          : liveMargins.clientTransportTotal;

      const syncedTransport = activeBooking.transport
        ? {
            ...activeBooking.transport,
            clientQuotationCost: transportClientCost,
            b2bTotalCost: typeof activeBooking.transport.b2bTotalCost === 'number' ? activeBooking.transport.b2bTotalCost : 0,
          }
        : undefined;

      const updatedData: Partial<OperationsBooking> = {
        ...activeBooking,
        hotels: syncedHotels,
        transport: syncedTransport,
        totalB2BHotelCost: liveMargins.b2bHotelTotal,
        totalB2BTransportCost: liveMargins.b2bTransportTotal,
        totalB2BCost: liveMargins.b2bGrandTotal,
        grossMarginAmount: liveMargins.profit,
        grossMarginPercentage: liveMargins.marginPct,
        isAllHotelsBooked: allHotelsConfirmed,
        updatedAt: new Date().toISOString(),
      };

      const bookingIdentifier = activeBooking.id || activeBooking.inquiryId || activeBooking.bookingId || '';
      const res = await fetch(`/api/operations/bookings/${encodeURIComponent(bookingIdentifier)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveSuccessMessage('Operations changes saved successfully!');
        if (json.booking) {
          setActiveBooking(json.booking);
        }
      } else {
        setSaveErrorMessage(json.error || 'Failed to save operations changes.');
      }
    } catch (err: any) {
      setSaveErrorMessage(err?.message || 'Network error saving changes.');
    } finally {
      setIsSavingChanges(false);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }
  };

  // Sync to Finance
  const handleExecuteFinanceSync = async () => {
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
      setIsSyncModalOpen(false);
      return;
    }

    setIsSyncingFinance(true);
    setSyncFinanceError(null);

    const token =
      opsToken ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('wanderphilia_ops_token') ||
          sessionStorage.getItem('wanderphilia_ops_token') ||
          localStorage.getItem('wanderphilia_sales_token') ||
          ''
        : '');

    try {
      const payload = {
        inquiryId: activeBooking.inquiryId,
        bookingId: activeBooking.bookingId,
        hotels: (activeBooking.hotels || []).map(h => ({
          hotelName: h.hotelName,
          hotelId: h.hotelId,
          city: h.city,
          roomCategory: h.roomCategory,
          b2bTotalCost: getHotelExtraBedDetails(h).b2bTotal,
          status: h.status,
          confirmationNumber: h.confirmationNumber,
        })),
        transport: activeBooking.transport,
        totalB2BCost: liveMargins.b2bGrandTotal,
        clientSellingPrice: liveMargins.sellingPrice,
        advanceReceived: activeBooking.advanceAmountPaid || 0,
        paymentMode: activeBooking.paymentMode,
        utrNumber: activeBooking.utrNumber,
        paymentProofUrl: activeBooking.paymentProofUrl,
        experiencesTotalCost: experiencesBreakdown.wanderphiliaTotal,
        experiencesListWithCost: experiencesBreakdown.wanderphiliaListText,
        extraAmountPaidByTransportVendor: experiencesBreakdown.vendorTotal,
        extraAmountDetails: experiencesBreakdown.vendorListText,
      };

      const res = await fetch('/api/operations/sync-finance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSyncFinanceSuccess(true);
        setSyncFinanceResponse(json);
        setActiveBooking(prev => (prev ? { ...prev, opsStatus: 'synced_to_finance', isSyncToFinance: true } : prev));
      } else {
        setSyncFinanceError(json.error || 'Failed to push to Zoho Finance.');
      }
    } catch (err: any) {
      setSyncFinanceError(err?.message || 'Error connecting to Zoho Finance sync endpoint.');
    } finally {
      setIsSyncingFinance(false);
    }
  };

  // Send Voucher to Client via Email
  const handleSendVoucherToClient = async () => {
    if (!activeBooking) return;
    const recipient = voucherRecipientEmail.trim() || activeBooking.customerEmail?.trim() || '';
    if (!recipient || !recipient.includes('@')) {
      setVoucherSendError('Please enter a valid client email address.');
      return;
    }

    setIsSendingVoucher(true);
    setVoucherSendSuccess(null);
    setVoucherSendError(null);

    const token =
      opsToken ||
      (typeof window !== 'undefined'
        ? localStorage.getItem('wanderphilia_ops_token') ||
          sessionStorage.getItem('wanderphilia_ops_token') ||
          localStorage.getItem('wanderphilia_sales_token') ||
          ''
        : '');

    try {
      const res = await fetch('/api/operations/send-voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          bookingId: activeBooking.id || activeBooking.inquiryId,
          recipientEmail: recipient,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setVoucherSendSuccess(`Official Confirmation Voucher sent successfully to ${recipient}!`);
        setActiveBooking(prev =>
          prev ? { ...prev, voucherSentAt: json.sentAt, voucherSentTo: json.sentTo } : prev
        );
      } else {
        setVoucherSendError(json.error || 'Failed to dispatch voucher email.');
      }
    } catch (err: any) {
      setVoucherSendError(err?.message || 'Network error sending voucher.');
    } finally {
      setIsSendingVoucher(false);
    }
  };

  // Print or Save Voucher as PDF
  const handlePrintVoucher = () => {
    if (!activeBooking) return;
    const html = generateVoucherHtml(activeBooking);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  // If Not Authenticated, show PIN Prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">Operations Console Access</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter Operations Security PIN to view this booking record.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              placeholder="Enter PIN (e.g. 7404)"
              value={enteredPin}
              onChange={e => setEnteredPin(e.target.value)}
              className="w-full text-center text-2xl tracking-widest font-mono font-bold bg-slate-950 border border-slate-700 rounded-2xl py-3 text-white focus:outline-none focus:border-orange-500"
              autoFocus
            />

            {pinError && <p className="text-xs text-red-400 font-medium">{pinError}</p>}

            <button
              type="submit"
              disabled={isVerifyingPin || !enteredPin}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 font-black text-white rounded-2xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {isVerifyingPin ? 'Verifying PIN...' : 'Unlock Booking Workspace'}
            </button>
          </form>

          <Link
            href="/wanderphilia-operations"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Operations Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-center p-6 text-slate-400 space-y-3">
        <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto" />
        <h2 className="text-base font-bold text-white">Loading Operations Booking...</h2>
        <p className="text-xs text-slate-500">Record: {bookingIdParam}</p>
      </div>
    );
  }

  // Error State
  if (fetchError || !activeBooking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="max-w-md">
          <h2 className="text-lg font-black text-white">Booking Record Not Found</h2>
          <p className="text-xs text-slate-400 mt-1">{fetchError || `No booking matching ID: ${bookingIdParam}`}</p>
        </div>
        <Link
          href="/wanderphilia-operations"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const prog = computeBookingSlaAndProgress(activeBooking);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* TOP EXECUTIVE HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/wanderphilia-operations"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-orange-400" />
              <span>Dashboard</span>
            </Link>

            <div className="h-5 w-px bg-slate-800 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2 py-0.5 rounded-md">
                  {activeBooking.inquiryId}
                </span>
                <h1 className="text-sm sm:text-base font-black text-white tracking-tight">
                  {activeBooking.customerName}
                </h1>
                <span className="text-xs text-slate-400 font-medium hidden md:inline">
                  &bull; {activeBooking.destination} ({activeBooking.noOfNights}N/{activeBooking.noOfDays}D)
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zoho CRM Master Data Active ({masterData?.stats?.hotelsCount || 45} Hotels &bull; {masterData?.stats?.vehiclesCount || 6} Vehicles)
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setVoucherRecipientEmail(activeBooking.customerEmail || '');
                setVoucherSendSuccess(null);
                setVoucherSendError(null);
                setIsVoucherModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer border border-emerald-500/40"
              title="Overview & Dispatch Official Confirmation Voucher to Client"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span>Client Voucher 📄</span>
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSavingChanges}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 border border-orange-500/40"
            >
              {isSavingChanges ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>

            <Link
              href="/wanderphilia-sales"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sales Hub ⇄</span>
            </Link>

            <button
              onClick={() => {
                fetchBooking();
                fetchZohoMasterData();
              }}
              disabled={isLoading || isLoadingMasterData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
              title="Refresh Record & Master Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(isLoading || isLoadingMasterData) ? 'animate-spin text-orange-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700 rounded-xl text-xs font-semibold"
              title="Lock Console"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN FULL-WIDTH WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* SUCCESS & ERROR NOTIFICATIONS */}
        {saveSuccessMessage && (
          <div className="p-3.5 bg-emerald-950/80 border border-emerald-600 rounded-2xl text-xs text-emerald-200 flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">{saveSuccessMessage}</span>
            </div>
          </div>
        )}

        {saveErrorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-700 rounded-2xl text-xs text-red-300 flex items-center justify-between shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="font-bold">{saveErrorMessage}</span>
            </div>
          </div>
        )}

        {/* 48-HOUR SLA STATUS BANNER */}
        {(() => {
          if (prog.isSynced) {
            return (
              <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/70 text-xs shadow-md">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                  <div>
                    <span className="font-black text-purple-200 block text-sm">
                      Synced to Zoho Finance Module ✓
                    </span>
                    <span className="text-[11px] text-purple-300/80">
                      All supplier B2B costs &amp; booking details are locked in Zoho CRM Finance module.
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-purple-900/60 text-purple-300 border border-purple-700 uppercase">
                  SLA Completed
                </span>
              </div>
            );
          }

          if (prog.isOverdue) {
            return (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-600 text-xs shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-900/90 border border-red-500 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5 text-red-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-red-200 text-sm">
                        🚨 48-Hour Operations SLA Breached
                      </span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-red-600 text-white animate-pulse">
                        {prog.daysOverdue} Day{prog.daysOverdue > 1 ? 's' : ''} Overdue ({prog.hoursElapsed}h Total)
                      </span>
                    </div>
                    <p className="text-[11px] text-red-200/90 mt-1 leading-relaxed">
                      This booking has exceeded the 2-day SLA. Daily escalation alert emails are sent to <strong className="text-white underline">operations@wanderphilia.com</strong> and <strong className="text-white underline">experiences@wanderphilia.com</strong>.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-[11px] font-bold text-red-300 px-3 py-1.5 rounded-xl bg-red-900/50 border border-red-700">
                    {prog.confirmedHotels}/{prog.totalHotels} Hotels • {prog.isTransportConfirmed ? 'Cab Booked' : 'Cab Pending'}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/70 text-xs">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-200 block text-sm">
                      48-Hour Operations SLA Active
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      {prog.hoursLeft} Hours Remaining
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-300/80 mt-0.5 block">
                    Secure hotel confirmations and vehicle dispatch within 2 calendar days of customer advance payment.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-700">
                  {prog.confirmedHotels}/{prog.totalHotels} Hotels • {prog.isTransportConfirmed ? 'Cab Booked' : 'Cab Pending'}
                </span>
              </div>
            </div>
          );
        })()}

        {/* HERO CARD & OPERATIONAL CONTROLS */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
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

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5">
                {activeBooking.customerName} - {activeBooking.destination} Tour
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                {activeBooking.customerMobile && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <a href={`tel:${activeBooking.customerMobile}`} className="hover:text-orange-400 underline">
                      {activeBooking.customerMobile}
                    </a>
                  </span>
                )}
                {activeBooking.customerEmail && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeBooking.customerEmail}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
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

          {/* ZOHO CRM OPERATIONS STATUS SWITCHES (CustomModule11) */}
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
              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    ...activeBooking,
                    isTransportBooked: !activeBooking.isTransportBooked,
                    transport: {
                      ...activeBooking.transport,
                      status: !activeBooking.isTransportBooked ? 'confirmed' : 'assigned',
                    },
                  })
                }
                className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  activeBooking.isTransportBooked || activeBooking.transport?.status === 'confirmed'
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

              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    ...activeBooking,
                    isAllHotelsBooked: !activeBooking.isAllHotelsBooked,
                  })
                }
                className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  allHotelsConfirmed || activeBooking.isAllHotelsBooked
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

              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    ...activeBooking,
                    isActivitiesBooked: !activeBooking.isActivitiesBooked,
                  })
                }
                className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  activeBooking.isActivitiesBooked
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

              <button
                type="button"
                onClick={() =>
                  setActiveBooking({
                    ...activeBooking,
                    isManualCalculation: !activeBooking.isManualCalculation,
                  })
                }
                className={`flex items-center justify-between p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  activeBooking.isManualCalculation
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60">
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

          {/* 5-COLUMN OVERVIEW METRICS CARD (FULL SCREEN SPREAD) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Col 1: Client Selling Price */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Client Selling Price
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                  Without Taxes
                </span>
              </div>
              <div className="text-xl font-black text-white">
                ₹{liveMargins.sellingWithoutTaxes.toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <span className="block text-slate-400">
                  Total (With 5% GST): <strong className="text-slate-300 font-mono">₹{liveMargins.sellingPrice.toLocaleString('en-IN')}</strong>
                </span>
                <span className="text-emerald-400 block font-semibold">
                  Advance: ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')} (With Taxes)
                </span>
              </div>
            </div>

            {/* Col 2: B2B Hotels Total */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                B2B Hotels Total
              </span>
              <div className="text-xl font-black text-slate-200">
                ₹{liveMargins.b2bHotelTotal.toLocaleString('en-IN')}
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span>Client Quoted:</span>
                  <strong className="text-amber-300 font-mono">₹{liveMargins.clientHotelTotal.toLocaleString('en-IN')}</strong>
                  <span className={`font-mono text-[9px] font-bold ${liveMargins.hotelDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {liveMargins.hotelDiff >= 0 ? '+' : ''}₹{liveMargins.hotelDiff.toLocaleString('en-IN')} diff
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {activeBooking.hotels?.length || 0} Property Stays
                </span>
              </div>
            </div>

            {/* Col 3: B2B Transport Total */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                B2B Transport Total
              </span>
              <div className="text-xl font-black text-slate-200">
                ₹{liveMargins.b2bTransportTotal.toLocaleString('en-IN')}
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span>Client Quoted:</span>
                  <strong className="text-amber-300 font-mono">₹{liveMargins.clientTransportTotal.toLocaleString('en-IN')}</strong>
                  <span className={`font-mono text-[9px] font-bold ${liveMargins.transportDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {liveMargins.transportDiff >= 0 ? '+' : ''}₹{liveMargins.transportDiff.toLocaleString('en-IN')} diff
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {activeBooking.transport?.totalDays || activeBooking.noOfDays} Days Vehicle Cost
                </span>
              </div>
            </div>

            {/* Col 4: Activities Total */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Activities Total
              </span>
              <div className="text-xl font-black text-slate-200">
                ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className="text-sky-400 font-medium">
                    Company: ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-amber-400 font-medium">
                    Vendor: ₹{experiencesBreakdown.vendorTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  {experiencesBreakdown.wanderphiliaCount + experiencesBreakdown.vendorCount} Experiences Included
                </span>
              </div>
            </div>

            {/* Col 5: Total Combined Operations B2B Cost */}
            <div className="space-y-1 bg-gradient-to-br from-emerald-950/40 to-teal-950/40 p-3 rounded-xl border border-emerald-500/40 shadow-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                  Total B2B Cost
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Hotels + Cab + Exp
                </span>
              </div>
              <div className="text-xl font-black text-emerald-300">
                ₹{(liveMargins.b2bHotelTotal + liveMargins.b2bTransportTotal + experiencesBreakdown.wanderphiliaTotal).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-slate-400 space-y-0.5">
                <div className="font-mono text-[9.5px] text-slate-300 truncate" title={`₹${liveMargins.b2bHotelTotal.toLocaleString('en-IN')} (H) + ₹${liveMargins.b2bTransportTotal.toLocaleString('en-IN')} (T) + ₹${experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')} (A)`}>
                  ₹{liveMargins.b2bHotelTotal.toLocaleString('en-IN')} (H) + ₹{liveMargins.b2bTransportTotal.toLocaleString('en-IN')} (T) + ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')} (A)
                </div>
                <span className="text-emerald-400/90 font-semibold block text-[9.5px]">
                  Total Operations B2B Cost
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 MAIN TABS NAVIGATION */}
        <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'hotels', label: `Hotels & B2B Rates (${activeBooking.hotels?.length || 0})`, icon: Building2 },
            { id: 'transport', label: 'Transport & Chauffeur Dispatch', icon: Car },
            { id: 'activities', label: 'Activities & Experiences Operations', icon: Compass },
            { id: 'itinerary', label: 'Itinerary Overview', icon: FileText },
            { id: 'finance', label: 'Payment & Finance Sync', icon: DollarSign },
          ].map(t => {
            const Icon = t.icon;
            const isTabActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isTabActive
                    ? 'border-orange-500 text-orange-400 bg-orange-950/20'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: HOTELS & B2B RATES */}
        {activeTab === 'hotels' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hotel Booking Checklist &bull; B2B Cost Per Property
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click <strong className="text-orange-400">Swap Hotel</strong> to replace with Zoho CRM Master Property or custom offline hotel.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {(activeBooking.hotels || []).map((hotel, index) => {
                const extra = getHotelExtraBedDetails(hotel);
                const isConfirmed = hotel.status === 'confirmed';
                const stay = getHotelStayDetails(hotel, index, activeBooking.hotels || [], activeBooking.travelStartDate);

                return (
                  <div
                    key={hotel.id || index}
                    className={`bg-slate-900 border rounded-2xl p-4 sm:p-5 space-y-4 transition-all ${
                      isConfirmed
                        ? 'border-emerald-600/70 shadow-sm'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-orange-600/20 text-orange-400 font-mono font-bold text-xs flex items-center justify-center border border-orange-500/30">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="text"
                              value={hotel.hotelName || ''}
                              onChange={e => {
                                const newHotels = [...(activeBooking.hotels || [])];
                                newHotels[index] = {
                                  ...newHotels[index],
                                  hotelName: e.target.value,
                                  hotelId: undefined,
                                };
                                setActiveBooking({ ...activeBooking, hotels: newHotels });
                              }}
                              className="font-black text-base text-white bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-700 focus:border-orange-500 focus:outline-none"
                              placeholder="Hotel Name"
                            />

                            {/* Prominent Stay Duration Badge */}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-black shadow-xs">
                              🌙 {stay.nights}N ({stay.nights} {stay.nights > 1 ? 'Nights' : 'Night'})
                            </span>

                            {/* Check-in & Check-out Date Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-xs flex-wrap">
                              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider">Check-in:</span>
                              <strong className="text-white font-extrabold">{stay.checkIn}</strong>
                              <span className="text-amber-500 font-bold mx-0.5">➔</span>
                              <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider">Check-out:</span>
                              <strong className="text-white font-extrabold">{stay.checkOut}</strong>
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 flex-wrap mt-1.5">
                            <span className="text-xs text-slate-400">
                              City: <strong className="text-slate-300">{hotel.city || 'TBA'}</strong> &bull; Category: <span className="text-orange-400 font-bold">{hotel.category || 'Deluxe'}</span>
                            </span>

                            {/* Optional override inputs for check-in / check-out */}
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Override Dates:</span>
                              <input
                                type="text"
                                placeholder={stay.checkIn}
                                value={hotel.checkIn || ''}
                                onChange={e => {
                                  const newHotels = [...(activeBooking.hotels || [])];
                                  newHotels[index] = { ...newHotels[index], checkIn: e.target.value };
                                  setActiveBooking({ ...activeBooking, hotels: newHotels });
                                }}
                                className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-[10px] font-mono text-white w-24 placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                                title="Custom Check-in Date"
                              />
                              <span>➔</span>
                              <input
                                type="text"
                                placeholder={stay.checkOut}
                                value={hotel.checkOut || ''}
                                onChange={e => {
                                  const newHotels = [...(activeBooking.hotels || [])];
                                  newHotels[index] = { ...newHotels[index], checkOut: e.target.value };
                                  setActiveBooking({ ...activeBooking, hotels: newHotels });
                                }}
                                className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-[10px] font-mono text-white w-24 placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                                title="Custom Check-out Date"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={hotel.status || 'requested'}
                          onChange={e => {
                            const newHotels = [...(activeBooking.hotels || [])];
                            newHotels[index] = {
                              ...newHotels[index],
                              status: e.target.value as any,
                            };
                            setActiveBooking({ ...activeBooking, hotels: newHotels });
                          }}
                          className={`text-xs font-bold rounded-xl px-3 py-1.5 border focus:outline-none cursor-pointer ${
                            isConfirmed
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                        >
                          <option value="requested">Requested (Pending)</option>
                          <option value="confirmed">✓ Confirmed (Booked)</option>
                          <option value="sold_out">Sold Out</option>
                          <option value="issue">Issue</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleOpenSwapModal(index)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer shadow-sm"
                        >
                          Swap Hotel ⇄
                        </button>
                      </div>
                    </div>

                    {/* Room & Price details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Room Category</span>
                        <span className="font-bold text-white block mt-0.5">{hotel.roomCategory || 'Deluxe Room'}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ₹{extra.pricePerNight.toLocaleString('en-IN')}/nt &bull; {extra.nights}N &bull; {extra.rooms}R
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Room B2B Cost</span>
                        <span className="font-mono font-black text-slate-200 block mt-0.5">
                          ₹{extra.hotelRoomTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase block">Extra Bed / Child</span>
                        <span className="font-mono font-bold text-slate-300 block mt-0.5">
                          +₹{(extra.extraBedTotal + extra.childNoBedTotal).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9.5px] text-slate-500 block">
                          {extra.count} Bed(s), {extra.childCount} Child
                        </span>
                      </div>

                      <div className="bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-600/40">
                        <span className="text-[10px] text-emerald-400 font-black uppercase block">Total B2B Payable</span>
                        <span className="font-mono text-base font-black text-emerald-300 block mt-0.5">
                          ₹{extra.b2bTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Booking Reference, Voucher & Proof Attachment */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Booking Ref # / Voucher # (e.g. VOUCH-9812)"
                          value={hotel.confirmationNumber || ''}
                          onChange={e => {
                            const newHotels = [...(activeBooking.hotels || [])];
                            newHotels[index] = {
                              ...newHotels[index],
                              confirmationNumber: e.target.value,
                            };
                            setActiveBooking({ ...activeBooking, hotels: newHotels });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Voucher PDF Link / Image URL"
                          value={hotel.voucherUrl || ''}
                          onChange={e => {
                            const newHotels = [...(activeBooking.hotels || [])];
                            newHotels[index] = {
                              ...newHotels[index],
                              voucherUrl: e.target.value,
                            };
                            setActiveBooking({ ...activeBooking, hotels: newHotels });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* Hotel Proof Upload */}
                      <div className="shrink-0 flex items-center gap-2">
                        {hotel.proofUrl ? (
                          <div className="flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-2.5 py-1.5 rounded-xl text-xs font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <a href={hotel.proofUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[120px]">
                              {hotel.proofFileName || 'Proof ↗'}
                            </a>
                            <button
                              type="button"
                              onClick={() => handleUpdateHotelProof(index, '', '')}
                              className="text-slate-400 hover:text-red-400 ml-1 cursor-pointer"
                              title="Remove proof"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            hotel.isManualCost
                              ? 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse hover:bg-red-900'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          }`}>
                            <Paperclip className="w-3.5 h-3.5 shrink-0" />
                            <span>{isUploadingProof === `hotel-${index}` ? 'Uploading...' : hotel.isManualCost ? '⚠️ Proof Req.' : '+ Upload Proof'}</span>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              disabled={isUploadingProof === `hotel-${index}`}
                              onChange={e => {
                                const f = e.target.files?.[0];
                                if (f) handleProofFileUpload(f, `hotel-${index}`, (url, name) => {
                                  handleUpdateHotelProof(index, url, name);
                                });
                              }}
                            />
                          </label>
                        )}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-orange-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Assigned Transport &amp; Chauffeur Details</h3>
                    <span className="text-[10px] text-slate-400">
                      Synced with Zoho CRM Vehicles &bull; Matches CustomModule11
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generateDriverDutySlip(), 'Duty Slip Copied!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                    title="Generate WhatsApp Chauffeur Duty Slip"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedText === 'Duty Slip Copied!' ? '✓ Copied!' : 'Copy Driver Duty Slip'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Vehicle Selection */}
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
                            vehicleId: matchVeh?.id || undefined,
                            costPerDay: perDay,
                            totalDays: days,
                            b2bTotalCost: newCost,
                          } as any,
                        });
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Select Zoho Vehicle ({showAllVehicleStates ? 'All States' : (activeBooking.destination || 'State')}) --</option>
                      {availableVehiclesForBooking.map(v => (
                        <option key={v.id} value={v.name}>
                          {v.name} {v.state ? `(${v.state})` : ''} • ₹{(v.cost || 0).toLocaleString('en-IN')}/day
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Dedicated Private AC Cab"
                      value={activeBooking.transport?.vehicleType || ''}
                      onChange={e =>
                        setActiveBooking({
                          ...activeBooking,
                          transport: { ...activeBooking.transport, vehicleType: e.target.value } as any,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Transport Vendor */}
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
                        placeholder="Enter custom vendor name"
                        value={activeBooking.transport?.vendorName || ''}
                        onChange={e => {
                          setActiveBooking({
                            ...activeBooking,
                            transport: { ...activeBooking.transport, vendorName: e.target.value } as any,
                          });
                        }}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomVendor(false)}
                        className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] rounded-xl font-bold whitespace-nowrap cursor-pointer"
                        title="Switch back to Zoho Vendors list"
                      >
                        List ↩
                      </button>
                    </div>
                  ) : availableVendorsForBooking.length > 0 ? (
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
                            } as any,
                          });
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none cursor-pointer"
                    >
                      <option value="">-- Select Vendor ({showAllVendors ? 'All States' : (activeBooking.destination || 'State')}) --</option>
                      {availableVendorsForBooking.map(v => (
                        <option key={v.id} value={v.id}>
                          {v.name} {v.city ? `(${v.city})` : (v.state ? `(${v.state})` : '')} {v.costPerDay ? `• ₹${v.costPerDay}/day` : ''}
                        </option>
                      ))}
                      <option value="__custom__">✏️ Custom / Other Vendor</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Vendor Name"
                      value={activeBooking.transport?.vendorName || ''}
                      onChange={e =>
                        setActiveBooking({
                          ...activeBooking,
                          transport: { ...activeBooking.transport, vendorName: e.target.value } as any,
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                    />
                  )}
                </div>

                {/* Vehicle Cost */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vehicle Cost (B2B Total ₹)</label>
                  <input
                    type="number"
                    value={activeBooking.transport?.b2bTotalCost || ''}
                    onChange={e => {
                      const newTotal = Number(e.target.value) || 0;
                      const days = activeBooking.transport?.totalDays || activeBooking.noOfDays || 1;
                      setActiveBooking({
                        ...activeBooking,
                        transport: {
                          ...activeBooking.transport,
                          b2bTotalCost: newTotal,
                          costPerDay: days > 0 ? Math.round(newTotal / days) : newTotal,
                          isManualCost: true,
                        } as any,
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-400 font-mono font-bold focus:border-orange-500 focus:outline-none"
                  />
                  <span className="text-[9.5px] text-slate-400 mt-1 block font-mono">
                    ₹{(activeBooking.transport?.costPerDay || 0).toLocaleString('en-IN')}/day &times; {activeBooking.transport?.totalDays || activeBooking.noOfDays || 1} Days
                  </span>
                </div>

                {/* Driver Details */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Driver &amp; Vehicle #</label>
                  <input
                    type="text"
                    placeholder="Chauffeur Name (e.g. Ramesh Singh)"
                    value={activeBooking.transport?.driverName || ''}
                    onChange={e =>
                      setActiveBooking({
                        ...activeBooking,
                        transport: { ...activeBooking.transport, driverName: e.target.value } as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none mb-1.5"
                  />
                  <input
                    type="text"
                    placeholder="Chauffeur Mobile Number"
                    value={activeBooking.transport?.driverMobile || ''}
                    onChange={e =>
                      setActiveBooking({
                        ...activeBooking,
                        transport: { ...activeBooking.transport, driverMobile: e.target.value } as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Transport Vendor Rate Proof / Quotation Attachment */}
              <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-orange-400" />
                    Transport Vendor Quotation / Rate Proof Screenshot
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {activeBooking.transport?.isManualCost
                      ? '⚠️ Manual transport cost entered: Vendor quotation screenshot proof is mandatory.'
                      : 'Upload vendor rate quotation sheet or WhatsApp rate screenshot.'}
                  </span>
                </div>

                {activeBooking.transport?.proofUrl ? (
                  <div className="flex items-center gap-2 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
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
                  <label className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition shrink-0 ${
                    activeBooking.transport?.isManualCost
                      ? 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse hover:bg-red-900'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingProof === 'transport' ? 'Uploading...' : activeBooking.transport?.isManualCost ? '⚠️ Upload Mandatory Proof' : '+ Upload Proof'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={isUploadingProof === 'transport'}
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
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITIES & EXPERIENCES */}
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      activeBooking.isActivitiesBooked
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

                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">
                      Total Activities Cost
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {experiencesBreakdown.wanderphiliaCount + experiencesBreakdown.vendorCount} Total
                    </span>
                  </div>
                  <div className="text-base font-black text-white font-mono">
                    ₹{(experiencesBreakdown.wanderphiliaTotal + experiencesBreakdown.vendorTotal).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Combined across company &amp; cab vendor
                  </span>
                </div>
              </div>
            </div>

            {/* DAY-BY-DAY ACTIVITIES BREAKDOWN */}
            {Array.isArray(activeBooking.dayActivities) && activeBooking.dayActivities.length > 0 ? (
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
                            <span className="font-mono text-amber-300 font-bold bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-xl">
                              📅 {stayDateStr}
                            </span>
                          )}
                          <h4 className="text-white font-bold text-sm">
                            {act.title || `Day ${dayNum}`}
                          </h4>
                          {act.city && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                              📍 {act.city}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {act.stayLocation && (
                            <span className="px-2.5 py-1 rounded-xl bg-indigo-950/80 border border-indigo-700/80 text-indigo-300 font-bold text-[11px] flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              <span>Hotel: {act.stayLocation}</span>
                            </span>
                          )}

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

                      {/* Day description */}
                      {act.description && (
                        <p className="mt-3 text-slate-300 text-xs leading-relaxed">
                          {act.description}
                        </p>
                      )}

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

        {/* TAB 5: PAYMENT & FINANCE SYNC */}
        {activeTab === 'finance' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                    Payment Verification &amp; Zoho Finance Push
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Verify client quotation, advance received, and push supplier payables to Zoho CRM Finance.
                  </p>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Quotation</span>
                  <div className="text-xl font-black text-white mt-1">
                    ₹{(activeBooking.totalQuotationAmount || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    (With 5% GST) &bull; Pre-Tax: ₹{Math.round((activeBooking.totalQuotationAmount || 0) / 1.05).toLocaleString('en-IN')} (Without Taxes)
                  </span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Advance Paid</span>
                    <span className="text-[9px] text-emerald-400/80 font-mono">(Editable)</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-base font-black text-emerald-400">₹</span>
                    <input
                      type="number"
                      value={activeBooking.advanceAmountPaid ?? 0}
                      onChange={e => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        const tot = activeBooking.totalQuotationAmount || 0;
                        setActiveBooking({
                          ...activeBooking,
                          advanceAmountPaid: val,
                          balancePendingAmount: Math.max(0, tot - val),
                        });
                      }}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-emerald-500 focus:border-emerald-400 rounded-lg px-2 py-1 text-base font-black text-emerald-400 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-400/80 block mt-0.5 font-semibold">
                    (With Taxes) &bull; Click "Save Changes" to sync
                  </span>
                </div>

                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Balance Due</span>
                  <div className="text-xl font-black text-amber-400 mt-1">
                    ₹{Math.max(0, (activeBooking.totalQuotationAmount || 0) - (activeBooking.advanceAmountPaid || 0)).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-400/80 block mt-0.5 font-semibold">
                    (With Taxes)
                  </span>
                </div>
              </div>

              {/* Bank UTR & Payment Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Bank UTR / Transaction Reference
                  </label>
                  <input
                    type="text"
                    value={activeBooking.utrNumber || ''}
                    onChange={e => setActiveBooking({ ...activeBooking, utrNumber: e.target.value })}
                    placeholder="Enter Bank UTR (e.g. 523491823)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={activeBooking.paymentMode || 'bank_transfer'}
                    onChange={e => setActiveBooking({ ...activeBooking, paymentMode: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                    <option value="upi">UPI / GPay / PhonePe</option>
                    <option value="razorpay">Razorpay Gateway</option>
                    <option value="cheque">Cheque</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>

              {/* SYNC TO ZOHO FINANCE ACTION BUTTON */}
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSyncModalOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-400/40"
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Sync Booking &amp; B2B Costs to Zoho Finance Module</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* SYNC TO FINANCE CONFIRMATION MODAL */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Push to Zoho Finance</h3>
                  <p className="text-[11px] text-slate-400">Lock operations B2B costs into Zoho CRM</p>
                </div>
              </div>
              <button
                onClick={() => setIsSyncModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Client Selling Price (With 5% GST)</span>
                <span className="text-base font-black text-white">₹{liveMargins.sellingPrice.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-slate-500 block font-mono">
                  Pre-Tax: ₹{liveMargins.sellingWithoutTaxes.toLocaleString('en-IN')} (Without Taxes)
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block">Total Operations B2B Cost</span>
                  <span className="text-[11px] text-slate-300">Hotels + Transport + Activities</span>
                </div>
                <span className="text-base font-black text-emerald-300">
                  ₹{(liveMargins.b2bHotelTotal + liveMargins.b2bTransportTotal + experiencesBreakdown.wanderphiliaTotal).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {syncFinanceError && (
              <div className="p-3 bg-red-950/80 border border-red-700 rounded-xl text-xs text-red-300">
                {syncFinanceError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFinanceSync}
                disabled={isSyncingFinance}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSyncingFinance ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{isSyncingFinance ? 'Pushing to Zoho...' : 'Confirm & Sync Finance'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VOUCHER OVERVIEW & DISPATCH MODAL */}
      {isVoucherModalOpen && activeBooking && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] bg-slate-900 border-0 sm:border border-slate-700 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-3 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-2.5 bg-slate-950/80">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    Official Confirmation Voucher
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                      Paid Experiences Only
                    </span>
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    Review trip details, print PDF, or dispatch directly to guest email.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/api/operations/voucher-pdf?id=${activeBooking.inquiryId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 text-xs font-bold transition-all border border-orange-500/40 cursor-pointer"
                  title="Download Voucher PDF"
                >
                  <Download className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden xs:inline">Download PDF</span>
                </a>

                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden xs:inline">Print</span>
                </button>

                <button
                  onClick={() => setIsVoucherModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-lg font-bold leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Email Dispatch Control Bar */}
            <div className="p-2.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <input
                  type="email"
                  value={voucherRecipientEmail}
                  onChange={e => setVoucherRecipientEmail(e.target.value)}
                  placeholder="Client Email Address (e.g. guest@example.com)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSendVoucherToClient}
                  disabled={isSendingVoucher || !voucherRecipientEmail}
                  className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSendingVoucher ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isSendingVoucher ? 'Sending...' : 'Send Voucher to Client'}</span>
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {voucherSendSuccess && (
              <div className="p-2.5 bg-emerald-950/90 border-b border-emerald-600 text-xs text-emerald-200 flex items-center gap-2 px-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold">{voucherSendSuccess}</span>
              </div>
            )}
            {voucherSendError && (
              <div className="p-2.5 bg-red-950/90 border-b border-red-700 text-xs text-red-300 flex items-center gap-2 px-4">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="font-bold">{voucherSendError}</span>
              </div>
            )}

            {/* Live Voucher Preview Iframe */}
            <div className="flex-1 overflow-y-auto p-0 sm:p-3 bg-slate-950/50">
              <iframe
                title="Voucher Preview"
                srcDoc={generateVoucherHtml(activeBooking)}
                className="w-full h-full min-h-[560px] sm:min-h-[640px] rounded-none sm:rounded-2xl border-0 sm:border border-slate-800 bg-[#0b0f19] shadow-inner"
              />
            </div>
          </div>
        </div>
      )}

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
                  {/* Category Filter Pills */}
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

                  {/* Zoho Hotel Dropdown */}
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

                  {/* Zoho Room Category & Live B2B Pricing */}
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
                                  <span className="text-[9px] text-slate-400 font-normal"> /night</span>
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
                    const extraBeds = activeBooking ? bookingExtraBedCalc.extraBedCount : 0;
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
                Confirm Swap &bull; Update Hotel Cost
              </button>
            </div>
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

            <div className="flex items-center justify-end pt-2 border-t border-slate-800">
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
      {/* MODAL: ADD ATTRACTION FROM ZOHO CRM MASTER */}
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
                          {exp.openingTime && <span>🕒 {exp.openingTime} - {exp.closingTime || 'Evening'}</span>}
                          {exp.ppCost > 0 && (
                            <span className="font-mono text-slate-300">
                              ₹{exp.ppCost.toLocaleString('en-IN')}/person
                            </span>
                          )}
                          {exp.privateCost > 0 && (
                            <span className="font-mono text-emerald-400">
                              Private: ₹{exp.privateCost.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-[9px] text-slate-500 uppercase font-bold block">
                            Est. ({pax} Pax)
                          </span>
                          <span className="font-mono font-bold text-amber-400 text-xs">
                            ₹{estimatedCost.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddZohoExperienceToDay(activityModalDayIdx, exp)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Day {activityModalDayIdx + 1}</span>
                        </button>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
