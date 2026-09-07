import { trips } from './data';

/**
 * Zoho CRM Client Utilities
 * Implements access token retrieval with serverless in-memory caching and URL resolution.
 */

export function getDestinationFromTrip(tripTitleOrSlug: string | undefined): string {
  if (!tripTitleOrSlug) return '';
  
  const clean = tripTitleOrSlug.trim();
  const cleanLower = clean.toLowerCase();
  
  // 1. Direct match with a destination in our trips list
  const directMatch = trips.find(t => 
    t.destination.toLowerCase() === cleanLower
  );
  if (directMatch) {
    return directMatch.destination;
  }
  
  // 2. Match with trip title, slug, or ID
  const matchedTrip = trips.find(t =>
    t.title.toLowerCase() === cleanLower ||
    t.slug.toLowerCase() === cleanLower ||
    t.id === clean
  );
  if (matchedTrip) {
    return matchedTrip.destination;
  }
  
  // 3. Substring search in all unique destinations
  const destinations = Array.from(new Set(trips.map(t => t.destination)));
  for (const dest of destinations) {
    if (cleanLower.includes(dest.toLowerCase())) {
      return dest;
    }
  }
  
  // 4. Custom keyword mappings
  if (cleanLower.includes('leh') || cleanLower.includes('ladakh')) {
    return 'Leh Ladakh';
  }
  if (cleanLower.includes('spiti')) {
    return 'Spiti Valley';
  }
  if (cleanLower.includes('himachal')) {
    return 'Himachal Pradesh';
  }

  return '';
}

let cachedAccessToken: string | null = null;
let tokenExpiryTime: number = 0; // Epoch timestamp in milliseconds

/**
 * Retrieves a Zoho CRM access token, fetching a new one or reusing a cached token.
 */
export async function getZohoAccessToken(): Promise<string> {
  const now = Date.now();

  // Reuse token if it is cached and has more than 30 seconds of lifetime remaining
  if (cachedAccessToken && tokenExpiryTime > now + 30000) {
    return cachedAccessToken;
  }

  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Missing required environment variables for Zoho CRM integration: ' +
      'ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, or ZOHO_REFRESH_TOKEN.'
    );
  }

  try {
    const response = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
      }).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Zoho accounts token request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    if (!data.access_token) {
      throw new Error(`Zoho Accounts token response was invalid: ${JSON.stringify(data)}`);
    }

    cachedAccessToken = data.access_token;
    // Default to 1 hour (3600 seconds) if expires_in is not provided in response
    const expiresInSeconds = data.expires_in ? Number(data.expires_in) : 3600;
    tokenExpiryTime = now + expiresInSeconds * 1000;

    return data.access_token;
  } catch (error) {
    console.error('[Zoho Access Token Fetcher Error]:', error);
    throw error;
  }
}

export function parseToZohoDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  const cleaned = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  try {
    const dayMatch = cleaned.match(/^(\d+)/);
    if (!dayMatch) return null;
    const day = parseInt(dayMatch[1], 10);

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const lowerStr = cleaned.toLowerCase();
    let monthIdx = -1;
    for (let i = 0; i < months.length; i++) {
      if (lowerStr.includes(months[i])) {
        monthIdx = i;
        break;
      }
    }

    if (monthIdx === -1) return null;

    const year = new Date().getFullYear();
    const mm = (monthIdx + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');

    return `${year}-${mm}-${dd}`;
  } catch (e) {
    return null;
  }
}

/**
 * Builds the fully qualified URL for Zoho CRM endpoints based on the configured api domain.
 */
export function getZohoApiUrl(endpoint: string): string {
  const apiDomain = process.env.ZOHO_API_DOMAIN || 'zohoapis.in';

  // Ensure we extract a clean base domain without any leading protocol or 'www.' prefix
  const cleanDomain = apiDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  return `https://www.${cleanDomain}${cleanEndpoint}`;
}

export interface ZohoLeadData {
  name: string
  email: string
  phone?: string
  mobile?: string
  message?: string
  leadSource: string
  leadStatus?: string
  tripTitle?: string
  tripSlug?: string
  tripPrice?: number
  destination?: string
  itineraryId?: string
  numberOfGuests?: number
  sharingType?: string
  startDate?: string
  endDate?: string
  pricingOptions?: string
  totalAmount?: number
}

/**
 * Submits form leads to Zoho CRM (Direct API V3 with Web-to-Lead fallback).
 */
