import fs from 'fs';

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
  const lead = json.data[0];
  const subform = lead.Activities_and_Experiences_1 || [];
  fs.writeFileSync('scratch/raw-subform-lead-843125000010984003.json', JSON.stringify(subform, null, 2));
  console.log('Saved raw subform rows count:', subform.length);
  if (subform.length > 0) {
    console.log('Row 3 keys & values:', JSON.stringify(subform[2], null, 2));
    console.log('Row 4 keys & values:', JSON.stringify(subform[3], null, 2));
    console.log('Row 6 keys & values:', JSON.stringify(subform[5], null, 2));
  }
}

run().catch(console.error);
