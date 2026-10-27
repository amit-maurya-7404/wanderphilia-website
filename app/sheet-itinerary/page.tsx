'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  Users,
  Hotel,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  Search,
  IndianRupee,
  Car,
  Utensils,
  HelpCircle,
  FileText,
  Compass,
  ChevronDown,
  X,
  Layers,
  Calculator,
  Database,
  Baby,
  RotateCcw,
  Clock,
  Info,
  Lock,
  Unlock,
  ListChecks,
  XCircle,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { ItineraryHistorySection } from '@/components/itinerary/itinerary-history-section';
import {
  calculateRoomsAndBeds,
  calculateLeadPricingOffline,
  isExtraBed,
  isWithoutBed
} from '@/lib/zoho-pricing';

// --- BASELINE CATALOGS ---
const DEFAULT_CITIES_BY_DESTINATION: Record<string, string[]> = {
  // --- NORTH INDIA & HIMALAYAS ---
  spiti: [
    'Shimla',
    'Narkanda',
    'Rampur',
    'Sarahan',
    'Sangla',
    'Chitkul',
    'Kalpa',
    'Pooh',
    'Nako',
    'Gue (Mummy Village)',
    'Tabo',
    'Dhankar',
    'Pin Valley (Mudh)',
    'Kaza',
    'Ki / Key Monastery',
    'Kibber',
    'Chicham Bridge',
    'Hikkim (Highest Post Office)',
    'Komic (Highest Village)',
    'Langza (Fossil Village)',
    'Losar',
    'Kunzum Pass',
    'Chandratal Lake',
    'Batal',
    'Sissu / Atal Tunnel',
    'Manali'
  ],
  spitivalley: [
    'Shimla',
    'Narkanda',
    'Rampur',
    'Sarahan',
    'Sangla',
    'Chitkul',
    'Kalpa',
    'Pooh',
    'Nako',
    'Gue (Mummy Village)',
    'Tabo',
    'Dhankar',
    'Pin Valley (Mudh)',
    'Kaza',
    'Ki / Key Monastery',
    'Kibber',
    'Chicham Bridge',
    'Hikkim (Highest Post Office)',
    'Komic (Highest Village)',
    'Langza (Fossil Village)',
    'Losar',
    'Kunzum Pass',
    'Chandratal Lake',
    'Batal',
    'Sissu / Atal Tunnel',
    'Manali'
  ],
  ladakh: [
    'Leh',
    'Shey Palace',
    'Thiksey Monastery',
    'Hemis Monastery',
    'Sham Valley',
    'Sangam (Indus-Zanskar)',
    'Magnetic Hill',
    'Gurudwara Pathar Sahib',
    'Alchi',
    'Likir',
    'Lamayuru (Moonland)',
    'Khardung La Pass',
    'Nubra Valley',
    'Diskit',
    'Hunder (Sand Dunes)',
    'Turtuk (Balti Village)',
    'Thang (Zero Point)',
    'Pangong Tso',
    'Spangmik',
    'Tangtse',
    'Chang La Pass',
    'Tso Moriri',
    'Tso Kar',
    'Kargil',
    'Dras',
    'Zanskar (Padum)'
  ],
  lehladakh: [
    'Leh',
    'Shey Palace',
    'Thiksey Monastery',
    'Hemis Monastery',
    'Sham Valley',
    'Sangam (Indus-Zanskar)',
    'Magnetic Hill',
    'Gurudwara Pathar Sahib',
    'Alchi',
    'Likir',
    'Lamayuru (Moonland)',
    'Khardung La Pass',
    'Nubra Valley',
    'Diskit',
    'Hunder (Sand Dunes)',
    'Turtuk (Balti Village)',
    'Thang (Zero Point)',
    'Pangong Tso',
    'Spangmik',
    'Tangtse',
    'Chang La Pass',
    'Tso Moriri',
    'Tso Kar',
    'Kargil',
    'Dras',
    'Zanskar (Padum)'
  ],
  kashmir: [
    'Srinagar',
    'Dal Lake',
    'Gulmarg',
    'Pahalgam',
    'Aru Valley',
    'Betaab Valley',
    'Chandanwari',
    'Baisaran Valley (Mini Switzerland)',
    'Sonamarg',
    'Thajiwas Glacier',
    'Zero Point (Sonamarg)',
    'Doodhpathri',
    'Yusmarg',
    'Gurez Valley',
    'Sinthan Top',
    'Anantnag',
    'Verinag'
  ],
  himachal: [
    'Shimla',
    'Kufri',
    'Chail',
    'Narkanda',
    'Mashobra',
    'Kullu',
    'Manali',
    'Solang Valley',
    'Rohtang Pass',
    'Atal Tunnel',
    'Sissu',
    'Kasol',
    'Manikaran',
    'Tosh',
    'Chalal',
    'Malana',
    'Jibhi',
    'Tirthan Valley',
    'Shoja / Jalori Pass',
    'Dharamshala',
    'McLeodGanj',
    'Dharamkot',
    'Triund',
    'Palampur',
    'Bir Billing',
    'Dalhousie',
    'Khajjiar',
    'Chamba'
  ],
  himachalpradesh: [
    'Shimla',
    'Kufri',
    'Chail',
    'Narkanda',
    'Mashobra',
    'Kullu',
    'Manali',
    'Solang Valley',
    'Rohtang Pass',
    'Atal Tunnel',
    'Sissu',
    'Kasol',
    'Manikaran',
    'Tosh',
    'Chalal',
    'Malana',
    'Jibhi',
    'Tirthan Valley',
    'Shoja / Jalori Pass',
    'Dharamshala',
    'McLeodGanj',
    'Dharamkot',
    'Triund',
    'Palampur',
    'Bir Billing',
    'Dalhousie',
    'Khajjiar',
    'Chamba'
  ],
  uttarakhand: [
    'Rishikesh',
    'Haridwar',
    'Dehradun',
    'Mussoorie',
    'Dhanaulti',
    'Kanatal',
    'Nainital',
    'Bhimtal',
    'Naukuchiatal',
    'Sattal',
    'Mukteshwar',
    'Ranikhet',
    'Almora',
    'Kausani',
    'Binsar',
    'Jim Corbett',
    'Auli',
    'Joshimath',
    'Badrinath',
    'Kedarnath',
    'Gangotri',
    'Yamunotri',
    'Chopta',
    'Tungnath',
    'Valley of Flowers',
    'Chakrata',
    'Lansdowne'
  ],

  // --- RAJASTHAN & DESERT ---
  rajasthan: [
    'Jaipur',
    'Udaipur',
    'Jodhpur',
    'Jaisalmer',
    'Sam Sand Dunes',
    'Pushkar',
    'Ajmer',
    'Mount Abu',
    'Bikaner',
    'Ranthambore',
    'Kumbhalgarh',
    'Chittorgarh',
    'Jawai',
    'Mandawa',
    'Bharatpur',
    'Sariska / Alwar',
    'Bundi',
    'Neemrana'
  ],

  // --- GOLDEN TRIANGLE ---
  goldentriangle: [
    'Delhi',
    'Agra',
    'Jaipur',
    'Fatehpur Sikri',
    'Mathura',
    'Vrindavan'
  ],

  // --- BEACHES & WEST ---
  goa: [
    'North Goa',
    'South Goa',
    'Panaji (Fontainhas)',
    'Calangute',
    'Baga',
    'Anjuna',
    'Candolim',
    'Vagator',
    'Morjim',
    'Arambol',
    'Colva',
    'Benaulim',
    'Palolem',
    'Agonda',
    'Old Goa',
    'Dudhsagar Waterfalls'
  ],
  maharashtra: [
    'Mumbai',
    'Pune',
    'Lonavala & Khandala',
    'Mahabaleshwar',
    'Panchgani',
    'Alibaug',
    'Matheran',
    'Lavasa',
    'Shirdi',
    'Nashik (Sula Vineyards)',
    'Igatpuri',
    'Aurangabad (Ajanta & Ellora)',
    'Tarkarli (Malvan)',
    'Tadoba',
    'Tadoba National Park',
    'Nagpur'
  ],
  tadoba: [
    'Tadoba',
    'Tadoba National Park',
    'Nagpur',
    'Chandrapur',
    'Moharli',
    'Kolara'
  ],
  tadobanationalpark: [
    'Tadoba',
    'Tadoba National Park',
    'Nagpur',
    'Chandrapur',
    'Moharli',
    'Kolara'
  ],
  gujarat: [
    'Ahmedabad',
    'Rann of Kutch (Dhordo / White Desert)',
    'Bhuj',
    'Gir National Park',
    'Somnath',
    'Dwarka',
    'Statue of Unity (Kevadia)',
    'Diu Island',
    'Saputara'
  ],

  // --- SOUTH INDIA ---
  kerala: [
    'Kochi (Fort Kochi)',
    'Munnar',
    'Thekkady (Periyar)',
    'Alleppey (Houseboats)',
    'Kumarakom',
    'Kovalam',
    'Varkala (Cliff Beach)',
    'Wayanad',
    'Poovar Island',
    'Athirappilly Waterfalls',
    'Bekal',
    'Marari Beach',
    'Vagamon',
    'Kanyakumari'
  ],
  karnataka: [
    'Bangalore',
    'Mysore',
    'Coorg (Madikeri)',
    'Chikmagalur',
    'Kabini / Nagarhole',
    'Bandipur',
    'Hampi',
    'Gokarna (Om Beach)',
    'Murudeshwar',
    'Dandeli',
    'Udupi & Mangalore',
    'Badami',
    'Sakleshpur'
  ],
  tamilnadu: [
    'Chennai',
    'Mahabalipuram',
    'Pondicherry (Auroville)',
    'Madurai (Meenakshi Temple)',
    'Rameswaram (Dhanushkodi)',
    'Kanyakumari',
    'Ooty (Nilgiris)',
    'Coonoor',
    'Kodaikanal',
    'Thanjavur',
    'Chettinad',
    'Coimbatore',
    'Yercaud'
  ],
  pondicherry: [
    'Pondicherry (White Town)',
    'Auroville',
    'Paradise Beach',
    'Promenade Beach',
    'Mahabalipuram',
    'Chennai'
  ],

  // --- CENTRAL INDIA ---
  madhyapradesh: [
    'Bhopal',
    'Indore',
    'Ujjain (Mahakaleshwar)',
    'Omkareshwar',
    'Mandu',
    'Maheshwar',
    'Gwalior',
    'Orchha',
    'Khajuraho',
    'Bandhavgarh',
    'Kanha',
    'Pench',
    'Pachmarhi',
    'Jabalpur (Bhedaghat)'
  ],

  // --- EAST & NORTHEAST ---
  meghalaya: [
    'Guwahati',
    'Shillong',
    'Umiam Lake',
    'Cherrapunji (Sohra)',
    'Mawlynnong (Cleanest Village)',
    'Dawki (Umngot River)',
    'Shnongpdeng',
    'Jowai (Krang Suri)',
    'Nongriat (Double Decker Living Root Bridge)'
  ],
  northeast: [
    'Guwahati',
    'Shillong',
    'Cherrapunji',
    'Dawki',
    'Kaziranga',
    'Tawang',
    'Dirang',
    'Bomdila',
    'Majuli Island',
    'Ziro Valley'
  ],
  sikkim: [
    'Gangtok',
    'Tsomgo Lake & Nathula',
    'Lachen',
    'Gurudongmar Lake',
    'Lachung',
    'Yumthang Valley (Zero Point)',
    'Pelling (Skywalk)',
    'Ravangla (Buddha Park)',
    'Namchi (Char Dham)',
    'Darjeeling (Tiger Hill)',
    'Kalimpong',
    'Mirik'
  ],
  sikkimanddarjeeling: [
    'Gangtok',
    'Tsomgo Lake & Nathula',
    'Lachen',
    'Gurudongmar Lake',
    'Lachung',
    'Yumthang Valley (Zero Point)',
    'Pelling (Skywalk)',
    'Ravangla (Buddha Park)',
    'Namchi (Char Dham)',
    'Darjeeling (Tiger Hill)',
    'Kalimpong',
    'Mirik'
  ],
  darjeeling: [
    'Darjeeling',
    'Tiger Hill',
    'Batasia Loop',
    'Ghoom',
    'Mirik',
    'Kalimpong',
    'Kurseong',
    'Gangtok'
  ],
  arunachal: [
    'Guwahati',
    'Bhalukpong',
    'Dirang',
    'Sela Pass',
    'Tawang',
    'Bum La Pass',
    'Madhuri Lake',
    'Bomdila',
    'Ziro'
  ],
  arunachalpradesh: [
    'Guwahati',
    'Bhalukpong',
    'Dirang',
    'Sela Pass',
    'Tawang',
    'Bum La Pass',
    'Madhuri Lake',
    'Bomdila',
    'Ziro'
  ],
  assam: [
    'Guwahati',
    'Kaziranga National Park',
    'Majuli Island',
    'Manas National Park',
    'Tezpur',
    'Jorhat',
    'Sivasagar'
  ],
  andaman: [
    'Port Blair',
    'Havelock Island (Radhanagar Beach)',
    'Elephant Beach (Havelock)',
    'Neil Island (Bharatpur & Laxmanpur)',
    'Natural Bridge (Neil Island)',
    'Ross Island',
    'North Bay Island',
    'Baratang Island',
    'Diglipur'
  ],
  andamanandnicobar: [
    'Port Blair',
    'Havelock Island (Radhanagar Beach)',
    'Elephant Beach (Havelock)',
    'Neil Island (Bharatpur & Laxmanpur)',
    'Natural Bridge (Neil Island)',
    'Ross Island',
    'North Bay Island',
    'Baratang Island',
    'Diglipur'
  ],

  // --- INTERNATIONAL DESTINATIONS ---
  bali: [
    'Kuta',
    'Seminyak',
    'Canggu',
    'Ubud (Monkey Forest & Rice Terraces)',
    'Tegalalang',
    'Nusa Dua',
    'Jimbaran (Sunset Seafood)',
    'Uluwatu (Cliff Temple & Kecak Dance)',
    'Nusa Penida (Kelingking & Diamond Beach)',
    'Sanur',
    'Tanah Lot',
    'Kintamani (Mount Batur)',
    'Bedugul (Ulun Danu)',
    'Lovina',
    'Gili Trawangan',
    'Lombok'
  ],
  indonesia: [
    'Bali (Kuta & Seminyak)',
    'Canggu',
    'Ubud',
    'Nusa Dua',
    'Uluwatu',
    'Nusa Penida',
    'Gili Islands',
    'Lombok',
    'Jakarta',
    'Komodo Island',
    'Yogyakarta'
  ],
  dubai: [
    'Dubai Downtown (Burj Khalifa & Mall)',
    'Dubai Marina & JBR Walk',
    'Palm Jumeirah (Atlantis)',
    'Deira & Bur Dubai (Gold Souk)',
    'Dubai Desert Safari Dunes (BBQ Camp)',
    'Abu Dhabi (Sheikh Zayed Grand Mosque)',
    'Yas Island (Ferrari World)',
    'Sharjah',
    'Ras Al Khaimah',
    'Hatta'
  ],
  uae: [
    'Dubai Downtown (Burj Khalifa & Mall)',
    'Dubai Marina & JBR Walk',
    'Palm Jumeirah (Atlantis)',
    'Deira & Bur Dubai (Gold Souk)',
    'Dubai Desert Safari Dunes (BBQ Camp)',
    'Abu Dhabi (Sheikh Zayed Grand Mosque)',
    'Yas Island (Ferrari World)',
    'Sharjah',
    'Ras Al Khaimah',
    'Hatta'
  ],
  abudhabi: [
    'Abu Dhabi City',
    'Sheikh Zayed Grand Mosque',
    'Yas Island (Ferrari World & Warner Bros)',
    'Saadiyat Island (Louvre Abu Dhabi)',
    'Corniche',
    'Dubai'
  ],
  thailand: [
    'Bangkok (Grand Palace & Wat Arun)',
    'Pattaya (Walking Street)',
    'Coral Island (Koh Larn)',
    'Phuket (Patong & Kata Beach)',
    'Big Buddha & Old Phuket Town',
    'Krabi (Ao Nang)',
    'Railay Beach',
    'Phi Phi Islands (Maya Bay)',
    'James Bond Island',
    '4 Islands Tour (Krabi)',
    'Koh Samui',
    'Koh Phangan',
    'Chiang Mai (Doi Suthep)',
    'Chiang Rai (White Temple)',
    'Hua Hin'
  ],
  phuket: [
    'Phuket (Patong Beach)',
    'Kata & Karon Beach',
    'Phuket Old Town',
    'Big Buddha Phuket',
    'Phi Phi Islands (Maya Bay)',
    'James Bond Island',
    'Krabi',
    'Similan Islands'
  ],
  krabi: [
    'Krabi (Ao Nang)',
    'Railay Beach',
    'Phi Phi Islands',
    '4 Islands Tour',
    'Hong Island',
    'Emerald Pool & Hot Springs',
    'Phuket'
  ],
  vietnam: [
    'Hanoi (Old Quarter & Hoan Kiem Lake)',
    'Halong Bay (Overnight Cruise)',
    'Lan Ha Bay',
    'Ninh Binh (Trang An & Hang Mua)',
    'Da Nang (My Khe Beach & Dragon Bridge)',
    'Ba Na Hills (Golden Bridge Hands)',
    'Hoi An (Ancient Lantern Town)',
    'Hue (Imperial Citadel)',
    'Ho Chi Minh City (Saigon)',
    'Cu Chi Tunnels',
    'Mekong Delta',
    'Phu Quoc Island',
    'Sapa (Fansipan Peak & Rice Terraces)'
  ],
  singapore: [
    'Singapore City Downtown',
    'Marina Bay Sands & SkyPark',
    'Gardens by the Bay (Supertree & Cloud Forest)',
    'Sentosa Island (Universal Studios)',
    'S.E.A. Aquarium (Sentosa)',
    'Chinatown & Buddha Tooth Relic',
    'Little India',
    'Clarke Quay (Nightlife & Cruise)',
    'Orchard Road',
    'Jewel Changi (Rain Vortex)'
  ],
  malaysia: [
    'Kuala Lumpur (Petronas Twin Towers)',
    'Batu Caves',
    'Bukit Bintang (KL Downtown)',
    'Genting Highlands (SkyWay & Theme Park)',
    'Langkawi (Sky Bridge & Cable Car)',
    'Pantai Cenang (Langkawi)',
    'Penang / George Town',
    'Malacca / Melaka (Dutch Square)',
    'Cameron Highlands (Tea Gardens)',
    'Sunway Lagoon'
  ],
  maldives: [
    'Male City',
    'Hulhumale',
    'Maafushi Island (Local Island)',
    'Private Resort Water Villa Island',
    'South Ari Atoll (Whale Shark Safari)',
    'North Male Atoll',
    'Baa Atoll (Hanifaru Bay Manta Rays)',
    'Sandbank Picnic & Snorkeling Island',
    'Rasdhoo Island'
  ],
  switzerland: [
    'Zurich (Old Town & Lake Zurich)',
    'Lucerne (Chapel Bridge & Lake)',
    'Mount Titlis (Rotair & Ice Cliff)',
    'Interlaken (Between Lakes)',
    'Jungfraujoch (Top of Europe)',
    'Grindelwald (First Cliff Walk)',
    'Lauterbrunnen (Valley of Waterfalls)',
    'Zermatt (Matterhorn View)',
    'Geneva (Jet d’Eau)',
    'Montreux & Vevey (Chillon Castle)',
    'Bern',
    'Engelberg'
  ],
  europe: [
    'Paris (Eiffel Tower & Louvre)',
    'Amsterdam (Canal Cruise & Zaanse Schans)',
    'Brussels & Bruges (Belgium)',
    'Zurich & Lucerne (Switzerland)',
    'Interlaken & Jungfraujoch (Switzerland)',
    'Rome (Colosseum & Vatican City)',
    'Florence (Duomo & Uffizi)',
    'Venice (Gondola Ride & St. Mark’s)',
    'Milan (Duomo di Milano)',
    'Prague (Charles Bridge & Old Town)',
    'Vienna (Schonbrunn Palace)',
    'Budapest (Parliament & Danube)',
    'Munich & Neuschwanstein Castle',
    'Barcelona (Sagrada Familia)',
    'Madrid (Royal Palace)'
  ],
  srilanka: [
    'Colombo',
    'Kandy (Temple of the Tooth)',
    'Nuwara Eliya (Tea Estates)',
    'Ella (Nine Arch Bridge)',
    'Scenic Blue Train (Kandy to Ella)',
    'Bentota (Water Sports & Beach)',
    'Galle (UNESCO Dutch Fort)',
    'Mirissa (Whale Watching & Beach)',
    'Yala National Park (Leopard Safari)',
    'Sigiriya (Lion Rock Fortress)',
    'Dambulla (Cave Temple)'
  ],
  nepal: [
    'Kathmandu (Pashupatinath & Boudhanath)',
    'Swayambhunath (Monkey Temple)',
    'Pokhara (Phewa Lake & Sarangkot)',
    'World Peace Pagoda (Pokhara)',
    'Nagarkot (Himalayan Sunrise)',
    'Chitwan National Park (Safari)',
    'Lumbini (Birthplace of Buddha)',
    'Bhaktapur Durbar Square',
    'Chandragiri Cable Car'
  ],
  bhutan: [
    'Paro (Tiger’s Nest Monastery)',
    'Thimphu (Buddha Point & Dzong)',
    'Punakha (Punakha Dzong & Bridge)',
    'Dochula Pass (108 Chortens)',
    'Phobjikha Valley (Gangtey)',
    'Wangdue Phodrang',
    'Haa Valley'
  ],
  mauritius: [
    'Port Louis (Caudan Waterfront)',
    'Grand Baie (North Coast)',
    'Flic-en-Flac (West Coast)',
    'Chamarel (Seven Coloured Earth)',
    'Belle Mare (East Coast Watersports)',
    'Ile aux Cerfs Island (Catamaran)',
    'Le Morne (Underwater Waterfall Viewpoint)',
    'Casela Nature Parks (Safari)'
  ],
  turkey: [
    'Istanbul (Hagia Sophia, Blue Mosque & Bosphorus)',
    'Grand Bazaar & Spice Market',
    'Cappadocia (Hot Air Balloon & Goreme)',
    'Underground City (Derinkuyu)',
    'Antalya (Kaleici Old Town & Duden Falls)',
    'Pamukkale (Thermal Travertines & Hierapolis)',
    'Bodrum',
    'Kusadasi / Ephesus (Ancient Ruins)',
    'Fethiye (Oludeniz Blue Lagoon)'
  ],
  georgia: [
    'Tbilisi (Old Town & Sulphur Baths)',
    'Kazbegi / Stepantsminda (Gergeti Trinity)',
    'Gudauri (Ski Resort & Monument)',
    'Ananuri Fortress',
    'Batumi (Black Sea Coast & Boulevard)',
    'Sighnaghi (Wine Region)',
    'Borjomi (Mineral Springs)',
    'Mtskheta (Ancient Capital)'
  ],
  azerbaijan: [
    'Baku (Flame Towers & Old City)',
    'Icherisheher (Maiden Tower)',
    'Heydar Aliyev Center',
    'Gobustan (Mud Volcanoes & Petroglyphs)',
    'Ateshgah (Fire Temple) & Yanar Dag',
    'Gabala (Tufandag & Nohur Lake)',
    'Shahdag (Mountain & Ski Resort)',
    'Sheki (Khans Palace)'
  ],
  baku: [
    'Baku (Flame Towers & Old City)',
    'Icherisheher (Maiden Tower)',
    'Heydar Aliyev Center',
    'Gobustan (Mud Volcanoes & Petroglyphs)',
    'Ateshgah (Fire Temple) & Yanar Dag',
    'Gabala (Tufandag & Nohur Lake)',
    'Shahdag (Mountain & Ski Resort)',
    'Sheki'
  ],
  kazakhstan: [
    'Almaty City (Panfilov & Zenkov)',
    'Kok Tobe Hill & Cable Car',
    'Shymbulak Mountain Resort & Medeu',
    'Kolsai Lakes (Pearls of Tien Shan)',
    'Kaindy Lake (Submerged Forest)',
    'Charyn Canyon (Valley of Castles)',
    'Big Almaty Lake',
    'Astana / Nur-Sultan (Baiterek)'
  ],
  almaty: [
    'Almaty City (Panfilov & Zenkov)',
    'Kok Tobe Hill & Cable Car',
    'Shymbulak Mountain Resort & Medeu',
    'Kolsai Lakes (Pearls of Tien Shan)',
    'Kaindy Lake (Submerged Forest)',
    'Charyn Canyon (Valley of Castles)',
    'Big Almaty Lake'
  ],
  uzbekistan: [
    'Tashkent (Chorsu Bazaar & Metro)',
    'Samarkand (Registan Square)',
    'Shah-i-Zinda & Gur-e-Amir',
    'Bukhara (Po-i-Kalyan & Ark)',
    'Khiva (Itchan Kala Fortress)'
  ],
  japan: [
    'Tokyo (Shinjuku, Shibuya & Ginza)',
    'Asakusa Senso-ji & Akihabara',
    'Mount Fuji & Lake Kawaguchiko',
    'Hakone (Hot Springs & Lake Ashi)',
    'Kyoto (Fushimi Inari & Arashiyama)',
    'Kinkaku-ji (Golden Pavilion)',
    'Nara (Deer Park & Todai-ji)',
    'Osaka (Dotonbori & Castle)',
    'Hiroshima & Miyajima Island'
  ],
  egypt: [
    'Cairo (Giza Pyramids & Sphinx)',
    'Grand Egyptian Museum & Khan el-Khalili',
    'Alexandria (Citadel & Library)',
    'Luxor (Valley of the Kings & Karnak)',
    'Luxor Hot Air Balloon',
    'Aswan (Philae Temple & High Dam)',
    'Nile River Felucca',
    'Abu Simbel (Temples of Ramses II)',
    'Hurghada (Red Sea Scuba)',
    'Sharm El Sheikh (Ras Mohammed)'
  ],
  kenya: [
    'Nairobi (Giraffe Centre)',
    'Masai Mara (Safari & Great Migration)',
    'Lake Nakuru (Flamingos)',
    'Amboseli (Mt. Kilimanjaro View)',
    'Lake Naivasha',
    'Zanzibar (Tanzania Extension)'
  ],
  tanzania: [
    'Serengeti National Park',
    'Ngorongoro Crater',
    'Tarangire National Park',
    'Lake Manyara',
    'Mount Kilimanjaro',
    'Zanzibar (Stone Town & Beaches)'
  ]
};

