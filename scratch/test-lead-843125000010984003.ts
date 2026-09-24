import { fetchZohoLeadById } from '../lib/zoho-fetch';

async function run() {
  const lead = await fetchZohoLeadById('843125000010984003');
  console.log('Lead Name:', lead?.leadName);
  console.log('Inquiry ID:', lead?.inquiryId);
  console.log('Destination:', lead?.destinations, '| Type:', lead?.destinationType);
  console.log('Hotels mapped:', JSON.stringify(lead?.hotels, null, 2));
  console.log('Day Activities mapped:', JSON.stringify(lead?.dayActivities, null, 2));
}

run().catch(console.error);
