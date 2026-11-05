'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Check,
  Calendar,
  Users,
  Compass,
  MapPin,
  Clock,
  LogOut,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  History,
  AlertCircle,
  Eye,
  CheckCircle2,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trips as staticTrips, Trip } from '@/lib/data';
import { DestinationsManagement } from '@/components/admin/destinations-management';
import { BUILTIN_DESTINATIONS } from '@/lib/destinations';

interface TripItem extends Trip {
  _id?: string;
  source?: 'mongodb' | 'static';
  tourType?: 'Group' | 'Customized' | string;
  createdAt?: string;
  updatedAt?: string;
  history?: Array<{
    timestamp: string;
    action: string;
    title: string;
    updatedBy: string;
  }>;
  placements?: {
    homepage?: boolean;
    indiaTrips?: boolean;
    internationalTrips?: boolean;
    upcomingTours?: boolean;
    honeymoon?: boolean;
    christmasNewYear?: boolean;
    destinationPage?: boolean;
    destinationCategory?: string;
    sections?: {
      available?: boolean;
      family?: boolean;
      custom?: boolean;
      related?: boolean;
    };
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active Main View Tab
  const [activeMainTab, setActiveMainTab] = useState<'itineraries' | 'destinations'>('itineraries');
  const [destCount, setDestCount] = useState<number>(BUILTIN_DESTINATIONS.length);

  useEffect(() => {
    fetch('/api/destinations')
      .then(r => (r.ok ? r.json() : []))
      .then(d => {
        if (Array.isArray(d)) setDestCount(d.length);
      })
      .catch(() => {});
  }, []);

  // Authentication & Logout
  const [loggingOut, setLoggingOut] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  // Data States
  const [mongoTrips, setMongoTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Group' | 'Customized'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'mongodb' | 'static'>('all');
  const [placementFilter, setPlacementFilter] = useState<string>('all');

  // Delete Modal State
  const [deletingTrip, setDeletingTrip] = useState<TripItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // History Audit Modal State
  const [historyTrip, setHistoryTrip] = useState<TripItem | null>(null);

  // Fetch MongoDB Trips
  const loadMongoTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMongoTrips(data.map(t => ({ ...t, source: 'mongodb' })));
        }
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMongoTrips();
  }, []);

  // Merge MongoDB trips with staticTrips (MongoDB overrides static by slug)
  const allTrips: TripItem[] = useMemo(() => {
    const mongoSlugs = new Set(mongoTrips.map(t => t.slug || t.id));
    const normalizedStatic: TripItem[] = staticTrips
      .filter(t => !mongoSlugs.has(t.slug || t.id))
      .map(t => ({
        ...t,
        source: 'static',
        tourType: t.title?.toLowerCase().includes('group') ? 'Group' : 'Customized',
        placements: {
          homepage: true,
          indiaTrips: t.tripType !== 'International',
          internationalTrips: t.tripType === 'International',
          upcomingTours: t.title?.toLowerCase().includes('group'),
          destinationPage: true,
          destinationCategory: t.category?.toLowerCase() || 'leh-ladakh',
          sections: { available: true }
        }
      }));

    return [...mongoTrips, ...normalizedStatic];
  }, [mongoTrips]);

  // Handle Delete Trip
  const confirmDeleteTrip = async () => {
    if (!deletingTrip) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/trips?slug=${encodeURIComponent(deletingTrip.slug || deletingTrip.id)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setMongoTrips(prev => prev.filter(t => (t.slug || t.id) !== (deletingTrip.slug || deletingTrip.id)));
        setDeletingTrip(null);
      } else {
        alert('Failed to delete trip from database.');
      }
    } catch (err) {
      alert('Error deleting trip: ' + err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy Link Handler
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/trips/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = allTrips.length;
    const mongoCount = mongoTrips.length;
    const groupTours = allTrips.filter(t => t.tourType === 'Group' || t.title?.toLowerCase().includes('group')).length;
    const customizedTours = total - groupTours;
    const indiaCount = allTrips.filter(t => t.tripType !== 'International').length;
    const intlCount = allTrips.filter(t => t.tripType === 'International').length;
    return { total, mongoCount, groupTours, customizedTours, indiaCount, intlCount };
  }, [allTrips, mongoTrips]);

  // Filtered List
  const filteredTrips = useMemo(() => {
    return allTrips.filter(t => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDest = t.destination?.toLowerCase().includes(q);
        const matchesSlug = t.slug?.toLowerCase().includes(q);
        const matchesCat = t.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDest && !matchesSlug && !matchesCat) return false;
      }

      // 2. Tour Type Filter
      if (typeFilter !== 'all') {
        const isGroup = t.tourType === 'Group' || t.title?.toLowerCase().includes('group');
        if (typeFilter === 'Group' && !isGroup) return false;
        if (typeFilter === 'Customized' && isGroup) return false;
      }

      // 3. Source Filter
      if (sourceFilter !== 'all') {
        if (t.source !== sourceFilter) return false;
      }

      // 4. Placement Filter
      if (placementFilter !== 'all') {
        const p = t.placements;
        if (!p) return false;
        if (placementFilter === 'homepage' && !p.homepage) return false;
        if (placementFilter === 'indiaTrips' && !p.indiaTrips) return false;
        if (placementFilter === 'internationalTrips' && !p.internationalTrips) return false;
        if (placementFilter === 'upcomingTours' && !p.upcomingTours) return false;
        if (placementFilter === 'honeymoon' && !p.honeymoon) return false;
        if (placementFilter === 'christmasNewYear' && !p.christmasNewYear) return false;
      }

      return true;
    });
  }, [allTrips, searchQuery, typeFilter, sourceFilter, placementFilter]);

  // Format Date Helper
  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'Built-in Catalog';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-[#ff5d09] selection:text-white">
      {/* TOP LUXURY NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff5d09] to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Wanderphilia Operations</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Logged in as <code className="text-orange-400 font-medium">experiences@wanderphilia.com</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Main Module Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 mr-2">
            <button
              onClick={() => setActiveMainTab('itineraries')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMainTab === 'itineraries'
                  ? 'bg-gradient-to-r from-[#ff5d09] to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Itineraries ({allTrips.length})
            </button>
            <button
              onClick={() => setActiveMainTab('destinations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMainTab === 'destinations'
                  ? 'bg-gradient-to-r from-[#ff5d09] to-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Destination Pages ({destCount})
            </button>
          </div>

          <Link href="/admin/website-itinerary">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs h-9 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" /> + Create New Itinerary (Zoho CRM)
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
            className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs h-9 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {loggingOut ? 'Signing out...' : 'Sign Out'}
          </Button>
        </div>
      </header>

      {/* MOBILE TAB SWITCHER */}
      <div className="sm:hidden px-4 pt-3 bg-slate-950 flex items-center gap-2">
        <button
          onClick={() => setActiveMainTab('itineraries')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl text-center border transition-all ${
            activeMainTab === 'itineraries'
              ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          Tour Itineraries ({allTrips.length})
        </button>
        <button
          onClick={() => setActiveMainTab('destinations')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl text-center border transition-all ${
            activeMainTab === 'destinations'
              ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}
        >
          Destination Pages ({destCount})
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        {activeMainTab === 'destinations' ? (
          <DestinationsManagement />
        ) : (
          <>
            {/* WELCOME BANNER & STATS */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400">Website Management Hub</span>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Website Itineraries & Publication History
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Track every tour package live on wanderphilia.com. Edit pricing, day plans, Zoho hotels, and batch departure calendars in real time with complete history accountability.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadMongoTrips}
                disabled={loading}
                className="border-slate-800 bg-slate-950/80 text-slate-300 text-xs h-9 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
                Refresh History
              </Button>
              <Link href="/admin/website-itinerary">
                <Button
                  size="sm"
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white font-semibold text-xs h-9 cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Itinerary
                </Button>
              </Link>
            </div>
          </div>

          {/* 5 KEY METRIC TILES */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Packages</span>
                <Globe className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1.5">{metrics.total}</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">{metrics.mongoCount} live in MongoDB</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Group Tours</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1.5">{metrics.groupTours}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">With batch calendars</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Customized Tours</span>
                <Compass className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1.5">{metrics.customizedTours}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Flexible private plans</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Domestic / India</span>
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1.5">{metrics.indiaCount}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Ladakh, Spiti, Rajasthan...</p>
            </div>

            <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-2xl col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>International</span>
                <Globe className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white mt-1.5">{metrics.intlCount}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Vietnam, Bali, Thailand...</p>
            </div>
          </div>
        </section>

        {/* CONTROLS: SEARCH & FILTERS */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative grow max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search packages by Title, Destination, or URL Slug..."
                className="bg-slate-950 border-slate-800 pl-9 text-xs h-9 text-white placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tour Type Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['all', 'Group', 'Customized'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    typeFilter === type
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type === 'Group' ? 'Group Tours' : 'Customized'}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Filters: Placements & Source */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium text-[11px] mr-1">
              <Layers className="w-3 h-3 text-orange-400" /> Filter by Page:
            </span>

            {[
              { id: 'all', label: 'All Pages' },
              { id: 'homepage', label: 'Homepage' },
              { id: 'upcomingTours', label: 'Upcoming Tours (/upcoming-tours)' },
              { id: 'indiaTrips', label: 'India Trips (/india-trips)' },
              { id: 'internationalTrips', label: 'International Trips (/international-trips)' },
              { id: 'honeymoon', label: 'Honeymoon' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlacementFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  placementFilter === p.id
                    ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                {p.label}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-slate-500 text-[11px]">Source:</span>
              <select
                value={sourceFilter}
                onChange={e => setSourceFilter(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-300 cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="mongodb">MongoDB Live Packages Only</option>
                <option value="static">Built-in Packages Only</option>
              </select>
            </div>
          </div>
        </section>

        {/* ITINERARIES TABLE & HISTORY LIST */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Configured Packages</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300">
                {filteredTrips.length} itineraries
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Click <strong className="text-orange-400">"Edit"</strong> to modify hotels, pricing, day plans or batch dates in real time.
            </p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
              <p className="text-xs text-slate-400">Loading website itineraries...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <p className="text-sm text-slate-400">No itineraries match your search or filter.</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                  setPlacementFilter('all');
                  setSourceFilter('all');
                }}
                className="border-slate-800 text-xs"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {filteredTrips.map(trip => {
                const isMongo = trip.source === 'mongodb';
                const isGroup = trip.tourType === 'Group' || trip.title?.toLowerCase().includes('group');
                const slug = trip.slug || trip.id;
                const price = trip.price || 0;

                return (
                  <div
                    key={trip.id || trip.slug}
                    className="p-4 sm:p-5 hover:bg-slate-950/50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Main Info */}
                    <div className="flex items-start gap-4 grow min-w-0">
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                        {trip.image ? (
                          <Image src={trip.image} alt={trip.title} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                            No Photo
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white backdrop-blur-xs">
                          {trip.duration || trip.itinerary?.length || 6}D/{trip.nights || (trip.duration ? trip.duration - 1 : 5)}N
                        </span>
                      </div>

                      <div className="space-y-1.5 min-w-0 grow">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-md">
                            {trip.title}
                          </h3>
                          {isMongo ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live in Database
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                              Built-in Catalog
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isGroup
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {isGroup ? 'Group Tour' : 'Customized Tour'}
                          </span>
                        </div>

                        {/* URL Slug & Destination Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            <strong>{trip.destination}</strong> ({trip.region || trip.tripType})
                          </span>

                          <span className="text-slate-600">•</span>

                          <span className="font-mono text-[11px] text-orange-400/90 truncate max-w-xs">
                            /trips/{slug}
                          </span>
                        </div>

                        {/* Placements Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-500 font-semibold mr-1">Shows in:</span>
                          {trip.placements?.homepage && (
                            <span className="px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[10px]">
                              Homepage
                            </span>
                          )}
                          {trip.placements?.upcomingTours && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px]">
                              Upcoming Batches
                            </span>
                          )}
                          {trip.placements?.indiaTrips && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                              India Trips
                            </span>
                          )}
                          {trip.placements?.internationalTrips && (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px]">
                              International Trips
                            </span>
                          )}
                          {trip.placements?.destinationPage && (
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                              {trip.placements.destinationCategory || trip.destination} Page
                            </span>
                          )}
                        </div>

                        {/* History / Created Timestamp */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                          <span>
                            Last Updated:{' '}
                            <strong className="text-slate-300">
                              {formatDate(trip.updatedAt || trip.createdAt)}
                            </strong>
                          </span>

                          {trip.history && trip.history.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setHistoryTrip(trip)}
                              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <History className="w-3 h-3" /> View {trip.history.length} History Logs
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing, Live Preview & Action Buttons */}
                    <div className="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Starting Price</span>
                        <span className="text-base font-extrabold text-white">
                          ₹{price ? price.toLocaleString('en-IN') : '19,999'}
                          <span className="text-[11px] font-normal text-slate-400"> / person</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Copy Link */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyLink(slug)}
                          className="h-8 px-2.5 bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer"
                          title="Copy Trip Page Link"
                        >
                          {copiedSlug === slug ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </Button>

                        {/* View Live */}
                        <Link href={`/trips/${slug}`} target="_blank" rel="noopener noreferrer">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2.5 bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs cursor-pointer flex items-center gap-1"
                            title="View Live Customer Page"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            <span className="hidden sm:inline">View Live</span>
                          </Button>
                        </Link>

                        {/* Edit Button */}
                        <Link href={`/admin/website-itinerary?edit=${encodeURIComponent(slug)}`}>
                          <Button
                            size="sm"
                            className="h-8 px-3.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold cursor-pointer flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Button>
                        </Link>

                        {/* Delete Button (Only for MongoDB items) */}
                        {isMongo && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletingTrip(trip)}
                            className="h-8 px-2.5 bg-slate-950 border-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 text-xs cursor-pointer"
                            title="Delete this itinerary from database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </>
    )}
  </main>

      {/* AUDIT HISTORY MODAL */}
      {historyTrip && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Publication History Trail</h3>
              </div>
              <button
                type="button"
                onClick={() => setHistoryTrip(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Package: <strong className="text-white">{historyTrip.title}</strong>
              </p>
              <p className="text-[11px] font-mono text-orange-400 mt-0.5">
                URL: /trips/{historyTrip.slug || historyTrip.id}
              </p>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {historyTrip.history && historyTrip.history.length > 0 ? (
                historyTrip.history.map((log, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-400 uppercase text-[10px] tracking-wider">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      By: <code className="text-slate-200">{log.updatedBy || 'experiences@wanderphilia.com'}</code>
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-500">
                  Initial published package. No additional update logs recorded yet.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setHistoryTrip(null)}
                className="border-slate-800 text-xs"
              >
                Close History
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deletingTrip && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Itinerary from Website?</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to remove <strong>"{deletingTrip.title}"</strong>? It will no longer be visible on live website pages.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-orange-400">
              /trips/{deletingTrip.slug || deletingTrip.id}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setDeletingTrip(null)}
                className="border-slate-800 text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isDeleting}
                onClick={confirmDeleteTrip}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Itinerary'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
