'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Users,
  MapPin,
  TrendingUp,
  Layers,
  Sparkles,
  Link2,
  ChevronRight,
  Filter,
  FileCode2,
  Bot,
  Eye,
  Building2,
  Car,
  Utensils,
  Compass,
  Receipt,
  CheckCircle2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface HistoryItineraryItem {
  id: string;
  slug: string;
  url: string;
  title: string;
  destination: string;
  travelerName: string;
  inquiryId: string;
  optionNumber: number;
  finalQuotationAmount: number | null;
  baseQuotationAmount?: number | null;
  marginPercentage?: number | null;
  perAdultPrice: number | null;
  perKidPrice: number | null;
  advanceAmountPaid?: number | null;
  balancePendingAmount?: number | null;
  days: number;
  nights: number;
  adults?: number;
  kids?: number;
  kidsDetails?: any[];
  childrenDetails?: any[];
  roomsCount?: number;
  hotelName: string;
  roomCategory: string;
  hotels?: any[];
  vehicleType: string;
  transportCost?: number | null;
  gstAmount?: number | null;
  gstPercentage?: number | null;
  baseAmount?: number | null;
  mealPlan?: string;
  dayActivities?: any[];
  inclusions?: string[];
  exclusions?: string[];
  hotelCostDetails?: any;
  category: 'zoho' | 'manual';
  source: string;
  createdAt: string;
  updatedAt: string;
  rawDate: number;
}

interface ItineraryHistorySectionProps {
  lastGeneratedId?: string | null;
  onLoadIntoForm?: (item: HistoryItineraryItem) => void;
}

