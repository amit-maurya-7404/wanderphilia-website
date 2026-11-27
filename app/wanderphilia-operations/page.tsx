'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Mail,
  FileText,
  Sparkles,
  LogOut,
  Compass,
} from 'lucide-react';
import { OperationsBooking, OperationsStatus, OperationsSummaryStats } from '@/types/operations';

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

export default function WanderphiliaOperationsDashboardPage() {
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [isVerifyingPin, setIsVerifyingPin] = useState<boolean>(false);
  const [opsToken, setOpsToken] = useState<string>('');

  // Bookings & Stats
  const [bookings, setBookings] = useState<OperationsBooking[]>([]);
  const [stats, setStats] = useState<OperationsSummaryStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Master Data Status
  const [masterDataCounts, setMasterDataCounts] = useState<{ hotels: number; vehicles: number }>({
    hotels: 0,
    vehicles: 0,
  });

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

  // Fetch bookings from backend
  const fetchBookings = useCallback(
    async (tokenToUse?: string) => {
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
      try {
        const res = await fetch(
          `/api/operations/bookings?status=${selectedStatusFilter}&search=${encodeURIComponent(searchQuery)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: 'no-store',
          }
        );

        if (res.status === 401) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setBookings(data.bookings || []);
          if (data.stats) setStats(data.stats);
        }
      } catch (err) {
        console.error('[Fetch Operations Bookings Error]:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [opsToken, selectedStatusFilter, searchQuery]
  );

  // Fetch Master Data counts
  const fetchMasterDataCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/operations/master-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMasterDataCounts({
            hotels: json.data.hotelCount || 42,
            vehicles: json.data.vehicleCount || 6,
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
      fetchMasterDataCounts();
    }
  }, [isAuthenticated, fetchBookings, fetchMasterDataCounts]);

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
        fetchBookings(data.token);
        fetchMasterDataCounts();
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
  };

  // Compute overdue count
  const overdueBookingsCount = useMemo(() => {
    const now = Date.now();
    return bookings.filter(b => {
      if (b.opsStatus === 'synced_to_finance' || b.isSyncToFinance) return false;
      const createdTime = new Date(b.createdAt || b.handedOverAt || now).getTime();
      const hours = (now - createdTime) / (1000 * 60 * 60);
      return hours >= 48;
    }).length;
  }, [bookings]);

  // Filter bookings based on selected status filter
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      // Overdue filter tab
      if (selectedStatusFilter === 'overdue') {
        const prog = computeBookingSlaAndProgress(b);
        return prog.isOverdue;
      }
      if (selectedStatusFilter === 'all') return true;
      return b.opsStatus === selectedStatusFilter;
    });
  }, [bookings, selectedStatusFilter]);

  // If Not Authenticated, show Security PIN Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto text-orange-400">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Wanderphilia Operations</h1>
            <p className="text-xs text-slate-400 mt-1">
              Enter Operations Security PIN to access the master dashboard.
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
              {isVerifyingPin ? 'Verifying PIN...' : 'Unlock Operations Dashboard'}
            </button>
          </form>

          <Link
            href="/wanderphilia-sales"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 font-semibold"
          >
            <Compass className="w-3.5 h-3.5 text-orange-400" /> Switch to Sales Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* TOP EXECUTIVE APP HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-base shadow-md">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">Wanderphilia</h1>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Operations Dashboard
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Zoho CRM Master Data Active ({masterDataCounts.hotels} Hotels &bull; {masterDataCounts.vehicles} Vehicles)
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-2 min-w-[220px]">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Guest, Mobile, Inquiry ID or Destination..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Link
              href="/wanderphilia-sales"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sales Hub ⇄</span>
            </Link>

            <button
              onClick={() => fetchBookings()}
              disabled={isLoading}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition-colors"
              title="Refresh Bookings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-slate-700 rounded-xl text-xs font-semibold"
              title="Lock Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* KPI METRICS BAR */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-4 sm:px-6 py-3 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-3 min-w-max text-xs">
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

          {overdueBookingsCount > 0 && (
            <button
              onClick={() => setSelectedStatusFilter('overdue')}
              className="flex items-center gap-2 bg-red-950/70 text-red-300 px-3 py-1.5 rounded-xl border border-red-600/80 animate-pulse cursor-pointer hover:bg-red-900/80 transition-all"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="font-bold">48h SLA Overdue:</span>
              <span className="font-black text-white px-1.5 py-0.2 rounded bg-red-600 text-[11px]">{overdueBookingsCount}</span>
            </button>
          )}

          {stats?.totalB2BCost !== undefined && (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 ml-auto">
              <span className="text-slate-400 font-bold">Total Operations B2B Cost:</span>
              <span className="font-black text-amber-300">₹{stats.totalB2BCost.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>
      </section>

      {/* DASHBOARD CONTENT CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'overdue', label: `⚠️ Overdue SLA (${overdueBookingsCount})`, isAlert: overdueBookingsCount > 0 },
              { id: 'pending_ops', label: 'Action Required' },
              { id: 'in_progress', label: 'In-Progress' },
              { id: 'ops_confirmed', label: 'Confirmed' },
              { id: 'synced_to_finance', label: 'Synced to Finance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatusFilter === tab.id
                    ? tab.isAlert
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-orange-600 text-white shadow-md'
                    : tab.isAlert
                    ? 'text-red-400 hover:bg-red-950/40 border border-red-800/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-mono">
            Showing <strong className="text-slate-300">{filteredBookings.length}</strong> Booking Records
          </div>
        </div>

        {/* BOOKING CARDS FULL-WIDTH GRID */}
        {isLoading ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 text-orange-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold">Loading operations bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-700" />
            <h3 className="text-base font-bold text-white">No Bookings Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No operations bookings matched your current filter or search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBookings.map(b => {
              const prog = computeBookingSlaAndProgress(b);
              const targetUrl = `/wanderphilia-operations/${encodeURIComponent(b.inquiryId || b.id)}`;

              const statusMeta = {
                pending_ops: { label: 'Action Required', bg: 'bg-amber-950/80 text-amber-300 border-amber-800' },
                in_progress: { label: 'In-Progress', bg: 'bg-blue-950/80 text-blue-300 border-blue-800' },
                issue: { label: 'Issue / Sold Out', bg: 'bg-red-950/80 text-red-300 border-red-800' },
                ops_confirmed: { label: 'Ops Confirmed', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' },
                synced_to_finance: { label: 'Synced to Finance', bg: 'bg-purple-950/80 text-purple-300 border-purple-800' },
              }[b.opsStatus] || { label: b.opsStatus, bg: 'bg-slate-800 text-slate-300 border-slate-700' };

              const sellingPrice = b.totalQuotationAmount || 0;
              const preTaxSelling = Math.round(sellingPrice / 1.05);

              return (
                <div
                  key={b.id}
                  onClick={() => router.push(targetUrl)}
                  className={`bg-slate-900/90 border rounded-3xl p-5 sm:p-6 space-y-4 hover:border-orange-500/80 transition-all cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between group ${
                    prog.isOverdue
                      ? 'border-red-900/60 hover:border-red-500'
                      : prog.isSynced
                      ? 'border-purple-900/60 hover:border-purple-500'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Top Row: Inquiry ID + SLA / Status Badge */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-orange-400 bg-orange-950/60 border border-orange-800/60 px-2.5 py-0.5 rounded-md">
                        {b.inquiryId}
                      </span>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {prog.isSynced ? (
                          <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-purple-950 text-purple-300 border-purple-800">
                            Synced to Finance
                          </span>
                        ) : prog.isOverdue ? (
                          <span className="text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border bg-red-950 text-red-300 border-red-500 flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-2.5 h-2.5 text-red-400 shrink-0" />
                            {prog.daysOverdue}D Overdue (SLA)
                          </span>
                        ) : (
                          <span className="text-[9.5px] font-bold tracking-wider px-2 py-0.5 rounded-full border bg-amber-950/50 text-amber-300 border-amber-800/70 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                            {prog.hoursLeft}h left
                          </span>
                        )}

                        <span className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusMeta.bg}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>

                    {/* Guest Name & Destination */}
                    <div>
                      <h3 className="text-lg font-black text-white tracking-tight group-hover:text-orange-400 transition-colors">
                        {b.customerName}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="text-slate-300 font-semibold">{b.destination}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span>{b.noOfNights}N/{b.noOfDays}D</span>
                      </p>
                    </div>

                    {/* Travel Dates & Pax */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{b.travelStartDate || 'TBA'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>{b.numberOfGuests} Guests ({b.adults}A, {b.kids}K)</span>
                      </span>
                    </div>

                    {/* LIVE WORK STATUS PROGRESS BREAKDOWN */}
                    <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                      {/* Hotels */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>Hotels:</span>
                        </span>
                        <span className={`font-mono font-bold ${prog.pendingHotels === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {prog.confirmedHotels}/{prog.totalHotels} Booked
                          {prog.pendingHotels > 0 ? (
                            <span className="text-red-400 ml-1 font-semibold">({prog.pendingHotels} Pending)</span>
                          ) : (
                            <span className="text-emerald-400 ml-1 font-semibold">✓</span>
                          )}
                        </span>
                      </div>

                      {/* Transport */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>Transport:</span>
                        </span>
                        <span className={`font-mono font-bold ${prog.isTransportConfirmed ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {prog.isTransportConfirmed ? (
                            <span className="text-emerald-400">✓ Booked</span>
                          ) : (
                            <span className="text-amber-400">⚠️ Pending</span>
                          )}
                        </span>
                      </div>

                      {/* Activities */}
                      {prog.totalExps > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium flex items-center gap-1.5">
                            <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Activities:</span>
                          </span>
                          <span className={`font-mono font-bold ${prog.pendingExps === 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                            {prog.confirmedExps}/{prog.totalExps} Confirmed
                            {prog.pendingExps > 0 && (
                              <span className="text-amber-400 ml-1 font-semibold">({prog.pendingExps} Pending)</span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Selling Price</span>
                        <span className="font-mono font-black text-amber-400 text-sm">
                          ₹{sellingPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-slate-500 block font-medium">
                          (With 5% GST)
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 uppercase font-bold block">Advance Paid</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          ₹{(b.advanceAmountPaid || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-emerald-400/80 block font-medium">
                          (With Taxes)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Button */}
                  <div className="pt-3 border-t border-slate-800/80">
                    <Link
                      href={targetUrl}
                      onClick={e => e.stopPropagation()}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white text-xs font-black transition-all flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white"
                    >
                      <span>Open Operations Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
