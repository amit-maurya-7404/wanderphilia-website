import { getZohoAccessToken, getZohoApiUrl, parseToZohoDate } from './zoho';
import { sendEmail, ADMIN_NOTIFICATION_EMAIL } from './email';

export interface BookingPaymentSyncParams {
  itineraryId: string;
  itineraryUrl: string;
  paymentId: string;
  orderId: string;
  paymentType: string;
  paidAmount: number;
  newTotalPaid: number;
  newBalanceDue: number;
  totalQuotationAmount: number;
  invoiceNumber: string;
  zohoLeadId?: string;
  customerName: string;
  customerEmail?: string;
  customerMobile?: string;
  destination: string;
  departureCity?: string;
  travelStartDate?: string;
  travelEndDate?: string;
  duration?: string;
  numberOfGuests?: number;
  adults?: number;
  kids?: number;
  kidsDetails?: any[];
  roomsCount?: number;
  sharingType?: string;
  preferredRoomCategory?: string;
  vehicleType?: string;
  mealPlan?: string;
  hotels?: Array<{
    hotelName?: string;
    city?: string;
    nights?: number;
    roomCategory?: string;
    category?: string;
    stayDates?: string;
  }>;
  specialRequirements?: string;
}

export interface BookingSyncResult {
  success: boolean;
  dealId?: string;
  dealName?: string;
  isNewDeal?: boolean;
  taskId?: string;
  leadConverted?: boolean;
  error?: string;
}

/**
 * Helper to calculate Due Date: exactly 2 calendar days from now (YYYY-MM-DD)
 */
function getTwoDaysDueDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Searches for an existing Deal/Booking in Zoho CRM by Itinerary ID or URL
 */
async function findExistingDeal(
  itineraryId: string,
  itineraryUrl: string
): Promise<{ id: string; Deal_Name: string; Adv_Amount?: number; Cost?: number } | null> {
  try {
    const accessToken = await getZohoAccessToken();

    // 1. Search by Itinerary Unique ID
    if (itineraryId) {
      const criteria = `(Itinerary_Unique_ID:equals:${encodeURIComponent(itineraryId.trim())})`;
      const searchUrl = getZohoApiUrl(`/crm/v3/Deals/search?criteria=${criteria}`);
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        cache: 'no-store',
      });
      if (res.ok && res.status !== 204) {
        const json = await res.json();
        if (json.data && json.data.length > 0 && json.data[0].id) {
          return json.data[0];
        }
      }
    }

    // 2. Search by Itinerary URL
    if (itineraryUrl) {
      const criteria = `(Itinerary_URL:equals:${encodeURIComponent(itineraryUrl.trim())})`;
      const searchUrl = getZohoApiUrl(`/crm/v3/Deals/search?criteria=${criteria}`);
      const res = await fetch(searchUrl, {
        headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
        cache: 'no-store',
      });
      if (res.ok && res.status !== 204) {
        const json = await res.json();
        if (json.data && json.data.length > 0 && json.data[0].id) {
          return json.data[0];
        }
      }
    }

    return null;
  } catch (err) {
    console.warn('[Zoho Find Deal Error]:', err);
    return null;
  }
}

/**
 * Builds the Hotel fields payload for Deals module
 */
