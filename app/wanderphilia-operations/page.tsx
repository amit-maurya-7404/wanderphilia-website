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
  ToggleRight
} from 'lucide-react';
import { OperationsBooking, OperationsHotelItem, OperationsStatus, OperationsSummaryStats } from '@/types/operations';

// City normalization helper matching Zoho CRM master data keys
function normalizeCityKey(city: string): string {
  if (!city) return '';
  return city
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
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
    destinations: string[];
    citiesByDestination: Record<string, string[]>;
    experiencesByCity: Record<string, any[]>;
    stats?: {
      activitiesCount?: number;
      hotelsCount?: number;
      vehiclesCount?: number;
    };
  } | null>(null);
  const [isLoadingMasterData, setIsLoadingMasterData] = useState<boolean>(false);

  // Active Booking Editing State
  const [activeBooking, setActiveBooking] = useState<OperationsBooking | null>(null);
  const [isSavingChanges, setIsSavingChanges] = useState<boolean>(false);
  const [isSyncingFinance, setIsSyncingFinance] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Zoho Master Data Hotel Swap Modal State
  const [swapModalHotelIndex, setSwapModalHotelIndex] = useState<number | null>(null);
  const [swapSourceType, setSwapSourceType] = useState<'zoho' | 'custom'>('zoho');
  const [swapCity, setSwapCity] = useState<string>('');
  const [swapHotelId, setSwapHotelId] = useState<string>('');
  const [swapHotelName, setSwapHotelName] = useState<string>('');
  const [swapRoomCategory, setSwapRoomCategory] = useState<string>('');
  const [swapB2BCostPerNight, setSwapB2BCostPerNight] = useState<number>(0);
  const [swapNights, setSwapNights] = useState<number>(1);
  const [swapRooms, setSwapRooms] = useState<number>(1);
  const [swapManualTotalCost, setSwapManualTotalCost] = useState<string>('');

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

  // Compute live profit margins
  const liveMargins = useMemo(() => {
    if (!activeBooking) {
      return {
        sellingPrice: 0,
        b2bHotelTotal: 0,
        b2bTransportTotal: 0,
        b2bGrandTotal: 0,
        profit: 0,
        marginPct: 0
      };
    }

    const sellingPrice = Number(activeBooking.totalQuotationAmount || 0);
    const b2bHotelTotal = (activeBooking.hotels || []).reduce(
      (sum, h) => sum + (Number(h.b2bTotalCost) || 0),
      0
    );
    const b2bTransportTotal = Number(activeBooking.transport?.b2bTotalCost || 0);
    const b2bGrandTotal = b2bHotelTotal + b2bTransportTotal;
    const profit = sellingPrice - b2bGrandTotal;
    const marginPct = sellingPrice > 0 ? Math.round((profit / sellingPrice) * 100) : 0;

    return {
      sellingPrice,
      b2bHotelTotal,
      b2bTransportTotal,
      b2bGrandTotal,
      profit,
      marginPct
    };
  }, [activeBooking]);

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

    try {
      const updatedData: Partial<OperationsBooking> = {
        ...activeBooking,
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
        setTimeout(() => setSaveSuccessMessage(null), 3000);
      } else {
        alert(data.error || 'Failed to save changes.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Error connecting to operations server.');
    } finally {
      setIsSavingChanges(false);
    }
  };

  // Push to Zoho CRM Finance Module
  const handleSyncToFinance = async () => {
    if (!activeBooking) return;

    const confirmSync = window.confirm(
      `Push final B2B supplier costs for "${activeBooking.customerName}" to Zoho CRM Finance module?\n\nHotel Cost: ₹${liveMargins.b2bHotelTotal.toLocaleString('en-IN')}\nTransport Cost: ₹${liveMargins.b2bTransportTotal.toLocaleString('en-IN')}\nNet Margin: ₹${liveMargins.profit.toLocaleString('en-IN')} (${liveMargins.marginPct}%)`
    );
    if (!confirmSync) return;

    setIsSyncingFinance(true);
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
          transport: activeBooking.transport
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('🎉 Successfully synced to Zoho CRM Finance module!');
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
        alert(`Finance sync warning: ${data.error || 'Could not complete Zoho CRM Finance push.'}`);
      }
    } catch (err) {
      console.error('Finance sync error:', err);
      alert('Network error communicating with Zoho Finance API.');
    } finally {
      setIsSyncingFinance(false);
    }
  };

  // Open Swap Modal for a hotel
  const handleOpenSwapModal = (hotelIndex: number) => {
    if (!activeBooking || !activeBooking.hotels[hotelIndex]) return;
    const targetHotel = activeBooking.hotels[hotelIndex];
    setSwapModalHotelIndex(hotelIndex);
    setSwapCity(targetHotel.city || '');
    setSwapHotelName(targetHotel.hotelName || '');
    setSwapRoomCategory(targetHotel.roomCategory || '');
    setSwapB2BCostPerNight(targetHotel.b2bCostPerNight || 0);
    setSwapNights(targetHotel.nights || 1);
    setSwapRooms(targetHotel.roomsCount || activeBooking.roomsCount || 1);
    setSwapManualTotalCost(String(targetHotel.b2bTotalCost || ''));

    // Check if city exists in Zoho master data
    const cityKey = normalizeCityKey(targetHotel.city);
    const hasZohoHotels = masterData?.hotelsByCity?.[cityKey]?.length;
    setSwapSourceType(hasZohoHotels ? 'zoho' : 'custom');
  };

  // List of Zoho hotels for the currently selected city
  const availableZohoHotelsForCity = useMemo(() => {
    if (!masterData?.hotelsByCity || !swapCity) return [];
    const cityKey = normalizeCityKey(swapCity);
    return masterData.hotelsByCity[cityKey] || [];
  }, [masterData, swapCity]);

  // Selected Zoho hotel object
  const selectedZohoHotelObj = useMemo(() => {
    return availableZohoHotelsForCity.find((h: any) => String(h.id) === String(swapHotelId)) || null;
  }, [availableZohoHotelsForCity, swapHotelId]);

  // Available room categories for selected Zoho hotel
  const availableRoomsForSelectedHotel: any[] = useMemo(() => {
    if (!selectedZohoHotelObj?.rooms || !Array.isArray(selectedZohoHotelObj.rooms)) return [];
    return selectedZohoHotelObj.rooms;
  }, [selectedZohoHotelObj]);

  // Handle hotel selection from Zoho dropdown
  const handleSelectZohoHotel = (hId: string) => {
    setSwapHotelId(hId);
    const found = availableZohoHotelsForCity.find((h: any) => String(h.id) === String(hId));
    if (found) {
      setSwapHotelName(found.hotelName);
      if (found.rooms && found.rooms.length > 0) {
        const firstRoom = found.rooms[0];
        setSwapRoomCategory(firstRoom.roomCategory);
        setSwapB2BCostPerNight(firstRoom.basePrice || 0);
      } else {
        setSwapRoomCategory('Standard Room');
        setSwapB2BCostPerNight(found.basePrice || 0);
      }
    }
  };

  // Handle room category selection from Zoho hotel
  const handleSelectZohoRoomCategory = (roomCatName: string) => {
    setSwapRoomCategory(roomCatName);
    const roomMatch = availableRoomsForSelectedHotel.find((r: any) => r.roomCategory === roomCatName);
    if (roomMatch) {
      setSwapB2BCostPerNight(roomMatch.basePrice || 0);
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

    if (swapSourceType === 'zoho') {
      computedTotalCost = swapB2BCostPerNight * swapNights * swapRooms;
      isManual = false;
    } else {
      computedTotalCost = Number(swapManualTotalCost) || 0;
      finalB2BCostPerNight = swapNights > 0 ? Math.round(computedTotalCost / swapNights) : computedTotalCost;
      isManual = true;
    }

    const updatedHotels = [...activeBooking.hotels];
    const prev = updatedHotels[swapModalHotelIndex];

    updatedHotels[swapModalHotelIndex] = {
      ...prev,
      city: swapCity || prev.city,
      hotelName: finalHotelName || prev.hotelName,
      hotelId: swapSourceType === 'zoho' && swapHotelId ? swapHotelId : prev.hotelId,
      roomCategory: finalRoomCategory || prev.roomCategory,
      nights: swapNights,
      roomsCount: swapRooms,
      b2bCostPerNight: finalB2BCostPerNight,
      b2bTotalCost: computedTotalCost,
      isManualCost: isManual,
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
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedStatusFilter === tab.id
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
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-left space-y-2 ${
                      isSelected
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

                    {/* All Hotels Booked */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isAllHotelsBooked: !activeBooking.isAllHotelsBooked
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

                    {/* Activities Booked */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isActivitiesBooked: !activeBooking.isActivitiesBooked
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

                    {/* Manual Calculation */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveBooking({
                          ...activeBooking,
                          isManualCalculation: !activeBooking.isManualCalculation
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
                <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Client Selling Price
                    </span>
                    <div className="text-lg sm:text-xl font-black text-white">
                      ₹{(activeBooking.totalQuotationAmount || 0).toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      Advance: ₹{(activeBooking.advanceAmountPaid || 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      B2B Hotels Total
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-200">
                      ₹{liveMargins.b2bHotelTotal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeBooking.hotels?.length || 0} Property Stays
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      B2B Transport Total
                    </span>
                    <div className="text-lg sm:text-xl font-black text-slate-200">
                      ₹{liveMargins.b2bTransportTotal.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      {activeBooking.noOfDays} Days Vehicle Cost
                    </span>
                  </div>

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
              </div>

              {/* TABS NAVIGATION */}
              <div className="flex items-center gap-2 border-b border-slate-800 text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveTab('hotels')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'hotels'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Hotels &amp; B2B Rates ({activeBooking.hotels?.length || 0})</span>
                </button>

                <button
                  onClick={() => setActiveTab('transport')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'transport'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Transport &amp; Chauffeur Dispatch</span>
                </button>

                <button
                  onClick={() => setActiveTab('activities')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'activities'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Activities &amp; Experiences Operations</span>
                </button>

                <button
                  onClick={() => setActiveTab('itinerary')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'itinerary'
                      ? 'border-orange-500 text-orange-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Itinerary Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === 'payments'
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
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-white">{hotel.hotelName}</span>
                                  {hotel.category && (
                                    <span className="text-[10px] font-bold bg-slate-800 text-orange-300 px-2 py-0.5 rounded-md">
                                      {hotel.category}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400">
                                  City: <strong className="text-slate-300">{hotel.city}</strong>
                                  {hotel.dates && <span className="ml-2 text-slate-500 font-medium">({hotel.dates})</span>}
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
                                className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${
                                  hotel.status === 'confirmed'
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

                          {/* Hotel Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">Room Category</span>
                              <span className="font-semibold text-slate-300">{hotel.roomCategory}</span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">Nights &amp; Rooms</span>
                              <span className="font-semibold text-slate-300">
                                {hotel.nights} Night(s) &bull; {hotel.roomsCount} Room(s)
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">B2B Total Cost</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-black text-amber-400 text-sm">
                                  ₹{(hotel.b2bTotalCost || 0).toLocaleString('en-IN')}
                                </span>
                                {hotel.isManualCost && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                                    Manual
                                  </span>
                                )}
                              </div>
                            </div>

                            <div>
                              <span className="text-[10px] text-slate-500 font-bold block uppercase">Booking Ref / Voucher #</span>
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
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none focus:border-orange-500 mt-0.5"
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
                        className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border cursor-pointer ${
                          activeBooking.transport?.status === 'confirmed'
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                        }`}
                      >
                        <option value="assigned">Vehicle Assigned</option>
                        <option value="confirmed">Transport Confirmed ✓</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      {/* Vehicle Type (Zoho dropdown or custom) */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Vehicle Type (Zoho CRM Master)
                        </label>
                        {masterData?.vehicles && masterData.vehicles.length > 0 ? (
                          <select
                            value={activeBooking.transport?.vehicleType || ''}
                            onChange={e => {
                              const selType = e.target.value;
                              const matchVeh = masterData.vehicles.find(v => v.name === selType);
                              let newCost = activeBooking.transport?.b2bTotalCost || 0;
                              if (matchVeh && matchVeh.cost && !activeBooking.transport?.isManualCost) {
                                newCost = matchVeh.cost * (activeBooking.noOfDays || 1);
                              }
                              setActiveBooking({
                                ...activeBooking,
                                transport: {
                                  ...activeBooking.transport,
                                  vehicleType: selType,
                                  b2bTotalCost: newCost
                                }
                              });
                            }}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs"
                          >
                            <option value="">-- Select Zoho Vehicle --</option>
                            {masterData.vehicles.map(v => (
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

                      {/* Vendor Name */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                          Transport Vendor Name (Zoho CRM)
                        </label>
                        <input
                          type="text"
                          value={activeBooking.transport?.vendorName || ''}
                          placeholder="Vendor Name (e.g. Royal Rajasthan Cabs)"
                          onChange={e => {
                            setActiveBooking({
                              ...activeBooking,
                              transport: { ...activeBooking.transport, vendorName: e.target.value }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                        />
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
                            setActiveBooking({
                              ...activeBooking,
                              transport: {
                                ...activeBooking.transport,
                                b2bTotalCost: Number(e.target.value) || 0,
                                isManualCost: true
                              }
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-amber-400 font-mono font-bold"
                        />
                      </div>
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

                      <button
                        type="button"
                        onClick={() => copyToClipboard(generateDriverDutySlip(), 'duty_slip')}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        {copiedText === 'duty_slip' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedText === 'duty_slip' ? 'Slip Copied!' : 'Copy Duty Slip'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ACTIVITIES & EXPERIENCES OPERATIONS */}
              {activeTab === 'activities' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Compass className="w-5 h-5 text-orange-400" />
                        <div>
                          <h3 className="font-bold text-white text-sm">
                            Activities and Experiences operations
                          </h3>
                          <span className="text-[10px] text-slate-400">
                            Subform matching Zoho CRM CustomModule11
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
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            activeBooking.isActivitiesBooked
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : 'bg-amber-950 text-amber-300 border-amber-700'
                          }`}
                        >
                          {activeBooking.isActivitiesBooked ? 'Confirmed ✓' : 'Pending'}
                        </button>
                      </div>
                    </div>

                    {/* Activities List */}
                    {activeBooking.dayActivities && activeBooking.dayActivities.length > 0 ? (
                      <div className="divide-y divide-slate-800 text-xs">
                        {activeBooking.dayActivities.map((act: any, aIdx: number) => (
                          <div key={aIdx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0">
                                D{act.day || aIdx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-white block">
                                  {act.title || act.name || `Day ${aIdx + 1} Experience`}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  {act.city || activeBooking.destination} &bull; {act.time || 'Full Day'}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {act.guidedTour && (
                                <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                  Guided Tour
                                </span>
                              )}
                              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-md">
                                Included
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 text-xs space-y-2">
                        <Compass className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                        <p>Standard destination sightseeing &amp; en-route experiences as scheduled in proposal.</p>
                        <p className="text-[10px]">All major attractions are included in the driver duty itinerary.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: ITINERARY OVERVIEW */}
              {activeTab === 'itinerary' && (
                <div className="space-y-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-white text-sm">Client Itinerary &amp; Special Requirements</h3>
                      {activeBooking.itineraryUrl && (
                        <a
                          href={activeBooking.itineraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:underline inline-flex items-center gap-1 font-semibold"
                        >
                          <span>Open Live Web Itinerary</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Selected Option
                        </span>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200">
                          <strong className="text-white block">{activeBooking.selectedOptionTitle}</strong>
                          <span className="text-[11px] text-slate-400">
                            {activeBooking.duration} &bull; {activeBooking.destination}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Sales Handover Notes
                        </span>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 italic">
                          &ldquo;{activeBooking.salesNotes || 'No specific notes entered by sales.'}&rdquo;
                        </div>
                      </div>
                    </div>
                  </div>
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
                    onClick={handleSyncToFinance}
                    disabled={isSyncingFinance || activeBooking.opsStatus === 'synced_to_finance'}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                      activeBooking.opsStatus === 'synced_to_finance'
                        ? 'bg-purple-950/80 text-purple-300 border border-purple-700/80 cursor-default'
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
                        <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                        <span>Synced to Zoho Finance ✓</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">Swap Alternate Hotel</h3>
                <span className="text-[11px] text-slate-400">
                  Select from live Zoho CRM Hotels or enter manual override
                </span>
              </div>
              <button
                onClick={() => setSwapModalHotelIndex(null)}
                className="text-slate-400 hover:text-white cursor-pointer text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Source Switcher: Zoho Master vs Manual */}
            <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSwapSourceType('zoho')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  swapSourceType === 'zoho'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Zoho CRM Hotel Master
              </button>
              <button
                type="button"
                onClick={() => setSwapSourceType('custom')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  swapSourceType === 'custom'
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom / Offline Hotel
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* City Selection */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Destination City
                </label>
                <input
                  type="text"
                  value={swapCity}
                  onChange={e => setSwapCity(e.target.value)}
                  placeholder="e.g. Jaipur, Jodhpur, Hanoi, Da Nang"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              {swapSourceType === 'zoho' ? (
                <>
                  {/* Zoho Hotel Dropdown */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Zoho CRM Hotel (City: {swapCity})
                    </label>
                    {availableZohoHotelsForCity.length > 0 ? (
                      <select
                        value={swapHotelId}
                        onChange={e => handleSelectZohoHotel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      >
                        <option value="">-- Select Zoho Hotel --</option>
                        {availableZohoHotelsForCity.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.hotelName} ({h.category || 'Hotel'} &bull; {h.starRating || '4★'})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-300 text-[11px]">
                        No Zoho hotels registered for &ldquo;{swapCity}&rdquo;. Switch to <strong>Custom / Offline Hotel</strong> above to enter manually.
                      </div>
                    )}
                  </div>

                  {/* Zoho Room Category Dropdown */}
                  {availableRoomsForSelectedHotel.length > 0 && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                        Zoho CRM Room Category &amp; B2B Pricing
                      </label>
                      <select
                        value={swapRoomCategory}
                        onChange={e => handleSelectZohoRoomCategory(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs"
                      >
                        {availableRoomsForSelectedHotel.map((r: any, rIdx: number) => (
                          <option key={rIdx} value={r.roomCategory}>
                            {r.roomCategory} - ₹{r.basePrice}/night (Extra bed: ₹{r.extraBedPrice || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Rate / Night</span>
                      <span className="font-bold text-slate-200">₹{swapB2BCostPerNight.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Nights &bull; Rooms</span>
                      <span className="font-bold text-slate-200">{swapNights}N &bull; {swapRooms}R</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-orange-400 block font-bold">Total B2B</span>
                      <span className="font-black text-amber-400">
                        ₹{(swapB2BCostPerNight * swapNights * swapRooms).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
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

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                      Room Category
                    </label>
                    <input
                      type="text"
                      value={swapRoomCategory}
                      onChange={e => setSwapRoomCategory(e.target.value)}
                      placeholder="e.g. Deluxe Room, Superior Mountain View"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
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
    </div>
  );
}
