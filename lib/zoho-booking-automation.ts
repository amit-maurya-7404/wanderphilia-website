import { getZohoAccessToken, getZohoApiUrl, parseToZohoDate } from './zoho';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from './email';

export interface BookingPaymentSyncParams {
  itineraryId: string;
  itineraryUrl: string;
  paymentId: string;
  orderId: string;
  paymentType: string;
  paidAmount: number;
  newTotalPaid: number;
  newBalanceDue: number;
  totalQuotationAmount: number;
  invoiceNumber: string;
  zohoLeadId?: string;
  existingDealId?: string;
  customerName: string;
  customerEmail?: string;
  customerMobile?: string;
  destination: string;
  departureCity?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  duration?: string;
  numberOfGuests?: number;
  adults?: number;
  kids?: number;
  kidsDetails?: any[];
  roomsCount?: number;
  sharingType?: string;
  preferredRoomCategory?: string;
  vehicleType?: string;
  mealPlan?: string;
  hotelCategory?: string;
  dayActivities?: any[];
  hotels?: Array<{
    hotelName?: string;
    city?: string;
    nights?: number;
    roomCategory?: string;
    category?: string;
    stayDates?: string;
  }>;
  specialRequirements?: string;
  noOfDays?: number;
  noOfNights?: number;
}

export interface BookingSyncResult {
  success: boolean;
  dealId?: string;
  dealName?: string;
  isNewDeal?: boolean;
  taskId?: string;
  operationsId?: string;
  financeId?: string;
  leadConverted?: boolean;
  error?: string;
}

/**
 * Helper to calculate Due Date: exactly 2 calendar days from now (YYYY-MM-DD)
 */
function getTwoDaysDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Searches for an existing Deal/Booking in Zoho CRM by Itinerary ID or URL
 */
async function findExistingDeal(
  itineraryId: string,
  itineraryUrl: string
): Promise<{ id: string; Deal_Name: string; Adv_Amount?: number; Cost?: number } | null> {
  try {
    const accessToken = await getZohoAccessToken();

    // 1. Search by Itinerary Unique ID
    if (itineraryId) {
      const criteria = `(Itinerary_Unique_ID:equals:${encodeURIComponent(itineraryId.trim())})`;
      const searchUrl = getZohoApiUrl(`/crm/v3/Deals/search?criteria=${criteria}`);
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        cache: 'no-store',
      });
      if (res.ok && res.status !== 204) {
        const json = await res.json();
        if (json.data && json.data.length > 0 && json.data[0].id) {
          return json.data[0];
        }
      }
    }

    // 2. Search by Itinerary URL
    if (itineraryUrl) {
      const criteria = `(Itinerary_URL:equals:${encodeURIComponent(itineraryUrl.trim())})`;
      const searchUrl = getZohoApiUrl(`/crm/v3/Deals/search?criteria=${criteria}`);
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        cache: 'no-store',
      });
      if (res.ok && res.status !== 204) {
        const json = await res.json();
        if (json.data && json.data.length > 0 && json.data[0].id) {
          return json.data[0];
        }
      }
    }

    return null;
  } catch (err) {
    console.warn('[Zoho Find Deal Error]:', err);
    return null;
  }
}

// Cache for Zoho Hotel mapping (name.toLowerCase() -> Zoho Record ID)
let cachedZohoHotelsMap: Map<string, string> | null = null;
let lastHotelsFetchTime = 0;

/**
 * Fetches and caches the mapping of all Zoho CRM Hotels (Name.toLowerCase() -> Record ID)
 */