function buildDealHotelPayload(hotels: BookingPaymentSyncParams['hotels'] = []): Record<string, any> {
  const payload: Record<string, any> = {};

  // Hotel 1
  if (hotels[0]) {
    if (hotels[0].hotelName) payload.st_Hotel = hotels[0].hotelName;
    if (hotels[0].city) payload.st_Hotel_City = hotels[0].city;
    if (hotels[0].nights) payload.st_Hotel_Nights = Number(hotels[0].nights);
    if (hotels[0].stayDates) payload.st_Hotel_Stay_Dates = hotels[0].stayDates;
    if (hotels[0].category) payload.Hotel_1_Category = hotels[0].category;
  }

  // Hotel 2
  if (hotels[1]) {
    if (hotels[1].hotelName) payload.nd_Hotel = hotels[1].hotelName;
    if (hotels[1].city) payload.nd_Hotel_City = hotels[1].city;
    if (hotels[1].nights) payload.nd_Hotel_Nights = Number(hotels[1].nights);
    if (hotels[1].stayDates) payload.nd_Hotel_Stay_Dates = hotels[1].stayDates;
    if (hotels[1].category) payload.Hotel_2_Category = hotels[1].category;
  }

  // Hotel 3
  if (hotels[2]) {
    if (hotels[2].hotelName) payload.rd_Hotel = hotels[2].hotelName;
    if (hotels[2].city) payload.rd_Hotel_City = hotels[2].city;
    if (hotels[2].nights) payload.rd_Hotel_Nights = Number(hotels[2].nights);
    if (hotels[2].stayDates) payload.rd_Hotel_Stay_Dates = hotels[2].stayDates;
    if (hotels[2].category) payload.Hotel_3_Category = hotels[2].category;
  }

  // Hotel 4 (API: th_Hotel2 in Deals)
  if (hotels[3]) {
    if (hotels[3].hotelName) payload.th_Hotel2 = hotels[3].hotelName;
    if (hotels[3].city) payload.th_Hotel_City = hotels[3].city;
    if (hotels[3].nights) payload.th_Hotel_Nights2 = Number(hotels[3].nights);
    if (hotels[3].stayDates) payload.th_Hotel_Stay_Dates2 = hotels[3].stayDates;
    if (hotels[3].category) payload.Hotel_4_Category = hotels[3].category;
  }

  // Hotel 5 (API: th_Hotel1 in Deals)
  if (hotels[4]) {
    if (hotels[4].hotelName) payload.th_Hotel1 = hotels[4].hotelName;
    if (hotels[4].city) payload.th_Hotel_City1 = hotels[4].city;
    if (hotels[4].nights) payload.th_Hotel_Nights1 = Number(hotels[4].nights);
    if (hotels[4].stayDates) payload.th_Hotel_Stay_Dates1 = hotels[4].stayDates;
    if (hotels[4].category) payload.Hotel_5_Category = hotels[4].category;
  }

  // Hotel 6 (API: th_Hotel in Deals)
  if (hotels[5]) {
    if (hotels[5].hotelName) payload.th_Hotel = hotels[5].hotelName;
    if (hotels[5].city) payload.th_Hotel_City2 = hotels[5].city;
    if (hotels[5].nights) payload.th_Hotel_Nights = Number(hotels[5].nights);
    if (hotels[5].stayDates) payload.th_Hotel_Stay_Dates = hotels[5].stayDates;
    if (hotels[5].category) payload.Hotel_6_Category = hotels[5].category;
  }

  return payload;
}

/**
 * Builds the Hotel fields payload for Tasks module
 */
