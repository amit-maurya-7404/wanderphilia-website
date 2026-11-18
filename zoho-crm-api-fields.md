# Zoho CRM - All Modules & Field API Names Reference

================================================================================
1. MODULE: Deals (Bookings Module)
================================================================================
• Deal_Name                 (Text)       : Customer Name + Destination Tour
• Pipeline                  (Picklist)   : Wanderphilia Pipeline
• Stage                     (Picklist)   : Advance Received / Closed Won
• Amount                    (Currency)   : Total Tour Quotation Cost
• Cost                      (Currency)   : Total Tour Quotation Cost
• Adv_Amount                (Currency)   : Total Advance Amount Received So Far
• Pending_Balance_Amount    (Currency)   : Remaining Pending Balance
• Payment_Status            (Picklist)   : Advance Paid / Full Paid
• Payment_Mode              (Picklist)   : Online / Razorpay
• Payment_Gateway_Details   (Text)       : Razorpay Payment ID, Stage, Date-Time
• Closing_Date              (Date)       : Travel End Date / Closing Date
• Start_Date                (Date)       : Tour Start Date (YYYY-MM-DD)
• End_Date                  (Date)       : Tour End Date (YYYY-MM-DD)
• Itinerary_URL             (URL/Text)   : Live Link of Itinerary
• Itinerary_Unique_ID       (Text)       : Itinerary Slug / ID
• Destination               (Picklist)   : Tour Destination
• Destinations              (Text)       : Tour Destination
• Departure_City            (Text)       : Departure City
• Number_of_Guests          (Number)     : Total Guests Count
• Number_of_Adults          (Number)     : Total Adults Count
• No_of_Kids                (Text/Number): Kids Count
• Rooms_Count               (Number)     : Number of Rooms
• Sharing_Type              (Picklist)   : Double Sharing / Triple Sharing
• Preferred_Room_Category   (Text)       : Room Category (e.g. Deluxe Room)
• Mobile                    (Phone)      : Customer Mobile Number
• Phone                     (Phone)      : Customer Mobile Number
• Country_Code              (Text)       : +91
• Description               (Large Text) : Briefing summary & payment breakdown

--- Hotels in Deals ---
• st_Hotel                  (Lookup)     : Hotel 1 Lookup
• st_Hotel_City             (Text)       : Hotel 1 City
• st_Hotel_Nights           (Number)     : Hotel 1 Nights
• st_Hotel_Stay_Dates       (Text)       : Hotel 1 Stay Dates
• Hotel_1_Category          (Text)       : Hotel 1 Category
• nd_Hotel                  (Lookup)     : Hotel 2 Lookup
• nd_Hotel_City             (Text)       : Hotel 2 City
• nd_Hotel_Nights           (Number)     : Hotel 2 Nights
• nd_Hotel_Stay_Dates       (Text)       : Hotel 2 Stay Dates
• Hotel_2_Category          (Text)       : Hotel 2 Category
• rd_Hotel                  (Lookup)     : Hotel 3 Lookup
• rd_Hotel_City             (Text)       : Hotel 3 City
• rd_Hotel_Nights           (Number)     : Hotel 3 Nights
• rd_Hotel_Stay_Dates       (Text)       : Hotel 3 Stay Dates
• Hotel_3_Category          (Text)       : Hotel 3 Category
• th_Hotel2                 (Lookup)     : Hotel 4 Lookup
• th_Hotel_City             (Text)       : Hotel 4 City
• th_Hotel_Nights2          (Number)     : Hotel 4 Nights
• th_Hotel_Stay_Dates2      (Text)       : Hotel 4 Stay Dates
• Hotel_4_Category          (Text)       : Hotel 4 Category
• th_Hotel1                 (Lookup)     : Hotel 5 Lookup
• th_Hotel_City1            (Text)       : Hotel 5 City
• th_Hotel_Nights1          (Number)     : Hotel 5 Nights
• th_Hotel_Stay_Dates1      (Text)       : Hotel 5 Stay Dates
• Hotel_5_Category          (Text)       : Hotel 5 Category
• th_Hotel                  (Lookup)     : Hotel 6 Lookup
• th_Hotel_City2            (Text)       : Hotel 6 City
• th_Hotel_Nights           (Number)     : Hotel 6 Nights
• th_Hotel_Stay_Dates       (Text)       : Hotel 6 Stay Dates
• Hotel_6_Category          (Text)       : Hotel 6 Category


