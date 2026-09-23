import { getZohoAccessToken, getZohoApiUrl } from './zoho';

export interface ZohoHotelStay {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  stayDates: string;
}

export interface ZohoExperienceActivity {
  experienceName: string;
  subTitle?: string;
  description?: string;
  inclusionDescription?: string;
}

export interface ZohoDayActivity {
  dayNumber: number;
  dayText: string;
  city: string;
  experiences: ZohoExperienceActivity[];
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
  tripType: string;
  travelStyle: string;
  finalQuotationAmount?: number;
  costingRequestStatus?: string;
  hotels: ZohoHotelStay[];
  dayActivities: ZohoDayActivity[];
  rawLeadData: Record<string, any>;
}

/**
 * Fetch a Lead record from Zoho CRM by Lead ID, Inquiry ID, or Email/Phone
 */
export async function fetchZohoLeadById(leadIdOrQuery: string): Promise<NormalizedZohoLead | null> {
  const cleanQuery = leadIdOrQuery.trim();
  if (!cleanQuery) return null;

  const token = await getZohoAccessToken();

  let rawLead: Record<string, any> | null = null;

  // 1. If it's a numeric ID (Zoho Lead ID)
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

  // 2. If not found by ID or query is Inquiry ID / Phone / Email, search via Search API
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
          // Fetch full lead by ID to get subforms (Activities_and_Experiences_1)
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

  if (!rawLead) {
    return null;
  }

  // 3. Extract and parse Multi-Hotel details
  const hotels: ZohoHotelStay[] = [];
  for (let i = 1; i <= 4; i++) {
    const hotelObj = rawLead[`Hotel_${i}`];
    const hotelCity = rawLead[`Hotel_${i}_City`];
    const hotelNights = rawLead[`Hotel_${i}_Nights`];
    const hotelStayDates = rawLead[`Hotel_${i}_Stay_Dates`];

    const hotelName = typeof hotelObj === 'object' && hotelObj !== null ? hotelObj.name : (hotelObj || '');
    if (hotelName || hotelCity) {
      hotels.push({
        index: i,
        hotelName: hotelName || 'Curated 5-Star Luxury Stay',
        city: hotelCity || '',
        nights: Number(hotelNights) || 0,
        stayDates: hotelStayDates || ''
      });
    }
  }

  // 4. Extract and parse Activities & Experiences Subform (Activities_and_Experiences_1)
  const dayActivities: ZohoDayActivity[] = [];
  const rawSubform = rawLead.Activities_and_Experiences_1;

  if (Array.isArray(rawSubform)) {
    rawSubform.forEach((row, idx) => {
      const dayText = row.Days || `Day ${idx + 1}`;
      const dayMatch = dayText.match(/\d+/);
      const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : idx + 1;
      const city = row.City || '';

      const experiences: ZohoExperienceActivity[] = [];

      // Experience 1
      const exp1 = row.Experiences_and_activities?.name || row.Experiences_1?.name || (typeof row.Experiences_and_activities === 'string' ? row.Experiences_and_activities : '');
      if (exp1) {
        experiences.push({
          experienceName: exp1,
          subTitle: row.Sub_Title_1 || '',
          description: row.Description_for_template_1 || '',
          inclusionDescription: row.Inclusions_Description_1 || ''
        });
      }

      // Experience 2
      const exp2 = row.Experiences_2?.name || (typeof row.Experiences_2 === 'string' ? row.Experiences_2 : '');
      if (exp2 && exp2 !== exp1) {
        experiences.push({
          experienceName: exp2,
          subTitle: row.Sub_Title_2 || '',
          description: row.Description_for_template_2 || '',
          inclusionDescription: row.Inclusions_Description_2 || ''
        });
      }

      // Experience 3
      const exp3 = row.Experiences_3?.name || (typeof row.Experiences_3 === 'string' ? row.Experiences_3 : '');
      if (exp3 && exp3 !== exp1 && exp3 !== exp2) {
        experiences.push({
          experienceName: exp3,
          subTitle: row.Sub_Title_3 || '',
          description: row.Description_for_template_3 || '',
          inclusionDescription: row.Inclusions_Description_3 || ''
        });
      }

      // Experience 4
      const exp4 = row.Experiences_4?.name || (typeof row.Experiences_4 === 'string' ? row.Experiences_4 : '');
      if (exp4 && exp4 !== exp1 && exp4 !== exp2 && exp4 !== exp3) {
        experiences.push({
          experienceName: exp4,
          subTitle: row.Sub_Title_4 || '',
          description: row.Description_for_template_4 || '',
          inclusionDescription: row.Inclusions_Description_4 || ''
        });
      }

      dayActivities.push({
        dayNumber,
        dayText,
        city,
        experiences
      });
    });
  }

  // Sort day activities in order
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
    destinations: String(rawLead.Destinations || ''),
    destinationType: String(rawLead.Destination_Type || 'India'),
    travelStartDate: String(rawLead.Preferred_Start_date || ''),
    travelEndDate: String(rawLead.Travel_End_Date || ''),
    noOfDays: Number(rawLead.No_of_Days) || 0,
    noOfNights: Number(rawLead.No_of_Nights) || 0,
    numberOfGuests: Number(rawLead.Number_Of_Guest) || 2,
    preferredRoomCategory: String(rawLead.Preferred_Room_Category || 'Deluxe'),
    tripType: String(rawLead.Trip_Type || 'Customised Trip'),
    travelStyle: String(rawLead.Travel_Style || 'Family Trip'),
    finalQuotationAmount: rawLead.Final_Quotation_Amount ? Number(rawLead.Final_Quotation_Amount) : undefined,
    costingRequestStatus: String(rawLead.Costing_Request_Status || ''),
    hotels,
    dayActivities,
    rawLeadData: rawLead
  };
}