export async function submitToZohoCRM(data: ZohoLeadData) {
  let destination = data.destination || getDestinationFromTrip(data.tripTitle || data.tripSlug);
  if (!destination && data.message) {
    destination = getDestinationFromTrip(data.message);
  }

  const exactTrip = trips.find(t => t.slug === (data.tripSlug || '').trim() || t.title === (data.tripTitle || '').trim());
  const itineraryId = data.itineraryId || (exactTrip ? exactTrip.id : data.tripSlug || data.tripTitle || '');
  const contactNumber = data.mobile || data.phone || '';

  // Try direct API V3 first (most reliable, bypasses Web-to-Lead approvals & captchas)
  try {
    const accessToken = await getZohoAccessToken()
    const url = getZohoApiUrl('/crm/v3/Leads')

    const nameParts = data.name.trim().split(/\s+/)
    const firstName = nameParts.length > 1 ? nameParts[0] : ''
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

    let descriptionParts: string[] = []
    if (data.tripTitle) descriptionParts.push(`Trip: ${data.tripTitle}`)
    if (data.startDate && data.endDate) descriptionParts.push(`Dates: ${data.startDate} to ${data.endDate}`)
    if (data.numberOfGuests) descriptionParts.push(`Guests: ${data.numberOfGuests}`)
    if (data.sharingType) descriptionParts.push(`Sharing: ${data.sharingType}`)
    if (data.pricingOptions) descriptionParts.push(`Options: ${data.pricingOptions}`)
    if (data.totalAmount) descriptionParts.push(`Total Amount: INR ${data.totalAmount}`)
    if (data.tripPrice) descriptionParts.push(`Price: INR ${data.tripPrice}`)
    if (data.message) descriptionParts.push(`Message: ${data.message}`)

    const description = descriptionParts.join('\n')

    const leadRecord: Record<string, any> = {
      First_Name: firstName,
      Last_Name: lastName,
      Email: data.email,
      Mobile: contactNumber,
      Description: description,
      Lead_Source: data.leadSource || 'Website',
      Lead_Status: data.leadStatus || 'New Enquiry',
      Event_Category: itineraryId || data.tripTitle || '',
      Destinations: destination || '',
    }

    if (itineraryId) {
      leadRecord.Itinerary_Unique_id = itineraryId
    }
    if (data.numberOfGuests && data.numberOfGuests > 0) {
      leadRecord.Number_Of_Guest = data.numberOfGuests
    }
    if (data.sharingType) {
      leadRecord.Sharing_Type = data.sharingType
    }
    const formattedStartDate = parseToZohoDate(data.startDate)
    if (formattedStartDate) {
      leadRecord.Preferred_Start_date = formattedStartDate
    }
    const formattedEndDate = parseToZohoDate(data.endDate)
    if (formattedEndDate) {
      leadRecord.Travel_End_Date = formattedEndDate
    }

    const payload = {
      data: [leadRecord]
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Zoho API returned status ${response.status}: ${errorText}`)
    }

    const resData = await response.json()
    if (resData.data && resData.data[0] && resData.data[0].status === 'success') {
      const createdLeadId = resData.data[0].details?.id
      console.log(`[Zoho CRM API V3] Lead successfully created for ${data.email} with ID ${createdLeadId}`)
      return { success: true, leadId: createdLeadId }
    } else {
      throw new Error(`Zoho API payload result failed: ${JSON.stringify(resData)}`)
    }
  } catch (apiError) {
    console.error('[Zoho CRM API V3 Error, falling back to Web-To-Lead]:', apiError)
  }

  // Fallback: Submit form leads to Zoho CRM Web-to-Lead endpoint.
  const portalId = process.env.ZOHO_CRM_PORTAL_ID
  const formId = data.leadSource === 'Website Contact Us'
    ? process.env.ZOHO_CRM_CONTACT_FORM_ID
    : process.env.ZOHO_CRM_CALLBACK_FORM_ID
  const url = process.env.ZOHO_CRM_URL || 'https://crm.zoho.in/crm/WebToLeadForm'

  if (!portalId || !formId) {
    console.warn(`[Zoho CRM Web-to-Lead Fallback Skipped] Missing ZOHO_CRM_PORTAL_ID or ZOHO_CRM_FORM_ID for ${data.leadSource}.`)
    return { success: false, reason: 'missing_config' }
  }

  const nameParts = data.name.trim().split(/\s+/)
  const firstName = nameParts.length > 1 ? nameParts[0] : ''
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

  let descriptionParts: string[] = []
  if (data.tripTitle) descriptionParts.push(`Trip: ${data.tripTitle}`)
  if (data.startDate && data.endDate) descriptionParts.push(`Dates: ${data.startDate} to ${data.endDate}`)
  if (data.numberOfGuests) descriptionParts.push(`Guests: ${data.numberOfGuests}`)
  if (data.pricingOptions) descriptionParts.push(`Options: ${data.pricingOptions}`)
  if (data.totalAmount) descriptionParts.push(`Total Amount: INR ${data.totalAmount}`)
  if (data.tripPrice) descriptionParts.push(`Price: INR ${data.tripPrice}`)
  if (data.message) descriptionParts.push(`Message: ${data.message}`)

  const description = descriptionParts.join('\n')

  const formData = new URLSearchParams()
  formData.append('xnQsjsdp', portalId)
  formData.append('xmIwtg', formId)
  formData.append('actionType', 'Leads')
  formData.append('First Name', firstName)
  formData.append('Last Name', lastName)
  formData.append('Email', data.email)
  if (contactNumber) {
    formData.append('Mobile', contactNumber)
  }
  formData.append('Description', description)
  formData.append('Lead Source', data.leadSource)
  if (destination) {
    formData.append('Destinations', destination)
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })

    if (!response.ok) {
      throw new Error(`Zoho returned status: ${response.status}`)
    }

    console.log(`[Zoho CRM Web-to-Lead Fallback Success] Lead successfully submitted for ${data.email}`)
    return { success: true }
  } catch (error) {
    console.error('[Zoho CRM Web-to-Lead Fallback Error]:', error)
    return { success: false, error: (error as Error).message }
  }
}
