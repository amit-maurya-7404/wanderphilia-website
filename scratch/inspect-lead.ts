import { fetchZohoLeadById } from '../lib/zoho-fetch';
import fs from 'fs';

async function run() {
  const lead = await fetchZohoLeadById('843125000010984003');
  const raw = lead?.rawLeadData || {};
  const priceKeys = Object.keys(raw).filter(k => /cost|quote|quotation|price|amount|budget|revenue|adult|kid|child|pax|rate|guest/i.test(k));
  console.log('Price/Quotation/Guest related keys in raw Zoho Lead:');
  priceKeys.forEach(k => console.log(`  ${k}:`, raw[k]));
}

run().catch(console.error);