function buildTaskHotelPayload(hotels: BookingPaymentSyncParams['hotels'] = []): Record<string, any> {
  const payload: Record<string, any> = {};

  // Hotel 1
  if (hotels[0]) {
    if (hotels[0].hotelName) payload.st_Hotel = hotels[0].hotelName;
    if (hotels[0].city) payload.st_Hotel_city = hotels[0].city;
    if (hotels[0].nights) payload.st_Hotel_Nights = Number(hotels[0].nights);
    if (hotels[0].stayDates) payload.st_Hotel_Stay_Dates = hotels[0].stayDates;
    if (hotels[0].category) payload.Hotel_1_category = hotels[0].category;
  }

  // Hotel 2
  if (hotels[1]) {
    if (hotels[1].hotelName) payload.nd_Hotel = hotels[1].hotelName;
    if (hotels[1].city) payload.nd_Hotel_City = hotels[1].city;
    if (hotels[1].nights) payload.nd_Hotel_Nights = Number(hotels[1].nights);
    if (hotels[1].stayDates) payload.nd_Hotel_Stay_Dates = hotels[1].stayDates;
    if (hotels[1].category) payload.Hotel_2_category = hotels[1].category;
  }

  // Hotel 3
  if (hotels[2]) {
    if (hotels[2].hotelName) payload.rd_Hotel = hotels[2].hotelName;
    if (hotels[2].city) payload.rd_Hotel_City = hotels[2].city;
    if (hotels[2].nights) payload.rd_Hotel_Nights = Number(hotels[2].nights);
    if (hotels[2].stayDates) payload.rd_Hotel_Stay_Dates = hotels[2].stayDates;
    if (hotels[2].category) payload.Hotel_3_Category = hotels[2].category;
  }

  // Hotel 4 (In Tasks: th_Hotel1, th_Hotel_city1, th_Hotel_Nights2, th_Hotel_Stay_Dates2)
  if (hotels[3]) {
    if (hotels[3].hotelName) payload.th_Hotel1 = hotels[3].hotelName;
    if (hotels[3].city) payload.th_Hotel_city1 = hotels[3].city;
    if (hotels[3].nights) payload.th_Hotel_Nights2 = Number(hotels[3].nights);
    if (hotels[3].stayDates) payload.th_Hotel_Stay_Dates2 = hotels[3].stayDates;
    if (hotels[3].category) payload.Hotel_4_Category = hotels[3].category;
  }

  // Hotel 5 (In Tasks: th_Hotel, th_Hotel_City, th_Hotel_Nights1, th_Hotel_Stay_Dates1)
  if (hotels[4]) {
    if (hotels[4].hotelName) payload.th_Hotel = hotels[4].hotelName;
    if (hotels[4].city) payload.th_Hotel_City = hotels[4].city;
    if (hotels[4].nights) payload.th_Hotel_Nights1 = Number(hotels[4].nights);
    if (hotels[4].stayDates) payload.th_Hotel_Stay_Dates1 = hotels[4].stayDates;
    if (hotels[4].category) payload.Hotel_5_Category = hotels[4].category;
  }

  // Hotel 6 (In Tasks: th_Hotel2, th_Hotel_City2, th_Hotel_Nights, th_Hotel_Stay_Dates)
  if (hotels[5]) {
    if (hotels[5].hotelName) payload.th_Hotel2 = hotels[5].hotelName;
    if (hotels[5].city) payload.th_Hotel_City2 = hotels[5].city;
    if (hotels[5].nights) payload.th_Hotel_Nights = Number(hotels[5].nights);
    if (hotels[5].stayDates) payload.th_Hotel_Stay_Dates = hotels[5].stayDates;
    if (hotels[5].category) payload.Hotel_6_Category = hotels[5].category;
  }

  return payload;
}

/**
 * Creates a formatted briefing description for Operations
 */
function buildBriefingDescription(params: BookingPaymentSyncParams): string {
  const hotelList = (params.hotels || [])
    .filter(h => h && h.hotelName)
    .map((h, i) => `${i + 1}. [${h.city || 'City'}] ${h.hotelName} (${h.roomCategory || h.category || 'Standard'}, ${h.nights || 1} Night(s), Dates: ${h.stayDates || 'TBA'})`)
    .join('\n');

  return `=== OPERATIONS BOOKING BRIEFING ===
Customer Name: ${params.customerName}
Phone / Mobile: ${params.customerMobile || 'N/A'}
Email: ${params.customerEmail || 'N/A'}
Destination: ${params.destination}
Travel Dates: ${params.travelStartDate || 'TBA'} to ${params.travelEndDate || 'TBA'} (${params.duration || ''})
Guests: ${params.numberOfGuests || 2} Pax (${params.adults || 2} Adults, ${params.kids || 0} Kids)
Rooms to Book: ${params.roomsCount || 1} Room(s) (${params.sharingType || 'Double Sharing'})
Room Category: ${params.preferredRoomCategory || 'Deluxe Room'}
Meal Plan: ${params.mealPlan || 'Breakfast & Dinner (MAP)'}
Vehicle: ${params.vehicleType || 'Dedicated Private Cab'}
Winning Itinerary Link: ${params.itineraryUrl}

--- HOTEL BOOKING CHECKLIST ---
${hotelList || 'No hotels specified.'}

--- FINANCIAL STATUS ---
Total Quotation: INR ${params.totalQuotationAmount.toLocaleString('en-IN')}
Total Paid: INR ${params.newTotalPaid.toLocaleString('en-IN')}
Balance Due: INR ${params.newBalanceDue.toLocaleString('en-IN')}
Invoice Number: ${params.invoiceNumber}
Last Razorpay ID: ${params.paymentId}

SLA: All hotel and cab arrangements must be confirmed within 48 hours of payment.`;
}

