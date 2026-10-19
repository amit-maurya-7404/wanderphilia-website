'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Hotel,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Search,
  IndianRupee,
  Car,
  Utensils,
  HelpCircle,
  FileText,
  Compass,
  ChevronDown,
  X,
  Layers,
  Calculator,
  Database,
  Baby
} from 'lucide-react';
import { ItineraryHistorySection } from '@/components/itinerary/itinerary-history-section';
import {
  calculateRoomsAndBeds,
  calculateLeadPricingOffline,
  isExtraBed,
  isWithoutBed
} from '@/lib/zoho-pricing';

// --- BASELINE CATALOGS ---
const DEFAULT_CITIES_BY_DESTINATION: Record<string, string[]> = {
  rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Bikaner', 'Mount Abu', 'Ranthambore', 'Kumbhalgarh', 'Ajmer', 'Mandawa', 'Chittorgarh'],
  kashmir: ['Srinagar', 'Gulmarg', 'Pahalgam', 'Sonmarg', 'Doodhpathri', 'Yusmarg'],
  kerala: ['Munnar', 'Thekkady', 'Alleppey', 'Kochi', 'Kovalam', 'Wayanad', 'Varkala'],
  himachal: ['Shimla', 'Manali', 'Dharamshala', 'Dalhousie', 'Kasol', 'Spiti', 'Kaza', 'Jibhi', 'Bir Billing'],
  uttarakhand: ['Rishikesh', 'Haridwar', 'Mussoorie', 'Nainital', 'Jim Corbett', 'Auli', 'Dehradun'],
  goa: ['North Goa', 'South Goa', 'Panaji', 'Calangute', 'Candolim', 'Baga', 'Anjuna'],
  andaman: ['Port Blair', 'Havelock Island', 'Neil Island', 'Baratang Island'],
  goldentriangle: ['Delhi', 'Agra', 'Jaipur'],
  dubai: ['Dubai City', 'Desert Dunes', 'Abu Dhabi', 'Sharjah'],
  bali: ['Ubud', 'Kuta', 'Seminyak', 'Nusa Penida', 'Uluwatu', 'Canggu', 'Sanur'],
  thailand: ['Bangkok', 'Phuket', 'Krabi', 'Pattaya', 'Koh Samui', 'Chiang Mai'],
  vietnam: ['Hanoi', 'Ha Long Bay', 'Da Nang', 'Hoi An', 'Ho Chi Minh City']
};

const DEFAULT_EXPERIENCES_BY_CITY: Record<string, { name: string; guidedTour?: boolean; description?: string }[]> = {
  jaipur: [
    { name: 'City Palace', guidedTour: true, description: 'Explore the magnificent City Palace and discover Jaipur’s royal heritage through its grand courtyards, museums, and traditional architecture.' },
    { name: 'Hawa Mahal', guidedTour: true, description: 'Marvel at the iconic Palace of Winds with its 953 honeycombed windows built for royal women to observe city life.' },
    { name: 'Amber Fort', guidedTour: true, description: 'Explore the majestic hilltop Amber Fort featuring the dazzling Sheesh Mahal (Mirror Palace) and Rajput architecture.' },
    { name: 'Jantar Mantar', guidedTour: true, description: 'Discover the UNESCO World Heritage astronomical observatory and its fascinating geometric stone instruments.' },
    { name: 'Nahargarh Sunset Point', guidedTour: false, description: 'Enjoy panoramic sunset views overlooking the Pink City from the high ramparts of Nahargarh Fort.' },
    { name: 'Jal Mahal Photo Stop', guidedTour: false, description: 'Scenic photo stop at the serene Water Palace set amidst the waters of Man Sagar Lake.' },
    { name: 'Pink City Heritage Bazaar Walk', guidedTour: true, description: 'Walk through historic bazaars of Jaipur famous for block prints, gems, spices, and Rajasthani handicrafts.' },
    { name: 'Johari Bazaar', guidedTour: false, description: 'Explore Jaipur’s vibrant Johari Bazaar, known for traditional jewellery, gemstones, and festive shopping.' },
    { name: 'Patrika Gate', guidedTour: false, description: 'Admire the vibrant hand-painted murals and arches showcasing Rajasthan’s culture and heritage at Jawahar Circle.' },
    { name: 'Chokhi Dhani Cultural Village', guidedTour: false, description: 'Experience authentic Rajasthani village culture, traditional folk performances, and royal dining.' }
  ],
  jodhpur: [
    { name: 'Mehrangarh Fort', guidedTour: true, description: 'Visit one of India’s largest forts rising 400 feet above the city with palatial courtyards and royal exhibits.' },
    { name: 'Jaswant Thada', guidedTour: true, description: 'Peaceful white-marble royal cenotaph with carved gazebos, peaceful gardens, and panoramic city views.' },
    { name: 'Umaid Bhawan Palace & Museum', guidedTour: false, description: 'Explore the grand art-deco royal palace, museum exhibits, vintage automobiles, and royal family history.' },
    { name: 'Clock Tower & Sardar Market', guidedTour: false, description: 'Stroll around the historic Ghanta Ghar clock tower and bustling bazaar filled with spices, tea, and textiles.' },
    { name: 'Panchatiya Hills', guidedTour: false, description: 'Enjoy peaceful panoramic sunset views overlooking the Blue City from the heights of Panchatiya Hills.' },
    { name: 'Mandore Garden Light Show', guidedTour: false, description: 'Witness the captivating light and sound spectacle bringing the royal history of Mandore to life.' }
  ],
  udaipur: [
    { name: 'City Palace Udaipur', guidedTour: true, description: 'Explore Rajasthan’s largest palace complex overlooking Lake Pichola with ornate courtyards and mirror work.' },
    { name: 'Lake Pichola Scenic Boat Ride', guidedTour: false, description: 'Delightful boat cruise on Lake Pichola past historic ghats, Jag Mandir, and the floating Lake Palace.' },
    { name: 'Jag Mandir Island', guidedTour: false, description: 'Picturesque island palace on Lake Pichola with marble pavilions and scenic lakeside gardens.' },
    { name: 'Saheliyon Ki Bari', guidedTour: true, description: 'Stroll through the historic Garden of the Maidens featuring marble fountains, lotus pools, and kiosks.' },
    { name: 'Vintage Car Collection', guidedTour: false, description: 'View the private classic and vintage car collection belonging to the royal family of Mewar.' }
  ],
  jaisalmer: [
    { name: 'Jaisalmer Golden Fort', guidedTour: true, description: 'Explore the living golden sandstone fort housing ancient Jain temples, shops, and royal palaces.' },
    { name: 'Sam Sand Dunes Camel Safari', guidedTour: false, description: 'Thrilling camel safari across golden undulating dunes in the heart of the Thar Desert.' },
    { name: 'Desert Sunset & Folk Dance Night', guidedTour: false, description: 'Evening cultural program with traditional Kalbelia dance, folk singing, bonfire, and Rajasthani buffet.' },
    { name: 'Patwon Ki Haveli', guidedTour: true, description: 'Marvel at the intricate jali stone carving and antique artefacts across five historic merchant havelis.' },
    { name: 'Bada Bagh', guidedTour: false, description: 'Historic royal cenotaphs of the Maharajas of Jaisalmer set against rolling desert hills and windmills.' },
    { name: 'Thar Desert Experience', guidedTour: false, description: 'Experience the Thar Desert with sunset views, camel safaris, dunes, and traditional camping.' }
  ]
};

// Safe date parser to YYYY-MM-DD for HTML date inputs
const toDateInputValue = (val: any): string => {
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const parts = s.split(/[-/]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    }
    if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return '';
};