async function getZohoHotelsMap(accessToken: string): Promise<Map<string, string>> {
  const now = Date.now();
  if (cachedZohoHotelsMap && (now - lastHotelsFetchTime < 10 * 60 * 1000)) {
    return cachedZohoHotelsMap;
  }
  const map = new Map<string, string>();
  try {
    const url = getZohoApiUrl('/crm/v3/Hotel?fields=id,Name&per_page=200');
    const res = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        for (const item of json.data) {
          if (item.Name && item.id) {
            map.set(item.Name.trim().toLowerCase(), String(item.id).trim());
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Zoho Hotels Map Warning]:', err);
  }
  cachedZohoHotelsMap = map;
  lastHotelsFetchTime = now;
  return map;
}

/**
 * Safely resolves a lookup ID object for Zoho CRM lookup fields.
 * If the input already contains a numeric Zoho ID, returns `{ id: String(id) }`.
 * If hotelsMap is provided, searches by hotelName/name.
 * Never returns a plain text string to prevent INVALID_DATA (expected_data_type: bigint) crashes.
 */
function resolveHotelLookupId(hotel: any, hotelsMap?: Map<string, string>): { id: string } | undefined {
  if (!hotel) return undefined;
  const rawId = hotel.id || hotel.hotelId || hotel.zohoHotelId;
  if (rawId && /^\d{15,22}$/.test(String(rawId).trim())) {
    return { id: String(rawId).trim() };
  }
  const hName = (hotel.hotelName || hotel.name || '').trim().toLowerCase();
  if (hName && hotelsMap) {
    let matchId = hotelsMap.get(hName);
    if (!matchId) {
      for (const [name, id] of hotelsMap.entries()) {
        if (name === hName || name.includes(hName) || hName.includes(name)) {
          matchId = id;
          break;
        }
      }
    }
    if (matchId) {
      return { id: matchId };
    }
  }
  return undefined;
}

/**
 * Builds the Hotel fields payload for Deals module
 */
function buildDealHotelPayload(hotels: BookingPaymentSyncParams['hotels'] = [], hotelsMap?: Map<string, string>): Record<string, any> {
  const payload: Record<string, any> = {};

  // Hotel 1
  if (hotels[0]) {
    const lookup = resolveHotelLookupId(hotels[0], hotelsMap);
    if (lookup) payload.st_Hotel = lookup;
    if (hotels[0].city) payload.st_Hotel_City = hotels[0].city;
    if (hotels[0].nights) payload.st_Hotel_Nights = Number(hotels[0].nights);
    if (hotels[0].stayDates) payload.st_Hotel_Stay_Dates = hotels[0].stayDates;
    if (hotels[0].category) payload.Hotel_1_Category = hotels[0].category;
  }

  // Hotel 2
  if (hotels[1]) {
    const lookup = resolveHotelLookupId(hotels[1], hotelsMap);
    if (lookup) payload.nd_Hotel = lookup;
    if (hotels[1].city) payload.nd_Hotel_City = hotels[1].city;
    if (hotels[1].nights) payload.nd_Hotel_Nights = Number(hotels[1].nights);
    if (hotels[1].stayDates) payload.nd_Hotel_Stay_Dates = hotels[1].stayDates;
    if (hotels[1].category) payload.Hotel_2_Category = hotels[1].category;
  }

  // Hotel 3
  if (hotels[2]) {
    const lookup = resolveHotelLookupId(hotels[2], hotelsMap);
    if (lookup) payload.rd_Hotel = lookup;
    if (hotels[2].city) payload.rd_Hotel_City = hotels[2].city;
    if (hotels[2].nights) payload.rd_Hotel_Nights = Number(hotels[2].nights);
    if (hotels[2].stayDates) payload.rd_Hotel_Stay_Dates = hotels[2].stayDates;
    if (hotels[2].category) payload.Hotel_3_Category = hotels[2].category;
  }

  // Hotel 4 (API: th_Hotel2 in Deals)
  if (hotels[3]) {
    const lookup = resolveHotelLookupId(hotels[3], hotelsMap);
    if (lookup) payload.th_Hotel2 = lookup;
    if (hotels[3].city) payload.th_Hotel_City = hotels[3].city;
    if (hotels[3].nights) payload.th_Hotel_Nights2 = Number(hotels[3].nights);
    if (hotels[3].stayDates) payload.th_Hotel_Stay_Dates2 = hotels[3].stayDates;
    if (hotels[3].category) payload.Hotel_4_Category = hotels[3].category;
  }

  // Hotel 5 (API: th_Hotel1 in Deals)
  if (hotels[4]) {
    const lookup = resolveHotelLookupId(hotels[4], hotelsMap);
    if (lookup) payload.th_Hotel1 = lookup;
    if (hotels[4].city) payload.th_Hotel_City1 = hotels[4].city;
    if (hotels[4].nights) payload.th_Hotel_Nights1 = Number(hotels[4].nights);
    if (hotels[4].stayDates) payload.th_Hotel_Stay_Dates1 = hotels[4].stayDates;
    if (hotels[4].category) payload.Hotel_5_Category = hotels[4].category;
  }

  // Hotel 6 (API: th_Hotel in Deals)
  if (hotels[5]) {
    const lookup = resolveHotelLookupId(hotels[5], hotelsMap);
    if (lookup) payload.th_Hotel = lookup;
    if (hotels[5].city) payload.th_Hotel_City2 = hotels[5].city;
    if (hotels[5].nights) payload.th_Hotel_Nights = Number(hotels[5].nights);
    if (hotels[5].stayDates) payload.th_Hotel_Stay_Dates = hotels[5].stayDates;
    if (hotels[5].category) payload.Hotel_6_Category = hotels[5].category;
  }

  return payload;
}

/**
 * Builds the Hotel fields payload for Tasks module
 */
function buildTaskHotelPayload(hotels: BookingPaymentSyncParams['hotels'] = [], hotelsMap?: Map<string, string>): Record<string, any> {
  const payload: Record<string, any> = {};

  // Hotel 1
  if (hotels[0]) {
    const lookup = resolveHotelLookupId(hotels[0], hotelsMap);
    if (lookup) payload.st_Hotel = lookup;
    if (hotels[0].city) payload.st_Hotel_city = hotels[0].city;
    if (hotels[0].nights) payload.st_Hotel_Nights = Number(hotels[0].nights);
    if (hotels[0].stayDates) payload.st_Hotel_Stay_Dates = hotels[0].stayDates;
    if (hotels[0].category) payload.Hotel_1_category = hotels[0].category;
  }

  // Hotel 2
  if (hotels[1]) {
    const lookup = resolveHotelLookupId(hotels[1], hotelsMap);
    if (lookup) payload.nd_Hotel = lookup;
    if (hotels[1].city) payload.nd_Hotel_City = hotels[1].city;
    if (hotels[1].nights) payload.nd_Hotel_Nights = Number(hotels[1].nights);
    if (hotels[1].stayDates) payload.nd_Hotel_Stay_Dates = hotels[1].stayDates;
    if (hotels[1].category) payload.Hotel_2_category = hotels[1].category;
  }

  // Hotel 3
  if (hotels[2]) {
    const lookup = resolveHotelLookupId(hotels[2], hotelsMap);
    if (lookup) payload.rd_Hotel = lookup;
    if (hotels[2].city) payload.rd_Hotel_City = hotels[2].city;
    if (hotels[2].nights) payload.rd_Hotel_Nights = Number(hotels[2].nights);
    if (hotels[2].stayDates) payload.rd_Hotel_Stay_Dates = hotels[2].stayDates;
    if (hotels[2].category) payload.Hotel_3_Category = hotels[2].category;
  }

  // Hotel 4 (In Tasks: th_Hotel1, th_Hotel_city1, th_Hotel_Nights2, th_Hotel_Stay_Dates2)
  if (hotels[3]) {
    const lookup = resolveHotelLookupId(hotels[3], hotelsMap);
    if (lookup) payload.th_Hotel1 = lookup;
    if (hotels[3].city) payload.th_Hotel_city1 = hotels[3].city;
    if (hotels[3].nights) payload.th_Hotel_Nights2 = Number(hotels[3].nights);
    if (hotels[3].stayDates) payload.th_Hotel_Stay_Dates2 = hotels[3].stayDates;
    if (hotels[3].category) payload.Hotel_4_Category = hotels[3].category;
  }

  // Hotel 5 (In Tasks: th_Hotel, th_Hotel_City, th_Hotel_Nights1, th_Hotel_Stay_Dates1)
  if (hotels[4]) {
    const lookup = resolveHotelLookupId(hotels[4], hotelsMap);
    if (lookup) payload.th_Hotel = lookup;
    if (hotels[4].city) payload.th_Hotel_City = hotels[4].city;
    if (hotels[4].nights) payload.th_Hotel_Nights1 = Number(hotels[4].nights);
    if (hotels[4].stayDates) payload.th_Hotel_Stay_Dates1 = hotels[4].stayDates;
    if (hotels[4].category) payload.Hotel_5_Category = hotels[4].category;
  }

  // Hotel 6 (In Tasks: th_Hotel2, th_Hotel_City2, th_Hotel_Nights, th_Hotel_Stay_Dates)
  if (hotels[5]) {
    const lookup = resolveHotelLookupId(hotels[5], hotelsMap);
    if (lookup) payload.th_Hotel2 = lookup;
    if (hotels[5].city) payload.th_Hotel_City2 = hotels[5].city;
    if (hotels[5].nights) payload.th_Hotel_Nights = Number(hotels[5].nights);
    if (hotels[5].stayDates) payload.th_Hotel_Stay_Dates = hotels[5].stayDates;
    if (hotels[5].category) payload.Hotel_6_Category = hotels[5].category;
  }

  return payload;
}

/**
 * Builds the Hotel fields payload for the custom 'Operations' module
 */
function buildOperationsHotelPayload(hotels: BookingPaymentSyncParams['hotels'] = [], hotelsMap?: Map<string, string>): Record<string, any> {
  const payload: Record<string, any> = {};

  for (let i = 1; i <= 6; i++) {
    const h = hotels[i - 1];
    const prefix = `Hotel_${i}`;
    payload[`${prefix}_Booked`] = false;
    if (h) {
      const lookup = resolveHotelLookupId(h, hotelsMap);
      if (lookup) payload[prefix] = lookup;
      if (h.city) payload[`${prefix}_City`] = h.city;
      if (h.nights !== undefined && h.nights !== null) payload[`${prefix}_Nights`] = Number(h.nights);
      if (h.stayDates) payload[`${prefix}_Dates`] = h.stayDates;
      if (h.category) payload[`${prefix}_Category`] = h.category;
    } else {
      payload[prefix] = null;
      payload[`${prefix}_City`] = null;
      payload[`${prefix}_Nights`] = 0;
      payload[`${prefix}_Dates`] = null;
      payload[`${prefix}_Category`] = null;
    }
  }

  payload.Transport_Booked = false;
  payload.Activities_Booked = false;
  payload.All_Hotels_Booked = false;

  return payload;
}

// Cache for Zoho Activities mapping (name -> Zoho Record ID)
let cachedZohoActivitiesMap: Map<string, string> | null = null;
let lastActivitiesFetchTime = 0;

/**
 * Fetches and caches the mapping of all Zoho CRM Activities & Experiences (Name.toLowerCase() -> Record ID)
 */
async function getZohoActivitiesMap(accessToken: string): Promise<Map<string, string>> {
  const now = Date.now();
  if (cachedZohoActivitiesMap && (now - lastActivitiesFetchTime < 10 * 60 * 1000)) {
    return cachedZohoActivitiesMap;
  }
  const map = new Map<string, string>();
  try {
    const url = getZohoApiUrl('/crm/v3/Activities_and_Experiences?fields=id,Name&per_page=200');
    const res = await fetch(url, {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data)) {
        for (const item of json.data) {
          if (item.Name && item.id) {
            map.set(item.Name.trim().toLowerCase(), String(item.id).trim());
          }
        }
      }
    }
  } catch (err) {
    console.warn('[Zoho Activities Map Warning]:', err);
  }
  cachedZohoActivitiesMap = map;
  lastActivitiesFetchTime = now;
  return map;
}

