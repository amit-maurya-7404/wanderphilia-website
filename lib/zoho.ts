/**
 * Zoho CRM Client Utilities
 * Implements access token retrieval with serverless in-memory caching and URL resolution.
 */

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

    return cachedAccessToken;
  } catch (error) {
    console.error('[Zoho Access Token Fetcher Error]:', error);
    throw error;
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

/**
 * Submits form leads to Zoho CRM Web-to-Lead endpoint.
 */
export async function submitToZohoCRM(data: {
  name: string
  email: string
  phone?: string
  message?: string
  leadSource: string
  tripTitle?: string
  tripPrice?: number
}) {
  const portalId = process.env.ZOHO_CRM_PORTAL_ID
  const formId = data.leadSource === 'Website Contact Us'
    ? process.env.ZOHO_CRM_CONTACT_FORM_ID
    : process.env.ZOHO_CRM_CALLBACK_FORM_ID
  const url = process.env.ZOHO_CRM_URL || 'https://crm.zoho.in/crm/WebToLeadForm'

  if (!portalId || !formId) {
    console.warn(`[Zoho CRM] Missing ZOHO_CRM_PORTAL_ID or ZOHO_CRM_FORM_ID for ${data.leadSource}. Lead submission skipped.`)
    return { success: false, reason: 'missing_config' }
  }

  // Zoho CRM Web-to-Lead requires "Last Name" as a mandatory field
  const nameParts = data.name.trim().split(/\s+/)
  const firstName = nameParts.length > 1 ? nameParts[0] : ''
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0]

  let description = data.message || ''
  if (data.tripTitle) {
    description = `Interested Trip: ${data.tripTitle}\nPrice: INR ${data.tripPrice || 'N/A'}\n${description}`
  }

  const formData = new URLSearchParams()
  formData.append('xnQsjsdp', portalId)
  formData.append('xmIwtg', formId)
  formData.append('actionType', 'Leads')
  formData.append('First Name', firstName)
  formData.append('Last Name', lastName)
  formData.append('Email', email)
  if (data.phone) {
    formData.append('Phone', data.phone)
  }
  formData.append('Description', description)
  formData.append('Lead Source', data.leadSource)

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

    console.log(`[Zoho CRM] Lead successfully submitted to Zoho CRM for ${data.email}`)
    return { success: true }
  } catch (error) {
    console.error('[Zoho CRM] Error submitting lead to Zoho CRM:', error)
    return { success: false, error: (error as Error).message }
  }
}
