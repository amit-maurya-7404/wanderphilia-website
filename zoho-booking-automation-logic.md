# Zoho CRM Booking to Operations & Finance Automation Logic

Ye document explain karta hai ki jab koi booking create hoti hai, toh backend code kaise **Operations** aur **Finance** modules ke records create/update karta hai. Isme ready-to-use **Zoho CRM Deluge Script** bhi di gayi hai jise aap seedha Zoho CRM Workflow Function me use kar sakte hain.

---

## 1. Core Logic Overview (Kaise Kaam Karta Hai)

Jab Deals module me nayi booking aati hai ya manually create hoti hai:

```
[ Deal / Booking Created ]
          │
          ├──> 1. Calculate Nights & Days (From Start Date & End Date)
          │
          ├──> 2. Calculate Guest Count & Kids Details
          │       • Total Pax = Adults + Kids
          │       • Billable Extra Beds & Child without bed counts
          │       • Set Kids_Age (Integer count) and Child 1-5 Age & Bed Preference
          │
          ├──> 3. Calculate Hotel Costs (From Hotel module rates)
          │       • Fetch Hotel record -> Room_Rates_Pricing subform
          │       • Match Room Category (Deluxe, etc.)
          │       • Hotel_Cost = (Price_Per_Night * Rooms * Nights) 
          │                    + (Extra_Bed_Rate * Extra_Beds * Nights) 
          │                    + (Child_No_Bed_Rate * Kids_No_Bed * Nights)
          │
          ├──> 4. Resolve Vehicle & Lowest-Priced Vendor
          │       • Match Vehicle by State/Destination & Capacity (Min to Max Pax)
          │       • Read Vendor_Pricing subform -> Pick lowest Cost_Per_day
          │       • Total_Transport_Cost = Cost_Per_day * Total_Days
          │
          ├──> 5. Create / Update Operations Record
          │       • Fill Guest, Hotel 1-6 Lookups, Dates, Costs
          │       • Fill Vehicle & Vendor Lookup
          │       • Add Activities_and_Experiences_operations Subform
          │
          └──> 6. Create / Update Finance Record
                  • Total_Receivable_Amount = Deal Quotation Amount
                  • Total_Amount_Received = Advance / Token Amount Paid
                  • Balance_Receivable = Total - Received
                  • Payment_Status = 'Full Paid' (agar balance 0) ya 'Advance Paid'
                  • Fill Hotel 1-6 Lookups & Net Costs
                  • Fill Transport Vendor Lookup & Cost
                  • Add Activities_and_experiences_cost_By_guide Subform
```

---

## 2. Ready-To-Use Zoho Deluge Function (For Zoho CRM Workflow)

Aap Zoho CRM me **Setup -> Automation -> Workflow Rules -> Function** me ye Deluge script laga sakte hain (Argument: `dealId` as string/number).

