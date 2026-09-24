import { fetchZohoLeadById } from '../lib/zoho-fetch.js';

async function test() {
  const lead = await fetchZohoLeadById('WNDPQ353');
  console.log('Lead Name:', lead?.leadName);
  console.log('Day Activities:');
  console.log(JSON.stringify(lead?.dayActivities, null, 2));
}

test().catch(console.error);
