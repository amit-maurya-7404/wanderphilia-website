/**
 * Zoho CRM Lead Pricing & Quotation Engine
 * Faithfully mirrors the Zoho Deluge automation function:
 * void automation.calculateLeadPricingAndItinerary1(Int leadId)
 *
 * Implements:
 * 1. Adults & Base Setup (Sharing Type Double / Triple paxPerRoom)
 * 2. Kids & Age / Bed Preference Analysis (Child 1-5 Age, Bed Preference, Transport Kids > 3, Kids > 5)
 * 3. Strict Room & Extra Bed Logic (Max 3 per room capacity, extra rooms added, odd adults double sharing)
 * 4. Hotel Cost Calculation (Room Rates Pricing subform: Base_Price, Extra_Bed, Child_without_bed)
 * 5. Vehicle Cost Calculation (Min/Max capacity check, dailyCost * tripDays, perHeadTransportCost)
 * 6. Activities & Guided Tour Cost Calculation (Guided Tour ₹2000/day, SIC vs Private cost distribution, Kids <=5 vs Kids >5)
 * 7. Final Quotation & Exact Match Per-Person Cost Distribution (childHotelShare, perChildCost, perAdultCost)
 */

import { getZohoAccessToken, getZohoApiUrl } from './zoho';

export interface ChildPreference {
  age?: number;
  bedPreference?: string; // 'Extra Bed' | 'Without Bed' | 'With Bed' | 'Crib' | string
}

export interface PricingCalculationResult {
  roomsCount: number;
  baseRooms: number;
  extraRoomsAdded: number;
  extraBedCount: number;
  billableExtraBeds: number;
  childWithoutBedCount: number;
  transportKidsCount: number;
  kidsAbove5Count: number;
  totalTransportPax: number;
  totalGuestsCount: number;
  // Subtotals
  totalHotelsCost: number;
  currentHotelExtraBedCostTotal: number;
  currentHotelChildNoBedCostTotal: number;
  totalVehicleCost: number;
  perHeadTransportCost: number;
  totalActivitiesCost: number;
  totalAdultActivitiesCost: number;
  totalChildActivitiesCost: number;
  totalGuideCost: number;
  perHeadGuideShare: number;
  // Final Quotations
  finalQuotation: number;
  childHotelShare: number;
  perChildCost: number;
  perAdultCost: number;
  // Selected Vehicle
  selectedVehicleId?: string;
  selectedVehicleName?: string;
  vehicleDailyCost?: number;
  // Hotel Breakdown
  hotelBreakdowns: Array<{
    hotelIndex: number;
    hotelName: string;
    hotelId?: string;
    targetCat: string;
    matchedRate: number;
    extraBedRate: number;
    childNoBedRate: number;
    nights: number;
    hotelRoomTotal: number;
    extraBedCost: number;
    childNoBedCost: number;
    singleHotelTotal: number;
  }>;
  // Activity Breakdown
  activityBreakdowns: Array<{
    dayNumber: number;
    activityName: string;
    activityId?: string;
    isGuided: boolean;
    adultItemPrice: number;
    childItemPrice: number;
    privateItemCost: number;
    isPrivate: boolean;
    rowActivityCost: number;
  }>;
  // Zoho update map payload
  updateMap: Record<string, any>;
}

/**
 * Rounds a number to 2 decimal places
 */
export function round2(val: number): number {
  return Math.round((Number(val) || 0) * 100) / 100;
}

/**
 * Robust bed preference check matching Deluge:
 * containsIgnoreCase("Extra Bed") -> extra bed
 * containsIgnoreCase("Without Bed") -> without bed
 */
export function isExtraBed(bedVal: any): boolean {
  if (!bedVal) return false;
  const s = String(bedVal).toLowerCase();
  return s.includes('extra bed') || s === 'with bed';
}

export function isWithoutBed(bedVal: any): boolean {
  if (!bedVal) return false;
  const s = String(bedVal).toLowerCase();
  return s.includes('without bed') || s === 'no bed' || s === 'crib';
}

/**
 * STRICT ROOM & EXTRA BED LOGIC (CAPACITY BASED - MAX 3 PER ROOM)
 * Directly implements Section 3 of Deluge automation:
 * - baseRooms = (adults / paxPerRoom).floor() || 1
 * - totalPersons = adults + extraBedCount
 * - maxCapacityCurrentRooms = totalRooms * 3
 * - if (totalPersons > maxCapacityCurrentRooms) extraNeeded = ((totalPersons - maxCapacityCurrentRooms + 2) / 3).floor()
 * - if (Double && adults > 1 && adults % 2 != 0 && totalKidsCount == 0) extraBedCount++
 * - billableExtraBeds = extraRoomsAdded > 0 ? max(0, extraBedCount - extraRoomsAdded) : extraBedCount
 */