/**
 * Master Function: Handles Lead Conversion or Deal Update + Operations Task Creation
 */
export async function syncBookingAndTaskOnPayment(
  params: BookingPaymentSyncParams
): Promise<BookingSyncResult> {
  const result: BookingSyncResult = { success: false };

  try {
    const accessToken = await getZohoAccessToken();
    const formattedStartDate = parseToZohoDate(params.travelStartDate);
    const formattedEndDate = parseToZohoDate(params.travelEndDate);

    // Closing date default to travel end date or 30 days from now
    const closingDate = formattedEndDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    })();

    const dealStage = params.newBalanceDue <= 0 ? 'Payment completed' : 'Payment Pending';
    const paymentStatus = params.newBalanceDue <= 0 ? 'Fully Paid' : 'Advance Paid';

    // 1. Check if Deal/Booking already exists (Multi-stage payment / idempotent check)
    const existingDeal = await findExistingDeal(params.itineraryId, params.itineraryUrl);

    let dealId = '';
    let dealName = '';
    let isNewDeal = false;
    let leadConverted = false;

    if (existingDeal && existingDeal.id) {
      // --- A. UPDATE EXISTING DEAL ---
      dealId = String(existingDeal.id);
      dealName = existingDeal.Deal_Name || `${params.customerName} - ${params.destination} Tour`;
      isNewDeal = false;

      console.log(`[Zoho Auto-Booking] Found existing Deal ${dealId}. Updating financial details...`);

      const updateDealPayload = {
        Adv_Amount: params.newTotalPaid,
        Pending_Balance_Amount: params.newBalanceDue,
        Stage: dealStage,
        Payment_Status: paymentStatus,
        Payment_Gateway_Details: `Latest Payment ID: ${params.paymentId} (${params.paymentType}: INR ${params.paidAmount}) on ${new Date().toLocaleString('en-IN')}`,
        Itinerary_URL: params.itineraryUrl,
      };

      const updateUrl = getZohoApiUrl(`/crm/v3/Deals/${dealId}`);
      await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [updateDealPayload] }),
      });
    } else {
      // --- B. CREATE NEW DEAL (Try Native Lead Convert First) ---
      isNewDeal = true;
      dealName = `${params.customerName} - ${params.destination} Tour`;

      const dealData: Record<string, any> = {
        Deal_Name: dealName,
        Closing_Date: closingDate,
        Stage: dealStage,
        Amount: params.totalQuotationAmount,
        Cost: params.totalQuotationAmount,
        Adv_Amount: params.newTotalPaid,
        Pending_Balance_Amount: params.newBalanceDue,
        Payment_Status: paymentStatus,
        Payment_Mode: 'Online / Razorpay',
        Payment_Gateway_Details: `Payment ID: ${params.paymentId} (${params.paymentType}: INR ${params.paidAmount})`,
        Itinerary_URL: params.itineraryUrl,
        Itinerary_Unique_ID: params.itineraryId,
        Destination: params.destination,
        Destinations: params.destination,
        Departure_City: params.departureCity || '',
        Number_of_Guests: params.numberOfGuests || 2,
        Number_of_Adults: params.adults || 2,
        No_of_Kids: params.kids ? Number(params.kids) : 0,
        Rooms_Count: params.roomsCount || 1,
        Sharing_Type: params.sharingType || 'Double Sharing',
        Preferred_Room_Category: params.preferredRoomCategory || 'Deluxe Room',
        Mobile: params.customerMobile || '',
        Phone: params.customerMobile || '',
        Country_Code: '+91',
        Description: buildBriefingDescription(params),
        ...buildDealHotelPayload(params.hotels),
      };

      if (formattedStartDate) dealData.Start_Date = formattedStartDate;
      if (formattedEndDate) dealData.End_Date = formattedEndDate;

      // Try Converting Lead if zohoLeadId is available
      if (params.zohoLeadId) {
        try {
          const convertUrl = getZohoApiUrl(`/crm/v3/Leads/${params.zohoLeadId}/actions/convert`);
          const convertRes = await fetch(convertUrl, {
            method: 'POST',
            headers: {
              Authorization: `Zoho-oauthtoken ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: [
                {
                  overwrite: true,
                  notify_lead_owner: true,
                  notify_new_entity_owner: true,
                  Deals: dealData,
                },
              ],
            }),
          });

          if (convertRes.ok) {
            const convertJson = await convertRes.json();
            if (convertJson.data && convertJson.data[0] && convertJson.data[0].Deals) {
              dealId = String(convertJson.data[0].Deals);
              leadConverted = true;
              console.log(`[Zoho Auto-Booking] Successfully converted Lead ${params.zohoLeadId} into Deal ${dealId}`);
            }
          } else {
            const errText = await convertRes.text();
            console.warn('[Zoho Lead Convert Fallback]: Direct Deal creation needed. Status:', convertRes.status, errText);
          }
        } catch (convertErr) {
          console.warn('[Zoho Lead Convert Exception]:', convertErr);
        }
      }

      // If Lead Conversion didn't produce dealId, create Deal directly
      if (!dealId) {
        const createDealUrl = getZohoApiUrl('/crm/v3/Deals');
        const dealRes = await fetch(createDealUrl, {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [dealData] }),
        });

        if (dealRes.ok) {
          const dealJson = await dealRes.json();
          if (dealJson.data && dealJson.data[0] && dealJson.data[0].details?.id) {
            dealId = String(dealJson.data[0].details.id);
            console.log(`[Zoho Auto-Booking] Created new Deal ${dealId}`);
          }
        } else {
          const errText = await dealRes.text();
          throw new Error(`Failed to create Deal in Zoho CRM: ${errText}`);
        }
      }
    }

    result.dealId = dealId;
    result.dealName = dealName;
    result.isNewDeal = isNewDeal;
    result.leadConverted = leadConverted;

    // 2. CREATE OPERATIONS TASK (Linked to this Deal)
    let taskId = '';
    if (dealId) {
      try {
        const dueDate = getTwoDaysDueDate();

        const taskData: Record<string, any> = {
          Subject: `Operations: Book Hotel & Transport for ${params.customerName} - ${params.destination}`,
          What_Id: dealId,
          $se_module: 'Deals',
          Booking_Id: dealId,
          Booking_Name: dealName,
          Customer_Name: params.customerName,
          Priority: 'High',
          Status: 'Not Started',
          Due_Date: dueDate,
          Destinations: params.destination,
          Rooms_Count: params.roomsCount || 1,
          Sharing_Type: params.sharingType || 'Double Sharing',
          Preferred_Room_Category: params.preferredRoomCategory || 'Deluxe Room',
          Vehicle_Type: params.vehicleType || 'Dedicated Private Cab',
          Itinerary_URL: params.itineraryUrl,
          Itinerary_Unique_ID: params.itineraryId,
          Hotel_Booked: false,
          Transport_Arranged: false,
          Total_Amount: params.totalQuotationAmount,
          Advance_Amount_Paid: params.newTotalPaid,
          Balance_Pending_Amount: params.newBalanceDue,
          Mobile: params.customerMobile || '',
          Phone: params.customerMobile || '',
          Description: buildBriefingDescription(params),
          ...buildTaskHotelPayload(params.hotels),
        };

        if (formattedStartDate) taskData.Travel_Start_Date = formattedStartDate;
        if (formattedEndDate) taskData.Travel_End_Date = formattedEndDate;

        const createTaskUrl = getZohoApiUrl('/crm/v3/Tasks');
        const taskRes = await fetch(createTaskUrl, {
          method: 'POST',
          headers: {
            Authorization: `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: [taskData] }),
        });

        if (taskRes.ok) {
          const taskJson = await taskRes.json();
          if (taskJson.data && taskJson.data[0] && taskJson.data[0].details?.id) {
            taskId = String(taskJson.data[0].details.id);
            console.log(`[Zoho Auto-Booking] Created Operations Task ${taskId} linked to Deal ${dealId}`);
          }
        } else {
          const errText = await taskRes.text();
          console.warn('[Zoho Auto-Booking Task Warning]:', errText);
        }
      } catch (taskErr) {
        console.error('[Zoho Auto-Booking Task Error]:', taskErr);
      }
    }

    result.taskId = taskId;
    result.success = Boolean(dealId);

    // 3. SEND INSTANT EMAIL ALERT TO BHAVIN
    try {
      const adminHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f8fafc; padding: 20px; }
    .card { max-width: 620px; margin: 0 auto; background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .header { background: #6E1E14; color: white; padding: 24px; }
    .content { padding: 24px; font-size: 14px; color: #1e293b; }
    .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px; }
    .field { margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; display: flex; justify-content: space-between; }
    .label { color: #64748b; font-weight: bold; font-size: 12.5px; }
    .value { font-weight: bold; text-align: right; }
    .btn { display: inline-block; background: #ea580c; color: white; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 13px; margin-top: 15px; }
    .alert-box { background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 13px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">ZOHO AUTOMATION LIVE</span>
      <h2 style="margin: 8px 0 0 0; font-size: 20px;">🎉 Booking &amp; Operations Task Created!</h2>
      <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Payment successfully received via Itinerary link</p>
    </div>
    <div class="content">
      <div class="alert-box">
        <strong>⚡ Operations 48-Hour SLA Active:</strong> Due Date set to <strong>${getTwoDaysDueDate()}</strong>. Hotels &amp; cab must be secured within 2 days!
      </div>

      <div class="field">
        <span class="label">Customer Name:</span>
        <span class="value">${params.customerName}</span>
      </div>
      <div class="field">
        <span class="label">Destination:</span>
        <span class="value">${params.destination}</span>
      </div>
      <div class="field">
        <span class="label">Travel Dates:</span>
        <span class="value">${params.travelStartDate || 'TBA'} to ${params.travelEndDate || 'TBA'}</span>
      </div>
      <div class="field">
        <span class="label">Amount Paid:</span>
        <span class="value" style="color: #16a34a; font-size: 15px;">₹${params.paidAmount.toLocaleString('en-IN')} (${params.paymentType})</span>
      </div>
      <div class="field">
        <span class="label">Total Paid to Date:</span>
        <span class="value">₹${params.newTotalPaid.toLocaleString('en-IN')} / ₹${params.totalQuotationAmount.toLocaleString('en-IN')}</span>
      </div>
      <div class="field">
        <span class="label">Remaining Balance:</span>
        <span class="value" style="color: #6E1E14;">₹${params.newBalanceDue.toLocaleString('en-IN')}</span>
      </div>
      <div class="field">
        <span class="label">Zoho Booking (Deal) ID:</span>
        <span class="value">${dealId || 'Created'}</span>
      </div>
      <div class="field">
        <span class="label">Zoho Operations Task ID:</span>
        <span class="value">${taskId || 'Created'}</span>
      </div>

      <p style="margin-top: 20px; font-weight: bold; margin-bottom: 5px;">Final Winning Itinerary Link:</p>
      <a href="${params.itineraryUrl}" target="_blank" class="btn">View Customer Itinerary</a>
    </div>
  </div>
</body>
</html>
      `;

      await sendEmail({
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: `⚡ [Zoho Auto-Booking] ${params.customerName} - ₹${params.paidAmount.toLocaleString('en-IN')} (${params.destination})`,
        html: adminHtml,
      });
    } catch (emailErr) {
      console.warn('[Zoho Auto-Booking Email Warning]:', emailErr);
    }

    return result;
  } catch (error: any) {
    console.error('[Zoho Auto-Booking Master Exception]:', error);
    result.error = error.message || String(error);
    return result;
  }
}
