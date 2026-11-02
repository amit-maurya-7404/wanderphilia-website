'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Save,
  Code,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Copy,
  Upload,
  Calendar,
  MapPin,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Search,
  Hotel,
  Car,
  Compass,
  Check,
  ExternalLink,
  Sliders,
  DollarSign,
  Tag,
  ShieldCheck,
  Globe,
  Star,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Predefined Destination Categories
const POPULAR_DESTINATIONS = [
  'Leh Ladakh',
  'Spiti Valley',
  'Kashmir',
  'Rajasthan',
  'Meghalaya',
  'Sikkim',
  'Himachal',
  'Uttarakhand',
  'Kerala',
  'Andaman',
  'Bali',
  'Thailand',
  'Vietnam',
  'Bhutan',
  'Nepal',
  'Singapore',
  'Dubai'
];

interface DayPlanItem {
  day: number;
  title: string;
  stayHotel: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  timeline: string[]; // Sightseeing & Experiences
  image?: string;
}

interface CostingItem {
  label: string;
  value: string;
}

interface BatchDateItem {
  month: string;
  ranges: string;
}

interface Placements {
  homepage: boolean;
  indiaTrips: boolean;
  internationalTrips: boolean;
  upcomingTours: boolean;
  honeymoon: boolean;
  christmasNewYear: boolean;
  destinationPage: boolean;
  destinationCategory: string;
  sections: {
    available: boolean;
    family: boolean;
    custom: boolean;
    related: boolean;
  };
}

