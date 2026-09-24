import { MongoClient } from 'mongodb';

// Load credentials from environment
const clientId = process.env.ZOHO_CLIENT_ID;
const clientSecret = process.env.ZOHO_CLIENT_SECRET;
const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
const apiDomain = process.env.ZOHO_API_DOMAIN || 'zohoapis.in';

async function getAccessToken() {
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token'
  });
  const res = await fetch('https://accounts.zoho.in/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  const data = await res.json();
  return data.access_token;
}

async function inspectLead() {
  const token = await getAccessToken();
  const searchUrl = `https://www.${apiDomain}/crm/v3/Leads/search?criteria=(Inquiry_ID:equals:WNDPQ353)`;
  const res = await fetch(searchUrl, {
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
  });
  const json = await res.json();
  console.log('Search response status:', res.status);
  
  if (!json.data || json.data.length === 0) {
    console.error('Lead WNDPQ353 not found in search');
    return;
  }

  const foundLead = json.data[0];
  const fullRes = await fetch(`https://www.${apiDomain}/crm/v3/Leads/${foundLead.id}`, {
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
  });
  const fullJson = await fullRes.json();
  const lead = fullJson.data[0];

  console.log('Lead Full Name:', lead.Full_Name);
  console.log('Inquiry ID:', lead.Inquiry_ID);
  console.log('\n--- SUBFORM Activities_and_Experiences_1 ---');
  console.log(JSON.stringify(lead.Activities_and_Experiences_1, null, 2));

  console.log('\n--- ALL KEYS IN ROW 1 ---');
  if (lead.Activities_and_Experiences_1 && lead.Activities_and_Experiences_1[0]) {
    console.log(lead.Activities_and_Experiences_1[0]);
  }
}

inspectLead().catch(console.error);
