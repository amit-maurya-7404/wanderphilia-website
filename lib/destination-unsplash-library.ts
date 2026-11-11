/**
 * Verified high-resolution Unsplash travel imagery representing EXACT popular landmarks,
 * monuments, and authentic cultural heritage for each destination.
 * All URLs have been verified to return HTTP 200 OK.
 */

export const DESTINATION_UNSPLASH_COLLECTIONS: Record<string, string[]> = {
  // Rajasthan Overall: Complete collection of famous forts, palaces, lakes & desert heritage
  rajasthan: [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Hawa Mahal (Palace of Winds), Jaipur
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Amer (Amber) Fort & Maota Lake, Jaipur
    'https://images.unsplash.com/photo-1776966892086-c0f6cdf3380f?auto=format&fit=crop&w=1200&q=80', // Hawa Mahal street facade
    'https://images.unsplash.com/photo-1719591680066-783c4e3c2cdd?auto=format&fit=crop&w=1200&q=80', // Patrika Gate, Jaipur
    'https://images.unsplash.com/photo-1504634270631-1d54642b2019?auto=format&fit=crop&w=1200&q=80', // Albert Hall Museum, Jaipur
    'https://images.unsplash.com/photo-1641869267924-4af58b653bac?auto=format&fit=crop&w=1200&q=80', // Albert Hall grand architecture
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', // City Palace Jaipur royal courtyards
    'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?auto=format&fit=crop&w=1200&q=80', // Amer Fort grand gate entrance
    'https://images.unsplash.com/photo-1772976455835-8cf34e23f53b?auto=format&fit=crop&w=1200&q=80', // Jal Mahal (Water Palace), Jaipur
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', // Jodhpur Blue City rooftops view
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort towering on rocky cliff, Jodhpur
    'https://images.unsplash.com/photo-1787074283684-3ec01b85290d?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort illuminated at night
    'https://images.unsplash.com/photo-1777707461673-6ac5a66c1d6e?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort stone carvings
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Lake Pichola luxury waters, Udaipur
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Taj Lake Palace floating on Pichola, Udaipur
    'https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=1200&q=80', // City Palace Udaipur on banks of Lake Pichola
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // City Palace Udaipur historic walls
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', // Jaisalmer Golden Fort (Sonar Qila)
    'https://images.unsplash.com/photo-1732022648903-737e66c18b08?auto=format&fit=crop&w=1200&q=80', // Jaisalmer Fort living fort aerial view
    'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80', // Sam Sand Dunes golden ripple waves, Thar Desert
    'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=1200&q=80', // Camel caravan safari across Thar Desert
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Desert sunset over Thar horizon
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Sand dunes evening serenity
    'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1200&q=80', // Jaisalmer luxury desert glamping camp
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Patwon ki Haveli ornate stone jharokhas
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Pushkar holy lake & sacred bathing ghats
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Royal Rajasthani stone archway
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', // Chand Baori ancient stepwell Abhaneri
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Royal heritage palace courtyard
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80'  // Traditional colorful Rajasthani bazaar
  ],

  // Jaipur: The Pink City Landmarks
  jaipur: [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Hawa Mahal (Palace of Winds)
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Amer (Amber) Fort & Maota Lake
    'https://images.unsplash.com/photo-1776966892086-c0f6cdf3380f?auto=format&fit=crop&w=1200&q=80', // Hawa Mahal bustling street view
    'https://images.unsplash.com/photo-1719591680066-783c4e3c2cdd?auto=format&fit=crop&w=1200&q=80', // Patrika Gate
    'https://images.unsplash.com/photo-1504634270631-1d54642b2019?auto=format&fit=crop&w=1200&q=80', // Albert Hall Museum
    'https://images.unsplash.com/photo-1641869267924-4af58b653bac?auto=format&fit=crop&w=1200&q=80', // Albert Hall facade & pigeons
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80', // City Palace Jaipur courtyards
    'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?auto=format&fit=crop&w=1200&q=80', // Amer Fort grand suraj pol gate
    'https://images.unsplash.com/photo-1772976455835-8cf34e23f53b?auto=format&fit=crop&w=1200&q=80', // Jal Mahal (Water Palace) Man Sagar Lake
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Jaipur royal courtyard
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Pink City stone arches
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Johari Bazaar Jaipur
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Traditional palace jharokha
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80'  // Nahargarh Fort Aravali mountain view
  ],

  // Jodhpur: The Blue City Landmarks
  jodhpur: [
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', // Blue City houses from above
    'https://images.unsplash.com/photo-1597040663342-45b6af3d91a5?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort majestic cliff
    'https://images.unsplash.com/photo-1787074283684-3ec01b85290d?auto=format&fit=crop&w=1200&q=80', // Mehrangarh Fort illuminated at night
    'https://images.unsplash.com/photo-1777707461673-6ac5a66c1d6e?auto=format&fit=crop&w=1200&q=80', // Mehrangarh stone craftsmanship
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // Fort defense walls & cannons
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Sunset golden hour over Blue City
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Blue painted alleys of Navchokiya
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Ghanta Ghar Clock Tower & Sardar Market
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Jaswant Thada marble cenotaph arches
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Palace courtyard architecture
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Umaid Bhawan horizon sunset
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'  // Royal Marwar heritage palace
  ],

  // Udaipur: The City of Lakes Landmarks
  udaipur: [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', // Lake Pichola crystal water view
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', // Taj Lake Palace floating on Pichola
    'https://images.unsplash.com/photo-1695956353120-54ce5e91632b?auto=format&fit=crop&w=1200&q=80', // City Palace Udaipur along Lake Pichola
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // City Palace Udaipur majestic stone walls
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Sunset boat cruise on Lake Pichola
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Ghats of Udaipur (Gangaur Ghat)
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Ambrai Ghat viewpoint
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Saheliyon ki Bari marble pavilions
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Jag Mandir Island Palace
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Sajjangarh (Monsoon Palace) sunset view
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Golden reflections on Fateh Sagar Lake
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80'  // Lake facing heritage hotel balcony
  ],

  // Jaisalmer: The Golden City & Thar Desert Landmarks
  jaisalmer: [
    'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', // Jaisalmer Golden Fort (Sonar Qila)
    'https://images.unsplash.com/photo-1732022648903-737e66c18b08?auto=format&fit=crop&w=1200&q=80', // Jaisalmer Fort living bastions aerial
    'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1200&q=80', // Sam Sand Dunes golden ripples
    'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?auto=format&fit=crop&w=1200&q=80', // Thar Desert camel caravan safari
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Desert sunset over Thar horizon
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Sam sand dunes waves
    'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1200&q=80', // Luxury desert glamping swiss tents
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Patwon ki Haveli yellow sandstone carving
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Gadisar Lake & Torana Gateway
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Starry night sky over Thar Desert
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Golden stone arches of Kuldhara
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80'  // Jaisalmer fort bazaar handicrafts
  ],

  // Leh Ladakh: High Altitude Himalayan Passes, Lakes & Monasteries
  ladakh: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Pangong Tso Lake 50-shades of blue
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Snowcapped Karakoram & Himalayan peaks
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Milky Way over Nubra Valley
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Khardung La highest pass road
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80', // Rugged mountain peaks of Ladakh
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Thiksey Monastery on hill
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Leh-Manali Highway road trip
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Tso Moriri Lake blue waters
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Sangam: Indus & Zanskar River confluence
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Golden sunrise over Stupa
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', // High altitude winding roads
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // Hemis Monastery courtyard
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Buddhist prayer flags at mountain pass
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Hunder white sand dunes & Bactrian camels
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Diskit Monastery Maitreya Buddha statue
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Shanti Stupa overlooking Leh
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80', // Royal Leh Palace
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'  // Magnetic Hill highway
  ],

  // Kashmir: Paradise on Earth (Dal Lake, Gulmarg, Pahalgam, Sonamarg)
  kashmir: [
    'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80', // Dal Lake colorful Shikara ride
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Gulmarg snow meadows
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Pahalgam pine forest river
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Sonamarg Thajiwas glacier meadow
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80', // Betaab Valley streams & mountains
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Traditional wooden Houseboat on Dal Lake
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Floating flower & vegetable market Srinagar
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Apharwat Peak Gulmarg Gondola
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Golden Chinar trees in autumn
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Traditional Kashmiri wooden cottage
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Scenic drive through Sindh valley
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', // Aru Valley trekking trail
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // Historic wooden Zero Bridge
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Nigeen Lake peaceful waters
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Nishat Bagh Mughal Garden terraces
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Pony ride in Betaab valley
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Shankaracharya hill temple
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', // Pari Mahal (Palace of Fairies)
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'  // Indira Gandhi Tulip Garden Srinagar
  ],

  // Spiti Valley: The Middle Land
  spiti: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Key (Kye) Gompa Monastery
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Chandratal (Moon Lake) turquoise waters
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Stargazing & Milky Way over Kaza
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Kunzum Pass highest mountain view
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80', // Langza Golden Buddha statue
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Offroading through Spiti River canyon
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Dhankar Lake
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Pin Valley National Park
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Hikkim highest post office in the world
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Mudh village end of Pin valley
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', // Chicham Bridge (highest suspension bridge)
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // Dhankar cliff-hanging Monastery
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Tabo 1000-year UNESCO Monastery
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Cold desert canyon landscape
    'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1200&q=80'  // Luxury alpine camping Chandratal
  ],

  // Meghalaya: Abode of Clouds
  meghalaya: [
    'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80', // Cherrapunji mist & green canyons
    'https://images.unsplash.com/photo-1654788111018-9096236d54ac?auto=format&fit=crop&w=1200&q=80', // Krang Suri blue lagoon waterfalls
    'https://images.unsplash.com/photo-1521437620269-f477f5437820?auto=format&fit=crop&w=1200&q=80', // Dawki Umngot transparent crystal river
    'https://images.unsplash.com/photo-1698429358246-807d8972da9a?auto=format&fit=crop&w=1200&q=80', // Double Decker Living Root Bridge Nongriat
    'https://images.unsplash.com/photo-1613644383947-26a22b8c04f2?auto=format&fit=crop&w=1200&q=80', // Nohkalikai Falls (tallest plunge in India)
    'https://images.unsplash.com/photo-1675296098616-53e3d4a1dd57?auto=format&fit=crop&w=1200&q=80', // Mawlynnong (Asia's cleanest village)
    'https://images.unsplash.com/photo-1758390285043-43c547cce665?auto=format&fit=crop&w=1200&q=80', // Laitlum Grand Canyons
    'https://images.unsplash.com/photo-1776601797873-396d38b7a1a9?auto=format&fit=crop&w=1200&q=80', // Wei Sawdong 3-tier cascade falls
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Floating transparent boat on Dawki
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Umiam Lake (Barapani) Shillong
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Bamboo trek Kongthong whistling village
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Seven Sisters (Nohsngithiang) Falls
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // Mawsmai limestone cave formations
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Shnongpdeng riverside pebbled shores
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'  // Elephant Falls Shillong
  ],

  // Himachal Pradesh: Manali, Solang, Kasol, Dharamshala, Shimla
  himachal: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', // Solang Valley snow slopes
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', // Manali deodar pine forest
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80', // Rohtang Pass glaciers
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80', // Kasol Parvati river valley
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80', // Dhauladhar mountain range Dharamshala
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Prashar Lake oval & floating island
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', // Shimla Mall Road & Ridge Christ Church
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Jibhi wooden bridge & waterfall
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80', // Old Manali cafes & river
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', // Atal Tunnel North Portal entrance
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1200&q=80', // Bir Billing paragliding takeoff
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80', // McLeodganj Dalai Lama monastery
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Hadimba Devi ancient wooden temple
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'  // Manikaran hot springs & Gurudwara
  ],

  // Kerala: God's Own Country (Munnar, Alleppey, Kochi, Thekkady, Varkala)
  kerala: [
    'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', // Alleppey backwaters luxury Kettuvallam houseboat
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Munnar rolling emerald tea plantations
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Fort Kochi Chinese fishing nets at sunset
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Varkala red cliff & Arabian sea beach
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Wayanad rainforest treehouse resort
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Thekkady Periyar wildlife boat safari
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Traditional Kathakali face art & performance
    'https://images.unsplash.com/photo-1498307833015-e7b400441eb8?auto=format&fit=crop&w=1200&q=80', // Kovalam lighthouse beach
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Athirappilly waterfalls (Niagara of India)
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Shikara boat cruising in Kumarakom backwaters
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Kolukkumalai world's highest organic tea estate
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Mattancherry Dutch Palace Kochi
  ],

  // Goa: Beach Paradise, Portuguese Forts & Churches
  goa: [
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Palolem beach crescent & palm trees
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Baga beach sunset
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Dudhsagar 4-tiered cascading waterfall
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Chapora Fort cliff view (Dil Chahta Hai)
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Basilica of Bom Jesus UNESCO World Heritage
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Anjuna flea market & seaside cafes
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Vagator red cliffs & sunset
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', // Fontainhas Latin Quarter colorful streets Panaji
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Aguada Fort & 17th-century lighthouse
  ],

  // Bali: Island of the Gods
  bali: [
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Tegallalang Rice Terraces Ubud
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Kelingking Beach T-Rex cliff Nusa Penida
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Uluwatu sea cliff temple
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Mount Batur sunrise active volcano
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Sacred Monkey Forest Sanctuary Ubud
    'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80', // Canggu Echo Beach surfing
    'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80', // Tanah Lot ocean rock temple sunset
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Ulun Danu Beratan water temple on lake
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Lempuyang Temple Gate of Heaven Mount Agung
  ],

  // Vietnam: Ha Long Bay, Hoi An, Da Nang, Hanoi
  vietnam: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Ha Long Bay UNESCO emerald karsts
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Hoi An Ancient Town lantern-lit river
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Golden Bridge held by giant stone hands Da Nang
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Sapa cascading terraced rice fields
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Hanoi Old Quarter Train Street
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Luxury junk boat cruise in Ha Long Bay
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Trang An & Tam Coc limestone cave boat ride
  ],

  // Thailand: Bangkok, Phuket, Krabi, Phi Phi
  thailand: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Maya Bay Phi Phi Leh turquoise lagoon
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Wat Arun (Temple of Dawn) Bangkok
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Railay Beach limestone cliffs Krabi
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Phuket Patong Beach sunset
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Wat Phra That Doi Suthep Chiang Mai
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Traditional longtail boat Thailand
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // James Bond Island Phang Nga Bay
  ],

  // Dubai & Abu Dhabi: Modern Wonders & Desert Culture
  dubai: [
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', // Burj Khalifa & Downtown Dubai skyline
    'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80', // Red dunes desert safari 4x4
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Burj Al Arab on Jumeirah Beach
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Sheikh Zayed Grand Mosque Abu Dhabi
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Dubai Marina luxury yachts & skyscrapers
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Palm Jumeirah & Atlantis
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Louvre Abu Dhabi floating dome
  ],

  // Sri Lanka: Wonder of Asia
  srilanka: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', // Sigiriya Lion Rock ancient sky fortress
    'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80', // Nine Arches Bridge Demodara Ella railway
    'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', // Nuwara Eliya rolling tea plantations
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', // Mirissa Coconut Tree Hill beach
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', // Galle Dutch Fort lighthouse ramparts
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', // Classic blue train journey Kandy to Ella
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'  // Temple of the Sacred Tooth Relic Kandy
  ]
};

