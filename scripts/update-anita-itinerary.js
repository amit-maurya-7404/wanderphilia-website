const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const moments = [
    "Rejuvenating Experience: Traditional Hot Stone Bath after the trek (Best Traditional Experience)",
    "River Rafting Adventure in Punakha (Mo Chhu / Machu Pachu River)",
    "Full Day Scenic Tour & Excursion to Glacial Phobjika Valley & Gangtey",
    "Iconic Trek to Taktsang Monastery (Tiger's Nest) dramatically perched at 3,120m",
    "Drive via breathtaking Dochula Pass (108 Chortens) with panoramic Himalayan views",
    "Walk across Bhutan's longest Suspension Bridge & visit majestic Punakha Dzong"
  ];

  const highlights = [
    "Bagdogra – Phuntsholing",
    "Phuntsholing – Thimphu",
    "Thimphu Exploration",
    "Thimphu – Punakha",
    "Phobjika Valley Excursion",
    "Punakha – Paro",
    "Tiger's Nest Experience",
    "Paro – Siliguri",
    "Departure"
  ];

  const hotels = [
    {
      index: 1,
      hotelName: "Hotel GaMeGa / Similar",
      city: "Phuntsholing",
      nights: 1,
      roomCategory: "Double Sharing",
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
      roomCategory: "Double Sharing",
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
      roomCategory: "Double Sharing",
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
      roomCategory: "Double Sharing",
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
      roomCategory: "Double Sharing",
      category: "Premium Collection",
      stayDates: "1N Stay",
      basePrice: 0,
      extraBedPrice: 0,
      childWithoutBedPrice: 0
    }
  ];

  const inclusions = [
    "8 Nights accommodation on double sharing basis (1N Phuntsholing, 2N Thimphu, 2N Punakha, 2N Paro, 1N Siliguri).",
    "Breakfast & Dinner included (Breakfast except Day 1, Dinner except Day 9).",
    "River Rafting Adventure in Punakha (Mo Chhu / Machu Pachu River).",
    "Unique Traditional Bhutanese Hot Stone Bath in Paro after Tiger's Nest Hike.",
    "Day Tour Excursion to serene Phobjika Valley, Gangtey Monastery & Nature Trail.",
    "Comfortable & Spacious 7-Seater Toyota Hiace for Bhutan Sector (8 Days).",
    "2 Dedicated Sedan Cars for Indian Sector transfers (Bagdogra – Phuntsholing & Siliguri departure).",
    "Professional Local English-Speaking Bhutanese Guide to make your journey comfortable & memorable.",
    "Sustainable Development Fee (SDF) included for all nights in Bhutan.",
    "All Toll, Parking, Fuel, Driver Night Charges and Border Permits included."
  ];

  const exclusions = [
    "Airfare or Train fare to/from Bagdogra / NJP.",
    "Personal expenses (telephone calls, laundry, beverages, mini-bar).",
    "Lunch and any meals not mentioned in package inclusions.",
    "Monument entry fees & museum camera permits unless specified.",
    "Travel & medical insurance.",
    "Any expenses caused by unforeseen circumstances like weather delays, landslides, or road blocks."
  ];

  const dayPlans = [
    {
      day: 1,
      title: "Bagdogra – Phuntsholing",
      description: "Warm welcome at Bagdogra Airport and scenic drive through tea gardens and Himalayan foothills to Phuntsholing.",
      stayLocation: "Phuntsholing",
      durationNote: "Approx. 165 km | 4.5 – 5 hrs",
      meals: "Dinner",
      activities: [
        "Welcome at Bagdogra Airport",
        "Scenic drive through lush North Bengal tea gardens",
        "Border & entry formalities at Indo-Bhutan border",
        "Check-in & evening leisure at Phuntsholing"
      ],
      timeline: [
        "Your journey begins with a warm welcome by our representative at Bagdogra Airport.",
        "Embark on a scenic drive of 165 km (4.5 – 5 hrs) through lush tea gardens and rolling Himalayan foothills.",
        "Upon reaching the Bhutan border, complete immigration and border entry formalities.",
        "Proceed into Phuntsholing and check in to Hotel GaMeGa / Similar.",
        "Spend the evening at leisure to relax, stroll through the vibrant border town, and prepare for your Himalayan exploration.",
        "Enjoy a delicious dinner and comfortable overnight stay at Hotel GaMeGa / Similar in Phuntsholing."
      ]
    },
    {
      day: 2,
      title: "Phuntsholing – Thimphu",
      description: "Ascend into the Eastern Himalayas towards the capital city of Thimphu with en-route waterfalls and cultural sights.",
      stayLocation: "Thimphu",
      durationNote: "Approx. 150 km | 5 – 6 hrs Mountain Drive",
      meals: "Breakfast, Dinner",
      activities: [
        "Mountain drive into the Eastern Himalayas",
        "Visit Geddu Stupa, Chukha Dam & Wankha Waterfall",
        "Kharbandi Gompa Monastery & Chuzom Confluence",
        "Tashichho Dzong illuminated & local evening markets"
      ],
      timeline: [
        "Enjoy a wholesome breakfast at the hotel and complete check-out formalities.",
        "Ascend into the Eastern Himalayas on a scenic 150 km mountain drive (5 – 6 hrs) towards the capital city.",
        "En route, visit the serene Kharbandi Gompa Monastery with panoramic plains views, followed by Geddu Stupa.",
        "Witness the impressive engineering of Chukha Dam and the scenic cascading Wankha Waterfall.",
        "Pass through the picturesque Chuzom Confluence where the Wang Chhu (Thimphu) and Pa Chhu (Paro) rivers merge.",
        "Arrive in Thimphu, check in to Overland Thimphu / Similar, freshen up and unwind.",
        "By evening, explore the grand Tashichho Dzong (the Fortress of the Glorious Religion) and browse vibrant local markets.",
        "Savor a delightful dinner and overnight stay at Overland Thimphu / Similar."
      ]
    },
    {
      day: 3,
      title: "Thimphu Exploration",
      description: "A culturally enriching day covering Motithang Takin Reserve, Buddha Dordenma, Simply Bhutan Museum, and National Memorial Chorten.",
      stayLocation: "Thimphu",
      durationNote: "Full Day City Sightseeing",
      meals: "Breakfast, Dinner",
      activities: [
        "Motithang Takin Reserve (Bhutan's National Animal)",
        "Magnificent Buddha Dordenma Statue (Kuenselphodrang)",
        "Interactive Simply Bhutan Museum & folk heritage",
        "National Memorial Chorten & evening café hopping"
      ],
      timeline: [
        "Relish a hearty breakfast at the hotel to energize for a culturally rich day in Thimphu.",
        "Visit the Motithang Takin Reserve to witness Bhutan's extraordinary national animal, the Takin, in its protected natural pine habitat.",
        "Marvel at the monumental Buddha Dordenma (Kuenselphodrang), a colossal bronze Buddha statue overlooking the entire valley with panoramic views.",
        "Experience authentic Bhutanese culture, dress up in traditional Gho & Kira, and try archery at the interactive Simply Bhutan Museum.",
        "Visit the spiritual National Memorial Chorten, one of Thimphu's most prominent religious landmarks, filled with devotees spinning prayer wheels.",
        "Spend the evening free for café hopping, tasting local butter tea, and shopping authentic Bhutanese handicrafts along Norzin Lam.",
        "Relish an authentic dinner and restful overnight stay at Overland Thimphu / Similar."
      ]
    },
    {
      day: 4,
      title: "Thimphu – Punakha",
      description: "Scenic drive via Dochula Pass (108 Chortens), explore the historic Punakha Dzong, Suspension Bridge, and Mo Chhu River Rafting.",
      stayLocation: "Punakha",
      durationNote: "Approx. 75 km | 2.5 – 3 hrs",
      meals: "Breakfast, Dinner",
      activities: [
        "Drive via Dochula Pass (108 Memorial Chortens)",
        "Magnificent riverside Punakha Dzong fortress",
        "Walk across Bhutan's longest Suspension Bridge",
        "Included Mo Chhu River Rafting Adventure"
      ],
      timeline: [
        "Enjoy breakfast and check out from your hotel in Thimphu.",
        "Embark on a scenic drive of 75 km (2.5 – 3 hrs) via the breathtaking Dochula Pass (3,100m) adorned with 108 memorial Chortens and panoramic Himalayan vistas.",
        "Descend into the warm, lush valley of Punakha with scenic terraced paddy fields.",
        "Visit the stunning Punakha Dzong ('Palace of Great Happiness'), perched majestically at the confluence of the Pho Chhu and Mo Chhu rivers.",
        "Walk across Bhutan's longest Suspension Bridge, feeling the gentle sway above the clear turquoise river waters.",
        "★ Included Highlight: Embark on an exciting River Rafting Adventure along the gentle rapids of the Mo Chhu River.",
        "Check in to Kunzang Resort / Similar, freshen up and unwind amidst tranquil valley surroundings.",
        "Enjoy a sumptuous dinner and peaceful overnight stay at Kunzang Resort / Similar in Punakha."
      ]
    },
    {
      day: 5,
      title: "Phobjika Valley Excursion",
      description: "Discover the pristine glacial valley of Phobjika, visit historic Gangtey Monastery, the Crane Centre, and walk the Nature Trail.",
      stayLocation: "Punakha",
      durationNote: "Approx. 80 km One Way | 3 – 3.5 hrs",
      meals: "Breakfast, Dinner",
      activities: [
        "Scenic mountain excursion to Phobjika Valley",
        "Historic 17th-century Gangtey Monastery",
        "Black-Necked Crane Conservation Centre",
        "Gangtey Nature Trail Walk through meadows & pines"
      ],
      timeline: [
        "Enjoy an early breakfast at the resort before setting out on a memorable day trip.",
        "Drive 80 km (3 – 3.5 hrs) into the serene, wide glacial valley of Phobjika (Gangtey), famous for its untouched natural beauty.",
        "Visit the historic 17th-century Gangtey Monastery, the primary seat of the Pema Lingpa tradition.",
        "Visit the Black-Necked Crane Conservation Centre to discover the migratory birds that fly across the Himalayas every winter.",
        "Embark on a gentle, scenic Gangtey Nature Trail Walk through flower-carpeted meadows, babbling streams, and tranquil pine forests.",
        "Drive back to Punakha in the late afternoon while taking in golden mountain sunsets.",
        "Return to the resort for a warm dinner and relaxed overnight stay at Kunzang Resort / Similar."
      ]
    },
    {
      day: 6,
      title: "Punakha – Paro",
      description: "Visit Chimi Lhakhang (Fertility Temple), drive to Paro, explore Ta Dzong National Museum, Rinpung Dzong, and Tamchog Iron Bridge.",
      stayLocation: "Paro",
      durationNote: "Approx. 125 km | 4 – 5 hrs",
      meals: "Breakfast, Dinner",
      activities: [
        "Visit Chimi Lhakhang (Fertility Temple)",
        "Scenic drive to Paro Valley via Tamchog Iron Bridge",
        "Ta Dzong National Museum & Rinpung Dzong",
        "Evening stroll through charming Paro town"
      ],
      timeline: [
        "Enjoy a wholesome breakfast at Kunzang Resort and complete check-out formalities.",
        "Take a scenic walk through rural rice fields to visit Chimi Lhakhang, the legendary Fertility Temple dedicated to Lama Drukpa Kunley.",
        "Continue the scenic 125 km drive (4 – 5 hrs) towards the historic valley of Paro.",
        "En route, stop at Tamchog Lhakhang and cross the historic 15th-century iron chain suspension bridge.",
        "Upon arriving in Paro, visit the National Museum (Ta Dzong), featuring rare Bhutanese artifacts, ancient weapons, and thangkas.",
        "Explore the imposing Rinpung Dzong, one of the finest examples of classic Bhutanese fortress architecture.",
        "Check in to Udhumara Resort / Similar; enjoy free time in the evening exploring Paro's charming wooden storefronts and local cafés.",
        "Relish a gourmet dinner and overnight stay at Udhumara Resort / Similar in Paro."
      ]
    },
    {
      day: 7,
      title: "Tiger's Nest Experience",
      description: "Trek to the iconic Taktsang Monastery (Tiger’s Nest) at 3,120m, followed by a deeply rejuvenating traditional Bhutanese Hot Stone Bath.",
      stayLocation: "Paro",
      durationNote: "Approx. 5 – 6 hrs Round Hike",
      meals: "Breakfast, Dinner",
      activities: [
        "Hike to iconic Taktsang Monastery (Tiger's Nest)",
        "Dramatic cliffside views at 3,120m elevation",
        "Traditional Bhutanese Hot Stone Bath rejuvenation",
        "Celebratory dinner at the resort"
      ],
      timeline: [
        "Energize with an early morning breakfast at Udhumara Resort before Bhutan's most legendary pilgrimage.",
        "Begin the iconic 5 – 6 hour round-trip hike to Taktsang Monastery (Tiger's Nest), clinging dramatically to a vertical granite cliff at 3,120 meters.",
        "Savor panoramic views of the Paro Valley from the cafeteria viewpoint and take in the spiritual tranquility of the sacred caves.",
        "Descend back to the valley base carrying photographs and a profound sense of accomplishment.",
        "★ Included Highlight: Indulge in a deeply relaxing traditional Bhutanese Hot Stone Bath heated with river stones and healing mountain herbs — the best traditional experience to soothe muscles after the hike.",
        "Spend the evening at leisure resting and reflecting on an extraordinary journey.",
        "Enjoy a celebratory dinner and comfortable overnight stay at Udhumara Resort / Similar in Paro."
      ]
    },
    {
      day: 8,
      title: "Paro – Siliguri",
      description: "A scenic full-day drive back to India with gradual descent from the Himalayas, arriving in Siliguri for evening relaxation.",
      stayLocation: "Siliguri",
      durationNote: "Approx. 280 km | 8 – 9 hrs",
      meals: "Breakfast, Dinner",
      activities: [
        "Scenic highway drive descending from the Himalayas",
        "Exit border formalities at Phuntsholing / Jaigaon",
        "Arrive in Siliguri, check in to Hotel Cinderella",
        "Evening leisure at Sevoke Road cafés & shopping"
      ],
      timeline: [
        "Enjoy an early morning breakfast at Udhumara Resort and complete check-out.",
        "Embark on a scenic 280 km drive (8 – 9 hrs) descending gradually through mountain gorges back towards India.",
        "Reach the border at Phuntsholing, complete exit immigration formalities, and cross into Jaigaon.",
        "Drive through the scenic Dooars corridor of North Bengal towards Siliguri.",
        "Arrive in Siliguri in the evening and check in to Hotel Cinderella / Similar.",
        "Spend the evening at leisure for shopping, dining, or relaxing around Sevoke Road cafés.",
        "Enjoy dinner and a restful overnight stay at Hotel Cinderella / Similar in Siliguri."
      ]
    },
    {
      day: 9,
      title: "Departure",
      description: "Relish breakfast at Hotel Cinderella, check out, and enjoy comfortable private transfer to Bagdogra Airport / NJP Railway Station.",
      stayLocation: "Departure (Trip Ends)",
      durationNote: "Airport / Railway Station Transfer",
      meals: "Breakfast",
      activities: [
        "Hearty breakfast at Hotel Cinderella",
        "Hotel check-out formalities",
        "Private transfer to Bagdogra Airport / NJP Station",
        "Farewell with cherished Himalayan memories"
      ],
      timeline: [
        "Relish a hearty breakfast at Hotel Cinderella to wrap up an unforgettable journey.",
        "Complete check-out formalities at the hotel.",
        "Enjoy a comfortable private transfer to Bagdogra Airport (IXB) or New Jalpaiguri Railway Station (NJP) for your onward journey.",
        "Bid farewell to the Himalayas, carrying lifelong cherished memories of Bhutan with Wanderphilia."
      ]
    }
  ];

  const updateFields = {
    title: "8 Nights / 9 Days Curated Himalayan Family Journey",
    subTitle: "Final Bhutan 8N/9Days with Hiace Bus (Double Sharing)",
    destination: "Bhutan",
    travelStyle: "Family Trip",
    tripType: "Customised Trip",
    noOfDays: 9,
    noOfNights: 8,
    vehicleType: "Toyota Hiace (Bhutan Sector 8 Days) + 2 Sedan Cars (Indian Sector)",
    mealPlan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)",
    primaryHotel: "Hotel GaMeGa / Similar",
    hotelName: "Hotel GaMeGa / Similar",
    roomCategory: "Double Sharing",
    perAdultPrice: 49500,
    adults: 2,
    finalQuotationAmount: 99000,
    baseAmount: 94286,
    gstPercentage: 5,
    gstAmount: 4714,
    tcsPercentage: 0,
    tcsAmount: 0,
    moments: moments,
    highlights: highlights,
    hotels: hotels,
    inclusions: inclusions,
    exclusions: exclusions,
    dayPlans: dayPlans,
    stay: {
      hotelName: "Hotel GaMeGa / Similar",
      roomCategory: "Double Sharing",
      mealPlan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)",
      checkIn: "2:00 PM",
      checkOut: "11:00 AM"
    },
    leadDetails: {
      name: "Anita",
      firstName: "Anita",
      lastName: "",
      email: "",
      phone: "",
      mobile: "",
      guests: 2,
      adults: 2,
      kids: 0,
      kidsDetails: [],
      childrenDetails: [],
      startDate: "2026-11-25",
      endDate: "2026-12-03",
      duration: "2026-11-25 to 2026-12-03",
      noOfDays: 9,
      noOfNights: 8,
      travelStyle: "Family Trip",
      tripType: "Customised Trip",
      finalQuotationAmount: 99000,
      baseQuotationAmount: 94286,
      perAdultPrice: 49500,
      baseAmount: 94286,
      gstPercentage: 5,
      gstAmount: 4714,
      tcsPercentage: 0,
      tcsAmount: 0,
      hotels: hotels,
      preferredRoomCategory: "Double Sharing",
      mealPlan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)"
    },
    rawZohoData: {
      Full_Name: "Anita",
      First_Name: "Anita",
      Guests: 2,
      Adults: 2,
      Number_Of_Guest: 2,
      Number_Of_Guests: 2,
      Vehicle_Type: "Toyota Hiace (Bhutan Sector 8 Days) + 2 Sedan Cars (Indian Sector)",
      Travel_Style: "Family Trip",
      Trip_Type: "Customised Trip",
      Destination: "Bhutan",
      Destinations: "Bhutan",
      Hotel_Category: "Premium Collection",
      Preferred_Room_Category: "Double Sharing",
      Meal_Plan: "Breakfast & Dinner (Except Breakfast Day 1 & Dinner Day 9)",
      Quotation_Amount: 99000,
      Total_Package_Cost: 99000,
      Final_Quotation_Amount: 99000,
      hotels: hotels,
      inclusions: inclusions,
      exclusions: exclusions,
      moments: moments
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

