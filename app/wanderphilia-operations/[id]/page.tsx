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
  Upload
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
    activities: any[];
    hotelCount: number;
    vehicleCount: number;
    activityCount: number;
  }>({
    hotelsByCity: {},
    vehicles: [],
    activities: [],
    hotelCount: 0,
    vehicleCount: 0,
    activityCount: 0,
  });
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

  // Swap Hotel Modal
  const [swapModalHotelIndex, setSwapModalHotelIndex] = useState<number | null>(null);
  const [swapSelectedProperty, setSwapSelectedProperty] = useState<any>(null);
  const [swapSelectedRoom, setSwapSelectedRoom] = useState<any>(null);
  const [swapCustomHotelName, setSwapCustomHotelName] = useState<string>('');
  const [swapCustomCostPerNight, setSwapCustomCostPerNight] = useState<string>('');

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

  // Fetch Master Data
  const fetchZohoMasterData = useCallback(async () => {
    setIsLoadingMasterData(true);
    try {
      const res = await fetch('/api/operations/master-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMasterData(json.data);
        }
      }
    } catch (err) {
      console.warn('[Fetch Master Data Warning]:', err);
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

  // Activities Helper
  const matchZohoActivity = useCallback(
    (expName: string, dayCity?: string) => {
      if (!expName || !masterData?.activities) return null;
      const cleanExp = expName.toLowerCase().replace(/[^a-z0-9]/g, '');

      return masterData.activities.find((a: any) => {
        const cleanName = (a.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanName === cleanExp || cleanExp.includes(cleanName) || cleanName.includes(cleanExp)) {
          if (dayCity && a.city) {
            const cleanDayCity = dayCity.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanACity = a.city.toLowerCase().replace(/[^a-z0-9]/g, '');
            return cleanDayCity === cleanACity || cleanDayCity.includes(cleanACity) || cleanACity.includes(cleanDayCity);
          }
          return true;
        }
        return false;
      });
    },
    [masterData?.activities]
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
              onClick={() => fetchBooking()}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
              title="Refresh Record"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
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
                            {hotel.nights && (
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                                {hotel.nights}N ({hotel.nights} Night{hotel.nights > 1 ? 's' : ''})
                              </span>
                            )}
                            {hotel.dates && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                                📅 {hotel.dates}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 mt-1 block">
                            City: <strong className="text-slate-300">{hotel.city || 'TBA'}</strong> &bull; Category: {hotel.category || 'Deluxe'}
                          </span>
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
                          onClick={() => {
                            setSwapModalHotelIndex(index);
                            setSwapSelectedProperty(null);
                            setSwapSelectedRoom(null);
                            setSwapCustomHotelName('');
                            setSwapCustomCostPerNight('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
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

                    {/* Booking Reference & Voucher */}
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
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Car className="w-4 h-4 text-orange-400" />
                Assigned Transport &amp; Chauffeur Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={activeBooking.transport?.vehicleType || ''}
                    onChange={e =>
                      setActiveBooking({
                        ...activeBooking,
                        transport: { ...activeBooking.transport, vehicleType: e.target.value } as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Transport Vendor</label>
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
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Vehicle Cost (B2B Total ₹)</label>
                  <input
                    type="number"
                    value={activeBooking.transport?.b2bTotalCost || ''}
                    onChange={e =>
                      setActiveBooking({
                        ...activeBooking,
                        transport: { ...activeBooking.transport, b2bTotalCost: Number(e.target.value) || 0 } as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Driver Details</label>
                  <input
                    type="text"
                    placeholder="Driver Name &amp; Contact Number"
                    value={activeBooking.transport?.driverName || ''}
                    onChange={e =>
                      setActiveBooking({
                        ...activeBooking,
                        transport: { ...activeBooking.transport, driverName: e.target.value } as any,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVITIES & EXPERIENCES */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    Day-Wise Activities &amp; Sightseeing Operations
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live rates synced from Zoho Activities &amp; Experiences master module.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 font-bold border border-sky-800">
                    Company Paid: ₹{experiencesBreakdown.wanderphiliaTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 font-bold border border-amber-800">
                    Vendor Paid: ₹{experiencesBreakdown.vendorTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {(activeBooking.dayActivities || []).map((day: any, dIdx: number) => {
                  const exps = day.experiences || day.activities || day.sightseeingPoints || [];
                  return (
                    <div key={dIdx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-orange-400">
                          Day {day.dayNumber || dIdx + 1}: {day.title || `Day ${dIdx + 1} Itinerary`}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {exps.length} Activities
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {exps.map((exp: any, eIdx: number) => {
                          const expName = typeof exp === 'string' ? exp : exp.name || exp.title || 'Experience';
                          const status = typeof exp === 'object' ? exp.status || 'requested' : 'requested';
                          const isExpConfirmed = status === 'confirmed';

                          return (
                            <div
                              key={eIdx}
                              className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs ${
                                isExpConfirmed
                                  ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="font-medium truncate">{expName}</span>
                              <select
                                value={status}
                                onChange={e => {
                                  const newDays = [...(activeBooking.dayActivities || [])];
                                  if (typeof newDays[dIdx].experiences[eIdx] === 'object') {
                                    newDays[dIdx].experiences[eIdx].status = e.target.value;
                                  } else {
                                    newDays[dIdx].experiences[eIdx] = {
                                      name: expName,
                                      status: e.target.value,
                                    };
                                  }
                                  setActiveBooking({ ...activeBooking, dayActivities: newDays });
                                }}
                                className="bg-slate-950 border border-slate-700 text-[10px] rounded px-1.5 py-0.5 font-bold cursor-pointer"
                              >
                                <option value="requested">Requested</option>
                                <option value="confirmed">Confirmed</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ITINERARY OVERVIEW */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                Trip Day-Wise Overview
              </h3>

              <div className="space-y-3">
                {(activeBooking.dayActivities || []).map((day: any, dIdx: number) => (
                  <div key={dIdx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-orange-600/20 text-orange-400 font-bold text-xs flex items-center justify-center">
                        {dIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{day.title || `Day ${dIdx + 1}`}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-8">
                      {day.description || day.summary || 'Sightseeing and experiences scheduled for this day.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Advance Paid</span>
                  <div className="text-xl font-black text-emerald-400 mt-1">
                    ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400/80 block mt-0.5 font-semibold">
                    (With Taxes)
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
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Official Confirmation Voucher Overview
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                      Paid Experiences Only
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Review trip details, print PDF, or dispatch directly to guest email.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintVoucher}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <FileText className="w-3.5 h-3.5 text-orange-400" />
                  <span>Print / PDF</span>
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
            <div className="p-3.5 sm:p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
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
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950/50">
              <iframe
                title="Voucher Preview"
                srcDoc={generateVoucherHtml(activeBooking)}
                className="w-full h-[650px] rounded-2xl border border-slate-800 bg-[#0b0f19] shadow-inner"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