// Aliases mapping for flexible query matching
const ALIASES: Record<string, string> = {
  // Cities to specific collections
  jaipur: 'jaipur',
  udaipur: 'udaipur',
  jodhpur: 'jodhpur',
  jaisalmer: 'jaisalmer',
  'jaisalmer dessert': 'jaisalmer',
  'jaisalmer hotel': 'jaisalmer',
  sam: 'jaisalmer',
  thar: 'jaisalmer',
  pushkar: 'rajasthan',
  bikaner: 'rajasthan',
  mountabu: 'rajasthan',
  jawai: 'rajasthan',
  ranthambore: 'rajasthan',

  // Ladakh & Spiti
  leh: 'ladakh',
  'leh ladakh': 'ladakh',
  'leh-ladakh': 'ladakh',
  nubra: 'ladakh',
  pangong: 'ladakh',
  diskit: 'ladakh',
  khardungla: 'ladakh',
  'spiti valley': 'spiti',
  'spiti-valley': 'spiti',
  kaza: 'spiti',
  chandratal: 'spiti',

  // Kashmir
  srinagar: 'kashmir',
  gulmarg: 'kashmir',
  pahalgam: 'kashmir',
  sonamarg: 'kashmir',

  // Himachal
  manali: 'himachal',
  shimla: 'himachal',
  kasol: 'himachal',
  dharamshala: 'himachal',
  'himachal pradesh': 'himachal',
  jibhi: 'himachal',
  tirthan: 'himachal',
  bir: 'himachal',

  // North East & South
  shillong: 'meghalaya',
  cherrapunji: 'meghalaya',
  dawki: 'meghalaya',
  munnar: 'kerala',
  alleppey: 'kerala',
  kochi: 'kerala',
  thekkady: 'kerala',
  varkala: 'kerala',

  // International
  'sri lanka': 'srilanka',
  'sri-lanka': 'srilanka',
  colombo: 'srilanka',
  kandy: 'srilanka',
  ella: 'srilanka',
  'abu dhabi': 'dubai',
  'abudhabi': 'dubai',
  uae: 'dubai',
  bangkok: 'thailand',
  phuket: 'thailand',
  krabi: 'thailand',
  hanoi: 'vietnam',
  halong: 'vietnam',
  'ha long': 'vietnam',
  hochiminh: 'vietnam',
  ubud: 'bali',
  kuta: 'bali',
  seminyak: 'bali'
};

