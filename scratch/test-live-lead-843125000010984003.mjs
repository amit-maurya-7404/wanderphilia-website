import { MongoClient } from 'mongodb';

async function run() {
  const tokenRes = await fetch('https://accounts.zoho.in/oauth/v2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN,
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: 'refresh_token'
    })
  });
  const tokenData = await tokenRes.json();
  const token = tokenData.access_token;

  const res = await fetch('https://www.zohoapis.in/crm/v3/Leads/843125000010984003', {
    headers: { Authorization: `Zoho-oauthtoken ${token}` }
  });
  const json = await res.json();
  const rawLead = json.data[0];

  const { parseRawSubformToDayActivities, buildCleanDayPlansFromZoho } = await import('./test-clean-mapper.mjs');
  
  const subform = rawLead.Activities_and_Experiences_1 || [];
  const parsedActivities = parseRawSubformToDayActivities(subform);
  
  console.log('Parsed Activities count:', parsedActivities.length);
  console.log('Parsed Activity Day 6:', JSON.stringify(parsedActivities[5], null, 2));

  const hotels = [
    { hotelName: 'Standard Hotel', city: 'Jaipur', nights: 2 }
  ];

  const dayPlans = buildCleanDayPlansFromZoho(parsedActivities, hotels, 'Rajasthan', 6, '', 'India');

  console.log('\n=== GENERATED 6-DAY PLAN FROM LIVE ZOHO DATA ===');
  console.log(JSON.stringify(dayPlans, null, 2));
}

run().catch(console.error);