export function calculateRoomsAndBeds(params: {
  adults: number;
  sharingType: string;
  totalKidsCount: number;
  initialExtraBedCount: number;
}): {
  baseRooms: number;
  totalRooms: number;
  extraRoomsAdded: number;
  extraBedCount: number;
  billableExtraBeds: number;
} {
  let adults = Math.max(1, Number(params.adults) || 1);
  const sharingType = String(params.sharingType || 'Double Sharing');
  const paxPerRoom = sharingType.toLowerCase().includes('triple') ? 3 : 2;
  let extraBedCount = Math.max(0, Number(params.initialExtraBedCount) || 0);
  const totalKidsCount = Math.max(0, Number(params.totalKidsCount) || 0);

  let baseRooms = Math.floor(adults / paxPerRoom);
  if (baseRooms <= 0) {
    baseRooms = 1;
  }
  let totalRooms = baseRooms;

  // Rule: Har room mein max 2 base adults + 1 extra bed = 3 persons aa sakte hain.
  // Agar (Adults + Extra Beds) ki total sankhya (totalRooms * 3) se zyada hai, toh rooms badhane padenge.
  const totalPersons = adults + extraBedCount;
  const maxCapacityCurrentRooms = totalRooms * 3;
  if (totalPersons > maxCapacityCurrentRooms) {
    const extraNeeded = Math.floor((totalPersons - maxCapacityCurrentRooms + 2) / 3);
    totalRooms = totalRooms + extraNeeded;
  }

  // Odd adults in Double Sharing with 0 kids:
  if (sharingType.toLowerCase().includes('double') && adults > 1 && adults % 2 !== 0 && totalKidsCount === 0) {
    extraBedCount = extraBedCount + 1;
  }

  if (totalRooms <= 0) {
    totalRooms = 1;
  }

  let billableExtraBeds = extraBedCount;
  const extraRoomsAdded = totalRooms - baseRooms;
  if (extraRoomsAdded > 0) {
    billableExtraBeds = extraBedCount - extraRoomsAdded;
    if (billableExtraBeds < 0) {
      billableExtraBeds = 0;
    }
  } else if (extraRoomsAdded === 0 && extraBedCount > 0) {
    billableExtraBeds = extraBedCount;
  }

  return {
    baseRooms,
    totalRooms,
    extraRoomsAdded,
    extraBedCount,
    billableExtraBeds
  };
}

/**
 * Live Deluge execution against Zoho CRM APIs
 * void automation.calculateLeadPricingAndItinerary1(Int leadId)
 */
