import { getZohoAccessToken, getZohoApiUrl } from './zoho';
import { calculateLeadPricingAndItinerary1, PricingCalculationResult } from './zoho-pricing';

export interface ZohoHotelStay {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  stayDates: string;
  category?: string;
  roomCategory?: string;
}

export interface ZohoExperienceItem {
  name: string;
  subTitle?: string;
  description?: string;
  inclusionDescription?: string;
  guidedTour?: boolean;
}

export interface ZohoDayActivity {
  dayNumber: number;
  dayText: string;
  city: string;
  city2?: string;
  guidedTour?: boolean;
  enRouteExperiences?: string;
  optionalExperiences?: string[];
  inclusionsDescriptions?: string[];
  experiences: ZohoExperienceItem[];
  pdfDescription?: string;
}

export interface NormalizedZohoLead {
  leadId: string;
  inquiryId: string;
  leadName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  city: string;
  destinations: string;
  destinationType: string;
  travelStartDate: string;
  travelEndDate: string;
  noOfDays: number;
  noOfNights: number;
  numberOfGuests: number;
  preferredRoomCategory: string;
  hotelCategory?: string;
  globalTargetCat: string;
  freezeItinerary: boolean;
  isFrozen: boolean;
  pickItinerary?: string;
  pickItineraryId?: string;
  lastLoadedItineraryId?: string;
  itineraryLoaded?: boolean;
  mealPlan?: string;
  vehicleType?: string;
  tripType: string;
  travelStyle: string;
  finalQuotationAmount?: number;
  marginPercentage?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  costingRequestStatus?: string;
  roomsCount?: number;
  hotels: ZohoHotelStay[];
  dayActivities: ZohoDayActivity[];
  rawLeadData: Record<string, any>;
  loadedProductData?: Record<string, any> | null;
  calculatedPricing?: PricingCalculationResult;
}

export function toSafeString(val: any, fallback = ''): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string') return val.trim();
  if (typeof val === 'object') {
    if (Array.isArray(val)) {
      return val.map(v => toSafeString(v)).filter(Boolean).join(', ') || fallback;
    }
    const extracted = val.name || val.value || val.label || val.display_value || val.title;
    if (extracted) return String(extracted).trim();
  }
  return String(val).trim() || fallback;
}

/**
 * Robust date parser matching Zoho CRM Deluge logic:
 * Handles yyyy-MM-dd, dd/MM/yyyy, dd-MM-yyyy, yyyy/MM/dd, etc.
 */
export function parseZohoDate(dateStr: any): Date | null {
  if (!dateStr) return null;
  const s = String(dateStr).trim();
  if (!s || s === '-None-') return null;

  // 1. Format: yyyy-MM-dd
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    if (!isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return new Date(Date.UTC(y, m - 1, d));
    }
  }

  // 2. Format: dd/MM/yyyy or dd-MM-yyyy or yyyy/MM/dd
  if (s.includes('/') || s.includes('-')) {
    const delimiter = s.includes('/') ? '/' : '-';
    const parts = s.split(delimiter).map(p => p.trim());
    if (parts.length === 3) {
      const p1 = parseInt(parts[0], 10);
      const p2 = parseInt(parts[1], 10);
      const p3 = parseInt(parts[2], 10);

      if (!isNaN(p1) && !isNaN(p2) && !isNaN(p3)) {
        let y: number;
        let m: number;
        let d: number;

        if (p1 > 31) {
          // Format is yyyy-MM-dd or yyyy/MM/dd
          y = p1;
          m = p2;
          d = p3;
        } else if (p3 > 31) {
          // Format is dd-MM-yyyy or dd/MM/yyyy
          d = p1;
          m = p2;
          y = p3;
        } else {
          // Ambiguous: default to dd/MM/yyyy
          d = p1;
          m = p2;
          y = p3 < 100 ? 2000 + p3 : p3;
        }

        if (y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
          return new Date(Date.UTC(y, m - 1, d));
        }
      }
    }
  }

  // 3. Fallback to standard Date parsing
  try {
    const parsed = new Date(s);
    if (!isNaN(parsed.getTime())) {
      return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
    }
  } catch {
    // Ignore fallback failure
  }

  return null;
}