const DEFAULT_EXPERIENCES_BY_CITY: Record<string, { name: string; guidedTour?: boolean; description?: string }[]> = {
  jaipur: [
    { name: 'City Palace', guidedTour: false, description: 'Explore the magnificent City Palace and discover Jaipur’s royal heritage through its grand courtyards, museums, and traditional architecture.' },
    { name: 'Hawa Mahal', guidedTour: false, description: 'Marvel at the iconic Palace of Winds with its 953 honeycombed windows built for royal women to observe city life.' },
    { name: 'Amber Fort', guidedTour: false, description: 'Explore the majestic hilltop Amber Fort featuring the dazzling Sheesh Mahal (Mirror Palace) and Rajput architecture.' },
    { name: 'Jantar Mantar', guidedTour: false, description: 'Discover the UNESCO World Heritage astronomical observatory and its fascinating geometric stone instruments.' },
    { name: 'Nahargarh Sunset Point', guidedTour: false, description: 'Enjoy panoramic sunset views overlooking the Pink City from the high ramparts of Nahargarh Fort.' },
    { name: 'Jal Mahal Photo Stop', guidedTour: false, description: 'Scenic photo stop at the serene Water Palace set amidst the waters of Man Sagar Lake.' },
    { name: 'Pink City Heritage Bazaar Walk', guidedTour: false, description: 'Walk through historic bazaars of Jaipur famous for block prints, gems, spices, and Rajasthani handicrafts.' },
    { name: 'Johari Bazaar', guidedTour: false, description: 'Explore Jaipur’s vibrant Johari Bazaar, known for traditional jewellery, gemstones, and festive shopping.' },
    { name: 'Patrika Gate', guidedTour: false, description: 'Admire the vibrant hand-painted murals and arches showcasing Rajasthan’s culture and heritage at Jawahar Circle.' },
    { name: 'Chokhi Dhani Cultural Village', guidedTour: false, description: 'Experience authentic Rajasthani village culture, traditional folk performances, and royal dining.' }
  ],
  jodhpur: [
    { name: 'Mehrangarh Fort', guidedTour: false, description: 'Visit one of India’s largest forts rising 400 feet above the city with palatial courtyards and royal exhibits.' },
    { name: 'Jaswant Thada', guidedTour: false, description: 'Peaceful white-marble royal cenotaph with carved gazebos, peaceful gardens, and panoramic city views.' },
    { name: 'Umaid Bhawan Palace & Museum', guidedTour: false, description: 'Explore the grand art-deco royal palace, museum exhibits, vintage automobiles, and royal family history.' },
    { name: 'Clock Tower & Sardar Market', guidedTour: false, description: 'Stroll around the historic Ghanta Ghar clock tower and bustling bazaar filled with spices, tea, and textiles.' },
    { name: 'Panchatiya Hills', guidedTour: false, description: 'Enjoy peaceful panoramic sunset views overlooking the Blue City from the heights of Panchatiya Hills.' },
    { name: 'Mandore Garden Light Show', guidedTour: false, description: 'Witness the captivating light and sound spectacle bringing the royal history of Mandore to life.' }
  ],
  udaipur: [
    { name: 'City Palace Udaipur', guidedTour: false, description: 'Explore Rajasthan’s largest palace complex overlooking Lake Pichola with ornate courtyards and mirror work.' },
    { name: 'Lake Pichola Scenic Boat Ride', guidedTour: false, description: 'Delightful boat cruise on Lake Pichola past historic ghats, Jag Mandir, and the floating Lake Palace.' },
    { name: 'Jag Mandir Island', guidedTour: false, description: 'Picturesque island palace on Lake Pichola with marble pavilions and scenic lakeside gardens.' },
    { name: 'Saheliyon Ki Bari', guidedTour: false, description: 'Stroll through the historic Garden of the Maidens featuring marble fountains, lotus pools, and kiosks.' },
    { name: 'Vintage Car Collection', guidedTour: false, description: 'View the private classic and vintage car collection belonging to the royal family of Mewar.' }
  ],
  jaisalmer: [
    { name: 'Jaisalmer Golden Fort', guidedTour: false, description: 'Explore the living golden sandstone fort housing ancient Jain temples, shops, and royal palaces.' },
    { name: 'Sam Sand Dunes Camel Safari', guidedTour: false, description: 'Thrilling camel safari across golden undulating dunes in the heart of the Thar Desert.' },
    { name: 'Desert Sunset & Folk Dance Night', guidedTour: false, description: 'Evening cultural program with traditional Kalbelia dance, folk singing, bonfire, and Rajasthani buffet.' },
    { name: 'Patwon Ki Haveli', guidedTour: false, description: 'Marvel at the intricate jali stone carving and antique artefacts across five historic merchant havelis.' },
    { name: 'Bada Bagh', guidedTour: false, description: 'Historic royal cenotaphs of the Maharajas of Jaisalmer set against rolling desert hills and windmills.' },
    { name: 'Thar Desert Experience', guidedTour: false, description: 'Experience the Thar Desert with sunset views, camel safaris, dunes, and traditional camping.' }
  ]
};

const MONTH_MAP: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12'
};

const parseMonthStr = (m: string): string => {
  const clean = String(m || '').toLowerCase().slice(0, 3);
  return MONTH_MAP[clean] || String(m).padStart(2, '0');
};