export async function calculateLeadPricingAndItinerary1(
  leadRecordOrId: string | Record<string, any>,
  providedToken?: string,
  options?: { updateZoho?: boolean }
): Promise<PricingCalculationResult> {
  const token = providedToken || (await getZohoAccessToken());
  const fetchHeaders = {
    'Authorization': `Zoho-oauthtoken ${token}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };

  let leadRecord: Record<string, any>;
  let leadId: string = '';

  if (typeof leadRecordOrId === 'string') {
    leadId = leadRecordOrId.trim();
    const url = getZohoApiUrl(`/crm/v3/Leads/${leadId}`);
    const res = await fetch(url, { headers: fetchHeaders, cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch lead ${leadId}: HTTP ${res.status}`);
    }
    const json = await res.json();
    if (!json.data || !json.data[0]) {
      throw new Error(`Lead ${leadId} not found in Zoho CRM.`);
    }
    leadRecord = json.data[0];
  } else {
    leadRecord = leadRecordOrId;
    leadId = String(leadRecord.id || '');
  }

  const updateMap: Record<string, any> = {};

  // -------------------------------------------------------------
  // 1. ADULTS & BASE SETUP
  // -------------------------------------------------------------
  let adults = Number(leadRecord.Adults);
  if (isNaN(adults) || adults <= 0) {
    adults = Number(leadRecord.Number_Of_Adults) || 1;
  }
  if (adults <= 0) {
    adults = 1;
  }

  let tripDays = Number(leadRecord.No_of_Days);
  if (isNaN(tripDays) || tripDays <= 0) {
    tripDays = 1;
  }

  const sharingType = String(leadRecord.Sharing_Type || 'Double Sharing');
  let paxPerRoom = 2;
  if (sharingType.toLowerCase().includes('triple')) {
    paxPerRoom = 3;
  }

  let globalTargetCat = String(leadRecord.Hotel_Category || leadRecord.Preferred_Room_Category || 'Deluxe').trim();
  if (globalTargetCat === '' || globalTargetCat === '-None-') {
    globalTargetCat = 'Deluxe';
  }

  // -------------------------------------------------------------
  // 2. KIDS & AGE/BED PREFERENCE ANALYSIS (ROBUST CHECK)
  // -------------------------------------------------------------
  const kidsCountVal = leadRecord.Kids_Age;
  let totalKidsCount = 0;
  if (kidsCountVal !== null && kidsCountVal !== undefined && String(kidsCountVal).trim() !== '' && !isNaN(Number(kidsCountVal))) {
    totalKidsCount = Number(kidsCountVal);
  } else if (leadRecord.Kids !== undefined && !isNaN(Number(leadRecord.Kids))) {
    totalKidsCount = Number(leadRecord.Kids);
  } else if (leadRecord.Number_Of_Children !== undefined && !isNaN(Number(leadRecord.Number_Of_Children))) {
    totalKidsCount = Number(leadRecord.Number_Of_Children);
  }

  const childAgeFields = ['Child_1_Age', 'Child_2_Age', 'Child_3_Age', 'Child_4_Age', 'Child_5_Age'];
  const childBedFields = ['Child_1_Bed_Preference', 'Child_2_Bed_Preferences', 'Child_3_Bed_Preference', 'Child_4_Bed_Preference', 'Child_5_Bed_Preference'];

  let extraBedCount = 0;
  let childWithoutBedCount = 0;
  let transportKidsCount = 0;
  let kidsAbove5Count = 0;

  if (totalKidsCount > 0) {
    for (let kIndex = 1; kIndex <= Math.min(totalKidsCount, 5); kIndex++) {
      const cField = childBedFields[kIndex - 1];
      const bedVal = leadRecord[cField] ?? leadRecord[`Child_${kIndex}_Bed_Preference`];
      if (bedVal && String(bedVal).trim() !== '') {
        const bedStr = String(bedVal);
        if (isExtraBed(bedStr)) {
          extraBedCount += 1;
        } else if (isWithoutBed(bedStr)) {
          childWithoutBedCount += 1;
        }
      }

      const ageField = childAgeFields[kIndex - 1];
      const ageVal = leadRecord[ageField];
      let childAgeNum = 0;
      if (ageVal !== null && ageVal !== undefined && !isNaN(Number(ageVal))) {
        childAgeNum = Number(ageVal);
      }
      if (childAgeNum > 3) {
        transportKidsCount += 1;
      }
      if (childAgeNum > 5) {
        kidsAbove5Count += 1;
      }
    }
  }

  // -------------------------------------------------------------
  // 3. STRICT ROOM & EXTRA BED LOGIC (CAPACITY BASED - MAX 3 PER ROOM)
  // -------------------------------------------------------------
  const roomCalc = calculateRoomsAndBeds({
    adults,
    sharingType,
    totalKidsCount,
    initialExtraBedCount: extraBedCount
  });

  const baseRooms = roomCalc.baseRooms;
  const totalRooms = roomCalc.totalRooms;
  const extraRoomsAdded = roomCalc.extraRoomsAdded;
  extraBedCount = roomCalc.extraBedCount;
  const billableExtraBeds = roomCalc.billableExtraBeds;

  updateMap['Rooms_Count'] = totalRooms;

  let totalTransportPax = adults + transportKidsCount;
  if (totalTransportPax <= 0) {
    totalTransportPax = 1;
  }

  // -------------------------------------------------------------
  // 4. HOTEL COST CALCULATION (ACCUMULATOR FIX)
  // -------------------------------------------------------------
  const hotelsList = [
    { lookup: 'Hotel_1', nights: 'Hotel_1_Nights', cat: 'Hotel_1_Category' },
    { lookup: 'Hotel_2', nights: 'Hotel_2_Nights', cat: 'Hotel_2_Category' },
    { lookup: 'Hotel_3', nights: 'Hotel_3_Nights', cat: 'Hotel_3_Category' },
    { lookup: 'Hotel_4', nights: 'Hotel_4_Nights', cat: 'Hotel_4_Category' },
    { lookup: 'th_Hotel', nights: 'Hotel_5_Nights', cat: 'Hotel_5_Category', fallbackLookup: 'Hotel_5' },
    { lookup: 'th_Hotel1', nights: 'Hotel_6_Nights', cat: 'Hotel_6_Category', fallbackLookup: 'Hotel_6' }
  ];

  let totalHotelsCost = 0.0;
  let currentHotelExtraBedCostTotal = 0.0;
  let currentHotelChildNoBedCostTotal = 0.0;
  const hotelBreakdowns: PricingCalculationResult['hotelBreakdowns'] = [];

  for (let idx = 0; idx < hotelsList.length; idx++) {
    const h = hotelsList[idx];
    const hLookup = leadRecord[h.lookup] ?? (h.fallbackLookup ? leadRecord[h.fallbackLookup] : null);
    const nightCount = Number(leadRecord[h.nights] || 0);
    const hotelSpecificCat = String(leadRecord[h.cat] || '').trim();
    const targetCat = hotelSpecificCat !== '' && hotelSpecificCat !== '-None-' ? hotelSpecificCat : globalTargetCat;

    if (hLookup && String(hLookup).trim() !== '' && String(hLookup).trim() !== 'null' && nightCount > 0) {
      let hotelId: string | null = null;
      let hotelName = 'Hotel';
      if (typeof hLookup === 'object' && hLookup !== null) {
        hotelId = hLookup.id ? String(hLookup.id) : null;
        hotelName = hLookup.name || hotelName;
      } else if (!isNaN(Number(hLookup))) {
        hotelId = String(hLookup);
      }

      if (hotelId) {
        try {
          const hUrl = getZohoApiUrl(`/crm/v3/Hotel/${hotelId}`);
          const hRes = await fetch(hUrl, { headers: fetchHeaders, cache: 'no-store' });
          if (hRes.ok) {
            const hJson = await hRes.json();
            const hRecord = hJson.data?.[0];
            if (hRecord) {
              hotelName = hRecord.Name || hotelName;
              const ratesSubform: any[] = hRecord.Room_Rates_Pricing || [];
              let matchedRate = 0.0;
              let extraBedRate = 0.0;
              let childNoBedRate = 0.0;

              if (ratesSubform && ratesSubform.length > 0) {
                const firstRow = ratesSubform[0];
                matchedRate = Number(firstRow.Base_Price || 0.0);
                extraBedRate = Number(firstRow.Extra_Bed || firstRow.Extra_Bed_INR || firstRow.Extra_Bed_Price || 0.0);
                childNoBedRate = Number(firstRow.Child_without_bed || 0.0);

                for (const row of ratesSubform) {
                  const rowCat = String(row.Room_Category || '').trim();
                  const rowPrice = Number(row.Base_Price || 0.0);
                  const rowExtraBed = Number(row.Extra_Bed || row.Extra_Bed_INR || row.Extra_Bed_Price || 0.0);
                  if (rowExtraBed > 0.0) {
                    extraBedRate = rowExtraBed;
                  }
                  const rowChildBed = Number(row.Child_without_bed || 0.0);
                  if (rowChildBed > 0.0) {
                    childNoBedRate = rowChildBed;
                  }
                  if (targetCat !== '' && rowCat.toLowerCase() === targetCat.toLowerCase() && rowPrice > 0.0) {
                    matchedRate = rowPrice;
                    break;
                  }
                }
              }

              const hotelRoomTotal = matchedRate * totalRooms * nightCount;
              const currentHotelExtraBedCost = extraBedRate * billableExtraBeds * nightCount;
              const currentHotelChildNoBedCost = childNoBedRate * childWithoutBedCount * nightCount;

              currentHotelExtraBedCostTotal += currentHotelExtraBedCost;
              currentHotelChildNoBedCostTotal += currentHotelChildNoBedCost;

              const singleHotelTotal = round2(hotelRoomTotal + currentHotelExtraBedCost + currentHotelChildNoBedCost);
              totalHotelsCost += singleHotelTotal;

              hotelBreakdowns.push({
                hotelIndex: idx + 1,
                hotelName,
                hotelId,
                targetCat,
                matchedRate,
                extraBedRate,
                childNoBedRate,
                nights: nightCount,
                hotelRoomTotal,
                extraBedCost: currentHotelExtraBedCost,
                childNoBedCost: currentHotelChildNoBedCost,
                singleHotelTotal
              });
            }
          }
        } catch (e) {
          console.warn(`[Zoho Hotel Rate Fetch Error for ${hotelId}]:`, e);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // 5. VEHICLE COST CALCULATION
  // -------------------------------------------------------------
  let totalVehicleCost = 0.0;
  let selectedVehicleRecord: any = null;
  let selectedVehicleId: string | null = null;
  let selectedVehicleName = '';

  try {
    const vData = leadRecord.Vehicle_Type;
    let vehSearchName = '';
    if (vData !== null && vData !== undefined && String(vData).trim() !== '') {
      if (typeof vData === 'object' && vData !== null) {
        vehSearchName = vData.name || '';
        selectedVehicleId = vData.id ? String(vData.id) : null;
      } else if (!isNaN(Number(vData))) {
        selectedVehicleId = String(vData);
      } else {
        vehSearchName = String(vData).trim();
      }

      if (selectedVehicleId) {
        try {
          const vUrl = getZohoApiUrl(`/crm/v3/Vehicles/${selectedVehicleId}`);
          const vRes = await fetch(vUrl, { headers: fetchHeaders, cache: 'no-store' });
          if (vRes.ok) {
            const vJson = await vRes.json();
            const tempRec = vJson.data?.[0];
            if (tempRec) {
              const minCap = Number(tempRec.Min_Capacity || 0);
              const maxCap = Number(tempRec.Max_Capacity || 99);
              if (totalTransportPax < minCap || totalTransportPax > maxCap) {
                selectedVehicleId = null;
                selectedVehicleRecord = null;
              } else {
                selectedVehicleRecord = tempRec;
                selectedVehicleName = tempRec.Name || '';
              }
            }
          }
        } catch {
          selectedVehicleId = null;
        }
      } else if (vehSearchName !== '') {
        try {
          const sCrit = encodeURIComponent(`(Name:equals:${vehSearchName})`);
          const vSearchUrl = getZohoApiUrl(`/crm/v3/Vehicles/search?criteria=${sCrit}`);
          const sRes = await fetch(vSearchUrl, { headers: fetchHeaders, cache: 'no-store' });
          if (sRes.ok) {
            const sJson = await sRes.json();
            if (sJson.data && sJson.data[0]) {
              const tempRec = sJson.data[0];
              const minCap = Number(tempRec.Min_Capacity || 0);
              const maxCap = Number(tempRec.Max_Capacity || 99);
              if (totalTransportPax < minCap || totalTransportPax > maxCap) {
                selectedVehicleId = null;
                selectedVehicleRecord = null;
              } else {
                selectedVehicleRecord = tempRec;
                selectedVehicleId = String(tempRec.id);
                selectedVehicleName = tempRec.Name || vehSearchName;
              }
            }
          }
        } catch {
          selectedVehicleId = null;
        }
      }
    }

    // Auto-match vehicle by State/Destination if not selected or disqualified
    if (!selectedVehicleRecord && !selectedVehicleId) {
      let leadDestination = String(leadRecord.Destinations || leadRecord.Destination || '').trim();
      if (leadDestination !== '' && leadDestination !== '-None-') {
        try {
          const sCrit = encodeURIComponent(`(State:equals:${leadDestination})`);
          const vListUrl = getZohoApiUrl(`/crm/v3/Vehicles/search?criteria=${sCrit}`);
          const vlRes = await fetch(vListUrl, { headers: fetchHeaders, cache: 'no-store' });
          if (vlRes.ok) {
            const vlJson = await vlRes.json();
            const vehiclesList: any[] = vlJson.data || [];
            for (const v of vehiclesList) {
              const minCap = Number(v.Min_Capacity || 0);
              const maxCap = Number(v.Max_Capacity || 99);
              if (totalTransportPax >= minCap && totalTransportPax <= maxCap) {
                selectedVehicleRecord = v;
                selectedVehicleId = String(v.id);
                selectedVehicleName = v.Name || '';
                break;
              }
            }
          }
        } catch (e) {
          console.warn('[Zoho Vehicle Auto Search Error]:', e);
        }
      }
    }

    let dailyCost = 0.0;
    if (selectedVehicleRecord) {
      dailyCost = Number(selectedVehicleRecord.Cost || 0.0);
    } else if (selectedVehicleId) {
      try {
        const vUrl = getZohoApiUrl(`/crm/v3/Vehicles/${selectedVehicleId}`);
        const vRes = await fetch(vUrl, { headers: fetchHeaders, cache: 'no-store' });
        if (vRes.ok) {
          const vJson = await vRes.json();
          dailyCost = Number(vJson.data?.[0]?.Cost || 0.0);
        }
      } catch {
        dailyCost = 0.0;
      }
    }

    if (selectedVehicleId) {
      updateMap['Vehicle_Type'] = Number(selectedVehicleId);
    }

    if (tripDays > 0) {
      totalVehicleCost = dailyCost * tripDays;
    }
  } catch (e) {
    console.warn('[Vehicle Calculation Error]:', e);
  }

  let perHeadTransportCost = 0.0;
  if (totalVehicleCost > 0 && totalTransportPax > 0) {
    // Vehicle cost divided among Adults and kids > 3 years
    perHeadTransportCost = round2(totalVehicleCost / totalTransportPax);
  }

  // -------------------------------------------------------------
  // 6. ACTIVITIES & GUIDED TOUR COST CALCULATION (SIC & PRIVATE LOGIC)
  // -------------------------------------------------------------
  let totalGuestsCount = adults + totalKidsCount;
  if (totalGuestsCount <= 0) {
    totalGuestsCount = 1;
  }

  let totalActivitiesCost = 0.0;
  let totalAdultActivitiesCost = 0.0;
  let totalChildActivitiesCost = 0.0;
  let totalGuideCost = 0.0;
  const activityBreakdowns: PricingCalculationResult['activityBreakdowns'] = [];

  const calcSubform: any[] = leadRecord.Activities_and_Experiences_1 || [];
  const expCols = ['Experiences_and_activities', 'Experiences_2', 'Experiences_3', 'Experiences_4'];

  if (calcSubform && Array.isArray(calcSubform) && calcSubform.length > 0) {
    for (let dayIdx = 0; dayIdx < calcSubform.length; dayIdx++) {
      const actRow = calcSubform[dayIdx];
      const isGuided = actRow.Guided_Tour === true || String(actRow.Guided_Tour).toLowerCase() === 'true';
      if (isGuided) {
        totalGuideCost += 2000.0;
      }

      for (const col of expCols) {
        const expObj = actRow[col];
        if (expObj !== null && expObj !== undefined && String(expObj).trim() !== '' && String(expObj).trim() !== '-None-') {
          let targetId: string | null = null;
          let targetName = '';

          if (typeof expObj === 'object' && expObj !== null) {
            targetId = expObj.id ? String(expObj.id) : null;
            targetName = expObj.name || '';
          } else if (!isNaN(Number(expObj))) {
            targetId = String(expObj);
          } else {
            targetName = String(expObj).trim();
          }

          let adultItemPrice = 0.0;
          let childItemPrice = 0.0;
          let privateItemCost = 0.0;

          if (targetId) {
            try {
              const actUrl = getZohoApiUrl(`/crm/v3/Activities_and_Experiences/${targetId}`);
              const actRes = await fetch(actUrl, { headers: fetchHeaders, cache: 'no-store' });
              if (actRes.ok) {
                const actJson = await actRes.json();
                const rec = actJson.data?.[0];
                if (rec) {
                  adultItemPrice = Number(rec.Cost_Per_Person || 0.0);
                  childItemPrice = Number(rec.Cost_per_child || 0.0);
                  privateItemCost = Number(rec.Private_Cost || 0.0);
                  if (targetName === '') {
                    targetName = rec.Name || rec.Activity_Name || 'Activity';
                  }
                }
              }
            } catch {
              // Ignore lookup failure
            }
          }

          if (adultItemPrice === 0.0 && privateItemCost === 0.0 && targetName !== '') {
            try {
              const sCrit = encodeURIComponent(`(Name:equals:${targetName})`);
              const aSearchUrl = getZohoApiUrl(`/crm/v3/Activities_and_Experiences/search?criteria=${sCrit}`);
              const asRes = await fetch(aSearchUrl, { headers: fetchHeaders, cache: 'no-store' });
              if (asRes.ok) {
                const asJson = await asRes.json();
                if (asJson.data && asJson.data[0]) {
                  const sRec = asJson.data[0];
                  adultItemPrice = Number(sRec.Cost_Per_Person || 0.0);
                  childItemPrice = Number(sRec.Cost_per_child || 0.0);
                  privateItemCost = Number(sRec.Private_Cost || 0.0);
                }
              }
            } catch {
              // Ignore search failure
            }
          }

          let rowActivityCost = 0.0;
          let isPrivate = false;

          // Agar SIC (Per Person) cost available nahi hai, toh Private Cost ko sabhi guests mein equally divide karenge
          if (adultItemPrice === 0.0 && privateItemCost > 0.0) {
            isPrivate = true;
            if (totalGuestsCount > 0) {
              rowActivityCost = privateItemCost;
              const privatePerHeadShare = round2(privateItemCost / totalGuestsCount);
              totalAdultActivitiesCost += privatePerHeadShare;
              totalChildActivitiesCost += privatePerHeadShare;
            }
          } else {
            let kids5AndUnderCount = transportKidsCount - kidsAbove5Count;
            if (kids5AndUnderCount < 0) {
              kids5AndUnderCount = 0;
            }
            const effectiveAdultsCount = adults + kidsAbove5Count;
            rowActivityCost = effectiveAdultsCount * adultItemPrice + kids5AndUnderCount * childItemPrice;
            totalAdultActivitiesCost += adultItemPrice;
            if (kids5AndUnderCount > 0) {
              totalChildActivitiesCost += childItemPrice;
            }
          }

          totalActivitiesCost += rowActivityCost;

          activityBreakdowns.push({
            dayNumber: dayIdx + 1,
            activityName: targetName || 'Activity',
            activityId: targetId || undefined,
            isGuided,
            adultItemPrice,
            childItemPrice,
            privateItemCost,
            isPrivate,
            rowActivityCost
          });
        }
      }
    }
  }

  totalGuestsCount = adults + totalKidsCount;
  if (totalGuestsCount <= 0) {
    totalGuestsCount = 1;
  }

  let perHeadGuideShare = 0.0;
  if (totalGuideCost > 0 && totalGuestsCount > 0) {
    // Guide cost divided equally among all adults and all kids (any age)
    perHeadGuideShare = round2(totalGuideCost / totalGuestsCount);
  }

  // -------------------------------------------------------------
  // 7. FINAL QUOTATION & PERFECT MATCH PER-PERSON COST DISTRIBUTION
  // -------------------------------------------------------------
  const finalQuotation = round2(totalHotelsCost + totalVehicleCost + totalActivitiesCost + totalGuideCost);
  updateMap['Final_Quotation_Amount'] = finalQuotation;

  // Pehle per child cost define karenge (Hotel extra bed share + transport + activities + guide)
  let childHotelShare = 0.0;
  if (totalKidsCount > 0) {
    childHotelShare = round2((currentHotelExtraBedCostTotal + currentHotelChildNoBedCostTotal) / totalKidsCount);
  }
  const perChildCost = round2(childHotelShare + perHeadTransportCost + totalChildActivitiesCost + perHeadGuideShare);

  // Ab bacha hua poora amount adults mein barabar divide hoga taaki total match ho jaye
  const totalChildCostTotal = perChildCost * totalKidsCount;
  const remainingForAdults = finalQuotation - totalChildCostTotal;
  let perAdultCost = 0.0;
  if (adults > 0) {
    perAdultCost = round2(remainingForAdults / adults);
  }

  updateMap['Per_Adult_Cost'] = perAdultCost;
  updateMap['Per_Child_Cost'] = perChildCost;

  // Optional: Update Zoho CRM Leads module directly
  if (options?.updateZoho && leadId) {
    try {
      const putUrl = getZohoApiUrl(`/crm/v3/Leads/${leadId}`);
      await fetch(putUrl, {
        method: 'PUT',
        headers: {
          ...fetchHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: [updateMap] })
      });
    } catch (e) {
      console.error('[Error updating Zoho Lead calculations]:', e);
    }
  }

  return {
    roomsCount: totalRooms,
    baseRooms,
    extraRoomsAdded,
    extraBedCount,
    billableExtraBeds,
    childWithoutBedCount,
    transportKidsCount,
    kidsAbove5Count,
    totalTransportPax,
    totalGuestsCount,
    totalHotelsCost: round2(totalHotelsCost),
    currentHotelExtraBedCostTotal: round2(currentHotelExtraBedCostTotal),
    currentHotelChildNoBedCostTotal: round2(currentHotelChildNoBedCostTotal),
    totalVehicleCost: round2(totalVehicleCost),
    perHeadTransportCost,
    totalActivitiesCost: round2(totalActivitiesCost),
    totalAdultActivitiesCost: round2(totalAdultActivitiesCost),
    totalChildActivitiesCost: round2(totalChildActivitiesCost),
    totalGuideCost: round2(totalGuideCost),
    perHeadGuideShare,
    finalQuotation,
    childHotelShare,
    perChildCost,
    perAdultCost,
    selectedVehicleId: selectedVehicleId || undefined,
    selectedVehicleName: selectedVehicleName || undefined,
    vehicleDailyCost: tripDays > 0 ? totalVehicleCost / tripDays : 0,
    hotelBreakdowns,
    activityBreakdowns,
    updateMap
  };
}

/**
 * OFFLINE / CLIENT-SIDE COMPATIBLE DELUGE FORMULA ENGINE
 * Allows Sheet Itinerary subform and UI builders to calculate exact costs
 * instantly on the frontend without waiting for multiple CRM API roundtrips.
 */
export interface OfflinePricingInput {
  adults: number;
  kids: number;
  noOfDays: number;
  sharingType?: string;
  globalTargetCat?: string;
  kidsDetails?: Array<{ age: number; bedPreference: string }>;
  hotels: Array<{
    hotelName?: string;
    city?: string;
    nights: number;
    category?: string;
    roomCategory?: string;
    roomRate?: number;
    extraBedRate?: number;
    childNoBedRate?: number;
  }>;
  vehicle?: {
    name?: string;
    dailyCost: number;
    minCapacity?: number;
    maxCapacity?: number;
  };
  dayRows: Array<{
    dayNumber: number;
    guidedTour?: boolean;
    activities: Array<{
      name?: string;
      costPerPerson?: number;
      costPerChild?: number;
      privateCost?: number;
    }>;
  }>;
}

export function calculateLeadPricingOffline(input: OfflinePricingInput): PricingCalculationResult {
  let adults = Math.max(1, Number(input.adults) || 1);
  const tripDays = Math.max(1, Number(input.noOfDays) || 1);
  const sharingType = String(input.sharingType || 'Double Sharing');
  const globalTargetCat = String(input.globalTargetCat || 'Deluxe').trim() || 'Deluxe';
  const totalKidsCount = Math.max(0, Number(input.kids) || 0);

  let extraBedCount = 0;
  let childWithoutBedCount = 0;
  let transportKidsCount = 0;
  let kidsAbove5Count = 0;

  const kidsList = input.kidsDetails || [];
  for (let i = 0; i < totalKidsCount; i++) {
    const k = kidsList[i] || { age: 6, bedPreference: 'Extra Bed' };
    if (isExtraBed(k.bedPreference)) {
      extraBedCount += 1;
    } else if (isWithoutBed(k.bedPreference)) {
      childWithoutBedCount += 1;
    }

    const age = Number(k.age) || 0;
    if (age > 3) transportKidsCount += 1;
    if (age > 5) kidsAbove5Count += 1;
  }

  // Room logic
  const roomCalc = calculateRoomsAndBeds({
    adults,
    sharingType,
    totalKidsCount,
    initialExtraBedCount: extraBedCount
  });

  const baseRooms = roomCalc.baseRooms;
  const totalRooms = roomCalc.totalRooms;
  const extraRoomsAdded = roomCalc.extraRoomsAdded;
  extraBedCount = roomCalc.extraBedCount;
  const billableExtraBeds = roomCalc.billableExtraBeds;

  const totalTransportPax = Math.max(1, adults + transportKidsCount);

  // Hotel Costs
  let totalHotelsCost = 0.0;
  let currentHotelExtraBedCostTotal = 0.0;
  let currentHotelChildNoBedCostTotal = 0.0;
  const hotelBreakdowns: PricingCalculationResult['hotelBreakdowns'] = [];

  const DEFAULT_RATES: Record<string, { base: number; extraBed: number; childNoBed: number }> = {
    standard: { base: 2500, extraBed: 1000, childNoBed: 0 },
    deluxe: { base: 3500, extraBed: 1200, childNoBed: 0 },
    superdeluxe: { base: 5000, extraBed: 1600, childNoBed: 0 },
    suite: { base: 6500, extraBed: 2000, childNoBed: 0 },
    premium: { base: 7500, extraBed: 2500, childNoBed: 0 },
    luxury: { base: 12000, extraBed: 4000, childNoBed: 0 }
  };

  input.hotels.forEach((h, idx) => {
    const nights = Math.max(1, Number(h.nights) || 1);
    const cat = (h.category || globalTargetCat || 'Deluxe').trim();
    const catClean = cat.toLowerCase().replace(/[^a-z0-9]/g, '');
    const def = DEFAULT_RATES[catClean] || DEFAULT_RATES.deluxe;

    const matchedRate = Number(h.roomRate) || def.base;
    const extraBedRate = Number(h.extraBedRate) || def.extraBed;
    const childNoBedRate = Number(h.childNoBedRate) || def.childNoBed;

    const hotelRoomTotal = matchedRate * totalRooms * nights;
    const currentHotelExtraBedCost = extraBedRate * billableExtraBeds * nights;
    const currentHotelChildNoBedCost = childNoBedRate * childWithoutBedCount * nights;

    currentHotelExtraBedCostTotal += currentHotelExtraBedCost;
    currentHotelChildNoBedCostTotal += currentHotelChildNoBedCost;

    const singleHotelTotal = round2(hotelRoomTotal + currentHotelExtraBedCost + currentHotelChildNoBedCost);
    totalHotelsCost += singleHotelTotal;

    hotelBreakdowns.push({
      hotelIndex: idx + 1,
      hotelName: h.hotelName || `Hotel ${idx + 1}`,
      targetCat: cat,
      matchedRate,
      extraBedRate,
      childNoBedRate,
      nights,
      hotelRoomTotal,
      extraBedCost: currentHotelExtraBedCost,
      childNoBedCost: currentHotelChildNoBedCost,
      singleHotelTotal
    });
  });

  // Vehicle Costs
  let dailyCost = Number(input.vehicle?.dailyCost) || 4500;
  const totalVehicleCost = dailyCost * tripDays;
  const perHeadTransportCost = totalVehicleCost > 0 && totalTransportPax > 0
    ? round2(totalVehicleCost / totalTransportPax)
    : 0.0;

  // Activities & Guide Costs
  let totalGuestsCount = Math.max(1, adults + totalKidsCount);
  let totalActivitiesCost = 0.0;
  let totalAdultActivitiesCost = 0.0;
  let totalChildActivitiesCost = 0.0;
  let totalGuideCost = 0.0;
  const activityBreakdowns: PricingCalculationResult['activityBreakdowns'] = [];

  input.dayRows.forEach(row => {
    if (row.guidedTour) {
      totalGuideCost += 2000.0;
    }

    (row.activities || []).forEach(act => {
      const adultItemPrice = Number(act.costPerPerson) || 0.0;
      const childItemPrice = Number(act.costPerChild) || 0.0;
      const privateItemCost = Number(act.privateCost) || 0.0;

      let rowCost = 0.0;
      let isPrivate = false;

      if (adultItemPrice === 0.0 && privateItemCost > 0.0) {
        isPrivate = true;
        rowCost = privateItemCost;
        const privatePerHeadShare = round2(privateItemCost / totalGuestsCount);
        totalAdultActivitiesCost += privatePerHeadShare;
        totalChildActivitiesCost += privatePerHeadShare;
      } else {
        let kids5AndUnderCount = Math.max(0, transportKidsCount - kidsAbove5Count);
        const effectiveAdultsCount = adults + kidsAbove5Count;
        rowCost = effectiveAdultsCount * adultItemPrice + kids5AndUnderCount * childItemPrice;
        totalAdultActivitiesCost += adultItemPrice;
        if (kids5AndUnderCount > 0) {
          totalChildActivitiesCost += childItemPrice;
        }
      }

      totalActivitiesCost += rowCost;

      activityBreakdowns.push({
        dayNumber: row.dayNumber,
        activityName: act.name || 'Activity',
        isGuided: !!row.guidedTour,
        adultItemPrice,
        childItemPrice,
        privateItemCost,
        isPrivate,
        rowActivityCost: rowCost
      });
    });
  });

  const perHeadGuideShare = totalGuideCost > 0 && totalGuestsCount > 0
    ? round2(totalGuideCost / totalGuestsCount)
    : 0.0;

  // Final Quotation & Per-Person Cost Distribution
  const finalQuotation = round2(totalHotelsCost + totalVehicleCost + totalActivitiesCost + totalGuideCost);

  let childHotelShare = 0.0;
  if (totalKidsCount > 0) {
    childHotelShare = round2((currentHotelExtraBedCostTotal + currentHotelChildNoBedCostTotal) / totalKidsCount);
  }
  const perChildCost = round2(childHotelShare + perHeadTransportCost + totalChildActivitiesCost + perHeadGuideShare);

  const totalChildCostTotal = perChildCost * totalKidsCount;
  const remainingForAdults = finalQuotation - totalChildCostTotal;
  let perAdultCost = 0.0;
  if (adults > 0) {
    perAdultCost = round2(remainingForAdults / adults);
  }

  const updateMap: Record<string, any> = {
    Rooms_Count: totalRooms,
    Final_Quotation_Amount: finalQuotation,
    Per_Adult_Cost: perAdultCost,
    Per_Child_Cost: perChildCost
  };

  return {
    roomsCount: totalRooms,
    baseRooms,
    extraRoomsAdded,
    extraBedCount,
    billableExtraBeds,
    childWithoutBedCount,
    transportKidsCount,
    kidsAbove5Count,
    totalTransportPax,
    totalGuestsCount,
    totalHotelsCost: round2(totalHotelsCost),
    currentHotelExtraBedCostTotal: round2(currentHotelExtraBedCostTotal),
    currentHotelChildNoBedCostTotal: round2(currentHotelChildNoBedCostTotal),
    totalVehicleCost: round2(totalVehicleCost),
    perHeadTransportCost,
    totalActivitiesCost: round2(totalActivitiesCost),
    totalAdultActivitiesCost: round2(totalAdultActivitiesCost),
    totalChildActivitiesCost: round2(totalChildActivitiesCost),
    totalGuideCost: round2(totalGuideCost),
    perHeadGuideShare,
    finalQuotation,
    childHotelShare,
    perChildCost,
    perAdultCost,
    vehicleDailyCost: dailyCost,
    selectedVehicleName: input.vehicle?.name,
    hotelBreakdowns,
    activityBreakdowns,
    updateMap
  };
}
