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
  tripType: string;
  travelStyle: string;
  finalQuotationAmount?: number;
  costingRequestStatus?: string;
  hotels: ZohoHotelStay[];
  dayActivities: ZohoDayActivity[];
  rawLeadData: Record<string, any>;
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

  if (/^\d{15,22}$/.test(cleanQuery)) {
    try {
      const url = getZohoApiUrl(`/crm/v3/Leads/${cleanQuery}`);
      const res = await fetch(url, {
        headers: { 'Authorization': `Zoho-oauthtoken ${token}` },
        cache: 'no-store'
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
        headers: { 'Authorization': `Zoho-oauthtoken ${token}` },
        cache: 'no-store'
      });

      if (searchRes.ok) {
        const searchJson = await searchRes.json();
        if (searchJson.data && searchJson.data[0]) {
          const foundId = searchJson.data[0].id;
          const fullRes = await fetch(getZohoApiUrl(`/crm/v3/Leads/${foundId}`), {
            headers: { 'Authorization': `Zoho-oauthtoken ${token}` },
            cache: 'no-store'
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

  // 1. Hotels mapping
  const hotels: ZohoHotelStay[] = [];
  for (let i = 1; i <= 4; i++) {
    const hotelObj = rawLead[`Hotel_${i}`];
    const hotelCity = rawLead[`Hotel_${i}_City`] || '';
    const hotelNights = rawLead[`Hotel_${i}_Nights`];
    const hotelStayDates = rawLead[`Hotel_${i}_Stay_Dates`] || '';

    const hotelName = typeof hotelObj === 'object' && hotelObj !== null ? hotelObj.name : (typeof hotelObj === 'string' ? hotelObj : '');
    if (hotelName || hotelCity) {
      hotels.push({
        index: i,
        hotelName: hotelName || 'Standard Hotel',
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
    leadId: String(rawLead.id || ''),
    inquiryId: String(rawLead.Inquiry_ID || ''),
    leadName: String(rawLead.Full_Name || [rawLead.First_Name, rawLead.Last_Name].filter(Boolean).join(' ') || 'Valued Guest'),
    firstName: String(rawLead.First_Name || ''),
    lastName: String(rawLead.Last_Name || ''),
    email: String(rawLead.Email || ''),
    mobile: String(rawLead.Mobile || rawLead.Phone || ''),
    city: String(rawLead.City || ''),
    destinations: String(rawLead.Destinations || rawLead.Destination_Location || rawLead.Destination_State || rawLead.City || ''),
    destinationType: String(rawLead.Destination_Type || 'India'),
    travelStartDate: String(rawLead.Preferred_Start_date || ''),
    travelEndDate: String(rawLead.Travel_End_Date || ''),
    noOfDays: Number(rawLead.No_of_Days) || (dayActivities.length > 0 ? dayActivities.length : 0),
    noOfNights: Number(rawLead.No_of_Nights) || 0,
    numberOfGuests: Number(rawLead.Number_Of_Guest || rawLead.Adults) || 2,
    preferredRoomCategory: String(rawLead.Preferred_Room_Category || 'Standard'),
    mealPlan: String(rawLead.Meal_Plan || rawLead.mealPlan || rawLead.MealPlan || ''),
    tripType: String(rawLead.Trip_Type || 'Customised Trip'),
    travelStyle: String(rawLead.Travel_Style || 'Family Trip'),
    finalQuotationAmount: rawLead.Final_Quotation_Amount ? Number(rawLead.Final_Quotation_Amount) : undefined,
    costingRequestStatus: String(rawLead.Costing_Request_Status || ''),
    hotels,
    dayActivities,
    rawLeadData: rawLead
  };
}
