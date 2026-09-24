import { fetchZohoLeadById } from '../lib/zoho-fetch.ts';

async function run() {
  const lead = await fetchZohoLeadById('WNDPQ353');
  console.log('Lead Name:', lead?.leadName);
  console.log('Destination:', lead?.destinations, 'Type:', lead?.destinationType);
  console.log('Hotels:', JSON.stringify(lead?.hotels, null, 2));
  console.log('Day Activities:', JSON.stringify(lead?.dayActivities, null, 2));
}

run().catch(console.error);
