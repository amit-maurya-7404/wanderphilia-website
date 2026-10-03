async function testNotesAPI() {
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
  const leadId = '843125000010984003';

  const noteRes = await fetch(`https://www.zohoapis.in/crm/v3/Notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [
        {
          Note_Title: 'Payment Received via Razorpay - Advance ₹25,000',
          Note_Content: 'Payment of ₹25,000 received successfully.\nPayment ID: pay_test_12345\nOrder ID: order_test_12345\nPayment Type: Booking Advance (50%)\nBalance Due: ₹25,000\nOfficial invoice attached to record.',
          Parent_Id: leadId,
          $se_module: 'Leads'
        }
      ]
    })
  });
  const noteJson = await noteRes.json();
  console.log('Note response:', JSON.stringify(noteJson, null, 2));
}

testNotesAPI().catch(console.error);