// Safe date parser to YYYY-MM-DD for HTML date inputs
const toDateInputValue = (val: any): string => {
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const parts = s.split(/[-/\s]/).filter(Boolean);
  if (parts.length >= 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parseMonthStr(parts[1])}-${parts[2].padStart(2, '0')}`;
    }
    if (parts[2].length === 4) {
      return `${parts[2]}-${parseMonthStr(parts[1])}-${parts[0].padStart(2, '0')}`;
    }
  }
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return '';
};

// Add days to YYYY-MM-DD string cleanly
const addDaysToDateStr = (dateStr: string, days: number): string => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate Days and Nights between two YYYY-MM-DD strings
const calcDaysBetween = (startStr: string, endStr: string): { days: number; nights: number } | null => {
  if (!startStr || !endStr || !/^\d{4}-\d{2}-\d{2}$/.test(startStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endStr)) {
    return null;
  }
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  const diffMs = new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return null;
  const nights = diffDays === 0 ? 1 : diffDays;
  const days = diffDays === 0 ? 1 : diffDays + 1;
  return { days, nights };
};

// Format YYYY-MM-DD to "20 Oct (Tue)"
const formatToReadableDate = (dateStr: string): string => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || '';
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return `${d} ${months[m - 1]} (${days[dt.getDay()]})`;
};

// Format Hotel Stay Dates range
const formatStayDateRange = (startStr: string, endStr: string, nights?: number): string => {
  if (!startStr || !endStr || !/^\d{4}-\d{2}-\d{2}$/.test(startStr) || !/^\d{4}-\d{2}-\d{2}$/.test(endStr)) {
    return '';
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);
  return `${sd} ${months[sm - 1]} - ${ed} ${months[em - 1]}${nights ? ` (${nights} Nts)` : ''}`;
};

// Draft Storage Key
const DRAFT_STORAGE_KEY = 'wanderphilia_sheet_itinerary_draft_v2';

// Fixed Hotel Categories
const HOTEL_CATEGORIES = ['Standard', 'Deluxe', 'Super Deluxe', 'Suite', 'Premium', 'Luxury'];

// Helper to extract Base Price & Extra Bed Rate directly from hotel data
// STRICT RULE: No hardcoded fallback rates. If hotel not selected or rate missing, returns 0.
export const getHotelRates = (h: any, _fallbackCategory?: string, selectedRoomCategory?: string) => {
  let baseRate = 0;
  let extraBedRate = 0;
  let childWithoutBedRate = 0;
  let roomCategory = '';

  if (h && Array.isArray(h.rooms) && h.rooms.length > 0) {
    let matchedRoom: any = null;
    if (selectedRoomCategory) {
      const target = selectedRoomCategory.trim().toLowerCase();
      matchedRoom = h.rooms.find((r: any) => String(r.roomCategory || '').trim().toLowerCase() === target);
    }
    if (!matchedRoom) {
      // Pick lowest price room where Base Price > 0
      const withPrice = h.rooms.filter((r: any) => Number(r.basePrice || r.Base_Price || r.Base_Price_INR) > 0);
      const pool = withPrice.length > 0 ? withPrice : h.rooms;
      matchedRoom = [...pool].sort((a: any, b: any) => 
        (Number(a.basePrice || a.Base_Price || a.Base_Price_INR) || 0) - (Number(b.basePrice || b.Base_Price || b.Base_Price_INR) || 0)
      )[0];
    }
    if (matchedRoom) {
      roomCategory = matchedRoom.roomCategory || '';
      // STRICT: Base Price column from subform!
      baseRate = Number(matchedRoom.basePrice || matchedRoom.Base_Price || matchedRoom.Base_Price_INR) || 0;
      extraBedRate = Number(matchedRoom.extraBedPrice || matchedRoom.Extra_Bed || matchedRoom.Extra_Bed_INR || matchedRoom.Extra_Bed_Price) || 0;
      childWithoutBedRate = Number(matchedRoom.childWithoutBed || 0);
    }
  } else if (h && Number(h.basePrice || h.Base_Price || h.Base_Price_INR) > 0) {
    baseRate = Number(h.basePrice || h.Base_Price || h.Base_Price_INR) || 0;
    extraBedRate = Number(h.extraBedPrice || h.Extra_Bed || h.Extra_Bed_INR) || 0;
    childWithoutBedRate = Number(h.childWithoutBedPrice || h.childWithoutBed) || 0;
    roomCategory = h.roomCategory || '';
  }

  return { baseRate, extraBedRate, childWithoutBedRate, roomCategory };
};

// --- REUSABLE LOOKUP FIELD COMPONENT ---
export interface LookupOptionItem {
  label?: string;
  value?: string;
  badge?: string;
  meta?: any;
  disabled?: boolean;
}

interface LookupFieldProps {
  value?: string | null;
  onChange: (val: string, meta?: any) => void;
  options: (string | LookupOptionItem)[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function LookupField({ value = '', onChange, options = [], placeholder, className, disabled }: LookupFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const safeValue = typeof value === 'string' ? value : (value !== null && value !== undefined ? String(value) : '');

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = useMemo(() => {
    if (!Array.isArray(options)) return [];
    return options.map(opt => {
      if (typeof opt === 'string' || typeof opt === 'number') {
        const str = String(opt);
        return { label: str, value: str, badge: undefined, meta: undefined, disabled: false };
      }
      if (opt && typeof opt === 'object') {
        const valStr = opt.value !== undefined && opt.value !== null ? String(opt.value) : (opt.label ? String(opt.label) : '');
        const lblStr = opt.label !== undefined && opt.label !== null ? String(opt.label) : valStr;
        return {
          ...opt,
          label: lblStr,
          value: valStr,
          disabled: Boolean(opt.disabled)
        };
      }
      return { label: '', value: '', badge: undefined, meta: undefined, disabled: false };
    });
  }, [options]);

  const filteredOptions = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    if (!q) return normalizedOptions;
    const hasOnlyDisabled = normalizedOptions.length > 0 && normalizedOptions.every(o => o.disabled);
    if (hasOnlyDisabled) return normalizedOptions;
    return normalizedOptions.filter(o =>
      (o.label || '').toLowerCase().includes(q) ||
      (o.value || '').toLowerCase().includes(q) ||
      (o.badge || '').toLowerCase().includes(q)
    );
  }, [normalizedOptions, search]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={isOpen ? search : safeValue}
          disabled={disabled}
          placeholder={placeholder || 'Select or type...'}
          onFocus={() => {
            setSearch(safeValue);
            setIsOpen(true);
          }}
          onChange={e => {
            const v = e.target.value;
            setSearch(v);
            onChange(v);
            setIsOpen(true);
          }}
          className={`pr-7 text-xs h-9 bg-white border border-slate-400 text-slate-900 placeholder:text-slate-500 rounded-md font-medium shadow-none focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 transition-colors ${className || ''}`}
        />

        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {safeValue && !disabled && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onChange('');
                setSearch('');
              }}
              className="text-slate-500 hover:text-slate-800 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!isOpen) setSearch(safeValue);
              setIsOpen(!isOpen);
            }}
            className="text-slate-500 hover:text-slate-800 p-0.5"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 left-0 w-full min-w-[320px] max-w-[460px] mt-1 max-h-60 overflow-y-auto overflow-x-hidden bg-white border border-slate-300 rounded-lg shadow-2xl py-1 text-xs divide-y divide-slate-100">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => {
              const isSelected = !opt.disabled && safeValue.toLowerCase() === (opt.value || '').toLowerCase();
              return (
                <button
                  key={i}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    if (opt.disabled) return;
                    onChange(opt.value, opt.meta);
                    setSearch(opt.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 transition-colors ${
                    opt.disabled
                      ? 'bg-slate-50 text-slate-400 italic cursor-not-allowed select-none'
                      : isSelected
                      ? 'bg-orange-50 text-orange-700 font-bold'
                      : 'text-slate-800 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="truncate font-semibold flex-1 min-w-0">{opt.label}</span>
                  {opt.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 whitespace-nowrap font-medium ${
                      opt.disabled
                        ? 'bg-slate-100 border-slate-200 text-slate-400 font-normal'
                        : isSelected
                        ? 'bg-orange-100 border-orange-300 text-orange-900 font-bold'
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-slate-500 text-[11px] italic">
              No matching lookup item. Keep &quot;{search}&quot; as custom.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- INTERFACES ---
export interface ChildDetail {
  childNumber: number;
  age: string;
  bedPreference: 'With Bed' | 'Without Bed' | 'Crib';
}

// --- ACTIVITY HOVER DETAILS TOOLTIP COMPONENT ---
function ActivityHoverTooltip({
  item,
  adults = 2,
  kidsDetails = [],
  children
}: {
  item: any;
  adults?: number;
  kidsDetails?: ChildDetail[];
  children: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!item) return <>{children}</>;

  const sicAdult = Number(item.sicAdult ?? item.Cost_Per_Person ?? item.ppCost) || 0;
  const sicChild = Number(item.sicChild ?? item.Cost_per_child) || 0;
  const privateCost = Number(item.privateCost ?? item.Private_Cost) || 0;

  const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
  const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
  const privateShare = privateCost > 0 ? Math.round(privateCost / eligiblePax) : 0;

  const desc = item.description || item.templateDescription || item.Inclusions_Description || '';
  const category = item.category || item.Sighseeing_and_Experiences_Category || '';
  const timing = item.timing || item.Duration_Timing || item.Timing || '';
  const distance = item.distance || item.Distance_From_Main_City || '';
  const city = item.city || item.City_Destination || '';

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShow(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShow(false), 150);
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {show && (
        <div className="absolute z-[100] bottom-full left-0 mb-2 w-80 bg-white/98 backdrop-blur-md rounded-xl shadow-2xl border border-orange-200 p-3 text-xs pointer-events-none transform -translate-y-1 transition-all duration-200 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                {item.name || item.Name || 'Activity Details'}
              </h4>
              {city && (
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 text-orange-500 shrink-0" />
                  <span>{city}</span>
                </div>
              )}
            </div>
            {category && (
              <span className="shrink-0 px-2 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-[10px] font-bold">
                {category}
              </span>
            )}
          </div>

          {/* Pricing Box */}
          <div className="my-2 p-2 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80">
            {privateCost > 0 && sicAdult === 0 && sicChild === 0 ? (
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-purple-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-purple-600 inline-block" />
                    Private Activity Cost:
                  </span>
                  <span className="font-mono font-black text-purple-950 text-sm">
                    ₹{privateCost.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="mt-1 pt-1 border-t border-purple-200/60 text-[11px] text-purple-900 leading-tight">
                  Divided equally among <strong>{eligiblePax} pax</strong> (Adults + Kids &gt;3 yrs):
                  <div className="font-bold text-orange-800 font-mono mt-0.5 text-xs">
                    ₹{privateShare.toLocaleString('en-IN')} / person
                  </div>
                </div>
              </div>
            ) : (sicAdult > 0 || sicChild > 0) ? (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                    SIC Sharing Pricing:
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold">
                  <span className="px-1.5 py-0.5 bg-white rounded border border-emerald-300 text-emerald-800">
                    Adult: ₹{sicAdult.toLocaleString('en-IN')}
                  </span>
                  {sicChild > 0 && (
                    <span className="px-1.5 py-0.5 bg-white rounded border border-emerald-300 text-emerald-800">
                      Child: ₹{sicChild.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Included / Standard Sightseeing (₹0 extra)
              </div>
            )}
          </div>

          {/* Quick info row */}
          {(timing || distance) && (
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 py-1 border-b border-slate-100">
              {timing && (
                <div className="flex items-center gap-1 truncate">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{timing}</span>
                </div>
              )}
              {distance && (
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{distance}</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {desc ? (
            <p className="mt-2 text-[11px] text-slate-600 leading-relaxed italic line-clamp-3">
              &quot;{desc}&quot;
            </p>
          ) : (
            <p className="mt-1 text-[10px] text-slate-400 italic">No description provided in Zoho CRM.</p>
          )}

          {/* Bottom Tooltip Arrow */}
          <div className="absolute top-full left-6 -mt-1 border-4 border-transparent border-t-white" />
        </div>
      )}
    </div>
  );
}

// Small inline badge displayed under an experience input in the itinerary table
function ActivityCostBadge({
  item,
  adults,
  kidsDetails,
  fallbackCost,
  fallbackPrivateCost
}: {
  item: any;
  adults: number;
  kidsDetails: ChildDetail[];
  fallbackCost?: number;
  fallbackPrivateCost?: number;
}) {
  if (!item && !fallbackCost && !fallbackPrivateCost) return null;
  const sicA = Number(item?.sicAdult ?? item?.Cost_Per_Person) || 0;
  const priv = Number(item?.privateCost ?? item?.Private_Cost) || Number(fallbackPrivateCost) || 0;
  const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
  const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
  const cost = sicA > 0 ? sicA : (priv > 0 ? Math.round(priv / eligiblePax) : (fallbackCost || 0));

  if (cost <= 0 && priv <= 0) return null;

  return (
    <div className="mt-1 flex items-center justify-between text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-900 leading-tight shadow-2xs">
      <span className="font-bold truncate text-[9px] text-emerald-800">
        {sicA > 0 ? 'SIC' : (priv > 0 ? `Private (₹${priv.toLocaleString('en-IN')})` : 'Activity')}
      </span>
      <span className="font-mono font-extrabold text-emerald-950 ml-1 shrink-0">
        +₹{cost.toLocaleString('en-IN')}/pax
      </span>
    </div>
  );
}

// Calculate recommended room count strictly based on Zoho Deluge automation (Max 3 per room capacity)
export function calculateRecommendedRooms(
  adultsCount: number,
  kidsCount: number,
  sharingTypeVal: string,
  kidsDetailsList: ChildDetail[] = []
): number {
  const k = Math.max(0, Number(kidsCount) || 0);
  const extraBedKids = kidsDetailsList.slice(0, k).filter(c => isExtraBed(c.bedPreference)).length;
  const res = calculateRoomsAndBeds({
    adults: adultsCount,
    sharingType: sharingTypeVal,
    totalKidsCount: k,
    initialExtraBedCount: extraBedKids
  });
  return res.totalRooms;
}

interface HotelItem {
  index: number;
  hotelName: string;
  city: string;
  nights: number;
  roomCategory: string;
  category: string;
  stayDates?: string;
  basePrice?: number;
  extraBedPrice?: number;
  childWithoutBedPrice?: number;
}

// Table Grid Row Interface matching user's requested columns
interface TableDayRow {
  dayNumber: number;
  dayText: string;
  guidedTour: boolean;
  city: string;
  enRouteExperiences: string[];
  city2: string;
  experiences: string[]; // Experience 1, 2, 3, 4 ...
  descriptions: string[]; // Description 1, 2, 3, 4 ...
  experienceCosts: number[]; // Per person costs
  experiencePrivateCosts?: number[]; // Flat private costs if applicable
  optionalExperiences: string[]; // Optional Experience 1, 2
  optionalDescriptions: string[]; // Optional Description 1, 2
  optionalExperienceCosts: number[]; // Optional costs
  optionalExperiencePrivateCosts?: number[]; // Optional private costs
}

// --- DYNAMIC INCLUSIONS & EXCLUSIONS BUILDERS ---
export const POPULAR_INCLUSIONS_PRESETS = [
  'Private AC Vehicle for all transfers & sightseeing',
  'Accommodation in verified Deluxe / Luxury hotels',
  'Daily Buffet Breakfast at all hotels',
  'Daily Buffet Breakfast & Dinner (MAP Plan)',
  'Airport / Railway Station Pickup & Drop-off Transfers',
  'Driver allowance, fuel, toll taxes, parking & state permits',
  'All transfers & sightseeing as per day-wise itinerary',
  'English Speaking Local Tour Guide for sightseeing tours',
  'All Monument & Heritage Sightseeing Entry Tickets',
  'Complimentary Shikara Ride / Camel Safari experience',
  '24/7 Dedicated On-Trip Ground Support & Concierge',
  'Applicable hotel taxes included in quoted package'
];

export const POPULAR_EXCLUSIONS_PRESETS = [
  '5% GST (unless specifically included in quote breakdown)',
  'Airfare / Train fare (Domestic & International)',
  'Monument & Activity Entry Tickets during sightseeing',
  'Personal expenses (laundry, room service, telephone, tips)',
  'Early check-in (before 2:00 PM) & Late check-out (after 11:00 AM)',
  'Any lunch, snacks, or drinks not specified in inclusions',
  'Travel & Medical Emergency Insurance',
  'Adventure activities, rides & camera fees',
  'Unforeseen expenses due to flight delays, weather or roadblocks'
];

export function buildDynamicDefaultInclusions(params: {
  destination?: string;
  vehicleType?: string;
  mealPlan?: string;
  noOfNights?: number;
  roomCategory?: string;
  masterHotelCategory?: string;
  dayRows?: TableDayRow[];
}): string[] {
  const dest = (params.destination || 'Rajasthan').trim() || 'Rajasthan';
  const rawVeh = (params.vehicleType || 'AC Vehicle').trim();
  const cleanVehicle = rawVeh.toLowerCase().startsWith('private') ? rawVeh : `Private ${rawVeh}`;
  const nights = Number(params.noOfNights) > 0 ? Number(params.noOfNights) : 4;
  const room = (params.roomCategory || params.masterHotelCategory || 'Deluxe').trim();
  const meal = (params.mealPlan || 'Breakfast & Dinner').trim();

  // Extract distinct sightseeing / experiences from dayRows
  const uniqueExperiences: string[] = [];
  const seen = new Set<string>();

  if (Array.isArray(params.dayRows)) {
    params.dayRows.forEach(row => {
      const isGuided = Boolean(row.guidedTour);

      if (Array.isArray(row.enRouteExperiences)) {
        row.enRouteExperiences.forEach((er: string) => {
          const clean = (er || '').trim();
          if (clean && !seen.has(clean.toLowerCase())) {
            seen.add(clean.toLowerCase());
            const hasGuidedTag = /\(\s*guided\s*tour\s*\)/i.test(clean);
            const prefix = clean.toLowerCase().startsWith('en-route') ? clean : `En-route: ${clean}`;
            uniqueExperiences.push(isGuided && !hasGuidedTag ? `${prefix} (Guided Tour)` : prefix);
          }
        });
      }

      if (Array.isArray(row.experiences)) {
        row.experiences.forEach((exp: string) => {
          const clean = (exp || '').trim();
          if (clean && !seen.has(clean.toLowerCase())) {
            seen.add(clean.toLowerCase());
            const hasGuidedTag = /\(\s*guided\s*tour\s*\)/i.test(clean);
            uniqueExperiences.push(isGuided && !hasGuidedTag ? `${clean} (Guided Tour)` : clean);
          }
        });
      }
    });
  }

  const hasLunch = /lunch|all\s*meals|apai/i.test(meal);
  const mealDesc = hasLunch
    ? `Meals ${meal} (Breakfast, Lunch & Dinner as per itinerary schedule).`
    : `Meals ${meal} (Breakfast except 1st Day, Dinner on last day).`;

  return [
    `${cleanVehicle} for the complete ${dest} itinerary and Airport / Station Transfers.`,
    `Accommodation in verified ${room} Properties For ${nights} Nights.`,
    mealDesc,
    `Driver allowance, fuel charges, state permits, toll taxes and parking charges.`,
    `All transfers and sightseeing tours as per the day-wise itinerary schedule.`,
    ...uniqueExperiences,
    `Assistance during hotel check-in and check-out.`,
    `Applicable hotel taxes included in the quoted package.`
  ];
}

export function buildDynamicDefaultExclusions(mealPlanStr?: string): string[] {
  const hasLunch = /lunch|all\s*meals|apai/i.test(mealPlanStr || '');
  return [
    `5% GST (unless explicitly included in pricing breakdown).`,
    `Early check-in (before 2:00 PM) & late check-out (after 11:00 AM) at hotels.`,
    `Airfare or Train fare other than specifically mentioned in inclusions.`,
    `Monument entry tickets, camera fees, or audio guides during sightseeing.`,
    `Personal expenses (room service, laundry, telephone calls, tips & alcoholic drinks).`,
    hasLunch
      ? `Any additional meals, snacks, or alcoholic drinks not mentioned in the Package Inclusions.`
      : `Any lunch or additional meals not mentioned in the Package Inclusions.`,
    `Unforeseen costs due to flight delays, weather conditions, landslides or roadblocks.`
  ];
}

export default function SheetItineraryPage() {
  const [selectedOption, setSelectedOption] = useState<number>(1);

  // Traveler Details (Independent of sheet)
  const [inquiryId, setInquiryId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [departureCity, setDepartureCity] = useState('');
  const [destination, setDestination] = useState('Rajasthan');
  const [destinationType, setDestinationType] = useState('India');

  // Dates & Pax
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noOfDays, setNoOfDays] = useState(5);
  const [noOfNights, setNoOfNights] = useState(4);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [kidsDetails, setKidsDetails] = useState<ChildDetail[]>([]);
  const [isKidsModalOpen, setIsKidsModalOpen] = useState(false);
  const [roomsCount, setRoomsCount] = useState<number>(1);
  const [isRoomsManuallySet, setIsRoomsManuallySet] = useState(false);
  const [sharingType, setSharingType] = useState('Double Sharing');
  const [travelStyle, setTravelStyle] = useState('Family Trip');

  // Optional Zoho Sync (Inquiry / Lead)
  const [zohoInquiryInput, setZohoInquiryInput] = useState('');
  const [zohoLeadId, setZohoLeadId] = useState<string>('');
  const [fetchingZoho, setFetchingZoho] = useState(false);
  const [zohoSyncMsg, setZohoSyncMsg] = useState<string | null>(null);

  // Existing Generated Options for this Inquiry / Lead
  const [existingOptions, setExistingOptions] = useState<Record<number, {
    id: string;
    slug: string;
    url: string;
    optionNumber: number;
    title: string;
    destination: string;
    quote: number | null;
    advancePaid: number | null;
    balanceDue: number | null;
    createdAt: string;
    updatedAt: string;
  }>>({});
  const [unlockedOptions, setUnlockedOptions] = useState<Record<number, boolean>>({});
  const [optionLockAlert, setOptionLockAlert] = useState<string | null>(null);
  const [checkingOptions, setCheckingOptions] = useState(false);

  // Zoho Fixed Itineraries Template Module
  const [zohoFixedItineraries, setZohoFixedItineraries] = useState<any[]>([]);
  const [selectedFixedItineraryId, setSelectedFixedItineraryId] = useState('');
  const [loadingZohoFixed, setLoadingZohoFixed] = useState(false);
  const [isRefreshingFixedItineraries, setIsRefreshingFixedItineraries] = useState(false);
  const [zohoFixedMsg, setZohoFixedMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Master Data Source: 'zoho' (default) or 'sheet'
  const [dataSource, setDataSource] = useState<'zoho' | 'sheet'>('zoho');
  const [loadingZohoMaster, setLoadingZohoMaster] = useState(false);
  const [zohoMasterError, setZohoMasterError] = useState<string | null>(null);
  const [zohoMasterStats, setZohoMasterStats] = useState<{ activitiesCount: number; hotelsCount: number; vehiclesCount: number } | null>(null);
  const [zohoVehicles, setZohoVehicles] = useState<any[]>([]);

  // LocalStorage Draft Persistence State
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Google Sheet Connection State (Fallback option)
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1e5wSIGjKwpyujB12YjoFlu3SXc6XLnI7tOLj5zD97XY/edit?usp=sharing');
  const [connectingSheet, setConnectingSheet] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetSuccessMsg, setSheetSuccessMsg] = useState<string | null>(null);

  // Dynamic Lookup Catalogs (Fed directly from Zoho CRM or Sheet)
  const [sheetDestinations, setSheetDestinations] = useState<string[]>([]);
  const [sheetCitiesByDest, setSheetCitiesByDest] = useState<Record<string, string[]>>({});
  const [sheetExpByCity, setSheetExpByCity] = useState<Record<string, any[]>>({});
  const [sheetHotelsByCity, setSheetHotelsByCity] = useState<Record<string, any[]>>({});

  // Packages found in Sheet
  const [sheetPackages, setSheetPackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Itinerary Data
  const [vehicleType, setVehicleType] = useState('AC Innova Crysta');
  const [mealPlan, setMealPlan] = useState('Breakfast & Dinner');

  // Master Hotel Category (Package Category: Deluxe, Super Deluxe, Premium, Luxury, All)
  const [masterHotelCategory, setMasterHotelCategory] = useState<string>('Deluxe');

  // Hotels (Up to 6)
  const [hotels, setHotels] = useState<HotelItem[]>([
    { index: 1, hotelName: '', city: 'Jaipur', nights: 2, roomCategory: '', category: 'Deluxe', stayDates: '', basePrice: 0, extraBedPrice: 0, childWithoutBedPrice: 0 },
    { index: 2, hotelName: '', city: 'Jodhpur', nights: 2, roomCategory: '', category: 'Deluxe', stayDates: '', basePrice: 0, extraBedPrice: 0, childWithoutBedPrice: 0 }
  ]);
  const [isHotelsManuallyCustomized, setIsHotelsManuallyCustomized] = useState<boolean>(false);

  // Helper to create an initial Table Row
  const createInitialDayRow = (dayNum: number, city?: string): TableDayRow => ({
    dayNumber: dayNum,
    dayText: `Day ${dayNum}`,
    guidedTour: false,
    city: city || 'Jaipur',
    enRouteExperiences: [''],
    city2: '',
    experiences: ['', '', '', ''],
    descriptions: ['', '', '', ''],
    experienceCosts: [0, 0, 0, 0],
    experiencePrivateCosts: [0, 0, 0, 0],
    optionalExperiences: ['', ''],
    optionalDescriptions: ['', ''],
    optionalExperienceCosts: [0, 0],
    optionalExperiencePrivateCosts: [0, 0]
  });

  // Table Day Rows State (Spreadsheet Column Grid)
  const [dayRows, setDayRows] = useState<TableDayRow[]>([
    createInitialDayRow(1, 'Jaipur'),
    createInitialDayRow(2, 'Jaipur'),
    createInitialDayRow(3, 'Jodhpur'),
    createInitialDayRow(4, 'Jaisalmer'),
    createInitialDayRow(5, 'Udaipur')
  ]);

  // Pricing & Margins
  const [baseQuotation, setBaseQuotation] = useState<string>('');
  const [marginPercent, setMarginPercent] = useState<string>('');
  const [finalQuotation, setFinalQuotation] = useState<string>('');
  const [perAdultPrice, setPerAdultPrice] = useState<string>('');
  const [perKidPrice, setPerKidPrice] = useState<string>('');
  const [advanceAmount, setAdvanceAmount] = useState<string>('');
  const [balanceAmount, setBalanceAmount] = useState<string>('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isQuoteManuallyEdited, setIsQuoteManuallyEdited] = useState<boolean>(false);

  // Inclusions & Exclusions State
  const [inclusions, setInclusions] = useState<string[]>(() =>
    buildDynamicDefaultInclusions({
      destination: 'Rajasthan',
      vehicleType: 'AC Innova Crysta',
      mealPlan: 'Breakfast & Dinner',
      noOfNights: 4,
      masterHotelCategory: 'Deluxe'
    })
  );
  const [exclusions, setExclusions] = useState<string[]>(() => buildDynamicDefaultExclusions());
  const [isCustomInclusionsEdited, setIsCustomInclusionsEdited] = useState<boolean>(false);
  const [newInclusionText, setNewInclusionText] = useState<string>('');
  const [newExclusionText, setNewExclusionText] = useState<string>('');

  // Auto-sync inclusions with current trip parameters if user hasn't manually customized them
  useEffect(() => {
    if (isCustomInclusionsEdited) return;
    const primaryRoom = hotels[0]?.roomCategory || masterHotelCategory || 'Deluxe';
    const dynamicDefaults = buildDynamicDefaultInclusions({
      destination,
      vehicleType,
      mealPlan,
      noOfNights,
      roomCategory: primaryRoom,
      masterHotelCategory,
      dayRows
    });
    setInclusions(dynamicDefaults);
  }, [destination, vehicleType, mealPlan, noOfNights, hotels, masterHotelCategory, dayRows, isCustomInclusionsEdited]);

  // Inclusions & Exclusions Action Handlers
  const handleAddInclusion = (textToAdd?: string) => {
    const text = (textToAdd !== undefined ? textToAdd : newInclusionText).trim();
    if (!text) return;
    setInclusions(prev => (prev.includes(text) ? prev : [...prev, text]));
    if (textToAdd === undefined) setNewInclusionText('');
    setIsCustomInclusionsEdited(true);
  };

  const handleUpdateInclusion = (index: number, newText: string) => {
    setInclusions(prev => {
      const copy = [...prev];
      copy[index] = newText;
      return copy;
    });
    setIsCustomInclusionsEdited(true);
  };

  const handleRemoveInclusion = (index: number) => {
    setInclusions(prev => prev.filter((_, i) => i !== index));
    setIsCustomInclusionsEdited(true);
  };

  const handleMoveInclusion = (index: number, direction: 'up' | 'down') => {
    setInclusions(prev => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {
        return prev;
      }
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setIsCustomInclusionsEdited(true);
  };

  const handleAddExclusion = (textToAdd?: string) => {
    const text = (textToAdd !== undefined ? textToAdd : newExclusionText).trim();
    if (!text) return;
    setExclusions(prev => (prev.includes(text) ? prev : [...prev, text]));
    if (textToAdd === undefined) setNewExclusionText('');
    setIsCustomInclusionsEdited(true);
  };

  const handleUpdateExclusion = (index: number, newText: string) => {
    setExclusions(prev => {
      const copy = [...prev];
      copy[index] = newText;
      return copy;
    });
    setIsCustomInclusionsEdited(true);
  };

  const handleRemoveExclusion = (index: number) => {
    setExclusions(prev => prev.filter((_, i) => i !== index));
    setIsCustomInclusionsEdited(true);
  };

  const handleMoveExclusion = (index: number, direction: 'up' | 'down') => {
    setExclusions(prev => {
      if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1)) {
        return prev;
      }
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setIsCustomInclusionsEdited(true);
  };

  const handleRegenerateDefaults = () => {
    const primaryRoom = hotels[0]?.roomCategory || masterHotelCategory || 'Deluxe';
    const dynInc = buildDynamicDefaultInclusions({
      destination,
      vehicleType,
      mealPlan,
      noOfNights,
      roomCategory: primaryRoom,
      masterHotelCategory,
      dayRows
    });
    const dynExc = buildDynamicDefaultExclusions();
    setInclusions(dynInc);
    setExclusions(dynExc);
    setIsCustomInclusionsEdited(false);
  };

  const handleClearAllInclusions = () => {
    setInclusions([]);
    setIsCustomInclusionsEdited(true);
  };

  const handleClearAllExclusions = () => {
    setExclusions([]);
    setIsCustomInclusionsEdited(true);
  };

  const handleMealPlanChange = (newMeal: string) => {
    setMealPlan(newMeal);
    const hasLunch = /lunch|all\s*meals|apai/i.test(newMeal);
    const newMealLine = hasLunch
      ? `Meals ${newMeal} (Breakfast, Lunch & Dinner as per itinerary schedule).`
      : `Meals ${newMeal} (Breakfast except 1st Day, Dinner on last day).`;

    setInclusions(prev => {
      const idx = prev.findIndex(item => /^meals\b/i.test(item.trim()) || /breakfast/i.test(item));
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = newMealLine;
        return copy;
      }
      return [...prev, newMealLine];
    });

    setExclusions(prev => {
      return prev.map(exc => {
        if (/lunch/i.test(exc)) {
          return hasLunch
            ? `Any additional meals, snacks, or alcoholic drinks not mentioned in the Package Inclusions.`
            : `Any lunch or additional meals not mentioned in the Package Inclusions.`;
        }
        return exc;
      });
    });
  };

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [genSuccess, setGenSuccess] = useState<any>(null);
  const [genError, setGenError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Helper to look up an experience across all loaded catalogs
  // Priority: 1. Exact match in preferred cities -> 2. Exact match across all cities -> 3. Substring match
  const findExperienceInCatalogs = useCallback((expName: string, preferredCity?: string, preferredCity2?: string) => {
    if (!expName || !expName.trim()) return null;
    const clean = expName.trim().toLowerCase();

    const checkExact = (c: any) => (c?.name || '').trim().toLowerCase() === clean;
    const checkSub = (c: any) => {
      const n = (c?.name || '').trim().toLowerCase();
      return n && (n.includes(clean) || clean.includes(n));
    };

    const getCityList = (cName?: string) => {
      if (!cName) return [];
      const key = cName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return sheetExpByCity[key] || [];
    };

    // 1. Exact match in preferred cities
    if (preferredCity) {
      const match = getCityList(preferredCity).find(checkExact);
      if (match) return match;
    }
    if (preferredCity2) {
      const match = getCityList(preferredCity2).find(checkExact);
      if (match) return match;
    }

    // 2. Exact match across all cities in sheetExpByCity
    for (const list of Object.values(sheetExpByCity)) {
      const match = (list || []).find(checkExact);
      if (match) return match;
    }

    // 3. Exact match in default experiences
    for (const list of Object.values(DEFAULT_EXPERIENCES_BY_CITY)) {
      const match = (list || []).find(checkExact);
      if (match) return match;
    }

    // 4. Fallback: Substring match in preferred cities (preferring priced items)
    const prefCandidates: any[] = [];
    if (preferredCity) prefCandidates.push(...getCityList(preferredCity).filter(checkSub));
    if (preferredCity2) prefCandidates.push(...getCityList(preferredCity2).filter(checkSub));
    if (prefCandidates.length > 0) {
      const withPrice = prefCandidates.find(c => (Number(c.privateCost ?? c.Private_Cost) || 0) > 0 || (Number(c.sicAdult ?? c.Cost_Per_Person) || 0) > 0);
      return withPrice || prefCandidates[0];
    }

    // 5. Fallback: Substring match anywhere in sheetExpByCity (preferring priced items)
    for (const list of Object.values(sheetExpByCity)) {
      const subs = (list || []).filter(checkSub);
      if (subs.length > 0) {
        const withPrice = subs.find(c => (Number(c.privateCost ?? c.Private_Cost) || 0) > 0 || (Number(c.sicAdult ?? c.Cost_Per_Person) || 0) > 0);
        return withPrice || subs[0];
      }
    }

    // 6. Fallback: Substring in default experiences
    for (const list of Object.values(DEFAULT_EXPERIENCES_BY_CITY)) {
      const match = (list || []).find(checkSub);
      if (match) return match;
    }

    return null;
  }, [sheetExpByCity]);

  // --- ACTIVITY PER PERSON COST CALCULATION (SIC vs Private divided by adults + kids > 3 yrs) ---
  const totalPerPersonActivityCost = useMemo(() => {
    let sum = 0;
    const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
    const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);

    dayRows.forEach(row => {
      // 1. Regular experiences
      (row.experiences || []).forEach((expName, idx) => {
        if (!expName || !expName.trim()) return;
        const catalogItem = findExperienceInCatalogs(expName, row.city, row.city2);
        const sicA = Number(catalogItem?.sicAdult ?? catalogItem?.Cost_Per_Person) || 0;
        const priv = Number(catalogItem?.privateCost ?? catalogItem?.Private_Cost) || Number(row.experiencePrivateCosts?.[idx]) || 0;
        if (sicA > 0) {
          sum += sicA;
        } else if (priv > 0) {
          sum += Math.round(priv / eligiblePax);
        } else {
          sum += Number(row.experienceCosts?.[idx]) || 0;
        }
      });

      // 2. En-route experiences
      (row.enRouteExperiences || []).forEach((spotName) => {
        if (!spotName || !spotName.trim()) return;
        const catalogItem = findExperienceInCatalogs(spotName, row.city, row.city2);
        const sicA = Number(catalogItem?.sicAdult ?? catalogItem?.Cost_Per_Person) || 0;
        const priv = Number(catalogItem?.privateCost ?? catalogItem?.Private_Cost) || 0;
        if (sicA > 0) {
          sum += sicA;
        } else if (priv > 0) {
          sum += Math.round(priv / eligiblePax);
        }
      });
    });
    return sum;
  }, [dayRows, adults, kidsDetails, sheetExpByCity, findExperienceInCatalogs]);

  // --- LIVE COMPREHENSIVE COST & QUOTATION ENGINE (EXACT ZOHO DELUGE FORMULA) ---
  const quotationCalculations = useMemo(() => {
    const adultPax = Math.max(1, Number(adults) || 1);
    const kidPax = Math.max(0, Number(kids) || 0);
    const totalDays = Math.max(1, Number(noOfDays) || dayRows.length || 1);

    // 1. Vehicle / Transport Setup
    const vStr = typeof vehicleType === 'string'
      ? vehicleType
      : (typeof vehicleType === 'object' && vehicleType !== null
        ? (vehicleType as any).name || (vehicleType as any).label || (vehicleType as any).value || ''
        : String(vehicleType || ''));
    const vLower = vStr.toLowerCase().trim();

    let vehicleDailyRate = 4500; // Default Innova Crysta
    if (zohoVehicles && zohoVehicles.length > 0) {
      const vFound = zohoVehicles.find(v => (v.name || '').toLowerCase().trim() === vLower);
      if (vFound && vFound.cost) {
        vehicleDailyRate = Number(vFound.cost) || vehicleDailyRate;
      }
    } else {
      if (vLower.includes('sedan') || vLower.includes('dzire')) vehicleDailyRate = 2800;
      else if (vLower.includes('ertiga')) vehicleDailyRate = 3500;
      else if (vLower.includes('innova')) vehicleDailyRate = 4500;
      else if (vLower.includes('12 seater') || vLower.includes('tempo 12')) vehicleDailyRate = 6500;
      else if (vLower.includes('17 seater') || vLower.includes('tempo 17')) vehicleDailyRate = 7500;
      else if (vLower.includes('urbania')) vehicleDailyRate = 9500;
      else if (vLower.includes('fortuner')) vehicleDailyRate = 9000;
    }

    // 2. Hotel Accommodations Setup
    const mappedHotels = hotels.map(h => {
      const isSelected = Boolean(h.hotelName && h.hotelName.trim() && h.hotelName.toLowerCase() !== 'hotel');
      if (!isSelected) {
        return {
          hotelName: '',
          city: h.city,
          nights: Number(h.nights) || 1,
          category: h.category || masterHotelCategory || '',
          roomCategory: '',
          roomRate: 0,
          extraBedRate: 0,
          childNoBedRate: 0
        };
      }

      const cat = h.category || masterHotelCategory || '';
      const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const sheetHotels = sheetHotelsByCity[cClean] || [];
      const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === (h.hotelName || '').toLowerCase().trim());

      const rates = getHotelRates(foundHotel, cat, h.roomCategory);
      let roomRate = h.basePrice !== undefined ? h.basePrice : rates.baseRate;
      let extraBedRate = h.extraBedPrice !== undefined ? h.extraBedPrice : rates.extraBedRate;
      let childNoBedRate = h.childWithoutBedPrice !== undefined ? h.childWithoutBedPrice : rates.childWithoutBedRate;

      if (foundHotel && Array.isArray(foundHotel.rooms) && foundHotel.rooms.length > 0) {
        const foundRoom = foundHotel.rooms.find((r: any) => (r.roomCategory || '').toLowerCase().trim() === (h.roomCategory || '').toLowerCase().trim());
        if (foundRoom) {
          // STRICTLY from Base Price column
          roomRate = Number(foundRoom.basePrice || foundRoom.Base_Price || foundRoom.Base_Price_INR) || 0;
          extraBedRate = Number(foundRoom.extraBedPrice || foundRoom.Extra_Bed || foundRoom.Extra_Bed_INR) || 0;
          childNoBedRate = Number(foundRoom.childWithoutBed) || 0;
        }
      }

      return {
        hotelName: h.hotelName,
        city: h.city,
        nights: Number(h.nights) || 1,
        category: cat,
        roomCategory: h.roomCategory,
        roomRate: roomRate || 0,
        extraBedRate: extraBedRate || 0,
        childNoBedRate: childNoBedRate || 0
      };
    });

    // 3. Day Rows & Activities Setup (SIC vs Private, Guided Tour ₹2000)
    const mappedDayRows = dayRows.map(row => {
      const activities: Array<{ name?: string; costPerPerson?: number; costPerChild?: number; privateCost?: number }> = [];

      // Regular Experiences
      (row.experiences || []).forEach((expName, eIdx) => {
        if (!expName || !expName.trim()) return;
        const catalogItem = findExperienceInCatalogs(expName, row.city, row.city2);
        const sicAdult = Number(catalogItem?.sicAdult ?? catalogItem?.Cost_Per_Person) || 0;
        const sicChild = Number(catalogItem?.sicChild ?? catalogItem?.Cost_per_child) || 0;
        const privateCost = Number(catalogItem?.privateCost ?? catalogItem?.Private_Cost) || Number(row.experiencePrivateCosts?.[eIdx]) || 0;
        const manualCost = Number(row.experienceCosts?.[eIdx]) || 0;

        activities.push({
          name: expName.trim(),
          costPerPerson: sicAdult > 0 ? sicAdult : (privateCost === 0 && manualCost > 0 ? manualCost : 0),
          costPerChild: sicChild,
          privateCost: privateCost
        });
      });

      // En-route Experiences
      (row.enRouteExperiences || []).forEach((spotName) => {
        if (!spotName || !spotName.trim()) return;
        const catalogItem = findExperienceInCatalogs(spotName, row.city, row.city2);
        const sicAdult = Number(catalogItem?.sicAdult ?? catalogItem?.Cost_Per_Person) || 0;
        const sicChild = Number(catalogItem?.sicChild ?? catalogItem?.Cost_per_child) || 0;
        const privateCost = Number(catalogItem?.privateCost ?? catalogItem?.Private_Cost) || 0;

        activities.push({
          name: spotName.trim(),
          costPerPerson: sicAdult,
          costPerChild: sicChild,
          privateCost: privateCost
        });
      });

      return {
        dayNumber: row.dayNumber,
        guidedTour: !!row.guidedTour,
        activities
      };
    });

    // 4. Run exact Deluge Offline Pricing Automation Engine
    const delugePricing = calculateLeadPricingOffline({
      adults: adultPax,
      kids: kidPax,
      noOfDays: totalDays,
      sharingType,
      globalTargetCat: masterHotelCategory,
      kidsDetails: kidsDetails.map(k => ({ age: Number(k.age) || 6, bedPreference: k.bedPreference })),
      hotels: mappedHotels,
      vehicle: {
        name: vStr,
        dailyCost: vehicleDailyRate
      },
      dayRows: mappedDayRows
    });

    // 5. Margin & Taxes
    const calculatedBase = delugePricing.finalQuotation;
    const marginPct = marginPercent !== '' && !isNaN(Number(marginPercent)) ? Number(marginPercent) : 0;
    const marginAmount = marginPct > 0 ? Math.round(calculatedBase * (marginPct / 100)) : 0;
    const subtotalWithMargin = calculatedBase + marginAmount;
    const gstAmount = marginPct > 0 ? Math.round(subtotalWithMargin * 0.05) : 0; // 5% GST
    const calculatedFinalQuote = Math.round(subtotalWithMargin + gstAmount);

    // Scale Per Adult and Per Child proportionally if margin or taxes exist
    const quoteRatio = calculatedBase > 0 ? calculatedFinalQuote / calculatedBase : 1;
    const calculatedPerAdult = Math.round(delugePricing.perAdultCost * quoteRatio);
    const calculatedPerKid = kidPax > 0 ? Math.round(delugePricing.perChildCost * quoteRatio) : 0;

    return {
      adultPax,
      kidPax,
      rooms: delugePricing.roomsCount,
      baseRooms: delugePricing.baseRooms,
      extraRoomsAdded: delugePricing.extraRoomsAdded,
      extraBedCount: delugePricing.extraBedCount,
      billableExtraBeds: delugePricing.billableExtraBeds,
      childWithoutBedCount: delugePricing.childWithoutBedCount,
      transportKidsCount: delugePricing.transportKidsCount,
      kidsAbove5Count: delugePricing.kidsAbove5Count,
      totalTransportPax: delugePricing.totalTransportPax,
      totalDays,
      totalActivitiesCost: delugePricing.totalActivitiesCost,
      totalAdultActivitiesCost: delugePricing.totalAdultActivitiesCost,
      totalChildActivitiesCost: delugePricing.totalChildActivitiesCost,
      totalGuideCost: delugePricing.totalGuideCost,
      perHeadGuideShare: delugePricing.perHeadGuideShare,
      totalVehicleCost: delugePricing.totalVehicleCost,
      perHeadTransportCost: delugePricing.perHeadTransportCost,
      totalHotelsCost: delugePricing.totalHotelsCost,
      currentHotelExtraBedCostTotal: delugePricing.currentHotelExtraBedCostTotal,
      currentHotelChildNoBedCostTotal: delugePricing.currentHotelChildNoBedCostTotal,
      childHotelShare: delugePricing.childHotelShare,
      calculatedBase,
      marginPct,
      marginAmount,
      gstAmount,
      calculatedFinalQuote,
      calculatedPerAdult,
      calculatedPerKid,
      delugePerAdultCost: delugePricing.perAdultCost,
      delugePerChildCost: delugePricing.perChildCost,
      vehicleDailyRate,
      hotelBreakdowns: delugePricing.hotelBreakdowns || [],
      delugePricing
    };
  }, [
    adults,
    kids,
    kidsDetails,
    roomsCount,
    noOfDays,
    dayRows,
    hotels,
    vehicleType,
    masterHotelCategory,
    sharingType,
    marginPercent,
    sheetHotelsByCity,
    sheetExpByCity,
    zohoVehicles,
    totalPerPersonActivityCost,
  ]);

  // Total Activity Cost for the whole booking (Auto-calculated from all day activities & en-route spots)
  const totalActivityCost = useMemo(() => {
    return Number(quotationCalculations.totalActivitiesCost || 0);
  }, [quotationCalculations.totalActivitiesCost]);

  // Auto-calculate rooms as per adults and kids whenever they change
  useEffect(() => {
    if (!isRoomsManuallySet) {
      const rec = calculateRecommendedRooms(adults, kids, sharingType, kidsDetails);
      setRoomsCount(rec);
    }
  }, [adults, kids, sharingType, kidsDetails, isRoomsManuallySet]);

  // Live Auto-Sync Final Quotation, Per Adult Cost & Per Child Cost
  useEffect(() => {
    if (!isQuoteManuallyEdited && quotationCalculations.calculatedFinalQuote > 0) {
      setBaseQuotation(String(quotationCalculations.calculatedBase));
      setFinalQuotation(String(quotationCalculations.calculatedFinalQuote));
      setPerAdultPrice(String(quotationCalculations.calculatedPerAdult));
      if (kids > 0) {
        setPerKidPrice(String(quotationCalculations.calculatedPerKid));
      } else {
        setPerKidPrice('');
      }
      const adv = Number(advanceAmount) || 0;
      setBalanceAmount(String(Math.max(0, quotationCalculations.calculatedFinalQuote - adv)));
    }
  }, [quotationCalculations, isQuoteManuallyEdited, kids]);

  // Destination Options (Comprehensive Domestic & International Catalog)
  const destinationOptions = useMemo(() => {
    const curatedDestinations: Array<{ label: string; value: string; badge: string }> = [
      // --- Domestic India Destinations ---
      { label: 'Spiti Valley', value: 'Spiti Valley', badge: 'India' },
      { label: 'Leh Ladakh', value: 'Leh Ladakh', badge: 'India' },
      { label: 'Kashmir', value: 'Kashmir', badge: 'India' },
      { label: 'Himachal Pradesh', value: 'Himachal Pradesh', badge: 'India' },
      { label: 'Uttarakhand', value: 'Uttarakhand', badge: 'India' },
      { label: 'Rajasthan', value: 'Rajasthan', badge: 'India' },
      { label: 'Kerala', value: 'Kerala', badge: 'India' },
      { label: 'Goa', value: 'Goa', badge: 'India' },
      { label: 'Andaman & Nicobar Islands', value: 'Andaman', badge: 'India' },
      { label: 'Meghalaya', value: 'Meghalaya', badge: 'India' },
      { label: 'Sikkim & Darjeeling', value: 'Sikkim', badge: 'India' },
      { label: 'Golden Triangle (Delhi, Agra, Jaipur)', value: 'Golden Triangle', badge: 'India' },
      { label: 'Karnataka & South India', value: 'Karnataka', badge: 'India' },
      { label: 'Tamil Nadu & Pondicherry', value: 'Tamil Nadu', badge: 'India' },
      { label: 'Madhya Pradesh', value: 'Madhya Pradesh', badge: 'India' },
      { label: 'Maharashtra', value: 'Maharashtra', badge: 'India' },
      { label: 'Tadoba (Tiger Safari)', value: 'Tadoba', badge: 'India' },
      { label: 'Tadoba National Park', value: 'Tadoba National Park', badge: 'India' },
      { label: 'Gujarat', value: 'Gujarat', badge: 'India' },
      { label: 'Arunachal Pradesh', value: 'Arunachal Pradesh', badge: 'India' },
      { label: 'Assam', value: 'Assam', badge: 'India' },

      // --- International Destinations ---
      { label: 'Bali (Indonesia)', value: 'Bali', badge: 'International' },
      { label: 'Dubai & Abu Dhabi (UAE)', value: 'Dubai', badge: 'International' },
      { label: 'Thailand (Bangkok, Phuket, Krabi)', value: 'Thailand', badge: 'International' },
      { label: 'Vietnam (Hanoi, Da Nang, Saigon)', value: 'Vietnam', badge: 'International' },
      { label: 'Singapore', value: 'Singapore', badge: 'International' },
      { label: 'Malaysia (Kuala Lumpur, Langkawi)', value: 'Malaysia', badge: 'International' },
      { label: 'Maldives', value: 'Maldives', badge: 'International' },
      { label: 'Switzerland', value: 'Switzerland', badge: 'International' },
      { label: 'Europe (Multi-Country Schengen)', value: 'Europe', badge: 'International' },
      { label: 'Sri Lanka', value: 'Sri Lanka', badge: 'International' },
      { label: 'Nepal', value: 'Nepal', badge: 'International' },
      { label: 'Bhutan', value: 'Bhutan', badge: 'International' },
      { label: 'Mauritius', value: 'Mauritius', badge: 'International' },
      { label: 'Turkey (Istanbul, Cappadocia)', value: 'Turkey', badge: 'International' },
      { label: 'Georgia (Tbilisi, Kazbegi)', value: 'Georgia', badge: 'International' },
      { label: 'Azerbaijan (Baku)', value: 'Azerbaijan', badge: 'International' },
      { label: 'Kazakhstan (Almaty)', value: 'Kazakhstan', badge: 'International' },
      { label: 'Uzbekistan (Tashkent, Samarkand)', value: 'Uzbekistan', badge: 'International' },
      { label: 'Japan (Tokyo, Kyoto, Osaka)', value: 'Japan', badge: 'International' },
      { label: 'Egypt (Cairo, Luxor, Aswan)', value: 'Egypt', badge: 'International' },
      { label: 'Kenya & Tanzania (Safari)', value: 'Kenya', badge: 'International' }
    ];

    // Merge with any destinations from Zoho CRM
    const existingKeys = new Set(curatedDestinations.map(d => d.value.toLowerCase().replace(/[^a-z0-9]/g, '')));
    sheetDestinations.forEach(sd => {
      const k = sd.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (k && !existingKeys.has(k)) {
        curatedDestinations.push({
          label: sd,
          value: sd,
          badge: 'Zoho CRM'
        });
        existingKeys.add(k);
      }
    });

    return curatedDestinations;
  }, [sheetDestinations]);

  // Available Cities for Selected Destination
  const availableCitiesForDestination = useMemo(() => {
    const destClean = (destination || '').trim().toLowerCase();
    const destAlpha = destClean.replace(/[^a-z0-9]/g, '');
    // 1. Direct or fuzzy lookup in DEFAULT_CITIES_BY_DESTINATION
    let defaultMatches: string[] = [];
    if (DEFAULT_CITIES_BY_DESTINATION[destAlpha]) {
      defaultMatches = DEFAULT_CITIES_BY_DESTINATION[destAlpha];
    } else {
      // Substring check across keys
      for (const [key, cities] of Object.entries(DEFAULT_CITIES_BY_DESTINATION)) {
        if (destAlpha.includes(key) || key.includes(destAlpha)) {
          defaultMatches = cities;
          break;
        }
      }
      // Token-level check (e.g., "Spiti Valley Road Trip" -> matches "spiti")
      if (defaultMatches.length === 0) {
        const tokens = destClean.split(/[\s,/-]+/).filter(t => t.length >= 3);
        for (const token of tokens) {
          const tAlpha = token.replace(/[^a-z0-9]/g, '');
          for (const [key, cities] of Object.entries(DEFAULT_CITIES_BY_DESTINATION)) {
            if (key === tAlpha || key.includes(tAlpha) || tAlpha.includes(key)) {
              defaultMatches = cities;
              break;
            }
          }
          if (defaultMatches.length > 0) break;
        }
      }
    }

    // STRICT: When we have an authoritative, verified list of cities for this destination,
    // ALWAYS return this clean list directly! Never let wrongly mapped Zoho cities (e.g., Da Nang in Rajasthan) pollute it!
    if (defaultMatches.length > 0) {
      return defaultMatches;
    }

    // Fallback only if the destination is custom and not in our curated dictionary
    const sheetMatches: string[] = [];
    Object.keys(sheetCitiesByDest).forEach(dKey => {
      const k = dKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (k && (k === destAlpha || k.includes(destAlpha) || destAlpha.includes(k))) {
        sheetMatches.push(...sheetCitiesByDest[dKey]);
      }
    });

    if (sheetMatches.length > 0) {
      return Array.from(new Set(sheetMatches));
    }

    return DEFAULT_CITIES_BY_DESTINATION['rajasthan'] || [];
  }, [destination, sheetCitiesByDest]);

  // Filter Zoho Fixed Itineraries strictly according to the selected destination
  const [showAllZohoFixedItineraries, setShowAllZohoFixedItineraries] = useState(false);

  const filteredZohoFixedItineraries = useMemo(() => {
    if (showAllZohoFixedItineraries || !destination || !destination.trim()) {
      return zohoFixedItineraries;
    }

    const destClean = destination.trim().toLowerCase();
    const destAlpha = destClean.replace(/[^a-z0-9]/g, '');
    const knownCities = (availableCitiesForDestination || [])
      .map(c => c.toLowerCase().trim().replace(/[^a-z0-9]/g, ''))
      .filter(c => c.length >= 3);

    const filtered = zohoFixedItineraries.filter(item => {
      const itemDest = String(item.destination || '').trim().toLowerCase();
      const itemDestAlpha = itemDest.replace(/[^a-z0-9]/g, '');
      const itemName = String(item.name || '').trim().toLowerCase();
      const itemNameAlpha = itemName.replace(/[^a-z0-9]/g, '');
      const itemCatAlpha = String(item.category || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');

      // 1. Direct match with item destination
      if (itemDestAlpha && (itemDestAlpha === destAlpha || itemDestAlpha.includes(destAlpha) || destAlpha.includes(itemDestAlpha))) {
        return true;
      }

      // 2. Direct match with item category
      if (itemCatAlpha && (itemCatAlpha === destAlpha || itemCatAlpha.includes(destAlpha) || destAlpha.includes(itemCatAlpha))) {
        return true;
      }

      // 3. Itinerary name contains destination
      if (itemNameAlpha.includes(destAlpha) || itemName.includes(destClean)) {
        return true;
      }

      // 4. Itinerary name contains any known city belonging to this destination
      // e.g. Jawai, Jodhpur, Jaisalmer, Jaipur, Udaipur all belong to Rajasthan!
      const hasCityMatch = knownCities.some(city => itemNameAlpha.includes(city));
      if (hasCityMatch) {
        return true;
      }

      // 5. Item destination matches any known city belonging to this destination
      // e.g. item.destination is 'Tadoba' and destination is 'Maharashtra'
      const hasDestCityMatch = knownCities.some(city => itemDestAlpha === city || itemDestAlpha.includes(city) || city.includes(itemDestAlpha));
      if (hasDestCityMatch) {
        return true;
      }

      // 6. Special cross-match for Tadoba and Maharashtra
      const isTadobaDest = destAlpha.includes('tadoba');
      const isTadobaItem = itemDestAlpha.includes('tadoba') || itemNameAlpha.includes('tadoba');
      if (isTadobaDest && (isTadobaItem || itemDestAlpha.includes('maharashtra'))) {
        return true;
      }
      if (destAlpha.includes('maharashtra') && isTadobaItem) {
        return true;
      }

      return false;
    });

    return filtered;
  }, [destination, zohoFixedItineraries, availableCitiesForDestination, showAllZohoFixedItineraries]);

  // Auto-reset selected fixed itinerary if destination changed and current selection is no longer in filtered list
  useEffect(() => {
    if (selectedFixedItineraryId && !showAllZohoFixedItineraries) {
      const exists = filteredZohoFixedItineraries.some(item => item.id === selectedFixedItineraryId);
      if (!exists) {
        setSelectedFixedItineraryId('');
      }
    }
  }, [destination, filteredZohoFixedItineraries, showAllZohoFixedItineraries, selectedFixedItineraryId]);

  // Helper to recompute stayDates for hotels list
  const computeHotelStayDates = (startStr: string, hotelList: HotelItem[]): HotelItem[] => {
    if (!startStr || !/^\d{4}-\d{2}-\d{2}$/.test(startStr) || !Array.isArray(hotelList)) return hotelList;
    let currentStart = startStr;
    return hotelList.map(h => {
      const n = Math.max(1, Number(h.nights) || 1);
      const currentEnd = addDaysToDateStr(currentStart, n);
      const stayDates = formatStayDateRange(currentStart, currentEnd, n);
      currentStart = currentEnd;
      return {
        ...h,
        stayDates
      };
    });
  };

  // Helper to derive Hotel Stays & Nights from Day Rows based on City 2 (night stay city takes precedence)
  const deriveHotelsFromDayRows = (
    rows: TableDayRow[] | any[],
    nightsCount?: number,
    currentCategory?: string,
    existingHotels?: HotelItem[]
  ): HotelItem[] => {
    if (!rows || rows.length === 0) return [];

    const effectiveNights = Number(nightsCount) > 0
      ? Number(nightsCount)
      : Math.max(1, rows.length > 1 ? rows.length - 1 : 1);

    // Overnight stays happen on days 1 to effectiveNights (0 to effectiveNights - 1)
    const nightDays = rows.slice(0, effectiveNights);

    const stays: { city: string; nights: number }[] = [];

    nightDays.forEach((r: any) => {
      // Prioritize City 2 as night stay city, fallback to City, fallback to destination
      const rawCity = (r.city2 || r.city || destination || '').trim();
      const stayCity = rawCity || availableCitiesForDestination[0] || 'Jaipur';

      if (stays.length > 0 && stays[stays.length - 1].city.toLowerCase() === stayCity.toLowerCase()) {
        // Consecutive night in same city
        stays[stays.length - 1].nights += 1;
      } else {
        // New city hotel stay
        stays.push({ city: stayCity, nights: 1 });
      }
    });

    const cat = currentCategory || masterHotelCategory || 'Deluxe';
    const pool = existingHotels || hotels;

    const derived = stays.slice(0, 6).map((stay, idx) => {
      const existing = pool.find(
        h => (h.city || '').toLowerCase().trim() === stay.city.toLowerCase().trim()
      );
      const cClean = stay.city.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cityHotels = sheetHotelsByCity[cClean] || [];
      const hotelCat = existing?.category || cat;
      let hotelName = existing?.hotelName || '';
      let rates = { baseRate: 0, extraBedRate: 0, childWithoutBedRate: 0, roomCategory: '' };
      if (hotelName) {
        const matchingHotel = cityHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === hotelName.toLowerCase().trim());
        if (matchingHotel && matchesHotelCategory(matchingHotel.category, hotelCat)) {
          rates = getHotelRates(matchingHotel, hotelCat, existing?.roomCategory);
        } else {
          hotelName = '';
        }
      }

      return {
        index: idx + 1,
        hotelName,
        city: stay.city,
        nights: stay.nights,
        roomCategory: hotelName ? (existing?.roomCategory || rates.roomCategory || '') : '',
        category: hotelCat,
        stayDates: existing?.stayDates || '',
        basePrice: hotelName ? (existing?.basePrice || rates.baseRate) : 0,
        extraBedPrice: hotelName ? (existing?.extraBedPrice || rates.extraBedRate) : 0,
        childWithoutBedPrice: hotelName ? (existing?.childWithoutBedPrice || rates.childWithoutBedRate) : 0
      };
    });

    return startDate ? computeHotelStayDates(startDate, derived) : derived;
  };

  // Track sequence of night stay cities (City 2 takes precedence over City 1)
  const nightCitiesKey = useMemo(() => {
    const effNights = Number(noOfNights) > 0 ? Number(noOfNights) : Math.max(1, dayRows.length > 1 ? dayRows.length - 1 : 1);
    return dayRows
      .slice(0, effNights)
      .map(r => (r.city2 || r.city || '').trim().toLowerCase())
      .join('->');
  }, [dayRows, noOfNights]);

  // Auto-sync Hotel Cities & Nights as per City 2 whenever itinerary cities change
  useEffect(() => {
    if (!isHotelsManuallyCustomized && dayRows.length > 0 && nightCitiesKey) {
      setHotels(prev => {
        const derived = deriveHotelsFromDayRows(dayRows, noOfNights, masterHotelCategory, prev);
        return derived.length > 0 ? derived : prev;
      });
    }
  }, [nightCitiesKey, isHotelsManuallyCustomized, masterHotelCategory]);

  // Sync loaded Zoho hotel subform room rates & lowest room category into active hotels
  useEffect(() => {
    if (Object.keys(sheetHotelsByCity).length > 0 && hotels.length > 0) {
      setHotels(prev => {
        let changed = false;
        const updated = prev.map(h => {
          if (!h.hotelName) return h;
          const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const sheetHotels = sheetHotelsByCity[cClean] || [];
          const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === String(h.hotelName || '').toLowerCase().trim());
          if (!foundHotel) return h;

          const effectiveCat = h.category || masterHotelCategory || 'Deluxe';
          if (!matchesHotelCategory(foundHotel.category, effectiveCat)) {
            changed = true;
            return {
              ...h,
              hotelName: '',
              roomCategory: '',
              basePrice: 0,
              extraBedPrice: 0,
              childWithoutBedPrice: 0
            };
          }

          const rates = getHotelRates(foundHotel, effectiveCat, h.roomCategory);
          if (h.basePrice !== rates.baseRate || h.extraBedPrice !== rates.extraBedRate || (foundHotel.rooms?.length > 0 && !h.roomCategory)) {
            changed = true;
            return {
              ...h,
              roomCategory: h.roomCategory || rates.roomCategory,
              basePrice: rates.baseRate,
              extraBedPrice: rates.extraBedRate,
              childWithoutBedPrice: rates.childWithoutBedRate
            };
          }
          return h;
        });
        return changed ? updated : prev;
      });
    }
  }, [sheetHotelsByCity, masterHotelCategory]);

  // Available Vehicle options from Zoho CRM Vehicles module or fallback
  const vehicleOptions = useMemo(() => {
    if (zohoVehicles && zohoVehicles.length > 0) {
      return zohoVehicles.map(v => ({
        label: v.name,
        value: v.name,
        badge: v.cost ? `₹${Number(v.cost).toLocaleString('en-IN')}/day • Up to ${v.maxCapacity} Pax` : `Up to ${v.maxCapacity} Pax`
      }));
    }
    return [
      'AC Sedan / Dzire',
      'AC Innova Crysta',
      'Tempo Traveller 12 Seater',
      'Tempo Traveller 17 Seater',
      'Luxury Urbania',
      'AC Ertiga',
      'Toyota Fortuner'
    ];
  }, [zohoVehicles]);

  const getExperiencesLookupForDay = (city1?: string, city2?: string) => {
    const map = new Map<string, { label: string; value: string; badge?: string; meta?: any }>();
    const citiesToInclude = Array.from(new Set([city1, city2].filter(Boolean) as string[]));

    // If no city provided, fallback to destination
    if (citiesToInclude.length === 0 && destination) {
      citiesToInclude.push(destination);
    }

    const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
    const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);

    citiesToInclude.forEach(cName => {
      const cClean = cName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      const sheetExps = sheetExpByCity[cClean] || [];
      const defaultExps = DEFAULT_EXPERIENCES_BY_CITY[cClean] || [];

      sheetExps.forEach(e => {
        const key = e.name.toLowerCase().trim();
        if (!map.has(key)) {
          const sicA = Number(e.sicAdult ?? e.Cost_Per_Person) || 0;
          const sicC = Number(e.sicChild ?? e.Cost_per_child) || 0;
          const priv = Number(e.privateCost ?? e.Private_Cost) || 0;

          let priceBadge = '';
          let perHeadCost = 0;
          if (sicA > 0 || sicC > 0) {
            priceBadge = `₹${sicA.toLocaleString('en-IN')}/pax (SIC)`;
            perHeadCost = sicA;
          } else if (priv > 0) {
            const privateShare = Math.round(priv / eligiblePax);
            priceBadge = `₹${priv.toLocaleString('en-IN')} Private`;
            perHeadCost = privateShare;
          }

          const cityBadge = citiesToInclude.length > 1 ? cName : undefined;
          const locationBadge = e.locationType === 'En-route' ? 'En-route' : undefined;
          const badges = [cityBadge, locationBadge, priceBadge || e.category || 'Sightseeing'].filter(Boolean).join(' • ');

          map.set(key, {
            label: e.name,
            value: e.name,
            badge: badges || undefined,
            meta: {
              ...e,
              city: cName,
              category: e.category,
              sicAdult: sicA,
              sicChild: sicC,
              privateCost: priv,
              ppCost: perHeadCost,
              perHeadCost,
              timing: e.timing,
              distance: e.distance,
              guidedTour: e.guidedTour,
              description: e.description || e.templateDescription || ''
            }
          });
        }
      });

      defaultExps.forEach(e => {
        const key = e.name.toLowerCase().trim();
        if (!map.has(key)) {
          const cityBadge = citiesToInclude.length > 1 ? cName : undefined;
          const badges = [cityBadge, e.guidedTour ? 'Guided' : undefined].filter(Boolean).join(' • ');
          map.set(key, {
            label: e.name,
            value: e.name,
            badge: badges || undefined,
            meta: { city: cName, guidedTour: e.guidedTour, ppCost: 0, description: '' }
          });
        }
      });
    });

    return Array.from(map.values());
  };

  // Get En-route Spot Lookup for City and/or City 2 (includes transit spots + both cities' experiences + Zoho En-route items)
  const getEnRouteLookupForDay = (city1?: string, city2?: string) => {
    const map = new Map<string, { label: string; value: string; badge?: string; meta?: any }>();

    // 1. Common transit highway spots
    const defaultTransitSpots = [
      'Ajmer Sharif Dargah',
      'Pushkar Brahma Temple',
      'Ranakpur Jain Temples',
      'Kumbhalgarh Fort',
      'Fatehpur Sikri',
      'Abhaneri Chand Baori',
      'Chittorgarh Fort',
      'Bhimlat Mahadev Waterfalls',
      'Kuldhara Haunted Village',
      'Munabao Border',
      'Tanot Mata Temple',
      'Osian Sand Dunes & Temple',
      'Samode Palace',
      'Patrika Gate',
      'Kishangarh Dumping Yard'
    ];

    defaultTransitSpots.forEach(spot => {
      map.set(spot.toLowerCase().trim(), {
        label: spot,
        value: spot,
        badge: 'En-route Stop',
        meta: { description: `En-route visit to ${spot}.`, ppCost: 0 }
      });
    });

    // 2. Add experiences from City 1 & City 2
    const dayExps = getExperiencesLookupForDay(city1, city2);
    dayExps.forEach(exp => {
      const key = exp.value.toLowerCase().trim();
      if (!map.has(key)) {
        map.set(key, exp);
      }
    });

    // 3. Add any experiences from master catalog specifically flagged as 'En-route'
    Object.values(sheetExpByCity).forEach(list => {
      (list || []).forEach(e => {
        if (e.locationType === 'En-route') {
          const key = e.name.toLowerCase().trim();
          if (!map.has(key)) {
            const priceText = e.ppCost ? `₹${Number(e.ppCost).toLocaleString('en-IN')}/pax` : undefined;
            const badges = [e.city ? `${e.city}` : undefined, 'En-route', priceText].filter(Boolean).join(' • ');
            map.set(key, {
              label: e.name,
              value: e.name,
              badge: badges,
              meta: {
                city: e.city,
                guidedTour: e.guidedTour,
                ppCost: e.ppCost || 0,
                description: e.description || e.templateDescription || ''
              }
            });
          }
        }
      });
    });

    return Array.from(map.values());
  };

  // Backward compatibility alias for single city callers
  const getExperiencesLookupForCity = (cityName: string) => getExperiencesLookupForDay(cityName);

  // Helper to match STRICTLY by Hotel Category (Standard, Deluxe, Super Deluxe, Suite, Premium, Luxury)
  const matchesHotelCategory = (hotelCat: string, targetCat: string) => {
    if (!targetCat || targetCat === 'All') return true;
    const c = (hotelCat || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const t = targetCat.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!c) return false;

    if (t === 'standard') return c === 'standard' || c.includes('standard');
    if (t === 'superdeluxe') return c === 'superdeluxe' || c.includes('super');
    if (t === 'deluxe') return c === 'deluxe' && !c.includes('super');
    if (t === 'suite') return c === 'suite' || c.includes('suite');
    if (t === 'premium') return c === 'premium' || c.includes('premium');
    if (t === 'luxury') return c === 'luxury' || c.includes('luxury');

    return c === t;
  };

  // Get Hotels Lookup for a City filtered STRICTLY by Hotel Category with Base/ExtraBed prices
  const getHotelsLookupForCity = (cityName: string, categoryFilter?: string) => {
    const effectiveCat = categoryFilter || masterHotelCategory || 'Deluxe';
    if (!cityName || !cityName.trim()) {
      return [
        {
          label: 'Select city first',
          value: '',
          badge: 'Required',
          disabled: true
        }
      ];
    }

    const cClean = cityName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const sheetHotels = sheetHotelsByCity[cClean] || [];

    const filtered = effectiveCat === 'All'
      ? sheetHotels
      : sheetHotels.filter(h => matchesHotelCategory(h.category, effectiveCat));

    if (filtered.length === 0) {
      return [
        {
          label: `No hotel in this hotel category (${effectiveCat})`,
          value: '',
          badge: '0 available',
          disabled: true
        }
      ];
    }

    return filtered.map(h => {
      const { baseRate, extraBedRate } = getHotelRates(h, h.category || effectiveCat);
      return {
        label: `${h.hotelName} (₹${baseRate.toLocaleString('en-IN')} / ₹${extraBedRate.toLocaleString('en-IN')})`,
        value: h.hotelName,
        badge: `₹${baseRate.toLocaleString('en-IN')} / ₹${extraBedRate.toLocaleString('en-IN')}`,
        meta: {
          ...h,
          baseRate,
          extraBedRate
        }
      };
    });
  };

  // Get Room Categories for a Selected Hotel strictly from its Zoho subform
  const getRoomCategoriesForHotel = (hotelName: string, cityName: string) => {
    if (!hotelName || !hotelName.trim()) {
      return [
        {
          label: 'Select hotel first',
          value: '',
          badge: 'Required',
          disabled: true
        }
      ];
    }
    const cClean = (cityName || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const sheetHotels = sheetHotelsByCity[cClean] || [];
    const hName = (hotelName || '').trim().toLowerCase();
    const found = sheetHotels.find((h: any) => (h.hotelName || '').toLowerCase().trim() === hName);

    if (found && Array.isArray(found.rooms) && found.rooms.length > 0) {
      return found.rooms.map((r: any) => {
        // STRICTLY from Base Price column
        const bPrice = Number(r.basePrice || r.Base_Price || r.Base_Price_INR) || 0;
        const ebPrice = Number(r.extraBedPrice || r.Extra_Bed || r.Extra_Bed_INR) || 0;
        const badge = bPrice > 0 ? `₹${bPrice.toLocaleString('en-IN')} / ₹${ebPrice.toLocaleString('en-IN')}` : undefined;
        return {
          label: badge ? `${r.roomCategory} (${badge})` : r.roomCategory,
          value: r.roomCategory,
          badge,
          meta: {
            ...r,
            basePrice: bPrice,
            extraBedPrice: ebPrice
          }
        };
      });
    }

    return [
      {
        label: 'No room categories found for this hotel',
        value: '',
        badge: '0 available',
        disabled: true
      }
    ];
  };

  // Check if any itinerary options already exist in MongoDB for this Inquiry ID / Lead
  const checkExistingItineraryOptions = async (targetInquiryId: string, targetLeadId?: string) => {
    if (!targetInquiryId && !targetLeadId) return;
    setCheckingOptions(true);
    setOptionLockAlert(null);
    try {
      const params = new URLSearchParams();
      if (targetInquiryId) params.set('inquiryId', targetInquiryId);
      if (targetLeadId) params.set('leadId', targetLeadId);

      const res = await fetch(`/api/itinerary/check-options?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.existingOptions) {
        setExistingOptions(data.existingOptions);
        setUnlockedOptions({});
        const existingNums = Object.keys(data.existingOptions).map(Number);
        if (existingNums.length > 0) {
          // If currently selected option is already generated, auto-switch to next available
          setSelectedOption(prev => {
            if (existingNums.includes(prev)) {
              const nextAvailable = [1, 2, 3].find(n => !existingNums.includes(n));
              return nextAvailable || prev;
            }
            return prev;
          });
        }
      } else {
        setExistingOptions({});
      }
    } catch (checkErr) {
      console.warn('[Check Existing Options]:', checkErr);
    } finally {
      setCheckingOptions(false);
    }
  };

  // Sync from Zoho Lead
  const handleFetchFromZoho = async () => {
    if (!zohoInquiryInput.trim()) return;
    setFetchingZoho(true);
    setZohoSyncMsg(null);
    setOptionLockAlert(null);
    try {
      const res = await fetch(`/api/zoho/fetch-lead?query=${encodeURIComponent(zohoInquiryInput.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.lead) throw new Error(data.error || 'Lead not found in Zoho.');
      const l = data.lead;
      const raw = l.rawLeadData || {};

      // 1. Inquiry ID & Zoho Lead ID
      const resolvedInquiryId = l.inquiryId || raw.Inquiry_ID || zohoInquiryInput.trim();
      setInquiryId(resolvedInquiryId);
      const resolvedZohoLeadId = l.zohoLeadId || l.leadId || l.id || raw.id || '';
      if (resolvedZohoLeadId) {
        setZohoLeadId(String(resolvedZohoLeadId));
      }
      setIsCustomInclusionsEdited(false);

      // Check existing options in MongoDB for this Inquiry ID right away
      checkExistingItineraryOptions(resolvedInquiryId, l.zohoLeadId || l.id);
      handleRefreshZohoFixedItineraries();

      // 2. Client Name
      const fName = l.firstName || raw.First_Name || '';
      const lName = l.lastName || raw.Last_Name || '';
      const cName = l.leadName || raw.Full_Name || [fName, lName].filter(Boolean).join(' ') || 'Valued Guest';
      setFirstName(fName);
      setLastName(lName);
      setFullName(cName);

      // 3. Email & Mobile
      const cEmail = l.email || raw.Email || '';
      const cMobile = l.mobile || raw.Mobile || raw.Phone || '';
      setEmail(cEmail);
      setMobile(cMobile);

      // 4. Departure City & Destination
      const depCity = raw.Departure_City || l.city || raw.City || '';
      setDepartureCity(depCity);

      const dest = raw.Destinations || raw.Destination || raw.Destination_Location || raw.Destination_State;
      if (dest) {
        setDestination(dest);
      } else if (l.destinations && String(l.destinations).toLowerCase() !== String(l.city || '').toLowerCase()) {
        setDestination(String(l.destinations));
      }

      if (l.destinationType || raw.Destination_Type) {
        setDestinationType(l.destinationType || raw.Destination_Type);
      }

      // 5. Travel Dates
      const startD = toDateInputValue(l.travelStartDate || raw.Preferred_Start_date || raw.Start_Date);
      if (startD) setStartDate(startD);

      const endD = toDateInputValue(l.travelEndDate || raw.Travel_End_Date || raw.End_Date);
      if (endD) setEndDate(endD);

      // 6. Days & Nights Count & Travel End Date
      let daysCount = Number(l.noOfDays || raw.No_of_Days);
      let nightsCount = Number(l.noOfNights || raw.No_of_Nights);

      if (startD) {
        if (daysCount > 0 || nightsCount > 0) {
          const effNts = nightsCount || (daysCount > 1 ? daysCount - 1 : 1);
          const effDays = daysCount || (effNts + 1);
          daysCount = effDays;
          nightsCount = effNts;
          const computedEnd = addDaysToDateStr(startD, effNts);
          setEndDate(computedEnd);
        } else if (endD) {
          const dateDiff = calcDaysBetween(startD, endD);
          if (dateDiff) {
            daysCount = dateDiff.days;
            nightsCount = dateDiff.nights;
            setEndDate(endD);
          }
        }
      } else if (endD) {
        setEndDate(endD);
      }

      if (daysCount > 0) {
        handleDaysCountChange(daysCount, false);
        const effectiveNights = nightsCount || (daysCount > 1 ? daysCount - 1 : 1);
        setNoOfNights(effectiveNights);
      }

      // 7. Adults & Kids
      const adultCount = Number(l.adults ?? raw.Adults ?? raw.Number_Of_Guest ?? raw.Number_Of_Guests);
      if (!isNaN(adultCount) && adultCount > 0) {
        setAdults(adultCount);
      }

      const kidCount = Number(l.kids ?? raw.Kids ?? raw.Children ?? raw.Number_Of_Kids);
      if (!isNaN(kidCount) && kidCount >= 0) {
        setKids(kidCount);
      }

      // Extract child details if stored in Zoho CRM
      const fetchedKidsDetails: ChildDetail[] = [];
      const effectiveKids = kidCount > 0 ? kidCount : 0;
      for (let c = 1; c <= Math.max(effectiveKids, 10); c++) {
        const rawAge = raw[`Child_${c}_Age`];
        const rawBed = raw[`Child_${c}_Bed_Preference`] || raw[`Child_${c}_Bed_Preferences`];
        if ((rawAge !== undefined && rawAge !== null && rawAge !== '') || rawBed) {
          let bedPref: 'With Bed' | 'Without Bed' | 'Crib' = 'Without Bed';
          const bedStr = String(rawBed || '').toLowerCase();
          if (bedStr.includes('with') || bedStr.includes('extra')) {
            bedPref = 'With Bed';
          } else if (bedStr.includes('crib') || bedStr.includes('cot')) {
            bedPref = 'Crib';
          } else {
            bedPref = 'Without Bed';
          }
          fetchedKidsDetails.push({
            childNumber: c,
            age: rawAge !== undefined && rawAge !== null ? String(rawAge) : '',
            bedPreference: bedPref
          });
        }
      }
      if (fetchedKidsDetails.length > 0) {
        setKidsDetails(fetchedKidsDetails);
        if (kidCount === 0) setKids(fetchedKidsDetails.length);
      } else if (effectiveKids > 0) {
        setKidsDetails(Array.from({ length: effectiveKids }, (_, i) => ({
          childNumber: i + 1,
          age: '',
          bedPreference: 'Without Bed'
        })));
      } else {
        setKidsDetails([]);
      }

      // Helper to safely extract string from Zoho lookup object or string
      const toSafeStr = (val: any, fallback = ''): string => {
        if (val === null || val === undefined) return fallback;
        if (typeof val === 'object') return val.name || val.label || val.value || fallback;
        return String(val);
      };

      // 8. Rooms & Sharing & Style
      if (raw.Rooms_Count) {
        const rc = Number(raw.Rooms_Count);
        if (!isNaN(rc) && rc > 0) setRoomsCount(rc);
      }
      const rawSharing = toSafeStr(raw.Sharing_Type || l.sharingType);
      if (rawSharing) {
        setSharingType(rawSharing);
      }
      const rawStyle = toSafeStr(raw.Travel_Style || l.travelStyle);
      if (rawStyle) {
        setTravelStyle(rawStyle);
      }

      // 9. Vehicle & Meal Plan
      const rawVeh = toSafeStr(raw.Vehicle_Type || raw.Vehicle || (l.vehicleType && l.vehicleType !== 'AC Vehicle' ? l.vehicleType : ''));
      if (rawVeh) {
        setVehicleType(rawVeh);
      }
      const rawMeal = toSafeStr(raw.Meal_Plan || l.mealPlan);
      if (rawMeal) {
        setMealPlan(rawMeal);
      }

      // 10. Hotel Category (Package Category)
      const hotelCat = toSafeStr(raw.Hotel_Category || raw.Hotel_1_Category || (l.preferredRoomCategory && l.preferredRoomCategory !== 'Standard' ? l.preferredRoomCategory : ''));
      if (hotelCat) {
        handleMasterHotelCategoryChange(hotelCat);
      }

      // 11. Costing & Quotation
      const finalQuote = raw.Final_Quotation_Amount ?? l.finalQuotationAmount;
      if (finalQuote !== undefined && finalQuote !== null && Number(finalQuote) > 0) {
        setFinalQuotation(String(finalQuote));
      } else if (l.calculatedPricing?.finalQuotation) {
        setFinalQuotation(String(l.calculatedPricing.finalQuotation));
      }
      const adultPrice = raw.Per_Adult_Cost ?? l.perAdultPrice;
      if (adultPrice !== undefined && adultPrice !== null && Number(adultPrice) > 0) {
        setPerAdultPrice(String(adultPrice));
      } else if (l.calculatedPricing?.perAdultCost) {
        setPerAdultPrice(String(l.calculatedPricing.perAdultCost));
      }
      const kidPrice = raw.Per_Child_Cost ?? l.perKidPrice;
      if (kidPrice !== undefined && kidPrice !== null && Number(kidPrice) > 0) {
        setPerKidPrice(String(kidPrice));
      } else if (l.calculatedPricing?.perChildCost && effectiveKids > 0) {
        setPerKidPrice(String(l.calculatedPricing.perChildCost));
      }
      if (l.calculatedPricing?.finalQuotation) {
        setBaseQuotation(String(l.calculatedPricing.finalQuotation));
      }
      if (raw.Advance_Amount_Paid !== undefined && raw.Advance_Amount_Paid !== null && Number(raw.Advance_Amount_Paid) > 0) {
        setAdvanceAmount(String(raw.Advance_Amount_Paid));
      }
      if (raw.Balance_Pending_Amount !== undefined && raw.Balance_Pending_Amount !== null && Number(raw.Balance_Pending_Amount) > 0) {
        setBalanceAmount(String(raw.Balance_Pending_Amount));
      }

      // 12. Special Requirements
      if (raw.Specific_Requirements || raw.Description) {
        setSpecialRequirements(raw.Specific_Requirements || raw.Description || '');
      }

      // 12.1 Inclusions & Exclusions from Zoho Lead
      if (raw.Inclusions || raw.Package_Inclusions || l.inclusions) {
        const rawInc = raw.Inclusions || raw.Package_Inclusions || l.inclusions;
        const parsedList = Array.isArray(rawInc)
          ? rawInc.map((s: any) => String(s).trim()).filter(Boolean)
          : String(rawInc).split(/\r?\n|•|-|\*/).map(s => s.trim()).filter(s => s.length > 2);
        if (parsedList.length > 0) {
          setInclusions(parsedList);
          setIsCustomInclusionsEdited(true);
        }
      }
      if (raw.Exclusions || raw.Package_Exclusions || l.exclusions) {
        const rawExc = raw.Exclusions || raw.Package_Exclusions || l.exclusions;
        const parsedList = Array.isArray(rawExc)
          ? rawExc.map((s: any) => String(s).trim()).filter(Boolean)
          : String(rawExc).split(/\r?\n|•|-|\*/).map(s => s.trim()).filter(s => s.length > 2);
        if (parsedList.length > 0) {
          setExclusions(parsedList);
          setIsCustomInclusionsEdited(true);
        }
      }

      // 13. Hotels if populated in Zoho Lead
      if (Array.isArray(l.hotels) && l.hotels.length > 0) {
        const mappedHotels = l.hotels.map((h: any, idx: number) => {
          const rawName = (h.hotelName || '').trim();
          const isGeneric = !rawName || rawName.toLowerCase() === 'hotel' || rawName.toLowerCase().endsWith(' hotel');
          const finalName = isGeneric ? '' : rawName;
          return {
            index: idx + 1,
            hotelName: finalName,
            city: h.city || '',
            nights: Number(h.nights) || 1,
            roomCategory: finalName ? (h.roomCategory || '') : '',
            category: hotelCat || masterHotelCategory || 'Deluxe',
            stayDates: h.stayDates || '',
            basePrice: 0,
            extraBedPrice: 0,
            childWithoutBedPrice: 0
          };
        });
        const withStayDates = startD ? computeHotelStayDates(startD, mappedHotels) : mappedHotels;
        setHotels(withStayDates);
      }

      // 14. Day Activities (Subform: Activities_and_Experiences_1)
      if (Array.isArray(l.dayActivities) && l.dayActivities.length > 0) {
        const mappedRows: TableDayRow[] = l.dayActivities.map((act: any, idx: number) => {
          const exps: string[] = ['', '', '', ''];
          const descs: string[] = ['', '', '', ''];
          const costs: number[] = [0, 0, 0, 0];
          (act.experiences || []).forEach((e: any, eIdx: number) => {
            if (eIdx < 4) {
              const expName = (e.name || '').trim();
              exps[eIdx] = expName;
              let d = String(e.description || e.subTitle || '').trim();
              let cost = Number(e.ppCost) || 0;
              if (expName) {
                const found = findExperienceInCatalogs(expName, act.city, act.city2);
                if (!d) {
                  d = found?.description || found?.templateDescription || '';
                }
                if (!cost) {
                  cost = Number(found?.ppCost) || 0;
                }
              }
              descs[eIdx] = d;
              costs[eIdx] = cost;
            }
          });
          return {
            dayNumber: act.dayNumber || idx + 1,
            dayText: act.dayText || `Day ${idx + 1}`,
            guidedTour: !!act.guidedTour,
            city: act.city || '',
            city2: act.city2 || '',
            enRouteExperiences: act.enRouteExperiences ? [act.enRouteExperiences] : [''],
            experiences: exps,
            descriptions: descs,
            experienceCosts: costs,
            optionalExperiences: ['', ''],
            optionalDescriptions: ['', ''],
            optionalExperienceCosts: [0, 0]
          };
        });
        setDayRows(mappedRows);
        setNoOfDays(mappedRows.length);
        const effNts = mappedRows.length > 1 ? mappedRows.length - 1 : 1;
        setNoOfNights(effNts);
        if (startD) {
          setEndDate(addDaysToDateStr(startD, effNts));
        }

        // If specific hotels were not populated in lead, auto-derive from City 2 of day activities
        const hasSpecificHotels = Array.isArray(l.hotels) && l.hotels.length > 0 && l.hotels.some((h: any) => (h.hotelName && h.hotelName !== 'Hotel') || h.city);
        if (!hasSpecificHotels) {
          setIsHotelsManuallyCustomized(false);
          const derivedHotels = deriveHotelsFromDayRows(mappedRows, effNts, hotelCat || masterHotelCategory);
          if (derivedHotels.length > 0) {
            setHotels(startD ? computeHotelStayDates(startD, derivedHotels) : derivedHotels);
          }
        }
      }

      const syncSummary = [
        cName !== 'Valued Guest' ? cName : null,
        resolvedInquiryId,
        cMobile || null,
        cEmail || null
      ].filter(Boolean).join(' • ');

      setZohoSyncMsg(`✓ Synced: ${syncSummary}`);
    } catch (e: any) {
      setZohoSyncMsg(`⚠ ${e.message}`);
    } finally {
      setFetchingZoho(false);
    }
  };

  // Fetch Master Data directly from Zoho CRM Custom Modules (Activities_and_Experiences, Hotel, Vehicles)
  const handleFetchZohoMasterData = async () => {
    setLoadingZohoMaster(true);
    setZohoMasterError(null);
    try {
      const res = await fetch(`/api/zoho/master-data?_t=${Date.now()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch Zoho master data');

      if (Array.isArray(data.destinations) && data.destinations.length > 0) {
        setSheetDestinations(data.destinations);
      }
      if (data.citiesByDestination) {
        setSheetCitiesByDest(data.citiesByDestination);
      }
      if (data.experiencesByCity) {
        const eByCity = { ...data.experiencesByCity };
        if (eByCity.tadobanationalpark && !eByCity.tadoba) {
          eByCity.tadoba = eByCity.tadobanationalpark;
        } else if (eByCity.tadoba && !eByCity.tadobanationalpark) {
          eByCity.tadobanationalpark = eByCity.tadoba;
        }
        setSheetExpByCity(eByCity);
        // Automatically sync dayRows experience costs with the newly loaded master activities data!
        setDayRows(prev => prev.map(row => {
          const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
          const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
          const updatedCosts = [...(row.experienceCosts || [0, 0, 0, 0])];
          (row.experiences || []).forEach((expName, idx) => {
            if (!expName || !expName.trim()) return;
            const clean = expName.trim().toLowerCase();
            let match: any = null;
            if (row.city || row.city2) {
              const pClean = (row.city || row.city2).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
              match = (data.experiencesByCity[pClean] || []).find((c: any) =>
                (c.name || '').trim().toLowerCase() === clean ||
                (c.name || '').toLowerCase().includes(clean) ||
                clean.includes((c.name || '').toLowerCase())
              );
            }
            if (!match) {
              for (const list of Object.values(data.experiencesByCity)) {
                match = (list as any[] || []).find((c: any) =>
                  (c.name || '').trim().toLowerCase() === clean ||
                  (c.name || '').toLowerCase().includes(clean) ||
                  clean.includes((c.name || '').toLowerCase())
                );
                if (match) break;
              }
            }
            if (match) {
              const sicA = Number(match.sicAdult ?? match.Cost_Per_Person) || 0;
              const priv = Number(match.privateCost ?? match.Private_Cost) || 0;
              if (sicA > 0) {
                updatedCosts[idx] = sicA;
              } else if (priv > 0) {
                updatedCosts[idx] = Math.round(priv / eligiblePax);
              }
            }
          });
          return { ...row, experienceCosts: updatedCosts };
        }));
      }
      if (data.hotelsByCity) {
        const hByCity = { ...data.hotelsByCity };
        if (hByCity.tadobanationalpark && !hByCity.tadoba) {
          hByCity.tadoba = hByCity.tadobanationalpark;
        } else if (hByCity.tadoba && !hByCity.tadobanationalpark) {
          hByCity.tadobanationalpark = hByCity.tadoba;
        }
        setSheetHotelsByCity(hByCity);
      }
      if (Array.isArray(data.vehicles)) {
        setZohoVehicles(data.vehicles);
        if (data.vehicles.length > 0 && (!vehicleType || vehicleType === 'AC Innova Crysta')) {
          setVehicleType(data.vehicles[0].name);
        }
      }
      if (data.stats) {
        setZohoMasterStats(data.stats);
      }
      setDataSource('zoho');
    } catch (err: any) {
      console.error('Zoho master data fetch error:', err);
      setZohoMasterError(err.message || 'Error fetching Zoho CRM modules data');
    } finally {
      setLoadingZohoMaster(false);
    }
  };

  // Fetch Sheet Data (Fallback / Alternate mode)
  const handleFetchSheetData = async (overrideUrl?: string) => {
    const urlToUse = (overrideUrl || sheetUrl).trim();
    if (!urlToUse) {
      setSheetError('Please enter a valid Google Sheet URL.');
      return;
    }
    setConnectingSheet(true);
    setSheetError(null);
    setSheetSuccessMsg(null);

    try {
      const res = await fetch(`/api/sheet/fetch?sheetUrl=${encodeURIComponent(urlToUse)}&_t=${Date.now()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to fetch sheet.');

      if (data.allDestinations) setSheetDestinations(data.allDestinations);
      if (data.citiesByDestination) setSheetCitiesByDest(data.citiesByDestination);
      if (data.experiencesByCity) setSheetExpByCity(data.experiencesByCity);
      if (data.hotelsByCity) setSheetHotelsByCity(data.hotelsByCity);
      if (data.packages) setSheetPackages(data.packages);

      const totalExp = Object.values(data.experiencesByCity || {}).reduce((acc: number, arr: any) => acc + (arr?.length || 0), 0);
      const citiesCount = Object.keys(data.experiencesByCity || {}).length;

      setSheetSuccessMsg(`✓ Connected to Activity Sheet! Loaded ${totalExp} Experiences across ${citiesCount} Cities.`);
      setDataSource('sheet');
    } catch (err: any) {
      setSheetError(err.message || 'Error importing sheet data.');
    } finally {
      setConnectingSheet(false);
    }
  };

  // Load Zoho fixed itineraries list directly from Zoho CRM Products (with real-time cache-busting)
  const handleRefreshZohoFixedItineraries = useCallback(async (isManual = false) => {
    setIsRefreshingFixedItineraries(true);
    try {
      const res = await fetch(`/api/zoho/fixed-itineraries?_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.itineraries)) {
        setZohoFixedItineraries(data.itineraries);
        if (isManual) {
          setZohoFixedMsg({
            type: 'success',
            text: `Synced ${data.itineraries.length} itineraries from Zoho CRM Products!`
          });
          setTimeout(() => setZohoFixedMsg(null), 4000);
        }
      }
    } catch (err) {
      console.warn('Failed to load Zoho fixed itineraries list:', err);
      if (isManual) {
        setZohoFixedMsg({
          type: 'error',
          text: 'Failed to sync with Zoho CRM. Please try again.'
        });
      }
    } finally {
      setIsRefreshingFixedItineraries(false);
    }
  }, []);

  // Auto connect to Zoho CRM Master Modules on mount & auto-sync fixed itineraries list
  useEffect(() => {
    handleFetchZohoMasterData();
    handleRefreshZohoFixedItineraries();

    // Auto-fetch fresh itineraries from Zoho CRM whenever user switches back to this browser tab!
    const handleWindowFocus = () => {
      handleRefreshZohoFixedItineraries();
    };
    window.addEventListener('focus', handleWindowFocus);

    // Auto-sync every 60 seconds
    const intervalId = setInterval(() => {
      handleRefreshZohoFixedItineraries();
    }, 60000);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      clearInterval(intervalId);
    };
  }, [handleRefreshZohoFixedItineraries]);

  // Apply Zoho Fixed Itinerary Template into Grid
  const handleApplyZohoFixedItinerary = async (idToUse?: string) => {
    const id = idToUse || selectedFixedItineraryId;
    if (!id) return;
    setLoadingZohoFixed(true);
    setZohoFixedMsg(null);
    try {
      const res = await fetch(`/api/zoho/fixed-itineraries?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.itinerary) {
        throw new Error(data.error || 'Failed to fetch itinerary from Zoho CRM');
      }
      const itin = data.itinerary;
      if (itin.destination) {
        setDestination(itin.destination);
      }
      if (itin.destinationType) {
        setDestinationType(itin.destinationType);
      }
      if (itin.noOfDays) {
        setNoOfDays(itin.noOfDays);
      }
      if (itin.noOfNights) {
        setNoOfNights(itin.noOfNights);
      }
      const effNts = itin.noOfNights || (itin.noOfDays > 1 ? itin.noOfDays - 1 : 1);
      if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        setEndDate(addDaysToDateStr(startDate, effNts));
        setHotels(prev => computeHotelStayDates(startDate, prev));
      }

      if (Array.isArray(itin.dayRows) && itin.dayRows.length > 0) {
        // Auto-match activity per-person cost and auto-fill descriptions from catalog if available
        const updatedRows = itin.dayRows.map((r: any) => {
          const cClean = (r.city || itin.destination || destination).trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const cityLookup = sheetExpByCity[cClean] || [];
          const exps = Array.isArray(r.experiences) && r.experiences.length >= 4
            ? r.experiences
            : [...(Array.isArray(r.experiences) ? r.experiences : []), '', '', '', ''].slice(0, 4);
          const descs = Array.isArray(r.descriptions) && r.descriptions.length >= 4
            ? r.descriptions
            : [...(Array.isArray(r.descriptions) ? r.descriptions : []), '', '', '', ''].slice(0, 4);
          const optExps = Array.isArray(r.optionalExperiences) && r.optionalExperiences.length >= 2
            ? r.optionalExperiences
            : [...(Array.isArray(r.optionalExperiences) ? r.optionalExperiences : []), '', ''].slice(0, 2);
          const optDescs = Array.isArray(r.optionalDescriptions) && r.optionalDescriptions.length >= 2
            ? r.optionalDescriptions
            : [...(Array.isArray(r.optionalDescriptions) ? r.optionalDescriptions : []), '', ''].slice(0, 2);

          const rawEnRoute = r.enRouteExperiences || r.enRouteSpots;
          const enRouteExperiences = Array.isArray(rawEnRoute) && rawEnRoute.length > 0 ? rawEnRoute : [''];

          // Auto-resolve costs (SIC vs Private divided among adults + kids > 3 yrs)
          const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
          const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
          const privCosts: number[] = [];
          const costs = exps.map((expName: string) => {
            if (!expName) {
              privCosts.push(0);
              return 0;
            }
            const found = findExperienceInCatalogs(expName, r.city, r.city2);
            const sicA = Number(found?.sicAdult ?? found?.Cost_Per_Person) || 0;
            const priv = Number(found?.privateCost ?? found?.Private_Cost) || 0;
            if (sicA > 0) {
              privCosts.push(0);
              return sicA;
            }
            if (priv > 0) {
              privCosts.push(priv);
              return Math.round(priv / eligiblePax);
            }
            privCosts.push(0);
            return Number(found?.ppCost) || 0;
          });

          // Auto-resolve descriptions from catalog if missing
          const resolvedDescs = exps.map((expName: string, i: number) => {
            if (!expName) return '';
            if (descs[i] && descs[i].trim()) return descs[i].trim();
            const found = findExperienceInCatalogs(expName, r.city, r.city2);
            return found?.description || found?.templateDescription || '';
          });

          const resolvedOptDescs = optExps.map((optName: string, i: number) => {
            if (!optName) return '';
            if (optDescs[i] && optDescs[i].trim()) return optDescs[i].trim();
            const found = findExperienceInCatalogs(optName, r.city, r.city2);
            return found?.description || found?.templateDescription || '';
          });

          return {
            dayNumber: r.dayNumber || 1,
            dayText: r.dayText || `Day ${r.dayNumber || 1}`,
            guidedTour: Boolean(r.guidedTour),
            city: r.city || '',
            city2: r.city2 || '',
            enRouteExperiences,
            experiences: exps,
            descriptions: resolvedDescs,
            optionalExperiences: optExps,
            optionalDescriptions: resolvedOptDescs,
            experienceCosts: costs,
            experiencePrivateCosts: privCosts,
            optionalExperienceCosts: [0, 0],
            optionalExperiencePrivateCosts: [0, 0]
          };
        });
        setDayRows(updatedRows);
        setIsQuoteManuallyEdited(false);

        // Also suggest hotel stays according to City 2 in the itinerary
        setIsHotelsManuallyCustomized(false);
        const derivedHotels = deriveHotelsFromDayRows(updatedRows, itin.noOfNights || noOfNights, masterHotelCategory);
        if (derivedHotels.length > 0) {
          setHotels(derivedHotels);
        }
      }

      setZohoFixedMsg({
        type: 'success',
        text: `✓ Loaded "${itin.name}" (${itin.dayRows?.length || itin.noOfDays} Days) directly into the grid!`
      });
    } catch (err: any) {
      setZohoFixedMsg({
        type: 'error',
        text: `⚠ ${err.message || 'Error loading fixed itinerary'}`
      });
    } finally {
      setLoadingZohoFixed(false);
    }
  };

  // Sync dayRows count when noOfDays changes (with optional auto-update of End Date)
  const handleDaysCountChange = (newCount: number, autoUpdateEndDate = true) => {
    const count = Math.max(1, newCount);
    setNoOfDays(count);
    const nights = count > 1 ? count - 1 : 1;
    setNoOfNights(nights);

    if (autoUpdateEndDate && startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const newEnd = addDaysToDateStr(startDate, nights);
      setEndDate(newEnd);
      setHotels(prev => computeHotelStayDates(startDate, prev));
    }

    setDayRows(prev => {
      if (prev.length === count) return prev;
      if (prev.length < count) {
        const added: TableDayRow[] = [];
        const defaultCity = availableCitiesForDestination[0] || destination;
        for (let i = prev.length + 1; i <= count; i++) {
          added.push(createInitialDayRow(i, defaultCity));
        }
        return [...prev, ...added];
      }
      return prev.slice(0, count);
    });
  };

  // Handle Start Date Change: keeps days/nights in sync and shifts end date & hotel stay dates
  const handleStartDateChange = (newStart: string) => {
    setStartDate(newStart);
    if (newStart && /^\d{4}-\d{2}-\d{2}$/.test(newStart)) {
      const nights = Number(noOfNights) > 0 ? Number(noOfNights) : (Number(noOfDays) > 1 ? Number(noOfDays) - 1 : 1);
      const computedEnd = addDaysToDateStr(newStart, nights);
      setEndDate(computedEnd);
      setHotels(prev => computeHotelStayDates(newStart, prev));
    }
  };

  // Handle End Date Change: calculates new duration, updates days, nights, dayRows, and hotel stay dates
  const handleEndDateChange = (newEnd: string) => {
    setEndDate(newEnd);
    if (newEnd && startDate && /^\d{4}-\d{2}-\d{2}$/.test(newEnd) && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const res = calcDaysBetween(startDate, newEnd);
      if (res && res.days > 0) {
        setNoOfDays(res.days);
        setNoOfNights(res.nights);
        handleDaysCountChange(res.days, false);
        setHotels(prev => computeHotelStayDates(startDate, prev));
      }
    }
  };

  // Handle Nights Count Change: updates nights, days, dayRows, and adjusts End Date
  const handleNightsCountChange = (newNights: number) => {
    const nights = Math.max(1, newNights);
    setNoOfNights(nights);
    const days = nights + 1;
    setNoOfDays(days);

    if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const newEnd = addDaysToDateStr(startDate, nights);
      setEndDate(newEnd);
      setHotels(prev => computeHotelStayDates(startDate, prev));
    }

    handleDaysCountChange(days, false);
  };

  // Handle Kids count change & automatically open child details modal when kids > 0
  const handleKidsCountChange = (newCount: number) => {
    const count = Math.max(0, newCount);
    setKids(count);

    let updatedKids: ChildDetail[] = [];
    if (count > 0) {
      setKidsDetails(prev => {
        const updated: ChildDetail[] = [];
        for (let i = 1; i <= count; i++) {
          const existing = prev.find(k => k.childNumber === i);
          if (existing) {
            updated.push(existing);
          } else {
            updated.push({
              childNumber: i,
              age: '',
              bedPreference: 'Without Bed'
            });
          }
        }
        updatedKids = updated;
        return updated;
      });
      setIsKidsModalOpen(true);
    } else {
      setKidsDetails([]);
      setIsKidsModalOpen(false);
    }

    if (!isRoomsManuallySet) {
      setRoomsCount(calculateRecommendedRooms(adults, count, sharingType, updatedKids));
    }
  };

  const updateChildDetail = (childNumber: number, field: 'age' | 'bedPreference', value: any) => {
    setKidsDetails(prev => {
      const updated = prev.map(c => (c.childNumber === childNumber ? { ...c, [field]: value } : c));
      if (!isRoomsManuallySet && field === 'bedPreference') {
        setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, updated));
      }
      return updated;
    });
  };

  const setAllBedPreferences = (pref: 'With Bed' | 'Without Bed' | 'Crib') => {
    setKidsDetails(prev => {
      const updated = prev.map(c => ({ ...c, bedPreference: pref }));
      if (!isRoomsManuallySet) {
        setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, updated));
      }
      return updated;
    });
  };

  // One-click Auto-fill descriptions for any experiences in the grid that are missing descriptions
  const handleAutoFillAllDescriptions = () => {
    setDayRows(prev =>
      prev.map(row => {
        const updatedDescs = [...row.descriptions];
        row.experiences.forEach((expName, idx) => {
          if (expName && (!updatedDescs[idx] || !updatedDescs[idx].trim())) {
            const found = findExperienceInCatalogs(expName, row.city, row.city2);
            if (found?.description || found?.templateDescription) {
              updatedDescs[idx] = found.description || found.templateDescription;
            }
          }
        });

        const updatedOptDescs = [...row.optionalDescriptions];
        row.optionalExperiences.forEach((optName, idx) => {
          if (optName && (!updatedOptDescs[idx] || !updatedOptDescs[idx].trim())) {
            const found = findExperienceInCatalogs(optName, row.city, row.city2);
            if (found?.description || found?.templateDescription) {
              updatedOptDescs[idx] = found.description || found.templateDescription;
            }
          }
        });

        return {
          ...row,
          descriptions: updatedDescs,
          optionalDescriptions: updatedOptDescs
        };
      })
    );
  };

  // Apply live calculated quote into form inputs
  const handleApplyCalculatedQuote = () => {
    setIsQuoteManuallyEdited(false);
    setBaseQuotation(String(quotationCalculations.calculatedBase));
    setFinalQuotation(String(quotationCalculations.calculatedFinalQuote));
    setPerAdultPrice(String(quotationCalculations.calculatedPerAdult));
    if (kids > 0) {
      setPerKidPrice(String(quotationCalculations.calculatedPerKid));
    } else {
      setPerKidPrice('');
    }
    const adv = Number(advanceAmount) || 0;
    setBalanceAmount(String(Math.max(0, quotationCalculations.calculatedFinalQuote - adv)));
  };

  // Select Experience (Auto-fills Description and records ppCost from sheet)
  const handleSelectExperience = (dayIdx: number, expIdx: number, expName: string, meta?: any) => {
    setIsQuoteManuallyEdited(false);
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const exps = [...row.experiences];
      const descs = [...row.descriptions];
      const costs = [...row.experienceCosts];
      const privCosts = [...(row.experiencePrivateCosts || [0, 0, 0, 0])];

      exps[expIdx] = expName;
      const found = (meta && (meta.description !== undefined || meta.privateCost !== undefined || meta.sicAdult !== undefined))
        ? meta
        : findExperienceInCatalogs(expName, row.city, row.city2);

      if (found?.description || found?.templateDescription) {
        descs[expIdx] = found.description || found.templateDescription;
      }

      // Cost calculation: SIC vs Private (divided among adults + kids > 3 yrs)
      const sicA = Number(found?.sicAdult ?? found?.Cost_Per_Person) || 0;
      const sicC = Number(found?.sicChild ?? found?.Cost_per_child) || 0;
      const priv = Number(found?.privateCost ?? found?.Private_Cost) || 0;

      if (sicA > 0 || sicC > 0) {
        costs[expIdx] = sicA;
        privCosts[expIdx] = 0;
      } else if (priv > 0) {
        const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
        const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
        costs[expIdx] = Math.round(priv / eligiblePax);
        privCosts[expIdx] = priv;
      } else {
        costs[expIdx] = Number(meta?.ppCost) || 0;
        privCosts[expIdx] = 0;
      }

      row.experiences = exps;
      row.descriptions = descs;
      row.experienceCosts = costs;
      row.experiencePrivateCosts = privCosts;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Select Optional Experience
  const handleSelectOptionalExperience = (dayIdx: number, optIdx: number, optName: string, meta?: any) => {
    setIsQuoteManuallyEdited(false);
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const opts = [...row.optionalExperiences];
      const descs = [...row.optionalDescriptions];
      const costs = [...row.optionalExperienceCosts];
      const privCosts = [...(row.optionalExperiencePrivateCosts || [0, 0])];

      opts[optIdx] = optName;
      const found = (meta && (meta.description !== undefined || meta.privateCost !== undefined || meta.sicAdult !== undefined))
        ? meta
        : findExperienceInCatalogs(optName, row.city, row.city2);

      if (found?.description || found?.templateDescription) {
        descs[optIdx] = found.description || found.templateDescription;
      }

      const sicA = Number(found?.sicAdult ?? found?.Cost_Per_Person) || 0;
      const sicC = Number(found?.sicChild ?? found?.Cost_per_child) || 0;
      const priv = Number(found?.privateCost ?? found?.Private_Cost) || 0;

      if (sicA > 0 || sicC > 0) {
        costs[optIdx] = sicA;
        privCosts[optIdx] = 0;
      } else if (priv > 0) {
        const kidsAbove3 = (kidsDetails || []).filter(k => (Number(k.age) || 0) > 3).length;
        const eligiblePax = Math.max(1, (Number(adults) || 2) + kidsAbove3);
        costs[optIdx] = Math.round(priv / eligiblePax);
        privCosts[optIdx] = priv;
      } else {
        costs[optIdx] = Number(meta?.ppCost) || 0;
        privCosts[optIdx] = 0;
      }

      row.optionalExperiences = opts;
      row.optionalDescriptions = descs;
      row.optionalExperienceCosts = costs;
      row.optionalExperiencePrivateCosts = privCosts;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Update a single field on a day row
  const updateDayField = (dayIdx: number, field: keyof TableDayRow, value: any) => {
    setDayRows(prev => {
      const updated = [...prev];
      updated[dayIdx] = { ...updated[dayIdx], [field]: value };
      return updated;
    });
  };

  // Add a new day row to the itinerary
  const addDay = () => {
    const nextDayNum = dayRows.length + 1;
    const defaultCity = availableCitiesForDestination[0] || destination;
    setDayRows(prev => [...prev, createInitialDayRow(nextDayNum, defaultCity)]);
    setNoOfDays(nextDayNum);
    const nights = nextDayNum > 1 ? nextDayNum - 1 : 1;
    setNoOfNights(nights);

    if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const newEnd = addDaysToDateStr(startDate, nights);
      setEndDate(newEnd);
      setHotels(prev => computeHotelStayDates(startDate, prev));
    }
  };

  // Remove a day row from the itinerary
  const removeDay = (dayIdx: number) => {
    if (dayRows.length <= 1) return;
    const newCount = dayRows.length - 1;
    setDayRows(prev => {
      const filtered = prev.filter((_, idx) => idx !== dayIdx);
      return filtered.map((row, idx) => ({
        ...row,
        dayNumber: idx + 1,
        dayText: `Day ${idx + 1}`
      }));
    });
    setNoOfDays(newCount);
    const nights = newCount > 1 ? newCount - 1 : 1;
    setNoOfNights(nights);

    if (startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      const newEnd = addDaysToDateStr(startDate, nights);
      setEndDate(newEnd);
      setHotels(prev => computeHotelStayDates(startDate, prev));
    }
  };

  // Add multiple en-route spots for a day
  const addEnRouteSpot = (dayIdx: number) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      row.enRouteExperiences = [...row.enRouteExperiences, ''];
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateEnRouteSpot = (dayIdx: number, spotIdx: number, val: string) => {
    setIsQuoteManuallyEdited(false);
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const spots = [...row.enRouteExperiences];
      spots[spotIdx] = val;
      row.enRouteExperiences = spots;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Add extra experience spot beyond 4
  const addExtraExperienceSpot = (dayIdx: number) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      row.experiences = [...row.experiences, ''];
      row.descriptions = [...row.descriptions, ''];
      row.experienceCosts = [...row.experienceCosts, 0];
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateDescriptionText = (dayIdx: number, descIdx: number, val: string) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const descs = [...row.descriptions];
      descs[descIdx] = val;
      row.descriptions = descs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  const updateOptionalDescriptionText = (dayIdx: number, descIdx: number, val: string) => {
    setDayRows(prev => {
      const updated = [...prev];
      const row = { ...updated[dayIdx] };
      const descs = [...row.optionalDescriptions];
      descs[descIdx] = val;
      row.optionalDescriptions = descs;
      updated[dayIdx] = row;
      return updated;
    });
  };

  // Handle Master Hotel Category Change (updates all hotel rows)
  const handleMasterHotelCategoryChange = (cat: string) => {
    setMasterHotelCategory(cat);
    setHotels(prev =>
      prev.map(h => {
        const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const sheetHotels = sheetHotelsByCity[cClean] || [];
        const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === String(h.hotelName || '').toLowerCase().trim());
        const isMatch = foundHotel ? matchesHotelCategory(foundHotel.category, cat) : true;
        const rates = isMatch && foundHotel ? getHotelRates(foundHotel, cat, h.roomCategory) : { baseRate: 0, extraBedRate: 0, childWithoutBedRate: 0 };
        return {
          ...h,
          category: cat,
          hotelName: isMatch ? h.hotelName : '',
          roomCategory: isMatch ? h.roomCategory : '',
          basePrice: isMatch ? rates.baseRate : 0,
          extraBedPrice: isMatch ? rates.extraBedRate : 0,
          childWithoutBedPrice: isMatch ? rates.childWithoutBedRate : 0
        };
      })
    );
  };

  // Hotels helpers
  const addHotel = () => {
    if (hotels.length >= 6) return;
    setIsHotelsManuallyCustomized(true);
    const defaultCity = availableCitiesForDestination[0] || destination;
    setHotels([
      ...hotels,
      {
        index: hotels.length + 1,
        hotelName: '',
        city: defaultCity,
        nights: 1,
        roomCategory: '',
        category: masterHotelCategory || 'Deluxe',
        stayDates: '',
        basePrice: 0,
        extraBedPrice: 0,
        childWithoutBedPrice: 0
      }
    ]);
  };

  const removeHotel = (index: number) => {
    setIsHotelsManuallyCustomized(true);
    const filtered = hotels.filter((_, i) => i !== index);
    setHotels(filtered.map((h, i) => ({ ...h, index: i + 1 })));
  };

  const updateHotel = (index: number, field: keyof HotelItem, value: any, meta?: any) => {
    if (field === 'nights' || field === 'city') {
      setIsHotelsManuallyCustomized(true);
    }
    setHotels(prev => {
      const updated = [...prev];
      const h = { ...updated[index], [field]: value };

      if (field === 'city') {
        // If city changes, clear previously selected hotel from former city
        h.hotelName = '';
        h.roomCategory = '';
        h.basePrice = 0;
        h.extraBedPrice = 0;
        h.childWithoutBedPrice = 0;
      }

      if (field === 'hotelName') {
        if (!value || !String(value).trim()) {
          h.hotelName = '';
          h.roomCategory = '';
          h.basePrice = 0;
          h.extraBedPrice = 0;
          h.childWithoutBedPrice = 0;
        } else {
          const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
          const sheetHotels = sheetHotelsByCity[cClean] || [];
          const foundHotel = meta?.hotelName 
            ? meta 
            : sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === String(value || '').toLowerCase().trim());

          if (foundHotel && Array.isArray(foundHotel.rooms) && foundHotel.rooms.length > 0) {
            // Pick lowest base price room where Base Price > 0
            const withPrice = foundHotel.rooms.filter((r: any) => Number(r.basePrice || r.Base_Price || r.Base_Price_INR) > 0);
            const pool = withPrice.length > 0 ? withPrice : foundHotel.rooms;
            const sorted = [...pool].sort((a: any, b: any) => 
              (Number(a.basePrice || a.Base_Price || a.Base_Price_INR) || 0) - (Number(b.basePrice || b.Base_Price || b.Base_Price_INR) || 0)
            );
            const lowest = sorted[0];
            h.roomCategory = lowest.roomCategory;
            // STRICTLY from Base Price column
            h.basePrice = Number(lowest.basePrice || lowest.Base_Price || lowest.Base_Price_INR) || 0;
            h.extraBedPrice = Number(lowest.extraBedPrice || lowest.Extra_Bed || lowest.Extra_Bed_INR) || 0;
            h.childWithoutBedPrice = Number(lowest.childWithoutBed) || 0;
          } else {
            h.roomCategory = '';
            h.basePrice = 0;
            h.extraBedPrice = 0;
            h.childWithoutBedPrice = 0;
          }
        }
      }

      if (field === 'roomCategory') {
        const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const sheetHotels = sheetHotelsByCity[cClean] || [];
        const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === String(h.hotelName || '').toLowerCase().trim());
        const selectedRoom = (meta && (meta.basePrice !== undefined || meta.Base_Price !== undefined))
          ? meta
          : (foundHotel?.rooms || []).find((r: any) => String(r.roomCategory || '').toLowerCase().trim() === String(value || '').toLowerCase().trim());

        if (selectedRoom) {
          h.roomCategory = selectedRoom.roomCategory || value;
          // STRICTLY from Base Price column
          h.basePrice = Number(selectedRoom.basePrice || selectedRoom.Base_Price || selectedRoom.Base_Price_INR) || 0;
          h.extraBedPrice = Number(selectedRoom.extraBedPrice || selectedRoom.Extra_Bed || selectedRoom.Extra_Bed_INR) || 0;
          h.childWithoutBedPrice = Number(selectedRoom.childWithoutBed) || 0;
        } else {
          h.roomCategory = value;
          h.basePrice = 0;
          h.extraBedPrice = 0;
          h.childWithoutBedPrice = 0;
        }
      }

      if (field === 'category') {
        const cClean = (h.city || destination || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        const sheetHotels = sheetHotelsByCity[cClean] || [];
        const foundHotel = sheetHotels.find((sh: any) => (sh.hotelName || '').toLowerCase().trim() === String(h.hotelName || '').toLowerCase().trim());
        
        if (foundHotel && !matchesHotelCategory(foundHotel.category, value)) {
          // If selected hotel does not belong to the new category, clear it completely
          h.hotelName = '';
          h.roomCategory = '';
          h.basePrice = 0;
          h.extraBedPrice = 0;
          h.childWithoutBedPrice = 0;
        } else if (foundHotel) {
          const rates = getHotelRates(foundHotel, value, h.roomCategory);
          h.basePrice = rates.baseRate;
          h.extraBedPrice = rates.extraBedRate;
          h.childWithoutBedPrice = rates.childWithoutBedRate;
        } else {
          h.hotelName = '';
          h.roomCategory = '';
          h.basePrice = 0;
          h.extraBedPrice = 0;
          h.childWithoutBedPrice = 0;
        }
      }

      updated[index] = h;
      if (startDate && field === 'nights') {
        return computeHotelStayDates(startDate, updated);
      }
      return updated;
    });
  };

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d && typeof d === 'object') {
          if (d.zohoInquiryInput) setZohoInquiryInput(d.zohoInquiryInput);
          if (d.inquiryId) setInquiryId(d.inquiryId);
          if (d.firstName) setFirstName(d.firstName);
          if (d.lastName) setLastName(d.lastName);
          if (d.fullName) setFullName(d.fullName);
          if (d.email) setEmail(d.email);
          if (d.mobile) setMobile(d.mobile);
          if (d.departureCity) setDepartureCity(d.departureCity);
          if (d.destination) setDestination(d.destination);
          if (d.destinationType) setDestinationType(d.destinationType);
          if (d.startDate) setStartDate(d.startDate);
          if (d.endDate) setEndDate(d.endDate);
          if (d.noOfDays) setNoOfDays(d.noOfDays);
          if (d.noOfNights) setNoOfNights(d.noOfNights);
          if (d.adults) setAdults(d.adults);
          if (d.kids !== undefined) setKids(d.kids);
          if (Array.isArray(d.kidsDetails)) setKidsDetails(d.kidsDetails);
          if (d.roomsCount) setRoomsCount(d.roomsCount);
          if (d.isRoomsManuallySet !== undefined) setIsRoomsManuallySet(d.isRoomsManuallySet);
          if (d.sharingType) setSharingType(d.sharingType);
          if (d.travelStyle) setTravelStyle(d.travelStyle);
          if (d.vehicleType) setVehicleType(d.vehicleType);
          if (d.mealPlan) setMealPlan(d.mealPlan);
          if (d.masterHotelCategory) setMasterHotelCategory(d.masterHotelCategory);
          if (Array.isArray(d.hotels) && d.hotels.length > 0) {
            const sanitizedHotels = d.hotels.map((h: any) => {
              const hasHotel = Boolean(h.hotelName && h.hotelName.trim() && h.hotelName.toLowerCase() !== 'hotel');
              return {
                ...h,
                hotelName: hasHotel ? h.hotelName : '',
                roomCategory: hasHotel ? h.roomCategory : '',
                basePrice: hasHotel ? (Number(h.basePrice) || 0) : 0,
                extraBedPrice: hasHotel ? (Number(h.extraBedPrice) || 0) : 0,
                childWithoutBedPrice: hasHotel ? (Number(h.childWithoutBedPrice) || 0) : 0
              };
            });
            setHotels(sanitizedHotels);
          }
          if (d.isHotelsManuallyCustomized !== undefined) setIsHotelsManuallyCustomized(d.isHotelsManuallyCustomized);
          if (Array.isArray(d.dayRows) && d.dayRows.length > 0) setDayRows(d.dayRows);
          if (d.baseQuotation) setBaseQuotation(d.baseQuotation);
          if (d.marginPercent) setMarginPercent(d.marginPercent);
          if (d.finalQuotation) setFinalQuotation(d.finalQuotation);
          if (d.perAdultPrice) setPerAdultPrice(d.perAdultPrice);
          if (d.perKidPrice) setPerKidPrice(d.perKidPrice);
          if (d.advanceAmount) setAdvanceAmount(d.advanceAmount);
          if (d.balanceAmount) setBalanceAmount(d.balanceAmount);
          if (d.specialRequirements) setSpecialRequirements(d.specialRequirements);
          if (Array.isArray(d.inclusions) && d.inclusions.length > 0) setInclusions(d.inclusions);
          if (Array.isArray(d.exclusions) && d.exclusions.length > 0) setExclusions(d.exclusions);
          if (d.isCustomInclusionsEdited !== undefined) setIsCustomInclusionsEdited(d.isCustomInclusionsEdited);
          if (d.isQuoteManuallyEdited !== undefined) setIsQuoteManuallyEdited(d.isQuoteManuallyEdited);
          if (d.zohoSyncMsg) setZohoSyncMsg(d.zohoSyncMsg);
          setHasSavedDraft(true);
        }
      }
    } catch (e) {
      console.warn('Draft restore failed', e);
    } finally {
      setIsDraftRestored(true);
    }
  }, []);

  // Auto-save draft to localStorage whenever form data changes
  useEffect(() => {
    if (!isDraftRestored) return;
    const timeout = setTimeout(() => {
      try {
        const draft = {
          zohoInquiryInput,
          inquiryId,
          firstName,
          lastName,
          fullName,
          email,
          mobile,
          departureCity,
          destination,
          destinationType,
          startDate,
          endDate,
          noOfDays,
          noOfNights,
          adults,
          kids,
          kidsDetails,
          roomsCount,
          isRoomsManuallySet,
          sharingType,
          travelStyle,
          vehicleType,
          mealPlan,
          masterHotelCategory,
          hotels,
          isHotelsManuallyCustomized,
          dayRows,
          baseQuotation,
          marginPercent,
          finalQuotation,
          perAdultPrice,
          perKidPrice,
          advanceAmount,
          balanceAmount,
          specialRequirements,
          inclusions,
          exclusions,
          isCustomInclusionsEdited,
          isQuoteManuallyEdited,
          zohoSyncMsg,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        setHasSavedDraft(true);
      } catch (e) {
        console.warn('Auto-save failed', e);
      }
    }, 600);

    return () => clearTimeout(timeout);
  }, [
    isDraftRestored,
    zohoInquiryInput,
    inquiryId,
    firstName,
    lastName,
    fullName,
    email,
    mobile,
    departureCity,
    destination,
    destinationType,
    startDate,
    endDate,
    noOfDays,
    noOfNights,
    adults,
    kids,
    kidsDetails,
    roomsCount,
    isRoomsManuallySet,
    sharingType,
    travelStyle,
    vehicleType,
    mealPlan,
    masterHotelCategory,
    hotels,
    isHotelsManuallyCustomized,
    dayRows,
    baseQuotation,
    marginPercent,
    finalQuotation,
    perAdultPrice,
    perKidPrice,
    advanceAmount,
    balanceAmount,
    specialRequirements,
    inclusions,
    exclusions,
    isCustomInclusionsEdited,
    isQuoteManuallyEdited,
    zohoSyncMsg
  ]);

  // Handle Reset / Fresh Form button click
  const handleResetForm = () => {
    if (window.confirm('Reset this itinerary to fresh blank state? Unsaved changes will be cleared.')) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch (e) {}
      window.location.reload();
    }
  };
  const handleMarginChange = (val: string) => {
    setMarginPercent(val);
    const base = Number(baseQuotation) || 0;
    if (!val || isNaN(Number(val)) || base <= 0) {
      setFinalQuotation(baseQuotation);
      return;
    }
    const finalVal = Math.round(base * (1 + Number(val) / 100));
    setFinalQuotation(String(finalVal));
  };

  // Generate Itinerary
  const handleGenerateItinerary = async () => {
    if (!destination.trim()) {
      setGenError('Destination is required.');
      return;
    }
    setGenerating(true);
    setGenError(null);
    setGenSuccess(null);

    // Prepare day activities with rich descriptions and cost details
    const preparedDayActivities = dayRows.map(d => {
      const allExperiences: any[] = [];
      (d.experiences || []).forEach((expName, idx) => {
        if (expName && expName.trim()) {
          allExperiences.push({
            name: expName.trim(),
            description: (d.descriptions[idx] || '').trim(),
            ppCost: d.experienceCosts[idx] || 0,
            guidedTour: d.guidedTour
          });
        }
      });

      const allOptional: any[] = [];
      (d.optionalExperiences || []).forEach((optName, idx) => {
        if (optName && optName.trim()) {
          allOptional.push({
            name: optName.trim(),
            description: (d.optionalDescriptions[idx] || '').trim(),
            ppCost: d.optionalExperienceCosts[idx] || 0
          });
        }
      });

      return {
        dayNumber: d.dayNumber,
        dayText: d.dayText,
        city: d.city,
        city2: d.city2 || undefined,
        guidedTour: d.guidedTour,
        enRouteExperiences: d.enRouteExperiences.filter(Boolean).join(', ') || undefined,
        experiences: allExperiences,
        optionalExperiences: allOptional
      };
    });

    const payload = {
      inquiryId: inquiryId || `GS-${Date.now().toString().slice(-6)}`,
      zohoLeadId: zohoLeadId || undefined,
      firstName,
      lastName,
      fullName: fullName || `${firstName} ${lastName}`.trim() || 'Valued Guest',
      email,
      mobile,
      departureCity,
      destination,
      destinationType,
      startDate,
      endDate,
      noOfDays: Number(noOfDays) || dayRows.length,
      noOfNights: Number(noOfNights) || (dayRows.length > 1 ? dayRows.length - 1 : 1),
      adults: Number(adults) || 2,
      kids: Number(kids) || 0,
      kidsDetails: kidsDetails.slice(0, Number(kids) || 0),
      childrenDetails: kidsDetails.slice(0, Number(kids) || 0),
      roomsCount: Number(roomsCount) || 1,
      sharingType,
      travelStyle,
      tripType: 'Customised Trip',
      vehicleType,
      mealPlan,
      hotels: hotels.filter(h => h.hotelName.trim().length > 0),
      dayActivities: preparedDayActivities,
      optionNumber: selectedOption,
      baseQuotationAmount: baseQuotation ? Number(baseQuotation) : undefined,
      marginPercentage: marginPercent ? Number(marginPercent) : undefined,
      finalQuotationAmount: finalQuotation ? Number(finalQuotation) : undefined,
      perAdultPrice: perAdultPrice ? Number(perAdultPrice) : undefined,
      perKidPrice: perKidPrice ? Number(perKidPrice) : undefined,
      advanceAmountPaid: advanceAmount ? Number(advanceAmount) : undefined,
      balancePendingAmount: balanceAmount ? Number(balanceAmount) : undefined,
      specialRequirements,
      inclusions: inclusions.map(s => s.trim()).filter(Boolean),
      exclusions: exclusions.map(s => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/sheet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to generate itinerary.');
      setGenSuccess(data);
      if (payload.inquiryId) {
        checkExistingItineraryOptions(payload.inquiryId);
      }
    } catch (err: any) {
      setGenError(err.message || 'Error occurred while generating itinerary.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-orange-500/20"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
    >
      <style>{`
        /* Force standard, clean, highly readable modern sans-serif across all elements */
        html, body, button, input, select, textarea, table, th, td, p, span, h1, h2, h3, h4, h5, h6, label, div {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        /* Completely remove up/down stepper spin buttons across all browsers */
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none !important;
          margin: 0 !important;
        }
        input[type="number"],
        input {
          -moz-appearance: textfield !important;
        }
      `}</style>
      <Navbar />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-30">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-300 text-orange-700 text-xs font-bold tracking-wide uppercase mb-3 shadow-2xs">
              <Layers className="w-4 h-4 text-orange-600" />
              Compact Grid Subform • Live Activities Cost Per Person
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
              Sheet Itinerary Subform Builder
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed font-normal">
              Manage 10-15 day itineraries in a compact spreadsheet subform. City &amp; experiences filter automatically, descriptions load from the sheet, and activity costs calculate per person.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            {hasSavedDraft && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs">
                <Check className="w-3.5 h-3.5" />
                Draft Auto-Saved
              </span>
            )}
            <Button
              onClick={handleResetForm}
              variant="outline"
              size="sm"
              className="h-10 px-4 text-xs border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-900 rounded-xl font-bold flex items-center gap-2 shadow-2xs transition-colors"
              title="Reset all form inputs and clear saved draft"
            >
              <RotateCcw className="w-4 h-4 text-red-600" />
              Reset / Fresh Form
            </Button>
          </div>
        </div>

        {/* SECTION 1: TRAVELER & CLIENT DETAILS */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                1. Traveler &amp; Client Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Client details are kept separate. You can enter manually or sync from Zoho.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-300">
              <Input
                type="text"
                placeholder="Zoho Inquiry ID..."
                value={zohoInquiryInput}
                onChange={e => setZohoInquiryInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleFetchFromZoho();
                  }
                }}
                className="h-8 bg-white border border-slate-400 text-xs w-40 text-slate-900 placeholder:text-slate-500 font-medium focus-visible:ring-orange-500"
              />
              <Button
                onClick={handleFetchFromZoho}
                disabled={fetchingZoho}
                variant="outline"
                size="sm"
                className="h-8 text-xs border border-slate-400 text-slate-800 hover:bg-slate-100 hover:text-slate-950 rounded-lg shrink-0 font-bold"
              >
                {fetchingZoho ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Sync from Zoho'}
              </Button>
              <Button
                onClick={handleResetForm}
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg shrink-0 font-bold flex items-center gap-1"
                title="Reset form to fresh state"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            </div>
          </div>

          {zohoSyncMsg && (
            <div className="mb-4 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-50 border border-blue-300 text-blue-800">
              {zohoSyncMsg}
            </div>
          )}

          {/* Existing Itinerary Links Found For This Inquiry */}
          {Object.keys(existingOptions).length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50/90 border border-amber-300 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-950">
                  <Lock className="w-4 h-4 text-amber-700" />
                  Existing Itinerary Option Links for {inquiryId || 'this inquiry'}:
                </div>
                <span className="text-[11px] text-amber-800 font-medium">
                  Already generated options are locked below to avoid accidental overwrite.
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {[1, 2, 3].map(optNum => {
                  const exist = existingOptions[optNum];
                  if (!exist) {
                    return (
                      <div key={optNum} className="p-2.5 rounded-lg bg-white/70 border border-dashed border-slate-300 text-xs flex items-center justify-between text-slate-500">
                        <span className="font-semibold text-slate-600">Option {optNum}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          Available to Create
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={optNum} className="p-2.5 rounded-lg bg-white border border-amber-300 text-xs flex flex-col gap-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-700" />
                          Option {optNum} (Link Exists)
                        </span>
                        {exist.quote && (
                          <span className="text-[11px] font-bold text-orange-600">
                            ₹{exist.quote.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate" title={exist.title}>
                        {exist.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={exist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded text-[11px] font-bold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open Link ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}${exist.url}` : exist.url)}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold border border-slate-200"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Inquiry ID</label>
              <Input
                value={inquiryId}
                onChange={e => setInquiryId(e.target.value)}
                onBlur={e => {
                  const val = e.target.value.trim();
                  if (val) {
                    checkExistingItineraryOptions(val);
                  }
                }}
                placeholder="e.g. INQ-1042"
                className="bg-slate-100 border border-slate-400 text-xs h-10 font-mono font-bold text-orange-600 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Full Client Name</label>
              <Input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Jigna Shah"
                className="bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Mobile / WhatsApp</label>
              <Input
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Departure City</label>
              <Input
                value={departureCity}
                onChange={e => setDepartureCity(e.target.value)}
                placeholder="e.g. Mumbai / Delhi"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={e => handleStartDateChange(e.target.value)}
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={e => handleEndDateChange(e.target.value)}
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Number of Days / Nights</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={noOfDays}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                    handleDaysCountChange(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-orange-600 focus-visible:ring-orange-500"
                  title="Days"
                />
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={noOfNights}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                    handleNightsCountChange(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
                  title="Nights"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Adults / Kids</label>
                {kids > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsKidsModalOpen(true)}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    👶 {kids} {kids === 1 ? 'Child' : 'Kids'} Details
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={adults}
                  onChange={e => {
                    const val = Number(e.target.value.replace(/\D/g, '')) || 0;
                    setAdults(val);
                    if (!isRoomsManuallySet) {
                      setRoomsCount(calculateRecommendedRooms(val, kids, sharingType, kidsDetails));
                    }
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-emerald-800 focus-visible:ring-orange-500"
                  title="Adults"
                  placeholder="2"
                />
                <div className="relative">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={kids}
                    onChange={e => {
                      const val = Number(e.target.value.replace(/\D/g, '')) || 0;
                      handleKidsCountChange(val);
                    }}
                    className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500 pr-14"
                    title="Kids"
                    placeholder="0"
                  />
                  {kids > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsKidsModalOpen(true)}
                      title="Edit Kids Age & Bed Preferences"
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded bg-orange-100 border border-orange-300 text-orange-800 font-bold hover:bg-orange-200 transition-colors"
                    >
                      Age &amp; Bed
                    </button>
                  )}
                </div>
              </div>
              {kids > 0 && kidsDetails.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {kidsDetails.slice(0, kids).map(k => (
                    <span
                      key={k.childNumber}
                      onClick={() => setIsKidsModalOpen(true)}
                      className="cursor-pointer text-[10px] px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-orange-800 font-medium hover:bg-orange-100 transition-colors"
                      title="Click to edit details"
                    >
                      C{k.childNumber}: {k.age ? `${k.age}y` : 'Age?'} • {k.bedPreference === 'With Bed' ? 'Extra Bed' : k.bedPreference === 'Crib' ? 'Crib' : 'No Bed'}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Row 3: Additional Lead Details: Email, Rooms, Sharing, Style */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. client@example.com"
                className="bg-white border border-slate-400 text-xs h-10 font-medium text-slate-900 focus-visible:ring-orange-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-800">Rooms Count</label>
                <span className="text-[10px] text-slate-500 font-medium">
                  {isRoomsManuallySet ? 'Manual' : 'Auto-Calculated'}
                </span>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={roomsCount}
                onChange={e => {
                  const val = Number(e.target.value.replace(/\D/g, '')) || 1;
                  setRoomsCount(val);
                  setIsRoomsManuallySet(true);
                }}
                className="bg-white border border-slate-400 text-xs h-10 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
              />
              {isRoomsManuallySet && (
                <button
                  type="button"
                  onClick={() => {
                    setIsRoomsManuallySet(false);
                    setRoomsCount(calculateRecommendedRooms(adults, kids, sharingType, kidsDetails));
                  }}
                  className="text-[10px] text-orange-600 hover:underline mt-0.5 block font-semibold"
                >
                  ↺ Reset to Auto ({calculateRecommendedRooms(adults, kids, sharingType, kidsDetails)} Rooms)
                </button>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Sharing Type</label>
              <select
                value={sharingType}
                onChange={e => {
                  const s = e.target.value;
                  setSharingType(s);
                  if (!isRoomsManuallySet) {
                    setRoomsCount(calculateRecommendedRooms(adults, kids, s, kidsDetails));
                  }
                }}
                className="w-full bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="Double Sharing">Double Sharing (2 Adults/Room)</option>
                <option value="Triple Sharing">Triple Sharing (3 Adults/Room)</option>
                <option value="Quad Sharing">Quad Sharing (4 Pax/Room)</option>
                <option value="Single Sharing">Single Sharing (1 Adult/Room)</option>
                <option value="Multiple Rooms">Multiple Rooms</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Travel Style</label>
              <select
                value={travelStyle}
                onChange={e => setTravelStyle(e.target.value)}
                className="w-full bg-white border border-slate-400 text-xs h-10 font-semibold text-slate-900 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              >
                <option value="Family Trip">Family Trip</option>
                <option value="Couples / Honeymoon">Couples / Honeymoon</option>
                <option value="Friends Group">Friends Group</option>
                <option value="Solo Traveler">Solo Traveler</option>
                <option value="Corporate / Group">Corporate / Group</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: MASTER DATA & LOOKUP SOURCES (ZOHO CRM / GOOGLE SHEET) */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                2. Master Data &amp; Lookups Catalog
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold uppercase">
                  {dataSource === 'zoho' ? 'Zoho CRM Live Modules' : 'Google Sheet Mode'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Activities, Hotels, Room Rates, and Vehicles are automatically fetched to power all subform dropdowns.
              </p>
            </div>

            {/* Source Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-300 rounded-xl self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setDataSource('zoho');
                  if (!zohoMasterStats) handleFetchZohoMasterData();
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${dataSource === 'zoho'
                    ? 'bg-white text-orange-700 shadow-xs border border-orange-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Database className="w-3.5 h-3.5 text-orange-600" />
                Zoho CRM Modules (Live)
              </button>
              <button
                type="button"
                onClick={() => setDataSource('sheet')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${dataSource === 'sheet'
                    ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                Google Sheet (URL)
              </button>
            </div>
          </div>

          {dataSource === 'zoho' ? (
            /* ZOHO CRM MASTER MODULES PANEL */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-orange-50/70 border border-orange-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-orange-900 block">Activities &amp; Experiences</span>
                    <span className="text-lg font-extrabold text-orange-700 font-mono">
                      {zohoMasterStats?.activitiesCount ?? Object.values(sheetExpByCity).reduce((a, b) => a + (b?.length || 0), 0)}{' '}
                      <span className="text-xs font-normal text-slate-600">Records</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-orange-200 text-orange-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-amber-900 block">Hotel &amp; Room Pricing</span>
                    <span className="text-lg font-extrabold text-amber-700 font-mono">
                      {zohoMasterStats?.hotelsCount ?? Object.values(sheetHotelsByCity).reduce((a, b) => a + (b?.length || 0), 0)}{' '}
                      <span className="text-xs font-normal text-slate-600">Properties</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-900 block">Vehicles &amp; Capacities</span>
                    <span className="text-lg font-extrabold text-emerald-700 font-mono">
                      {zohoVehicles.length || 5}{' '}
                      <span className="text-xs font-normal text-slate-600">Fleets</span>
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold uppercase">
                    Live CRM
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>
                    Directly synced with Zoho CRM modules: <strong>Activities_and_Experiences</strong>, <strong>Hotel</strong>, and <strong>Vehicles</strong>.
                  </span>
                </div>

                <Button
                  onClick={handleFetchZohoMasterData}
                  disabled={loadingZohoMaster}
                  size="sm"
                  className="h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shrink-0 shadow-xs flex items-center justify-center gap-2"
                >
                  {loadingZohoMaster ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Syncing with Zoho...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh Zoho Master Data
                    </>
                  )}
                </Button>
              </div>

              {zohoMasterError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 font-semibold">
                  ⚠ {zohoMasterError}
                </div>
              )}
            </div>
          ) : (
            /* GOOGLE SHEET PANEL */
            <div>
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <Input
                  type="text"
                  placeholder="https://docs.google.com/spreadsheets/d/your-sheet-id/edit"
                  value={sheetUrl}
                  onChange={e => setSheetUrl(e.target.value)}
                  className="bg-white border border-slate-400 text-slate-900 placeholder:text-slate-500 text-sm h-11 font-medium focus-visible:ring-emerald-500 rounded-xl"
                />
                <Button
                  onClick={() => handleFetchSheetData()}
                  disabled={connectingSheet}
                  className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shrink-0 shadow-sm transition-all flex items-center gap-2"
                >
                  {connectingSheet ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading Sheet Lookups...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Refresh Sheet Lookups
                    </>
                  )}
                </Button>
              </div>

              {sheetSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold mb-3">
                  {sheetSuccessMsg}
                </div>
              )}

              {sheetError && (
                <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 mb-3 font-semibold">
                  {sheetError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION 3: DESTINATION & HOTELS CONFIGURATION */}
        <div className="space-y-8">
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-300 pb-3">
              <Compass className="w-4 h-4 text-orange-600" />
              3. Destination &amp; Transport Configuration
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Select Destination (Lookup)
                </label>
                <LookupField
                  value={destination}
                  onChange={val => setDestination(val)}
                  options={destinationOptions}
                  placeholder="Select Destination..."
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Cities in Day Grid will filter based on this!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Hotel Category (All Hotels)
                </label>
                <select
                  value={masterHotelCategory}
                  onChange={e => handleMasterHotelCategoryChange(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-bold text-xs h-9 rounded-md px-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Super Deluxe">Super Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                  <option value="All">All Categories</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Auto-updates category for all hotels below!
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Vehicle / Transport (Zoho CRM)</label>
                <LookupField
                  value={vehicleType}
                  onChange={val => setVehicleType(val)}
                  options={vehicleOptions}
                  placeholder="Select or type vehicle..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Meal Plan</label>
                <select
                  value={mealPlan}
                  onChange={e => handleMealPlanChange(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-medium text-xs h-9 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="Breakfast & Dinner">Breakfast &amp; Dinner (MAPAI)</option>
                  <option value="Breakfast, Lunch & Dinner">Breakfast, Lunch &amp; Dinner (All Meals / APAI)</option>
                  <option value="All Meals">All Meals (Breakfast, Lunch &amp; Dinner)</option>
                  <option value="Breakfast Only">Breakfast Only (CP)</option>
                  <option value="Breakfast & Lunch">Breakfast &amp; Lunch</option>
                  <option value="Room Only">Room Only (EP)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Destination Type</label>
                <select
                  value={destinationType}
                  onChange={e => setDestinationType(e.target.value)}
                  className="w-full bg-white border border-slate-400 text-slate-900 font-medium text-xs h-9 rounded-md px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                >
                  <option value="India">India (Domestic)</option>
                  <option value="International">International</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: HOTELS 1 TO 6 */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-orange-600" />
                  4. Hotel Stays (Categorized by City 2 Night Stays)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Hotel cities and night counts are auto-calculated directly from <strong>City 2</strong> (night stay destination) of each day. You can also customize them manually.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Sync from City 2 Button */}
                <Button
                  type="button"
                  onClick={() => {
                    setIsHotelsManuallyCustomized(false);
                    const derived = deriveHotelsFromDayRows(dayRows, noOfNights, masterHotelCategory);
                    if (derived.length > 0) setHotels(derived);
                  }}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-blue-400 text-blue-700 hover:bg-blue-50 bg-white rounded-xl flex items-center gap-1.5 font-bold shadow-2xs"
                  title="Re-calculate hotel cities and nights based on City 2 of the itinerary"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                  Sync from City 2
                </Button>

                {/* Master Hotel Category Quick Selector */}
                <div className="flex items-center gap-2 bg-orange-50/90 border border-orange-300 px-3 py-1.5 rounded-xl shadow-2xs">
                  <span className="text-xs font-extrabold text-orange-950 whitespace-nowrap flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-orange-600" />
                    Category for All:
                  </span>
                  <select
                    value={masterHotelCategory}
                    onChange={e => handleMasterHotelCategoryChange(e.target.value)}
                    className="bg-white border border-orange-300 text-orange-900 font-extrabold text-xs h-8 rounded-lg px-2.5 shadow-2xs focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Super Deluxe">Super Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Premium">Premium</option>
                    <option value="Luxury">Luxury</option>
                    <option value="All">All Categories</option>
                  </select>
                </div>

                {hotels.length < 6 && (
                  <Button
                    onClick={addHotel}
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border border-orange-400 text-orange-700 hover:bg-orange-50 rounded-xl flex items-center gap-1.5 font-bold shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Hotel
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {hotels.map((h, idx) => {
                const hBreakdown = quotationCalculations.hotelBreakdowns?.find((hb: any) => hb.hotelIndex === idx + 1) || quotationCalculations.hotelBreakdowns?.[idx];
                return (
                  <div key={idx} className="p-4 bg-slate-50/70 border border-slate-300 rounded-xl relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-orange-700 flex items-center gap-1.5">
                          <Hotel className="w-3.5 h-3.5" />
                          Hotel #{idx + 1}
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 font-extrabold">
                            {h.category || masterHotelCategory || 'Deluxe'}
                          </span>
                        </span>
                        {h.stayDates && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-700 font-mono font-semibold">
                            📅 {h.stayDates}
                          </span>
                        )}
                      </div>
                      {hotels.length > 1 && (
                        <button
                          onClick={() => removeHotel(idx)}
                          className="text-slate-500 hover:text-red-600 text-xs p-1"
                          title="Remove Hotel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                      <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          City ({destination})
                        </label>
                        <LookupField
                          value={h.city}
                          onChange={val => updateHotel(idx, 'city', val)}
                          options={availableCitiesForDestination}
                          placeholder="Select City..."
                        />
                      </div>

                      <div className="lg:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Hotel Category
                        </label>
                        <select
                          value={h.category || masterHotelCategory || 'Deluxe'}
                          onChange={e => updateHotel(idx, 'category', e.target.value)}
                          className="w-full bg-white border border-slate-400 text-slate-900 font-bold text-xs h-9 rounded-md px-2.5 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        >
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Super Deluxe">Super Deluxe</option>
                          <option value="Suite">Suite</option>
                          <option value="Premium">Premium</option>
                          <option value="Luxury">Luxury</option>
                          <option value="All">All Categories</option>
                        </select>
                      </div>

                      <div className="lg:col-span-4">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Hotel / Property Name ({h.category || masterHotelCategory || 'Deluxe'})
                        </label>
                        <LookupField
                          value={h.hotelName}
                          onChange={(val, meta) => updateHotel(idx, 'hotelName', val, meta)}
                          options={getHotelsLookupForCity(h.city, h.category)}
                          placeholder={`Select ${h.category || masterHotelCategory} Hotel...`}
                        />
                        {h.hotelName ? (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono">
                            <span className="font-semibold text-slate-500">Rate:</span>
                            <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 font-bold border border-orange-200">
                              Base: ₹{Number(hBreakdown?.matchedRate || h.basePrice || 0).toLocaleString('en-IN')} / Extra Bed: ₹{Number(hBreakdown?.extraBedRate || h.extraBedPrice || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ) : (
                          <div className="mt-1 text-[10px] text-slate-400 font-mono italic">
                            Rate: ₹0 (No hotel selected)
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-3">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Room Category</label>
                        <LookupField
                          value={h.roomCategory}
                          onChange={(val, meta) => updateHotel(idx, 'roomCategory', val, meta)}
                          options={getRoomCategoriesForHotel(h.hotelName, h.city)}
                          placeholder={h.hotelName ? "Select Room Category..." : "Select Hotel first..."}
                        />
                      </div>

                      <div className="lg:col-span-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Nights</label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={h.nights === 0 ? '' : h.nights}
                          onChange={e => {
                            const sanitized = e.target.value.replace(/\D/g, '');
                            updateHotel(idx, 'nights', sanitized === '' ? 1 : Number(sanitized));
                          }}
                          className="bg-white border border-slate-400 text-xs h-9 text-center font-bold text-slate-900 focus-visible:ring-orange-500"
                        />
                      </div>
                    </div>

                    {/* Individual Hotel Cost Breakdown & Total */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                        <span className="font-bold text-slate-700">Cost Calculation:</span>
                        {h.hotelName && Number(hBreakdown?.singleHotelTotal || 0) > 0 ? (
                          <>
                            <span className="bg-white border border-slate-300 px-2 py-0.5 rounded text-slate-800 font-mono">
                              Base: ₹{Number(hBreakdown?.matchedRate || 0).toLocaleString('en-IN')} × {h.nights} Nts × {quotationCalculations.rooms} Rms = <strong>₹{Number(hBreakdown?.hotelRoomTotal || 0).toLocaleString('en-IN')}</strong>
                            </span>
                            {Number(hBreakdown?.extraBedCost || 0) > 0 && (
                              <span className="bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-orange-800 font-mono">
                                Extra Bed: ₹{Number(hBreakdown?.extraBedRate || 0).toLocaleString('en-IN')} × {quotationCalculations.billableExtraBeds} EB × {h.nights} Nts = <strong>₹{Number(hBreakdown?.extraBedCost || 0).toLocaleString('en-IN')}</strong>
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-slate-400 italic font-mono text-[11px]">
                            ₹0 (Select a hotel to calculate cost)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Hotel #{idx + 1} Total:</span>
                        <span className={`text-xs font-black px-2.5 py-1 rounded-md font-mono shadow-2xs ${h.hotelName && Number(hBreakdown?.singleHotelTotal || 0) > 0 ? 'text-emerald-900 bg-emerald-100 border border-emerald-300' : 'text-slate-500 bg-slate-100 border border-slate-200'}`}>
                          ₹{Number(hBreakdown?.singleHotelTotal || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ZOHO FIXED ITINERARY TEMPLATE LOADER */}
          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/90 border border-orange-300 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-orange-500/20">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex flex-wrap items-center gap-2">
                    Load Pre-saved Itinerary from Zoho CRM
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 text-orange-950 font-extrabold uppercase">
                      Zoho Itineraries Module
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRefreshZohoFixedItineraries(true)}
                      disabled={isRefreshingFixedItineraries}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-800 hover:text-orange-950 bg-white hover:bg-orange-100 border border-orange-300 rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-60"
                      title="Fetch latest itineraries created in Zoho CRM Products"
                    >
                      <RefreshCw className={`w-3 h-3 text-orange-600 ${isRefreshingFixedItineraries ? 'animate-spin' : ''}`} />
                      {isRefreshingFixedItineraries ? 'Syncing...' : 'Sync from Zoho'}
                    </button>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Select a fixed itinerary to auto-populate all Days, Cities, Guided Tours, En-route spots, Experiences &amp; Descriptions directly into the grid!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <div className="flex flex-col gap-1">
                  <select
                    value={selectedFixedItineraryId}
                    onChange={e => setSelectedFixedItineraryId(e.target.value)}
                    className="bg-white border border-slate-400 text-slate-900 font-bold text-xs h-10 rounded-xl px-3 min-w-[300px] focus:outline-none focus:border-orange-500 shadow-xs"
                  >
                    <option value="">
                      {filteredZohoFixedItineraries.length > 0
                        ? `-- Select ${destination} Itinerary from Zoho (${filteredZohoFixedItineraries.length}) --`
                        : `-- No itineraries found for ${destination} (Click Show All below) --`}
                    </option>
                    {filteredZohoFixedItineraries.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} {item.destination ? `(${item.destination})` : ''}
                      </option>
                    ))}
                  </select>

                  {/* Filter Status Badge & Toggle */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                    <span>
                      {showAllZohoFixedItineraries
                        ? `Showing all (${zohoFixedItineraries.length})`
                        : `Filtered for ${destination} (${filteredZohoFixedItineraries.length} of ${zohoFixedItineraries.length})`}
                    </span>
                    {zohoFixedItineraries.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAllZohoFixedItineraries(!showAllZohoFixedItineraries)}
                        className="text-orange-600 hover:text-orange-800 font-bold underline cursor-pointer ml-2"
                      >
                        {showAllZohoFixedItineraries ? `Filter strictly for ${destination}` : 'Show All'}
                      </button>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleApplyZohoFixedItinerary()}
                  disabled={!selectedFixedItineraryId || loadingZohoFixed}
                  className="h-10 px-5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  {loadingZohoFixed ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Loading Itinerary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Load Itinerary into Grid
                    </>
                  )}
                </Button>
              </div>
            </div>

            {zohoFixedMsg && (
              <div
                className={`mt-3 p-3 rounded-xl text-xs font-bold flex items-center gap-2 border ${zohoFixedMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-red-50 border-red-300 text-red-700'
                  }`}
              >
                {zohoFixedMsg.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                {zohoFixedMsg.text}
              </div>
            )}
          </div>

          {/* SECTION 5: DAY-WISE ITINERARY GRID SUBFORM (COMPACT SPREADSHEET VIEW) */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            {/* Top Bar with Live Per-Person Cost & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 border-b border-slate-300 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  5. Day-wise Itinerary Grid (Subform Table View)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compact horizontal data-grid. Cities filter for <strong className="text-orange-600">{destination}</strong>. Selecting an experience auto-fills descriptions and per-person costs from the sheet!
                </p>
              </div>

              {/* Live Cost Calculation Badge */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-emerald-50/80 border border-emerald-300 px-4 py-2 rounded-xl flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-600 block font-bold">Activity Cost (Per Person):</span>
                    <span className="text-xs font-extrabold text-slate-900 font-mono">
                      ₹{totalPerPersonActivityCost.toLocaleString('en-IN')} / pax
                    </span>
                  </div>
                  <div className="h-6 w-px bg-emerald-300" />
                  <div>
                    <span className="text-[10px] text-slate-600 block font-bold">Total Activity Cost:</span>
                    <span className="text-xs font-extrabold text-emerald-800 font-mono">
                      ₹{totalActivityCost.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-6 w-px bg-emerald-300" />
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Auto-Added to Quotation</span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleAutoFillAllDescriptions}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-blue-400 text-blue-700 hover:bg-blue-50 bg-white font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                  title="Auto-fill descriptions for all selected experiences from catalog"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Auto-Fill Descriptions
                </Button>

                <Button
                  onClick={addDay}
                  variant="outline"
                  size="sm"
                  className="h-9 text-xs border border-orange-400 text-orange-700 hover:bg-orange-50 bg-white font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Day
                </Button>
              </div>
            </div>

            {/* HORIZONTAL DATA-GRID TABLE */}
            <div className="overflow-x-auto rounded-xl border-2 border-slate-400 bg-white shadow-sm">
              <table className="w-full border-collapse text-left text-xs min-w-[2800px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b-2 border-slate-400 text-xs font-bold uppercase tracking-wider">
                    {/* 1. Days (Sticky Left Column) */}
                    <th className="sticky left-0 z-20 bg-slate-200 px-3.5 py-3 w-28 border-r-2 border-slate-400 text-slate-950 font-extrabold shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)]">
                      Days
                    </th>
                    {/* 2. Guided Tour */}
                    <th className="px-3 py-3 w-28 text-center border-r border-slate-300 text-slate-800 font-bold">
                      Guided Tour
                    </th>
                    {/* 3. City */}
                    <th className="px-3 py-3 w-44 border-r border-slate-300 text-slate-800 font-bold">
                      City
                    </th>
                    {/* 4. En-route Experience */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-slate-800 font-bold">
                      En-route Experience
                    </th>
                    {/* 5. City 2 */}
                    <th className="px-3 py-3 w-44 border-r border-slate-300 text-slate-800 font-bold">
                      City 2
                    </th>
                    {/* 6. Experience 1 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 1
                    </th>
                    {/* 7. Experience 2 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 2
                    </th>
                    {/* 8. Experience 3 */}
                    <th className="px-3 py-3 w-56 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 3
                    </th>
                    {/* 9. Experience 4 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-blue-900 font-extrabold">
                      Experience 4 (+)
                    </th>
                    {/* 10. Optional Experience 1 */}
                    <th className="px-3 py-3 w-52 border-r border-slate-300 text-purple-900 font-extrabold">
                      Optional Exp 1
                    </th>
                    {/* 11. Optional Experience 2 */}
                    <th className="px-3 py-3 w-52 border-r border-slate-300 text-purple-900 font-extrabold">
                      Optional Exp 2
                    </th>
                    {/* 12. Description 1 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 1 (Sheet)
                    </th>
                    {/* 13. Description 2 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 2
                    </th>
                    {/* 14. Description 3 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 3
                    </th>
                    {/* 15. Description 4 */}
                    <th className="px-3 py-3 w-64 border-r border-slate-300 text-slate-800 font-bold">
                      Description 4
                    </th>
                    {/* 16. Optional Description 1 */}
                    <th className="px-3 py-3 w-60 border-r border-slate-300 text-slate-800 font-bold">
                      Opt Description 1
                    </th>
                    {/* 17. Optional Description 2 */}
                    <th className="px-3 py-3 w-60 border-r border-slate-300 text-slate-800 font-bold">
                      Opt Description 2
                    </th>
                    {/* 18. Delete Day */}
                    <th className="px-2 py-3 w-14 text-center text-slate-800 font-bold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-300">
                  {dayRows.map((day, dIdx) => (
                    <tr
                      key={day.dayNumber}
                      className={`hover:bg-slate-50 transition-colors border-b border-slate-300 ${day.guidedTour ? 'bg-amber-50/40' : ''
                        }`}
                    >
                      {/* 1. Days (Sticky Left Column) */}
                      <td className={`sticky left-0 z-10 px-3 py-3 border-r-2 border-slate-400 font-extrabold shadow-[2px_0_6px_-1px_rgba(0,0,0,0.15)] ${day.guidedTour ? 'bg-amber-100/70 text-slate-950' : 'bg-slate-50 text-slate-950'
                        }`}>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-white rounded border border-slate-400 text-slate-900 font-bold font-mono text-xs shadow-2xs flex flex-col items-start leading-tight">
                            <span>{day.dayText}</span>
                            {startDate && (
                              <span className="text-[10px] text-orange-600 font-medium font-sans mt-0.5 whitespace-nowrap">
                                {formatToReadableDate(addDaysToDateStr(startDate, dIdx))}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 2. Guided Tour */}
                      <td className="px-3 py-2.5 text-center border-r border-slate-300">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={day.guidedTour}
                            onChange={e => updateDayField(dIdx, 'guidedTour', e.target.checked)}
                            className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                          />
                          <span className={`text-xs font-bold ${day.guidedTour ? 'text-orange-700' : 'text-slate-600'}`}>
                            {day.guidedTour ? 'Guided' : 'No'}
                          </span>
                        </label>
                      </td>

                      {/* 3. City */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.city}
                          onChange={val => updateDayField(dIdx, 'city', val)}
                          options={availableCitiesForDestination}
                          placeholder="Select City..."
                        />
                      </td>

                      {/* 4. En-route Experience (Multiple supported with + Add Spot) */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <div className="space-y-1.5">
                          {(day.enRouteExperiences || ['']).map((spot, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className="flex items-center gap-1">
                                <ActivityHoverTooltip
                                  item={findExperienceInCatalogs(spot, day.city, day.city2)}
                                  adults={adults}
                                  kidsDetails={kidsDetails}
                                >
                                  <LookupField
                                    value={spot}
                                    onChange={val => updateEnRouteSpot(dIdx, sIdx, val)}
                                    options={getEnRouteLookupForDay(day.city, day.city2)}
                                    placeholder="En-route spot..."
                                  />
                                </ActivityHoverTooltip>
                              </div>
                              <ActivityCostBadge
                                item={findExperienceInCatalogs(spot, day.city, day.city2)}
                                adults={adults}
                                kidsDetails={kidsDetails}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addEnRouteSpot(dIdx)}
                            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-0.5 font-bold mt-1"
                          >
                            <Plus className="w-3 h-3" /> Add En-route Spot
                          </button>
                        </div>
                      </td>

                      {/* 5. City 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <LookupField
                          value={day.city2}
                          onChange={val => updateDayField(dIdx, 'city2', val)}
                          options={availableCitiesForDestination}
                          placeholder="Transit City..."
                        />
                      </td>

                      {/* 6. Experience 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <ActivityHoverTooltip
                          item={findExperienceInCatalogs(day.experiences[0], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                        >
                          <LookupField
                            value={day.experiences[0] || ''}
                            onChange={(val, meta) => handleSelectExperience(dIdx, 0, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Exp 1 (${day.city} / ${day.city2})...` : `Exp 1 in ${day.city}...`}
                          />
                        </ActivityHoverTooltip>
                        <ActivityCostBadge
                          item={findExperienceInCatalogs(day.experiences[0], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                          fallbackCost={day.experienceCosts?.[0]}
                          fallbackPrivateCost={day.experiencePrivateCosts?.[0]}
                        />
                      </td>

                      {/* 7. Experience 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <ActivityHoverTooltip
                          item={findExperienceInCatalogs(day.experiences[1], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                        >
                          <LookupField
                            value={day.experiences[1] || ''}
                            onChange={(val, meta) => handleSelectExperience(dIdx, 1, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Exp 2 (${day.city} / ${day.city2})...` : `Exp 2 in ${day.city}...`}
                          />
                        </ActivityHoverTooltip>
                        <ActivityCostBadge
                          item={findExperienceInCatalogs(day.experiences[1], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                          fallbackCost={day.experienceCosts?.[1]}
                          fallbackPrivateCost={day.experiencePrivateCosts?.[1]}
                        />
                      </td>

                      {/* 8. Experience 3 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <ActivityHoverTooltip
                          item={findExperienceInCatalogs(day.experiences[2], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                        >
                          <LookupField
                            value={day.experiences[2] || ''}
                            onChange={(val, meta) => handleSelectExperience(dIdx, 2, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Exp 3 (${day.city} / ${day.city2})...` : `Exp 3 in ${day.city}...`}
                          />
                        </ActivityHoverTooltip>
                        <ActivityCostBadge
                          item={findExperienceInCatalogs(day.experiences[2], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                          fallbackCost={day.experienceCosts?.[2]}
                          fallbackPrivateCost={day.experiencePrivateCosts?.[2]}
                        />
                      </td>

                      {/* 9. Experience 4 (with + Add Spot option) */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <div className="space-y-1.5">
                          <ActivityHoverTooltip
                            item={findExperienceInCatalogs(day.experiences[3], day.city, day.city2)}
                            adults={adults}
                            kidsDetails={kidsDetails}
                          >
                            <LookupField
                              value={day.experiences[3] || ''}
                              onChange={(val, meta) => handleSelectExperience(dIdx, 3, val, meta)}
                              options={getExperiencesLookupForDay(day.city, day.city2)}
                              placeholder={day.city2 ? `Exp 4 (${day.city} / ${day.city2})...` : `Exp 4 in ${day.city}...`}
                            />
                          </ActivityHoverTooltip>
                          <ActivityCostBadge
                            item={findExperienceInCatalogs(day.experiences[3], day.city, day.city2)}
                            adults={adults}
                            kidsDetails={kidsDetails}
                            fallbackCost={day.experienceCosts?.[3]}
                            fallbackPrivateCost={day.experiencePrivateCosts?.[3]}
                          />
                          {/* Extra experiences beyond index 3 */}
                          {(day.experiences || []).slice(4).map((extraExp, extraIdx) => (
                            <div key={extraIdx + 4} className="space-y-1">
                              <div className="flex items-center gap-1">
                                <ActivityHoverTooltip
                                  item={findExperienceInCatalogs(extraExp, day.city, day.city2)}
                                  adults={adults}
                                  kidsDetails={kidsDetails}
                                >
                                  <LookupField
                                    value={extraExp || ''}
                                    onChange={(val, meta) => handleSelectExperience(dIdx, extraIdx + 4, val, meta)}
                                    options={getExperiencesLookupForDay(day.city, day.city2)}
                                    placeholder={`Exp ${extraIdx + 5}...`}
                                  />
                                </ActivityHoverTooltip>
                              </div>
                              <ActivityCostBadge
                                item={findExperienceInCatalogs(extraExp, day.city, day.city2)}
                                adults={adults}
                                kidsDetails={kidsDetails}
                                fallbackCost={day.experienceCosts?.[extraIdx + 4]}
                                fallbackPrivateCost={day.experiencePrivateCosts?.[extraIdx + 4]}
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addExtraExperienceSpot(dIdx)}
                            className="text-xs text-orange-600 hover:text-orange-800 flex items-center gap-0.5 font-bold mt-1"
                          >
                            <Plus className="w-3 h-3" /> Add Spot
                          </button>
                        </div>
                      </td>

                      {/* 10. Optional Experience 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <ActivityHoverTooltip
                          item={findExperienceInCatalogs(day.optionalExperiences[0], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                        >
                          <LookupField
                            value={day.optionalExperiences[0] || ''}
                            onChange={(val, meta) => handleSelectOptionalExperience(dIdx, 0, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Opt Exp 1 (${day.city} / ${day.city2})...` : "Optional Exp 1..."}
                          />
                        </ActivityHoverTooltip>
                      </td>

                      {/* 11. Optional Experience 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <ActivityHoverTooltip
                          item={findExperienceInCatalogs(day.optionalExperiences[1], day.city, day.city2)}
                          adults={adults}
                          kidsDetails={kidsDetails}
                        >
                          <LookupField
                            value={day.optionalExperiences[1] || ''}
                            onChange={(val, meta) => handleSelectOptionalExperience(dIdx, 1, val, meta)}
                            options={getExperiencesLookupForDay(day.city, day.city2)}
                            placeholder={day.city2 ? `Opt Exp 2 (${day.city} / ${day.city2})...` : "Optional Exp 2..."}
                          />
                        </ActivityHoverTooltip>
                      </td>

                      {/* 12. Description 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[0] || ''}
                          onChange={e => updateDescriptionText(dIdx, 0, e.target.value)}
                          placeholder="Description 1 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 13. Description 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[1] || ''}
                          onChange={e => updateDescriptionText(dIdx, 1, e.target.value)}
                          placeholder="Description 2 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 14. Description 3 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[2] || ''}
                          onChange={e => updateDescriptionText(dIdx, 2, e.target.value)}
                          placeholder="Description 3 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 15. Description 4 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.descriptions[3] || ''}
                          onChange={e => updateDescriptionText(dIdx, 3, e.target.value)}
                          placeholder="Description 4 (auto from sheet)..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 16. Optional Description 1 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.optionalDescriptions[0] || ''}
                          onChange={e => updateOptionalDescriptionText(dIdx, 0, e.target.value)}
                          placeholder="Opt Description 1..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 17. Optional Description 2 */}
                      <td className="px-3 py-2.5 border-r border-slate-300">
                        <textarea
                          rows={2}
                          value={day.optionalDescriptions[1] || ''}
                          onChange={e => updateOptionalDescriptionText(dIdx, 1, e.target.value)}
                          placeholder="Opt Description 2..."
                          className="w-full bg-white border border-slate-400 rounded-md p-2 text-xs text-slate-900 placeholder:text-slate-500 font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 shadow-none"
                        />
                      </td>

                      {/* 18. Delete */}
                      <td className="px-2 py-2.5 text-center">
                        {dayRows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDay(dIdx)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                            title="Delete Day"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 6: COSTING, MARGINS & 5% GST */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-300 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  6. Costing, Margins &amp; 5% GST
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live calculated based on Hotels, Transport, Activities, and Pax count. You can apply the live quote or manually edit any field.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {isQuoteManuallyEdited ? (
                  <Button
                    type="button"
                    onClick={handleApplyCalculatedQuote}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reset to Live Auto Quote (₹{quotationCalculations.calculatedFinalQuote.toLocaleString('en-IN')})
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Live Quotation Auto-Synced (₹{quotationCalculations.calculatedFinalQuote.toLocaleString('en-IN')})
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleApplyCalculatedQuote}
                      className="border-emerald-500 text-emerald-700 hover:bg-emerald-50 text-xs h-8 px-2.5 font-bold rounded-lg"
                      title="Re-apply live quotation calculation"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Refresh
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Comprehensive Live Cost Breakdown Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 mb-5">
              <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
                <span>Itinerary Cost Components Breakdown (Live Calculation):</span>
                <span className="text-slate-500 font-normal">
                  {adults} Adults {kids > 0 ? `• ${kids} Kids` : ''} • {roomsCount} Rooms • {noOfDays} Days
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">1. Hotels Total:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{Number(quotationCalculations.totalHotelsCost || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {hotels.reduce((acc, h) => acc + (Number(h.nights) || 1), 0)} Nts • {quotationCalculations.rooms} Rms
                  </span>
                  {quotationCalculations.hotelBreakdowns && quotationCalculations.hotelBreakdowns.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 space-y-0.5">
                      {quotationCalculations.hotelBreakdowns.map((hb: any, hbIdx: number) => (
                        <div key={hbIdx} className="flex items-center justify-between text-[9px] text-slate-600 font-mono truncate" title={`${hb.hotelName}: ₹${Number(hb.singleHotelTotal || 0).toLocaleString('en-IN')}`}>
                          <span className="truncate pr-1">H#{hbIdx + 1} {hb.hotelName?.slice(0, 10)}:</span>
                          <span className="font-bold text-slate-900 shrink-0">₹{Number(hb.singleHotelTotal || 0).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">2. Transport / Cab:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{Number(quotationCalculations.totalVehicleCost || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {noOfDays} Days • ₹{Number(quotationCalculations.perHeadTransportCost || 0).toLocaleString('en-IN')}/pax
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">3. Activities / Sights:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{Number(quotationCalculations.totalActivitiesCost || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    SIC &amp; Private Share
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">4. Guided Tour:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{Number(quotationCalculations.totalGuideCost || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ₹2,000/guided day
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Base Package:</span>
                  <span className="text-xs font-extrabold text-slate-900 font-mono">
                    ₹{Number(quotationCalculations.calculatedBase || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Deluge Net Cost
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-bold">Margin ({quotationCalculations.marginPct}%):</span>
                  <span className="text-xs font-extrabold text-orange-600 font-mono">
                    +₹{Number(quotationCalculations.marginAmount || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    5% GST: +₹{Number(quotationCalculations.gstAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300">
                  <span className="text-[10px] text-emerald-800 block font-extrabold uppercase">Calculated Total:</span>
                  <span className="text-sm font-extrabold text-emerald-950 font-mono">
                    ₹{Number(quotationCalculations.calculatedFinalQuote || 0).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-semibold">
                    With GST &amp; Margin
                  </span>
                </div>

                <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-300">
                  <span className="text-[10px] text-blue-800 block font-extrabold uppercase">Per Pax Cost:</span>
                  <span className="text-xs font-extrabold text-blue-950 font-mono block">
                    Adult: ₹{Number(quotationCalculations.calculatedPerAdult || 0).toLocaleString('en-IN')}
                  </span>
                  {kids > 0 && (
                    <span className="text-[11px] font-extrabold text-orange-700 font-mono block mt-0.5">
                      Child: ₹{Number(quotationCalculations.calculatedPerKid || 0).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Zoho Deluge Capacity Details Pill */}
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-700">Zoho Deluge Capacity Formula:</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Rooms: <strong>{quotationCalculations.rooms}</strong> ({quotationCalculations.baseRooms} Base {quotationCalculations.extraRoomsAdded > 0 ? `+ ${quotationCalculations.extraRoomsAdded} Extra Needed` : ''})
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Extra Beds: <strong>{quotationCalculations.extraBedCount}</strong> ({quotationCalculations.billableExtraBeds} Billable)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                    Transport Pax: <strong>{quotationCalculations.totalTransportPax}</strong> (Adults + Kids &gt; 3 yrs)
                  </span>
                  {kids > 0 && (
                    <span className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-800 font-medium">
                      Child Hotel Share: <strong>₹{Number(quotationCalculations.childHotelShare || 0).toLocaleString('en-IN')}</strong>
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Exact distribution: (Adults × ₹{Number(quotationCalculations.delugePerAdultCost || 0).toLocaleString('en-IN')}) {kids > 0 ? `+ (Kids × ₹${Number(quotationCalculations.delugePerChildCost || 0).toLocaleString('en-IN')})` : ''} = ₹{Number(quotationCalculations.calculatedBase || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Editable Form Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Base Quotation Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 100000"
                  value={baseQuotation}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setIsQuoteManuallyEdited(true);
                    setBaseQuotation(val);
                    if (!marginPercent) setFinalQuotation(val);
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 font-bold text-slate-900 focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Margin % (Optional)</label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 15"
                    value={marginPercent}
                    onChange={e => handleMarginChange(e.target.value.replace(/\D/g, ''))}
                    className="bg-white border border-slate-400 text-xs h-10 w-20 text-center font-bold text-orange-600 focus-visible:ring-orange-500"
                  />
                  <div className="flex gap-1">
                    {['10', '15', '20'].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleMarginChange(pct)}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-400 transition-colors"
                      >
                        +{pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-800 mb-1">
                  Final Quotation Amount (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Total Quote"
                  value={finalQuotation}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setIsQuoteManuallyEdited(true);
                    setFinalQuotation(val);
                    const num = Number(val) || 0;
                    if (num > 0) {
                      const effPax = (Number(adults) || 1) + (Number(kids) > 0 ? Number(kids) * 0.7 : 0);
                      const perA = Math.round(num / effPax);
                      setPerAdultPrice(String(perA));
                      if (kids > 0) setPerKidPrice(String(Math.round(perA * 0.7)));
                    }
                  }}
                  className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 text-sm h-10 font-extrabold focus-visible:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-blue-900 mb-1">
                  Per Adult Cost (₹)
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Per Adult Price"
                  value={perAdultPrice}
                  onChange={e => {
                    setIsQuoteManuallyEdited(true);
                    setPerAdultPrice(e.target.value.replace(/\D/g, ''));
                  }}
                  className="bg-blue-50/50 border border-blue-400 text-xs h-10 font-bold text-blue-950 focus-visible:ring-blue-500"
                />
              </div>

              {kids > 0 && (
                <div>
                  <label className="block text-xs font-bold text-orange-900 mb-1">
                    Per Child Cost (₹)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Per Child Price"
                    value={perKidPrice}
                    onChange={e => {
                      setIsQuoteManuallyEdited(true);
                      setPerKidPrice(e.target.value.replace(/\D/g, ''));
                    }}
                    className="bg-orange-50/50 border border-orange-400 text-xs h-10 font-bold text-orange-950 focus-visible:ring-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Advance Amount Paid (₹)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 25000"
                  value={advanceAmount}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setAdvanceAmount(val);
                    const f = Number(finalQuotation) || 0;
                    const a = Number(val) || 0;
                    if (f > 0) setBalanceAmount(String(Math.max(0, f - a)));
                  }}
                  className="bg-white border border-slate-400 text-xs h-10 text-slate-900 font-semibold focus-visible:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Balance Pending Amount (₹)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Auto calculated"
                  value={balanceAmount}
                  onChange={e => setBalanceAmount(e.target.value.replace(/\D/g, ''))}
                  className="bg-slate-100 border border-slate-400 text-xs h-10 text-slate-800 font-semibold focus-visible:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 7: PACKAGE INCLUSIONS & EXCLUSIONS */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-6">
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 text-orange-600 flex items-center justify-center font-bold shrink-0">
                  <ListChecks className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Section 7: Package Inclusions &amp; Exclusions
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize the exact package inclusions and exclusions displayed to the guest on their itinerary quotation.
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {isCustomInclusionsEdited ? (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    Custom Edited ({inclusions.length} Inc • {exclusions.length} Exc)
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    Auto-Synced with Itinerary ({inclusions.length} Inc • {exclusions.length} Exc)
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleRegenerateDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-all hover:shadow-2xs active:scale-95 cursor-pointer"
                  title="Reset to dynamic smart defaults based on vehicle, hotel nights, meal plan & day experiences"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
                  Reset to Smart Defaults
                </button>
              </div>
            </div>

            {/* Inclusions & Exclusions 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* --- INCLUSIONS COLUMN --- */}
              <div className="bg-emerald-50/50 border border-emerald-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                {/* Column Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-emerald-950 uppercase tracking-wide">
                      What's Included
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {inclusions.length} Points
                    </span>
                  </div>

                  {inclusions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllInclusions}
                      className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                      title="Clear all inclusions"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Quick Add Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800/80 block mb-1.5">
                    Quick Add Inclusions Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_INCLUSIONS_PRESETS.map((preset, pIdx) => {
                      const isAdded = inclusions.some(item => item.toLowerCase() === preset.toLowerCase());
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddInclusion(preset)}
                          disabled={isAdded}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-200/60 border-emerald-300 text-emerald-900 cursor-default opacity-80'
                              : 'bg-white hover:bg-emerald-100 border-emerald-300 text-emerald-900 hover:border-emerald-400 cursor-pointer shadow-2xs active:scale-95'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-emerald-700 stroke-[3]" /> : <Plus className="w-3 h-3 text-emerald-600" />}
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Inclusions List */}
                <div className="space-y-2.5 flex-1">
                  {inclusions.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-white/70 border border-dashed border-emerald-300 rounded-xl text-xs text-slate-500">
                      No inclusions listed yet. Click presets above or enter custom points below.
                    </div>
                  ) : (
                    inclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-emerald-200/80 hover:border-emerald-400 rounded-xl p-2.5 flex items-start gap-2 shadow-2xs transition-all group focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-500"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                          {idx + 1}
                        </span>

                        <textarea
                          rows={Math.max(1, Math.min(3, Math.ceil((item.length || 1) / 48)))}
                          value={item}
                          onChange={e => handleUpdateInclusion(idx, e.target.value)}
                          placeholder="Describe included item..."
                          className="flex-1 text-xs text-slate-800 font-medium bg-transparent border-0 focus:outline-hidden p-1 resize-y leading-relaxed"
                        />

                        {/* Order & Delete Buttons */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleMoveInclusion(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1 rounded hover:bg-slate-100 text-slate-500 ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-800 cursor-pointer'
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveInclusion(idx, 'down')}
                            disabled={idx === inclusions.length - 1}
                            className={`p-1 rounded hover:bg-slate-100 text-slate-500 ${
                              idx === inclusions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-800 cursor-pointer'
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveInclusion(idx)}
                            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                            title="Delete inclusion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Inclusion Input */}
                <div className="pt-2 border-t border-emerald-200 flex items-center gap-2">
                  <Input
                    type="text"
                    value={newInclusionText}
                    onChange={e => setNewInclusionText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddInclusion();
                      }
                    }}
                    placeholder="Type new inclusion (press Enter to add)..."
                    className="bg-white border-emerald-300 text-xs h-9 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-emerald-500"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddInclusion()}
                    disabled={!newInclusionText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-3.5 rounded-xl shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>

              {/* --- EXCLUSIONS COLUMN --- */}
              <div className="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
                {/* Column Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-rose-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-rose-950 uppercase tracking-wide">
                      What's Excluded
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                      {exclusions.length} Points
                    </span>
                  </div>

                  {exclusions.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllExclusions}
                      className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                      title="Clear all exclusions"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Quick Add Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800/80 block mb-1.5">
                    Quick Add Exclusions Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_EXCLUSIONS_PRESETS.map((preset, pIdx) => {
                      const isAdded = exclusions.some(item => item.toLowerCase() === preset.toLowerCase());
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddExclusion(preset)}
                          disabled={isAdded}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold border transition-all flex items-center gap-1 ${
                            isAdded
                              ? 'bg-rose-200/60 border-rose-300 text-rose-900 cursor-default opacity-80'
                              : 'bg-white hover:bg-rose-100 border-rose-300 text-rose-900 hover:border-rose-400 cursor-pointer shadow-2xs active:scale-95'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3 text-rose-700 stroke-[3]" /> : <Plus className="w-3 h-3 text-rose-600" />}
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Exclusions List */}
                <div className="space-y-2.5 flex-1">
                  {exclusions.length === 0 ? (
                    <div className="text-center py-6 px-4 bg-white/70 border border-dashed border-rose-300 rounded-xl text-xs text-slate-500">
                      No exclusions listed yet. Click presets above or enter custom points below.
                    </div>
                  ) : (
                    exclusions.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-rose-200/80 hover:border-rose-400 rounded-xl p-2.5 flex items-start gap-2 shadow-2xs transition-all group focus-within:ring-2 focus-within:ring-rose-500/40 focus-within:border-rose-500"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                          {idx + 1}
                        </span>

                        <textarea
                          rows={Math.max(1, Math.min(3, Math.ceil((item.length || 1) / 48)))}
                          value={item}
                          onChange={e => handleUpdateExclusion(idx, e.target.value)}
                          placeholder="Describe excluded item..."
                          className="flex-1 text-xs text-slate-800 font-medium bg-transparent border-0 focus:outline-hidden p-1 resize-y leading-relaxed"
                        />

                        {/* Order & Delete Buttons */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleMoveExclusion(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1 rounded hover:bg-slate-100 text-slate-500 ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-800 cursor-pointer'
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveExclusion(idx, 'down')}
                            disabled={idx === exclusions.length - 1}
                            className={`p-1 rounded hover:bg-slate-100 text-slate-500 ${
                              idx === exclusions.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-slate-800 cursor-pointer'
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveExclusion(idx)}
                            className="p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                            title="Delete exclusion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add New Exclusion Input */}
                <div className="pt-2 border-t border-rose-200 flex items-center gap-2">
                  <Input
                    type="text"
                    value={newExclusionText}
                    onChange={e => setNewExclusionText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddExclusion();
                      }
                    }}
                    placeholder="Type new exclusion (press Enter to add)..."
                    className="bg-white border-rose-300 text-xs h-9 text-slate-800 placeholder:text-slate-400 font-medium focus-visible:ring-rose-500"
                  />
                  <Button
                    type="button"
                    onClick={() => handleAddExclusion()}
                    disabled={!newExclusionText.trim()}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9 px-3.5 rounded-xl shrink-0 flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 8: OPTION SELECTOR & GENERATION TRIGGER */}
          <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="flex-1">
              <div className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" />
                Select Itinerary Option:
              </div>

              {/* Option Selector Buttons */}
              <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-300 inline-flex">
                {[1, 2, 3].map(optNum => {
                  const existing = existingOptions[optNum];
                  const isLocked = Boolean(existing && !unlockedOptions[optNum]);
                  const isSelected = selectedOption === optNum;

                  return (
                    <button
                      key={optNum}
                      type="button"
                      onClick={() => {
                        if (isLocked) {
                          setOptionLockAlert(`Option ${optNum} link already exists (${existing.slug}). Cannot select to prevent accidental overwrite. Click "Open Link" to view it, or unlock it below if you intentionally want to overwrite.`);
                          return;
                        }
                        setOptionLockAlert(null);
                        setSelectedOption(optNum);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isLocked
                          ? 'bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed hover:bg-slate-200'
                          : isSelected
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                      }`}
                      title={isLocked ? `Option ${optNum} already generated. Locked to prevent overwrite.` : `Select Option ${optNum}`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-700" />
                          Option {optNum} (Link Exists)
                        </>
                      ) : (
                        <>
                          Option {optNum}
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lock Alert if User Tries Clicking a Locked Option */}
              {optionLockAlert && (
                <div className="mt-3 text-xs font-semibold px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>{optionLockAlert}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOptionLockAlert(null)}
                    className="text-amber-700 hover:text-amber-950 font-bold text-xs shrink-0"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Action Buttons for Already Generated Options */}
              {Object.keys(existingOptions).length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Existing Generated Links for this Lead:
                  </span>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    {[1, 2, 3].map(optNum => {
                      const exist = existingOptions[optNum];
                      if (!exist) return null;
                      const isUnlocked = Boolean(unlockedOptions[optNum]);

                      return (
                        <div
                          key={optNum}
                          className="flex items-center gap-2 bg-amber-50/90 border border-amber-300 rounded-xl px-3 py-1.5 shadow-2xs text-xs"
                        >
                          <span className="font-extrabold text-amber-950 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-amber-700" />
                            Option {optNum}:
                          </span>

                          <a
                            href={exist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-[11px] font-bold transition-colors shadow-2xs"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open Option {optNum} Link ↗
                          </a>

                          <button
                            type="button"
                            onClick={() => copyToClipboard(typeof window !== 'undefined' ? `${window.location.origin}${exist.url}` : exist.url)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-[11px] font-semibold"
                            title="Copy Option Link"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>

                          {!isUnlocked ? (
                            <button
                              type="button"
                              onClick={() => {
                                setUnlockedOptions(prev => ({ ...prev, [optNum]: true }));
                                setSelectedOption(optNum);
                                setOptionLockAlert(null);
                              }}
                              className="text-[11px] text-amber-800 hover:text-amber-950 underline ml-1 font-semibold cursor-pointer"
                              title="Unlock this option if you want to edit and regenerate it"
                            >
                              Unlock to edit 🔓
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Unlock className="w-2.5 h-2.5" /> Unlocked
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-500 mt-2">
                Option 1, 2, and 3 generate separate luxury itinerary links.
              </p>
            </div>

            <div className="shrink-0 self-start md:self-auto flex flex-col items-end gap-1.5">
              <Button
                onClick={handleGenerateItinerary}
                disabled={generating || Boolean(existingOptions[selectedOption] && !unlockedOptions[selectedOption])}
                className="h-12 px-8 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2.5"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Itinerary with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Option {selectedOption} Itinerary ↗
                  </>
                )}
              </Button>
              {Boolean(existingOptions[selectedOption] && !unlockedOptions[selectedOption]) && (
                <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Option {selectedOption} is locked (Link exists).
                </span>
              )}
            </div>
          </div>

          {genError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <span className="font-bold">Error:</span> {genError}
            </div>
          )}

          {/* Success Result Card */}
          {genSuccess && (
            <div className="p-6 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-sm relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    {genSuccess.updated ? 'Option Updated Successfully!' : 'Option Generated Successfully!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Option {genSuccess.optionNumber} has been saved with the latest hotels, guided experiences &amp; transport!
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-300 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="text-xs text-slate-700 truncate font-mono font-medium">
                  {genSuccess.publicUrl || genSuccess.url}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => copyToClipboard(genSuccess.publicUrl || `${window.location.origin}${genSuccess.url}`)}
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs border border-slate-400 bg-white hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 font-medium"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Link!' : 'Copy Link'}
                  </Button>
                  <a
                    href={genSuccess.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-4 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    Open Live Itinerary
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section: Itinerary History Section */}
        <div className="mt-14 pt-8 border-t border-slate-300">
          <ItineraryHistorySection lastGeneratedId={genSuccess?.id} />
        </div>
      </main>

      {/* POP-UP MODAL: KIDS AGE & BED PREFERENCE */}
      {isKidsModalOpen && kids > 0 && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            className="bg-white border border-slate-300 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/20">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    Child Details ({kids} {kids === 1 ? 'Child' : 'Children'})
                  </h3>
                  <p className="text-xs text-slate-600">
                    Specify age and bed preference for each child to determine hotel room policies and extra bed rates.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsKidsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-semibold">Quick Set All:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAllBedPreferences('Without Bed')}
                  className="px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition-colors"
                >
                  All: Without Extra Bed (Sharing)
                </button>
                <button
                  type="button"
                  onClick={() => setAllBedPreferences('With Bed')}
                  className="px-2.5 py-1 rounded-md bg-orange-100 border border-orange-300 text-orange-800 hover:bg-orange-200 font-bold transition-colors"
                >
                  All: With Extra Bed
                </button>
              </div>
            </div>

            {/* Modal Body - Child Cards */}
            <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-100 flex-1">
              {kidsDetails.slice(0, kids).map((child) => (
                <div key={child.childNumber} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 inline-flex items-center justify-center text-[11px] font-bold">
                        {child.childNumber}
                      </span>
                      Child {child.childNumber}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${child.bedPreference === 'With Bed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : child.bedPreference === 'Crib'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                      {child.bedPreference === 'With Bed' ? 'Extra Bed Included' : child.bedPreference === 'Crib' ? 'Crib / Cot' : 'Sharing Bed (No Extra Bed)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    {/* Age Input */}
                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Age (Years)
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        placeholder="e.g. 5"
                        value={child.age}
                        onChange={e => {
                          const sanitized = e.target.value.replace(/\D/g, '');
                          updateChildDetail(child.childNumber, 'age', sanitized);
                        }}
                        className="bg-white border border-slate-400 text-xs h-9 font-bold text-slate-900 focus-visible:ring-orange-500"
                      />
                    </div>

                    {/* Bed Preference Selector */}
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Bed Preference
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'Without Bed')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'Without Bed'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>Without Bed</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'Without Bed' ? 'text-amber-100' : 'text-slate-500'}`}>
                            Sharing
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'With Bed')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'With Bed'
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>With Bed</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'With Bed' ? 'text-emerald-100' : 'text-slate-500'}`}>
                            Extra Bed
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChildDetail(child.childNumber, 'bedPreference', 'Crib')}
                          className={`px-2 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-0.5 ${child.bedPreference === 'Crib'
                              ? 'bg-blue-600 text-white border-blue-700 shadow-2xs'
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                          <span>Crib / Cot</span>
                          <span className={`text-[9px] font-medium ${child.bedPreference === 'Crib' ? 'text-blue-100' : 'text-slate-500'}`}>
                            0-2 yrs
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {kidsDetails.filter(k => k.bedPreference === 'With Bed').length} With Bed • {kidsDetails.filter(k => k.bedPreference === 'Without Bed').length} Without Bed • {kidsDetails.filter(k => k.bedPreference === 'Crib').length} Crib
              </span>
              <Button
                type="button"
                onClick={() => setIsKidsModalOpen(false)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs h-9 px-5 rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" /> Save &amp; Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