// --- REUSABLE LOOKUP FIELD COMPONENT ---
interface LookupFieldProps {
  value?: string | null;
  onChange: (val: string, meta?: any) => void;
  options: (string | { label?: string; value?: string; badge?: string; meta?: any })[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function LookupField({ value = '', onChange, options = [], placeholder, className, disabled }: LookupFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const safeValue = typeof value === 'string' ? value : (value !== null && value !== undefined ? String(value) : '');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map(opt => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        const str = String(opt);
        return { label: str, value: str, badge: undefined, meta: undefined };
      }
      if (opt && typeof opt === 'object') {
        const valStr = opt.value !== undefined && opt.value !== null ? String(opt.value) : (opt.label ? String(opt.label) : '');
        const lblStr = opt.label !== undefined && opt.label !== null ? String(opt.label) : valStr;
        return {
          ...opt,
          label: lblStr,
          value: valStr
        };
      }
      return { label: '', value: '', badge: undefined, meta: undefined };
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return normalizedOptions;
    return normalizedOptions.filter(o => (o.label || '').toLowerCase().includes(q));
  }, [normalizedOptions, search]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={isOpen ? search : safeValue}
          disabled={disabled}
          placeholder={placeholder || 'Select or type...'}
          onFocus={() => {
            setSearch(safeValue);
            setIsOpen(true);
          }}
          onChange={e => {
            const v = e.target.value;
            setSearch(v);
            onChange(v);
            setIsOpen(true);
          }}
          className={`pr-7 text-xs h-9 bg-white border border-slate-400 text-slate-900 placeholder:text-slate-500 rounded-md font-medium shadow-none focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-colors ${className || ''}`}
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {safeValue && !disabled && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onChange('');
                setSearch('');
              }}
              className="text-slate-500 hover:text-slate-800 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!isOpen) setSearch(safeValue);
              setIsOpen(!isOpen);
            }}
            className="text-slate-500 hover:text-slate-800 p-0.5"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 min-w-[260px] max-w-[340px] mt-1 max-h-60 overflow-y-auto bg-white border border-slate-300 rounded-lg shadow-2xl py-1 text-xs divide-y divide-slate-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => {
              const isSelected = safeValue.toLowerCase() === (opt.value || '').toLowerCase();
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(opt.value, opt.meta);
                    setSearch(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${isSelected
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-orange-100 border border-orange-200 text-orange-700 font-semibold shrink-0">
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-slate-500 text-[11px] italic">
              No matching lookup item. Keep &quot;{search}&quot; as custom.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- INTERFACES ---
export interface ChildDetail {
  childNumber: number;
  age: string;
  bedPreference: 'With Bed' | 'Without Bed' | 'Crib';
}

// Calculate recommended room count strictly based on Zoho Deluge automation (Max 3 per room capacity)
export function calculateRecommendedRooms(
  adultsCount: number,
  kidsCount: number,
  sharingTypeVal: string,
  kidsDetailsList: ChildDetail[] = []
): number {
  const k = Math.max(0, Number(kidsCount) || 0);
  const extraBedKids = kidsDetailsList.slice(0, k).filter(c => isExtraBed(c.bedPreference)).length;
  const res = calculateRoomsAndBeds({
    adults: adultsCount,
    sharingType: sharingTypeVal,
    totalKidsCount: k,
    initialExtraBedCount: extraBedKids
  });
  return res.totalRooms;
}

interface HotelItem {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  roomCategory: string;
  category: string;
  stayDates?: string;
}

// Table Grid Row Interface matching user's requested columns
interface TableDayRow {
  dayNumber: number;
  dayText: string;
  guidedTour: boolean;
  city: string;
  enRouteExperiences: string[];
  city2: string;
  experiences: string[]; // Experience 1, 2, 3, 4 ...
  descriptions: string[]; // Description 1, 2, 3, 4 ...
  experienceCosts: number[]; // Per person costs
  optionalExperiences: string[]; // Optional Experience 1, 2
  optionalDescriptions: string[]; // Optional Description 1, 2
  optionalExperienceCosts: number[]; // Optional costs
}

export default function SheetItineraryPage() {
  const [selectedOption, setSelectedOption] = useState<number>(1);

  // Traveler Details (Independent of sheet)
  const [inquiryId, setInquiryId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [destination, setDestination] = useState('Rajasthan');
  const [destinationType, setDestinationType] = useState('India');

  // Dates & Pax
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noOfDays, setNoOfDays] = useState(5);
  const [noOfNights, setNoOfNights] = useState(4);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [kidsDetails, setKidsDetails] = useState<ChildDetail[]>([]);
  const [isKidsModalOpen, setIsKidsModalOpen] = useState(false);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [isRoomsManuallySet, setIsRoomsManuallySet] = useState(false);
  const [sharingType, setSharingType] = useState('Double Sharing');
  const [travelStyle, setTravelStyle] = useState('Family Trip');

  // Optional Zoho Sync (Inquiry / Lead)
  const [zohoInquiryInput, setZohoInquiryInput] = useState('');
  const [fetchingZoho, setFetchingZoho] = useState(false);
  const [zohoSyncMsg, setZohoSyncMsg] = useState<string | null>(null);

  // Zoho Fixed Itineraries Template Module
  const [zohoFixedItineraries, setZohoFixedItineraries] = useState<any[]>([]);
  const [selectedFixedItineraryId, setSelectedFixedItineraryId] = useState('');
  const [loadingZohoFixed, setLoadingZohoFixed] = useState(false);
  const [zohoFixedMsg, setZohoFixedMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Master Data Source: 'zoho' (default) or 'sheet'
  const [dataSource, setDataSource] = useState<'zoho' | 'sheet'>('zoho');
  const [loadingZohoMaster, setLoadingZohoMaster] = useState(false);
  const [zohoMasterError, setZohoMasterError] = useState<string | null>(null);
  const [zohoMasterStats, setZohoMasterStats] = useState<{ activitiesCount: number; hotelsCount: number; vehiclesCount: number } | null>(null);
  const [zohoVehicles, setZohoVehicles] = useState<any[]>([]);

  // Google Sheet Connection State (Fallback option)
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1e5wSIGjKwpyujB12YjoFlu3SXc6XLnI7tOLj5zD97XY/edit?usp=sharing');
  const [connectingSheet, setConnectingSheet] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetSuccessMsg, setSheetSuccessMsg] = useState<string | null>(null);

  // Dynamic Lookup Catalogs (Fed directly from Zoho CRM or Sheet)
  const [sheetDestinations, setSheetDestinations] = useState<string[]>([]);
  const [sheetCitiesByDest, setSheetCitiesByDest] = useState<Record<string, string[]>>({});
  const [sheetExpByCity, setSheetExpByCity] = useState<Record<string, any[]>>({});
  const [sheetHotelsByCity, setSheetHotelsByCity] = useState<Record<string, any[]>>({});

  // Packages found in Sheet
  const [sheetPackages, setSheetPackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Itinerary Data
  const [vehicleType, setVehicleType] = useState('AC Innova Crysta');
  const [mealPlan, setMealPlan] = useState('Breakfast & Dinner');

  // Master Hotel Category (Package Category: Deluxe, Super Deluxe, Premium, Luxury, All)
  const [masterHotelCategory, setMasterHotelCategory] = useState<string>('Deluxe');

  // Hotels (Up to 6)
  const [hotels, setHotels] = useState<HotelItem[]>([
    { index: 1, hotelName: '', city: 'Jaipur', nights: 2, roomCategory: 'Deluxe Room', category: 'Deluxe', stayDates: '' },
    { index: 2, hotelName: '', city: 'Jodhpur', nights: 2, roomCategory: 'Deluxe Room', category: 'Deluxe', stayDates: '' }
  ]);
  const [isHotelsManuallyCustomized, setIsHotelsManuallyCustomized] = useState<boolean>(false);

  // Helper to create an initial Table Row
  const createInitialDayRow = (dayNum: number, city?: string): TableDayRow => ({
    dayNumber: dayNum,
    dayText: `Day ${dayNum}`,
    guidedTour: dayNum <= 2,
    city: city || 'Jaipur',
    enRouteExperiences: [''],
    city2: '',
    experiences: ['', '', '', ''],
    descriptions: ['', '', '', ''],
    experienceCosts: [0, 0, 0, 0],
    optionalExperiences: ['', ''],
    optionalDescriptions: ['', ''],
    optionalExperienceCosts: [0, 0]
  });

  // Table Day Rows State (Spreadsheet Column Grid)
  const [dayRows, setDayRows] = useState<TableDayRow[]>([
    createInitialDayRow(1, 'Jaipur'),
    createInitialDayRow(2, 'Jaipur'),
    createInitialDayRow(3, 'Jodhpur'),
    createInitialDayRow(4, 'Jaisalmer'),
    createInitialDayRow(5, 'Udaipur')
  ]);

  // Pricing & Margins
  const [baseQuotation, setBaseQuotation] = useState<string>('');
  const [marginPercent, setMarginPercent] = useState<string>('');
  const [finalQuotation, setFinalQuotation] = useState<string>('');
  const [perAdultPrice, setPerAdultPrice] = useState<string>('');
  const [perKidPrice, setPerKidPrice] = useState<string>('');
  const [advanceAmount, setAdvanceAmount] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isQuoteManuallyEdited, setIsQuoteManuallyEdited] = useState<boolean>(false);

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState<any>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // --- ACTIVITY PER PERSON COST CALCULATION ---
  const totalPerPersonActivityCost = useMemo(() => {
    let sum = 0;
    dayRows.forEach(row => {
      (row.experienceCosts || []).forEach(c => (sum += Number(c) || 0));
    });
    return sum;
  }, [dayRows]);

  const totalActivityCost = useMemo(() => {
    return totalPerPersonActivityCost * (Number(adults) || 2);
  }, [totalPerPersonActivityCost, adults]);

  // --- LIVE COMPREHENSIVE COST & QUOTATION ENGINE (EXACT ZOHO DELUGE FORMULA) ---
  const quotationCalculations = useMemo(() => {
    const adultPax = Math.max(1, Number(adults) || 1);
    const kidPax = Math.max(0, Number(kids) || 0);
    const totalDays = Math.max(1, Number(noOfDays) || dayRows.length || 1);

    // 1. Vehicle / Transport Setup
    const vStr = typeof vehicleType === 'string'
      ? vehicleType
      : (typeof vehicleType === 'object' && vehicleType !== null
        ? (vehicleType as any).name || (vehicleType as any).label || (vehicleType as any).value || ''
        : String(vehicleType || ''));
    const vLower = vStr.toLowerCase().trim();

    let vehicleDailyRate = 4500; // Default Innova Crysta
    if (zohoVehicles && zohoVehicles.length > 0) {
      const vFound = zohoVehicles.find(v => (v.name || '').toLowerCase().trim() === vLower);
      if (vFound && vFound.cost) {
        vehicleDailyRate = Number(vFound.cost) || vehicleDailyRate;
      }
    } else {
      if (vLower.includes('sedan') || vLower.includes('dzire')) vehicleDailyRate = 2800;
      else if (vLower.includes('ertiga')) vehicleDailyRate = 3500;
      else if (vLower.includes('innova')) vehicleDailyRate = 4500;
      else if (vLower.includes('12 seater') || vLower.includes('tempo 12')) vehicleDailyRate = 6500;
      else if (vLower.includes('17 seater') || vLower.includes('tempo 17')) vehicleDailyRate = 7500;
      else if (vLower.includes('urbania')) vehicleDailyRate = 9500;
      else if (vLower.includes('fortuner')) vehicleDailyRate = 9000;
    }

    // 2. Hotel Accommodations Setup
    const mappedHotels = hotels.map(h => {
      const cat = h.category || masterHotelCategory || 'Deluxe';
      const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const sheetHotels = sheetHotelsByCity[cClean] || [];
      const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === (h.hotelName || '').toLowerCase().trim());
      let roomRate = 0;
      let extraBedRate = 0;
      let childNoBedRate = 0;

      if (foundHotel && Array.isArray(foundHotel.rooms)) {
        const foundRoom = foundHotel.rooms.find((r: any) => (r.roomCategory || '').toLowerCase().trim() === (h.roomCategory || '').toLowerCase().trim());
        if (foundRoom && foundRoom.pricePerNight) {
          roomRate = Number(foundRoom.pricePerNight) || 0;
        }
      }

      return {
        hotelName: h.hotelName,
        city: h.city,
        nights: Number(h.nights) || 1,
        category: cat,
        roomCategory: h.roomCategory,
        roomRate: roomRate || undefined,
        extraBedRate: extraBedRate || undefined,
        childNoBedRate: childNoBedRate || undefined
      };
    });

    // 3. Day Rows & Activities Setup (SIC vs Private, Guided Tour ₹2000)
    const mappedDayRows = dayRows.map(row => {
      const activities: Array<{ name?: string; costPerPerson?: number; costPerChild?: number; privateCost?: number }> = [];
      (row.experiences || []).forEach((expName, eIdx) => {
        if (!expName) return;
        const catalogItem = findExperienceInCatalogs(expName, row.city || row.city2);
        const pp = Number(row.experienceCosts?.[eIdx]) || Number(catalogItem?.ppCost) || 0;
        activities.push({
          name: expName,
          costPerPerson: pp,
          costPerChild: catalogItem?.costPerChild ? Number(catalogItem.costPerChild) : Math.round(pp * 0.7),
          privateCost: catalogItem?.privateCost ? Number(catalogItem.privateCost) : 0
        });
      });
      return {
        dayNumber: row.dayNumber,
        guidedTour: !!row.guidedTour,
        activities
      };
    });

    // 4. Run exact Deluge Offline Pricing Automation Engine
    const delugePricing = calculateLeadPricingOffline({
      adults: adultPax,
      kids: kidPax,
      noOfDays: totalDays,
      sharingType,
      globalTargetCat: masterHotelCategory,
      kidsDetails: kidsDetails.map(k => ({ age: Number(k.age) || 6, bedPreference: k.bedPreference })),
      hotels: mappedHotels,
      vehicle: {
        name: vStr,
        dailyCost: vehicleDailyRate
      },
      dayRows: mappedDayRows
    });

    // 5. Margin & Taxes
    const calculatedBase = delugePricing.finalQuotation;
    const marginPct = marginPercent !== '' && !isNaN(Number(marginPercent)) ? Number(marginPercent) : 0;
    const marginAmount = marginPct > 0 ? Math.round(calculatedBase * (marginPct / 100)) : 0;
    const subtotalWithMargin = calculatedBase + marginAmount;
    const gstAmount = marginPct > 0 ? Math.round(subtotalWithMargin * 0.05) : 0; // 5% GST
    const calculatedFinalQuote = Math.round(subtotalWithMargin + gstAmount);

    // Scale Per Adult and Per Child proportionally if margin or taxes exist
    const quoteRatio = calculatedBase > 0 ? calculatedFinalQuote / calculatedBase : 1;
    const calculatedPerAdult = Math.round(delugePricing.perAdultCost * quoteRatio);
    const calculatedPerKid = kidPax > 0 ? Math.round(delugePricing.perChildCost * quoteRatio) : 0;

    return {
      adultPax,
      kidPax,
      rooms: delugePricing.roomsCount,
      baseRooms: delugePricing.baseRooms,
      extraRoomsAdded: delugePricing.extraRoomsAdded,
      extraBedCount: delugePricing.extraBedCount,
      billableExtraBeds: delugePricing.billableExtraBeds,
      childWithoutBedCount: delugePricing.childWithoutBedCount,
      transportKidsCount: delugePricing.transportKidsCount,
      kidsAbove5Count: delugePricing.kidsAbove5Count,
      totalTransportPax: delugePricing.totalTransportPax,
      totalDays,
      totalActivitiesCost: delugePricing.totalActivitiesCost,
      totalAdultActivitiesCost: delugePricing.totalAdultActivitiesCost,
      totalChildActivitiesCost: delugePricing.totalChildActivitiesCost,
      totalGuideCost: delugePricing.totalGuideCost,
      perHeadGuideShare: delugePricing.perHeadGuideShare,
      totalVehicleCost: delugePricing.totalVehicleCost,
      perHeadTransportCost: delugePricing.perHeadTransportCost,
      totalHotelsCost: delugePricing.totalHotelsCost,
      currentHotelExtraBedCostTotal: delugePricing.currentHotelExtraBedCostTotal,
      currentHotelChildNoBedCostTotal: delugePricing.currentHotelChildNoBedCostTotal,
      childHotelShare: delugePricing.childHotelShare,
      calculatedBase,
      marginPct,
      marginAmount,
      gstAmount,
      calculatedFinalQuote,
      calculatedPerAdult,
      calculatedPerKid,
      delugePerAdultCost: delugePricing.perAdultCost,
      delugePerChildCost: delugePricing.perChildCost,
      vehicleDailyRate,
      delugePricing
    };
  }, [
    adults,
    kids,
    kidsDetails,
    roomsCount,
    noOfDays,
    dayRows,
    hotels,
    vehicleType,
    masterHotelCategory,
    sharingType,
    marginPercent,
    sheetHotelsByCity,
    zohoVehicles,
    totalPerPersonActivityCost,
    destination
  ]);

  // Auto-calculate rooms as per adults and kids whenever they change
  useEffect(() => {
    if (!isRoomsManuallySet) {
      const rec = calculateRecommendedRooms(adults, kids, sharingType, kidsDetails);
      setRoomsCount(rec);
    }
  }, [adults, kids, sharingType, kidsDetails, isRoomsManuallySet]);

  // Live Auto-Sync Final Quotation, Per Adult Cost & Per Child Cost
  useEffect(() => {
    if (!isQuoteManuallyEdited && quotationCalculations.calculatedFinalQuote > 0) {
      setBaseQuotation(String(quotationCalculations.calculatedBase));
      setFinalQuotation(String(quotationCalculations.calculatedFinalQuote));
      setPerAdultPrice(String(quotationCalculations.calculatedPerAdult));
      if (kids > 0) {
        setPerKidPrice(String(quotationCalculations.calculatedPerKid));
      } else {
        setPerKidPrice('');
      }
      const adv = Number(advanceAmount) || 0;
      setBalanceAmount(String(Math.max(0, quotationCalculations.calculatedFinalQuote - adv)));
    }
  }, [quotationCalculations, isQuoteManuallyEdited, kids]);

  // Destination Options
  const destinationOptions = useMemo(() => {
    const defaultList = [
      'Rajasthan',
      'Kashmir',
      'Kerala',
      'Himachal',
      'Uttarakhand',
      'Goa',
      'Andaman',
      'Golden Triangle',
      'Dubai',
      'Bali',
      'Thailand',
      'Vietnam'
    ];
    return Array.from(new Set([...sheetDestinations, ...defaultList]));
  }, [sheetDestinations]);

  // Available Cities for Selected Destination
  const availableCitiesForDestination = useMemo(() => {
    const destClean = destination.trim().toLowerCase();
    const sheetMatches: string[] = [];

    Object.keys(sheetCitiesByDest).forEach(dKey => {
      const k = dKey.toLowerCase();
      if (k === destClean || k.includes(destClean) || destClean.includes(k)) {
        sheetMatches.push(...sheetCitiesByDest[dKey]);
      }
    });

    const defaultMatches = DEFAULT_CITIES_BY_DESTINATION[destClean.replace(/[^a-z0-9]/g, '')] || [];
    const combined = Array.from(new Set([...sheetMatches, ...defaultMatches]));

    if (combined.length === 0) {
      return DEFAULT_CITIES_BY_DESTINATION['rajasthan'] || [];
    }
    return combined;
  }, [destination, sheetCitiesByDest]);

  // Filter Zoho Fixed Itineraries strictly according to the selected destination
  const [showAllZohoFixedItineraries, setShowAllZohoFixedItineraries] = useState(false);

  const filteredZohoFixedItineraries = useMemo(() => {
    if (showAllZohoFixedItineraries || !destination || !destination.trim()) {
      return zohoFixedItineraries;
    }

    const destClean = destination.trim().toLowerCase();
    const destAlpha = destClean.replace(/[^a-z0-9]/g, '');
    const knownCities = (availableCitiesForDestination || [])
      .map(c => c.toLowerCase().trim().replace(/[^a-z0-9]/g, ''))
      .filter(c => c.length >= 3);

    const filtered = zohoFixedItineraries.filter(item => {
      const itemDest = String(item.destination || '').trim().toLowerCase();
      const itemDestAlpha = itemDest.replace(/[^a-z0-9]/g, '');
      const itemName = String(item.name || '').trim().toLowerCase();
      const itemNameAlpha = itemName.replace(/[^a-z0-9]/g, '');
      const itemCatAlpha = String(item.category || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      // 1. Direct match with item destination
      if (itemDestAlpha && (itemDestAlpha === destAlpha || itemDestAlpha.includes(destAlpha) || destAlpha.includes(itemDestAlpha))) {
        return true;
      }

      // 2. Direct match with item category
      if (itemCatAlpha && (itemCatAlpha === destAlpha || itemCatAlpha.includes(destAlpha) || destAlpha.includes(itemCatAlpha))) {
        return true;
      }

      // 3. Itinerary name contains destination
      if (itemNameAlpha.includes(destAlpha) || itemName.includes(destClean)) {
        return true;
      }

      // 4. Itinerary name contains any known city belonging to this destination
      // e.g. Jawai, Jodhpur, Jaisalmer, Jaipur, Udaipur all belong to Rajasthan!
      const hasCityMatch = knownCities.some(city => itemNameAlpha.includes(city));
      if (hasCityMatch) {
        return true;
      }

      return false;
    });

    return filtered;
  }, [destination, zohoFixedItineraries, availableCitiesForDestination, showAllZohoFixedItineraries]);

  // Auto-reset selected fixed itinerary if destination changed and current selection is no longer in filtered list
  useEffect(() => {
    if (selectedFixedItineraryId && !showAllZohoFixedItineraries) {
      const exists = filteredZohoFixedItineraries.some(item => item.id === selectedFixedItineraryId);
      if (!exists) {
        setSelectedFixedItineraryId('');
      }
    }
  }, [destination, filteredZohoFixedItineraries, showAllZohoFixedItineraries, selectedFixedItineraryId]);

  // Helper to derive Hotel Stays & Nights from Day Rows based on City 2 (night stay city takes precedence)
  const deriveHotelsFromDayRows = (
    rows: TableDayRow[] | any[],
    nightsCount?: number,
    currentCategory?: string,
    existingHotels?: HotelItem[]
  ): HotelItem[] => {
    if (!rows || rows.length === 0) return [];

    const effectiveNights = Number(nightsCount) > 0
      ? Number(nightsCount)
      : Math.max(1, rows.length > 1 ? rows.length - 1 : 1);

    // Overnight stays happen on days 1 to effectiveNights (0 to effectiveNights - 1)
    const nightDays = rows.slice(0, effectiveNights);

    const stays: { city: string; nights: number }[] = [];

    nightDays.forEach((r: any) => {
      // Prioritize City 2 as night stay city, fallback to City, fallback to destination
      const rawCity = (r.city2 || r.city || destination || '').trim();
      const stayCity = rawCity || availableCitiesForDestination[0] || 'Jaipur';

      if (stays.length > 0 && stays[stays.length - 1].city.toLowerCase() === stayCity.toLowerCase()) {
        // Consecutive night in same city
        stays[stays.length - 1].nights += 1;
      } else {
        // New city hotel stay
        stays.push({ city: stayCity, nights: 1 });
      }
    });

    const cat = currentCategory || masterHotelCategory || 'Deluxe';
    const pool = existingHotels || hotels;

    return stays.slice(0, 6).map((stay, idx) => {
      const existing = pool.find(
        h => (h.city || '').toLowerCase().trim() === stay.city.toLowerCase().trim()
      );
      return {
        index: idx + 1,
        hotelName: existing?.hotelName || '',
        city: stay.city,
        nights: stay.nights,
        roomCategory: existing?.roomCategory || 'Deluxe Room',
        category: existing?.category || cat,
        stayDates: existing?.stayDates || ''
      };
    });
  };

  // Track sequence of night stay cities (City 2 takes precedence over City 1)
  const nightCitiesKey = useMemo(() => {
    const effNights = Number(noOfNights) > 0 ? Number(noOfNights) : Math.max(1, dayRows.length > 1 ? dayRows.length - 1 : 1);
    return dayRows
      .slice(0, effNights)
      .map(r => (r.city2 || r.city || '').trim().toLowerCase())
      .join('->');
  }, [dayRows, noOfNights]);

  // Auto-sync Hotel Cities & Nights as per City 2 whenever itinerary cities change
  useEffect(() => {
    if (!isHotelsManuallyCustomized && dayRows.length > 0 && nightCitiesKey) {
      setHotels(prev => {
        const derived = deriveHotelsFromDayRows(dayRows, noOfNights, masterHotelCategory, prev);
        return derived.length > 0 ? derived : prev;
      });
    }
  }, [nightCitiesKey, isHotelsManuallyCustomized, masterHotelCategory]);

  // Available Vehicle options from Zoho CRM Vehicles module or fallback
  const vehicleOptions = useMemo(() => {
    if (zohoVehicles && zohoVehicles.length > 0) {
      return zohoVehicles.map(v => ({
        label: v.name,
        value: v.name,
        badge: v.cost ? `₹${Number(v.cost).toLocaleString('en-IN')}/day • Up to ${v.maxCapacity} Pax` : `Up to ${v.maxCapacity} Pax`
      }));
    }
    return [
      'AC Sedan / Dzire',
      'AC Innova Crysta',
      'Tempo Traveller 12 Seater',
      'Tempo Traveller 17 Seater',
      'Luxury Urbania',
      'AC Ertiga',
      'Toyota Fortuner'
    ];
  }, [zohoVehicles]);

  // Helper to look up an experience's description and cost across all loaded catalogs
  const findExperienceInCatalogs = (expName: string, preferredCity?: string) => {
    if (!expName || !expName.trim()) return null;
    const clean = expName.trim().toLowerCase();

    // 1. Search in preferred city first
    if (preferredCity) {
      const pClean = preferredCity.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const cityList = sheetExpByCity[pClean] || [];
      const match = cityList.find(
        (c: any) =>
          (c.name || '').trim().toLowerCase() === clean ||
          (c.name || '').toLowerCase().includes(clean) ||
          clean.includes((c.name || '').toLowerCase())
      );
      if (match && (match.description || match.templateDescription)) return match;
    }

    // 2. Search across all cities in sheetExpByCity
    for (const list of Object.values(sheetExpByCity)) {
      const match = (list || []).find(
        (c: any) =>
          (c.name || '').trim().toLowerCase() === clean ||
          (c.name || '').toLowerCase().includes(clean) ||
          clean.includes((c.name || '').toLowerCase())
      );
      if (match && (match.description || match.templateDescription)) return match;
    }

    // 3. Search in default experiences
    for (const list of Object.values(DEFAULT_EXPERIENCES_BY_CITY)) {
      const match = (list || []).find(
        (c: any) =>
          (c.name || '').trim().toLowerCase() === clean ||
          (c.name || '').toLowerCase().includes(clean) ||
          clean.includes((c.name || '').toLowerCase())
      );
      if (match && match.description) return match;
    }

    return null;
  };
  const getExperiencesLookupForDay = (city1?: string, city2?: string) => {
    const map = new Map<string, { label: string; value: string; badge?: string; meta?: any }>();
    const citiesToInclude = Array.from(new Set([city1, city2].filter(Boolean) as string[]));

    // If no city provided, fallback to destination
    if (citiesToInclude.length === 0 && destination) {
      citiesToInclude.push(destination);
    }

    citiesToInclude.forEach(cName => {
      const cClean = cName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const sheetExps = sheetExpByCity[cClean] || [];
      const defaultExps = DEFAULT_EXPERIENCES_BY_CITY[cClean] || [];

      sheetExps.forEach(e => {
        const key = e.name.toLowerCase().trim();
        if (!map.has(key)) {
          const priceText = e.ppCost ? `₹${Number(e.ppCost).toLocaleString('en-IN')}/pax` : undefined;
          const cityBadge = citiesToInclude.length > 1 ? cName : undefined;
          const locationBadge = e.locationType === 'En-route' ? 'En-route' : undefined;
          const badges = [cityBadge, locationBadge, e.guidedTour ? 'Guided' : undefined, priceText].filter(Boolean).join(' • ');
          map.set(key, {
            label: e.name,
            value: e.name,
            badge: badges || undefined,
            meta: {
              city: cName,
              guidedTour: e.guidedTour,
              ppCost: e.ppCost || 0,
              description: e.description || e.templateDescription || ''
            }
          });
        }
      });

      defaultExps.forEach(e => {
        const key = e.name.toLowerCase().trim();
        if (!map.has(key)) {
          const cityBadge = citiesToInclude.length > 1 ? cName : undefined;
          const badges = [cityBadge, e.guidedTour ? 'Guided' : undefined].filter(Boolean).join(' • ');
          map.set(key, {
            label: e.name,
            value: e.name,
            badge: badges || undefined,
            meta: { city: cName, guidedTour: e.guidedTour, ppCost: 0, description: '' }
          });
        }
      });
    });

    return Array.from(map.values());
  };

  // Get En-route Spot Lookup for City and/or City 2 (includes transit spots + both cities' experiences + Zoho En-route items)
  const getEnRouteLookupForDay = (city1?: string, city2?: string) => {
    const map = new Map<string, { label: string; value: string; badge?: string; meta?: any }>();

    // 1. Common transit highway spots
    const defaultTransitSpots = [
      'Ajmer Sharif Dargah',
      'Pushkar Brahma Temple',
      'Ranakpur Jain Temples',
      'Kumbhalgarh Fort',
      'Fatehpur Sikri',
      'Abhaneri Chand Baori',
      'Chittorgarh Fort',
      'Bhimlat Mahadev Waterfalls',
      'Kuldhara Haunted Village',
      'Munabao Border',
      'Tanot Mata Temple',
      'Osian Sand Dunes & Temple',
      'Samode Palace',
      'Patrika Gate',
      'Kishangarh Dumping Yard'
    ];

    defaultTransitSpots.forEach(spot => {
      map.set(spot.toLowerCase().trim(), {
        label: spot,
        value: spot,
        badge: 'En-route Stop',
        meta: { description: `En-route visit to ${spot}.`, ppCost: 0 }
      });
    });

    // 2. Add experiences from City 1 & City 2
    const dayExps = getExperiencesLookupForDay(city1, city2);
    dayExps.forEach(exp => {
      const key = exp.value.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, exp);
      }
    });

    // 3. Add any experiences from master catalog specifically flagged as 'En-route'
    Object.values(sheetExpByCity).forEach(list => {
      (list || []).forEach(e => {
        if (e.locationType === 'En-route') {
          const key = e.name.toLowerCase().trim();
          if (!map.has(key)) {
            const priceText = e.ppCost ? `₹${Number(e.ppCost).toLocaleString('en-IN')}/pax` : undefined;
            const badges = [e.city ? `${e.city}` : undefined, 'En-route', priceText].filter(Boolean).join(' • ');
            map.set(key, {
              label: e.name,
              value: e.name,
              badge: badges,
              meta: {
                city: e.city,
                guidedTour: e.guidedTour,
                ppCost: e.ppCost || 0,
                description: e.description || e.templateDescription || ''
              }
            });
          }
        }
      });
    });

    return Array.from(map.values());
  };

  // Backward compatibility alias for single city callers
  const getExperiencesLookupForCity = (cityName: string) => getExperiencesLookupForDay(cityName);

  // Helper to match STRICTLY by Hotel Category (No star rating checking)
  const matchesHotelCategory = (hotelCat: string, targetCat: string) => {
    if (!targetCat || targetCat === 'All') return true;
    const c = (hotelCat || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const t = targetCat.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (t === 'superdeluxe') return c === 'superdeluxe' || c.includes('super');
    if (t === 'deluxe') return c === 'deluxe' && !c.includes('super');
    if (t === 'premium') return c === 'premium' || c.includes('premium');
    if (t === 'luxury') return c.includes('luxury');

    return c === t || c.includes(t) || t.includes(c);
  };

  // Get Hotels Lookup for a City filtered STRICTLY by Hotel Category
  const getHotelsLookupForCity = (cityName: string, categoryFilter?: string) => {
    const cClean = (cityName || destination).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const sheetHotels = sheetHotelsByCity[cClean] || [];
    const effectiveCat = categoryFilter || masterHotelCategory || 'Deluxe';

    const filtered = sheetHotels.filter(h =>
      matchesHotelCategory(h.category, effectiveCat)
    );

    // If matches found for this specific category in this city, return only them
    if (filtered.length > 0) {
      return filtered.map(h => ({
        label: h.hotelName,
        value: h.hotelName,
        badge: h.category,
        meta: h
      }));
    }

    // Fallback: If no hotel in this city matches that specific category, show available hotels
    return sheetHotels.map(h => ({
      label: h.hotelName,
      value: h.hotelName,
      badge: h.category,
      meta: h
    }));
  };

  // Get Room Categories for a Selected Hotel
  const getRoomCategoriesForHotel = (hotelName: string, cityName: string) => {
    const cClean = (cityName || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const sheetHotels = sheetHotelsByCity[cClean] || [];
    const hName = (hotelName || '').trim().toLowerCase();
    const found = sheetHotels.find((h: any) => (h.hotelName || '').toLowerCase().trim() === hName);
    if (found && Array.isArray(found.rooms) && found.rooms.length > 0) {
      return found.rooms.map((r: any) => ({
        label: r.roomCategory,
        value: r.roomCategory,
        badge: r.pricePerNight ? `₹${Number(r.pricePerNight).toLocaleString('en-IN')}/night` : undefined
      }));
    }
    return ['Deluxe Room', 'Super Deluxe Room', 'Luxury Tent', 'Executive Suite', 'Standard Room'];
  };

  // Sync from Zoho Lead
  const handleFetchFromZoho = async () => {
    if (!zohoInquiryInput.trim()) return;
    setFetchingZoho(true);
    setZohoSyncMsg(null);
    try {
      const res = await fetch(`/api/zoho/fetch-lead?query=${encodeURIComponent(zohoInquiryInput.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.lead) throw new Error(data.error || 'Lead not found in Zoho.');
      const l = data.lead;
      const raw = l.rawLeadData || {};

      // 1. Inquiry ID
      const resolvedInquiryId = l.inquiryId || raw.Inquiry_ID || zohoInquiryInput.trim();
      setInquiryId(resolvedInquiryId);

      // 2. Client Name
      const fName = l.firstName || raw.First_Name || '';
      const lName = l.lastName || raw.Last_Name || '';
      const cName = l.leadName || raw.Full_Name || [fName, lName].filter(Boolean).join(' ') || 'Valued Guest';
      setFirstName(fName);
      setLastName(lName);
      setFullName(cName);

      // 3. Email & Mobile
      const cEmail = l.email || raw.Email || '';
      const cMobile = l.mobile || raw.Mobile || raw.Phone || '';
      setEmail(cEmail);
      setMobile(cMobile);

      // 4. Departure City & Destination
      const depCity = raw.Departure_City || l.city || raw.City || '';
      setDepartureCity(depCity);

      const dest = raw.Destinations || raw.Destination || raw.Destination_Location || raw.Destination_State;
      if (dest) {
        setDestination(dest);
      } else if (l.destinations && String(l.destinations).toLowerCase() !== String(l.city || '').toLowerCase()) {
        setDestination(String(l.destinations));
      }

      if (l.destinationType || raw.Destination_Type) {
        setDestinationType(l.destinationType || raw.Destination_Type);
      }

      // 5. Travel Dates
      const startD = toDateInputValue(l.travelStartDate || raw.Preferred_Start_date || raw.Start_Date);
      if (startD) setStartDate(startD);

      const endD = toDateInputValue(l.travelEndDate || raw.Travel_End_Date || raw.End_Date);
      if (endD) setEndDate(endD);

      // 6. Days & Nights Count
      const daysCount = Number(l.noOfDays || raw.No_of_Days);
      if (daysCount > 0) {
        handleDaysCountChange(daysCount);
        const nightsCount = Number(l.noOfNights || raw.No_of_Nights) || (daysCount > 1 ? daysCount - 1 : 1);
        setNoOfNights(nightsCount);
      }

      // 7. Adults & Kids
      const adultCount = Number(l.adults ?? raw.Adults ?? raw.Number_Of_Guest ?? raw.Number_Of_Guests);
      if (!isNaN(adultCount) && adultCount > 0) {
        setAdults(adultCount);
      }

      const kidCount = Number(l.kids ?? raw.Kids ?? raw.Children ?? raw.Number_Of_Kids);
      if (!isNaN(kidCount) && kidCount >= 0) {
        setKids(kidCount);
      }

      // Extract child details if stored in Zoho CRM
      const fetchedKidsDetails: ChildDetail[] = [];
      const effectiveKids = kidCount > 0 ? kidCount : 0;
      for (let c = 1; c <= Math.max(effectiveKids, 10); c++) {
        const rawAge = raw[`Child_${c}_Age`];
        const rawBed = raw[`Child_${c}_Bed_Preference`] || raw[`Child_${c}_Bed_Preferences`];
        if ((rawAge !== undefined && rawAge !== null && rawAge !== '') || rawBed) {
          let bedPref: 'With Bed' | 'Without Bed' | 'Crib' = 'Without Bed';
          const bedStr = String(rawBed || '').toLowerCase();
          if (bedStr.includes('with') || bedStr.includes('extra')) {
            bedPref = 'With Bed';
          } else if (bedStr.includes('crib') || bedStr.includes('cot')) {
            bedPref = 'Crib';
          } else {
            bedPref = 'Without Bed';
          }
          fetchedKidsDetails.push({
            childNumber: c,
            age: rawAge !== undefined && rawAge !== null ? String(rawAge) : '',
            bedPreference: bedPref
          });
        }
      }
      if (fetchedKidsDetails.length > 0) {
        setKidsDetails(fetchedKidsDetails);
        if (kidCount === 0) setKids(fetchedKidsDetails.length);
      } else if (effectiveKids > 0) {
        setKidsDetails(Array.from({ length: effectiveKids }, (_, i) => ({
          childNumber: i + 1,
          age: '',
          bedPreference: 'Without Bed'
        })));
      } else {
        setKidsDetails([]);
      }

      // Helper to safely extract string from Zoho lookup object or string
      const toSafeStr = (val: any, fallback = ''): string => {
        if (val === null || val === undefined) return fallback;
        if (typeof val === 'object') return val.name || val.label || val.value || fallback;
        return String(val);
      };

      // 8. Rooms & Sharing & Style
      if (raw.Rooms_Count) {
        const rc = Number(raw.Rooms_Count);
        if (!isNaN(rc) && rc > 0) setRoomsCount(rc);
      }
      const rawSharing = toSafeStr(raw.Sharing_Type || l.sharingType);
      if (rawSharing) {
        setSharingType(rawSharing);
      }
      const rawStyle = toSafeStr(raw.Travel_Style || l.travelStyle);
      if (rawStyle) {
        setTravelStyle(rawStyle);
      }

      // 9. Vehicle & Meal Plan
      const rawVeh = toSafeStr(raw.Vehicle_Type || raw.Vehicle || (l.vehicleType && l.vehicleType !== 'AC Vehicle' ? l.vehicleType : ''));
      if (rawVeh) {
        setVehicleType(rawVeh);
      }
      const rawMeal = toSafeStr(raw.Meal_Plan || l.mealPlan);
      if (rawMeal) {
        setMealPlan(rawMeal);
      }

      // 10. Hotel Category (Package Category)
      const hotelCat = toSafeStr(raw.Hotel_Category || raw.Hotel_1_Category || (l.preferredRoomCategory && l.preferredRoomCategory !== 'Standard' ? l.preferredRoomCategory : ''));
      if (hotelCat) {
        handleMasterHotelCategoryChange(hotelCat);
      }

      // 11. Costing & Quotation
      const finalQuote = raw.Final_Quotation_Amount ?? l.finalQuotationAmount;
      if (finalQuote !== undefined && finalQuote !== null && Number(finalQuote) > 0) {
        setFinalQuotation(String(finalQuote));
      } else if (l.calculatedPricing?.finalQuotation) {
        setFinalQuotation(String(l.calculatedPricing.finalQuotation));
      }
      const adultPrice = raw.Per_Adult_Cost ?? l.perAdultPrice;
      if (adultPrice !== undefined && adultPrice !== null && Number(adultPrice) > 0) {
        setPerAdultPrice(String(adultPrice));
      } else if (l.calculatedPricing?.perAdultCost) {
        setPerAdultPrice(String(l.calculatedPricing.perAdultCost));
      }
      const kidPrice = raw.Per_Child_Cost ?? l.perKidPrice;
      if (kidPrice !== undefined && kidPrice !== null && Number(kidPrice) > 0) {
        setPerKidPrice(String(kidPrice));
      } else if (l.calculatedPricing?.perChildCost && effectiveKids > 0) {
        setPerKidPrice(String(l.calculatedPricing.perChildCost));
      }
      if (l.calculatedPricing?.finalQuotation) {
        setBaseQuotation(String(l.calculatedPricing.finalQuotation));
      }
      if (raw.Advance_Amount_Paid !== undefined && raw.Advance_Amount_Paid !== null && Number(raw.Advance_Amount_Paid) > 0) {
        setAdvanceAmount(String(raw.Advance_Amount_Paid));
      }
      if (raw.Balance_Pending_Amount !== undefined && raw.Balance_Pending_Amount !== null && Number(raw.Balance_Pending_Amount) > 0) {
        setBalanceAmount(String(raw.Balance_Pending_Amount));
      }

      // 12. Special Requirements
      if (raw.Specific_Requirements || raw.Description) {
        setSpecialRequirements(raw.Specific_Requirements || raw.Description || '');
      }

      // 13. Hotels if populated in Zoho Lead
      if (Array.isArray(l.hotels) && l.hotels.length > 0) {
        const mappedHotels = l.hotels.map((h: any, idx: number) => ({
          index: idx + 1,
          hotelName: h.hotelName || '',
          city: h.city || '',
          nights: Number(h.nights) || 1,
          roomCategory: 'Deluxe Room',
          category: hotelCat || masterHotelCategory || 'Deluxe',
          stayDates: h.stayDates || ''
        }));
        setHotels(mappedHotels);
      }

      // 14. Day Activities (Subform: Activities_and_Experiences_1)
      if (Array.isArray(l.dayActivities) && l.dayActivities.length > 0) {
        const mappedRows: TableDayRow[] = l.dayActivities.map((act: any, idx: number) => {
          const exps: string[] = ['', '', '', ''];
          const descs: string[] = ['', '', '', ''];
          const costs: number[] = [0, 0, 0, 0];
          (act.experiences || []).forEach((e: any, eIdx: number) => {
            if (eIdx < 4) {
              const expName = (e.name || '').trim();
              exps[eIdx] = expName;
              let d = String(e.description || e.subTitle || '').trim();
              let cost = Number(e.ppCost) || 0;
              if (expName) {
                const found = findExperienceInCatalogs(expName, act.city || act.city2);
                if (!d) {
                  d = found?.description || found?.templateDescription || '';
                }
                if (!cost) {
                  cost = Number(found?.ppCost) || 0;
                }
              }
              descs[eIdx] = d;
              costs[eIdx] = cost;
            }
          });
          return {
            dayNumber: act.dayNumber || idx + 1,
            dayText: act.dayText || `Day ${idx + 1}`,
            guidedTour: !!act.guidedTour,
            city: act.city || '',
            city2: act.city2 || '',
            enRouteExperiences: act.enRouteExperiences ? [act.enRouteExperiences] : [''],
            experiences: exps,
            descriptions: descs,
            experienceCosts: costs,
            optionalExperiences: ['', ''],
            optionalDescriptions: ['', ''],
            optionalExperienceCosts: [0, 0]
          };
        });
        setDayRows(mappedRows);
        setNoOfDays(mappedRows.length);
        setNoOfNights(mappedRows.length > 1 ? mappedRows.length - 1 : 1);

        // If specific hotels were not populated in lead, auto-derive from City 2 of day activities
        const hasSpecificHotels = Array.isArray(l.hotels) && l.hotels.length > 0 && l.hotels.some((h: any) => (h.hotelName && h.hotelName !== 'Hotel') || h.city);
        if (!hasSpecificHotels) {
          setIsHotelsManuallyCustomized(false);
          const derivedHotels = deriveHotelsFromDayRows(mappedRows, l.noOfNights || (mappedRows.length > 1 ? mappedRows.length - 1 : 1), hotelCat || masterHotelCategory);
          if (derivedHotels.length > 0) {
            setHotels(derivedHotels);
          }
        }
      }

      const syncSummary = [
        cName !== 'Valued Guest' ? cName : null,
        resolvedInquiryId,
        cMobile || null,
        cEmail || null
      ].filter(Boolean).join(' • ');

      setZohoSyncMsg(`✓ Synced: ${syncSummary}`);
    } catch (e: any) {
      setZohoSyncMsg(`⚠ ${e.message}`);
    } finally {
      setFetchingZoho(false);
    }
  };

  // Fetch Master Data directly from Zoho CRM Custom Modules (Activities_and_Experiences, Hotel, Vehicles)
  const handleFetchZohoMasterData = async () => {
    setLoadingZohoMaster(true);
    setZohoMasterError(null);
    try {
      const res = await fetch(`/api/zoho/master-data?_t=${Date.now()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch Zoho master data');

      if (Array.isArray(data.destinations) && data.destinations.length > 0) {
        setSheetDestinations(data.destinations);
      }
      if (data.citiesByDestination) {
        setSheetCitiesByDest(data.citiesByDestination);
      }
      if (data.experiencesByCity) {
        setSheetExpByCity(data.experiencesByCity);
      }
      if (data.hotelsByCity) {
        setSheetHotelsByCity(data.hotelsByCity);
      }
      if (Array.isArray(data.vehicles)) {
        setZohoVehicles(data.vehicles);
        if (data.vehicles.length > 0 && (!vehicleType || vehicleType === 'AC Innova Crysta')) {
          setVehicleType(data.vehicles[0].name);
        }
      }
      if (data.stats) {
        setZohoMasterStats(data.stats);
      }
      setDataSource('zoho');
    } catch (err: any) {
      console.error('Zoho master data fetch error:', err);
      setZohoMasterError(err.message || 'Error fetching Zoho CRM modules data');
    } finally {
      setLoadingZohoMaster(false);
    }
  };

  // Fetch Sheet Data (Fallback / Alternate mode)
  const handleFetchSheetData = async (overrideUrl?: string) => {
    const urlToUse = (overrideUrl || sheetUrl).trim();
    if (!urlToUse) {
      setSheetError('Please enter a valid Google Sheet URL.');
      return;
    }
    setConnectingSheet(true);
    setSheetError(null);
    setSheetSuccessMsg(null);

    try {
      const res = await fetch(`/api/sheet/fetch?sheetUrl=${encodeURIComponent(urlToUse)}&_t=${Date.now()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch sheet.');

      if (data.allDestinations) setSheetDestinations(data.allDestinations);
      if (data.citiesByDestination) setSheetCitiesByDest(data.citiesByDestination);
      if (data.experiencesByCity) setSheetExpByCity(data.experiencesByCity);
      if (data.hotelsByCity) setSheetHotelsByCity(data.hotelsByCity);
      if (data.packages) setSheetPackages(data.packages);

      const totalExp = Object.values(data.experiencesByCity || {}).reduce((acc: number, arr: any) => acc + (arr?.length || 0), 0);
      const citiesCount = Object.keys(data.experiencesByCity || {}).length;

      setSheetSuccessMsg(`✓ Connected to Activity Sheet! Loaded ${totalExp} Experiences across ${citiesCount} Cities.`);
      setDataSource('sheet');
    } catch (err: any) {
      setSheetError(err.message || 'Error importing sheet data.');
    } finally {
      setConnectingSheet(false);
    }
  };

  // Auto connect to Zoho CRM Master Modules on mount & load Zoho fixed itineraries list
  useEffect(() => {
    handleFetchZohoMasterData();

    async function loadZohoFixedTemplates() {
      try {
        const res = await fetch('/api/zoho/fixed-itineraries');
        const data = await res.json();
        if (data.success && Array.isArray(data.itineraries)) {
          setZohoFixedItineraries(data.itineraries);
        }
      } catch (err) {
        console.warn('Failed to load Zoho fixed itineraries list:', err);
      }
    }
    loadZohoFixedTemplates();
  }, []);

  // Apply Zoho Fixed Itinerary Template into Grid
  const handleApplyZohoFixedItinerary = async (idToUse?: string) => {
    const id = idToUse || selectedFixedItineraryId;
    if (!id) return;
    setLoadingZohoFixed(true);
    setZohoFixedMsg(null);
    try {
      const res = await fetch(`/api/zoho/fixed-itineraries?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.itinerary) {
        throw new Error(data.error || 'Failed to fetch itinerary from Zoho CRM');
      }
      const itin = data.itinerary;
      if (itin.destination) {
        setDestination(itin.destination);
      }
      if (itin.destinationType) {
        setDestinationType(itin.destinationType);
      }
      if (itin.noOfDays) {
        setNoOfDays(itin.noOfDays);
      }
      if (itin.noOfNights) {
        setNoOfNights(itin.noOfNights);
      }

      if (Array.isArray(itin.dayRows) && itin.dayRows.length > 0) {
        // Auto-match activity per-person cost and auto-fill descriptions from catalog if available
        const updatedRows = itin.dayRows.map((r: any) => {
          const cClean = (r.city || itin.destination || destination).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const cityLookup = sheetExpByCity[cClean] || [];
          const exps = Array.isArray(r.experiences) && r.experiences.length >= 4
            ? r.experiences
            : [...(Array.isArray(r.experiences) ? r.experiences : []), '', '', '', ''].slice(0, 4);
          const descs = Array.isArray(r.descriptions) && r.descriptions.length >= 4
            ? r.descriptions
            : [...(Array.isArray(r.descriptions) ? r.descriptions : []), '', '', '', ''].slice(0, 4);
          const optExps = Array.isArray(r.optionalExperiences) && r.optionalExperiences.length >= 2
            ? r.optionalExperiences
            : [...(Array.isArray(r.optionalExperiences) ? r.optionalExperiences : []), '', ''].slice(0, 2);
          const optDescs = Array.isArray(r.optionalDescriptions) && r.optionalDescriptions.length >= 2
            ? r.optionalDescriptions
            : [...(Array.isArray(r.optionalDescriptions) ? r.optionalDescriptions : []), '', ''].slice(0, 2);

          const rawEnRoute = r.enRouteExperiences || r.enRouteSpots;
          const enRouteExperiences = Array.isArray(rawEnRoute) && rawEnRoute.length > 0 ? rawEnRoute : [''];

          // Auto-resolve costs
          const costs = exps.map((expName: string) => {
            if (!expName) return 0;
            const found = findExperienceInCatalogs(expName, r.city || r.city2);
            return found?.ppCost || 0;
          });

          // Auto-resolve descriptions from catalog if missing
          const resolvedDescs = exps.map((expName: string, i: number) => {
            if (!expName) return '';
            if (descs[i] && descs[i].trim()) return descs[i].trim();
            const found = findExperienceInCatalogs(expName, r.city || r.city2);
            return found?.description || found?.templateDescription || '';
          });

          const resolvedOptDescs = optExps.map((optName: string, i: number) => {
            if (!optName) return '';
            if (optDescs[i] && optDescs[i].trim()) return optDescs[i].trim();
            const found = findExperienceInCatalogs(optName, r.city || r.city2);
            return found?.description || found?.templateDescription || '';
          });

          return {
            dayNumber: r.dayNumber || 1,
            dayText: r.dayText || `Day ${r.dayNumber || 1}`,
            guidedTour: Boolean(r.guidedTour),
            city: r.city || '',
            city2: r.city2 || '',
            enRouteExperiences,
            experiences: exps,
            descriptions: resolvedDescs,
            optionalExperiences: optExps,
            optionalDescriptions: resolvedOptDescs,
            experienceCosts: costs,
            optionalExperienceCosts: [0, 0]
          };
        });
        setDayRows(updatedRows);

        // Also suggest hotel stays according to City 2 in the itinerary
        setIsHotelsManuallyCustomized(false);
        const derivedHotels = deriveHotelsFromDayRows(updatedRows, itin.noOfNights || noOfNights, masterHotelCategory);
        if (derivedHotels.length > 0) {
          setHotels(derivedHotels);
        }
      }

      setZohoFixedMsg({
        type: 'success',
        text: `✓ Loaded "${itin.name}" (${itin.dayRows?.length || itin.noOfDays} Days) directly into the grid!`
      });
    } catch (err: any) {
      setZohoFixedMsg({
        type: 'error',
        text: `⚠ ${err.message || 'Error loading fixed itinerary'}`
      });
    } finally {
      setLoadingZohoFixed(false);
    }
  };

  // Sync dayRows count when noOfDays changes
  const handleDaysCountChange = (newCount: number) => {
    const count = Math.max(1, newCount);
    setNoOfDays(count);
    setNoOfNights(count > 1 ? count - 1 : 1);

    setDayRows(prev => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        const added: TableDayRow[] = [];
        const defaultCity = availableCitiesForDestination[0] || destination;
        for (let i = prev.length + 1; i <= count; i++) {
          added.push(createInitialDayRow(i, defaultCity));
        }
        return [...prev, ...added];
      }
      return prev.slice(0, count);
    });
  };

  // Handle Kids count change & automatically open child details modal when kids > 0
  const handleKidsCountChange = (newCount: number) => {
    const count = Math.max(0, newCount);
    setKids(count);

    let updatedKids: ChildDetail[] = [];
    if (count > 0) {
      setKidsDetails(prev => {
        const updated: ChildDetail[] = [];
        for (let i = 1; i <= count; i++) {
          const existing = prev.find(k => k.childNumber === i);
          if (existing) {
            updated.push(existing);
          } else {
            updated.push({
              childNumber: i,
              age: '',
              bedPreference: 'Without Bed'
            });
          }
        }
        updatedKids = updated;
        return updated;
      });
      setIsKidsModalOpen(true);
    } else {
      setKidsDetails([]);
      setIsKidsModalOpen(false);
    }

    if (!isRoomsManuallySet) {
      setRoomsCount(calculateRecommendedRooms(adults, count, sharingType, updatedKids));
    }
  };

  const updateChildDetail = (childNumber: number, field: 'age' | 'bedPreference', value: any) => {
    setKidsDetails(prev => {
      const updated = prev.map(c => (c.childNumber === childNumber ? { ...c, [field]: value } : c));
      if (!isRoomsManuallySet && field === 'bedPreference') {
        setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, updated));
      }
      return updated;
    });
  };

  const setAllBedPreferences = (pref: 'With Bed' | 'Without Bed' | 'Crib') => {
    setKidsDetails(prev => {
      const updated = prev.map(c => ({ ...c, bedPreference: pref }));
      if (!isRoomsManuallySet) {
        setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, updated));
      }
      return updated;
    });
  };

  // One-click Auto-fill descriptions for any experiences in the grid that are missing descriptions
  const handleAutoFillAllDescriptions = () => {
    setDayRows(prev =>
      prev.map(row => {
        const updatedDescs = [...row.descriptions];
        row.experiences.forEach((expName, idx) => {
          if (expName && (!updatedDescs[idx] || !updatedDescs[idx].trim())) {
            const found = findExperienceInCatalogs(expName, row.city || row.city2);
            if (found?.description || found?.templateDescription) {
              updatedDescs[idx] = found.description || found.templateDescription;
            }
          }
        });

        const updatedOptDescs = [...row.optionalDescriptions];
        row.optionalExperiences.forEach((optName, idx) => {
          if (optName && (!updatedOptDescs[idx] || !updatedOptDescs[idx].trim())) {
            const found = findExperienceInCatalogs(optName, row.city || row.city2);
            if (found?.description || found?.templateDescription) {
              updatedOptDescs[idx] = found.description || found.templateDescription;
            }
          }
        });

        return {
          ...row,
          descriptions: updatedDescs,
          optionalDescriptions: updatedOptDescs
        };
      })
    );
  };

  // Apply live calculated quote into form inputs
  const handleApplyCalculatedQuote = () => {
    setIsQuoteManuallyEdited(false);
    setBaseQuotation(String(quotationCalculations.calculatedBase));
    setFinalQuotation(String(quotationCalculations.calculatedFinalQuote));
    setPerAdultPrice(String(quotationCalculations.calculatedPerAdult));
    if (kids > 0) {
      setPerKidPrice(String(quotationCalculations.calculatedPerKid));
    } else {
      setPerKidPrice('');
    }
    const adv = Number(advanceAmount) || 0;
    setBalanceAmount(String(Math.max(0, quotationCalculations.calculatedFinalQuote - adv)));
  };

  // Select Experience (Auto-fills Description and records ppCost from sheet)
  const handleSelectExperience = (dayIdx: number, expIdx: number, expName: string, meta?: any) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const exps = [...row.experiences];
      const descs = [...row.descriptions];
      const costs = [...row.experienceCosts];

      exps[expIdx] = expName;
      if (meta?.description) {
        descs[expIdx] = meta.description;
      } else {
        const found = findExperienceInCatalogs(expName, row.city || row.city2);
        if (found?.description || found?.templateDescription) {
          descs[expIdx] = found.description || found.templateDescription;
        }
      }
      costs[expIdx] = Number(meta?.ppCost) || 0;
      if (meta?.guidedTour) {
        row.guidedTour = true;
      }

      row.experiences = exps;
      row.descriptions = descs;
      row.experienceCosts = costs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Select Optional Experience
  const handleSelectOptionalExperience = (dayIdx: number, optIdx: number, optName: string, meta?: any) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const opts = [...row.optionalExperiences];
      const descs = [...row.optionalDescriptions];
      const costs = [...row.optionalExperienceCosts];

      opts[optIdx] = optName;
      if (meta?.description) {
        descs[optIdx] = meta.description;
      } else {
        const found = findExperienceInCatalogs(optName, row.city || row.city2);
        if (found?.description || found?.templateDescription) {
          descs[optIdx] = found.description || found.templateDescription;
        }
      }
      costs[optIdx] = Number(meta?.ppCost) || 0;

      row.optionalExperiences = opts;
      row.optionalDescriptions = descs;
      row.optionalExperienceCosts = costs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Update a single field on a day row
  const updateDayField = (dayIdx: number, field: keyof TableDayRow, value: any) => {
    setDayRows(prev => {
      const updated = [...prev];
      updated[dayIdx] = { ...updated[dayIdx], [field]: value };
      return updated;
    });
  };

  // Add a new day row to the itinerary
  const addDay = () => {
    const nextDayNum = dayRows.length + 1;
    const defaultCity = availableCitiesForDestination[0] || destination;
    setDayRows(prev => [...prev, createInitialDayRow(nextDayNum, defaultCity)]);
    setNoOfDays(nextDayNum);
    setNoOfNights(nextDayNum > 1 ? nextDayNum - 1 : 1);
  };

  // Remove a day row from the itinerary
  const removeDay = (dayIdx: number) => {
    if (dayRows.length <= 1) return;
    setDayRows(prev => {
      const filtered = prev.filter((_, idx) => idx !== dayIdx);
      return filtered.map((row, idx) => ({
        ...row,
        dayNumber: idx + 1,
        dayText: `Day ${idx + 1}`
      }));
    });
    const newCount = dayRows.length - 1;
    setNoOfDays(newCount);
    setNoOfNights(newCount > 1 ? newCount - 1 : 1);
  };

  // Add multiple en-route spots for a day
  const addEnRouteSpot = (dayIdx: number) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      row.enRouteExperiences = [...row.enRouteExperiences, ''];
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateEnRouteSpot = (dayIdx: number, spotIdx: number, val: string) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const spots = [...row.enRouteExperiences];
      spots[spotIdx] = val;
      row.enRouteExperiences = spots;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Add extra experience spot beyond 4
  const addExtraExperienceSpot = (dayIdx: number) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      row.experiences = [...row.experiences, ''];
      row.descriptions = [...row.descriptions, ''];
      row.experienceCosts = [...row.experienceCosts, 0];
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateDescriptionText = (dayIdx: number, descIdx: number, val: string) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const descs = [...row.descriptions];
      descs[descIdx] = val;
      row.descriptions = descs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateOptionalDescriptionText = (dayIdx: number, descIdx: number, val: string) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const descs = [...row.optionalDescriptions];
      descs[descIdx] = val;
      row.optionalDescriptions = descs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Handle Master Hotel Category Change (updates all hotel rows)
  const handleMasterHotelCategoryChange = (cat: string) => {
    setMasterHotelCategory(cat);
    setHotels(prev =>
      prev.map(h => ({
        ...h,
        category: cat
      }))
    );
  };

  // Hotels helpers
  const addHotel = () => {
    if (hotels.length >= 6) return;
    setIsHotelsManuallyCustomized(true);
    const defaultCity = availableCitiesForDestination[0] || destination;
    setHotels([
      ...hotels,
      {
        index: hotels.length + 1,
        hotelName: '',
        city: defaultCity,
        nights: 1,
        roomCategory: 'Deluxe Room',
        category: masterHotelCategory || 'Deluxe',
        stayDates: ''
      }
    ]);
  };

  const removeHotel = (index: number) => {
    setIsHotelsManuallyCustomized(true);
    const filtered = hotels.filter((_, i) => i !== index);
    setHotels(filtered.map((h, i) => ({ ...h, index: i + 1 })));
  };

  const updateHotel = (index: number, field: keyof HotelItem, value: any, meta?: any) => {
    if (field === 'nights' || field === 'city') {
      setIsHotelsManuallyCustomized(true);
    }
    setHotels(prev => {
      const updated = [...prev];
      const h = { ...updated[index], [field]: value };
      if (field === 'hotelName' && meta?.rooms && Array.isArray(meta.rooms) && meta.rooms.length > 0) {
        h.roomCategory = meta.rooms[0].roomCategory || h.roomCategory;
      }
      updated[index] = h;
      return updated;
    });
  };

  // Margin Calculation
  const handleMarginChange = (val: string) => {
    setMarginPercent(val);
    const base = Number(baseQuotation) || 0;
    if (!val || isNaN(Number(val)) || base <= 0) {
      setFinalQuotation(baseQuotation);
      return;
    }
    const finalVal = Math.round(base * (1 + Number(val) / 100));
    setFinalQuotation(String(finalVal));
  };

  // Generate Itinerary
  const handleGenerateItinerary = async () => {
    if (!destination.trim()) {
      setGenError('Destination is required.');
      return;
    }
    setGenerating(true);
    setGenError(null);
    setGenSuccess(null);

    // Prepare day activities with rich descriptions and cost details
    const preparedDayActivities = dayRows.map(d => {
      const allExperiences: any[] = [];
      (d.experiences || []).forEach((expName, idx) => {
        if (expName && expName.trim()) {
          allExperiences.push({
            name: expName.trim(),
            description: (d.descriptions[idx] || '').trim(),
            ppCost: d.experienceCosts[idx] || 0,
            guidedTour: d.guidedTour
          });
        }
      });

      const allOptional: any[] = [];
      (d.optionalExperiences || []).forEach((optName, idx) => {
        if (optName && optName.trim()) {
          allOptional.push({
            name: optName.trim(),
            description: (d.optionalDescriptions[idx] || '').trim(),
            ppCost: d.optionalExperienceCosts[idx] || 0
          });
        }
      });

      return {
        dayNumber: d.dayNumber,
        dayText: d.dayText,
        city: d.city,
        city2: d.city2 || undefined,
        guidedTour: d.guidedTour,
        enRouteExperiences: d.enRouteExperiences.filter(Boolean).join(', ') || undefined,
        experiences: allExperiences,
        optionalExperiences: allOptional
      };
    });

    const payload = {
      inquiryId: inquiryId || `GS-${Date.now().toString().slice(-6)}`,
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
      noOfDays: Number(noOfDays) || dayRows.length,
      noOfNights: Number(noOfNights) || (dayRows.length > 1 ? dayRows.length - 1 : 1),
      adults: Number(adults) || 2,
      kids: Number(kids) || 0,
      kidsDetails: kidsDetails.slice(0, Number(kids) || 0),
      childrenDetails: kidsDetails.slice(0, Number(kids) || 0),
      roomsCount: Number(roomsCount) || 1,
      sharingType,
      travelStyle,
      tripType: 'Customised Trip',
      vehicleType,
      mealPlan,
      hotels: hotels.filter(h => h.hotelName.trim().length > 0),
      dayActivities: preparedDayActivities,
      optionNumber: selectedOption,
      baseQuotationAmount: baseQuotation ? Number(baseQuotation) : undefined,
      marginPercentage: marginPercent ? Number(marginPercent) : undefined,
      finalQuotationAmount: finalQuotation ? Number(finalQuotation) : undefined,
      perAdultPrice: perAdultPrice ? Number(perAdultPrice) : undefined,
      perKidPrice: perKidPrice ? Number(perKidPrice) : undefined,
      advanceAmountPaid: advanceAmount ? Number(advanceAmount) : undefined,
      balancePendingAmount: balanceAmount ? Number(balanceAmount) : undefined,
      specialRequirements
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
    } catch (err: any) {
      setGenError(err.message || 'Error occurred while generating itinerary.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500/20"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <style>{`
        /* Force standard, clean, highly readable modern sans-serif across all elements */
        html, body, button, input, select, textarea, table, th, td, p, span, h1, h2, h3, h4, h5, h6, label, div {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        /* Completely remove up/down stepper spin buttons across all browsers */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }
        input[type="number"],
        input {
          -moz-appearance: textfield !important;
        }
      `}</style>
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-300 text-orange-700 text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs">
            <Layers className="w-4 h-4 text-orange-600" />
            Compact Grid Subform • Live Activities Cost Per Person
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Sheet Itinerary Subform Builder
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Manage 10-15 day itineraries in a compact spreadsheet subform. City &amp; experiences filter automatically, descriptions load from the sheet, and activity costs calculate per person.
          </p>
        </div>

        {/* SECTION 1: TRAVELER & CLIENT DETAILS */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                1. Traveler &amp; Client Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Client details are kept separate. You can enter manually or sync from Zoho.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-300">
              <Input
                type="text"
                placeholder="Zoho Inquiry ID..."
                value={zohoInquiryInput}
                onChange={e => setZohoInquiryInput(e.target.value)}
                className="h-8 bg-white border border-slate-400 text-xs w-40 text-slate-900 placeholder:text-slate-500 font-medium focus-visible:ring-orange-500"
              />
              <Button
                onClick={handleFetchFromZoho}
                disabled={fetchingZoho}
                variant="outline"
                size="sm"
                className="h-8 text-xs border border-slate-400 text-slate-800 hover:bg-slate-100 hover:text-slate-950 rounded-lg shrink-0 font-bold"
              >
                {fetchingZoho ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Sync from Zoho'}
              </Button>
            </div>
          </div>

          {zohoSyncMsg && (
            <div className="mb-4 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 border border-blue-300 text-blue-800">
              {zohoSyncMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Inquiry ID</label>
              <Input
                value={inquiryId}
                onChange={e => setInquiryId(e.target.value)}
                placeholder="e.g. INQ-1042"
                className="bg-slate-100 border border-slate-400 text-xs h-10 font-mono font-bold text-orange-600 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Full Client Name</label>
              <Input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Jigna Shah"
                className="bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Mobile / WhatsApp</label>
              <Input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Departure City</label>
              <Input
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
                placeholder="e.g. Mumbai / Delhi"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Number of Days / Nights</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={noOfDays}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                    handleDaysCountChange(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-orange-600 focus-visible:ring-orange-500"
                  title="Days"
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={noOfNights}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                    setNoOfNights(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
                  title="Nights"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Adults / Kids</label>
                {kids > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsKidsModalOpen(true)}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    👶 {kids} {kids === 1 ? 'Child' : 'Kids'} Details
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={adults}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 0;
                    setAdults(val);
                    if (!isRoomsManuallySet) {
                      setRoomsCount(calculateRecommendedRooms(val, kids, sharingType, kidsDetails));
                    }
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-emerald-800 focus-visible:ring-orange-500"
                  title="Adults"
                  placeholder="2"
                />
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={kids}
                    onChange={e => {
                      const val = Number(e.target.value.replace(/\D/g, '')) || 0;
                      handleKidsCountChange(val);
                    }}
                    className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500 pr-14"
                    title="Kids"
                    placeholder="0"
                  />
                  {kids > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsKidsModalOpen(true)}
                      title="Edit Kids Age & Bed Preferences"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-orange-100 border border-orange-300 text-orange-800 font-bold hover:bg-orange-200 transition-colors"
                    >
                      Age &amp; Bed
                    </button>
                  )}
                </div>
              </div>
              {kids > 0 && kidsDetails.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {kidsDetails.slice(0, kids).map(k => (
                    <span
                      key={k.childNumber}
                      onClick={() => setIsKidsModalOpen(true)}
                      className="cursor-pointer text-[10px] px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 font-medium hover:bg-orange-100 transition-colors"
                      title="Click to edit details"
                    >
                      C{k.childNumber}: {k.age ? `${k.age}y` : 'Age?'} • {k.bedPreference === 'With Bed' ? 'Extra Bed' : k.bedPreference === 'Crib' ? 'Crib' : 'No Bed'}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Row 3: Additional Lead Details: Email, Rooms, Sharing, Style */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. client@example.com"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Rooms Count</label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isRoomsManuallySet ? 'Manual' : 'Auto-Calculated'}
                </span>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={roomsCount}
                onChange={e => {
                  const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                  setRoomsCount(val);
                  setIsRoomsManuallySet(true);
                }}
                className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
              />
              {isRoomsManuallySet && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRoomsManuallySet(false);
                    setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, kidsDetails));
                  }}
                  className="text-[10px] text-orange-600 hover:underline mt-0.5 block font-semibold"
                >
                  ↺ Reset to Auto ({calculateRecommendedRooms(adults, kids, sharingType, kidsDetails)} Rooms)
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Sharing Type</label>
              <select
                value={sharingType}
                onChange={e => {
                  const s = e.target.value;
                  setSharingType(s);
                  if (!isRoomsManuallySet) {
                    setRoomsCount(calculateRecommendedRooms(adults, kids, s, kidsDetails));
                  }
                }}
                className="w-full bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="Double Sharing">Double Sharing (2 Adults/Room)</option>
                <option value="Triple Sharing">Triple Sharing (3 Adults/Room)</option>
                <option value="Quad Sharing">Quad Sharing (4 Pax/Room)</option>
                <option value="Single Sharing">Single Sharing (1 Adult/Room)</option>
                <option value="Multiple Rooms">Multiple Rooms</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel Style</label>
              <select
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value)}
                className="w-full bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="Family Trip">Family Trip</option>
                <option value="Couples / Honeymoon">Couples / Honeymoon</option>
                <option value="Friends Group">Friends Group</option>
                <option value="Solo Traveler">Solo Traveler</option>
                <option value="Corporate / Group">Corporate / Group</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: MASTER DATA & LOOKUP SOURCES (ZOHO CRM / GOOGLE SHEET) */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                2. Master Data &amp; Lookups Catalog
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold uppercase">
                  {dataSource === 'zoho' ? 'Zoho CRM Live Modules' : 'Google Sheet Mode'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Activities, Hotels, Room Rates, and Vehicles are automatically fetched to power all subform dropdowns.
              </p>
            </div>

            {/* Source Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-300 rounded-xl self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setDataSource('zoho');
                  if (!zohoMasterStats) handleFetchZohoMasterData();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${dataSource === 'zoho'
                    ? 'bg-white text-orange-700 shadow-xs border border-orange-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Database className="w-3.5 h-3.5 text-orange-600" />
                Zoho CRM Modules (Live)
              </button>
              <button
                type="button"
                onClick={() => setDataSource('sheet')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${dataSource === 'sheet'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Google Sheet (URL)
              </button>
            </div>
          </div>

          {dataSource === 'zoho' ? (
            /* ZOHO CRM MASTER MODULES PANEL */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-orange-900 block">Activities &amp; Experiences</span>
                    <span className="text-lg font-extrabold text-orange-700 font-mono">
                      {zohoMasterStats?.activitiesCount ?? Object.values(sheetExpByCity).reduce((a, b) => a + (b?.length || 0), 0)}{' '}
                      <span className="text-xs font-normal text-slate-600">Records</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-200 text-orange-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block">Hotel &amp; Room Pricing</span>
                    <span className="text-lg font-extrabold text-amber-700 font-mono">
                      {zohoMasterStats?.hotelsCount ?? Object.values(sheetHotelsByCity).reduce((a, b) => a + (b?.length || 0), 0)}{' '}
                      <span className="text-xs font-normal text-slate-600">Properties</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">Vehicles &amp; Capacities</span>
                    <span className="text-lg font-extrabold text-emerald-700 font-mono">
                      {zohoVehicles.length || 5}{' '}
                      <span className="text-xs font-normal text-slate-600">Fleets</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>
                    Directly synced with Zoho CRM modules: <strong>Activities_and_Experiences</strong>, <strong>Hotel</strong>, and <strong>Vehicles</strong>.
                  </span>
                </div>

                <Button
                  onClick={handleFetchZohoMasterData}
                  disabled={loadingZohoMaster}
                  size="sm"
                  className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shrink-0 shadow-xs flex items-center justify-center gap-2"
                >
                  {loadingZohoMaster ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Syncing with Zoho...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh Zoho Master Data
                    </>
                  )}
                </Button>
              </div>

              {zohoMasterError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 font-semibold">
                  ⚠ {zohoMasterError}
                </div>
              )}
            </div>
          ) : (
            /* GOOGLE SHEET PANEL */
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                  value={sheetUrl}
                  onChange={e => setSheetUrl(e.target.value)}
                  className="bg-white border border-slate-400 text-slate-900 placeholder:text-slate-500 text-sm h-11 font-medium focus-visible:ring-emerald-500 rounded-xl"
                />
                <Button
                  onClick={() => handleFetchSheetData()}
                  disabled={connectingSheet}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shrink-0 shadow-sm transition-all flex items-center gap-2"
                >
                  {connectingSheet ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading Sheet Lookups...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Refresh Sheet Lookups
                    </>
                  )}
                </Button>
              </div>

              {sheetSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold mb-3">
                  {sheetSuccessMsg}
                </div>
              )}

              {sheetError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 mb-3 font-semibold">
                  {sheetError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: DESTINATION & HOTELS CONFIGURATION */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-300 pb-3">
              <Compass className="w-4 h-4 text-orange-600" />
              3. Destination &amp; Transport Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Destination (Lookup)
                </label>
                <LookupField
                  value={destination}
                  onChange={val => setDestination(val)}
                  options={destinationOptions}
                  placeholder="Select Destination..."
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Cities in Day Grid will filter based on this!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Hotel Category (All Hotels)
                </label>
                <select
                  value={masterHotelCategory}
                  onChange={e => handleMasterHotelCategoryChange(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-bold text-xs h-9 rounded-md px-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Deluxe">Deluxe</option>
                  <option value="Super Deluxe">Super Deluxe</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                  <option value="All">All Categories</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Auto-updates category for all hotels below!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Vehicle / Transport (Zoho CRM)</label>
                <LookupField
                  value={vehicleType}
                  onChange={val => setVehicleType(val)}
                  options={vehicleOptions}
                  placeholder="Select or type vehicle..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Meal Plan</label>
                <select
                  value={mealPlan}
                  onChange={e => setMealPlan(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-medium text-xs h-9 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Breakfast & Dinner">Breakfast &amp; Dinner (MAPAI)</option>
                  <option value="Breakfast Only">Breakfast Only (CP)</option>
                  <option value="All Meals">All Meals (APAI)</option>
                  <option value="Room Only">Room Only (EP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Destination Type</label>
                <select
                  value={destinationType}
                  onChange={e => setDestinationType(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-medium text-xs h-9 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="India">India (Domestic)</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: HOTELS 1 TO 6 */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-orange-600" />
                  4. Hotel Stays (Categorized by City 2 Night Stays)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hotel cities and night counts are auto-calculated directly from <strong>City 2</strong> (night stay destination) of each day. You can also customize them manually.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Sync from City 2 Button */}
                <Button
                  type="button"
                  onClick={() => {
                    setIsHotelsManuallyCustomized(false);
                    const derived = deriveHotelsFromDayRows(dayRows, noOfNights, masterHotelCategory);
                    if (derived.length > 0) setHotels(derived);
                  }}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-blue-400 text-blue-700 hover:bg-blue-50 bg-white rounded-xl flex items-center gap-1.5 font-bold shadow-2xs"
                  title="Re-calculate hotel cities and nights based on City 2 of the itinerary"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  Sync from City 2
                </Button>

                {/* Master Hotel Category Quick Selector */}
                <div className="flex items-center gap-2 bg-orange-50/90 border border-orange-300 px-3 py-1.5 rounded-xl shadow-2xs">
                  <span className="text-xs font-extrabold text-orange-950 whitespace-nowrap flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-orange-600" />
                    Category for All:
                  </span>
                  <select
                    value={masterHotelCategory}
                    onChange={e => handleMasterHotelCategoryChange(e.target.value)}
                    className="bg-white border border-orange-300 text-orange-900 font-extrabold text-xs h-8 rounded-lg px-2.5 shadow-2xs focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Deluxe">Deluxe</option>
                    <option value="Super Deluxe">Super Deluxe</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                    <option value="All">All Categories</option>
                  </select>
                </div>

                {hotels.length < 6 && (
                  <Button
                    onClick={addHotel}
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border border-orange-400 text-orange-700 hover:bg-orange-50 rounded-xl flex items-center gap-1.5 font-bold shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Hotel
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {hotels.map((h, idx) => (
                <div key={idx} className="p-4 bg-slate-50/70 border border-slate-300 rounded-xl relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-orange-700 flex items-center gap-1.5">
                      <Hotel className="w-3.5 h-3.5" />
                      Hotel #{idx + 1}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-extrabold">
                        {h.category || masterHotelCategory || 'Deluxe'}
                      </span>
                    </span>
                    {hotels.length > 1 && (
                      <button
                        onClick={() => removeHotel(idx)}
                        className="text-slate-500 hover:text-red-600 text-xs p-1"
                        title="Remove Hotel"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        City ({destination})
                      </label>
                      <LookupField
                        value={h.city}
                        onChange={val => updateHotel(idx, 'city', val)}
                        options={availableCitiesForDestination}
                        placeholder="Select City..."
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Hotel Category
                      </label>
                      <select
                        value={h.category || masterHotelCategory || 'Deluxe'}
                        onChange={e => updateHotel(idx, 'category', e.target.value)}
                        className="w-full bg-white border border-slate-400 text-slate-900 font-bold text-xs h-9 rounded-md px-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="Deluxe">Deluxe</option>
                        <option value="Super Deluxe">Super Deluxe</option>
                        <option value="Premium">Premium</option>
                        <option value="Luxury">Luxury</option>
                        <option value="All">All Categories</option>
                      </select>
                    </div>

                    <div className="lg:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Hotel / Property Name ({h.category || masterHotelCategory || 'Deluxe'})
                      </label>
                      <LookupField
                        value={h.hotelName}
                        onChange={(val, meta) => updateHotel(idx, 'hotelName', val, meta)}
                        options={getHotelsLookupForCity(h.city, h.category)}
                        placeholder={`Select ${h.category || masterHotelCategory} Hotel...`}
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Category</label>
                      <LookupField
                        value={h.roomCategory}
                        onChange={val => updateHotel(idx, 'roomCategory', val)}
                        options={getRoomCategoriesForHotel(h.hotelName, h.city)}
                        placeholder="Room Category..."
                      />
                    </div>

                    <div className="lg:col-span-1">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nights</label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={h.nights === 0 ? '' : h.nights}
                        onChange={e => {
                          const sanitized = e.target.value.replace(/\D/g, '');
                          updateHotel(idx, 'nights', sanitized === '' ? 1 : Number(sanitized));
                        }}
                        className="bg-white border border-slate-400 text-xs h-9 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ZOHO FIXED ITINERARY TEMPLATE LOADER */}
          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/90 border border-orange-300 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Load Pre-saved Itinerary from Zoho CRM
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 text-orange-950 font-extrabold uppercase">
                      Zoho Itineraries Module
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select a fixed itinerary to auto-populate all Days, Cities, Guided Tours, En-route spots, Experiences &amp; Descriptions directly into the grid!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <div className="flex flex-col gap-1">
                  <select
                    value={selectedFixedItineraryId}
                    onChange={e => setSelectedFixedItineraryId(e.target.value)}
                    className="bg-white border border-slate-400 text-slate-900 font-bold text-xs h-10 rounded-xl px-3 min-w-[300px] focus:outline-none focus:border-orange-500 shadow-xs"
                  >
                    <option value="">
                      {filteredZohoFixedItineraries.length > 0
                        ? `-- Select ${destination} Itinerary from Zoho (${filteredZohoFixedItineraries.length}) --`
                        : `-- No itineraries found for ${destination} --`}
                    </option>
                    {filteredZohoFixedItineraries.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.destination ? `(${item.destination})` : ''}
                      </option>
                    ))}
                  </select>

                  {/* Filter Status Badge & Toggle */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                    <span>
                      {showAllZohoFixedItineraries
                        ? `Showing all (${zohoFixedItineraries.length})`
                        : `Filtered for ${destination} (${filteredZohoFixedItineraries.length} of ${zohoFixedItineraries.length})`}
                    </span>
                    {zohoFixedItineraries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllZohoFixedItineraries(!showAllZohoFixedItineraries)}
                        className="text-orange-600 hover:text-orange-800 font-bold underline cursor-pointer ml-2"
                      >
                        {showAllZohoFixedItineraries ? `Filter strictly for ${destination}` : 'Show All'}
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleApplyZohoFixedItinerary()}
                  disabled={!selectedFixedItineraryId || loadingZohoFixed}
                  className="h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  {loadingZohoFixed ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Loading Itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Load Itinerary into Grid
                    </>
                  )}
                </Button>
              </div>
            </div>

            {zohoFixedMsg && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${zohoFixedMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-red-50 border-red-300 text-red-700'
                  }`}
              >
                {zohoFixedMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {zohoFixedMsg.text}
              </div>
            )}
          </div>

          {/* SECTION 5: DAY-WISE ITINERARY GRID SUBFORM (COMPACT SPREADSHEET VIEW) */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            {/* Top Bar with Live Per-Person Cost & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-slate-300 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  5. Day-wise Itinerary Grid (Subform Table View)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compact horizontal data-grid. Cities filter for <strong className="text-orange-600">{destination}</strong>. Selecting an experience auto-fills descriptions and per-person costs from the sheet!
                </p>
              </div>

              {/* Live Cost Calculation Badge & Quick Apply */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-emerald-50/80 border border-emerald-300 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-600 block font-bold">Activity Cost (Per Person):</span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono">
                      ₹{totalPerPersonActivityCost.toLocaleString('en-IN')} / pax
                    </span>
                  </div>
                  <div className="h-6 w-px bg-emerald-300" />
                  <div>
                    <span className="text-[10px] text-slate-600 block font-bold">Total for {adults} Adults:</span>
                    <span className="text-xs font-extrabold text-emerald-800 font-mono">
                      ₹{totalActivityCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  {totalActivityCost > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setBaseQuotation(String(totalActivityCost));
                        if (!marginPercent) setFinalQuotation(String(totalActivityCost));
                      }}
                      className="ml-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-700 px-2.5 py-1 rounded font-bold transition-colors shadow-2xs"
                      title="Apply this activity cost as the Base Quotation"
                    >
                      Apply to Quote
                    </button>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleAutoFillAllDescriptions}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-blue-400 text-blue-700 hover:bg-blue-50 bg-white font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                  title="Auto-fill descriptions for all selected experiences from catalog"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Auto-Fill Descriptions
                </Button>

                <Button
                  onClick={addDay}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-orange-400 text-orange-700 hover:bg-orange-50 bg-white font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Day
                </Button>
              </div>
            </div>

            {/* HORIZONTAL DATA-GRID TABLE */}
            <div className="overflow-x-auto rounded-xl border-2 border-slate-400 bg-white shadow-sm">
              <table className="w-full border-collapse text-left text-xs min-w-[2800px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-400 text-xs font-bold uppercase tracking-wider">
                    {/* 1. Days (Sticky Left Column) */}
                    <th className="sticky left-0 z-20 bg-slate-200 px-3.5 py-3 w-28 border-r-2 border-slate-400 text-slate-950 font-extrabold shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)]">
                      Days
                    </th>
                    {/* 2. Guided Tour */}
                    <th className="px-3 py-3 w-28 text-center border-r border-slate-300 text-slate-800 font-bold">
                      Guided Tour
                    </th>
                    {/* 3. City */}
                    <th className="px-3 py-3 w-44 border-r border-slate-300 text-slate-800 font-bold">
                      City
                    </th>
                    {/* 4. En-route Experience */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-slate-800 font-bold">
                      En-route Experience
                    </th>
                    {/* 5. City 2 */}
                    <th className="px-3 py-3 w-44 border-r border-slate-300 text-slate-800 font-bold">
                      City 2
                    </th>
                    {/* 6. Experience 1 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 1
                    </th>
                    {/* 7. Experience 2 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 2
                    </th>
                    {/* 8. Experience 3 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 3
                    </th>
                    {/* 9. Experience 4 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 4 (+)
                    </th>
                    {/* 10. Optional Experience 1 */}
                    <th className="px-3 py-3 w-52 border-r border-slate-300 text-purple-900 font-extrabold">
                      Optional Exp 1
                    </th>
                    {/* 11. Optional Experience 2 */}
                    <th className="px-3 py-3 w-52 border-r border-slate-300 text-purple-900 font-extrabold">
                      Optional Exp 2
                    </th>
                    {/* 12. Description 1 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 1 (Sheet)
                    </th>
                    {/* 13. Description 2 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 2
                    </th>
                    {/* 14. Description 3 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 3
                    </th>
                    {/* 15. Description 4 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 4
                    </th>
                    {/* 16. Optional Description 1 */}
                    <th className="px-3 py-3 w-60 border-r border-slate-300 text-slate-800 font-bold">
                      Opt Description 1
                    </th>
                    {/* 17. Optional Description 2 */}
                    <th className="px-3 py-3 w-60 border-r border-slate-300 text-slate-800 font-bold">
                      Opt Description 2
                    </th>
                    {/* 18. Delete Day */}
                    <th className="px-2 py-3 w-14 text-center text-slate-800 font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-300">
                  {dayRows.map((day, dIdx) => (
                    <tr
                      key={day.dayNumber}
                      className={`hover:bg-slate-50 transition-colors border-b border-slate-300 ${day.guidedTour ? 'bg-amber-50/40' : ''
                        }`}
                    >
                      {/* 1. Days (Sticky Left Column) */}
                      <td className={`sticky left-0 z-10 px-3 py-3 border-r-2 border-slate-400 font-extrabold shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)] ${day.guidedTour ? 'bg-amber-100/70 text-slate-950' : 'bg-slate-50 text-slate-950'
                        }`}>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-white rounded border border-slate-400 text-slate-900 font-bold font-mono text-xs shadow-2xs">
                            {day.dayText}
                          </span>
                        </div>
                      </td>

                      {/* 2. Guided Tour */}
                      <td className="px-3 py-2.5 text-center border-r border-slate-300">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.guidedTour}
                            onChange={e => updateDayField(dIdx, 'guidedTour', e.target.checked)}
                            className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                          />
                          <span className={`text-xs font-bold ${day.guidedTour ? 'text-orange-700' : 'text-slate-600'}`}>
                            {day.guidedTour ? 'Guided' : 'No'}
                          </span>
                        </label>
                      </td>

                      {/* 3. City */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.city}
                          onChange={val => updateDayField(dIdx, 'city', val)}
                          options={availableCitiesForDestination}
                          placeholder="Select City..."
                        />
                      </td>

                      {/* 4. En-route Experience (Multiple supported with + Add Spot) */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <div className="space-y-1.5">
                          {(day.enRouteExperiences || ['']).map((spot, sIdx) => (
                            <div key={sIdx} className="flex items-center gap-1">
                              <LookupField
                                value={spot}
                                onChange={val => updateEnRouteSpot(dIdx, sIdx, val)}
                                options={getEnRouteLookupForDay(day.city, day.city2)}
                                placeholder="En-route spot..."
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addEnRouteSpot(dIdx)}
                            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-0.5 font-bold mt-1"
                          >
                            <Plus className="w-3 h-3" /> Add En-route Spot
                          </button>
                        </div>
                      </td>

                      {/* 5. City 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.city2}
                          onChange={val => updateDayField(dIdx, 'city2', val)}
                          options={availableCitiesForDestination}
                          placeholder="Transit City..."
                        />
                      </td>

                      {/* 6. Experience 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.experiences[0] || ''}
                          onChange={(val, meta) => handleSelectExperience(dIdx, 0, val, meta)}
                          options={getExperiencesLookupForDay(day.city, day.city2)}
                          placeholder={day.city2 ? `Exp 1 (${day.city} / ${day.city2})...` : `Exp 1 in ${day.city}...`}
                        />
                      </td>

                      {/* 7. Experience 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.experiences[1] || ''}
                          onChange={(val, meta) => handleSelectExperience(dIdx, 1, val, meta)}
                          options={getExperiencesLookupForDay(day.city, day.city2)}
                          placeholder={day.city2 ? `Exp 2 (${day.city} / ${day.city2})...` : `Exp 2 in ${day.city}...`}
                        />
                      </td>

                      {/* 8. Experience 3 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.experiences[2] || ''}
                          onChange={(val, meta) => handleSelectExperience(dIdx, 2, val, meta)}
                          options={getExperiencesLookupForDay(day.city, day.city2)}
                          placeholder={day.city2 ? `Exp 3 (${day.city} / ${day.city2})...` : `Exp 3 in ${day.city}...`}
                        />
                      </td>

                      {/* 9. Experience 4 (with + Add Spot option) */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <div className="space-y-1.5">
                          <LookupField
                            value={day.experiences[3] || ''}
                            onChange={(val, meta) => handleSelectExperience(dIdx, 3, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Exp 4 (${day.city} / ${day.city2})...` : `Exp 4 in ${day.city}...`}
                          />
                          {/* Extra experiences beyond index 3 */}
                          {(day.experiences || []).slice(4).map((extraExp, extraIdx) => (
                            <div key={extraIdx + 4} className="flex items-center gap-1">
                              <LookupField
                                value={extraExp || ''}
                                onChange={(val, meta) => handleSelectExperience(dIdx, extraIdx + 4, val, meta)}
                                options={getExperiencesLookupForDay(day.city, day.city2)}
                                placeholder={`Exp ${extraIdx + 5}...`}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addExtraExperienceSpot(dIdx)}
                            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-0.5 font-bold mt-1"
                          >
                            <Plus className="w-3 h-3" /> Add Spot
                          </button>
                        </div>
                      </td>

                      {/* 10. Optional Experience 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.optionalExperiences[0] || ''}
                          onChange={(val, meta) => handleSelectOptionalExperience(dIdx, 0, val, meta)}
                          options={getExperiencesLookupForDay(day.city, day.city2)}
                          placeholder={day.city2 ? `Opt Exp 1 (${day.city} / ${day.city2})...` : "Optional Exp 1..."}
                        />
                      </td>

                      {/* 11. Optional Experience 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.optionalExperiences[1] || ''}
                          onChange={(val, meta) => handleSelectOptionalExperience(dIdx, 1, val, meta)}
                          options={getExperiencesLookupForDay(day.city, day.city2)}
                          placeholder={day.city2 ? `Opt Exp 2 (${day.city} / ${day.city2})...` : "Optional Exp 2..."}
                        />
                      </td>

                      {/* 12. Description 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[0] || ''}
                          onChange={e => updateDescriptionText(dIdx, 0, e.target.value)}
                          placeholder="Description 1 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 13. Description 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[1] || ''}
                          onChange={e => updateDescriptionText(dIdx, 1, e.target.value)}
                          placeholder="Description 2 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 14. Description 3 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[2] || ''}
                          onChange={e => updateDescriptionText(dIdx, 2, e.target.value)}
                          placeholder="Description 3 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 15. Description 4 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[3] || ''}
                          onChange={e => updateDescriptionText(dIdx, 3, e.target.value)}
                          placeholder="Description 4 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 16. Optional Description 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.optionalDescriptions[0] || ''}
                          onChange={e => updateOptionalDescriptionText(dIdx, 0, e.target.value)}
                          placeholder="Opt Description 1..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 17. Optional Description 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.optionalDescriptions[1] || ''}
                          onChange={e => updateOptionalDescriptionText(dIdx, 1, e.target.value)}
                          placeholder="Opt Description 2..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 18. Delete */}
                      <td className="px-2 py-2.5 text-center">
                        {dayRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDay(dIdx)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                            title="Delete Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6: COSTING, MARGINS & 5% GST */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  6. Costing, Margins &amp; 5% GST
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live calculated based on Hotels, Transport, Activities, and Pax count. You can apply the live quote or manually edit any field.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isQuoteManuallyEdited ? (
                  <Button
                    type="button"
                    onClick={handleApplyCalculatedQuote}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Live Auto Quote (₹{quotationCalculations.calculatedFinalQuote.toLocaleString('en-IN')})
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Quotation Auto-Synced (₹{quotationCalculations.calculatedFinalQuote.toLocaleString('en-IN')})
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyCalculatedQuote}
                      className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs h-8 px-2.5 font-bold rounded-lg"
                      title="Re-apply live quotation calculation"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Refresh
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Comprehensive Live Cost Breakdown Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-5">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Itinerary Cost Components Breakdown (Live Calculation):</span>
                <span className="text-slate-500 font-normal">
                  {adults} Adults {kids > 0 ? `• ${kids} Kids` : ''} • {roomsCount} Rooms • {noOfDays} Days
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">1. Hotels Total:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{quotationCalculations.totalHotelsCost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {hotels.reduce((acc, h) => acc + (Number(h.nights) || 1), 0)} Nts • {quotationCalculations.rooms} Rms
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">2. Transport / Cab:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{quotationCalculations.totalVehicleCost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {noOfDays} Days • ₹{quotationCalculations.perHeadTransportCost}/pax
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">3. Activities / Sights:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{quotationCalculations.totalActivitiesCost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    SIC &amp; Private Share
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">4. Guided Tour:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{quotationCalculations.totalGuideCost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ₹2,000/guided day
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Base Package:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{quotationCalculations.calculatedBase.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Deluge Net Cost
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Margin ({quotationCalculations.marginPct}%):</span>
                  <span className="text-xs font-extrabold text-orange-600 font-mono">
                    +₹{quotationCalculations.marginAmount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    5% GST: +₹{quotationCalculations.gstAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300">
                  <span className="text-[10px] text-emerald-800 block font-extrabold uppercase">Calculated Total:</span>
                  <span className="text-sm font-extrabold text-emerald-950 font-mono">
                    ₹{quotationCalculations.calculatedFinalQuote.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">
                    With GST &amp; Margin
                  </span>
                </div>

                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-300">
                  <span className="text-[10px] text-blue-800 block font-extrabold uppercase">Per Pax Cost:</span>
                  <span className="text-xs font-extrabold text-blue-950 font-mono block">
                    Adult: ₹{quotationCalculations.calculatedPerAdult.toLocaleString('en-IN')}
                  </span>
                  {kids > 0 && (
                    <span className="text-[11px] font-extrabold text-orange-700 font-mono block mt-0.5">
                      Child: ₹{quotationCalculations.calculatedPerKid.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Zoho Deluge Capacity Details Pill */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">Zoho Deluge Capacity Formula:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Rooms: <strong>{quotationCalculations.rooms}</strong> ({quotationCalculations.baseRooms} Base {quotationCalculations.extraRoomsAdded > 0 ? `+ ${quotationCalculations.extraRoomsAdded} Extra Needed` : ''})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Extra Beds: <strong>{quotationCalculations.extraBedCount}</strong> ({quotationCalculations.billableExtraBeds} Billable)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Transport Pax: <strong>{quotationCalculations.totalTransportPax}</strong> (Adults + Kids &gt; 3 yrs)
                  </span>
                  {kids > 0 && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                      Child Hotel Share: <strong>₹{quotationCalculations.childHotelShare.toLocaleString('en-IN')}</strong>
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Exact distribution: (Adults × ₹{quotationCalculations.delugePerAdultCost.toLocaleString('en-IN')}) {kids > 0 ? `+ (Kids × ₹${quotationCalculations.delugePerChildCost.toLocaleString('en-IN')})` : ''} = ₹{quotationCalculations.calculatedBase.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Editable Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Quotation Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 100000"
                  value={baseQuotation}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setIsQuoteManuallyEdited(true);
                    setBaseQuotation(val);
                    if (!marginPercent) setFinalQuotation(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 font-bold text-slate-900 focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Margin % (Optional)</label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 15"
                    value={marginPercent}
                    onChange={e => handleMarginChange(e.target.value.replace(/\D/g, ''))}
                    className="bg-white border border-slate-400 text-xs h-10 w-20 text-center font-bold text-orange-600 focus-visible:ring-orange-500"
                  />
                  <div className="flex gap-1">
                    {['10', '15', '20'].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleMarginChange(pct)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-400 transition-colors"
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">
                  Final Quotation Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Total Quote"
                  value={finalQuotation}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setIsQuoteManuallyEdited(true);
                    setFinalQuotation(val);
                    const num = Number(val) || 0;
                    if (num > 0) {
                      const effPax = (Number(adults) || 1) + (Number(kids) > 0 ? Number(kids) * 0.7 : 0);
                      const perA = Math.round(num / effPax);
                      setPerAdultPrice(String(perA));
                      if (kids > 0) setPerKidPrice(String(Math.round(perA * 0.7)));
                    }
                  }}
                  className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-sm h-10 font-extrabold focus-visible:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Per Adult Cost (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Per Adult Price"
                  value={perAdultPrice}
                  onChange={e => {
                    setIsQuoteManuallyEdited(true);
                    setPerAdultPrice(e.target.value.replace(/\D/g, ''));
                  }}
                  className="bg-blue-50/50 border border-blue-400 text-xs h-10 font-bold text-blue-950 focus-visible:ring-blue-500"
                />
              </div>

              {kids > 0 && (
                <div>
                  <label className="block text-xs font-bold text-orange-900 mb-1">
                    Per Child Cost (₹)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Per Child Price"
                    value={perKidPrice}
                    onChange={e => {
                      setIsQuoteManuallyEdited(true);
                      setPerKidPrice(e.target.value.replace(/\D/g, ''));
                    }}
                    className="bg-orange-50/50 border border-orange-400 text-xs h-10 font-bold text-orange-950 focus-visible:ring-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Amount Paid (₹)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 25000"
                  value={advanceAmount}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAdvanceAmount(val);
                    const f = Number(finalQuotation) || 0;
                    const a = Number(val) || 0;
                    if (f > 0) setBalanceAmount(String(Math.max(0, f - a)));
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-slate-900 font-semibold focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Balance Pending Amount (₹)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Auto calculated"
                  value={balanceAmount}
                  onChange={e => setBalanceAmount(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-100 border border-slate-400 text-xs h-10 text-slate-800 font-semibold focus-visible:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: OPTION SELECTOR & GENERATION TRIGGER */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Select Itinerary Option:
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300 inline-flex">
                {[1, 2, 3].map(optNum => (
                  <button
                    key={optNum}
                    onClick={() => setSelectedOption(optNum)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${selectedOption === optNum
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Option {optNum}
                    {selectedOption === optNum && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">
                Option 1, 2, and 3 generate separate luxury itinerary links.
              </p>
            </div>

            <Button
              onClick={handleGenerateItinerary}
              disabled={generating}
              className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2.5 shrink-0 self-start md:self-auto"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Itinerary with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Option {selectedOption} Itinerary ↗
                </>
              )}
            </Button>
          </div>

          {genError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <span className="font-bold">Error:</span> {genError}
            </div>
          )}

          {/* Success Result Card */}
          {genSuccess && (
            <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {genSuccess.updated ? 'Option Updated Successfully!' : 'Option Generated Successfully!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Option {genSuccess.optionNumber} has been saved with the latest hotels, guided experiences &amp; transport!
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-300 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="text-xs text-slate-700 truncate font-mono font-medium">
                  {genSuccess.publicUrl || genSuccess.url}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => copyToClipboard(genSuccess.publicUrl || `${window.location.origin}${genSuccess.url}`)}
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Link!' : 'Copy Link'}
                  </Button>
                  <a
                    href={genSuccess.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-4 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    Open Live Itinerary
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section: Itinerary History Section */}
        <div className="mt-14 pt-8 border-t border-slate-300">
          <ItineraryHistorySection />
        </div>
      </main>

      {/* POP-UP MODAL: KIDS AGE & BED PREFERENCE */}
      {isKidsModalOpen && kids > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    Child Details ({kids} {kids === 1 ? 'Child' : 'Children'})
                  </h3>
                  <p className="text-xs text-slate-600">
                    Specify age and bed preference for each child to determine hotel room policies and extra bed rates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsKidsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-semibold">Quick Set All:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAllBedPreferences('Without Bed')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors"
                >
                  All: Without Extra Bed (Sharing)
                </button>
                <button
                  type="button"
                  onClick={() => setAllBedPreferences('With Bed')}
                  className="px-2.5 py-1 rounded-md bg-orange-100 border border-orange-300 text-orange-800 hover:bg-orange-200 font-bold transition-colors"
                >
                  All: With Extra Bed
                </button>
              </div>
            </div>

            {/* Modal Body - Child Cards */}
            <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100 flex-1">
              {kidsDetails.slice(0, kids).map((child) => (
                <div key={child.childNumber} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 inline-flex items-center justify-center text-[11px] font-bold">
                        {child.childNumber}
                      </span>
                      Child {child.childNumber}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${child.bedPreference === 'With Bed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : child.bedPreference === 'Crib'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                      {child.bedPreference === 'With Bed' ? 'Extra Bed Included' : child.bedPreference === 'Crib' ? 'Crib / Cot' : 'Sharing Bed (No Extra Bed)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Age Input */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Age (Years)
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 5"
                        value={child.age}
                        onChange={e => {
                          const sanitized = e.target.value.replace(/\D/g, '');
                          updateChildDetail(child.childNumber, 'age', sanitized);
                        }}
                        className="bg-white border border-slate-400 text-xs h-9 font-bold text-slate-900 focus-visible:ring-orange-500"
                      />
                    </div>

                    {/* Bed Preference Selector */}
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Bed Preference
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'Without Bed')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'Without Bed'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>Without Bed</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'Without Bed' ? 'text-amber-100' : 'text-slate-500'}`}>
                            Sharing
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'With Bed')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'With Bed'
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>With Bed</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'With Bed' ? 'text-emerald-100' : 'text-slate-500'}`}>
                            Extra Bed
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'Crib')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'Crib'
                              ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>Crib / Cot</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'Crib' ? 'text-blue-100' : 'text-slate-500'}`}>
                            0-2 yrs
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {kidsDetails.filter(k => k.bedPreference === 'With Bed').length} With Bed • {kidsDetails.filter(k => k.bedPreference === 'Without Bed').length} Without Bed • {kidsDetails.filter(k => k.bedPreference === 'Crib').length} Crib
              </span>
              <Button
                type="button"
                onClick={() => setIsKidsModalOpen(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Save &amp; Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
