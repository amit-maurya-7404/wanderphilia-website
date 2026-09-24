const fs = require('fs');
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      process.env[key.trim()] = val.join('=').trim().replace(/^["']|["']$/g, '');
    }
  });
}

const { getZohoAccessToken, getZohoApiUrl } = require('../lib/zoho');

async function inspectZohoSubform() {
  const leadId = '843125000010916169';
  const token = await getZohoAccessToken();
  const url = getZohoApiUrl(`/crm/v3/Leads/${leadId}`);

  const res = await fetch(url, {
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
  });

  const json = await res.json();
  const lead = json.data[0];

  console.log("=== ALL LEAD KEYS ===");
  console.log(Object.keys(lead).filter(k => !k.startsWith('$')).sort());

  console.log("\n=== SUBFORM ROWS (Activities_and_Experiences_1) ===");
  if (lead.Activities_and_Experiences_1) {
    lead.Activities_and_Experiences_1.forEach((row, i) => {
      console.log(`\n--- ROW ${i+1} (${row.Days || 'Day ' + (i+1)}) ---`);
      for (const [k, v] of Object.entries(row)) {
        if (!k.startsWith('$') && v !== null && v !== undefined && v !== '') {
          console.log(`  ${k}:`, typeof v === 'object' ? JSON.stringify(v) : v);
        }
      }
    });
  }
}

inspectZohoSubform().catch(console.error);