/**
 * Builds the subform rows for Activities_and_Experiences_operations
 */
async function buildOperationsActivitiesSubform(
  accessToken: string,
  dayActivities: any[] = [],
  destination: string = ''
): Promise<any[]> {
  if (!Array.isArray(dayActivities) || dayActivities.length === 0) {
    return [];
  }

  const activitiesMap = await getZohoActivitiesMap(accessToken);
  const rows: any[] = [];

  for (let i = 0; i < dayActivities.length; i++) {
    const day = dayActivities[i];
    const dayText = day.dayText || `Day ${day.dayNumber || day.day || (i + 1)}`;
    const dayCity = day.city || day.stayLocation || destination || '';

    const row: Record<string, any> = {
      Days: dayText,
      City: dayCity,
      Guided_Tour: Boolean(day.guidedTour),
    };

    if (day.city2) {
      row.City_2 = day.city2;
    }

    let rawExps: any[] = [];
    if (Array.isArray(day.experiences) && day.experiences.length > 0) {
      rawExps = day.experiences;
    } else if (Array.isArray(day.activities) && day.activities.length > 0) {
      rawExps = day.activities;
    }

    for (let expIdx = 0; expIdx < Math.min(rawExps.length, 4); expIdx++) {
      const exp = rawExps[expIdx];
      const slot = expIdx + 1;
      const expName = typeof exp === 'string' ? exp : (exp?.name || exp?.title || '');
      const expDesc = typeof exp === 'object' ? (exp?.description || exp?.inclusions || expName) : expName;

      let actId = typeof exp === 'object' ? (exp?.id || exp?.activityId || exp?.zohoId) : null;
      if (!actId && expName) {
        const cleanName = expName.trim().toLowerCase();
        actId = activitiesMap.get(cleanName);
        if (!actId) {
          for (const [name, id] of activitiesMap.entries()) {
            if (name.includes(cleanName) || cleanName.includes(name)) {
              actId = id;
              break;
            }
          }
        }
      }

      if (actId && /^\d{15,22}$/.test(String(actId).trim())) {
        row[`Experience_${slot}`] = { id: String(actId).trim() };
      }

      if (expDesc) {
        row[`Inclusions_Description_${slot}`] = String(expDesc).substring(0, 500);
      }
    }

    rows.push(row);
  }

  return rows;
}

/**
 * Safely looks up an Itinerary in Zoho CRM Itineraries module
 */