export function ItineraryHistorySection({ lastGeneratedId, onLoadIntoForm }: ItineraryHistorySectionProps) {
  const [items, setItems] = useState<HistoryItineraryItem[]>([]);
  const [inspectModalItem, setInspectModalItem] = useState<HistoryItineraryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Category separation: 'zoho' (Zoho CRM Fetched / AI) vs 'manual' (Manual Itineraries) vs 'all'
  const [activeCategory, setActiveCategory] = useState<'zoho' | 'manual' | 'all'>('zoho');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'opt1' | 'opt2' | 'opt3'>('all');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(15);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  const fetchHistory = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(`/api/itinerary/history?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.itineraries)) {
        setItems(data.itineraries);
        const now = new Date();
        setLastRefreshedAt(
          now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
        );
      }
    } catch (err) {
      console.warn('Failed to load itinerary history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [lastGeneratedId]);

  const handleCopyLink = (item: HistoryItineraryItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://wanderphilia.com';
    const fullUrl = `${origin}${item.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(item.id);
    setTimeout(() => {
      setCopiedId((current) => (current === item.id ? null : current));
    }, 2500);
  };

  // Helper date/time formatters in Indian Standard Time (IST)
  const formatDateTime = (isoDateStr: string) => {
    const d = new Date(isoDateStr);
    const day = d.toLocaleDateString('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const month = d.toLocaleDateString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = d.toLocaleDateString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    const time = d.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });
    return { day, month, year, time };
  };

  const isToday = (rawTime: number) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return rawTime >= startOfToday;
  };

  // Base list filtered by Category ('zoho' vs 'manual' vs 'all')
  const categoryItems = useMemo(() => {
    if (activeCategory === 'zoho') {
      return items.filter((i) => i.category === 'zoho');
    }
    if (activeCategory === 'manual') {
      return items.filter((i) => i.category === 'manual');
    }
    return items;
  }, [items, activeCategory]);

  // Filtered items after Search & Option Sub-filters
  const filteredItems = useMemo(() => {
    let result = categoryItems;

    // Search query filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter(
        (it) =>
          it.travelerName.toLowerCase().includes(query) ||
          it.destination.toLowerCase().includes(query) ||
          it.id.toLowerCase().includes(query) ||
          it.slug.toLowerCase().includes(query) ||
          (it.inquiryId && it.inquiryId.toLowerCase().includes(query)) ||
          it.title.toLowerCase().includes(query) ||
          (it.hotelName && it.hotelName.toLowerCase().includes(query))
      );
    }

    // Sub-filter tabs
    if (selectedFilter === 'today') {
      result = result.filter((it) => isToday(it.rawDate));
    } else if (selectedFilter === 'opt1') {
      result = result.filter((it) => it.optionNumber === 1);
    } else if (selectedFilter === 'opt2') {
      result = result.filter((it) => it.optionNumber === 2);
    } else if (selectedFilter === 'opt3') {
      result = result.filter((it) => it.optionNumber === 3);
    }

    return result;
  }, [categoryItems, searchQuery, selectedFilter]);

  // Counts
  const zohoCount = useMemo(() => items.filter((i) => i.category === 'zoho').length, [items]);
  const manualCount = useMemo(() => items.filter((i) => i.category === 'manual').length, [items]);
  const todayCount = useMemo(() => items.filter((i) => isToday(i.rawDate)).length, [items]);
  const destinationsCount = useMemo(() => new Set(items.map((i) => i.destination).filter(Boolean)).size, [items]);

  return (
    <div className="mt-16 pt-10 border-t border-slate-200/90 space-y-8">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 text-amber-400 text-[10px] sm:text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Live Itinerary Generation Log & History
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Generated Links Audit Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Zoho CRM se fetch karke generate hui itineraries aur Manually curated itineraries dono ko systematically date, month, exact time (IST) ke saath alag-alag track kijiye.
          </p>
        </div>

        {/* REFRESH & LAST SYNC */}
        <div className="flex items-center gap-3 shrink-0">
          {lastRefreshedAt && (
            <span className="text-[11px] text-slate-500 font-mono hidden sm:inline-block">
              Last synced: <span className="font-bold text-slate-700">{lastRefreshedAt}</span>
            </span>
          )}
          <Button
            onClick={() => fetchHistory(true)}
            disabled={refreshing || loading}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-300 hover:border-slate-400 hover:bg-slate-100 font-bold text-xs gap-1.5 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh History'}</span>
          </Button>
        </div>
      </div>

      {/* 1. TOP MAIN CATEGORY SWITCHER (ZOHO VS MANUAL VS ALL) */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-1.5">
        <button
          type="button"
          onClick={() => {
            setActiveCategory('zoho');
            setSelectedFilter('all');
            setVisibleCount(15);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeCategory === 'zoho'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
              : 'bg-transparent text-slate-700 hover:bg-white/60'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Zoho CRM Fetched Itineraries</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
              activeCategory === 'zoho' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {zohoCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('manual');
            setSelectedFilter('all');
            setVisibleCount(15);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeCategory === 'manual'
              ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
              : 'bg-transparent text-slate-700 hover:bg-white/60'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          <span>Manual Curated Itineraries</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
              activeCategory === 'manual' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {manualCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveCategory('all');
            setSelectedFilter('all');
            setVisibleCount(15);
          }}
          className={`py-3 px-5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-transparent text-slate-600 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All ({items.length})</span>
        </button>
      </div>

      {/* 2. STAT CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveCategory('zoho')}
          className={`rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between ${
            activeCategory === 'zoho'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] uppercase font-extrabold text-blue-700 tracking-wider flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-blue-600" /> Zoho CRM Fetched
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {zohoCount}
          </div>
          <div className="text-[10px] text-blue-700 mt-0.5 font-medium">Auto-generated via CRM leads</div>
        </div>

        <div
          onClick={() => setActiveCategory('manual')}
          className={`rounded-2xl p-4 border transition cursor-pointer flex flex-col justify-between ${
            activeCategory === 'manual'
              ? 'bg-orange-50/80 border-orange-300 ring-2 ring-orange-500/20'
              : 'bg-white border-slate-200/80 hover:border-slate-300'
          }`}
        >
          <div className="text-[10px] uppercase font-extrabold text-orange-700 tracking-wider flex items-center gap-1">
            <FileCode2 className="w-3.5 h-3.5 text-orange-600" /> Manual Itineraries
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {manualCount}
          </div>
          <div className="text-[10px] text-orange-700 mt-0.5 font-medium">Jigna, Naushad, Yatin, etc.</div>
        </div>

        <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Generated Today
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 font-mono">
            {todayCount}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">New proposals created today</div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-purple-500" /> Destinations
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 font-mono">
            {destinationsCount}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Rajasthan, Vietnam, Spiti, etc.</div>
        </div>
      </div>

      {/* 3. SEARCH & SUB-FILTERS BAR */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* SEARCH BAR */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${activeCategory === 'zoho' ? 'Zoho CRM' : activeCategory === 'manual' ? 'Manual' : 'All'} itineraries (by name, slug, inquiry ID, city)...`}
              className="pl-9 bg-slate-50/70 border-slate-200 rounded-xl text-xs sm:text-sm py-4 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕ Clear
              </button>
            )}
          </div>

          {/* SUB-FILTERS (ONLY RELEVANT FOR ZOHO OR ALL) */}
          <div className="flex items-center flex-wrap gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All in view ({categoryItems.length})
            </button>

            <button
              onClick={() => setSelectedFilter('today')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedFilter === 'today'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
              }`}
            >
              Today
            </button>

            {activeCategory !== 'manual' && (
              <>
                <button
                  onClick={() => setSelectedFilter('opt1')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFilter === 'opt1'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Option 1
                </button>

                <button
                  onClick={() => setSelectedFilter('opt2')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFilter === 'opt2'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Option 2
                </button>

                <button
                  onClick={() => setSelectedFilter('opt3')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedFilter === 'opt3'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Option 3
                </button>
              </>
            )}
          </div>
        </div>

        {/* RESULTS COUNT INDICATOR */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-mono">
          <span>
            Active View: <strong className="text-slate-900 uppercase">{activeCategory === 'zoho' ? '⚡ Zoho CRM Fetched' : activeCategory === 'manual' ? '🎨 Manual Curated' : '🌐 All Combined'}</strong> • Showing <strong className="text-slate-800">{Math.min(visibleCount, filteredItems.length)}</strong> of <strong className="text-slate-800">{filteredItems.length}</strong> matching links
          </span>
          {searchQuery && (
            <span className="text-orange-600 font-semibold">Filtered by &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>
      </div>

      {/* 4. SYSTEMATIC LIST VIEW */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Loading systematic itinerary history logs...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-700">No itinerary records found in this category matching your filter.</p>
          <p className="text-xs text-slate-400">Try changing your search keyword or switching between Zoho and Manual tabs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.slice(0, visibleCount).map((item) => {
            const { day, month, year, time } = formatDateTime(item.createdAt);
            const isJustGenerated = lastGeneratedId && (item.id === lastGeneratedId || item.slug === lastGeneratedId);
            const isCopied = copiedId === item.id;
            const isManual = item.category === 'manual';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isJustGenerated
                    ? 'border-orange-500 bg-orange-50/20 ring-2 ring-orange-500/20'
                    : isManual
                    ? 'border-orange-200/90 hover:border-orange-300'
                    : 'border-slate-200/90 hover:border-slate-300'
                }`}
              >
                {/* LEFT: DATE, TIME & ESSENTIAL DETAILS */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* DATE & MONTH BOX */}
                  <div
                    className={`rounded-xl p-2.5 sm:p-3 text-center shrink-0 w-16 sm:w-18 shadow-sm border ${
                      isManual
                        ? 'bg-gradient-to-b from-amber-900 to-orange-950 text-white border-amber-800'
                        : 'bg-gradient-to-b from-slate-900 to-slate-800 text-white border-slate-700'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider leading-none">
                      {month}
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-mono leading-tight mt-0.5">
                      {day}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono leading-none">
                      {year}
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      {/* TIME BADGE */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        <Clock className="w-3 h-3 text-orange-600" />
                        {time} IST
                      </span>

                      {/* CATEGORY & SOURCE BADGE */}
                      {isManual ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-100 text-orange-900 border border-orange-300 flex items-center gap-1">
                          <FileCode2 className="w-3 h-3 text-orange-600" />
                          Manual Curated
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                          <Bot className="w-3 h-3 text-blue-600" />
                          Zoho CRM AI
                        </span>
                      )}

                      {/* OPTION BADGE (FOR ZOHO GENERATED) */}
                      {!isManual && (
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                            item.optionNumber === 2
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : item.optionNumber === 3
                              ? 'bg-purple-100 text-purple-900 border-purple-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          Option {item.optionNumber} {item.optionNumber === 2 ? '(Revision)' : item.optionNumber === 3 ? '(Upgrade)' : '(Base)'}
                        </span>
                      )}

                      {isJustGenerated && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-700 bg-orange-100 border border-orange-300 px-2 py-0.5 rounded-full animate-pulse">
                          ★ Just Generated!
                        </span>
                      )}
                    </div>

                    {/* TRAVELER NAME & TRIP TITLE */}
                    <div className="flex items-baseline flex-wrap gap-2 pt-0.5">
                      <span className="text-sm sm:text-base font-black text-slate-900 truncate">
                        {item.travelerName}
                      </span>

                      {item.inquiryId && (
                        <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200/60">
                          #{item.inquiryId}
                        </span>
                      )}

                      <span className="text-xs text-slate-500 font-medium">
                        • {item.destination} {item.days > 0 ? `(${item.nights}N / ${item.days}D)` : ''}
                      </span>
                    </div>

                    {/* HOTEL & QUOTATION SUMMARY */}
                    <div className="text-xs text-slate-600 flex items-center flex-wrap gap-x-3 gap-y-1">
                      {item.finalQuotationAmount && item.finalQuotationAmount > 0 && (
                        <span className="text-emerald-700 font-bold font-mono">
                          Quote: ₹{item.finalQuotationAmount.toLocaleString('en-IN')}/-
                        </span>
                      )}

                      {item.perAdultPrice && item.perAdultPrice > 0 && (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Adult: ₹{item.perAdultPrice.toLocaleString('en-IN')}
                        </span>
                      )}

                      {item.hotelName && (
                        <span className="text-slate-500 text-[11px] truncate max-w-xs" title={item.hotelName}>
                          Stays: {item.hotelName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: LINK SLUG & ACTION BUTTONS */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  {/* SLUG CODE */}
                  <span
                    className={`font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border truncate max-w-[200px] ${
                      isManual
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                    title={item.id}
                  >
                    /itinerary/{item.slug || item.id}
                  </span>

                  {/* BUTTONS */}
                  <div className="flex items-center gap-1.5">
                    <Button
                      onClick={() => setInspectModalItem(item)}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-900 shadow-2xs gap-1"
                      title="View full costing, hotels, vehicle and itinerary details"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-700" />
                      <span>Costing</span>
                    </Button>

                    <Button
                      onClick={() => handleCopyLink(item)}
                      size="sm"
                      variant="outline"
                      className={`h-8 px-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-600'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Copy full itinerary URL"
                    >
                      {isCopied ? (
                        <span className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-white" /> Copied!
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Copy className="w-3 h-3 text-slate-500" /> Copy Link
                        </span>
                      )}
                    </Button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 h-8 px-3 rounded-xl text-white text-xs font-black transition shadow-xs ${
                        isManual
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500'
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                      title="Open itinerary link in new tab"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* SHOW MORE BUTTON */}
          {visibleCount < filteredItems.length && (
            <div className="text-center pt-4">
              <Button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                variant="outline"
                className="rounded-2xl border-slate-300 font-extrabold text-xs px-6 py-5 shadow-xs cursor-pointer hover:bg-slate-100"
              >
                Load More Links ({filteredItems.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* MODAL: VIEW FULL COSTING & ITINERARY BREAKDOWN */}
      {inspectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">
                      Itinerary Costing &amp; Selection Breakdown
                    </h3>
                    <span className="text-[10px] font-black bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-full">
                      Option {inspectModalItem.optionNumber}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Traveler: <strong className="text-white">{inspectModalItem.travelerName}</strong> &bull; {inspectModalItem.destination} ({inspectModalItem.nights}N/{inspectModalItem.days}D)
                    {inspectModalItem.inquiryId ? ` • #${inspectModalItem.inquiryId}` : ''}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInspectModalItem(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            {(() => {
              // Pre-calculate full breakdown for inspectModalItem
              let totalHotelsB2BCost = 0;
              const hotelCalculations = (inspectModalItem.hotels || []).map((h: any) => {
                const nights = Number(h.nights) || 1;
                const rooms = Number(h.roomsCount || inspectModalItem.roomsCount || 1);
                const baseRate = Number(h.basePrice || h.cost || h.b2bCostPerNight || 0);

                let extraBeds = 0;
                let childNoBed = 0;
                const kidsList = (inspectModalItem.kidsDetails && inspectModalItem.kidsDetails.length > 0)
                  ? inspectModalItem.kidsDetails
                  : (inspectModalItem.childrenDetails || []);

                if (Array.isArray(kidsList) && kidsList.length > 0) {
                  kidsList.forEach((k: any) => {
                    const pref = String(k.bedPreference || '').toLowerCase();
                    if (pref.includes('with') || pref.includes('extra')) extraBeds++;
                    else if (pref.includes('without')) childNoBed++;
                  });
                } else if (Number(inspectModalItem.kids || 0) > 0 && h.extraBedPrice) {
                  extraBeds = Number(inspectModalItem.kids || 0);
                }

                const extraBedPrice = Number(h.extraBedPrice) || 0;
                const childNoBedPrice = Number(h.childWithoutBedPrice) || 0;
                const roomBaseTotal = baseRate * rooms * nights;
                const extraBedTotal = extraBedPrice * extraBeds * nights;
                const childNoBedTotal = childNoBedPrice * childNoBed * nights;
                const totalPropCost = Number(h.b2bTotalCost) || (roomBaseTotal + extraBedTotal + childNoBedTotal);

                totalHotelsB2BCost += totalPropCost;

                return {
                  nights,
                  rooms,
                  baseRate,
                  roomBaseTotal,
                  extraBeds,
                  extraBedPrice,
                  extraBedTotal,
                  childNoBed,
                  childNoBedPrice,
                  childNoBedTotal,
                  totalPropCost
                };
              });

              // Calculate Transport Cost
              let totalTransportB2BCost = Number(inspectModalItem.transportCost) || 0;
              let vehicleDailyRate = 0;
              const tripDays = Number(inspectModalItem.days) || (Number(inspectModalItem.nights) + 1) || 7;

              if (totalTransportB2BCost <= 0) {
                const vName = String(inspectModalItem.vehicleType || '').toLowerCase();
                if (vName.includes('crysta')) vehicleDailyRate = 6500;
                else if (vName.includes('ertiga') || vName.includes('rumion') || vName.includes('rumoin')) vehicleDailyRate = 5500;
                else if (vName.includes('tempo') || vName.includes('traveller')) vehicleDailyRate = 8000;
                else if (vName.includes('innova')) vehicleDailyRate = 5000;
                else vehicleDailyRate = 4000; // Sedan / Seden / Dzire / Etios
                totalTransportB2BCost = vehicleDailyRate * tripDays;
              } else {
                vehicleDailyRate = Math.round(totalTransportB2BCost / tripDays);
              }

              // Calculate Activities Cost
              let totalActivitiesB2BCost = 0;
              const totalPax = (Number(inspectModalItem.adults) || 2) + (Number(inspectModalItem.kids) || 0);
              (inspectModalItem.dayActivities || []).forEach((dr: any) => {
                if (Array.isArray(dr.experiences)) {
                  dr.experiences.forEach((exp: any) => {
                    const pp = Number(exp?.ppCost) || 0;
                    if (pp > 0) totalActivitiesB2BCost += (pp * totalPax);
                  });
                }
              });

              const computedBaseQuotation = inspectModalItem.baseQuotationAmount || (totalHotelsB2BCost + totalTransportB2BCost + totalActivitiesB2BCost);
              const grossMarginAmt = Math.max(0, (Number(inspectModalItem.finalQuotationAmount || 0) - Number(computedBaseQuotation || 0)));

              return (
                <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                  {/* Financial Summary Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Quoted Price</span>
                      <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                        {inspectModalItem.finalQuotationAmount
                          ? `₹${Number(inspectModalItem.finalQuotationAmount).toLocaleString('en-IN')}`
                          : 'N/A'}
                      </span>
                      {inspectModalItem.gstAmount && (
                        <span className="text-[10px] text-slate-500 font-mono block">
                          Incl. GST: ₹{Number(inspectModalItem.gstAmount).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Base Cost (B2B)</span>
                      <span className="text-lg font-black text-slate-200 font-mono mt-0.5 block">
                        ₹{Number(computedBaseQuotation).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        Hotels: ₹{totalHotelsB2BCost.toLocaleString('en-IN')} • Cab: ₹{totalTransportB2BCost.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Profit Margin</span>
                      <span className="text-lg font-black text-blue-400 font-mono mt-0.5 block">
                        {inspectModalItem.marginPercentage ? `${inspectModalItem.marginPercentage}%` : 'Standard'}
                      </span>
                      <span className="text-[10px] text-emerald-400/90 font-mono block">
                        +₹{grossMarginAmt.toLocaleString('en-IN')} profit
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Advance / Balance</span>
                      <span className="text-xs font-bold text-emerald-400 font-mono mt-1 block">
                        Adv: ₹{Number(inspectModalItem.advanceAmountPaid || 0).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 font-mono block">
                        Bal: ₹{Number(inspectModalItem.balancePendingAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Per Pax pricing */}
                  {(inspectModalItem.perAdultPrice || inspectModalItem.perKidPrice) && (
                    <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center gap-4 text-slate-300">
                      {inspectModalItem.perAdultPrice && (
                        <div>
                          <span className="text-slate-500 text-[10px] block">Per Adult:</span>
                          <strong className="text-white font-mono">₹{Number(inspectModalItem.perAdultPrice).toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      {inspectModalItem.perKidPrice && (
                        <div>
                          <span className="text-slate-500 text-[10px] block">
                            Per Child {inspectModalItem.kidsDetails?.[0]?.bedPreference ? `(${inspectModalItem.kidsDetails[0].bedPreference})` : ''}:
                          </span>
                          <strong className="text-white font-mono">₹{Number(inspectModalItem.perKidPrice).toLocaleString('en-IN')}</strong>
                        </div>
                      )}
                      <div className="ml-auto text-[11px] text-slate-400">
                        Total Guests: <strong className="text-white">{inspectModalItem.adults || 2} Adults{Number(inspectModalItem.kids || 0) > 0 ? `, ${inspectModalItem.kids} Child` : ''}</strong>
                      </div>
                    </div>
                  )}

                  {/* Hotels Section */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-orange-400" />
                        <span>
                          Selected Accommodations ({Array.isArray(inspectModalItem.hotels) && inspectModalItem.hotels.length > 0 ? inspectModalItem.hotels.length : 1} Properties)
                        </span>
                      </span>
                      {totalHotelsB2BCost > 0 && (
                        <span className="text-xs font-bold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2.5 py-0.5 rounded-lg font-mono">
                          Total Hotel B2B: ₹{totalHotelsB2BCost.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800 bg-slate-950">
                      {Array.isArray(inspectModalItem.hotels) && inspectModalItem.hotels.length > 0 ? (
                        inspectModalItem.hotels.map((h: any, idx: number) => {
                          const calc = hotelCalculations[idx] || {
                            nights: Number(h.nights) || 1,
                            baseRate: Number(h.basePrice || h.cost || 0),
                            roomBaseTotal: Number(h.basePrice || h.cost || 0),
                            extraBeds: 0,
                            extraBedTotal: 0,
                            totalPropCost: Number(h.basePrice || h.cost || 0)
                          };

                          return (
                            <div key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-900/50 transition">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                                    {idx + 1}
                                  </span>
                                  <strong className="text-white text-xs">{h.hotelName || h.name || `Hotel ${idx + 1}`}</strong>
                                  {(h.category || h.roomCategory) && (
                                    <span className="text-[10px] bg-slate-800 text-orange-300 px-2 py-0.2 rounded font-bold">
                                      {h.category || h.roomCategory}
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 pl-7">
                                  City: <strong className="text-slate-300">{h.city || 'N/A'}</strong> &bull; {h.roomCategory || 'Standard'} &bull; <strong className="text-white">{calc.nights} Night(s)</strong>
                                  {h.stayDates && <span className="text-amber-400/90 ml-2 font-mono">({h.stayDates})</span>}
                                </div>
                                <div className="text-[10px] text-slate-500 pl-7 font-mono">
                                  Base Room: ₹{calc.baseRate.toLocaleString('en-IN')}/nt {calc.nights > 1 ? `× ${calc.nights} Nts = ₹${calc.roomBaseTotal.toLocaleString('en-IN')}` : ''}
                                  {calc.extraBeds > 0 && (
                                    <span className="text-amber-300/80 ml-1">
                                      + Extra Bed: ₹{calc.extraBedPrice.toLocaleString('en-IN')}/nt {calc.nights > 1 ? `× ${calc.nights} Nts = ₹${calc.extraBedTotal.toLocaleString('en-IN')}` : `(₹${calc.extraBedTotal.toLocaleString('en-IN')})`}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right shrink-0 pl-7 sm:pl-0">
                                <span className="text-[10px] text-slate-500 block">Property Total B2B</span>
                                <strong className="text-amber-400 font-mono text-sm block">
                                  ₹{calc.totalPropCost.toLocaleString('en-IN')}
                                </strong>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3.5 text-slate-300">
                          <span className="text-slate-500 block text-[10px]">Hotel Details:</span>
                          <strong className="text-white text-xs">{inspectModalItem.hotelName || 'Curated luxury accommodations'}</strong>
                          {inspectModalItem.roomCategory && (
                            <span className="text-slate-400 text-[11px] block mt-0.5">Category: {inspectModalItem.roomCategory}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vehicle & Meal Plan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-orange-400" />
                          <span>Selected Transport</span>
                        </span>
                        <strong className="text-amber-400 font-mono text-xs">
                          ₹{totalTransportB2BCost.toLocaleString('en-IN')}
                        </strong>
                      </div>
                      <div className="text-xs font-bold text-white">{inspectModalItem.vehicleType || 'Dedicated Private Cab'}</div>
                      <div className="text-[11px] text-slate-400">
                        Rate: <strong className="text-slate-200">₹{vehicleDailyRate.toLocaleString('en-IN')} / Day</strong> &bull; {tripDays} Days Duration
                      </div>
                      <span className="text-[10px] text-slate-500 block">
                        Includes fuel, driver allowance, permits, toll &amp; airport transfers
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-orange-400" />
                        <span>Meal Plan</span>
                      </span>
                      <div className="text-xs font-bold text-white">{inspectModalItem.mealPlan || 'Breakfast & Dinner Included'}</div>
                      <span className="text-[11px] text-slate-400 block">
                        Included across all hotel stays
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        MAP Plan: Daily breakfast &amp; dinner at properties
                      </span>
                    </div>
                  </div>

                  {/* Day-Wise Sightseeing & Activities */}
                  {Array.isArray(inspectModalItem.dayActivities) && inspectModalItem.dayActivities.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-orange-400" />
                          <span>Day-Wise Sightseeing &amp; Experiences</span>
                        </span>
                        {totalActivitiesB2BCost > 0 && (
                          <span className="text-xs font-bold text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2.5 py-0.5 rounded-lg font-mono">
                            Total Activities: ₹{totalActivitiesB2BCost.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="border border-slate-800 rounded-2xl divide-y divide-slate-800 bg-slate-950 max-h-56 overflow-y-auto">
                        {inspectModalItem.dayActivities.map((dr: any, idx: number) => {
                          const exps = Array.isArray(dr.experiences) ? dr.experiences : [];
                          let expStr = '';
                          if (exps.length > 0) {
                            expStr = exps.map((e: any) => typeof e === 'string' ? e : e?.name).filter(Boolean).join(', ');
                          } else if (Array.isArray(dr.activities)) {
                            expStr = dr.activities.filter(Boolean).join(', ');
                          } else if (dr.title) {
                            expStr = dr.title;
                          }

                          return (
                            <div key={idx} className="p-2.5 flex items-start justify-between gap-3 hover:bg-slate-900/40 transition">
                              <div className="flex items-start gap-2.5 min-w-0">
                                <span className="px-2 py-0.5 rounded bg-orange-600/20 text-orange-400 font-bold text-[10px] shrink-0 mt-0.5">
                                  Day {dr.dayNumber || dr.day || idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <span className="font-bold text-white text-xs">{dr.city || inspectModalItem.destination}: </span>
                                  <span className="text-slate-300 text-[11px]">{expStr || 'Local sightseeing & leisure'}</span>
                                  {exps.some((e: any) => Number(e?.ppCost) > 0) && (
                                    <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-mono">
                                      {exps.filter((e: any) => Number(e?.ppCost) > 0).map((e: any, eIdx: number) => (
                                        <span key={eIdx} className="bg-amber-950/60 text-amber-300 border border-amber-800/60 px-2 py-0.5 rounded">
                                          {e.name}: ₹{Number(e.ppCost).toLocaleString('en-IN')}/pax (₹{(Number(e.ppCost) * totalPax).toLocaleString('en-IN')} for {totalPax} Pax)
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">
                Generated: {new Date(inspectModalItem.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="flex items-center gap-2">
                {onLoadIntoForm && (
                  <button
                    type="button"
                    onClick={() => {
                      onLoadIntoForm(inspectModalItem);
                      setInspectModalItem(null);
                    }}
                    className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold cursor-pointer transition shadow-md flex items-center gap-1.5"
                  >
                    <span>📥 Load into Proposal Studio</span>
                  </button>
                )}
                <a
                  href={inspectModalItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Link ↗</span>
                </a>
                <button
                  type="button"
                  onClick={() => setInspectModalItem(null)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold cursor-pointer transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
