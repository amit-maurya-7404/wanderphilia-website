const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const hotels = [
    {
      index: 1,
      hotelName: "Hotel GaMeGa / Similar",
      city: "Phuntsholing",
      nights: 1,
      roomCategory: "Double Sharing (3 Rooms)",
      category: "Premium Collection",
      stayDates: "1N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    },
    {
      index: 2,
      hotelName: "Overland Thimphu / Similar",
      city: "Thimphu",
      nights: 2,
      roomCategory: "Double Sharing (3 Rooms)",
      category: "Premium Collection",
      stayDates: "2N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    },
    {
      index: 3,
      hotelName: "Kunzang Resort / Similar",
      city: "Punakha",
      nights: 2,
      roomCategory: "Double Sharing (3 Rooms)",
      category: "Premium Collection",
      stayDates: "2N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    },
    {
      index: 4,
      hotelName: "Udhumara Resort / Similar",
      city: "Paro",
      nights: 2,
      roomCategory: "Double Sharing (3 Rooms)",
      category: "Premium Collection",
      stayDates: "2N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    },
    {
      index: 5,
      hotelName: "Hotel Cinderella / Similar",
      city: "Siliguri",
      nights: 1,
      roomCategory: "Double Sharing (3 Rooms)",
      category: "Premium Collection",
      stayDates: "1N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    }
  ];

  const inclusions = [
    "8 Nights accommodation on double sharing basis in 3 Rooms (1N Phuntsholing, 2N Thimphu, 2N Punakha, 2N Paro, 1N Siliguri).",
    "Daily Breakfast & Dinner included (Breakfast except Day 1, Dinner except Day 9).",
    "Exciting River Rafting Adventure in Punakha (Mo Chhu / Machu Pachu River).",
    "Unique Traditional Bhutanese Hot Stone Bath in Paro after Tiger's Nest Hike.",
    "Day Tour Excursion to serene Phobjika Valley, Gangtey Monastery & Nature Trail.",
    "Comfortable & Spacious 7-Seater Toyota Hiace for Bhutan Sector (7 Days).",
    "2 Dedicated Sedan Cars for Indian Sector transfers (2 Days: Bagdogra to Phuntsholing & Siliguri departure).",
    "Professional Local English-Speaking Bhutanese Guide throughout the Bhutan tour.",
    "Sustainable Development Fee (SDF) included for all nights in Bhutan.",
    "All Toll, Parking, Fuel, Driver Night Charges and Border Permits included."
  ];

  const vehicleType = "Toyota Hiace (7 Days Bhutan Sector) + 2 Sedan Cars (2 Days Indian Sector)";
  const guests = 6;
  const adults = 6;
  const perAdultPrice = 49500;
  const finalQuotationAmount = 297000;
  const baseAmount = 282857;
  const gstAmount = 14143;

  const updateFields = {
    title: "8 Nights / 9 Days Magical Bhutan Girls Journey",
    subTitle: "Ms. Anita's Girls Trip | 8N/9D Bhutan Getaway (6 Guests)",
    travelStyle: "Girls Trip",
    tripType: "Customised Trip",
    vehicleType: vehicleType,
    adults: adults,
    guests: guests,
    roomsCount: 3,
    perAdultPrice: perAdultPrice,
    finalQuotationAmount: finalQuotationAmount,
    baseAmount: baseAmount,
    gstPercentage: 5,
    gstAmount: gstAmount,
    tcsPercentage: 0,
    tcsAmount: 0,
    hotels: hotels,
    inclusions: inclusions,
    stay: {
      hotelName: "Hotel GaMeGa / Similar",
      roomCategory: "Double Sharing (3 Rooms)",
      mealPlan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)",
      checkIn: "2:00 PM",
      checkOut: "11:00 AM"
    },
    leadDetails: {
      name: "Ms. Anita's Girls Trip",
      firstName: "Ms. Anita's Girls Trip",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      guests: guests,
      adults: adults,
      kids: 0,
      roomsCount: 3,
      startDate: "2026-11-25",
      endDate: "2026-12-03",
      duration: "2026-11-25 to 2026-12-03",
      noOfDays: 9,
      noOfNights: 8,
      travelStyle: "Girls Trip",
      tripType: "Customised Trip",
      finalQuotationAmount: finalQuotationAmount,
      baseQuotationAmount: baseAmount,
      perAdultPrice: perAdultPrice,
      baseAmount: baseAmount,
      gstPercentage: 5,
      gstAmount: gstAmount,
      tcsPercentage: 0,
      tcsAmount: 0,
      hotels: hotels,
      preferredRoomCategory: "Double Sharing (3 Rooms)",
      mealPlan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)"
    },
    rawZohoData: {
      Full_Name: "Ms. Anita's Girls Trip",
      First_Name: "Ms. Anita's Girls Trip",
      Guests: guests,
      Adults: adults,
      Number_Of_Guest: guests,
      Number_Of_Guests: guests,
      Rooms_Count: 3,
      Vehicle_Type: vehicleType,
      Travel_Style: "Girls Trip",
      Trip_Type: "Customised Trip",
      Destination: "Bhutan",
      Destinations: "Bhutan",
      Hotel_Category: "Premium Collection",
      Preferred_Room_Category: "Double Sharing (3 Rooms)",
      Meal_Plan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)",
      Quotation_Amount: finalQuotationAmount,
      Total_Package_Cost: finalQuotationAmount,
      Final_Quotation_Amount: finalQuotationAmount,
      hotels: hotels,
      inclusions: inclusions
    },
    updatedAt: new Date()
  };

  const result = await db.collection('itineraries').updateOne(
    { $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }] },
    { $set: updateFields }
  );

  console.log('Update result:', result);
  await client.close();
}

run().catch(console.error);

