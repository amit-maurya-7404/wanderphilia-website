import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoApiUrl } from '@/lib/zoho';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

let cachedMasterData: any = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const isRefresh = req.nextUrl.searchParams.has('refresh');
    if (!isRefresh && cachedMasterData && Date.now() - lastCacheTime < CACHE_TTL_MS) {
      return NextResponse.json(cachedMasterData);
    }

    const token = await getZohoAccessToken();
    const fetchHeaders = {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Helper to fetch all records across pages
    async function fetchZohoPagedRecords(basePath: string, maxPages = 5) {
      const records: any[] = [];
      let page = 1;
      let hasMore = true;
      while (hasMore && page <= maxPages) {
        const sep = basePath.includes('?') ? '&' : '?';
        const url = getZohoApiUrl(`${basePath}${sep}page=${page}&per_page=200`);
        const res = await fetch(url, { headers: fetchHeaders, cache: 'no-store' });
        if (!res.ok) break;
        const json = await res.json();
        const data = json.data || [];
        records.push(...data);
        hasMore = Boolean(json.info?.more_records);
        page++;
        if (data.length === 0) break;
      }
      return records;
    }

    // 1. Fetch all Activities & Experiences from Zoho CRM
    const rawActivities = await fetchZohoPagedRecords(
      '/crm/v3/Activities_and_Experiences?fields=Name,City_Destination,Destination,Cost_Per_Person,Inclusions_Description,Description_for_template,Sighseeing_and_Experiences_Category,Activity_Location_Type,En_route_Routes'
    );

    // 2. Fetch all Hotels from Zoho CRM
    const rawHotels = await fetchZohoPagedRecords(
      '/crm/v3/Hotel?fields=id,Name,City_Location,Destinations,Hotel_Star_Rating,Hotel_Category,Description'
    );

    // Fetch full hotel records in parallel batches to retrieve Room_Rates_Pricing subforms
    const detailedHotelsMap = new Map<string, any>();
    for (let i = 0; i < rawHotels.length; i += 15) {
      const chunk = rawHotels.slice(i, i + 15);
      const chunkResults = await Promise.all(
        chunk.map(async h => {
          if (!h.id) return null;
          try {
            const hUrl = getZohoApiUrl(`/crm/v3/Hotel/${h.id}`);
            const hRes = await fetch(hUrl, { headers: fetchHeaders, cache: 'no-store' });
            if (!hRes.ok) return null;
            const hJson = await hRes.json();
            return hJson.data?.[0] || null;
          } catch {
            return null;
          }
        })
      );
      chunkResults.forEach(item => {
        if (item && item.id) {
          detailedHotelsMap.set(String(item.id), item);
        }
      });
    }

    // 3. Fetch all Vehicles from Zoho CRM
    const rawVehicles = await fetchZohoPagedRecords(
      '/crm/v3/Vehicles?fields=Name,State,Cost,Min_Capacity,Max_Capacity,Vendor_Pricing'
    );

    // Grouping & Normalization
    const destinationsSet = new Set<string>([
      'Spiti Valley',
      'Leh Ladakh',
      'Kashmir',
      'Himachal Pradesh',
      'Uttarakhand',
      'Rajasthan',
      'Kerala',
      'Goa',
      'Andaman & Nicobar Islands',
      'Meghalaya',
      'Sikkim & Darjeeling',
      'Golden Triangle',
      'Karnataka & South India',
      'Tamil Nadu & Pondicherry',
      'Madhya Pradesh',
      'Maharashtra',
      'Gujarat',
      'Arunachal Pradesh',
      'Assam',
      'Bali (Indonesia)',
      'Dubai & Abu Dhabi (UAE)',
      'Thailand',
      'Vietnam',
      'Singapore',
      'Malaysia',
      'Maldives',
      'Switzerland',
      'Europe',
      'Sri Lanka',
      'Nepal',
      'Bhutan',
      'Mauritius',
      'Turkey',
      'Georgia',
      'Azerbaijan (Baku)',
      'Kazakhstan (Almaty)',
      'Uzbekistan',
      'Japan',
      'Egypt',
      'Kenya & Tanzania'
    ]);
    const citiesByDestination: Record<string, Set<string>> = {};
    const experiencesByCity: Record<string, any[]> = {};
    const hotelsByCity: Record<string, any[]> = {};

    // Process Activities
    rawActivities.forEach(item => {
      const actName = String(item.Name || '').trim();
      if (!actName) return;

      const cityName = String(item.City_Destination || '').trim();
      const destName = String(item.Destination || 'Rajasthan').trim();
      const destKey = destName.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (destName) destinationsSet.add(destName);
      if (cityName && destName) {
        if (!citiesByDestination[destKey]) citiesByDestination[destKey] = new Set();
        citiesByDestination[destKey].add(cityName);
      }

      const cityKey = (cityName || destName).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!experiencesByCity[cityKey]) experiencesByCity[cityKey] = [];

      const description = String(item.Inclusions_Description || item.Description_for_template || '').trim();
      const ppCost = Number(item.Cost_Per_Person) || 0;
      const category = String(item.Sighseeing_and_Experiences_Category || '').trim();
      const locationType = String(item.Activity_Location_Type || '').trim();

      experiencesByCity[cityKey].push({
        id: item.id,
        name: actName,
        city: cityName,
        destination: destName,
        ppCost,
        description,
        templateDescription: description,
        category,
        locationType,
        guidedTour: false
      });
    });

    // Process Hotels
    rawHotels.forEach(item => {
      const hotelId = String(item.id || '');
      const fullRecord = detailedHotelsMap.get(hotelId) || item;
      const hotelName = String(fullRecord.Name || item.Name || '').trim();
      if (!hotelName) return;

      const cityName = String(fullRecord.City_Location || item.City_Location || '').trim();
      const destName = String(fullRecord.Destinations || item.Destinations || 'Rajasthan').trim();
      const destKey = destName.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (destName) destinationsSet.add(destName);
      if (cityName && destName) {
        if (!citiesByDestination[destKey]) citiesByDestination[destKey] = new Set();
        citiesByDestination[destKey].add(cityName);
      }

      const cityKey = (cityName || destName).toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!hotelsByCity[cityKey]) hotelsByCity[cityKey] = [];

      const category = String(fullRecord.Hotel_Category || item.Hotel_Category || 'Deluxe').trim();
      const rooms: any[] = [];
      const subform = Array.isArray(fullRecord.Room_Rates_Pricing) ? fullRecord.Room_Rates_Pricing : [];
      subform.forEach((r: any) => {
        // STRICT: Base Price comes ONLY from Base_Price or Base_Price_INR column
        const basePrice = Number(r.Base_Price) || Number(r.Base_Price_INR) || 0;
        const extraBed = Number(r.Extra_Bed) || Number(r.Extra_Bed_INR) || Number(r.Extra_Bed_Price) || 0;
        const childWithoutBed = Number(r.Child_without_bed) || 0;
        const pricePerNight = Number(r.Price_Per_Night) || 0;
        rooms.push({
          roomCategory: String(r.Room_Category || 'Deluxe Room').trim(),
          basePrice,
          pricePerNight,
          extraBedPrice: extraBed,
          childWithoutBed,
          description: String(r.Description_for_room || '').trim()
        });
      });

      // Sort rooms ascending by basePrice so lowest price room category is automatically first!
      rooms.sort((a, b) => (a.basePrice || 0) - (b.basePrice || 0));

      hotelsByCity[cityKey].push({
        id: item.id,
        hotelName,
        city: cityName,
        destination: destName,
        category,
        starRating: String(fullRecord.Hotel_Star_Rating || item.Hotel_Star_Rating || '').trim(),
        description: String(fullRecord.Description || item.Description || '').trim(),
        rooms
      });
    });

    // Process Vehicles
    const vehiclesList = rawVehicles.map(v => ({
      id: v.id,
      name: String(v.Name || '').trim(),
      state: String(v.State || '').trim(),
      cost: Number(v.Cost) || 0,
      minCapacity: Number(v.Min_Capacity) || 1,
      maxCapacity: Number(v.Max_Capacity) || 7
    })).filter(v => Boolean(v.name));

    // Convert sets to arrays
    const formattedCitiesByDest: Record<string, string[]> = {};
    for (const dKey in citiesByDestination) {
      formattedCitiesByDest[dKey] = Array.from(citiesByDestination[dKey]).sort();
    }

    const responsePayload = {
      success: true,
      source: 'Zoho CRM Modules',
      stats: {
        activitiesCount: rawActivities.length,
        hotelsCount: rawHotels.length,
        vehiclesCount: vehiclesList.length
      },
      destinations: Array.from(destinationsSet).sort(),
      citiesByDestination: formattedCitiesByDest,
      experiencesByCity,
      hotelsByCity,
      vehicles: vehiclesList
    };

    cachedMasterData = responsePayload;
    lastCacheTime = Date.now();

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('[Zoho Master Data API Error]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error fetching Zoho master data' },
      { status: 500 }
    );
  }
}
