'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { trips as staticTrips } from '@/lib/data';
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
  Calendar as CalendarIcon,
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
  Users,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Wand2,
  FileText,
  X,
  ImageIcon,
  FolderOpen
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
  'Goa',
  'Bali',
  'Thailand',
  'Vietnam',
  'Bhutan',
  'Nepal',
  'Singapore',
  'Sri Lanka',
  'Dubai'
];

// Hotel Categories matching Zoho CRM
const HOTEL_CATEGORIES = ['Standard', 'Deluxe', 'Super Deluxe', 'Premium', 'Luxury'];

// Meal Plan Options
const MEAL_PLANS = [
  { code: 'MAPAI', label: 'MAPAI (Breakfast & Dinner Included)' },
  { code: 'CPAI', label: 'CPAI (Breakfast Only)' },
  { code: 'APAI', label: 'APAI (All Meals: Breakfast, Lunch & Dinner)' },
  { code: 'EPAI', label: 'EPAI (Room Only, No Meals)' }
];

// Preset Pricing Options
const DEFAULT_PRICING_OPTIONS = [
  { id: 'doubleSharing', label: 'Double Sharing Basis', defaultPrice: '26999', checked: true },
  { id: 'tripleSharing', label: 'Triple Sharing Basis', defaultPrice: '24999', checked: true },
  { id: 'quadSharing', label: 'Quad Sharing Basis', defaultPrice: '22999', checked: false },
  { id: 'soloRider', label: 'Solo Rider / Single Room', defaultPrice: '34999', checked: false },
  { id: 'bikeSolo', label: 'With Bike (Solo Rider)', defaultPrice: '32999', checked: false },
  { id: 'bikeDual', label: 'With Bike (Dual / Pillion)', defaultPrice: '26999', checked: false },
  { id: 'tempoSeat', label: 'Tempo Traveller / Cab Seat', defaultPrice: '24999', checked: false },
  { id: 'childWithBed', label: 'Child with Extra Bed', defaultPrice: '14999', checked: false },
  { id: 'childWithoutBed', label: 'Child without Bed', defaultPrice: '9999', checked: false }
];

interface DayPlanItem {
  day: number;
  title: string;
  city?: string;
  stayHotel: string;
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  timeline: string[];
  image?: string;
}

interface HotelStayRow {
  city: string;
  nights: number;
  category: string;
  hotelId: string;
  hotelName: string;
  roomCategory: string;
  basePrice: number;
  mealPlan: string;
}

interface BatchDateItem {
  month: string;
  ranges: string[];
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
    group: boolean;
    family: boolean;
    honeymoon: boolean;
    custom: boolean;
    related: boolean;
  };
}

// Helper to strictly ensure hotel name has "/ Similar"
export function formatHotelWithSimilar(name: string): string {
  if (!name || !name.trim()) return '';
  const trimmed = name.trim();
  if (/\/ similar/i.test(trimmed)) return trimmed;
  return `${trimmed} / Similar`;
}

function WebsiteItineraryInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams?.get('edit');

  // Edit Mode & Validation State
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingEditTrip, setLoadingEditTrip] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Top-Level Mode: Customized Tour vs Group Tour
  const [tourType, setTourType] = useState<'Group' | 'Customized'>('Group');

  // Zoho Itineraries (Products) State
  const [zohoItineraries, setZohoItineraries] = useState<any[]>([]);
  const [loadingZohoItineraries, setLoadingZohoItineraries] = useState(false);
  const [selectedZohoId, setSelectedZohoId] = useState('');
  const [zohoFilterSearch, setZohoFilterSearch] = useState('');

  // Zoho Master Data (Hotels, Destinations)
  const [zohoMaster, setZohoMaster] = useState<{
    hotelsByCity: Record<string, any[]>;
    destinations: string[];
  }>({ hotelsByCity: {}, destinations: [] });
  const [loadingZohoMaster, setLoadingZohoMaster] = useState(false);

  // Basic Info Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [tripType, setTripType] = useState<'India' | 'International'>('India');
  const [destination, setDestination] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [durationDays, setDurationDays] = useState<number>(6);
  const [durationNights, setDurationNights] = useState<number>(5);
  const [price, setPrice] = useState<number>(24999);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Moderate' | 'Hard' | 'Easy to Moderate'>('Moderate');
  const [groupSize, setGroupSize] = useState<number>(15);
  const [rating, setRating] = useState<number>(4.9);
  const [description, setDescription] = useState('');
  const [route, setRoute] = useState('');
  const [staySummary, setStaySummary] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);

  // Pricing Options Matrix
  const [pricingOptions, setPricingOptions] = useState(DEFAULT_PRICING_OPTIONS);
  const [customPricingLabel, setCustomPricingLabel] = useState('');
  const [customPricingPrice, setCustomPricingPrice] = useState('');
  const [showAddCustomPrice, setShowAddCustomPrice] = useState(false);

  // Media
  const [heroImage, setHeroImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Destination Image Visual Picker State
  const [imagePickerOpen, setImagePickerOpen] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'hero' | 'gallery' | number | null>(null);
  const [imagePickerDest, setImagePickerDest] = useState<string>('');
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([]);
  const [destImages, setDestImages] = useState<string[]>([]);
  const [loadingDestImages, setLoadingDestImages] = useState(false);
  const [selectedGalleryPicks, setSelectedGalleryPicks] = useState<string[]>([]);

  // Day-wise Plans
  const [dayPlans, setDayPlans] = useState<DayPlanItem[]>([
    {
      day: 1,
      title: 'Day 1: Arrival & Welcome',
      city: '',
      stayHotel: '',
      meals: { breakfast: false, lunch: false, dinner: true },
      timeline: [
        'Arrival at airport / railway station, meet our tour captain/driver, and transfer to hotel.',
        'Complete smooth hotel check-in formalities and freshen up.',
        'Evening at leisure to explore nearby local attractions.',
        'Trip briefing followed by a delicious welcome dinner.'
      ],
      image: ''
    }
  ]);

  // Hotel Stays (Calculated from Day Plans & Zoho CRM Hotels)
  const [hotelStays, setHotelStays] = useState<HotelStayRow[]>([]);
  const [globalHotelCategory, setGlobalHotelCategory] = useState<string>('Deluxe');
  const [globalMealPlan, setGlobalMealPlan] = useState<string>('MAPAI');

  // Inclusions & Exclusions
  const [inclusions, setInclusions] = useState<string[]>([
    'Accommodation on sharing basis as per selected package & hotel category',
    'Buffet Breakfast & Dinner as mentioned in the day-by-day plan',
    'All inner line permits, environmental fees, wildlife charges & border entry passes',
    'Dedicated Tempo Traveller / SUV vehicle for entire trip with fuel, toll & parking',
    'Professional Trip Captain / Tour Guide & 24/7 on-ground assistance',
    'First-aid medical kit and emergency oxygen cylinder on board'
  ]);

  const [exclusions, setExclusions] = useState<string[]>([
    'Airfare / Train tickets to and from the starting hub',
    '5% GST / TCS as applicable',
    'Lunches, snacks and extra personal beverages',
    'Adventure activities (ATV Ride, River Rafting, Camel Safari, Paragliding, etc.)',
    'Personal expenses, room heater charges, tips or personal travel insurance'
  ]);

  // Interactive Visual Batch Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 4, 1)); // Default May 2026
  const [hoveredDayNum, setHoveredDayNum] = useState<number | null>(null);
  const [batchDates, setBatchDates] = useState<BatchDateItem[]>([]);

  // Page Placements Matrix
  const [placements, setPlacements] = useState<Placements>({
    homepage: true,
    indiaTrips: true,
    internationalTrips: false,
    upcomingTours: true,
    honeymoon: false,
    christmasNewYear: false,
    destinationPage: true,
    destinationCategory: '',
    sections: {
      available: true,
      group: false,
      family: true,
      honeymoon: false,
      custom: false,
      related: false
    }
  });

  // Saving / AI / Modal Feedback State
  const [saving, setSaving] = useState(false);
  const [generatingHeadings, setGeneratingHeadings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  // Auto-slugify helper
  const cleanSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === cleanSlug(title)) {
      setSlug(cleanSlug(val));
    }
  };

  // 0. Load Itinerary for Editing if edit query param is present
  useEffect(() => {
    if (!editSlug) return;
    setIsEditMode(true);
    setLoadingEditTrip(true);

    const loadTripToEdit = async () => {
      try {
        let tripData: any = null;

        // Try MongoDB first
        const res = await fetch(`/api/trips?slug=${encodeURIComponent(editSlug)}`);
        if (res.ok) {
          const json = await res.json();
          if (json && !json.error && json.title) {
            tripData = json;
          }
        }

        // Fallback to staticTrips if not in MongoDB
        if (!tripData) {
          tripData = staticTrips.find(t => t.slug === editSlug || t.id === editSlug);
        }

        if (tripData) {
          setTitle(tripData.title || '');
          setSlug(tripData.slug || editSlug);
          setDestination(tripData.destination || '');
          setCategory(tripData.category || tripData.destination || '');
          setRegion(tripData.region || '');
          setTripType(tripData.tripType === 'International' ? 'International' : 'India');
          setTourType(tripData.tourType || (tripData.title?.toLowerCase().includes('group') ? 'Group' : 'Customized'));

          if (tripData.duration) setDurationDays(Number(tripData.duration));
          if (tripData.nights) setDurationNights(Number(tripData.nights));
          if (tripData.difficulty) setDifficulty(tripData.difficulty);
          if (tripData.groupSize) setGroupSize(Number(tripData.groupSize));
          if (tripData.rating) setRating(Number(tripData.rating));
          if (tripData.description) setDescription(tripData.description);
          if (tripData.route) setRoute(tripData.route);
          if (tripData.staySummary) setStaySummary(tripData.staySummary);
          if (tripData.image) setHeroImage(tripData.image);

          if (Array.isArray(tripData.gallery) && tripData.gallery.length > 0) {
            setGalleryImages(tripData.gallery);
          } else if (Array.isArray(tripData.images) && tripData.images.length > 0) {
            setGalleryImages(tripData.images);
          }

          const isGenericHighlights = Array.isArray(tripData.highlights) &&
            tripData.highlights.some((h: string) => h.includes('Mountain Passes') || h.includes('Handpicked Premium Stays'));

          if (Array.isArray(tripData.highlights) && tripData.highlights.length > 0 && !isGenericHighlights) {
            setHighlights(tripData.highlights);
          }
          if (Array.isArray(tripData.included) || Array.isArray(tripData.inclusions)) {
            setInclusions(tripData.included || tripData.inclusions);
          }
          if (Array.isArray(tripData.notIncluded) || Array.isArray(tripData.exclusions)) {
            setExclusions(tripData.notIncluded || tripData.exclusions);
          }
          if (Array.isArray(tripData.batchDates)) setBatchDates(tripData.batchDates);
          if (tripData.placements) setPlacements(tripData.placements);

          // Pricing
          if (Array.isArray(tripData.costingDetails) && tripData.costingDetails.length > 0) {
            setPricingOptions(prev => prev.map(p => {
              const matched = tripData.costingDetails.find((c: any) =>
                c.label?.toLowerCase() === p.label?.toLowerCase() ||
                p.label?.toLowerCase().includes(c.label?.toLowerCase())
              );
              if (matched) {
                const numericPrice = String(matched.value || '').replace(/\D+/g, '');
                return { ...p, checked: true, defaultPrice: numericPrice || p.defaultPrice };
              }
              return p;
            }));
          } else if (tripData.price) {
            setPrice(Number(tripData.price));
            setPricingOptions(prev => prev.map((p, idx) => idx === 0 ? { ...p, checked: true, defaultPrice: String(tripData.price) } : p));
          }

          // Itinerary / Day plans
          if (Array.isArray(tripData.itinerary) && tripData.itinerary.length > 0) {
            const mappedDays: DayPlanItem[] = tripData.itinerary.map((d: any, idx: number) => {
              const rawDesc = Array.isArray(d.description) ? d.description : (typeof d.description === 'string' ? d.description.split('\n') : []);
              return {
                day: d.day || idx + 1,
                title: d.title || `Day ${idx + 1}`,
                city: d.city || '',
                stayHotel: formatHotelWithSimilar(d.stayHotel || ''),
                image: d.image || tripData.image || '',
                timeline: rawDesc.filter((l: string) => !l.toLowerCase().startsWith('meals:') && !l.toLowerCase().startsWith('hotel:') && !l.toLowerCase().startsWith('accommodation:')),
                meals: {
                  breakfast: rawDesc.some((l: string) => l.toLowerCase().includes('breakfast')),
                  lunch: rawDesc.some((l: string) => l.toLowerCase().includes('lunch')),
                  dinner: rawDesc.some((l: string) => l.toLowerCase().includes('dinner'))
                }
              };
            });
            setDayPlans(mappedDays);

            // If highlights are missing or generic, auto-populate from day plan experiences
            if (!tripData.highlights || tripData.highlights.length === 0 || isGenericHighlights) {
              const autoExps = extractExperienceTitlesFromDayPlans(mappedDays);
              if (autoExps.length > 0) {
                setHighlights(autoExps);
              }
            }
            if (Array.isArray(tripData.accommodations) && tripData.accommodations.length > 1) {
              setHotelStays(tripData.accommodations.map((a: any) => ({
                city: a.city,
                nights: parseInt(a.nights) || 1,
                category: a.category || globalHotelCategory,
                hotelId: a.hotelId || '',
                hotelName: formatHotelWithSimilar(a.hotel || `Hotel in ${a.city}`),
                roomCategory: a.roomCategory || 'Deluxe Room',
                basePrice: a.basePrice || 0,
                mealPlan: a.mealPlan || globalMealPlan
              })));
            } else {
              computeHotelStaysFromDayPlans(mappedDays, tripData.staySummary);
            }
          }

          setSaveSuccessMsg(`Loaded "${tripData.title}" in Edit Mode.`);
          setTimeout(() => setSaveSuccessMsg(null), 3000);
        }
      } catch (err: any) {
        setSaveError('Failed to load trip for editing: ' + err.message);
      } finally {
        setLoadingEditTrip(false);
      }
    };

    loadTripToEdit();
  }, [editSlug]);

  // Compulsory Fields Validation Engine
  const getValidationErrors = (): string[] => {
    const errors: string[] = [];
    if (!title.trim() || title.trim().length < 4) {
      errors.push('Trip Title is required (minimum 4 characters).');
    }
    if (!slug.trim() || slug.trim().length < 3) {
      errors.push('URL Slug is required (e.g. leh-ladakh-tour).');
    }
    if (!destination.trim()) {
      errors.push('Destination is required.');
    }
    if (!heroImage || !heroImage.trim()) {
      errors.push('Hero Banner photo is required. Please upload or pick an image.');
    }

    const checkedPrices = pricingOptions.filter(p => p.checked && parseInt(p.defaultPrice.replace(/\D+/g, ''), 10) > 0);
    if (checkedPrices.length === 0) {
      errors.push('At least one Pricing Sharing Option must be checked with a valid price (> ₹0).');
    }

    if (!dayPlans || dayPlans.length === 0) {
      errors.push('At least 1 Day Plan is required.');
    } else {
      dayPlans.forEach((dp, idx) => {
        if (!dp.title.trim()) {
          errors.push(`Day ${dp.day} is missing a Day Title.`);
        }
        const hasPoints = dp.timeline.some(t => t.trim().length > 0);
        if (!hasPoints) {
          errors.push(`Day ${dp.day} must have at least one timeline or activity point.`);
        }
      });
    }

    if (tourType === 'Group') {
      const totalBatchRanges = batchDates.reduce((acc, b) => acc + (b.ranges?.length || 0), 0);
      if (totalBatchRanges === 0) {
        errors.push('For Group Tour Packages, at least 1 Departure Batch date range must be added in the Calendar.');
      }
      if (!groupSize || groupSize <= 0) {
        errors.push('Group Size must be greater than 0.');
      }
    }

    const hasPlacement = placements.homepage || placements.indiaTrips || placements.internationalTrips ||
      placements.upcomingTours || placements.honeymoon || placements.christmasNewYear || placements.destinationPage;
    if (!hasPlacement) {
      errors.push('Please select at least one Page Placement where this itinerary will be displayed.');
    }

    return errors;
  };


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

  // 2. Fetch Zoho Master Data
  const fetchZohoMasterData = async () => {
    setLoadingZohoMaster(true);
    try {
      const res = await fetch(`/api/zoho/master-data?_t=${Date.now()}`);
      const data = await res.json();
      if (data.success) {
        setZohoMaster({
          hotelsByCity: data.hotelsByCity || {},
          destinations: data.destinations || []
        });
      }
    } catch (err) {
      console.error('[Failed to fetch Zoho Master Data]:', err);
    } finally {
      setLoadingZohoMaster(false);
    }
  };

  // 3. Fetch Destination Images for Visual Picker
  const fetchDestinationImages = async (destName: string, autoSetMedia = false) => {
    if (!destName) return;
    setLoadingDestImages(true);
    try {
      const res = await fetch(`/api/destination-images?destination=${encodeURIComponent(destName)}`);
      const data = await res.json();
      if (data.success) {
        const imgs = data.images || [];
        setDestImages(imgs);
        if (data.destinations?.length) {
          setAvailableDestinations(data.destinations);
        }
        if (autoSetMedia && imgs.length > 0) {
          setHeroImage(prev => (!prev || prev.includes('LL2') || prev.includes('dummy') ? imgs[0] : prev));
          setGalleryImages(prev => (prev.length === 0 || prev.some(g => g.includes('LL2') || g.includes('dummy')) ? imgs.slice(0, 4) : prev));
        }
      }
    } catch (err) {
      console.error('[Failed to fetch destination images]:', err);
    } finally {
      setLoadingDestImages(false);
    }
  };

  useEffect(() => {
    fetchZohoFixedItineraries();
    fetchZohoMasterData();
    if (destination) {
      fetchDestinationImages(destination);
    }
  }, []);

  // Open Image Picker
  const handleOpenImagePicker = (target: 'hero' | 'gallery' | number) => {
    setImagePickerTarget(target);
    const destToQuery = destination || 'Rajasthan';
    setImagePickerDest(destToQuery);
    fetchDestinationImages(destToQuery);
    setSelectedGalleryPicks([]);
    setImagePickerOpen(true);
  };

  // Select Image from Library
  const handleSelectImageFromLibrary = (imgUrl: string) => {
    if (imagePickerTarget === 'hero') {
      setHeroImage(imgUrl);
      setImagePickerOpen(false);
    } else if (imagePickerTarget === 'gallery') {
      if (selectedGalleryPicks.includes(imgUrl)) {
        setSelectedGalleryPicks(selectedGalleryPicks.filter(i => i !== imgUrl));
      } else {
        setSelectedGalleryPicks([...selectedGalleryPicks, imgUrl]);
      }
    } else if (typeof imagePickerTarget === 'number') {
      setDayPlans(prev => {
        const copy = [...prev];
        copy[imagePickerTarget].image = imgUrl;
        return copy;
      });
      setImagePickerOpen(false);
    }
  };

  // Confirm Gallery Picks
  const handleConfirmGalleryPicks = () => {
    if (selectedGalleryPicks.length > 0) {
      setGalleryImages(prev => Array.from(new Set([...prev, ...selectedGalleryPicks])));
    }
    setImagePickerOpen(false);
  };

  // Sync Days Count
  const handleDurationDaysChange = (newCount: number) => {
    const days = Math.max(1, newCount);
    setDurationDays(days);
    setDurationNights(Math.max(1, days - 1));

    setDayPlans(prev => {
      if (prev.length < days) {
        const copy = [...prev];
        for (let i = prev.length + 1; i <= days; i++) {
          copy.push({
            day: i,
            title: `Day ${i}: Sightseeing & Exploration`,
            city: destination,
            stayHotel: formatHotelWithSimilar(`Hotel in ${destination}`),
            meals: { breakfast: true, lunch: false, dinner: true },
            timeline: ['Morning breakfast at hotel', 'Explore local scenic spots', 'Overnight stay'],
            image: heroImage || '/images/LL2.jpg'
          });
        }
        return copy;
      } else if (prev.length > days) {
        return prev.slice(0, days);
      }
      return prev;
    });
  };

  // Robust Hotel Lookup with intelligent city name matching and fallbacks
  const getHotelsForCity = (cityName: string): any[] => {
    if (!cityName || !zohoMaster.hotelsByCity) return [];
    const cleanKey = cityName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (zohoMaster.hotelsByCity[cleanKey]?.length) {
      return zohoMaster.hotelsByCity[cleanKey];
    }
    // Substring match on keys (e.g. "nubra" matches "nubravalley")
    const allKeys = Object.keys(zohoMaster.hotelsByCity);
    const matchedKey = allKeys.find(k => k.includes(cleanKey) || cleanKey.includes(k));
    if (matchedKey && zohoMaster.hotelsByCity[matchedKey]?.length) {
      return zohoMaster.hotelsByCity[matchedKey];
    }
    // Deep match across hotel records
    const allHotels = Object.values(zohoMaster.hotelsByCity).flat();
    const cleanLower = cityName.toLowerCase().trim();
    const matched = allHotels.filter(h => {
      const hCity = (h.city || '').toLowerCase().trim();
      const hDest = (h.destination || '').toLowerCase().trim();
      return (
        (hCity && (hCity.includes(cleanLower) || cleanLower.includes(hCity))) ||
        (hDest && (hDest.includes(cleanLower) || cleanLower.includes(hDest)))
      );
    });
    return matched;
  };

  // Auto-Group Hotel Stays from Day Plans or Stay Summary
  const computeHotelStaysFromDayPlans = (plans: DayPlanItem[], overrideStaySummary?: string) => {
    const stays: { city: string; nights: number }[] = [];
    const sumStr = overrideStaySummary || staySummary;
    if (sumStr && /\d+N/i.test(sumStr)) {
      const parts = sumStr.split(/\s*[|•–—-→]\s*/).map(s => s.trim()).filter(Boolean);
      parts.forEach(part => {
        const match = part.match(/^(\d+)\s*N(?:ights?)?\s+(.*)$/i);
        if (match) {
          stays.push({ city: match[2].trim(), nights: parseInt(match[1], 10) || 1 });
        } else {
          const c = part.replace(/^\d+N\s*/i, '').trim();
          if (c) stays.push({ city: c, nights: 1 });
        }
      });
    }

    if (stays.length === 0) {
      plans.forEach((dp, idx) => {
        if (idx === plans.length - 1 && plans.length > 1 && !dp.stayHotel) {
          return;
        }
        const c = (dp.city || dp.stayHotel?.split('in ')?.[1]?.replace(/\/ similar/i, '').trim() || destination || 'Main City').trim();
        if (stays.length > 0 && stays[stays.length - 1].city.toLowerCase() === c.toLowerCase()) {
          stays[stays.length - 1].nights += 1;
        } else {
          stays.push({ city: c, nights: 1 });
        }
      });
    }

    const newRows: HotelStayRow[] = stays.map(s => {
      const availableHotels = getHotelsForCity(s.city);
      const matched = availableHotels.find(h =>
        h.category?.toLowerCase() === globalHotelCategory.toLowerCase()
      ) || availableHotels[0];

      const room = matched?.rooms?.[0]?.roomCategory || 'Deluxe Room';
      const basePrice = matched?.rooms?.[0]?.basePrice || 0;
      const hotelRawName = matched?.hotelName || `Hotel in ${s.city}`;

      return {
        city: s.city,
        nights: s.nights,
        category: globalHotelCategory,
        hotelId: matched?.id || '',
        hotelName: formatHotelWithSimilar(hotelRawName),
        roomCategory: room,
        basePrice,
        mealPlan: globalMealPlan
      };
    });

    setHotelStays(newRows);
  };

  // Apply Global Meal Plan
  const handleApplyGlobalMealPlan = (planCode: string) => {
    setGlobalMealPlan(planCode);
    setHotelStays(prev => prev.map(s => ({ ...s, mealPlan: planCode })));

    const hasBreakfast = planCode !== 'EPAI';
    const hasDinner = planCode === 'MAPAI' || planCode === 'APAI';
    const hasLunch = planCode === 'APAI';

    setDayPlans(prev =>
      prev.map(d => ({
        ...d,
        meals: {
          breakfast: hasBreakfast,
          lunch: hasLunch,
          dinner: hasDinner
        }
      }))
    );
  };

  // Apply Global Hotel Category
  const handleApplyGlobalHotelCategory = (cat: string) => {
    setGlobalHotelCategory(cat);
    setHotelStays(prev =>
      prev.map(s => {
        const availableHotels = getHotelsForCity(s.city);
        const matched = availableHotels.find(h => h.category?.toLowerCase() === cat.toLowerCase()) || availableHotels[0];
        const room = matched?.rooms?.[0]?.roomCategory || 'Deluxe Room';
        const basePrice = matched?.rooms?.[0]?.basePrice || 0;
        const rawName = matched?.hotelName || s.hotelName;

        return {
          ...s,
          category: cat,
          hotelId: matched?.id || '',
          hotelName: formatHotelWithSimilar(rawName),
          roomCategory: room,
          basePrice
        };
      })
    );
  };

  // Update Individual Hotel Row
  const handleHotelSelect = (stayIdx: number, hotelId: string) => {
    const stay = hotelStays[stayIdx];
    const hotels = getHotelsForCity(stay.city);
    const found = hotels.find(h => h.id === hotelId);

    if (!found) return;

    // Pick lowest base price room category automatically!
    const lowestRoom = found.rooms?.[0]?.roomCategory || 'Deluxe Room';
    const lowestPrice = found.rooms?.[0]?.basePrice || 0;
    const formattedHotel = formatHotelWithSimilar(found.hotelName);

    setHotelStays(prev => {
      const copy = [...prev];
      copy[stayIdx] = {
        ...copy[stayIdx],
        hotelId: found.id,
        hotelName: formattedHotel,
        roomCategory: lowestRoom,
        basePrice: lowestPrice
      };
      return copy;
    });

    // Sync stay hotel name to day plans for this city
    setDayPlans(prev =>
      prev.map(d => {
        if (d.city?.toLowerCase() === stay.city.toLowerCase()) {
          return { ...d, stayHotel: `${formattedHotel} (${lowestRoom})` };
        }
        return d;
      })
    );
  };

  const handleRoomSelect = (stayIdx: number, roomCat: string) => {
    const stay = hotelStays[stayIdx];
    const hotels = getHotelsForCity(stay.city);
    const found = hotels.find(h => h.id === stay.hotelId);
    const room = found?.rooms?.find((r: any) => r.roomCategory === roomCat);

    setHotelStays(prev => {
      const copy = [...prev];
      copy[stayIdx] = {
        ...copy[stayIdx],
        roomCategory: roomCat,
        basePrice: room?.basePrice || 0
      };
      return copy;
    });

    setDayPlans(prev =>
      prev.map(d => {
        if (d.city?.toLowerCase() === stay.city.toLowerCase()) {
          return { ...d, stayHotel: `${stay.hotelName} (${roomCat})` };
        }
        return d;
      })
    );
  };

  // Auto-Logistics Statements Engine
  const injectAutoLogisticsStatements = (
    rawDays: DayPlanItem[],
    destinationOverride?: string,
    tripTypeOverride?: 'India' | 'International'
  ) => {
    const total = rawDays.length;
    const currentDest = destinationOverride ?? destination ?? '';
    const currentTripType = tripTypeOverride ?? tripType;

    return rawDays.map((dp, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === total - 1;
      const currentCity = dp.city || currentDest || '';
      const prevCity = idx > 0 ? (rawDays[idx - 1].city || currentDest || '') : '';

      const isIntercity = idx > 0 && currentCity && prevCity && currentCity.toLowerCase() !== prevCity.toLowerCase();
      const timelinePoints = [...dp.timeline];

      if (isFirst) {
        const arrivalCityOrDest = dp.city || currentDest || '';
        const properArrivalText = arrivalCityOrDest
          ? (currentTripType === 'International'
              ? `Arrival at ${arrivalCityOrDest} International Airport, meet our representative, and transfer to your hotel.`
              : `Arrival at ${arrivalCityOrDest} Airport / Railway Station, meet our tour captain/driver, and transfer to hotel.`)
          : (currentTripType === 'International'
              ? `Arrival at International Airport, meet our representative, and transfer to your hotel.`
              : `Arrival at Airport / Railway Station, meet our tour captain/driver, and transfer to hotel.`);

        const arrivalIdx = timelinePoints.findIndex(p =>
          /arrival at .* airport/i.test(p) ||
          /arrival at .* railway/i.test(p) ||
          /^arrival at airport/i.test(p) ||
          /^arrival/i.test(p)
        );

        if (arrivalIdx >= 0) {
          timelinePoints[arrivalIdx] = properArrivalText;
        } else {
          timelinePoints.unshift(properArrivalText);
        }

        const hasCheckin = timelinePoints.some(p => /check-in|check in/i.test(p));
        if (!hasCheckin) {
          timelinePoints.splice(1, 0, `Complete smooth hotel check-in formalities and freshen up.`);
        }
      }

      if (isIntercity) {
        const hasTransit = timelinePoints.some(p => /proceed to|drive to|transfer to/i.test(p));
        if (!hasTransit) {
          timelinePoints.unshift(
            `Enjoy morning breakfast, check out from hotel in ${prevCity}, and proceed on a scenic drive to ${currentCity}.`
          );
          timelinePoints.splice(1, 0, `Upon arrival in ${currentCity}, check in to your hotel and relax.`);
        }
      }

      if (isLast && total > 1) {
        const departureCityOrDest = dp.city || currentDest || '';
        const properDepartText = departureCityOrDest
          ? (currentTripType === 'International'
              ? `Transfer to ${departureCityOrDest} International Airport for your flight back home with wonderful memories.`
              : `Transfer to ${departureCityOrDest} Airport / Railway Station for your onward journey with unforgettable memories.`)
          : (currentTripType === 'International'
              ? `Transfer to International Airport for your flight back home with wonderful memories.`
              : `Transfer to Airport / Railway Station for your onward journey with unforgettable memories.`);

        const departIdx = timelinePoints.findIndex(p =>
          /transfer to .* airport/i.test(p) ||
          /transfer to .* railway/i.test(p) ||
          /^transfer to airport/i.test(p)
        );

        if (departIdx >= 0) {
          timelinePoints[departIdx] = properDepartText;
        } else {
          const hasDepart = timelinePoints.some(p => /departure|return flight|drop-off/i.test(p));
          if (!hasDepart) {
            timelinePoints.push(properDepartText);
          }
        }

        const hasBreakfast = timelinePoints.some(p => /breakfast.*check-?out|check-?out.*breakfast/i.test(p));
        if (!hasBreakfast) {
          timelinePoints.unshift(`Enjoy morning breakfast at the hotel and complete check-out formalities.`);
        }
      }

      return {
        ...dp,
        timeline: timelinePoints,
        stayHotel: formatHotelWithSimilar(dp.stayHotel)
      };
    });
  };

  // Helper to extract clean experience/activity titles from Day Plans
  const extractExperienceTitlesFromDayPlans = (plans: DayPlanItem[]): string[] => {
    const results: string[] = [];
    plans.forEach((dp) => {
      dp.timeline.forEach((point) => {
        const trimmed = point.trim();
        if (!trimmed) return;

        // Skip arrival, transit, breakfast, checkin, departure logistics
        const isLogistics = /^(arrival|arrive|check-?in|check in|smooth check|freshen up|departure|return flight|drop-?off|drop off|overnight stay|enjoy morning breakfast|complete check-?out|transfer to.*airport|scenic highway drive)/i.test(trimmed);
        if (isLogistics) return;

        let title = trimmed;
        // If "Title: Description" format, extract title
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx > 0 && colonIdx < 80) {
          title = trimmed.slice(0, colonIdx).trim();
        } else if (title.length > 75) {
          // If long line without colon, cut at word boundary
          title = title.slice(0, 70).replace(/\s+[^\s]*$/, '...');
        }

        // Clean common leading action verbs
        title = title.replace(/^(visit|explore|enjoy|experience)\s+/i, '');
        title = title.charAt(0).toUpperCase() + title.slice(1);

        if (title && title.length > 3 && !results.some(r => r.toLowerCase() === title.toLowerCase())) {
          results.push(title);
        }
      });
    });
    return results;
  };

  // Helper to extract experiences from Zoho row experiences
  const extractExperiencesFromZohoRows = (rows: any[]): string[] => {
    const results: string[] = [];
    rows.forEach((r: any) => {
      if (Array.isArray(r.experiences)) {
        r.experiences.forEach((exp: string) => {
          if (!exp || !exp.trim()) return;
          let clean = exp.trim()
            .replace(/^(visit|explore|enjoy|experience|drive to|proceed to|transfer to)\s+/i, '')
            .replace(/:\s*.*$/, '')
            .trim();
          const isLogistics = /^(arrival|arrive|check-?in|hotel check|smooth check|freshen up|departure|return flight|drop-?off|drop off|overnight stay|breakfast at)/i.test(clean);
          if (clean && !isLogistics) {
            clean = clean.charAt(0).toUpperCase() + clean.slice(1);
            if (!results.some(item => item.toLowerCase() === clean.toLowerCase())) {
              results.push(clean);
            }
          }
        });
      }
    });
    return results;
  };

  // Import Zoho CRM Fixed Itinerary
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
      setTitle(itin.name || 'Curated Tour Package');
      setSlug(cleanSlug(itin.name || 'curated-tour-package'));

      const importedDest = itin.destination || '';
      const isInt = itin.destinationType?.toLowerCase() === 'international';
      const itinTripType: 'India' | 'International' = isInt ? 'International' : 'India';

      setTripType(itinTripType);
      setPlacements(prev => ({
        ...prev,
        indiaTrips: !isInt,
        internationalTrips: isInt
      }));

      if (importedDest) {
        setDestination(importedDest);
        setCategory(importedDest);
        const lowerDest = importedDest.toLowerCase().replace(/\s+/g, '-');
        setPlacements(prev => ({
          ...prev,
          destinationCategory: lowerDest
        }));
        setImagePickerDest(importedDest);
        fetchDestinationImages(importedDest, true);
      }

      const numDays = itin.noOfDays || 1;
      const numNights = itin.noOfNights || Math.max(1, numDays - 1);
      setDurationDays(numDays);
      setDurationNights(numNights);

      if (Array.isArray(itin.dayRows) && itin.dayRows.length > 0) {
        const rawDays: DayPlanItem[] = itin.dayRows.map((row: any, idx: number) => {
          const experiences: string[] = [];

          if (Array.isArray(row.experiences)) {
            row.experiences.forEach((exp: string, expIdx: number) => {
              if (exp && exp.trim()) {
                const desc = row.descriptions?.[expIdx];
                const text = desc ? `${exp.trim()}: ${desc.trim()}` : exp.trim();
                experiences.push(text);
              }
            });
          }

          const city = row.city || row.city2 || importedDest || '';

          const isLastDay = idx === itin.dayRows.length - 1 && itin.dayRows.length > 1;
          return {
            day: row.dayNumber || idx + 1,
            title: isLastDay ? `Day ${idx + 1}: Departure from ${city || 'Destination'}` : (city ? `Day ${idx + 1}: ${city} Sightseeing` : `Day ${idx + 1}`),
            city,
            stayHotel: isLastDay ? '' : formatHotelWithSimilar(city ? `Hotel in ${city}` : 'Hotel / Similar'),
            meals: {
              breakfast: idx > 0,
              lunch: false,
              dinner: !isLastDay
            },
            timeline: experiences.length > 0 ? experiences : (isLastDay ? ['Enjoy morning breakfast at hotel and complete check-out formalities.', `Transfer to ${city || 'Airport'} / Railway Station for onward journey with fond memories.`] : ['Explore local attractions', 'Overnight stay']),
            image: heroImage || ''
          };
        });

        const enrichedDays = injectAutoLogisticsStatements(rawDays, importedDest, itinTripType);
        setDayPlans(enrichedDays);
        computeHotelStaysFromDayPlans(enrichedDays);

        // Only count night stays for Days 1 to N-1 (last day is departure day with no night stay)
        const cityStays: Record<string, number> = {};
        const stayRows = itin.dayRows.length > 1 ? itin.dayRows.slice(0, -1) : itin.dayRows;
        stayRows.forEach((r: any) => {
          const c = r.city || r.city2 || importedDest || '';
          if (c) cityStays[c] = (cityStays[c] || 0) + 1;
        });
        const summaryStr = Object.entries(cityStays)
          .map(([city, nights]) => `${nights}N ${city}`)
          .join(' | ');
        setStaySummary(summaryStr);

        const routeCities = Array.from(
          new Set(itin.dayRows.map((r: any) => r.city || r.city2).filter(Boolean))
        );
        if (routeCities.length > 0) {
          setRoute(routeCities.join(' → '));
        }

        // Auto-extract and populate experience titles into Key Highlights
        const zohoExps = extractExperiencesFromZohoRows(itin.dayRows);
        if (zohoExps.length > 0) {
          setHighlights(zohoExps);
        } else {
          const planExps = extractExperienceTitlesFromDayPlans(enrichedDays);
          if (planExps.length > 0) {
            setHighlights(planExps);
          }
        }
      }

      // Auto-populate Group Departures Batch Dates & Group Size if present from Zoho CRM
      if (Array.isArray(itin.batchDates) && itin.batchDates.length > 0) {
        setBatchDates(itin.batchDates);
        setTourType('Group');
        setPlacements(prev => ({
          ...prev,
          upcomingTours: true,
          sections: {
            ...prev.sections,
            available: true,
            group: true
          }
        }));

        // Jump calendar view directly to the month of the first batch!
        const firstBatchMonth = itin.batchDates[0].month; // e.g. "November 2026"
        const parts = firstBatchMonth.split(' ');
        if (parts.length >= 2) {
          const mIdx = monthNames.findIndex(mn => mn.toLowerCase() === parts[0].toLowerCase());
          const yNum = parseInt(parts[1], 10);
          if (mIdx !== -1 && !isNaN(yNum)) {
            setCurrentCalendarDate(new Date(yNum, mIdx, 1));
          }
        }
      } else {
        setBatchDates([]);
      }

      if (itin.groupSize && Number(itin.groupSize) > 0) {
        setGroupSize(Number(itin.groupSize));
      }

      setSaveSuccessMsg(`Successfully imported "${itin.name}" with full logistics!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error importing Zoho itinerary');
    } finally {
      setLoadingZohoItineraries(false);
    }
  };

  // AI Generate Catchy Day Titles
  const handleGenerateAIHeadings = async () => {
    setGeneratingHeadings(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/ai/day-headings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          dayPlans
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.headings) {
        throw new Error(data.error || 'Failed to generate AI headings');
      }

      setDayPlans(prev =>
        prev.map(d => {
          const aiTitle = data.headings[d.day];
          return aiTitle ? { ...d, title: aiTitle } : d;
        })
      );

      setSaveSuccessMsg('✨ AI Catchy Day Titles generated and applied successfully!');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSaveError(err.message || 'Error generating AI titles');
    } finally {
      setGeneratingHeadings(false);
    }
  };

  // Image Upload Handlers
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

  // Multi-file gallery upload
  const handleMultiGalleryUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const uploadPromises = Array.from(files).map(async file => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean);
      setGalleryImages(prev => Array.from(new Set([...prev, ...validUrls])));
    } catch (err: any) {
      setSaveError('Failed to upload some gallery images');
    } finally {
      setUploadingImage(false);
    }
  };

  // Pricing Helpers
  const activeCostingDetails = useMemo(() => {
    return pricingOptions
      .filter(p => p.checked && p.defaultPrice.trim())
      .map(p => ({
        label: p.label,
        value: `₹${parseInt(p.defaultPrice.replace(/\D+/g, ''), 10)?.toLocaleString('en-IN') || 0}/- per person`
      }));
  }, [pricingOptions]);

  useEffect(() => {
    const prices = pricingOptions
      .filter(p => p.checked && p.defaultPrice)
      .map(p => parseInt(p.defaultPrice.replace(/\D+/g, ''), 10))
      .filter(p => !isNaN(p) && p > 0);

    if (prices.length > 0) {
      setPrice(Math.min(...prices));
    }
  }, [pricingOptions]);

  // Calendar Helpers
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendarYear = currentCalendarDate.getFullYear();
  const calendarMonth = currentCalendarDate.getMonth();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  // 1-Click Batch Date Selection (Auto-Calculates End Date from durationDays!)
  const handleCalendarDayClick = (dayNum: number) => {
    const startDate = new Date(calendarYear, calendarMonth, dayNum);
    // End date is exactly (durationDays - 1) days after start date!
    const endDate = new Date(calendarYear, calendarMonth, dayNum + durationDays - 1);

    const startMonthStr = monthNames[startDate.getMonth()].slice(0, 3);
    const endMonthStr = monthNames[endDate.getMonth()].slice(0, 3);
    const monthKey = `${monthNames[startDate.getMonth()]} ${startDate.getFullYear()}`;

    const rangeStr = `${startDate.getDate()} ${startMonthStr} - ${endDate.getDate()} ${endMonthStr}`;

    setBatchDates(prev => {
      const existing = prev.find(b => b.month === monthKey);
      if (existing) {
        if (!existing.ranges.includes(rangeStr)) {
          existing.ranges.push(rangeStr);
        } else {
          // Toggle off if already exists
          existing.ranges = existing.ranges.filter(r => r !== rangeStr);
          if (existing.ranges.length === 0) {
            return prev.filter(b => b.month !== monthKey);
          }
        }
        return [...prev];
      } else {
        return [...prev, { month: monthKey, ranges: [rangeStr] }];
      }
    });
  };

  // Build Final Trip Payload
  const buildTripPayload = () => {
    const cleanId = slug.toUpperCase().replace(/[^A-Z0-9]/g, '-');

    const itinerary = dayPlans.map(d => {
      const descLines: string[] = [];
      d.timeline.forEach(point => {
        if (point.trim()) descLines.push(point.trim());
      });

      if (d.stayHotel && d.stayHotel.trim()) {
        descLines.push(`Accommodation: ${formatHotelWithSimilar(d.stayHotel)}`);
      }

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

    return {
      id: cleanId,
      title: title.trim(),
      slug: slug.trim(),
      image: heroImage,
      destination: destination.trim(),
      category: category.trim(),
      tripType,
      tourType,
      region: region.trim(),
      duration: durationDays,
      nights: durationNights,
      price: Number(price) || 0,
      difficulty,
      groupSize: tourType === 'Group' ? groupSize : 0,
      rating: Number(rating) || 4.9,
      description: description.trim() || `${durationDays} Days / ${durationNights} Nights journey in ${destination}.`,
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
      costingDetails: activeCostingDetails,
      included: inclusions.filter(i => i.trim().length > 0),
      inclusions: inclusions.filter(i => i.trim().length > 0),
      notIncluded: exclusions.filter(e => e.trim().length > 0),
      exclusions: exclusions.filter(e => e.trim().length > 0),
      accommodations: hotelStays.map(s => ({
        city: s.city,
        hotel: formatHotelWithSimilar(s.hotelName),
        nights: `${s.nights}N`,
        roomCategory: s.roomCategory
      })),
      inclusionsSummary: {
        cities: hotelStays.length > 0 ? new Set(hotelStays.map(s => s.city.toLowerCase())).size : 1,
        hotels: hotelStays.length > 0 ? hotelStays.length : 1,
        transfers: Math.max(3, dayPlans.reduce((acc: number, d: DayPlanItem) => acc + d.timeline.filter((p: string) => /transfer|airport|drive|pickup|drop|train|ferry/i.test(p)).length, 0) || 4),
        experiences: dayPlans.reduce((acc: number, d: DayPlanItem) => acc + d.timeline.filter((p: string) => !/check[- ]in|check[- ]out|freshen|overnight|meals|stay|hotel/i.test(p)).length, 0) || highlights.length || 7,
        meals: (dayPlans.filter((d: DayPlanItem) => d.meals.breakfast).length + dayPlans.filter((d: DayPlanItem) => d.meals.lunch).length + dayPlans.filter((d: DayPlanItem) => d.meals.dinner).length) || durationNights,
        visa: tripType === 'International' ? 'Visa' : null,
        tripGuide: 'Trip Guide'
      },
      summaryDetails: {
        accommodation: hotelStays.map(s => ({
          city: s.city,
          hotel: formatHotelWithSimilar(s.hotelName)
        })),
        meals: (() => {
          const bCount = dayPlans.filter((d: DayPlanItem) => d.meals.breakfast).length;
          const lCount = dayPlans.filter((d: DayPlanItem) => d.meals.lunch).length;
          const dCount = dayPlans.filter((d: DayPlanItem) => d.meals.dinner).length;
          if (bCount > 0 && dCount > 0) return [`${bCount} Breakfasts & ${dCount} Dinners included as per itinerary`];
          if (bCount > 0) return [`${bCount} Daily Breakfasts included at all stays & resorts`];
          const totalM = bCount + lCount + dCount;
          return totalM > 0 ? [`${totalM} Meals included as per itinerary`] : [`${durationNights} Breakfasts included as per plan`];
        })(),
        transfers: (() => {
          const list: string[] = [];
          dayPlans.forEach((d: DayPlanItem) => {
            d.timeline.forEach((pt: string) => {
              if (/transfer|airport|drive|pickup|drop|train|ferry|safari/i.test(pt)) {
                const clean = pt.replace(/^transfers?\s*:\s*/i, '').trim();
                if (clean && !list.includes(clean)) list.push(clean);
              }
            });
          });
          if (list.length < 2) {
            list.unshift('Arrival Airport / Railway Station pickup and transfer to hotel');
            list.push('All intercity, local sightseeing and excursion transfers in private vehicle');
            list.push('Departure Airport / Railway Station drop-off transfer');
          }
          return list;
        })(),
        activities: (() => {
          const groups: Array<{ city: string; title: string; items: string[] }> = [];
          dayPlans.forEach((d: DayPlanItem) => {
            const city = d.city || destination || `Day ${d.day}`;
            const acts: string[] = [];
            d.timeline.forEach((pt: string) => {
              if (!/check[- ]in|check[- ]out|freshen|overnight|meals|stay|hotel|airport transfer|drop off at airport/i.test(pt)) {
                const clean = pt.replace(/^(sightseeing(?:\s*&\s*experiences)?|activities|experiences)\s*:\s*/i, '').trim();
                if (clean && !acts.includes(clean)) acts.push(clean);
              }
            });
            if (acts.length > 0) {
              const existing = groups.find(g => g.city.toLowerCase() === city.toLowerCase());
              if (existing) {
                acts.forEach(a => { if (!existing.items.includes(a)) existing.items.push(a); });
              } else {
                groups.push({ city, title: `${city} Sightseeing & Experiences`, items: acts });
              }
            }
          });
          return groups.length > 0 ? groups : highlights.filter(h => h.trim().length > 0);
        })()
      },
      batchDates: tourType === 'Group' ? batchDates : [],
      placements
    };
  };

  // Submit / Save to MongoDB with Strict Compulsory Fields Validation
  const handleSaveToMongoDB = async () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      setValidationModalOpen(true);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-800 cursor-pointer"
            title="Back to Admin"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">
                {isEditMode ? 'Edit Website Itinerary' : 'Website Itinerary Creator'}
              </span>
              {isEditMode ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full flex items-center gap-1">
                  ✏️ EDIT MODE
                </span>
              ) : (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Zoho CRM Synced
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {isEditMode
                ? 'Editing live tour package. Changes update MongoDB Atlas and live customer pages.'
                : 'Publish complete luxury packages with Zoho CRM master data & custom page placements'}
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenExportModal}
            className="border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs h-9 cursor-pointer"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 mt-6 pb-32 space-y-6">
        {/* TOP LEVEL SWITCH: Customized Tour vs Group Tour */}
        <section className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Tour Format</span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Group tours include batch departure calendars & group sizes; Customized tours are fully flexible.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTourType('Group');
                setPlacements(prev => ({ ...prev, upcomingTours: true }));
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${tourType === 'Group'
                  ? 'bg-[#ff5d09] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Users className="w-3.5 h-3.5" /> Group Tour Package
            </button>
            <button
              type="button"
              onClick={() => {
                setTourType('Customized');
                setPlacements(prev => ({ ...prev, upcomingTours: false }));
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${tourType === 'Customized'
                  ? 'bg-[#ff5d09] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Compass className="w-3.5 h-3.5" /> Customized Private Tour
            </button>
          </div>
        </section>

        {/* 1. Zoho CRM Quick Import (Fixed Itineraries) */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Zoho CRM Quick Import (Fixed Itineraries)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Select any itinerary from Zoho Products to auto-fill days, cities, activities & auto-logistics.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchZohoFixedItineraries}
              disabled={loadingZohoItineraries}
              className="border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs h-8 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loadingZohoItineraries ? 'animate-spin text-orange-400' : ''}`} />
              Refresh Zoho List
            </Button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name/destination..."
                  value={zohoFilterSearch}
                  onChange={(e) => setZohoFilterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <select
                value={selectedZohoId}
                onChange={(e) => handleImportZohoProduct(e.target.value)}
                disabled={loadingZohoItineraries}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 truncate cursor-pointer"
              >
                <option value="">-- Choose Zoho CRM Itinerary to auto-fill --</option>
                {filteredZohoItins.map((itin) => (
                  <option key={itin.id} value={itin.id}>
                    {itin.name} {itin.destination ? `(${itin.destination})` : ''} {itin.noOfDays ? `[${itin.noOfDays}D/${itin.noOfNights || itin.noOfDays - 1}N]` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 2. Page & Placement Selection Matrix */}
        <section className="bg-slate-900/90 border border-orange-500/20 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ff5d09]" />
            <h2 className="text-base font-bold text-white tracking-tight">Website Placements & Sections</h2>
          </div>
          <p className="text-xs text-slate-400">
            Select the exact website pages and destination sections where this itinerary must appear.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

            {/* Upcoming Group Tours (Only if Group tour) */}
            {tourType === 'Group' && (
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${placements.upcomingTours ? 'bg-orange-500/10 border-orange-500/40 text-white' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <input
                  type="checkbox"
                  checked={placements.upcomingTours}
                  onChange={(e) => setPlacements({ ...placements, upcomingTours: e.target.checked })}
                  className="mt-0.5 rounded accent-[#ff5d09] w-4 h-4"
                />
                <div>
                  <p className="text-xs font-bold">Upcoming Group Tours</p>
                  <p className="text-[11px] text-slate-400">Shows at /upcoming-tours with calendar</p>
                </div>
              </label>
            )}

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

          {/* Destination Specific Sections */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Destination Sub-Page & Sections:
              </label>
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
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-orange-400 w-40 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
                  checked={placements.sections.group}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, group: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Group Packages</span>
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
                  checked={placements.sections.honeymoon}
                  onChange={(e) => setPlacements({
                    ...placements,
                    sections: { ...placements.sections, honeymoon: e.target.checked }
                  })}
                  className="rounded accent-[#ff5d09]"
                />
                <span>Honeymoon Packages</span>
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
                <span>Related Trips</span>
              </label>
            </div>
          </div>
        </section>

        {/* 3. Basic Information */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-orange-500" />
            <h2 className="text-base font-bold text-white tracking-tight">Basic Details & Meta</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Trip Title / Name <span className="text-red-400">*</span>
              </label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. 7 Days Rangilo Rajasthan Group Tour"
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
                  placeholder="e.g. rangilo-rajasthan-group-tour"
                  className="bg-slate-950 border-slate-800 text-orange-400 font-mono text-xs py-2"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSlug(cleanSlug(title))}
                  className="border-slate-800 bg-slate-950 text-slate-400 text-xs shrink-0 cursor-pointer"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="India">India (Domestic)</option>
                <option value="International">International</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Destination</label>
              <Input
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setCategory(e.target.value);
                  setImagePickerDest(e.target.value);
                }}
                placeholder="e.g. Rajasthan, Meghalaya, Bali, Kashmir"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Days</label>
              <Input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => handleDurationDaysChange(parseInt(e.target.value, 10) || 1)}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Difficulty Pills */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Trip Difficulty</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['Easy', 'Moderate', 'Hard', 'Easy to Moderate'] as const).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDifficulty(diff)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${difficulty === diff
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size (Only if Group Tour) */}
            {tourType === 'Group' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Max Group Size (Persons)
                </label>
                <Input
                  type="number"
                  min="2"
                  value={groupSize}
                  onChange={(e) => setGroupSize(parseInt(e.target.value, 10) || 15)}
                  className="bg-slate-950 border-slate-800 text-white text-xs py-2"
                />
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Customer Rating (★)</label>
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
                placeholder="e.g. Jaipur → Jodhpur → Jaisalmer"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Stay Summary</label>
              <Input
                value={staySummary}
                onChange={(e) => setStaySummary(e.target.value)}
                placeholder="e.g. 2N Jaipur | 2N Jodhpur | 2N Jaisalmer"
                className="bg-slate-950 border-slate-800 text-white text-xs py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Overview Paragraph</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Are you ready for an unforgettable adventure in the breathtaking landscapes of..."
              className="bg-slate-950 border-slate-800 text-white text-xs"
            />
          </div>

          {/* Key Highlights (Experience Titles) with Auto-Fill & Add Button */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                  Key Highlights / Experience Titles ({highlights.length})
                </label>
                <p className="text-[11px] text-slate-400">
                  Individual titles of the curated activities & experiences featured in this tour.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const exps = extractExperienceTitlesFromDayPlans(dayPlans);
                    if (exps.length > 0) {
                      setHighlights(exps);
                      setSaveSuccessMsg(`Populated ${exps.length} experience titles into Highlights!`);
                      setTimeout(() => setSaveSuccessMsg(null), 3000);
                    } else {
                      alert('No experience titles found in Day Plans. Add activities to Day Plans first.');
                    }
                  }}
                  className="text-xs text-orange-400 hover:text-orange-300 border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 h-7 px-2.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" /> Auto-Fill from Day Experiences
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setHighlights([...highlights, ''])}
                  className="text-xs text-slate-300 hover:text-white border-slate-800 h-7 px-2.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Highlight
                </Button>
              </div>
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
                    placeholder={`Experience Title #${idx + 1} (e.g. Jawai Leopard Safari in 4x4 Jeep)`}
                    className="bg-slate-950 border-slate-800 text-white text-xs py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => setHighlights(highlights.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Pricing Checkbox Matrix */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Pricing & Costing Options</h2>
                <p className="text-xs text-slate-400">
                  Select only the options you offer; checked items will appear on the website costing table.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Starting Price:</span>
              <span className="text-emerald-400 font-extrabold text-sm font-mono">
                ₹{price?.toLocaleString('en-IN') || 0}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pricingOptions.map((opt, idx) => (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border transition-all ${opt.checked
                    ? 'bg-slate-950 border-emerald-500/40'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-200 cursor-pointer grow">
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={(e) => {
                        const copy = [...pricingOptions];
                        copy[idx].checked = e.target.checked;
                        setPricingOptions(copy);
                      }}
                      className="rounded accent-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <span>{opt.label}</span>
                  </label>
                </div>

                {opt.checked && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-xs text-emerald-400 font-mono font-bold">₹</span>
                    <Input
                      value={opt.defaultPrice}
                      onChange={(e) => {
                        const copy = [...pricingOptions];
                        copy[idx].defaultPrice = e.target.value.replace(/\D+/g, '');
                        setPricingOptions(copy);
                      }}
                      placeholder="e.g. 24999"
                      className="bg-slate-900 border-slate-800 text-emerald-400 font-bold text-xs py-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Custom Pricing Option */}
          <div className="pt-2">
            {!showAddCustomPrice ? (
              <button
                type="button"
                onClick={() => setShowAddCustomPrice(true)}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer font-medium"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Custom Pricing Option
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <Input
                  value={customPricingLabel}
                  onChange={(e) => setCustomPricingLabel(e.target.value)}
                  placeholder="Option Name (e.g. Luxury Glamping Tent)"
                  className="bg-slate-900 border-slate-800 text-white text-xs w-1/2"
                />
                <Input
                  value={customPricingPrice}
                  onChange={(e) => setCustomPricingPrice(e.target.value.replace(/\D+/g, ''))}
                  placeholder="Price in ₹"
                  className="bg-slate-900 border-slate-800 text-emerald-400 text-xs w-1/4"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (customPricingLabel.trim()) {
                      setPricingOptions([
                        ...pricingOptions,
                        {
                          id: `custom-${Date.now()}`,
                          label: customPricingLabel.trim(),
                          defaultPrice: customPricingPrice || '0',
                          checked: true
                        }
                      ]);
                      setCustomPricingLabel('');
                      setCustomPricingPrice('');
                      setShowAddCustomPrice(false);
                    }
                  }}
                  className="bg-[#ff5d09] text-white text-xs px-3"
                >
                  Add
                </Button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomPrice(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 5. Photos & Visual Media with Visual Destination Image Picker */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-orange-500" />
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Photos & Visual Media</h2>
              <p className="text-xs text-slate-400">
                Choose visually from Destination Library thumbnails or upload new files directly.
              </p>
            </div>
          </div>

          {/* Hero Banner Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">A. Hero Banner Image (Main Header & Card)</label>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenImagePicker('hero')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md cursor-pointer flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" /> Pick from Destination Library
              </Button>

              <label className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5 text-orange-400" /> Upload Custom File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'hero');
                  }}
                />
              </label>

              <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{heroImage}</span>
            </div>

            {heroImage && (
              <div
                onClick={() => handleOpenImagePicker('hero')}
                className="relative h-40 w-full sm:w-80 rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-orange-500 cursor-pointer group mt-2 transition-all shadow-lg"
              >
                <Image src={heroImage} alt="Hero Banner Preview" fill className="object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-1.5">
                  <ImageIcon className="w-4 h-4" /> Change Hero Photo
                </div>
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300">
                  B. Gallery Images (Photo Collage Slider)
                </label>
                <p className="text-[11px] text-slate-400">
                  Select multiple destination photos from library or multi-upload from computer.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleOpenImagePicker('gallery')}
                  className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/40 text-xs h-8 px-3 rounded-xl cursor-pointer flex items-center gap-1.5 font-bold"
                >
                  <FolderOpen className="w-3.5 h-3.5" /> Pick from Library
                </Button>

                <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Multi-Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMultiGalleryUpload(e.target.files)}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-800 bg-slate-950 h-24">
                  <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setGalleryImages(galleryImages.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-black/80 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Day-Wise Photo Upload Slots */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300">
                C. Day-Wise Individual Photos ({durationDays} Days = {durationDays} Slots)
              </label>
              <p className="text-[11px] text-slate-400">
                Click "Pick Photo" on any day to choose visually from destination library thumbnails!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {dayPlans.map((dp, dIdx) => (
                <div
                  key={dIdx}
                  className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3"
                >
                  <div
                    onClick={() => handleOpenImagePicker(dIdx)}
                    className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-800 hover:border-orange-500 cursor-pointer bg-slate-900 shrink-0 group"
                  >
                    {dp.image ? (
                      <Image src={dp.image} alt={`Day ${dp.day}`} fill className="object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-600">
                        Pick Image
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>

                  <div className="grow space-y-1">
                    <p className="text-xs font-bold text-white">Day {dp.day} Photo</p>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleOpenImagePicker(dIdx)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] h-7 px-2.5 rounded-lg cursor-pointer flex items-center gap-1 font-semibold"
                      >
                        <ImageIcon className="w-3 h-3 text-orange-400" /> Pick Photo
                      </Button>

                      <label className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-[11px] rounded-lg cursor-pointer flex items-center gap-1 shrink-0">
                        <Upload className="w-3 h-3" /> Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleImageUpload(e.target.files[0], 'day', dIdx);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Hotels & Stays: Integrated directly with Zoho CRM Hotel Module with "/ Similar" */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-amber-400" />
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Hotels & Accommodations (Zoho CRM Module Synced)
                </h2>
                <p className="text-xs text-slate-400">
                  Hotel names automatically carry <span className="text-amber-400 font-mono">/ Similar</span> on the website.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => computeHotelStaysFromDayPlans(dayPlans)}
              className="border-slate-800 text-xs h-8 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 mr-1 text-orange-400" /> Re-sync Stays from Days
            </Button>
          </div>

          {/* Global Category & Meal Plan Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Default Hotel Category (for all stays)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {HOTEL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleApplyGlobalHotelCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${globalHotelCategory === cat
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Default Meal Plan
              </label>
              <select
                value={globalMealPlan}
                onChange={(e) => handleApplyGlobalMealPlan(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {MEAL_PLANS.map(m => (
                  <option key={m.code} value={m.code}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hotel Stays Rows */}
          <div className="space-y-3">
            {hotelStays.map((stay, idx) => {
              const availableHotels = getHotelsForCity(stay.city);
              const selectedHotelObj = availableHotels.find(h => h.id === stay.hotelId || formatHotelWithSimilar(h.hotelName) === stay.hotelName);

              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {stay.city} ({stay.nights} Nights)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Category:</span>
                      <select
                        value={stay.category}
                        onChange={(e) => {
                          const copy = [...hotelStays];
                          copy[idx].category = e.target.value;
                          setHotelStays(copy);
                        }}
                        className="px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-amber-400"
                      >
                        {HOTEL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Hotel Dropdown (From Zoho CRM) */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Select Hotel in {stay.city} ({availableHotels.length} options in Zoho)
                      </label>
                      <select
                        value={stay.hotelId || ''}
                        onChange={(e) => handleHotelSelect(idx, e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">-- Choose Hotel from Zoho CRM --</option>
                        {availableHotels.map(h => (
                          <option key={h.id} value={h.id}>
                            {h.hotelName} / Similar ({h.category || 'Deluxe'}) {h.starRating ? `[${h.starRating}★]` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Room Category (With lowest base price auto-selected) */}
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        Room Category (Lowest Base Price Auto-Selected)
                      </label>
                      <select
                        value={stay.roomCategory}
                        onChange={(e) => handleRoomSelect(idx, e.target.value)}
                        disabled={!selectedHotelObj?.rooms?.length}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-emerald-400 font-semibold focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        {selectedHotelObj?.rooms && selectedHotelObj.rooms.length > 0 ? (
                          selectedHotelObj.rooms.map((r: any, rIdx: number) => (
                            <option key={rIdx} value={r.roomCategory}>
                              {r.roomCategory} {r.basePrice > 0 ? `(₹${r.basePrice}/night)` : ''}
                            </option>
                          ))
                        ) : (
                          <option value="Deluxe Room">Standard / Deluxe Room</option>
                        )}
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. Day-Wise Plan: Timeline Bullets, Auto-Logistics & AI Headings */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-orange-500" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  Day-by-Day Detailed Plan ({dayPlans.length} Days)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Arrivals, departures & intercity drives are auto-injected. Click AI Headings for luxury titles!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={handleGenerateAIHeadings}
                disabled={generatingHeadings}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8 px-3 cursor-pointer shadow-md"
              >
                <Wand2 className={`w-3.5 h-3.5 mr-1 ${generatingHeadings ? 'animate-spin' : ''}`} />
                {generatingHeadings ? 'Writing AI Titles...' : '✨ AI Generate Day Titles'}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setDayPlans(injectAutoLogisticsStatements(dayPlans, destination, tripType));
                  setSaveSuccessMsg('Auto-logistics statements injected into days!');
                  setTimeout(() => setSaveSuccessMsg(null), 3000);
                }}
                className="border-slate-800 text-xs h-8 cursor-pointer"
              >
                Re-apply Auto-Logistics
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {dayPlans.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-3">
                  <div className="flex items-center gap-2.5 grow">
                    <span className="w-7 h-7 rounded-lg bg-[#ff5d09] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      D{day.day}
                    </span>
                    <Input
                      value={day.title}
                      onChange={(e) => {
                        const copy = [...dayPlans];
                        copy[dayIdx].title = e.target.value;
                        setDayPlans(copy);
                      }}
                      placeholder={`Day ${day.day} Title`}
                      className="bg-transparent border-0 text-white font-bold text-sm focus-visible:ring-0 p-0 h-auto"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      value={day.city || ''}
                      onChange={(e) => {
                        const copy = [...dayPlans];
                        copy[dayIdx].city = e.target.value;
                        setDayPlans(copy);
                      }}
                      placeholder="City/Stop"
                      className="bg-slate-900 border-slate-800 text-xs h-7 w-28 text-orange-400 font-semibold"
                    />
                  </div>
                </div>

                {/* Day Details: Stay & Meals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1">
                      <Hotel className="w-3 h-3 text-amber-400" /> Stay / Hotel
                    </label>
                    <Input
                      value={day.stayHotel}
                      onChange={(e) => {
                        const copy = [...dayPlans];
                        copy[dayIdx].stayHotel = formatHotelWithSimilar(e.target.value);
                        setDayPlans(copy);
                      }}
                      placeholder="e.g. Deluxe Hotel / Similar"
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

                {/* Timeline Points */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-medium text-slate-400">
                      Day Flow / Timeline Bullets (Sightseeing, Drives & Experiences)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...dayPlans];
                        copy[dayIdx].timeline.push('');
                        setDayPlans(copy);
                      }}
                      className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Point
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {day.timeline.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                        <Input
                          value={point}
                          onChange={(e) => {
                            const copy = [...dayPlans];
                            copy[dayIdx].timeline[pIdx] = e.target.value;
                            setDayPlans(copy);
                          }}
                          placeholder={`Activity / Bullet #${pIdx + 1}`}
                          className="bg-slate-900 border-slate-800 text-white text-xs py-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...dayPlans];
                            copy[dayIdx].timeline = copy[dayIdx].timeline.filter((_, i) => i !== pIdx);
                            setDayPlans(copy);
                          }}
                          className="text-slate-600 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Inclusions & Exclusions */}
        <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Inclusions & Exclusions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  What's Included
                </label>
                <button
                  type="button"
                  onClick={() => setInclusions([...inclusions, ''])}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
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
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-red-400 uppercase tracking-wider">
                  What's Excluded
                </label>
                <button
                  type="button"
                  onClick={() => setExclusions([...exclusions, ''])}
                  className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
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
                      className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 9. Interactive Visual Batch Calendar with Auto-Calculated End Date & Hover Preview */}
        {tourType === 'Group' && (
          <section className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-orange-500" />
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight">
                    Interactive Batch Calendar ({durationDays} Days / {durationNights} Nights)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Hover on any date to preview the full batch; click once to automatically select the {durationDays}-day batch!
                  </p>
                </div>
              </div>

              {hoveredDayNum && (
                <div className="px-3.5 py-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
                  <span>
                    Hovering: {hoveredDayNum} {monthNames[calendarMonth].slice(0, 3)} → Batch will be:{' '}
                    <strong>
                      {hoveredDayNum} {monthNames[calendarMonth].slice(0, 3)} -{' '}
                      {new Date(calendarYear, calendarMonth, hoveredDayNum + durationDays - 1).getDate()}{' '}
                      {monthNames[new Date(calendarYear, calendarMonth, hoveredDayNum + durationDays - 1).getMonth()].slice(0, 3)}
                    </strong>{' '}
                    ({durationDays} Days)
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Calendar UI */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 max-w-lg mx-auto">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth - 1, 1))}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-white">
                  {monthNames[calendarMonth]} {calendarYear}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentCalendarDate(new Date(calendarYear, calendarMonth + 1, 1))}
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="text-[10px] font-bold text-slate-500">{d}</span>
                ))}
              </div>

              <div
                className="grid grid-cols-7 gap-1"
                onMouseLeave={() => setHoveredDayNum(null)}
              >
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;

                  // Check if dayNum is inside the hovered range
                  const isHoveredInRange =
                    hoveredDayNum !== null &&
                    dayNum >= hoveredDayNum &&
                    dayNum <= (hoveredDayNum + durationDays - 1);

                  // Check if this date falls within any added batch range
                  const currentDateVal = new Date(calendarYear, calendarMonth, dayNum).setHours(0, 0, 0, 0);
                  let isInRange = false;
                  const monthShortList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

                  batchDates.forEach(b => {
                    const yMatch = b.month.match(/(\d{4})/);
                    const bYear = yMatch ? parseInt(yMatch[1], 10) : calendarYear;

                    b.ranges.forEach(r => {
                      const parts = r.split(/\s*[-–—]\s*/);
                      if (parts.length === 2) {
                        const sParts = parts[0].split(/\s+/);
                        const eParts = parts[1].split(/\s+/);
                        if (sParts.length >= 2 && eParts.length >= 2) {
                          const sD = parseInt(sParts[0], 10);
                          const sM = monthShortList.indexOf(sParts[1].toLowerCase().slice(0, 3));
                          const eD = parseInt(eParts[0], 10);
                          const eM = monthShortList.indexOf(eParts[1].toLowerCase().slice(0, 3));

                          if (sM !== -1 && eM !== -1) {
                            const eYear = eM < sM ? bYear + 1 : bYear;
                            const startVal = new Date(bYear, sM, sD).setHours(0, 0, 0, 0);
                            const endVal = new Date(eYear, eM, eD).setHours(0, 0, 0, 0);
                            if (currentDateVal >= startVal && currentDateVal <= endVal) {
                              isInRange = true;
                            }
                          }
                        }
                      }
                    });
                  });

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onMouseEnter={() => setHoveredDayNum(dayNum)}
                      onClick={() => handleCalendarDayClick(dayNum)}
                      className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${isInRange
                          ? 'bg-[#ff5d09] text-white shadow-md font-bold'
                          : isHoveredInRange
                            ? 'bg-orange-500/35 text-orange-200 border border-orange-500/50 shadow-inner'
                            : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configured Batches Summary */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-300">
                Configured Batches (Formatted for Website):
              </label>
              <div className="space-y-2">
                {batchDates.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-orange-400">{b.month}:</span>
                    <div className="flex flex-wrap items-center gap-1.5 grow">
                      {b.ranges.map((r, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded-lg border border-slate-800 flex items-center gap-1.5"
                        >
                          <span>{r}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [...batchDates];
                              copy[idx].ranges = copy[idx].ranges.filter((_, i) => i !== rIdx);
                              if (copy[idx].ranges.length === 0) {
                                setBatchDates(copy.filter((_, i) => i !== idx));
                              } else {
                                setBatchDates(copy);
                              }
                            }}
                            className="text-slate-400 hover:text-red-400 cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom Floating Action Bar */}
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
            {getValidationErrors().length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setValidationErrors(getValidationErrors());
                  setValidationModalOpen(true);
                }}
                className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>{getValidationErrors().length} required fields missing</span>
              </button>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>All required fields ready</span>
              </span>
            )}


            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenExportModal}
              className="border-slate-800 bg-slate-950 text-slate-300 text-xs grow sm:grow-0 cursor-pointer"
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
              {saving ? 'Publishing...' : (isEditMode ? 'Update Itinerary (Live)' : 'Publish to Website (Live)')}
            </Button>
          </div>
        </div>
      </main>

      {/* VISUAL DESTINATION IMAGE PICKER MODAL (Grid of Thumbnails) */}
      {imagePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full my-auto shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <ImageIcon className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Destination Photo Library
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Click any thumbnail card to select it directly!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {imagePickerTarget === 'gallery' && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleConfirmGalleryPicks}
                    className="bg-[#ff5d09] text-white text-xs px-3 h-8"
                  >
                    Add Selected ({selectedGalleryPicks.length}) to Gallery
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => setImagePickerOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Destination Filter Picker Bar */}
            <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 grow">
                <span className="text-xs font-bold text-slate-300">Choose Destination:</span>
                <select
                  value={imagePickerDest}
                  onChange={(e) => {
                    setImagePickerDest(e.target.value);
                    fetchDestinationImages(e.target.value);
                  }}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-orange-400 font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {availableDestinations.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <span className="text-xs text-slate-400">
                {destImages.length} images available
              </span>
            </div>

            {/* Visual Thumbnail Grid */}
            <div className="overflow-y-auto p-4 sm:p-6 bg-slate-950 grow">
              {loadingDestImages ? (
                <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <RefreshCw className="w-6 h-6 animate-spin text-orange-400" />
                  <p className="text-xs font-medium">Loading destination photos...</p>
                </div>
              ) : destImages.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  No images found for this category. Try selecting another destination above or upload a custom photo.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
                  {destImages.map((img, i) => {
                    const isSelected = selectedGalleryPicks.includes(img) || heroImage === img;

                    return (
                      <div
                        key={i}
                        onClick={() => handleSelectImageFromLibrary(img)}
                        className={`relative rounded-xl overflow-hidden border-2 bg-slate-900 h-32 cursor-pointer group transition-all ${isSelected
                            ? 'border-orange-500 ring-2 ring-orange-500/50'
                            : 'border-slate-800 hover:border-slate-600'
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`Library ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white">
                          Click to Select
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Direct File Upload Option */}
            <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <label className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5" /> Or Upload a New Photo From Computer
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      const res = await fetch('/api/upload', { method: 'POST', body: formData });
                      const data = await res.json();
                      if (data.url) {
                        handleSelectImageFromLibrary(data.url);
                        if (imagePickerTarget !== 'gallery') {
                          setImagePickerOpen(false);
                        }
                      }
                    }
                  }}
                />
              </label>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImagePickerOpen(false)}
                className="border-slate-800 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

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
                className="text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
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
                  className="border-slate-800 text-xs cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopyExportCode}
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs cursor-pointer"
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
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Tour Format</p>
                  <p className="text-sm font-bold text-white mt-1">
                    {tourType === 'Group' ? `Group Tour (${groupSize} Pax)` : 'Customized Private'}
                  </p>
                </div>
                <div className="p-3 border-l border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider">Destination</p>
                  <p className="text-sm font-bold text-orange-400 mt-1">{destination}</p>
                </div>
              </div>

              {/* Day-by-Day Itinerary Flow */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-orange-400" />
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
                          <span>Overnight: <strong className="text-white">{formatHotelWithSimilar(day.stayHotel)}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Costing Breakdown Table */}
              {activeCostingDetails.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Package Costing & Sharing Options
                  </h3>
                  <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 overflow-hidden">
                    {activeCostingDetails.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 bg-slate-950/60 text-xs">
                        <span className="text-slate-300 font-medium">{c.label}</span>
                        <span className="text-emerald-400 font-bold">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
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

              {/* Batch Calendar (For Group Tour) */}
              {tourType === 'Group' && batchDates.length > 0 && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" /> Upcoming Departure Batches
                  </h4>
                  <div className="space-y-2">
                    {batchDates.map((b, i) => (
                      <div key={i} className="p-3 bg-slate-950/80 rounded-xl text-xs flex items-center gap-3">
                        <span className="font-bold text-white min-w-24">{b.month}:</span>
                        <div className="flex flex-wrap gap-2">
                          {b.ranges.map((r, rIdx) => (
                            <span key={rIdx} className="px-2.5 py-1 bg-orange-500/10 text-orange-300 border border-orange-500/20 rounded-md font-semibold">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Target URL: <span className="text-orange-400 font-mono">https://wanderphilia.com/trips/{slug || '...'}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewModalOpen(false)}
                  className="border-slate-800 text-xs cursor-pointer"
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
                  className="bg-[#ff5d09] hover:bg-orange-600 text-white text-xs px-4 cursor-pointer"
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


export default function WebsiteItineraryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Itinerary Studio...</p>
        </div>
      }
    >
      <WebsiteItineraryInner />
    </Suspense>
  );
}