async function findZohoItineraryLookup(
  accessToken: string,
  destination: string,
  itineraryId?: string
): Promise<{ id: string } | undefined> {
  if (itineraryId && /^\d{15,22}$/.test(String(itineraryId).trim())) {
    return { id: String(itineraryId).trim() };
  }
  try {
    if (destination) {
      const searchUrl = getZohoApiUrl(`/crm/v3/Itineraries/search?criteria=(Destination:equals:${encodeURIComponent(destination.trim())})`);
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        cache: 'no-store',
      });
      if (res.ok && res.status !== 204) {
        const json = await res.json().catch(() => null);
        if (json?.data && json.data.length > 0 && json.data[0].id) {
          return { id: String(json.data[0].id) };
        }
      }
    }
  } catch (err) {
    console.warn('[Zoho Itinerary Lookup Warning]:', err);
  }
  return undefined;
}

/**
 * Creates or updates a record in the custom 'Operations' module in Zoho CRM
 */
async function syncOperationsRecord(
  accessToken: string,
  dealId: string,
  params: BookingPaymentSyncParams,
  cleanItineraryUrl: string,
  formattedStartDate: string | null,
  formattedEndDate: string | null
): Promise<string> {
  try {
    let existingOpsId = '';

    // 1. Search for existing Operations record linked to this Deal ID or Customer Name
    if (dealId) {
      try {
        const searchCriteria = `(Booking_Id:equals:${encodeURIComponent(dealId.trim())})`;
        const searchUrl = getZohoApiUrl(`/crm/v3/Operations/search?criteria=${searchCriteria}`);
        const searchRes = await fetch(searchUrl, {
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
          cache: 'no-store',
        });
        if (searchRes.ok && searchRes.status !== 204) {
          const searchJson = await searchRes.json().catch(() => null);
          if (searchJson?.data && searchJson.data.length > 0 && searchJson.data[0].id) {
            existingOpsId = String(searchJson.data[0].id);
          }
        }
      } catch (searchErr) {
        console.warn('[Zoho Operations Search Warning]:', searchErr);
      }

      // If not found yet, also search by Customer Name to catch shell records created by Zoho CRM workflow rules
      if (!existingOpsId && params.customerName) {
        try {
          const nameCriteria = `(Customer_Name:equals:${encodeURIComponent(params.customerName.trim())})`;
          const nameUrl = getZohoApiUrl(`/crm/v3/Operations/search?criteria=${nameCriteria}`);
          const nameRes = await fetch(nameUrl, {
            headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
            cache: 'no-store',
          });
          if (nameRes.ok && nameRes.status !== 204) {
            const nameJson = await nameRes.json().catch(() => null);
            if (nameJson?.data && nameJson.data.length > 0 && nameJson.data[0].id) {
              existingOpsId = String(nameJson.data[0].id);
            }
          }
        } catch (nameErr) {
          console.warn('[Zoho Operations Name Search Warning]:', nameErr);
        }
      }
    }

    const resolvedDays = params.noOfDays ||
      (params.duration ? parseInt(params.duration.split('Days')[0]?.split('/')[1] || '1', 10) : 1);
    const resolvedNights = params.noOfNights ||
      (params.duration ? parseInt(params.duration.split('Nights')[0] || '1', 10) : 1);

    const resolvedHotelCategory = params.hotelCategory ||
      params.hotels?.[0]?.category ||
      'Deluxe';

    // Fetch dynamic Hotels lookup map so Hotel 1, Hotel 2, etc. link to Zoho Hotel IDs
    const hotelsMap = await getZohoHotelsMap(accessToken);

    const opsPayload: Record<string, any> = {
      Name: `${params.customerName} - ${params.destination} Tour`,
      Booking_Id: dealId,
      Customer_Name: params.customerName,
      Email: params.customerEmail || undefined,
      Destination: params.destination,
      No_of_Days: resolvedDays,
      No_of_Nights: resolvedNights,
      No_of_Guests: params.numberOfGuests || 2,
      No_of_Adults: params.adults || 2,
      Rooms_Count: params.roomsCount || 1,
      Sharing_Type: params.sharingType || 'Double Sharing',
      Room_Category: params.preferredRoomCategory || 'Deluxe Room',
      Hotel_Category: resolvedHotelCategory,
      Status: 'Pending',
      Itinerary_URL: cleanItineraryUrl,
      ...buildOperationsHotelPayload(params.hotels, hotelsMap),
    };

    // Try linking Itinerary Lookup in Operations
    const itinLookup = await findZohoItineraryLookup(accessToken, params.destination, params.itineraryId);
    if (itinLookup) {
      opsPayload.Itinerary = itinLookup;
    }

    // Map Kids & Age and Child 1-5 details
    const kidsList = Array.isArray(params.kidsDetails) ? params.kidsDetails : [];
    const kidsCount = params.kids !== undefined && params.kids !== null ? Number(params.kids) : kidsList.length;

    if (kidsCount > 0) {
      const ageSummary = kidsList.slice(0, kidsCount).map((c, idx) => {
        const age = c.age !== undefined && c.age !== null ? c.age : 'N/A';
        const bed = c.bedPreference || 'Without Bed';
        return `Child ${idx + 1}: ${age} yrs (${bed})`;
      }).join(', ');
      opsPayload.Kids_Age = ageSummary || `${kidsCount} Kid(s)`;
    } else {
      opsPayload.Kids_Age = '0';
    }

    for (let cIdx = 1; cIdx <= 5; cIdx++) {
      const child = kidsList[cIdx - 1];
      if (child && cIdx <= kidsCount) {
        if (child.age !== undefined && child.age !== null) {
          opsPayload[`Child_${cIdx}_Age`] = String(child.age);
        }
        if (child.bedPreference) {
          opsPayload[`Child_${cIdx}_Bed_Preference`] = String(child.bedPreference);
        }
      } else {
        opsPayload[`Child_${cIdx}_Age`] = null;
        opsPayload[`Child_${cIdx}_Bed_Preference`] = null;
      }
    }

    if (formattedStartDate) opsPayload.Start_Date = formattedStartDate;
    if (formattedEndDate) opsPayload.End_Date = formattedEndDate;

    // Build activities subform
    const subformRows = await buildOperationsActivitiesSubform(
      accessToken,
      params.dayActivities,
      params.destination
    );

    if (subformRows.length > 0) {
      if (existingOpsId) {
        try {
          const existingRecRes = await fetch(
            getZohoApiUrl(`/crm/v3/Operations/${existingOpsId}?fields=Activities_and_Experiences_operations`),
            {
              headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
              cache: 'no-store',
            }
          );
          if (existingRecRes.ok) {
            const existingJson = await existingRecRes.json();
            const existingSubform = existingJson.data?.[0]?.Activities_and_Experiences_operations || [];

            const mergedRows: any[] = [];
            for (let i = 0; i < subformRows.length; i++) {
              if (existingSubform[i]?.id) {
                mergedRows.push({ ...subformRows[i], id: existingSubform[i].id });
              } else {
                mergedRows.push(subformRows[i]);
              }
            }
            for (let i = subformRows.length; i < existingSubform.length; i++) {
              if (existingSubform[i]?.id) {
                mergedRows.push({ id: existingSubform[i].id, _delete: null });
              }
            }
            opsPayload.Activities_and_Experiences_operations = mergedRows;
          } else {
            opsPayload.Activities_and_Experiences_operations = subformRows;
          }
        } catch {
          opsPayload.Activities_and_Experiences_operations = subformRows;
        }
      } else {
        opsPayload.Activities_and_Experiences_operations = subformRows;
      }
    }

    if (existingOpsId) {
      // Update existing record
      const updateUrl = getZohoApiUrl(`/crm/v3/Operations/${existingOpsId}`);
      const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [opsPayload] }),
      });
      if (updateRes.ok) {
        console.log(`[Zoho Operations Module] Successfully updated existing Operations record ${existingOpsId}`);
        return existingOpsId;
      } else {
        const errText = await updateRes.text();
        console.warn('[Zoho Operations Module Update Warning]:', errText);
      }
    } else {
      // Create new record
      const createUrl = getZohoApiUrl('/crm/v3/Operations');
      const createRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [opsPayload] }),
      });
      if (createRes.ok) {
        const createJson = await createRes.json();
        const newOpsId = String(createJson.data?.[0]?.details?.id || '');
        console.log(`[Zoho Operations Module] Successfully created new Operations record ${newOpsId}`);
        return newOpsId;
      } else {
        const errText = await createRes.text();
        console.error('[Zoho Operations Module Create Failed]:', errText);
      }
    }

    return existingOpsId;
  } catch (err) {
    console.error('[Zoho Operations Module Exception]:', err);
    return '';
  }
}

