import { getZohoAccessToken, getZohoApiUrl } from './zoho';

export interface ZohoHotelStay {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  stayDates: string;
}

export interface ZohoExperienceItem {
  name: string;
  subTitle?: string;
  description?: string;
  inclusionDescription?: string;
}

export interface ZohoDayActivity {
  dayNumber: number;
  dayText: string;
  city: string;
  city2?: string;
  enRouteExperiences?: string;
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
  hotels: ZohoHotelStay[];
  dayActivities: ZohoDayActivity[];
  rawLeadData: Record<string, any>;
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
 * Fetch Lead from Zoho CRM by ID or Inquiry ID
 * Accurately extracts Days, City, City_2, En_route_Experiences, and Subform data
 */
export async function fetchZohoLeadById(leadIdOrQuery: string): Promise<NormalizedZohoLead | null> {
  const cleanQuery = leadIdOrQuery.trim();
  if (!cleanQuery) return null;

  const token = await getZohoAccessToken();
  let rawLead: Record<string, any> | null = null;
  const timestamp = Date.now();

  const fetchHeaders = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

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

  if (!rawLead) {
    try {
      const searchUrl = getZohoApiUrl(`/crm/v3/Leads/search?criteria=((Inquiry_ID:equals:${encodeURIComponent(cleanQuery)})or(Email:equals:${encodeURIComponent(cleanQuery)})or(Mobile:equals:${encodeURIComponent(cleanQuery)}))`);
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

  // 1. Hotels mapping (supports up to 10 hotels from Zoho CRM)
  const hotels: ZohoHotelStay[] = [];
  for (let i = 1; i <= 10; i++) {
    // Zoho CRM custom fields can be named Hotel_i, th_Hotel (5th), th_Hotel1 (6th), etc.
    const altKey = i === 5 ? 'th_Hotel' : (i > 5 ? `th_Hotel${i - 5}` : '');
    const hotelObj = rawLead[`Hotel_${i}`] || (altKey ? rawLead[altKey] : undefined) || rawLead[`${i}th_Hotel`] || rawLead[`X${i}th_Hotel`];
    const hotelCity = rawLead[`Hotel_${i}_City`] || rawLead[`${i}th_Hotel_City`] || (altKey ? rawLead[`${altKey}_City`] : undefined) || '';
    const hotelNights = rawLead[`Hotel_${i}_Nights`] || rawLead[`${i}th_Hotel_Nights`] || (altKey ? rawLead[`${altKey}_Nights`] : undefined);
    const hotelStayDates = rawLead[`Hotel_${i}_Stay_Dates`] || rawLead[`${i}th_Hotel_Stay_Dates`] || (altKey ? rawLead[`${altKey}_Stay_Dates`] : undefined) || '';

    const rawHotelName = typeof hotelObj === 'object' && hotelObj !== null ? hotelObj.name : (typeof hotelObj === 'string' ? hotelObj : '');
    let cleanHName = (rawHotelName || '').trim();
    if (/^(?:Standard|Deluxe|Selected|3[- ]?Star|4[- ]?Star|5[- ]?Star|Luxury|Budget|Premium)\s*(?:Hotel|Property|Resort)?$/i.test(cleanHName) || cleanHName.toLowerCase() === 'standard' || cleanHName.toLowerCase() === 'deluxe') {
      cleanHName = 'Hotel';
    }
    if (cleanHName || hotelCity) {
      hotels.push({
        index: i,
        hotelName: cleanHName || 'Hotel',
        city: hotelCity,
        nights: Number(hotelNights) || 0,
        stayDates: hotelStayDates
      });
    }
  }

  // 2. Activities & Experiences Subform (Activities_and_Experiences_1)
  const dayActivities: ZohoDayActivity[] = [];
  const rawSubform = rawLead.Activities_and_Experiences_1;

  if (Array.isArray(rawSubform)) {
    rawSubform.forEach((row, idx) => {
      const dayText = String(row.Days || `Day ${idx + 1}`).trim();
      const dayMatch = dayText.match(/\d+/);
      const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : idx + 1;
      const city = String(row.City || '').trim();
      const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? row.Transit_city ?? '';
      const city2 = (typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '')).trim();

      const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? row.En_Route_Experiences ?? row.En_route ?? row.Enroute ?? row.en_route_experiences ?? '';
      const enRouteExperiences = (typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : String(rawEnRoute || '')).trim();
      const pdfDescription = String(row.PDF_Description || '').trim();

      const experiences: ZohoExperienceItem[] = [];
      const seenExpNames = new Set<string>();

      for (let e = 1; e <= 10; e++) {
        const expKey = e === 1 ? (row.Experiences_and_activities || row.Experiences_1) : row[`Experiences_${e}`];
        if (!expKey) continue;
        const expName = (typeof expKey === 'object' && expKey !== null ? expKey.name : (typeof expKey === 'string' ? expKey : '')).trim();

        if (expName && !seenExpNames.has(expName.toLowerCase())) {
          seenExpNames.add(expName.toLowerCase());
          experiences.push({
            name: expName,
            subTitle: String(row[`Sub_Title_${e}`] || '').trim(),
            description: String(row[`Description_for_template_${e}`] || '').trim(),
            inclusionDescription: String(row[`Inclusions_Description_${e}`] || '').trim()
          });
        }
      }

      dayActivities.push({
        dayNumber,
        dayText,
        city,
        city2: city2 || undefined,
        enRouteExperiences: enRouteExperiences || undefined,
        experiences,
        pdfDescription: pdfDescription || undefined
      });
    });
  }

  dayActivities.sort((a, b) => a.dayNumber - b.dayNumber);

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
    travelStartDate: toSafeString(rawLead.Preferred_Start_date, ''),
    travelEndDate: toSafeString(rawLead.Travel_End_Date, ''),
    noOfDays: Number(rawLead.No_of_Days) || (dayActivities.length > 0 ? dayActivities.length : 0),
    noOfNights: Number(rawLead.No_of_Nights) || 0,
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
    mealPlan: toSafeString(rawLead.Meal_Plan || rawLead.mealPlan || rawLead.MealPlan, ''),
    vehicleType: toSafeString(rawLead.Vehicle_Type || rawLead.Vehicle || rawLead.vehicleType || rawLead.Cab_Type, 'AC Vehicle'),
    tripType: toSafeString(rawLead.Trip_Type, 'Customised Trip'),
    travelStyle: toSafeString(rawLead.Travel_Style, 'Family Trip'),
    finalQuotationAmount: rawLead.Final_Quotation_Amount ? Number(rawLead.Final_Quotation_Amount) : (rawLead.Total_Package_Cost ? Number(rawLead.Total_Package_Cost) : (rawLead.Quotation_Amount ? Number(rawLead.Quotation_Amount) : (rawLead.Expected_Revenue ? Number(rawLead.Expected_Revenue) : (rawLead.Amount ? Number(rawLead.Amount) : undefined)))),
    marginPercentage: rawLead.Margin_Percentage !== undefined ? Number(rawLead.Margin_Percentage) : (rawLead.Margin !== undefined ? Number(rawLead.Margin) : (rawLead.Markup !== undefined ? Number(rawLead.Markup) : undefined)),
    perAdultPrice: rawLead.Per_Adult_Cost !== undefined && rawLead.Per_Adult_Cost !== null && !isNaN(Number(rawLead.Per_Adult_Cost))
      ? Number(rawLead.Per_Adult_Cost)
      : (rawLead.Per_Adult_Price !== undefined && rawLead.Per_Adult_Price !== null && !isNaN(Number(rawLead.Per_Adult_Price))
        ? Number(rawLead.Per_Adult_Price)
        : (rawLead.Price_Per_Adult !== undefined && rawLead.Price_Per_Adult !== null && !isNaN(Number(rawLead.Price_Per_Adult))
          ? Number(rawLead.Price_Per_Adult)
          : (rawLead.Adult_Price !== undefined && rawLead.Adult_Price !== null && !isNaN(Number(rawLead.Adult_Price))
            ? Number(rawLead.Adult_Price)
            : undefined))),
    perKidPrice: rawLead.Per_Child_Cost !== undefined && rawLead.Per_Child_Cost !== null && !isNaN(Number(rawLead.Per_Child_Cost))
      ? Number(rawLead.Per_Child_Cost)
      : (rawLead.Per_Child_Price !== undefined && rawLead.Per_Child_Price !== null && !isNaN(Number(rawLead.Per_Child_Price))
        ? Number(rawLead.Per_Child_Price)
        : (rawLead.Per_Kid_Price !== undefined && rawLead.Per_Kid_Price !== null && !isNaN(Number(rawLead.Per_Kid_Price))
          ? Number(rawLead.Per_Kid_Price)
          : (rawLead.Price_Per_Kid !== undefined && rawLead.Price_Per_Kid !== null && !isNaN(Number(rawLead.Price_Per_Kid))
            ? Number(rawLead.Price_Per_Kid)
            : (rawLead.Child_Price !== undefined && rawLead.Child_Price !== null && !isNaN(Number(rawLead.Child_Price))
              ? Number(rawLead.Child_Price)
              : undefined)))),
    advanceAmountPaid: rawLead.Advance_Amount_Paid ? Number(rawLead.Advance_Amount_Paid) : undefined,
    balancePendingAmount: rawLead.Balance_Pending_Amount ? Number(rawLead.Balance_Pending_Amount) : undefined,
    costingRequestStatus: toSafeString(rawLead.Costing_Request_Status, ''),
    hotels,
    dayActivities,
    rawLeadData: rawLead
  };
}