================================================================================
2. MODULE: Operations (Custom Operations Module)
================================================================================
• Name                      (Text)       : Customer Name + Destination Tour
• Booking_Id                (Lookup/Text): Linked Deal ID
• Customer_Name             (Text)       : Client Full Name
• Email                     (Email)      : Client Email
• Destination               (Text)       : Destination Name
• No_of_Days                (Number)     : Number of Days
• No_of_Nights              (Number)     : Number of Nights
• No_of_Guests              (Number)     : Number of Guests
• No_of_Adults              (Number)     : Number of Adults
• Kids_Age                  (Integer)    : Kids Count (Integer data type)
• Child_1_Age               (Number)     : Child 1 Age
• Child_1_Bed_Preference    (Text)       : Extra Bed / Without Bed
• Child_2_Age               (Number)     : Child 2 Age
• Child_2_Bed_Preference    (Text)       : Extra Bed / Without Bed
• Child_3_Age               (Number)     : Child 3 Age
• Child_3_Bed_Preference    (Text)       : Extra Bed / Without Bed
• Child_4_Age               (Number)     : Child 4 Age
• Child_4_Bed_Preference    (Text)       : Extra Bed / Without Bed
• Child_5_Age               (Number)     : Child 5 Age
• Child_5_Bed_Preference    (Text)       : Extra Bed / Without Bed
• Rooms_Count               (Number)     : Number of Rooms
• Sharing_Type              (Text)       : Sharing Preference
• Room_Category             (Text)       : Room Category
• Hotel_Category            (Text)       : Hotel Category
• Status                    (Picklist)   : Pending
• Itinerary_URL             (URL/Text)   : Proposal Link
• Start_Date                (Date)       : Travel Start Date
• End_Date                  (Date)       : Travel End Date
• Itinerary                 (Lookup)     : Products (Itinerary) Module Lookup
• Vehicle_Type              (Lookup)     : Vehicles Module Lookup
• Vendor_Name               (Lookup)     : Lowest-Priced Vendor Lookup
• Vehicle_Cost              (Currency)   : Total Vehicle Cost
• Transport_Booked          (Boolean)    : false
• Activities_Booked         (Boolean)    : false
• All_Hotels_Booked         (Boolean)    : false

--- Hotels (1 to 6) in Operations ---
• Hotel_1 to Hotel_6        (Lookup)     : Hotel Record Lookup
• Hotel_1_City to Hotel_6_City (Text)    : Hotel City
• Hotel_1_Nights to Hotel_6_Nights (Num) : Number of Nights
• Hotel_1_Dates to Hotel_6_Dates (Text)  : Stay Dates
• Hotel_1_Category to Hotel_6_Category   : Room Category
• Hotel_1_Cost to Hotel_6_Cost (Currency): Net B2B Hotel Cost
• Hotel_1_Booked to Hotel_6_Booked (Bool): false

--- Subform: Activities_and_Experiences_operations ---
• Days                      (Text)       : Day 1, Day 2, etc.
• City / City_2             (Text)       : Stay City / Transit City
• Guided_Tour               (Boolean)    : true / false
• En_route_Experiences      (Text)       : En-route Sightseeing Places
• Experience_1 to Experience_4 (Lookup)  : Activities & Experiences Lookup
• Inclusions_Description_1 to 4 (Text)   : Description & Inclusions


================================================================================
3. MODULE: Finance (Custom Accounts & Finance Module)
================================================================================
• Name                      (Text)       : Customer Name + Destination Tour
• Booking_ID                (Lookup/Text): Linked Deal ID
• Email                     (Email)      : Customer Email
• Total_Receivable_Amount   (Currency)   : Total Tour Quotation / Package Cost
• Total_Amount_Received     (Currency)   : Total Money Received So Far
• Balance_Receivable        (Currency)   : Pending Balance from Customer
• Payment_Status            (Picklist)   : Advance Paid / Full Paid
• Status                    (Picklist)   : Pending
• Vehicle_Name              (Lookup)     : Vehicles Module Lookup
• Vendor_Name               (Lookup)     : Transport Vendor Lookup
• Total_Transport_Cost      (Currency)   : Transport Payable Cost
• Hotel_Name                (Lookup)     : Hotel 1 Lookup
• Total_Hotel_Cost          (Currency)   : Hotel 1 Cost
• Hotel_2_Name to Hotel_6_Name (Lookup)  : Hotel 2 to 6 Lookups
• Total_Hotel_2_Cost to Total_Hotel_6_Cost (Currency) : Hotel 2 to 6 Costs