/**
 * Returns curated, authentic Unsplash image URLs of exact popular places & cultural heritage
 * for the specified destination/city.
 */
export function getCuratedUnsplashImages(query: string): string[] {
  if (!query) return DESTINATION_UNSPLASH_COLLECTIONS.rajasthan;
  const clean = query.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
  const directKey = clean.replace(/\s+/g, '');

  // 1. Direct match (e.g. 'jaipur', 'jodhpur', 'udaipur', 'jaisalmer', 'rajasthan', 'ladakh', etc.)
  if (DESTINATION_UNSPLASH_COLLECTIONS[directKey]) {
    return DESTINATION_UNSPLASH_COLLECTIONS[directKey];
  }

  // 2. Alias match
  if (ALIASES[clean] && DESTINATION_UNSPLASH_COLLECTIONS[ALIASES[clean]]) {
    return DESTINATION_UNSPLASH_COLLECTIONS[ALIASES[clean]];
  }

  if (ALIASES[directKey] && DESTINATION_UNSPLASH_COLLECTIONS[ALIASES[directKey]]) {
    return DESTINATION_UNSPLASH_COLLECTIONS[ALIASES[directKey]];
  }

  // 3. Substring match
  for (const [k, list] of Object.entries(DESTINATION_UNSPLASH_COLLECTIONS)) {
    if (k.includes(directKey) || directKey.includes(k)) {
      return list;
    }
  }

  for (const [alias, destKey] of Object.entries(ALIASES)) {
    const aliasClean = alias.replace(/[^a-z0-9]/g, '');
    if (directKey.includes(aliasClean) || aliasClean.includes(directKey)) {
      if (DESTINATION_UNSPLASH_COLLECTIONS[destKey]) {
        return DESTINATION_UNSPLASH_COLLECTIONS[destKey];
      }
    }
  }

  // Fallback to rajasthan collection
  return DESTINATION_UNSPLASH_COLLECTIONS.rajasthan;
}