/**
 * Creates or updates a record in the custom 'Finance' module in Zoho CRM with client revenue details.
 * Vendor costs and final hotel allotments are updated later when Operations confirms them.
 */
async function syncFinanceRecord(
  accessToken: string,
  dealId: string,
  params: BookingPaymentSyncParams
): Promise<string> {
  try {
    let existingFinId = '';

    // 1. Search for existing Finance record linked to this Booking_ID
    if (dealId) {
      try {
        const searchCriteria = `(Booking_ID:equals:${encodeURIComponent(dealId.trim())})`;
        const searchUrl = getZohoApiUrl(`/crm/v3/Finance/search?criteria=${searchCriteria}`);
        const searchRes = await fetch(searchUrl, {
          headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
          cache: 'no-store',
        });
        if (searchRes.ok && searchRes.status !== 204) {
          const searchJson = await searchRes.json().catch(() => null);
          if (searchJson?.data && searchJson.data.length > 0 && searchJson.data[0].id) {
            existingFinId = String(searchJson.data[0].id);
          }
        }
      } catch (searchErr) {
        console.warn('[Zoho Finance Search Warning]:', searchErr);
      }
    }

    const paymentStatus = params.newBalanceDue <= 0 ? 'Full Paid' : 'Advance Paid';

    const finPayload: Record<string, any> = {
      Name: `${params.customerName} - ${params.destination} Tour`,
      Booking_ID: dealId,
      Email: params.customerEmail || undefined,
      Total_Receivable_Amount: params.totalQuotationAmount,
      Total_Amount_Received: params.newTotalPaid,
      Balance_Receivable: params.newBalanceDue,
      Payment_Status: paymentStatus,
      Status: 'Pending',
    };

    // Build activities subform for Finance
    const rawSubformRows = await buildOperationsActivitiesSubform(
      accessToken,
      params.dayActivities,
      params.destination
    );

    const financeSubformRows = rawSubformRows.map((r) => {
      const row: Record<string, any> = {
        Days: r.Days,
        City: r.City,
        Guided_Tour: Boolean(r.Guided_Tour),
      };
      if (r.City_2) row.City_2 = r.City_2;
      if (r.En_route_Experiences || r.En_Route_Experiences) {
        row.En_route_Experiences = r.En_route_Experiences || r.En_Route_Experiences;
      }
      if (r.Experience_1) row.Experience_1 = r.Experience_1;
      if (r.Experience_2) row.Experience_2 = r.Experience_2;
      if (r.Experience_3) row.Experience_3 = r.Experience_3;
      if (r.Experience_4) row.Experience_4 = r.Experience_4;
      return row;
    });

    if (financeSubformRows.length > 0) {
      if (existingFinId) {
        try {
          const existingFinRes = await fetch(
            getZohoApiUrl(`/crm/v3/Finance/${existingFinId}?fields=Activities_and_experiences_cost_By_guide`),
            {
              headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
              cache: 'no-store',
            }
          );
          if (existingFinRes.ok) {
            const existingJson = await existingFinRes.json();
            const existingSubform = existingJson.data?.[0]?.Activities_and_experiences_cost_By_guide || [];

            const mergedRows: any[] = [];
            for (let i = 0; i < financeSubformRows.length; i++) {
              if (existingSubform[i]?.id) {
                mergedRows.push({ ...financeSubformRows[i], id: existingSubform[i].id });
              } else {
                mergedRows.push(financeSubformRows[i]);
              }
            }
            for (let i = financeSubformRows.length; i < existingSubform.length; i++) {
              if (existingSubform[i]?.id) {
                mergedRows.push({ id: existingSubform[i].id, _delete: null });
              }
            }
            finPayload.Activities_and_experiences_cost_By_guide = mergedRows;
          } else {
            finPayload.Activities_and_experiences_cost_By_guide = financeSubformRows;
          }
        } catch {
          finPayload.Activities_and_experiences_cost_By_guide = financeSubformRows;
        }
      } else {
        finPayload.Activities_and_experiences_cost_By_guide = financeSubformRows;
      }
    }

    if (existingFinId) {
      // Update existing record (e.g. multi-stage installment / balance payments)
      const updateUrl = getZohoApiUrl(`/crm/v3/Finance/${existingFinId}`);
      const updateRes = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [finPayload] }),
      });
      if (updateRes.ok) {
        console.log(`[Zoho Finance Module] Successfully updated existing Finance record ${existingFinId}`);
        return existingFinId;
      } else {
        const errText = await updateRes.text();
        console.warn('[Zoho Finance Module Update Warning]:', errText);
      }
    } else {
      // Create new record
      const createUrl = getZohoApiUrl('/crm/v3/Finance');
      const createRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [finPayload] }),
      });
      if (createRes.ok) {
        const createJson = await createRes.json();
        const newFinId = String(createJson.data?.[0]?.details?.id || '');
        console.log(`[Zoho Finance Module] Successfully created new Finance record ${newFinId}`);
        return newFinId;
      } else {
        const errText = await createRes.text();
        console.error('[Zoho Finance Module Create Failed]:', errText);
      }
    }

    return existingFinId;
  } catch (err) {
    console.error('[Zoho Finance Module Exception]:', err);
    return '';
  }
}