--- Subform: Activities_and_experiences_cost_By_guide ---
• Days, City, Guided_Tour, En_route_Experiences, Experience_1 to Experience_4


================================================================================
4. MODULE: Tasks (48-Hour Operations SLA Task)
================================================================================
• Subject                   (Text)       : Operations: Book Hotel & Transport
• What_Id                   (Lookup)     : Linked Deal ID
• $se_module                (String)     : Deals
• Booking_Id                (Text)       : Deal ID
• Booking_Name              (Text)       : Deal Name
• Customer_Name             (Text)       : Customer Name
• Priority                  (Picklist)   : High
• Status                    (Picklist)   : Not Started
• Due_Date                  (Date)       : 2 Calendar Days from Payment Date
• Destinations              (Text)       : Destination Name
• Travel_Start_Date         (Date)       : Tour Start Date
• Travel_End_Date           (Date)       : Tour End Date
• Rooms_Count               (Number)     : Rooms Count
• Sharing_Type              (Text)       : Sharing Preference
• Preferred_Room_Category   (Text)       : Room Category
• Vehicle_Type              (Text)       : Vehicle Type
• Itinerary_URL             (URL/Text)   : Proposal URL
• Itinerary_Unique_ID       (Text)       : Itinerary Slug
• Hotel_Booked              (Boolean)    : false
• Transport_Arranged        (Boolean)    : false
• Total_Amount              (Currency)   : Total Quotation Amount
• Advance_Amount_Paid       (Currency)   : Amount Received
• Balance_Pending_Amount    (Currency)   : Balance Due
• Mobile / Phone            (Phone)      : Customer Mobile
• Description               (Large Text) : Full briefing & room details
• st_Hotel, nd_Hotel, rd_Hotel, th_Hotel1, th_Hotel, th_Hotel2 (Lookup)
• st_Hotel_city, nd_Hotel_City, rd_Hotel_City, th_Hotel_city1, th_Hotel_City, th_Hotel_City2 (Text)
• st_Hotel_Nights, nd_Hotel_Nights, rd_Hotel_Nights, th_Hotel_Nights2, th_Hotel_Nights1, th_Hotel_Nights (Number)
• st_Hotel_Stay_Dates, nd_Hotel_Stay_Dates, rd_Hotel_Stay_Dates, th_Hotel_Stay_Dates2, th_Hotel_Stay_Dates1, th_Hotel_Stay_Dates (Text)
• Hotel_1_category to Hotel_6_Category   : Room Categories


================================================================================
5. MODULE: Leads (Lead Details & Updates)
================================================================================
• Lead_Status               (Picklist)   : Booking / Confirmed
• Advance_Amount_Paid       (Currency)   : Total Paid Amount
• Balance_Pending_Amount    (Currency)   : Remaining Pending Balance
• First_Name / Last_Name    (Text)       : Guest Name
• Email                     (Email)      : Guest Email
• Mobile                    (Phone)      : Guest Mobile
• Destinations              (Text)       : Tour Destination
• Event_Category            (Text)       : Itinerary Title / Trip Slug
• Itinerary_Unique_id       (Text)       : Unique Itinerary ID
• Number_Of_Guest           (Number)     : Guests Count
• Sharing_Type              (Text)       : Sharing Type
• Preferred_Start_date      (Date)       : Tour Start Date
• Travel_End_Date           (Date)       : Tour End Date
• Lead_Source               (Picklist)   : Website / Custom Itinerary
• watiwhatsappintegrationforzohocrm__Country_Code (Text) : +91


================================================================================
6. MODULE: Notes & Attachments
================================================================================
• Attachments API           : /crm/v3/Leads/${id}/Attachments (Official PDF Tax Invoice)
• Notes API                 : /crm/v3/Notes
  - Note_Title              : Payment Installment Label + Amount
  - Note_Content            : Complete audit log (Payment ID, Order ID, Invoice #, PAN, GST)
  - Parent_Id               : Lead ID / Deal ID
  - $se_module              : Leads / Deals