```deluge
// ==============================================================================
// Function: sync_deal_to_operations_and_finance
// Trigger: Deals Module (On Create or On Edit of Stage/Payment)
// Argument: dealId (Type: String or Int)
// ==============================================================================

dealMap = zoho.crm.getRecordById("Deals", dealId.toLong());

if(dealMap != null && dealMap.get("id") != null)
{
    customerName = ifnull(dealMap.get("Deal_Name"), "");
    destination  = ifnull(dealMap.get("Destination"), ifnull(dealMap.get("Destinations"), ""));
    startDate    = dealMap.get("Start_Date");
    endDate      = dealMap.get("End_Date");
    
    // 1. Calculate Days and Nights
    totalDays = 1;
    totalNights = 1;
    if(startDate != null && endDate != null)
    {
        totalDays = daysBetween(startDate.toDate(), endDate.toDate()) + 1;
        totalNights = if(totalDays > 1, totalDays - 1, 1);
    }
    
    adults = ifnull(dealMap.get("Number_of_Adults"), 2).toLong();
    kids = ifnull(dealMap.get("No_of_Kids"), 0).toLong();
    totalPax = adults + kids;
    roomsCount = ifnull(dealMap.get("Rooms_Count"), 1).toLong();
    sharingType = ifnull(dealMap.get("Sharing_Type"), "Double Sharing");
    roomCategory = ifnull(dealMap.get("Preferred_Room_Category"), "Deluxe Room");
    itineraryUrl = ifnull(dealMap.get("Itinerary_URL"), "");
    
    // Financials
    totalQuotation = ifnull(dealMap.get("Amount"), ifnull(dealMap.get("Cost"), 0.0)).toDecimal();
    advancePaid    = ifnull(dealMap.get("Adv_Amount"), 0.0).toDecimal();
    balanceDue     = totalQuotation - advancePaid;
    paymentStatus  = if(balanceDue <= 0, "Full Paid", "Advance Paid");
    
    // ==========================================================================
    // 2. VEHICLE & LOWEST VENDOR RESOLUTION
    // ==========================================================================
    vehicleLookupId = null;
    vendorLookupId  = null;
    totalTransportCost = 0.0;
    
    // Search vehicles matching destination/state and capacity
    vehicleList = zoho.crm.searchRecords("Vehicles", "(State:equals:" + destination + ")");
    matchedVehicle = null;
    if(vehicleList.size() > 0)
    {
        for each veh in vehicleList
        {
            minCap = ifnull(veh.get("Min_Capacity"), 0).toLong();
            maxCap = ifnull(veh.get("Max_Capacity"), 99).toLong();
            if(totalPax >= minCap && totalPax <= maxCap)
            {
                matchedVehicle = veh;
                break;
            }
        }
    }
    
    if(matchedVehicle != null)
    {
        vehicleLookupId = matchedVehicle.get("id");
        vRec = zoho.crm.getRecordById("Vehicles", vehicleLookupId.toLong());
        vendorPricingSubform = vRec.get("Vendor_Pricing");
        
        lowestCostPerDay = 9999999.0;
        selectedVendorName = "";
        
        if(vendorPricingSubform != null && vendorPricingSubform.size() > 0)
        {
            for each vp in vendorPricingSubform
            {
                cpd = ifnull(vp.get("Cost_Per_day"), 0.0).toDecimal();
                if(cpd > 0 && cpd < lowestCostPerDay)
                {
                    lowestCostPerDay = cpd;
                    selectedVendorName = vp.get("Vendor_Name");
                }
            }
        }
        
        if(lowestCostPerDay < 9999999.0)
        {
            totalTransportCost = lowestCostPerDay * totalDays;
            if(selectedVendorName != "")
            {
                vendorSearch = zoho.crm.searchRecords("Vendors", "(Vendor_Name:equals:" + selectedVendorName + ")");
                if(vendorSearch.size() > 0)
                {
                    vendorLookupId = vendorSearch.get(0).get("id");
                }
            }
        }
    }
    
    // ==========================================================================
    // 3. HOTEL 1 TO 6 LOOKUPS & COST CALCULATIONS
    // ==========================================================================
    hotelBreakdowns = list();
    
    // Hotel 1
    h1Lookup = dealMap.get("st_Hotel");
    h1Nights = ifnull(dealMap.get("st_Hotel_Nights"), totalNights).toLong();
    h1Cost = 0.0;
    if(h1Lookup != null && h1Lookup.get("id") != null)
    {
        hRec = zoho.crm.getRecordById("Hotel", h1Lookup.get("id").toLong());
        ratesList = hRec.get("Room_Rates_Pricing");
        if(ratesList != null && ratesList.size() > 0)
        {
            firstRate = ratesList.get(0);
            pNight = ifnull(firstRate.get("Price_Per_Night"), ifnull(firstRate.get("Base_Price"), 0.0)).toDecimal();
            h1Cost = pNight * roomsCount * h1Nights;
        }
    }
    
    // Hotel 2
    h2Lookup = dealMap.get("nd_Hotel");
    h2Nights = ifnull(dealMap.get("nd_Hotel_Nights"), 1).toLong();
    h2Cost = 0.0;
    if(h2Lookup != null && h2Lookup.get("id") != null)
    {
        hRec2 = zoho.crm.getRecordById("Hotel", h2Lookup.get("id").toLong());
        ratesList2 = hRec2.get("Room_Rates_Pricing");
        if(ratesList2 != null && ratesList2.size() > 0)
        {
            firstRate2 = ratesList2.get(0);
            pNight2 = ifnull(firstRate2.get("Price_Per_Night"), ifnull(firstRate2.get("Base_Price"), 0.0)).toDecimal();
            h2Cost = pNight2 * roomsCount * h2Nights;
        }
    }
    
    // ==========================================================================
    // 4. CREATE / UPDATE OPERATIONS RECORD
    // ==========================================================================
    opsMap = Map();
    opsMap.put("Name", customerName + " - " + destination + " Tour");
    opsMap.put("Booking_Id", dealId);
    opsMap.put("Customer_Name", customerName);
    opsMap.put("Destination", destination);
    opsMap.put("No_of_Days", totalDays);
    opsMap.put("No_of_Nights", totalNights);
    opsMap.put("No_of_Guests", totalPax);
    opsMap.put("No_of_Adults", adults);
    opsMap.put("Kids_Age", kids);
    opsMap.put("Rooms_Count", roomsCount);
    opsMap.put("Sharing_Type", sharingType);
    opsMap.put("Room_Category", roomCategory);
    opsMap.put("Status", "Pending");
    opsMap.put("Itinerary_URL", itineraryUrl);
    if(startDate != null) { opsMap.put("Start_Date", startDate); }
    if(endDate != null)   { opsMap.put("End_Date", endDate); }
    
    // Vehicle & Vendor in Operations
    if(vehicleLookupId != null) { opsMap.put("Vehicle_Type", vehicleLookupId); }
    if(vendorLookupId != null)  { opsMap.put("Vendor_Name", vendorLookupId); }
    if(totalTransportCost > 0)  { opsMap.put("Vehicle_Cost", totalTransportCost); }
    
    // Hotel 1 in Operations
    if(h1Lookup != null && h1Lookup.get("id") != null)
    {
        opsMap.put("Hotel_1", h1Lookup.get("id"));
        opsMap.put("Hotel_1_City", dealMap.get("st_Hotel_City"));
        opsMap.put("Hotel_1_Nights", h1Nights);
        opsMap.put("Hotel_1_Dates", dealMap.get("st_Hotel_Stay_Dates"));
        opsMap.put("Hotel_1_Category", dealMap.get("Hotel_1_Category"));
        opsMap.put("Hotel_1_Cost", h1Cost);
        opsMap.put("Hotel_1_Booked", false);
    }
    
    // Hotel 2 in Operations
    if(h2Lookup != null && h2Lookup.get("id") != null)
    {
        opsMap.put("Hotel_2", h2Lookup.get("id"));
        opsMap.put("Hotel_2_City", dealMap.get("nd_Hotel_City"));
        opsMap.put("Hotel_2_Nights", h2Nights);
        opsMap.put("Hotel_2_Dates", dealMap.get("nd_Hotel_Stay_Dates"));
        opsMap.put("Hotel_2_Category", dealMap.get("Hotel_2_Category"));
        opsMap.put("Hotel_2_Cost", h2Cost);
        opsMap.put("Hotel_2_Booked", false);
    }
    
    // Check if Operations record already exists for this Deal
    existingOps = zoho.crm.searchRecords("Operations", "(Booking_Id:equals:" + dealId + ")");
    if(existingOps.size() > 0)
    {
        opsId = existingOps.get(0).get("id");
        opsRes = zoho.crm.updateRecord("Operations", opsId.toLong(), opsMap);
    }
    else
    {
        opsRes = zoho.crm.createRecord("Operations", opsMap);
    }
    
    // ==========================================================================
    // 5. CREATE / UPDATE FINANCE RECORD
    // ==========================================================================
    finMap = Map();
    finMap.put("Name", customerName + " - " + destination + " Tour");
    finMap.put("Booking_ID", dealId);
    finMap.put("Total_Receivable_Amount", totalQuotation);
    finMap.put("Total_Amount_Received", advancePaid);
    finMap.put("Balance_Receivable", balanceDue);
    finMap.put("Payment_Status", paymentStatus);
    finMap.put("Status", "Pending");
    
    // Vehicle & Vendor in Finance
    if(vehicleLookupId != null) { finMap.put("Vehicle_Name", vehicleLookupId); }
    if(vendorLookupId != null)  { finMap.put("Vendor_Name", vendorLookupId); }
    if(totalTransportCost > 0)  { finMap.put("Total_Transport_Cost", totalTransportCost); }
    
    // Hotel 1 & 2 in Finance
    if(h1Lookup != null && h1Lookup.get("id") != null)
    {
        finMap.put("Hotel_Name", h1Lookup.get("id"));
        finMap.put("Total_Hotel_Cost", h1Cost);
    }
    if(h2Lookup != null && h2Lookup.get("id") != null)
    {
        finMap.put("Hotel_2_Name", h2Lookup.get("id"));
        finMap.put("Total_Hotel_2_Cost", h2Cost);
    }
    
    // Check if Finance record already exists for this Deal
    existingFin = zoho.crm.searchRecords("Finance", "(Booking_ID:equals:" + dealId + ")");
    if(existingFin.size() > 0)
    {
        finId = existingFin.get(0).get("id");
        finRes = zoho.crm.updateRecord("Finance", finId.toLong(), finMap);
    }
    else
    {
        finRes = zoho.crm.createRecord("Finance", finMap);
    }
    
    return "Operations and Finance records synced successfully for Deal: " + dealId;
}
return "No Deal found";
```

---

## 3. Deluge Function Setup Steps in Zoho CRM

1. **Zoho CRM** me jayein -> Top-Right **Settings (Gear Icon)** -> **Developer Hub** -> **Functions**.
2. **New Function** create karein:
   - **Function Name**: `sync_deal_to_operations_and_finance`
   - **Display Name**: `Sync Deal to Operations & Finance`
   - **Category**: `Workflow`
3. Function Argument set karein:
   - **Param Name**: `dealId`
   - **Type**: `String`
4. Upar diya gaya Deluge code paste karein aur **Save** karein.
5. Ab **Settings -> Automation -> Workflow Rules** me jayein:
   - **Module**: `Deals`
   - **Rule Name**: `Auto Sync Booking to Operations and Finance`
   - **When**: On Record Action -> `Create` (aur `Edit` of Stage/Advance Amount)
   - **Action**: Call Custom Function -> Choose `sync_deal_to_operations_and_finance`
   - Parameter me `Deals.Deal Id` map kar dein.
