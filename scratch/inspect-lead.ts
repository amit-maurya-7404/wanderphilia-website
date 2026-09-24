import { fetchZohoLeadById } from '../lib/zoho-fetch';
import fs from 'fs';

async function run() {
  const lead = await fetchZohoLeadById('843125000010984003');
  const subform = lead?.rawLeadData?.Activities_and_Experiences_1 || [];
  fs.writeFileSync('scratch/raw-subform-lead-843125000010984003.json', JSON.stringify(subform, null, 2));
  console.log('Saved raw subform rows count:', subform.length);
}

run().catch(console.error);