export default function WebsiteItineraryPage() {
  const router = useRouter();

  // Zoho Itineraries (Products) State
  const [zohoItineraries, setZohoItineraries] = useState<any[]>([]);
  const [loadingZohoItineraries, setLoadingZohoItineraries] = useState(false);
  const [selectedZohoId, setSelectedZohoId] = useState('');
  const [zohoFilterSearch, setZohoFilterSearch] = useState('');

  // Zoho Master Data State
  const [zohoMaster, setZohoMaster] = useState<{
    activities: any[];
    hotels: any[];
    vehicles: any[];
  }>({ activities: [], hotels: [], vehicles: [] });
  const [loadingZohoMaster, setLoadingZohoMaster] = useState(false);
  const [activeMasterDayIndex, setActiveMasterDayIndex] = useState<number | null>(null);
  const [masterSearchQuery, setMasterSearchQuery] = useState('');

  // Basic Info Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tripType, setTripType] = useState<'India' | 'International'>('India');
  const [destination, setDestination] = useState('Leh Ladakh');
  const [region, setRegion] = useState('North India');
  const [category, setCategory] = useState('Leh Ladakh');
  const [durationDays, setDurationDays] = useState<number>(6);
  const [durationNights, setDurationNights] = useState<number>(5);
  const [price, setPrice] = useState<number>(24999);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Hard' | 'Easy to Moderate'>('Moderate');
  const [groupSize, setGroupSize] = useState<string>('12-16 Persons');
  const [rating, setRating] = useState<number>(4.9);
  const [description, setDescription] = useState('');
  const [route, setRoute] = useState('');
  const [staySummary, setStaySummary] = useState('');
  const [highlights, setHighlights] = useState<string[]>([
    'Scenic High-Altitude Mountain Passes',
    'Curated Stays & Delicious Meals',
    'Experienced Local Trip Captain & Guide',
    'Seamless Private & Group Transfers'
  ]);

  // Pricing & Costing Breakdown
  const [costingDetails, setCostingDetails] = useState<CostingItem[]>([
    { label: 'Double Sharing Basis', value: '₹26,999/- per person' },
    { label: 'Triple Sharing Basis', value: '₹24,999/- per person' },
    { label: 'Solo Rider / Single Room', value: '₹34,999/- per person' }
  ]);

  // Media
  const [heroImage, setHeroImage] = useState('/images/LL2.jpg');
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/images/LL2.jpg',
    '/images/dummy1.jpg',
    '/images/dummy2.jpg'
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Day-wise Plans
  const [dayPlans, setDayPlans] = useState<DayPlanItem[]>([
    {
      day: 1,
      title: 'Arrival & Acclimatization',
      stayHotel: 'Deluxe Hotel',
      meals: { breakfast: false, lunch: false, dinner: true },
      timeline: [
        'Airport pickup and transfer to hotel',
        'Rest and mandatory high-altitude acclimatization',
        'Evening stroll in local market',
        'Trip briefing & welcome dinner'
      ],
      image: '/images/LL2.jpg'
    }
  ]);

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    'Accommodation on sharing basis as per selected package',
    'Buffet Breakfast & Dinner as mentioned in day plans',
    'All inner line permits, environmental fees & wildlife charges',
    'Dedicated Tempo Traveller / SUV for entire trip as per plan',
    '24/7 On-Ground Support & Professional Trip Captain'
  ]);

  const [exclusions, setExclusions] = useState<string[]>([
    'Airfare / Train tickets to and from reporting hub',
    '5% GST / TCS as applicable',
    'Lunches, snacks and extra personal beverages',
    'Adventure activities (ATV, Rafting, Camel Safari, Paragliding, etc.)',
    'Any personal expenses or medical insurance'
  ]);

  // Batch Dates
  const [batchDates, setBatchDates] = useState<BatchDateItem[]>([
    { month: 'May 2026', ranges: '10 May - 15 May, 20 May - 25 May' },
    { month: 'June 2026', ranges: '05 Jun - 10 Jun, 18 Jun - 23 Jun' }
  ]);

  // Page & Placement Selection Matrix (Target requirement)
  const [placements, setPlacements] = useState<Placements>({
    homepage: true,
    indiaTrips: true,
    internationalTrips: false,
    upcomingTours: true,
    honeymoon: false,
    christmasNewYear: false,
    destinationPage: true,
    destinationCategory: 'leh-ladakh',
    sections: {
      available: true,
      family: true,
      custom: false,
      related: false
    }
  });

  // Saving / UI Feedback State
  const [saving, setSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === cleanSlug(title)) {
      setSlug(cleanSlug(val));
    }
  };

  function cleanSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // 1. Fetch Zoho Fixed Itineraries (Products)
  const fetchZohoFixedItineraries = async () => {
    setLoadingZohoItineraries(true);
    try {
      const res = await fetch(`/api/zoho/fixed-itineraries?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.itineraries)) {
        setZohoItineraries(data.itineraries);
      }
    } catch (err) {
      console.error('[Failed to fetch Zoho Itineraries]:', err);
    } finally {
      setLoadingZohoItineraries(false);
    }
  };

  // 2. Fetch Zoho Master Data (Activities, Hotels, Vehicles)
  const fetchZohoMasterData = async () => {
    setLoadingZohoMaster(true);
    try {
      const res = await fetch(`/api/zoho/master-data?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success) {
        setZohoMaster({
          activities: data.activities || [],
          hotels: data.hotels || [],
          vehicles: data.vehicles || []
        });
      }
    } catch (err) {
      console.error('[Failed to fetch Zoho Master Data]:', err);
    } finally {
      setLoadingZohoMaster(false);
    }
  };

  useEffect(() => {
    fetchZohoFixedItineraries();
    fetchZohoMasterData();
  }, []);

  // Handle Importing a full Fixed Itinerary from Zoho Products
  const handleImportZohoProduct = async (zohoId: string) => {
    if (!zohoId) return;
    setSelectedZohoId(zohoId);
    setLoadingZohoItineraries(true);
    setSaveError(null);

    try {
      const res = await fetch(`/api/zoho/fixed-itineraries?id=${encodeURIComponent(zohoId)}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.itinerary) {
        throw new Error(data.error || 'Failed to fetch itinerary details from Zoho');
      }

      const itin = data.itinerary;
      setTitle(itin.name || 'Curated Journey');
      setSlug(cleanSlug(itin.name || 'curated-journey'));

      if (itin.destination) {
        setDestination(itin.destination);
        setCategory(itin.destination);
        const lowerDest = itin.destination.toLowerCase().replace(/\s+/g, '-');
        setPlacements(prev => ({
          ...prev,
          destinationCategory: lowerDest
        }));
      }

      const isInt = itin.destinationType?.toLowerCase() === 'international';
      setTripType(isInt ? 'International' : 'India');
      setPlacements(prev => ({
        ...prev,
        indiaTrips: !isInt,
        internationalTrips: isInt
      }));

      const numDays = itin.noOfDays || 1;
      const numNights = itin.noOfNights || Math.max(1, numDays - 1);
      setDurationDays(numDays);
      setDurationNights(numNights);

      // Build Day Plans from Zoho Day Rows
      if (Array.isArray(itin.dayRows) && itin.dayRows.length > 0) {
        const newDays: DayPlanItem[] = itin.dayRows.map((row: any, idx: number) => {
          const experiences: string[] = [];

          // Collect valid experience names
          if (Array.isArray(row.experiences)) {
            row.experiences.forEach((exp: string, expIdx: number) => {
              if (exp && exp.trim()) {
                const desc = row.descriptions?.[expIdx];
                const text = desc ? `${exp.trim()}: ${desc.trim()}` : exp.trim();
                experiences.push(text);
              }
            });
          }

          if (row.city2 && !experiences.some(e => e.includes(row.city2))) {
            experiences.unshift(`Transfer to ${row.city2}`);
          }

          return {
            day: row.dayNumber || idx + 1,
            title: row.city ? `Day ${idx + 1}: ${row.city} Exploration` : `Day ${idx + 1}`,
            stayHotel: row.city ? `Hotel / Resort in ${row.city}` : 'Comfortable Stay',
            meals: {
              breakfast: true,
              lunch: false,
              dinner: true
            },
            timeline: experiences.length > 0 ? experiences : [
              'Morning breakfast at hotel',
              'Scenic drive and exploration of local highlights',
              'Overnight stay at hotel'
            ],
            image: heroImage || '/images/LL2.jpg'
          };
        });

        setDayPlans(newDays);

        // Auto-compute stay summary
        const cityStays: Record<string, number> = {};
        itin.dayRows.forEach((r: any) => {
          const c = r.city || r.city2 || 'Dest';
          if (c) cityStays[c] = (cityStays[c] || 0) + 1;
        });
        const summaryStr = Object.entries(cityStays)
          .map(([city, nights]) => `${nights}N ${city}`)
          .join(' | ');
        setStaySummary(summaryStr);

        // Auto-compute route
        const routeCities = Array.from(
          new Set(itin.dayRows.map((r: any) => r.city || r.city2).filter(Boolean))
        );
        if (routeCities.length > 0) {
          setRoute(routeCities.join(' → '));
        }
      }

      setSaveSuccessMsg(`Successfully imported "${itin.name}" from Zoho CRM!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error importing Zoho itinerary');
    } finally {
      setLoadingZohoItineraries(false);
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (file: File, type: 'hero' | 'gallery' | 'day', dayIndex?: number) => {
    setUploadingImage(true);
    setSaveError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Failed to upload image');

      if (type === 'hero') {
        setHeroImage(data.url);
      } else if (type === 'gallery') {
        setGalleryImages(prev => [...prev, data.url]);
      } else if (type === 'day' && dayIndex !== undefined) {
        setDayPlans(prev => {
          const copy = [...prev];
          copy[dayIndex].image = data.url;
          return copy;
        });
      }
    } catch (err: any) {
      setSaveError(err.message || 'Image upload error');
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Day
  const handleAddDay = () => {
    const nextDayNum = dayPlans.length + 1;
    setDayPlans(prev => [
      ...prev,
      {
        day: nextDayNum,
        title: `Day ${nextDayNum}: Sightseeing & Exploration`,
        stayHotel: 'Comfortable Hotel',
        meals: { breakfast: true, lunch: false, dinner: true },
        timeline: ['Morning breakfast', 'Sightseeing excursion', 'Overnight stay'],
        image: heroImage || '/images/LL2.jpg'
      }
    ]);
    setDurationDays(nextDayNum);
    setDurationNights(Math.max(1, nextDayNum - 1));
  };

  // Delete Day
  const handleDeleteDay = (idx: number) => {
    if (dayPlans.length <= 1) return;
    const filtered = dayPlans.filter((_, i) => i !== idx);
    const renumbered = filtered.map((d, i) => ({ ...d, day: i + 1 }));
    setDayPlans(renumbered);
    setDurationDays(renumbered.length);
    setDurationNights(Math.max(1, renumbered.length - 1));
  };

  // Build Final Trip Payload
  const buildTripPayload = () => {
    const cleanId = slug.toUpperCase().replace(/[^A-Z0-9]/g, '-');

    // Transform day plans to website Trip itinerary format
    const itinerary = dayPlans.map(d => {
      const descLines: string[] = [];

      // Add timeline bullet points
      d.timeline.forEach(point => {
        if (point.trim()) descLines.push(point.trim());
      });

      // Add Hotel line
      if (d.stayHotel && d.stayHotel.trim()) {
        descLines.push(`Accommodation: ${d.stayHotel.trim()}`);
      }

      // Add Meals line
      const mealsIncluded: string[] = [];
      if (d.meals.breakfast) mealsIncluded.push('Breakfast');
      if (d.meals.lunch) mealsIncluded.push('Lunch');
      if (d.meals.dinner) mealsIncluded.push('Dinner');
      if (mealsIncluded.length > 0) {
        descLines.push(`Meals: ${mealsIncluded.join(' & ')} Included`);
      }

      return {
        day: d.day,
        title: d.title,
        description: descLines,
        image: d.image || heroImage
      };
    });

    // Transform batch dates
    const formattedBatchDates = batchDates
      .filter(b => b.month.trim() && b.ranges.trim())
      .map(b => ({
        month: b.month.trim(),
        ranges: b.ranges.split(',').map(r => r.trim()).filter(Boolean)
      }));

    return {
      id: cleanId,
      title: title.trim(),
      slug: slug.trim(),
      image: heroImage,
      destination: destination.trim(),
      category: category.trim(),
      tripType,
      region: region.trim(),
      duration: durationDays,
      nights: durationNights,
      price: Number(price) || 0,
      difficulty,
      groupSize: parseInt(groupSize.replace(/\D+/g, ''), 10) || 15,
      rating: Number(rating) || 4.9,
      description: description.trim() || `${durationDays} Days / ${durationNights} Nights luxury journey in ${destination}.`,
      route: route.trim(),
      staySummary: staySummary.trim(),
      highlights: highlights.filter(h => h.trim().length > 0),
      gallery: galleryImages,
      images: galleryImages,
      heroMedia: galleryImages.map(src => ({
        type: 'image' as const,
        src,
        alt: title.trim()
      })),
      itinerary,
      costingDetails: costingDetails.filter(c => c.label.trim() && c.value.trim()),
      included: inclusions.filter(i => i.trim().length > 0),
      inclusions: inclusions.filter(i => i.trim().length > 0),
      notIncluded: exclusions.filter(e => e.trim().length > 0),
      exclusions: exclusions.filter(e => e.trim().length > 0),
      batchDates: formattedBatchDates,
      placements
    };
  };

  // Submit / Save to MongoDB
  const handleSaveToMongoDB = async () => {
    if (!title.trim() || !slug.trim()) {
      setSaveError('Please enter both Trip Title and URL Slug.');
      return;
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccessMsg(null);

    try {
      const payload = buildTripPayload();

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save itinerary to database');
      }

      setSaveSuccessMsg(`Trip "${title}" published live successfully!`);
    } catch (err: any) {
      setSaveError(err.message || 'Error publishing trip');
    } finally {
      setSaving(false);
    }
  };

  // Export Code Modal Generator
  const handleOpenExportModal = () => {
    const payload = buildTripPayload();
    const formatted = `  {\n` +
      `    id: '${payload.id}',\n` +
      `    title: ${JSON.stringify(payload.title)},\n` +
      `    slug: '${payload.slug}',\n` +
      `    image: '${payload.image}',\n` +
      `    destination: '${payload.destination}',\n` +
      `    category: '${payload.category}',\n` +
      `    tripType: '${payload.tripType}',\n` +
      `    region: '${payload.region}',\n` +
      `    duration: ${payload.duration},\n` +
      `    nights: ${payload.nights},\n` +
      `    price: ${payload.price},\n` +
      `    difficulty: '${payload.difficulty}',\n` +
      `    groupSize: ${payload.groupSize},\n` +
      `    rating: ${payload.rating},\n` +
      `    route: '${payload.route}',\n` +
      `    staySummary: '${payload.staySummary}',\n` +
      `    description: ${JSON.stringify(payload.description)},\n` +
      `    highlights: ${JSON.stringify(payload.highlights, null, 6)},\n` +
      `    gallery: ${JSON.stringify(payload.gallery, null, 6)},\n` +
      `    costingDetails: ${JSON.stringify(payload.costingDetails, null, 6)},\n` +
      `    itinerary: ${JSON.stringify(payload.itinerary, null, 6)},\n` +
      `    included: ${JSON.stringify(payload.included, null, 6)},\n` +
      `    notIncluded: ${JSON.stringify(payload.notIncluded, null, 6)},\n` +
      `    batchDates: ${JSON.stringify(payload.batchDates, null, 6)}\n` +
      `  },`;

    setGeneratedCode(formatted);
    setExportModalOpen(true);
    setCopiedCode(false);
  };

  const handleCopyExportCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Filtered Zoho Itineraries for dropdown
  const filteredZohoItins = useMemo(() => {
    if (!zohoFilterSearch.trim()) return zohoItineraries;
    const q = zohoFilterSearch.toLowerCase();
    return zohoItineraries.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.destination?.toLowerCase().includes(q) ||
      i.category?.toLowerCase().includes(q)
    );
  }, [zohoItineraries, zohoFilterSearch]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 selection:bg-orange-500 selection:text-white">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800"
            title="Back to Admin"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">Website Itinerary Creator</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Zoho CRM Sync
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Publish complete tour packages with Zoho CRM master data & custom page placement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewModalOpen(true)}
            className="border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs h-9 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Preview Itinerary
          </Button>

          {slug && (
            <Link
              href={`/trips/${slug}`}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Open /trips/{slug}
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenExportModal}
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs h-9"
          >
            <Code className="w-3.5 h-3.5 mr-1.5 text-amber-400" /> Export Code
          </Button>

          <Button
            type="button"
            size="sm"
            disabled={saving}
            onClick={handleSaveToMongoDB}
            className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-xs h-9 shadow-lg shadow-orange-600/25 px-4 cursor-pointer"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            {saving ? 'Publishing...' : 'Publish to Website'}
          </Button>
        </div>
      </header>

      {/* Status Alerts */}
      {saveSuccessMsg && (
        <div className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
          <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            {slug && (
              <Link
                href={`/trips/${slug}`}
                target="_blank"
                className="underline hover:text-white font-semibold flex items-center gap-1"
              >
                Open /trips/{slug} <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {saveError && (
        <div className="max-w-6xl mx-auto mt-4 px-4 sm:px-6">
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800/80 text-red-200 text-xs flex items-center gap-2.5 shadow-lg">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{saveError}</span>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 space-y-6">
        {/* 1. Zoho CRM Integration Banner */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Zoho CRM Quick Import (Fixed Itineraries)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select any itinerary from Zoho CRM Products to auto-fill day plans, activities, duration & route.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchZohoFixedItineraries}
                disabled={loadingZohoItineraries}
                className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs h-8"
              >
                <RefreshCw className={`w-3 h-3 mr-1.5 ${loadingZohoItineraries ? 'animate-spin text-orange-400' : ''}`} />
                Refresh Zoho List
              </Button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Zoho Itineraries..."
                  value={zohoFilterSearch}
                  onChange={(e) => setZohoFilterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <select
                value={selectedZohoId}
                onChange={(e) => handleImportZohoProduct(e.target.value)}
                disabled={loadingZohoItineraries}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 truncate"
              >
                <option value="">-- Click to choose Zoho CRM Itinerary to auto-fill --</option>
                {filteredZohoItins.map((itin) => (
                  <option key={itin.id} value={itin.id}>
                    {itin.name} {itin.destination ? `(${itin.destination})` : ''} {itin.noOfDays ? `[${itin.noOfDays}D/${itin.noOfNights || itin.noOfDays - 1}N]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 2. Page & Placement Selection Matrix (Target user requirement) */}
        <section className="bg-slate-900/90 border border-orange-500/20 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#ff5d09]" />
            <h2 className="text-base font-bold text-white tracking-tight">
              Website Placements & Display Selection
            </h2>
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Choose exactly which website pages and sections this tour package will appear in.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Homepage */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.homepage ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.homepage}
                onChange={(e) => setPlacements({ ...placements, homepage: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">Homepage (Featured Tours)</p>
                <p className="text-[11px] text-slate-400">Shows on Wanderphilia home page carousel</p>
              </div>
            </label>

            {/* India Trips */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.indiaTrips ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.indiaTrips}
                onChange={(e) => setPlacements({ ...placements, indiaTrips: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">India / Domestic Trips Page</p>
                <p className="text-[11px] text-slate-400">Shows at /india-trips</p>
              </div>
            </label>

            {/* International Trips */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.internationalTrips ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.internationalTrips}
                onChange={(e) => setPlacements({ ...placements, internationalTrips: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">International Trips Page</p>
                <p className="text-[11px] text-slate-400">Shows at /international-trips</p>
              </div>
            </label>

            {/* Upcoming Group Tours */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.upcomingTours ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.upcomingTours}
                onChange={(e) => setPlacements({ ...placements, upcomingTours: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">Upcoming Group Tours</p>
                <p className="text-[11px] text-slate-400">Shows at /upcoming-tours with batch calendar</p>
              </div>
            </label>

            {/* Honeymoon Packages */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.honeymoon ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.honeymoon}
                onChange={(e) => setPlacements({ ...placements, honeymoon: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">Honeymoon Specials</p>
                <p className="text-[11px] text-slate-400">Shows at /honeymoon</p>
              </div>
            </label>

            {/* Christmas & New Year */}
            <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.christmasNewYear ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
              <input
                type="checkbox"
                checked={placements.christmasNewYear}
                onChange={(e) => setPlacements({ ...placements, christmasNewYear: e.target.checked })}
                className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
              />
              <div>
                <p className="text-xs font-bold">Christmas & New Year</p>
                <p className="text-[11px] text-slate-400">Shows at /christmas-and-new-year</p>
              </div>
            </label>
          </div>

          {/* Destination Specific Section Mapping */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Destination Page & Sub-Sections (Section Mappings)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Select destination URL key and the exact tabs where package appears.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">/trips/</span>
                <input
                  type="text"
                  value={placements.destinationCategory}
                  onChange={(e) => setPlacements({
                    ...placements,
                    destinationCategory: e.target.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
                  })}
                  placeholder="e.g. rajasthan, leh-ladakh, spiti, bali"
                  className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-orange-400 w-36 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.sections.available}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, available: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Available Packages</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.sections.family}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, family: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Family Packages</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.sections.custom}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, custom: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Customized Packages</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={placements.sections.related}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, related: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Related / Recommended</span>
              </label>
            </div>
          </div>
        </section>

        {/* 3. Basic Information */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-bold text-white tracking-tight">Trip Details & SEO URL</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Trip Title / Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 6 Days Leh - Leh Bike Group Trip with Nubra Valley & Pangong Lake"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                URL Slug (/trips/[slug]) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={slug}
                  onChange={(e) => setSlug(cleanSlug(e.target.value))}
                  placeholder="e.g. leh-leh-bike-group-trip"
                  className="bg-slate-950 border-slate-800 text-orange-400 font-mono text-xs py-2"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSlug(cleanSlug(title))}
                  className="border-slate-800 bg-slate-950 text-slate-400 text-xs shrink-0"
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Trip Type</label>
              <select
                value={tripType}
                onChange={(e) => {
                  const val = e.target.value as 'India' | 'International';
                  setTripType(val);
                  setPlacements(prev => ({
                    ...prev,
                    indiaTrips: val === 'India',
                    internationalTrips: val === 'International'
                  }));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="India">India (Domestic)</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Destination / State</label>
              <Input
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setCategory(e.target.value);
                }}
                placeholder="e.g. Leh Ladakh"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Days</label>
              <Input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => {
                  const d = parseInt(e.target.value, 10) || 1;
                  setDurationDays(d);
                  setDurationNights(Math.max(1, d - 1));
                }}
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Nights</label>
              <Input
                type="number"
                min="0"
                value={durationNights}
                onChange={(e) => setDurationNights(parseInt(e.target.value, 10) || 0)}
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Starting Price (₹)</label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value, 10) || 0)}
                className="bg-slate-950 border-slate-800 text-emerald-400 font-bold text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
              >
                <option value="Easy">Easy</option>
                <option value="Easy to Moderate">Easy to Moderate</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Group Size</label>
              <Input
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                placeholder="e.g. 12-16 Persons"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Rating</label>
              <Input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value) || 4.9)}
                className="bg-slate-950 border-slate-800 text-amber-400 font-bold text-xs py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Route Plan</label>
              <Input
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                placeholder="e.g. Leh → Nubra Valley → Pangong Lake → Leh"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Stay Summary</label>
              <Input
                value={staySummary}
                onChange={(e) => setStaySummary(e.target.value)}
                placeholder="e.g. 3N Leh | 1N Nubra | 1N Pangong"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Overview / Narrative Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Are you ready for an unforgettable adventure in the breathtaking landscapes..."
              className="bg-slate-950 border-slate-800 text-white text-xs"
            />
          </div>

          {/* Highlights */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-300">Trip Highlights</label>
              <button
                type="button"
                onClick={() => setHighlights([...highlights, ''])}
                className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Highlight
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={h}
                    onChange={(e) => {
                      const copy = [...highlights];
                      copy[idx] = e.target.value;
                      setHighlights(copy);
                    }}
                    placeholder={`Highlight #${idx + 1}`}
                    className="bg-slate-950 border-slate-800 text-white text-xs py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Costing & Sharing Breakdown */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white tracking-tight">Costing Details & Sharing Rates</h2>
            </div>
            <button
              type="button"
              onClick={() => setCostingDetails([...costingDetails, { label: '', value: '' }])}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Costing Row
            </button>
          </div>

          <div className="space-y-2.5">
            {costingDetails.map((c, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={c.label}
                  onChange={(e) => {
                    const copy = [...costingDetails];
                    copy[idx].label = e.target.value;
                    setCostingDetails(copy);
                  }}
                  placeholder="e.g. Double Sharing Basis"
                  className="bg-slate-950 border-slate-800 text-white text-xs w-1/2 py-2"
                />
                <Input
                  value={c.value}
                  onChange={(e) => {
                    const copy = [...costingDetails];
                    copy[idx].value = e.target.value;
                    setCostingDetails(copy);
                  }}
                  placeholder="e.g. ₹24,999/- per person"
                  className="bg-slate-950 border-slate-800 text-emerald-400 font-semibold text-xs w-1/2 py-2"
                />
                <button
                  type="button"
                  onClick={() => setCostingDetails(costingDetails.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Media & Photos */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-bold text-white tracking-tight">Hero Banner & Gallery Images</h2>
          </div>

          {/* Hero Image */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Hero Banner Image</label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Input
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="/images/LL2.jpg"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2 grow"
              />
              <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'hero');
                  }}
                />
              </label>
            </div>
            {heroImage && (
              <div className="mt-2.5 relative h-32 w-full sm:w-64 rounded-xl overflow-hidden border border-slate-800">
                <Image src={heroImage} alt="Hero Preview" fill className="object-cover" />
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-300">Gallery / Collage Images</label>
              <label className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer">
                <Upload className="w-3 h-3" /> Upload to Gallery
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'gallery');
                  }}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-28">
                  <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                    className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Day-Wise Itinerary Builder */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Day-by-Day Detailed Plan ({dayPlans.length} Days)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Each day supports timeline points, stays, meals and image.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={handleAddDay}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Day
            </Button>
          </div>

          <div className="space-y-4">
            {dayPlans.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 relative space-y-3.5"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
                  <div className="flex items-center gap-2.5 grow">
                    <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-[#ff5d09] font-bold text-xs flex items-center justify-center shrink-0">
                      {day.day}
                    </span>
                    <Input
                      value={day.title}
                      onChange={(e) => {
                        const copy = [...dayPlans];
                        copy[dayIdx].title = e.target.value;
                        setDayPlans(copy);
                      }}
                      placeholder={`Day ${day.day} Title (e.g. Day ${day.day}: Arrival & City Tour)`}
                      className="bg-transparent border-0 text-white font-bold text-sm focus-visible:ring-0 p-0 h-auto"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteDay(dayIdx)}
                    disabled={dayPlans.length <= 1}
                    className="text-slate-500 hover:text-red-400 disabled:opacity-30 p-1"
                    title="Delete Day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Day Details: Stay & Meals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                      <Hotel className="w-3 h-3 text-amber-400" /> Overnight Stay / Hotel
                    </label>
                    <Input
                      value={day.stayHotel}
                      onChange={(e) => {
                        const copy = [...dayPlans];
                        copy[dayIdx].stayHotel = e.target.value;
                        setDayPlans(copy);
                      }}
                      placeholder="e.g. Deluxe Hotel in Leh / Camp in Nubra"
                      className="bg-slate-900 border-slate-800 text-white text-xs py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Meals Included</label>
                    <div className="flex items-center gap-4 mt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.meals.breakfast}
                          onChange={(e) => {
                            const copy = [...dayPlans];
                            copy[dayIdx].meals.breakfast = e.target.checked;
                            setDayPlans(copy);
                          }}
                          className="rounded accent-[#ff5d09]"
                        />
                        <span>Breakfast</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.meals.lunch}
                          onChange={(e) => {
                            const copy = [...dayPlans];
                            copy[dayIdx].meals.lunch = e.target.checked;
                            setDayPlans(copy);
                          }}
                          className="rounded accent-[#ff5d09]"
                        />
                        <span>Lunch</span>
                      </label>

                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.meals.dinner}
                          onChange={(e) => {
                            const copy = [...dayPlans];
                            copy[dayIdx].meals.dinner = e.target.checked;
                            setDayPlans(copy);
                          }}
                          className="rounded accent-[#ff5d09]"
                        />
                        <span>Dinner</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Timeline / Sightseeing points */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-medium text-slate-400">
                      Day Flow / Sightseeing & Activities (Timeline bullets)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...dayPlans];
                        copy[dayIdx].timeline.push('');
                        setDayPlans(copy);
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Point
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {day.timeline.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0" />
                        <Input
                          value={point}
                          onChange={(e) => {
                            const copy = [...dayPlans];
                            copy[dayIdx].timeline[pIdx] = e.target.value;
                            setDayPlans(copy);
                          }}
                          placeholder={`Activity / Experience #${pIdx + 1}`}
                          className="bg-slate-900 border-slate-800 text-white text-xs py-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...dayPlans];
                            copy[dayIdx].timeline = copy[dayIdx].timeline.filter((_, i) => i !== pIdx);
                            setDayPlans(copy);
                          }}
                          className="text-slate-600 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Day Image */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Input
                    value={day.image || ''}
                    onChange={(e) => {
                      const copy = [...dayPlans];
                      copy[dayIdx].image = e.target.value;
                      setDayPlans(copy);
                    }}
                    placeholder="Day Image URL (defaults to hero image)"
                    className="bg-slate-900 border-slate-800 text-slate-300 text-xs py-1.5 grow"
                  />
                  <label className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3 h-3" /> Upload Day Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'day', dayIdx);
                      }}
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Inclusions & Exclusions */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Inclusions & Exclusions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inclusions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  What's Included
                </label>
                <button
                  type="button"
                  onClick={() => setInclusions([...inclusions, ''])}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Inclusion
                </button>
              </div>
              <div className="space-y-2">
                {inclusions.map((inc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={inc}
                      onChange={(e) => {
                        const copy = [...inclusions];
                        copy[idx] = e.target.value;
                        setInclusions(copy);
                      }}
                      className="bg-slate-950 border-slate-800 text-white text-xs py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => setInclusions(inclusions.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  What's Excluded
                </label>
                <button
                  type="button"
                  onClick={() => setExclusions([...exclusions, ''])}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Exclusion
                </button>
              </div>
              <div className="space-y-2">
                {exclusions.map((exc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      value={exc}
                      onChange={(e) => {
                        const copy = [...exclusions];
                        copy[idx] = e.target.value;
                        setExclusions(copy);
                      }}
                      className="bg-slate-950 border-slate-800 text-white text-xs py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => setExclusions(exclusions.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 8. Batch Dates (for upcoming group tours) */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              <h2 className="text-base font-bold text-white tracking-tight">
                Upcoming Group Tour Batches
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setBatchDates([...batchDates, { month: '', ranges: '' }])}
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Batch Month
            </button>
          </div>

          <div className="space-y-2.5">
            {batchDates.map((b, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Input
                  value={b.month}
                  onChange={(e) => {
                    const copy = [...batchDates];
                    copy[idx].month = e.target.value;
                    setBatchDates(copy);
                  }}
                  placeholder="e.g. May 2026"
                  className="bg-slate-950 border-slate-800 text-white text-xs w-1/3 py-2"
                />
                <Input
                  value={b.ranges}
                  onChange={(e) => {
                    const copy = [...batchDates];
                    copy[idx].ranges = e.target.value;
                    setBatchDates(copy);
                  }}
                  placeholder="e.g. 10 May - 15 May, 20 May - 25 May"
                  className="bg-slate-950 border-slate-800 text-white text-xs w-2/3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setBatchDates(batchDates.filter((_, i) => i !== idx))}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Floating Publish Bar */}
        <div className="sticky bottom-6 z-40 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="text-xs">
              <span className="font-bold text-white">Target URL:</span>{' '}
              <span className="font-mono text-orange-400">/trips/{slug || '...'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewModalOpen(true)}
              className="border-slate-800 bg-slate-950 text-slate-200 text-xs grow sm:grow-0 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 mr-1 text-blue-400" /> Preview Itinerary
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenExportModal}
              className="border-slate-800 bg-slate-950 text-slate-300 text-xs grow sm:grow-0"
            >
              <Code className="w-3.5 h-3.5 mr-1 text-amber-400" /> Export Code
            </Button>

            <Button
              type="button"
              disabled={saving}
              onClick={handleSaveToMongoDB}
              className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-xs h-9 shadow-lg shadow-orange-600/25 px-5 grow sm:grow-0 cursor-pointer"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
              {saving ? 'Publishing Itinerary...' : 'Publish to Website (Live)'}
            </Button>
          </div>
        </div>
      </main>

      {/* Export Code Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-orange-400" /> Export TypeScript / JSON
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ready to paste directly into <code className="text-orange-400 font-mono">lib/data.ts</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setExportModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grow overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre">
              {generatedCode}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {copiedCode ? '✓ Copied to clipboard!' : 'Copy and paste into lib/data.ts'}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setExportModalOpen(false)}
                  className="border-slate-800 text-xs"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyExportCode}
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedCode ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Live Customer View Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full my-auto shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Eye className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">Live Customer View Preview</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Unpublished Draft Simulation
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Live preview of how travelers will experience this package at <span className="font-mono text-orange-400">/trips/{slug || 'your-slug'}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  type="button"
                  size="sm"
                  disabled={saving}
                  onClick={async () => {
                    await handleSaveToMongoDB();
                    setPreviewModalOpen(false);
                  }}
                  className="bg-gradient-to-r from-[#ff5d09] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium text-xs h-8 px-4 cursor-pointer"
                >
                  {saving ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                  {saving ? 'Publishing...' : 'Publish Now'}
                </Button>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-4 sm:p-8 space-y-8 bg-slate-950 text-slate-100">
              {/* Hero Banner Simulation */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 min-h-[360px] flex flex-col justify-end p-6 sm:p-10 shadow-2xl">
                {heroImage && (
                  <Image
                    src={heroImage}
                    alt={title || 'Tour Preview'}
                    fill
                    className="object-cover opacity-60"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff5d09] text-white shadow-lg shadow-orange-500/20">
                      {destination} • {tripType}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md">
                      {durationNights}N / {durationDays}D
                    </span>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                      <Star className="w-3 h-3 fill-current" /> {rating} ★
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    {title || 'Untitled Tour Package'}
                  </h1>

                  {/* Route & Stays */}
                  {(route || staySummary) && (
                    <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 pt-1">
                      {route && (
                        <div className="flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>{route}</span>
                        </div>
                      )}
                      {staySummary && (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Hotel className="w-4 h-4 text-amber-400 shrink-0" />
                          <span>{staySummary}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Starting From</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                      ₹{price?.toLocaleString('en-IN') || 0}
                    </span>
                    <span className="text-xs text-slate-400">/ person</span>
                  </div>
                </div>
              </div>

              {/* Quick Trip Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                <div className="p-3">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Duration</p>
                  <p className="text-sm font-bold text-white mt-1">{durationDays} Days / {durationNights} Nights</p>
                </div>
                <div className="p-3 border-l border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Difficulty</p>
                  <p className="text-sm font-bold text-white mt-1">{difficulty}</p>
                </div>
                <div className="p-3 border-l border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Group Size</p>
                  <p className="text-sm font-bold text-white mt-1">{groupSize}</p>
                </div>
                <div className="p-3 border-l border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Destination</p>
                  <p className="text-sm font-bold text-orange-400 mt-1">{destination}</p>
                </div>
              </div>

              {/* Overview & Highlights */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-bold text-white">Trip Overview</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {description || 'No overview description provided yet.'}
                </p>

                {highlights.length > 0 && (
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Key Highlights</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {highlights.filter(Boolean).map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Day-by-Day Itinerary Flow */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  Day-Wise Detailed Itinerary ({dayPlans.length} Days)
                </h3>

                <div className="space-y-3.5">
                  {dayPlans.map((day, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-[#ff5d09] text-white font-bold text-xs flex items-center justify-center shrink-0">
                            D{day.day}
                          </span>
                          <h4 className="text-sm font-bold text-white">{day.title}</h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {day.meals.breakfast && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Breakfast
                            </span>
                          )}
                          {day.meals.lunch && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Lunch
                            </span>
                          )}
                          {day.meals.dinner && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Dinner
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timeline points */}
                      <div className="space-y-2 pl-2">
                        {day.timeline.filter(Boolean).map((point, pIdx) => (
                          <div key={pIdx} className="flex items-start gap-3 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                            <span className="leading-relaxed">{point}</span>
                          </div>
                        ))}
                      </div>

                      {/* Stay */}
                      {day.stayHotel && (
                        <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                          <Hotel className="w-3.5 h-3.5 text-amber-400" />
                          <span>Overnight Accommodation: <strong className="text-white">{day.stayHotel}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Costing Breakdown Table */}
              {costingDetails.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Package Costing & Sharing Options
                  </h3>
                  <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden">
                    {costingDetails.filter(c => c.label && c.value).map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-950/60 text-xs">
                        <span className="text-slate-300 font-medium">{c.label}</span>
                        <span className="text-emerald-400 font-bold">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Inclusions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {inclusions.filter(Boolean).map((inc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Exclusions
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {exclusions.filter(Boolean).map((exc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold shrink-0">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Placements Matrix Info */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 space-y-2">
                <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Configured Website Placements
                </h4>
                <div className="flex flex-wrap gap-2 text-xs">
                  {placements.homepage && (
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                      ✓ Homepage Featured
                    </span>
                  )}
                  {placements.indiaTrips && (
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                      ✓ /india-trips
                    </span>
                  )}
                  {placements.internationalTrips && (
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                      ✓ /international-trips
                    </span>
                  )}
                  {placements.upcomingTours && (
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-200">
                      ✓ /upcoming-tours
                    </span>
                  )}
                  {placements.destinationCategory && (
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-orange-300">
                      ✓ Destination: /trips/{placements.destinationCategory}
                    </span>
                  )}
                  {placements.sections.available && (
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[11px]">
                      Section: Available
                    </span>
                  )}
                  {placements.sections.family && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-[11px]">
                      Section: Family
                    </span>
                  )}
                  {placements.sections.custom && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-[11px]">
                      Section: Custom
                    </span>
                  )}
                  {placements.sections.related && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[11px]">
                      Section: Related
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                URL Preview: <span className="text-orange-400 font-mono">https://wanderphilia.com/trips/{slug || '...'}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalOpen(false)}
                  className="border-slate-800 text-xs"
                >
                  Back to Editing
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={saving}
                  onClick={async () => {
                    await handleSaveToMongoDB();
                    setPreviewModalOpen(false);
                  }}
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs px-4"
                >
                  {saving ? 'Publishing...' : 'Publish to Website Now'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

