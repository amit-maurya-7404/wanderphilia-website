import fs from 'fs';
import path from 'path';

async function getZohoToken() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;

  console.log('Credentials check:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRefreshToken: !!refreshToken,
  });

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

  const data = await response.json();
  console.log('OAuth Token Status:', response.status, data.access_token ? 'Access Token Received' : data);
  return data.access_token;
}

async function run() {
  const leadId = '843125000011565444';
  const token = await getZohoToken();
  if (!token) return;

  // 1. Fetch Lead Details
  const leadRes = await fetch(`https://www.zohoapis.in/crm/v3/Leads/${leadId}`, {
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` }
  });
  console.log('Lead fetch status:', leadRes.status);
  const leadData = await leadRes.json();
  if (leadData.data && leadData.data[0]) {
    console.log('Lead Name:', leadData.data[0].Full_Name, '| Email:', leadData.data[0].Email, '| Status:', leadData.data[0].Lead_Status);
  } else {
    console.log('Lead response:', leadData);
  }

  // 2. Read test pdf invoice
  let pdfBuffer;
  const pdfPath = path.join(process.cwd(), 'test_stamp_invoice.pdf');
  if (fs.existsSync(pdfPath)) {
    pdfBuffer = fs.readFileSync(pdfPath);
  } else {
    pdfBuffer = Buffer.from('Test Invoice PDF Content');
  }

  // 3. Upload Attachment to Lead
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, 'Wanderphilia_Invoice_CORP_2026_004.pdf');

  const attachRes = await fetch(`https://www.zohoapis.in/crm/v3/Leads/${leadId}/Attachments`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
    },
    body: formData,
  });

  console.log('Attachment upload status:', attachRes.status);
  const attachData = await attachRes.json();
  console.log('Attachment result:', JSON.stringify(attachData));

  // 4. Add Note to Lead
  const noteRes = await fetch(`https://www.zohoapis.in/crm/v3/Notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [
        {
          Note_Title: 'Payment Received via Razorpay (₹5,257)',
          Note_Content: 'Advance booking payment of ₹5,257 received via Razorpay.\nInvoice No: CORP./2026/004\nOfficial Tax Invoice attached.',
          Parent_Id: leadId,
          $se_module: 'Leads',
        },
      ],
    }),
  });

  console.log('Note upload status:', noteRes.status);
  const noteData = await noteRes.json();
  console.log('Note result:', JSON.stringify(noteData));
}

run().catch(console.error);
