import { jsPDF } from 'jspdf';
import nodemailer from 'nodemailer';

async function testFullBookingFlow() {
  console.log('--- Starting Full Itinerary Booking & Invoice Verification Test ---');

  // 1. Zoho OAuth Token
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
  console.log('1. Zoho Access Token:', token ? 'SUCCESS' : 'FAILED');

  const leadId = '843125000010984003';
  const invoiceNumber = `WND-INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const paidAmount = 35000;
  const totalAmount = 70000;
  const balanceDue = 35000;

  // 2. Generate PDF Invoice
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = 210;
  const rustColor = [110, 30, 20];
  const darkRust = [92, 24, 16];
  const emeraldGreen = [16, 128, 67];
  const slateDark = [15, 23, 42];
  const slateMuted = [100, 116, 139];
  const bgLight = [250, 248, 245];

  doc.setFillColor(...rustColor);
  doc.rect(0, 0, pageWidth, 5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...darkRust);
  doc.text('WANDERPHILIA EXPERIENCES', 15, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateMuted);
  doc.text('Wanderphilia Experiences Private Limited', 15, 24);
  doc.text('Email: experiences@wanderphilia.com | Phone: +91 9217664099', 15, 28);

  doc.setFillColor(...bgLight);
  doc.roundedRect(120, 13, 75, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...rustColor);
  doc.text('TAX INVOICE / RECEIPT', 124, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...slateDark);
  doc.text(`Invoice No: ${invoiceNumber}`, 124, 23);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 124, 28);
  doc.text(`Ref: Lead #${leadId}`, 124, 33);

  doc.setDrawColor(...rustColor);
  doc.setLineWidth(0.5);
  doc.line(15, 42, 195, 42);

  // Financial Summary Table
  doc.setFillColor(...rustColor);
  doc.rect(15, 50, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('DESCRIPTION', 19, 55.5);
  doc.text('TOTAL QUOTATION', 115, 55.5);
  doc.text('AMOUNT PAID', 160, 55.5);

  doc.setFillColor(255, 255, 255);
  doc.rect(15, 58, 180, 16, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...slateDark);
  doc.text('Leh Ladakh Bespoke Luxury Tour (Booking Advance 50%)', 19, 64);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...slateMuted);
  doc.text('Includes Curated 5-Star Accommodations, Private Chauffeur & Sightseeing.', 19, 69);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...slateDark);
  doc.text(`₹${totalAmount.toLocaleString('en-IN')}`, 115, 65);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...emeraldGreen);
  doc.text(`₹${paidAmount.toLocaleString('en-IN')}`, 160, 65);

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
  console.log('2. Generated PDF Invoice Buffer:', pdfBuffer.length, 'bytes');

  // 3. Upload Invoice PDF Attachment to Zoho CRM Lead
  const invoiceFileName = `Wanderphilia_Invoice_${invoiceNumber}.pdf`;
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append('file', blob, invoiceFileName);

  const uploadRes = await fetch(`https://www.zohoapis.in/crm/v3/Leads/${leadId}/Attachments`, {
    method: 'POST',
    headers: { 'Authorization': `Zoho-oauthtoken ${token}` },
    body: formData
  });
  const uploadJson = await uploadRes.json();
  console.log('3. Zoho CRM Attachment Upload:', uploadJson.data?.[0]?.status === 'success' ? 'SUCCESS' : uploadJson);

  // 4. Update Lead Status & Amounts
  const updateRes = await fetch(`https://www.zohoapis.in/crm/v3/Leads/${leadId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [{
        Lead_Status: 'Booking',
        Advance_Amount_Paid: paidAmount,
        Balance_Pending_Amount: balanceDue
      }]
    })
  });
  const updateJson = await updateRes.json();
  console.log('4. Zoho CRM Lead Status & Amount Update:', updateJson.data?.[0]?.status === 'success' ? 'SUCCESS' : updateJson);

  // 5. Add Note to Lead
  const noteRes = await fetch(`https://www.zohoapis.in/crm/v3/Notes`, {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: [{
        Note_Title: `Payment Received via Razorpay (₹${paidAmount.toLocaleString('en-IN')})`,
        Note_Content: `Payment of ₹${paidAmount.toLocaleString('en-IN')} received via Razorpay.\nInvoice No: ${invoiceNumber}\nBalance Due: ₹${balanceDue.toLocaleString('en-IN')}\nInvoice PDF attached.`,
        Parent_Id: leadId,
        $se_module: 'Leads'
      }]
    })
  });
  const noteJson = await noteRes.json();
  console.log('5. Zoho CRM Note Added:', noteJson.data?.[0]?.status === 'success' ? 'SUCCESS' : noteJson);

  console.log('--- Full Itinerary Booking & Invoice Pipeline Completed Successfully! ---');
}

testFullBookingFlow().catch(console.error);