/**
 * Creates a formatted briefing description for Operations
 */
function buildBriefingDescription(params: BookingPaymentSyncParams): string {
  const hotelList = (params.hotels || [])
    .filter(h => h && h.hotelName)
    .map((h, i) => `${i + 1}. [${h.city || 'City'}] ${h.hotelName} (${h.roomCategory || h.category || 'Standard'}, ${h.nights || 1} Night(s), Dates: ${h.stayDates || 'TBA'})`)
    .join('\n');

  return `=== OPERATIONS BOOKING BRIEFING ===
Customer Name: ${params.customerName}
Phone / Mobile: ${params.customerMobile || 'N/A'}
Email: ${params.customerEmail || 'N/A'}
Destination: ${params.destination}
Travel Dates: ${params.travelStartDate || 'TBA'} to ${params.travelEndDate || 'TBA'} (${params.duration || ''})
Guests: ${params.numberOfGuests || 2} Pax (${params.adults || 2} Adults, ${params.kids || 0} Kids)
Rooms to Book: ${params.roomsCount || 1} Room(s) (${params.sharingType || 'Double Sharing'})
Room Category: ${params.preferredRoomCategory || 'Deluxe Room'}
Meal Plan: ${params.mealPlan || 'Breakfast & Dinner (MAP)'}
Vehicle: ${params.vehicleType || 'Dedicated Private Cab'}
Winning Itinerary Link: ${params.itineraryUrl}

--- HOTEL BOOKING CHECKLIST ---
${hotelList || 'No hotels specified.'}

--- FINANCIAL STATUS ---
Total Quotation: INR ${params.totalQuotationAmount.toLocaleString('en-IN')}
Total Paid: INR ${params.newTotalPaid.toLocaleString('en-IN')}
Balance Due: INR ${params.newBalanceDue.toLocaleString('en-IN')}
Invoice Number: ${params.invoiceNumber}
Last Razorpay ID: ${params.paymentId}

SLA: All hotel and cab arrangements must be confirmed within 48 hours of payment.`;
}

/**
 * Master Function: Handles Lead Conversion or Deal Update + Operations Task Creation
 */