export function formatDateToIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ZOHO_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateToDdMmmYyyy(d: Date): string {
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = ZOHO_MONTH_NAMES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

export function addDaysToDate(d: Date, days: number): Date {
  const next = new Date(d.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

/**
 * Searches and fetches product/itinerary details from Zoho CRM Products module
 */
async function fetchZohoProductByIdOrName(
  token: string,
  itineraryData: any
): Promise<{ productRecord: Record<string, any> | null; resolvedId: string | null; resolvedName: string }> {
  let itineraryId = '';
  let itineraryName = 'N/A';

  if (itineraryData && typeof itineraryData === 'object') {
    itineraryId = itineraryData.id ? String(itineraryData.id).trim() : '';
    itineraryName = itineraryData.name ? String(itineraryData.name).trim() : 'N/A';
  } else if (itineraryData) {
    const s = String(itineraryData).trim();
    if (/^\d{15,22}$/.test(s)) {
      itineraryId = s;
    } else if (s && s !== '-None-') {
      itineraryName = s;
    }
  }

  const headers = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  // If no ID is available, search in Products module by Name / Product_Name
  if (!itineraryId && itineraryName && itineraryName !== 'N/A') {
    try {
      const searchCriteria = encodeURIComponent(`(Product_Name:equals:${itineraryName})`);
      const searchUrl = getZohoApiUrl(`/crm/v3/Products/search?criteria=${searchCriteria}`);
      const sRes = await fetch(searchUrl, { headers, cache: 'no-store' });
      if (sRes.ok) {
        const sJson = await sRes.json();
        if (sJson.data && sJson.data[0]) {
          itineraryId = String(sJson.data[0].id);
          itineraryName = sJson.data[0].Product_Name || sJson.data[0].Name || itineraryName;
        }
      }
    } catch (err) {
      console.warn('[Zoho Product Search by Product_Name failed]:', err);
    }

    if (!itineraryId) {
      try {
        const searchCriteria = encodeURIComponent(`(Name:equals:${itineraryName})`);
        const searchUrl = getZohoApiUrl(`/crm/v3/Products/search?criteria=${searchCriteria}`);
        const sRes = await fetch(searchUrl, { headers, cache: 'no-store' });
        if (sRes.ok) {
          const sJson = await sRes.json();
          if (sJson.data && sJson.data[0]) {
            itineraryId = String(sJson.data[0].id);
            itineraryName = sJson.data[0].Product_Name || sJson.data[0].Name || itineraryName;
          }
        }
      } catch (err) {
        console.warn('[Zoho Product Search by Name failed]:', err);
      }
    }
  }

  // Fetch full Product Record with Day_wise_detailed_itinerary subform
  if (itineraryId) {
    try {
      const prodUrl = getZohoApiUrl(`/crm/v3/Products/${itineraryId}`);
      const pRes = await fetch(prodUrl, { headers, cache: 'no-store' });
      if (pRes.ok) {
        const pJson = await pRes.json();
        if (pJson.data && pJson.data[0]) {
          const rec = pJson.data[0];
          return {
            productRecord: rec,
            resolvedId: itineraryId,
            resolvedName: rec.Product_Name || rec.Name || itineraryName
          };
        }
      }
    } catch (err) {
      console.error('[Error fetching Zoho Product Record]:', err);
    }
  }

  return { productRecord: null, resolvedId: itineraryId || null, resolvedName: itineraryName };
}

/**
 * Fetch Lead from Zoho CRM by ID or Query (Inquiry ID, Phone, Email)
 * Faithfully reproduces the Zoho Deluge automation logic:
 * - GLOBAL CATEGORY SETUP: Auto-syncs blank individual hotel categories with global category
 * - FREEZE ITINERARY: Dynamically calculates days, nights, consecutive City_2 hotel stays (with -1 checkout night), and stay dates
 * - NORMAL ITINERARY (NOT FROZEN): Fetches Product from Products module, extracts Day_wise_detailed_itinerary subform,
 *   calculates consecutive City_2 stays, sets days/nights, and generates Hotel_1..6 stay dates.
 */
export async function fetchZohoLeadById(leadIdOrQuery: string): Promise<NormalizedZohoLead | null> {
  const cleanQuery = leadIdOrQuery.trim();
  if (!cleanQuery) return null;

  const token = await getZohoAccessToken();
  let rawLead: Record<string, any> | null = null;

  const fetchHeaders = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  // 1. Attempt direct fetch by record ID
  if (/^\d{15,22}$/.test(cleanQuery)) {
    try {
      const url = getZohoApiUrl(`/crm/v3/Leads/${cleanQuery}`);
      const res = await fetch(url, {
        headers: fetchHeaders,
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data[0]) {
          rawLead = json.data[0];
        }
      }
    } catch (err) {
      console.error('[Zoho Fetch by ID Error]:', err);
    }
  }

  // 2. Search by Inquiry_ID, Email, or Mobile
  if (!rawLead) {
    try {
      const searchUrl = getZohoApiUrl(
        `/crm/v3/Leads/search?criteria=((Inquiry_ID:equals:${encodeURIComponent(cleanQuery)})or(Email:equals:${encodeURIComponent(cleanQuery)})or(Mobile:equals:${encodeURIComponent(cleanQuery)}))`
      );
      const searchRes = await fetch(searchUrl, {
        headers: fetchHeaders,
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson.data && searchJson.data[0]) {
          const foundId = searchJson.data[0].id;
          const fullUrl = getZohoApiUrl(`/crm/v3/Leads/${foundId}`);
          const fullRes = await fetch(fullUrl, {
            headers: fetchHeaders,
            cache: 'no-store',
            next: { revalidate: 0 }
          });
          if (fullRes.ok) {
            const fullJson = await fullRes.json();
            rawLead = fullJson.data?.[0] || searchJson.data[0];
          } else {
            rawLead = searchJson.data[0];
          }
        }
      }
    } catch (err) {
      console.error('[Zoho Search Error]:', err);
    }
  }

  if (!rawLead) return null;

  // --------------------------------------------------------------------------
  // DELUGE STEP 1: GLOBAL CATEGORY SETUP
  // globalTargetCat = ifnull(leadRecord.get("Hotel_Category"), ifnull(leadRecord.get("Preferred_Room_Category"), "Deluxe")).trim()
  // --------------------------------------------------------------------------
  const rawTargetCat = rawLead.Hotel_Category ?? rawLead.Preferred_Room_Category;
  let globalTargetCat = toSafeString(rawTargetCat, 'Deluxe').trim();
  if (!globalTargetCat || globalTargetCat === '-None-') {
    globalTargetCat = 'Deluxe';
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 2: CHECK IF FREEZE ITINERARY IS TICKED
  // isFrozen = ifnull(leadRecord.get("Freeze_Itinerary"), false)
  // --------------------------------------------------------------------------
  const isFrozen = rawLead.Freeze_Itinerary === true ||
    String(rawLead.Freeze_Itinerary || '').toLowerCase() === 'true' ||
    String(rawLead.Freeze_Itinerary || '').toLowerCase() === 'yes';

  const rawLeadSubform = rawLead.Activities_and_Experiences_1 || rawLead.Day_wise_detailed_itinerary;
  const hasLeadSubform = Array.isArray(rawLeadSubform) && rawLeadSubform.length > 0;

  let activeSubformRows: any[] = [];
  let loadedProductRecord: Record<string, any> | null = null;
  let resolvedItineraryId: string | null = null;
  let resolvedItineraryName = 'N/A';
  let isItineraryLoaded = false;

  const hotelCityList: string[] = [];
  const hotelNightsList: number[] = [];

  if (isFrozen) {
    // ITINERARY IS FROZEN:
    // Calculating days, nights, and hotel stay dates dynamically from live lead subform changes.
    if (hasLeadSubform) {
      activeSubformRows = rawLeadSubform;
      let lastCity2 = '';
      let currentNightsCount = 0;

      for (const row of rawLeadSubform) {
        const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? '';
        const city2Val = (typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '')).trim();

        if (city2Val && city2Val !== '-None-') {
          if (!lastCity2) {
            lastCity2 = city2Val;
            currentNightsCount = 1;
          } else if (city2Val.toLowerCase() === lastCity2.toLowerCase()) {
            currentNightsCount++;
          } else {
            hotelCityList.push(lastCity2);
            hotelNightsList.push(currentNightsCount);
            lastCity2 = city2Val;
            currentNightsCount = 1;
          }
        }
      }

      if (lastCity2 && currentNightsCount > 0) {
        hotelCityList.push(lastCity2);
        // Aakhri city ki nights mein se 1 minus kar do taaki checkout night count na ho (Deluge behavior)
        hotelNightsList.push(Math.max(1, currentNightsCount - 1));
      }
    }
  } else {
    // ------------------------------------------------------------------------
    // DELUGE STEP 3: NORMAL ITINERARY FETCHING LOGIC (WHEN NOT FROZEN)
    // Fetch Product record from Products module based on Pick_Itinerary / Itinerary
    // ------------------------------------------------------------------------
    const itineraryData = rawLead.Pick_Itinerary ?? rawLead.Itinerary;
    const { productRecord, resolvedId, resolvedName } = await fetchZohoProductByIdOrName(token, itineraryData);

    loadedProductRecord = productRecord;
    resolvedItineraryId = resolvedId;
    resolvedItineraryName = resolvedName;

    const itinerarySubform = productRecord?.Day_wise_detailed_itinerary || productRecord?.Activities_and_Experiences_1;

    if (Array.isArray(itinerarySubform) && itinerarySubform.length > 0) {
      activeSubformRows = itinerarySubform;
      isItineraryLoaded = true;

      let lastCity2 = '';
      let currentNightsCount = 0;

      for (const row of itinerarySubform) {
        const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? '';
        const city2Val = (typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '')).trim();

        if (city2Val && city2Val !== '-None-') {
          if (!lastCity2) {
            lastCity2 = city2Val;
            currentNightsCount = 1;
          } else if (city2Val.toLowerCase() === lastCity2.toLowerCase()) {
            currentNightsCount++;
          } else {
            hotelCityList.push(lastCity2);
            hotelNightsList.push(currentNightsCount);
            lastCity2 = city2Val;
            currentNightsCount = 1;
          }
        }
      }

      if (lastCity2 && currentNightsCount > 0) {
        hotelCityList.push(lastCity2);
        hotelNightsList.push(currentNightsCount);
      }
    } else if (hasLeadSubform) {
      // Graceful fallback to lead's own subform if Product has no subform
      activeSubformRows = rawLeadSubform;
    }
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 4: CALCULATE DAYS & NIGHTS
  // --------------------------------------------------------------------------
  let noOfDays = activeSubformRows.length;
  if (noOfDays <= 0) {
    noOfDays = Number(rawLead.No_of_Days) || Number(loadedProductRecord?.No_of_Days) || 0;
  }
  let noOfNights = noOfDays > 1 ? noOfDays - 1 : 0;
  if (rawLead.No_of_Nights && Number(rawLead.No_of_Nights) > 0 && (!noOfDays || noOfDays === 0)) {
    noOfNights = Number(rawLead.No_of_Nights);
    noOfDays = noOfNights + 1;
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 5: CALCULATE TRAVEL START DATE, TRAVEL END DATE & STAY DATES
  // --------------------------------------------------------------------------
  const startDateStr = toSafeString(
    rawLead.Preferred_Start_date || rawLead.Travel_Start_Date || rawLead.Start_Date || ''
  );
  const parsedStartDate = parseZohoDate(startDateStr);

  let travelStartDateIso = startDateStr;
  let travelEndDateIso = toSafeString(rawLead.Travel_End_Date, '');
  const calculatedStayDates: Record<number, string> = {};

  if (parsedStartDate) {
    travelStartDateIso = formatDateToIso(parsedStartDate);
    const calculatedEndDate = addDaysToDate(parsedStartDate, noOfNights);
    travelEndDateIso = formatDateToIso(calculatedEndDate);

    let runningDate = parsedStartDate;
    for (let i = 1; i <= 6; i++) {
      const dynamicNights = hotelNightsList[i - 1];
      const leadFieldNights = Number(rawLead[`Hotel_${i}_Nights`] || rawLead[`${i}th_Hotel_Nights`]) || 0;
      const nVal = dynamicNights !== undefined ? dynamicNights : leadFieldNights;

      if (nVal > 0) {
        const checkInStr = formatDateToDdMmmYyyy(runningDate);
        const checkOutDate = addDaysToDate(runningDate, nVal);
        const checkOutStr = formatDateToDdMmmYyyy(checkOutDate);
        calculatedStayDates[i] = `${checkInStr} to ${checkOutStr}`;
        runningDate = checkOutDate;
      } else {
        calculatedStayDates[i] = '';
      }
    }
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 6: ASSEMBLE HOTELS (1 to 6 with auto-sync categories + up to 10)
  // --------------------------------------------------------------------------
  const hotels: ZohoHotelStay[] = [];

  for (let i = 1; i <= 6; i++) {
    const altKey = i === 5 ? 'th_Hotel' : (i > 5 ? `th_Hotel${i - 5}` : '');
    const hotelObj = rawLead[`Hotel_${i}`] || (altKey ? rawLead[altKey] : undefined) || rawLead[`${i}th_Hotel`] || rawLead[`X${i}th_Hotel`];
    const rawCityFromLead = toSafeString(rawLead[`Hotel_${i}_City`] || rawLead[`${i}th_Hotel_City`] || (altKey ? rawLead[`${altKey}_City`] : undefined) || '');
    const rawNightsFromLead = rawLead[`Hotel_${i}_Nights`] || rawLead[`${i}th_Hotel_Nights`] || (altKey ? rawLead[`${altKey}_Nights`] : undefined);
    const rawStayDatesFromLead = toSafeString(rawLead[`Hotel_${i}_Stay_Dates`] || rawLead[`${i}th_Hotel_Stay_Dates`] || (altKey ? rawLead[`${altKey}_Stay_Dates`] : undefined) || '');
    const rawCatFromLead = toSafeString(rawLead[`Hotel_${i}_Category`] || rawLead[`${i}th_Hotel_Category`] || '');

    // AUTO-SYNC BLANK INDIVIDUAL HOTEL CATEGORIES WITH GLOBAL CATEGORY
    const hotelCategory = (rawCatFromLead && rawCatFromLead !== '-None-') ? rawCatFromLead : globalTargetCat;

    // City preference: dynamic City_2 calculation if available, else lead record
    const city = hotelCityList[i - 1] || rawCityFromLead;

    // Nights preference: dynamic nights calculation if available, else lead record
    const nights = hotelNightsList[i - 1] !== undefined
      ? hotelNightsList[i - 1]
      : (Number(rawNightsFromLead) || 0);

    // Stay dates preference: dynamic calculated date range, else lead record
    const stayDates = calculatedStayDates[i] || rawStayDatesFromLead;

    const rawHotelName = typeof hotelObj === 'object' && hotelObj !== null ? hotelObj.name : (typeof hotelObj === 'string' ? hotelObj : '');
    let cleanHName = (rawHotelName || '').trim();
    if (
      /^(?:Standard|Deluxe|Selected|3[- ]?Star|4[- ]?Star|5[- ]?Star|Luxury|Budget|Premium)\s*(?:Hotel|Property|Resort)?$/i.test(cleanHName) ||
      cleanHName.toLowerCase() === 'standard' ||
      cleanHName.toLowerCase() === 'deluxe'
    ) {
      cleanHName = city ? `${city} Hotel` : 'Hotel';
    }

    if (cleanHName || city || nights > 0) {
      hotels.push({
        index: i,
        hotelName: cleanHName || (city ? `${city} Hotel` : 'Hotel'),
        city: city || 'Destination',
        nights: nights,
        stayDates: stayDates,
        category: hotelCategory,
        roomCategory: toSafeString(rawLead.Preferred_Room_Category, 'Standard')
      });
    }
  }

  // Support additional hotels 7 to 10 from Lead if present
  for (let i = 7; i <= 10; i++) {
    const altKey = `th_Hotel${i - 5}`;
    const hotelObj = rawLead[`Hotel_${i}`] || rawLead[altKey] || rawLead[`${i}th_Hotel`];
    const rawCity = toSafeString(rawLead[`Hotel_${i}_City`] || rawLead[`${i}th_Hotel_City`] || '');
    const rawNights = rawLead[`Hotel_${i}_Nights`] || rawLead[`${i}th_Hotel_Nights`];
    const rawStayDates = toSafeString(rawLead[`Hotel_${i}_Stay_Dates`] || rawLead[`${i}th_Hotel_Stay_Dates`] || '');
    const rawCat = toSafeString(rawLead[`Hotel_${i}_Category`] || '');

    const rawHotelName = typeof hotelObj === 'object' && hotelObj !== null ? hotelObj.name : (typeof hotelObj === 'string' ? hotelObj : '');
    const cleanHName = (rawHotelName || '').trim();

    if (cleanHName || rawCity) {
      hotels.push({
        index: i,
        hotelName: cleanHName || 'Hotel',
        city: rawCity || 'Destination',
        nights: Number(rawNights) || 0,
        stayDates: rawStayDates,
        category: (rawCat && rawCat !== '-None-') ? rawCat : globalTargetCat,
        roomCategory: toSafeString(rawLead.Preferred_Room_Category, 'Standard')
      });
    }
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 7: ASSEMBLE ACTIVITIES & EXPERIENCES (Day-wise subform data)
  // Maps: Days, City, City_2, En_route_Experiences, Experiences 1..4, Guided_Tour,
  // Optional_Experiences, Inclusions_Description_1..4, etc.
  // --------------------------------------------------------------------------
  const dayActivities: ZohoDayActivity[] = [];

  activeSubformRows.forEach((row, idx) => {
    const dayText = String(row.Days || `Day ${idx + 1}`).trim();
    const dayMatch = dayText.match(/\d+/);
    const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : idx + 1;
    const city = String(row.City || '').trim();

    const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? row.Transit_city ?? '';
    const city2 = (typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '')).trim();

    const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? row.En_Route_Experiences ?? row.En_route ?? row.Enroute ?? row.en_route_experiences ?? '';
    const enRouteExperiences = (typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : String(rawEnRoute || '')).trim();
    const pdfDescription = String(row.PDF_Description || '').trim();

    const isGuidedTour = row.Guided_Tour === true || String(row.Guided_Tour).toLowerCase() === 'true' || row.guided_tour === true;

    // Optional experiences
    const optExpRaw = row.Optional_Experiences ?? row.Optional_experiences ?? row.optional_experiences;
    const optionalExperiences: string[] = [];
    if (optExpRaw) {
      const optStr = typeof optExpRaw === 'object' && optExpRaw !== null ? optExpRaw.name : String(optExpRaw).trim();
      if (optStr && optStr !== '-None-') {
        optionalExperiences.push(optStr);
      }
    }

    const inclusionsDescriptions: string[] = [];
    const experiences: ZohoExperienceItem[] = [];
    const seenExpNames = new Set<string>();

    for (let e = 1; e <= 10; e++) {
      // Deluge mappings:
      // Experiences_and_activities from Experience_1 or Experiences_1
      // Experiences_2 from Experience_2 or Experiences_2
      // Experiences_3 from Experience_3 or Experiences_3
      // Experiences_4 from Experience_4 or Experiences_4
      const expKey = e === 1
        ? (row.Experience_1 || row.Experiences_1 || row.Experiences_and_activities || row.Experience_and_activity)
        : (row[`Experience_${e}`] || row[`Experiences_${e}`]);

      if (!expKey) continue;
      const expName = (typeof expKey === 'object' && expKey !== null ? expKey.name : (typeof expKey === 'string' ? expKey : '')).trim();

      const incDesc = String(
        row[`Inclusions_Description_${e}`] ||
        row[`Inclusion_Description_${e}`] ||
        row[`Description_for_template_${e}`] ||
        ''
      ).trim();

      if (incDesc) {
        inclusionsDescriptions.push(incDesc);
      }

      if (expName && expName !== '-None-' && !seenExpNames.has(expName.toLowerCase())) {
        seenExpNames.add(expName.toLowerCase());
        experiences.push({
          name: expName,
          subTitle: String(row[`Sub_Title_${e}`] || '').trim(),
          description: String(
            row[`Description_for_template_${e}`] ||
            row[`Description_${e}`] ||
            row[`Descriptions_${e}`] ||
            row[`Inclusions_Description_${e}`] ||
            row[`Inclusion_Description_${e}`] ||
            row[`Template_Description_${e}`] ||
            row[`Activity_Description_${e}`] ||
            row[`PDF_Description`] ||
            ''
          ).trim(),
          inclusionDescription: incDesc,
          guidedTour: isGuidedTour
        });
      }
    }

    dayActivities.push({
      dayNumber,
      dayText,
      city,
      city2: (city2 && city2 !== '-None-') ? city2 : undefined,
      guidedTour: isGuidedTour,
      enRouteExperiences: (enRouteExperiences && enRouteExperiences !== '-None-') ? enRouteExperiences : undefined,
      optionalExperiences: optionalExperiences.length > 0 ? optionalExperiences : undefined,
      inclusionsDescriptions: inclusionsDescriptions.length > 0 ? inclusionsDescriptions : undefined,
      experiences,
      pdfDescription: pdfDescription || undefined
    });
  });

  dayActivities.sort((a, b) => a.dayNumber - b.dayNumber);

  // --------------------------------------------------------------------------
  // DELUGE PRICING AUTOMATION: calculateLeadPricingAndItinerary1
  // --------------------------------------------------------------------------
  let calculatedPricing: PricingCalculationResult | undefined = undefined;
  try {
    calculatedPricing = await calculateLeadPricingAndItinerary1(rawLead, token);
  } catch (err) {
    console.warn('[Auto Lead Pricing Calculation skipped]:', err);
  }

  // --------------------------------------------------------------------------
  // DELUGE STEP 8: RETURN FULL NORMALIZED RECORD
  // --------------------------------------------------------------------------
  return {
    leadId: toSafeString(rawLead.id, ''),
    inquiryId: toSafeString(rawLead.Inquiry_ID, ''),
    leadName: toSafeString(rawLead.Full_Name || [rawLead.First_Name, rawLead.Last_Name].filter(Boolean).join(' '), 'Valued Guest'),
    firstName: toSafeString(rawLead.First_Name, ''),
    lastName: toSafeString(rawLead.Last_Name, ''),
    email: toSafeString(rawLead.Email, ''),
    mobile: toSafeString(rawLead.Mobile || rawLead.Phone, ''),
    city: toSafeString(rawLead.City, ''),
    destinations: toSafeString(rawLead.Destinations || rawLead.Destination_Location || rawLead.Destination_State || rawLead.City, ''),
    destinationType: toSafeString(rawLead.Destination_Type, 'India'),
    travelStartDate: travelStartDateIso,
    travelEndDate: travelEndDateIso,
    noOfDays,
    noOfNights,
    numberOfGuests: Number(rawLead.Number_Of_Guest || rawLead.Adults) || 2,
    adults: (() => {
      const a = Number(rawLead.Adults || rawLead.adults || rawLead.Number_Of_Adults);
      const g = Number(rawLead.Number_Of_Guest || rawLead.Number_Of_Guests);
      return !isNaN(a) && a > 0 ? a : (!isNaN(g) && g > 0 ? g : 2);
    })(),
    kids: (() => {
      const k = Number(rawLead.Kids || rawLead.kids || rawLead.Children || rawLead.children || rawLead.Number_Of_Children || rawLead.Number_Of_Kids);
      if (!isNaN(k) && k > 0) return k;
      if (rawLead.Kids_Age && !isNaN(Number(rawLead.Kids_Age)) && Number(rawLead.Kids_Age) > 0) return Number(rawLead.Kids_Age);
      let childAgesCount = 0;
      for (let c = 1; c <= 10; c++) {
        if (rawLead[`Child_${c}_Age`] !== undefined && rawLead[`Child_${c}_Age`] !== null && rawLead[`Child_${c}_Age`] !== '') {
          childAgesCount++;
        }
      }
      if (childAgesCount > 0) return childAgesCount;
      const g = Number(rawLead.Number_Of_Guest || rawLead.Number_Of_Guests);
      const a = Number(rawLead.Adults || rawLead.adults);
      if (!isNaN(g) && !isNaN(a) && g > a) return g - a;
      return 0;
    })(),
    preferredRoomCategory: toSafeString(rawLead.Preferred_Room_Category, 'Standard'),
    hotelCategory: toSafeString(rawLead.Hotel_Category, globalTargetCat),
    globalTargetCat,
    freezeItinerary: isFrozen,
    isFrozen,
    pickItinerary: resolvedItineraryName !== 'N/A' ? resolvedItineraryName : toSafeString(rawLead.Pick_Itinerary || rawLead.Itinerary, ''),
    pickItineraryId: resolvedItineraryId || undefined,
    lastLoadedItineraryId: toSafeString(rawLead.Last_Loaded_Itinerary_ID, ''),
    itineraryLoaded: Boolean(rawLead.Itinerary_Loaded || isItineraryLoaded),
    mealPlan: toSafeString(rawLead.Meal_Plan || rawLead.mealPlan || rawLead.MealPlan, ''),
    vehicleType: toSafeString(rawLead.Vehicle_Type || rawLead.Vehicle || rawLead.vehicleType || rawLead.Cab_Type, 'AC Vehicle'),
    tripType: toSafeString(rawLead.Trip_Type, 'Customised Trip'),
    travelStyle: toSafeString(rawLead.Travel_Style, 'Family Trip'),
    roomsCount: rawLead.Rooms_Count ? Number(rawLead.Rooms_Count) : calculatedPricing?.roomsCount,
    finalQuotationAmount: rawLead.Final_Quotation_Amount ? Number(rawLead.Final_Quotation_Amount) : (calculatedPricing?.finalQuotation ?? (rawLead.Total_Package_Cost ? Number(rawLead.Total_Package_Cost) : (rawLead.Quotation_Amount ? Number(rawLead.Quotation_Amount) : (rawLead.Expected_Revenue ? Number(rawLead.Expected_Revenue) : (rawLead.Amount ? Number(rawLead.Amount) : undefined))))),
    marginPercentage: rawLead.Margin_Percentage !== undefined ? Number(rawLead.Margin_Percentage) : (rawLead.Margin !== undefined ? Number(rawLead.Margin) : (rawLead.Markup !== undefined ? Number(rawLead.Markup) : undefined)),
    perAdultPrice: rawLead.Per_Adult_Cost !== undefined && rawLead.Per_Adult_Cost !== null && !isNaN(Number(rawLead.Per_Adult_Cost))
      ? Number(rawLead.Per_Adult_Cost)
      : (calculatedPricing?.perAdultCost ?? (rawLead.Per_Adult_Price !== undefined && rawLead.Per_Adult_Price !== null && !isNaN(Number(rawLead.Per_Adult_Price))
        ? Number(rawLead.Per_Adult_Price)
        : (rawLead.Price_Per_Adult !== undefined && rawLead.Price_Per_Adult !== null && !isNaN(Number(rawLead.Price_Per_Adult))
          ? Number(rawLead.Price_Per_Adult)
          : (rawLead.Adult_Price !== undefined && rawLead.Adult_Price !== null && !isNaN(Number(rawLead.Adult_Price))
            ? Number(rawLead.Adult_Price)
            : undefined)))),
    perKidPrice: rawLead.Per_Child_Cost !== undefined && rawLead.Per_Child_Cost !== null && !isNaN(Number(rawLead.Per_Child_Cost))
      ? Number(rawLead.Per_Child_Cost)
      : (calculatedPricing?.perChildCost ?? (rawLead.Per_Child_Price !== undefined && rawLead.Per_Child_Price !== null && !isNaN(Number(rawLead.Per_Child_Price))
        ? Number(rawLead.Per_Child_Price)
        : (rawLead.Per_Kid_Price !== undefined && rawLead.Per_Kid_Price !== null && !isNaN(Number(rawLead.Per_Kid_Price))
          ? Number(rawLead.Per_Kid_Price)
          : (rawLead.Price_Per_Kid !== undefined && rawLead.Price_Per_Kid !== null && !isNaN(Number(rawLead.Price_Per_Kid))
            ? Number(rawLead.Price_Per_Kid)
            : (rawLead.Child_Price !== undefined && rawLead.Child_Price !== null && !isNaN(Number(rawLead.Child_Price))
              ? Number(rawLead.Child_Price)
              : undefined))))),
    advanceAmountPaid: rawLead.Advance_Amount_Paid ? Number(rawLead.Advance_Amount_Paid) : undefined,
    balancePendingAmount: rawLead.Balance_Pending_Amount ? Number(rawLead.Balance_Pending_Amount) : undefined,
    costingRequestStatus: toSafeString(rawLead.Costing_Request_Status, ''),
    hotels,
    dayActivities,
    rawLeadData: rawLead,
    loadedProductData: loadedProductRecord,
    calculatedPricing
  };
}

/**
 * Optional helper to sync/save calculated Itinerary and Pricing back to Zoho CRM Leads module
 */
export async function updateZohoLeadCalculations(leadId: string, updateMap: Record<string, any>): Promise<boolean> {
  try {
    const token = await getZohoAccessToken();
    const url = getZohoApiUrl(`/crm/v3/Leads/${leadId}`);
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Zoho-oauthtoken ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: [updateMap]
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[Error updating Zoho CRM lead calculations]:', err);
    return false;
  }
}