export async function syncBookingAndTaskOnPayment(
  params: BookingPaymentSyncParams
): Promise<BookingSyncResult> {
  const result: BookingSyncResult = { success: false };

  try {
    const accessToken = await getZohoAccessToken();
    const hotelsMap = await getZohoHotelsMap(accessToken);
    const formattedStartDate = parseToZohoDate(params.travelStartDate);
    const formattedEndDate = parseToZohoDate(params.travelEndDate);

    // Closing date default to travel end date or 30 days from now
    const closingDate = formattedEndDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    })();

    const dealStage = params.newBalanceDue <= 0 ? 'Payment completed' : 'Payment Pending';
    const paymentStatus = params.newBalanceDue <= 0 ? 'Fully Paid' : 'Advance Paid';

    // Ensure URL is a valid public URL (Zoho CRM URL validator rejects localhost)
    const cleanItineraryUrl = (params.itineraryUrl || `https://wanderphilia.com/itinerary/${params.itineraryId}`)
      .replace(/https?:\/\/localhost(:\d+)?/i, 'https://wanderphilia.com');

    // 1. Check if Deal/Booking already exists (Multi-stage payment / idempotent check)
    let existingDeal: any = null;
    if (params.existingDealId && /^\d+$/.test(String(params.existingDealId).trim())) {
      existingDeal = { id: String(params.existingDealId).trim() };
    } else {
      existingDeal = await findExistingDeal(params.itineraryId, cleanItineraryUrl);
    }

    let dealId = '';
    let dealName = '';
    let isNewDeal = false;
    let leadConverted = false;

    if (existingDeal && existingDeal.id) {
      // --- A. UPDATE EXISTING DEAL ---
      dealId = String(existingDeal.id);
      dealName = existingDeal.Deal_Name || `${params.customerName} - ${params.destination} Tour`;
      isNewDeal = false;

      console.log(`[Zoho Auto-Booking] Found existing Deal ${dealId}. Updating financial details...`);

      const updateDealPayload = {
        Adv_Amount: params.newTotalPaid,
        Pending_Balance_Amount: params.newBalanceDue,
        Stage: dealStage,
        Payment_Status: paymentStatus,
        Payment_Gateway_Details: `Latest Payment ID: ${params.paymentId} (${params.paymentType}: INR ${params.paidAmount}) on ${new Date().toLocaleString('en-IN')}`,
        Itinerary_URL: cleanItineraryUrl,
      };

      const updateUrl = getZohoApiUrl(`/crm/v3/Deals/${dealId}`);
      await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [updateDealPayload] }),
      });
    } else {
      // --- B. CREATE NEW DEAL (Try Native Lead Convert First) ---
      isNewDeal = true;
      dealName = `${params.customerName} - ${params.destination} Tour`;

      const safeStartDate = formattedStartDate || new Date().toISOString().split('T')[0];
      const safeEndDate = formattedEndDate || closingDate;

      const dealData: Record<string, any> = {
        Deal_Name: dealName,
        Pipeline: 'Wanderphilia Pipeline',
        Closing_Date: safeEndDate,
        Start_Date: safeStartDate,
        End_Date: safeEndDate,
        Stage: dealStage,
        Amount: params.totalQuotationAmount,
        Cost: params.totalQuotationAmount,
        Adv_Amount: params.newTotalPaid,
        Pending_Balance_Amount: params.newBalanceDue,
        Payment_Status: paymentStatus,
        Payment_Mode: 'Online / Razorpay',
        Payment_Gateway_Details: `Payment ID: ${params.paymentId} (${params.paymentType}: INR ${params.paidAmount})`,
        Itinerary_URL: cleanItineraryUrl,
        Itinerary_Unique_ID: params.itineraryId,
        Destination: params.destination,
        Destinations: params.destination,
        Departure_City: params.departureCity || '',
        Number_of_Guests: params.numberOfGuests || 2,
        Number_of_Adults: params.adults || 2,
        No_of_Kids: params.kids !== undefined && params.kids !== null ? String(params.kids) : '0',
        Rooms_Count: params.roomsCount || 1,
        Sharing_Type: params.sharingType || 'Double Sharing',
        Preferred_Room_Category: params.preferredRoomCategory || 'Deluxe Room',
        Mobile: params.customerMobile || '',
        Phone: params.customerMobile || '',
        Country_Code: '+91',
        Description: buildBriefingDescription(params),
        ...buildDealHotelPayload(params.hotels, hotelsMap),
      };

      // Try Converting Lead if zohoLeadId is available
      if (params.zohoLeadId) {
        try {
          const convertUrl = getZohoApiUrl(`/crm/v3/Leads/${params.zohoLeadId}/actions/convert`);

          let convertPayload: Record<string, any> = {
            overwrite: true,
            notify_lead_owner: true,
            notify_new_entity_owner: true,
            Deals: dealData,
          };

          let convertRes = await fetch(convertUrl, {
            method: 'POST',
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: [convertPayload] }),
          });

          let convertJson = await convertRes.json().catch(() => null);

          // Handle if Contact or Account already exists (Zoho DUPLICATE_DATA error)
          const isDuplicate =
            !convertRes.ok &&
            (convertJson?.code === 'DUPLICATE_DATA' ||
              convertJson?.data?.[0]?.code === 'DUPLICATE_DATA');

          const duplicateRecordId =
            convertJson?.details?.duplicate_record?.id ||
            convertJson?.data?.[0]?.details?.duplicate_record?.id;

          const duplicateModule =
            convertJson?.details?.duplicate_record?.module?.api_name ||
            convertJson?.data?.[0]?.details?.duplicate_record?.module?.api_name;

          if (isDuplicate && duplicateRecordId) {
            const existingId = String(duplicateRecordId);
            console.log(`[Zoho Auto-Booking] Linking existing ${duplicateModule || 'Contact'} ${existingId} for Lead conversion...`);
            if (duplicateModule === 'Accounts') {
              convertPayload.Accounts = { id: existingId };
            } else {
              convertPayload.Contacts = { id: existingId };
            }

            convertRes = await fetch(convertUrl, {
              method: 'POST',
              headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ data: [convertPayload] }),
            });
            convertJson = await convertRes.json().catch(() => null);
          }

          const rawDeals =
            convertJson?.data?.[0]?.Deals ||
            convertJson?.data?.[0]?.deals ||
            convertJson?.data?.[0]?.deal_id ||
            convertJson?.data?.[0]?.Deal_Id ||
            convertJson?.data?.[0]?.details?.id ||
            convertJson?.details?.id;

          if (rawDeals) {
            dealId = typeof rawDeals === 'object' && rawDeals.id ? String(rawDeals.id) : String(rawDeals);
            leadConverted = true;
            console.log(`[Zoho Auto-Booking] Successfully converted Lead ${params.zohoLeadId} into Deal ${dealId}`);
          } else {
            console.warn('[Zoho Lead Convert Fallback]: Checking if Lead was already converted...', convertJson);
            try {
              const leadCheckRes = await fetch(getZohoApiUrl(`/crm/v3/Leads/${params.zohoLeadId}?fields=Converted,Converted_Deal`), {
                headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
                cache: 'no-store',
              });
              if (leadCheckRes.ok) {
                const leadCheck = await leadCheckRes.json().catch(() => null);
                const convDeal = leadCheck?.data?.[0]?.Converted_Deal;
                if (convDeal?.id) {
                  dealId = String(convDeal.id);
                  leadConverted = true;
                  console.log(`[Zoho Auto-Booking] Lead ${params.zohoLeadId} already has Converted Deal ${dealId}`);
                }
              }
            } catch (leadCheckErr) {
              console.warn('[Zoho Lead Check Exception]:', leadCheckErr);
            }
          }
        } catch (convertErr) {
          console.warn('[Zoho Lead Convert Exception]:', convertErr);
        }
      }

      // Prevent duplicate deal creation: Check if a deal was already created for this payment or itinerary
      if (!dealId) {
        const existingByPayment = await findExistingDeal(params.itineraryId, cleanItineraryUrl);
        if (existingByPayment && existingByPayment.id) {
          dealId = String(existingByPayment.id);
          console.log(`[Zoho Auto-Booking] Found existing Deal ${dealId} by itinerary match before direct creation.`);
        }
      }

      // If Lead Conversion didn't produce dealId and no existing deal was found, create Deal directly
      if (!dealId) {
        const createDealUrl = getZohoApiUrl('/crm/v3/Deals');
        const dealRes = await fetch(createDealUrl, {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [dealData] }),
        });

        if (dealRes.ok) {
          const dealJson = await dealRes.json();
          if (dealJson.data && dealJson.data[0] && dealJson.data[0].details?.id) {
            dealId = String(dealJson.data[0].details.id);
            console.log(`[Zoho Auto-Booking] Created new Deal ${dealId}`);
          }
        } else {
          const errText = await dealRes.text();
          console.error('[Zoho Direct Deal Creation Failed]:', errText);
        }
      }
    }

    result.dealId = dealId;
    result.dealName = dealName;
    result.isNewDeal = isNewDeal;
    result.leadConverted = leadConverted;

    // 2. CREATE OPERATIONS TASK (Linked to this Deal)
    let taskId = '';
    if (dealId) {
      try {
        const dueDate = getTwoDaysDueDate();

        const taskData: Record<string, any> = {
          Subject: `Operations: Book Hotel & Transport for ${params.customerName} - ${params.destination}`,
          What_Id: dealId,
          $se_module: 'Deals',
          Booking_Id: dealId,
          Booking_Name: dealName,
          Customer_Name: params.customerName,
          Priority: 'High',
          Status: 'Not Started',
          Due_Date: dueDate,
          Destinations: params.destination,
          Rooms_Count: params.roomsCount || 1,
          Sharing_Type: params.sharingType || 'Double Sharing',
          Preferred_Room_Category: params.preferredRoomCategory || 'Deluxe Room',
          Vehicle_Type: params.vehicleType || 'Dedicated Private Cab',
          Itinerary_URL: cleanItineraryUrl,
          Itinerary_Unique_ID: params.itineraryId,
          Hotel_Booked: false,
          Transport_Arranged: false,
          Total_Amount: params.totalQuotationAmount,
          Advance_Amount_Paid: params.newTotalPaid,
          Balance_Pending_Amount: params.newBalanceDue,
          Mobile: params.customerMobile || '',
          Phone: params.customerMobile || '',
          Description: buildBriefingDescription(params),
          ...buildTaskHotelPayload(params.hotels, hotelsMap),
        };

        if (formattedStartDate) taskData.Travel_Start_Date = formattedStartDate;
        if (formattedEndDate) taskData.Travel_End_Date = formattedEndDate;

        const createTaskUrl = getZohoApiUrl('/crm/v3/Tasks');
        const taskRes = await fetch(createTaskUrl, {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [taskData] }),
        });

        if (taskRes.ok) {
          const taskJson = await taskRes.json();
          if (taskJson.data && taskJson.data[0] && taskJson.data[0].details?.id) {
            taskId = String(taskJson.data[0].details.id);
            console.log(`[Zoho Auto-Booking] Created Operations Task ${taskId} linked to Deal ${dealId}`);
          }
        } else {
          const errText = await taskRes.text();
          console.warn('[Zoho Auto-Booking Task Warning]:', errText);
        }
      } catch (taskErr) {
        console.error('[Zoho Auto-Booking Task Error]:', taskErr);
      }
    }

    result.taskId = taskId;

    // 2.5 CREATE OR UPDATE RECORD IN ZOHO 'OPERATIONS' CUSTOM MODULE
    let operationsId = '';
    if (dealId) {
      operationsId = await syncOperationsRecord(
        accessToken,
        dealId,
        params,
        cleanItineraryUrl,
        formattedStartDate,
        formattedEndDate
      );
    }
    result.operationsId = operationsId;

    // 2.6 CREATE OR UPDATE RECORD IN ZOHO 'FINANCE' CUSTOM MODULE (Client Revenue Details)
    let financeId = '';
    if (dealId) {
      financeId = await syncFinanceRecord(
        accessToken,
        dealId,
        params
      );
    }
    result.financeId = financeId;
    result.success = Boolean(dealId);

    // 3. SEND INSTANT EMAIL ALERT TO BHAVIN
    try {
      const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; }
    .card { max-width: 620px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background: #6E1E14; color: white; padding: 24px; }
    .content { padding: 24px; font-size: 14px; color: #1e293b; }
    .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
    .field { margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; display: flex; justify-content: space-between; }
    .label { color: #64748b; font-weight: bold; font-size: 12.5px; }
    .value { font-weight: bold; text-align: right; }
    .btn { display: inline-block; background: #ea580c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 15px; }
    .alert-box { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">ZOHO AUTOMATION LIVE</span>
      <h2 style="margin: 8px 0 0 0; font-size: 20px;">🎉 Booking &amp; Operations Task Created!</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Payment successfully received via Itinerary link</p>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>⚡ Operations 48-Hour SLA Active:</strong> Due Date set to <strong>${getTwoDaysDueDate()}</strong>. Hotels &amp; cab must be secured within 2 days!
      </div>

      <div class="field">
        <span class="label">Customer Name:</span>
        <span class="value">${params.customerName}</span>
      </div>
      <div class="field">
        <span class="label">Destination:</span>
        <span class="value">${params.destination}</span>
      </div>
      <div class="field">
        <span class="label">Travel Dates:</span>
        <span class="value">${params.travelStartDate || 'TBA'} to ${params.travelEndDate || 'TBA'}</span>
      </div>
      <div class="field">
        <span class="label">Amount Paid:</span>
        <span class="value" style="color: #16a34a; font-size: 15px;">₹${params.paidAmount.toLocaleString('en-IN')} (${params.paymentType})</span>
      </div>
      <div class="field">
        <span class="label">Total Paid to Date:</span>
        <span class="value">₹${params.newTotalPaid.toLocaleString('en-IN')} / ₹${params.totalQuotationAmount.toLocaleString('en-IN')}</span>
      </div>
      <div class="field">
        <span class="label">Remaining Balance:</span>
        <span class="value" style="color: #6E1E14;">₹${params.newBalanceDue.toLocaleString('en-IN')}</span>
      </div>
      <div class="field">
        <span class="label">Zoho Booking (Deal) ID:</span>
        <span class="value">${dealId || 'Created'}</span>
      </div>
      <div class="field">
        <span class="label">Zoho Operations Task ID:</span>
        <span class="value">${taskId || 'Created'}</span>
      </div>

      <p style="margin-top: 20px; font-weight: bold; margin-bottom: 5px;">Final Winning Itinerary Link:</p>
      <a href="${params.itineraryUrl}" target="_blank" class="btn">View Customer Itinerary</a>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `⚡ [Zoho Auto-Booking] ${params.customerName} - ₹${params.paidAmount.toLocaleString('en-IN')} (${params.destination})`,
        html: adminHtml,
      });
    } catch (emailErr) {
      console.warn('[Zoho Auto-Booking Email Warning]:', emailErr);
    }

    return result;
  } catch (error: any) {
    console.error('[Zoho Auto-Booking Master Exception]:', error);
    result.error = error.message || String(error);
    return result;
  }
}
