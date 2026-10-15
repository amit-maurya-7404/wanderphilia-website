'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle2, ExternalLink, Download, Search, Hotel, Calendar, Users, MapPin, Percent, TrendingUp, IndianRupee } from 'lucide-react';
import { Parachute } from '@/components/parachute-icon';
import { ItineraryHistorySection } from '@/components/itinerary/itinerary-history-section';

export default function ItineraryTestPage() {
  const [leadQuery, setLeadQuery] = useState('');
  const [selectedOptionNumber, setSelectedOptionNumber] = useState<number>(1);
  const [existingOptions, setExistingOptions] = useState<any[]>([]);
  const [checkingOptions, setCheckingOptions] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  const [fetchingLead, setFetchingLead] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  // Base quotation from Zoho and manual margin percentage state
  const [baseQuotation, setBaseQuotation] = useState<string>('');
  const [marginPercent, setMarginPercent] = useState<string>('');
  const [basePerAdult, setBasePerAdult] = useState<string>('');
  const [basePerKid, setBasePerKid] = useState<string>('');

  const [formData, setFormData] = useState({
    First_Name: '',
    Last_Name: '',
    Full_Name: '',
    Email: '',
    Mobile: '',
    City: '',
    Destination: '',
    Destination_Type: 'India',
    Inquiry_ID: '',
    No_of_Days: '',
    No_of_Nights: '',
    Preferred_Start_date: '',
    Travel_End_Date: '',
    Number_Of_Guest: '2',
    Adults: '2',
    Kids: '0',
    Per_Adult_Price: '',
    Per_Kid_Price: '',
    Travel_Style: 'Family Trip',
    Trip_Type: 'Customised Trip',
    Hotel_Name: '',
    Room_Category: '',
    Meal_Plan: '',
    Final_Quotation_Amount: '',
    Costing_Request_Status: '',
    Special_Requirements: ''
  });

  const [rawLeadFull, setRawLeadFull] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Check existing itinerary options in database for this Lead ID
  const checkExistingOptionsForLead = async (query: string) => {
    const clean = query.trim();
    if (!clean || clean.length < 3) {
      setExistingOptions([]);
      setVerifyMessage(null);
      return;
    }

    setCheckingOptions(true);
    try {
      const res = await fetch(`/api/zoho/check-lead-options?query=${encodeURIComponent(clean)}&_t=${Date.now()}`, {
        cache: 'no-store'
      });
      const data = await res.json();

      if (data.success) {
        const optionsList = data.existingOptions || [];
        setExistingOptions(optionsList);
        const createdNums = optionsList.map((o: any) => o.optionNumber);

        // Auto-select first available option
        const nextAvailable = [1, 2, 3].find(num => !createdNums.includes(num));
        if (nextAvailable) {
          setSelectedOptionNumber(nextAvailable);
        }

        if (data.hasExisting) {
          setVerifyMessage(`✓ Verified: ${optionsList.length} Itinerary Option(s) already created for this Lead.`);
        } else {
          setVerifyMessage('✓ Fresh Lead — No existing itineraries found. Ready to create Option 1.');
        }
      }
    } catch (err) {
      console.warn('Error checking lead options:', err);
    } finally {
      setCheckingOptions(false);
    }
  };

  // Handle lead input change with debounced verify check
  const handleQueryChange = (val: string) => {
    setLeadQuery(val);
    if (val.trim().length >= 4) {
      checkExistingOptionsForLead(val);
    } else {
      setExistingOptions([]);
      setVerifyMessage(null);
    }
  };

  // Margin & Quotation calculation handlers
  const handleMarginChange = (val: string) => {
    setMarginPercent(val);
    const effectiveBase = Number(baseQuotation) || (Number(formData.Final_Quotation_Amount) ? Number(formData.Final_Quotation_Amount) : 0);

    if (!baseQuotation && formData.Final_Quotation_Amount) {
      setBaseQuotation(formData.Final_Quotation_Amount);
    }

    if (!val || isNaN(Number(val))) {
      setFormData(prev => ({
        ...prev,
        Final_Quotation_Amount: baseQuotation || prev.Final_Quotation_Amount,
        Per_Adult_Price: basePerAdult || prev.Per_Adult_Price,
        Per_Kid_Price: basePerKid || prev.Per_Kid_Price
      }));
      return;
    }

    const pct = Number(val);
    const finalAmount = effectiveBase > 0 ? Math.round(effectiveBase * (1 + pct / 100)) : 0;

    const bAdult = Number(basePerAdult) || 0;
    const finalAdult = bAdult > 0 ? Math.round(bAdult * (1 + pct / 100)) : undefined;

    const bKid = Number(basePerKid) || 0;
    const finalKid = bKid > 0 ? Math.round(bKid * (1 + pct / 100)) : undefined;

    setFormData(prev => ({
      ...prev,
      Final_Quotation_Amount: finalAmount > 0 ? String(finalAmount) : prev.Final_Quotation_Amount,
      Per_Adult_Price: finalAdult !== undefined ? String(finalAdult) : prev.Per_Adult_Price,
      Per_Kid_Price: finalKid !== undefined ? String(finalKid) : prev.Per_Kid_Price
    }));
  };

  const handleBaseQuotationChange = (val: string) => {
    setBaseQuotation(val);
    const baseNum = Number(val) || 0;
    const pct = Number(marginPercent) || 0;

    if (baseNum > 0 && pct > 0) {
      const finalAmount = Math.round(baseNum * (1 + pct / 100));
      setFormData(prev => ({ ...prev, Final_Quotation_Amount: String(finalAmount) }));
    } else {
      setFormData(prev => ({ ...prev, Final_Quotation_Amount: val }));
    }
  };

  const handleFinalQuotationChange = (val: string) => {
    setFormData(prev => ({ ...prev, Final_Quotation_Amount: val }));
    const finalNum = Number(val) || 0;
    const baseNum = Number(baseQuotation) || 0;

    if (baseNum > 0 && finalNum > 0) {
      if (finalNum > baseNum) {
        const pct = (((finalNum - baseNum) / baseNum) * 100).toFixed(1);
        setMarginPercent(pct.endsWith('.0') ? pct.slice(0, -2) : pct);
      } else if (finalNum === baseNum) {
        setMarginPercent('0');
      }
    } else if (!baseQuotation && finalNum > 0) {
      setBaseQuotation(val);
      setMarginPercent('0');
    }
  };

  const applyQuickMargin = (pct: number) => {
    handleMarginChange(String(pct));
  };

  // Fetch lead directly from Zoho CRM API
  const handleFetchFromZoho = async () => {
    if (!leadQuery.trim()) return;
    setFetchingLead(true);
    setError(null);
    setFetchSuccess(false);

    try {
      // Also ensure existing options are checked
      await checkExistingOptionsForLead(leadQuery);

      const res = await fetch(`/api/zoho/fetch-lead?query=${encodeURIComponent(leadQuery.trim())}&_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch lead from Zoho CRM');
      }

      const lead = data.lead;
      setRawLeadFull(lead);

      // Assemble hotels text dynamically from Zoho
      const hotelNames = lead.hotels && lead.hotels.length > 0
        ? lead.hotels.map((h: any) => `${h.hotelName}${h.city ? ` (${h.city})` : ''}${h.nights ? ` - ${h.nights}N` : ''}`).join(' + ')
        : (lead.hotelName || '');

      // Assemble activities summary dynamically from Zoho subform with complete details including City_2 and En_route_Experiences
      const experiencesSummary = lead.dayActivities && lead.dayActivities.length > 0
        ? lead.dayActivities.map((d: any) => {
          const routeText = d.city2
            ? `${d.city} to ${d.city2}${d.enRouteExperiences ? ` via ${d.enRouteExperiences}` : ''}`
            : (d.enRouteExperiences ? `${d.city} via ${d.enRouteExperiences}` : d.city);

          const expList = (d.experiences || []).map((e: any) => {
            const expName = e.name || e.experienceName || '';
            const desc = e.inclusionDescription || e.description || e.subTitle || '';
            return desc && desc.toLowerCase() !== expName.toLowerCase() ? `${expName} (${desc})` : expName;
          }).filter(Boolean);

          const expStr = expList.length > 0
            ? expList.join(' | ')
            : (d.enRouteExperiences ? `En-Route Visit to ${d.enRouteExperiences} & Departure Transfer` : (d.pdfDescription || 'Leisure & Sightseeing'));

          return `[${d.dayText}${routeText ? ` - ${routeText}` : ''}]: ${expStr}`;
        }).join('\n')
        : '';

      const totalDays = lead.noOfDays || (lead.dayActivities?.length || 0);
      const totalNights = lead.noOfNights || (totalDays > 1 ? totalDays - 1 : 0);

      const rawZohoQuote = lead.finalQuotationAmount ? String(lead.finalQuotationAmount) : '';
      setBaseQuotation(rawZohoQuote);

      const rawZohoAdult = lead.perAdultPrice ? String(lead.perAdultPrice) : '';
      const rawZohoKid = lead.perKidPrice ? String(lead.perKidPrice) : '';
      setBasePerAdult(rawZohoAdult);
      setBasePerKid(rawZohoKid);

      // Determine margin: if Zoho CRM has margin field use that, else use existing entered margin
      const effectiveMargin = lead.marginPercentage !== undefined ? String(lead.marginPercentage) : marginPercent;
      if (lead.marginPercentage !== undefined && !marginPercent) {
        setMarginPercent(effectiveMargin);
      }

      const mPct = Number(effectiveMargin) || 0;
      let calculatedFinal = rawZohoQuote;
      if (rawZohoQuote && mPct > 0) {
        calculatedFinal = String(Math.round(Number(rawZohoQuote) * (1 + mPct / 100)));
      }

      let calculatedAdult = rawZohoAdult;
      if (rawZohoAdult && mPct > 0) {
        calculatedAdult = String(Math.round(Number(rawZohoAdult) * (1 + mPct / 100)));
      }

      let calculatedKid = rawZohoKid;
      if (rawZohoKid && mPct > 0) {
        calculatedKid = String(Math.round(Number(rawZohoKid) * (1 + mPct / 100)));
      }

      const fetchedAdults = Number(lead.adults || 2);
      const fetchedKids = Number(lead.kids || 0);

      setFormData({
        First_Name: lead.firstName || '',
        Last_Name: lead.lastName || '',
        Full_Name: lead.leadName || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Valued Traveler',
        Email: lead.email || '',
        Mobile: lead.mobile || '',
        City: lead.city || '',
        Destination: lead.destinations || lead.city || '',
        Destination_Type: lead.destinationType || 'India',
        Inquiry_ID: lead.inquiryId || '',
        No_of_Days: totalDays > 0 ? String(totalDays) : '',
        No_of_Nights: totalNights > 0 ? String(totalNights) : '',
        Preferred_Start_date: lead.travelStartDate || '',
        Travel_End_Date: lead.travelEndDate || '',
        Number_Of_Guest: String(fetchedAdults + fetchedKids),
        Adults: String(fetchedAdults),
        Kids: String(fetchedKids),
        Per_Adult_Price: calculatedAdult,
        Per_Kid_Price: calculatedKid,
        Travel_Style: lead.travelStyle || 'Family Trip',
        Trip_Type: lead.tripType || 'Customised Trip',
        Hotel_Name: hotelNames,
        Room_Category: lead.preferredRoomCategory || '',
        Meal_Plan: lead.mealPlan || lead.rawLeadData?.Meal_Plan || '',
        Final_Quotation_Amount: calculatedFinal,
        Costing_Request_Status: lead.costingRequestStatus || '',
        Special_Requirements: experiencesSummary || lead.rawLeadData?.Specific_Requirements || lead.rawLeadData?.Description || ''
      });

      setFetchSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error fetching lead from Zoho CRM');
    } finally {
      setFetchingLead(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payloadToSend = {
        ...(rawLeadFull || {}),
        ...formData,
        optionNumber: selectedOptionNumber,
        name: formData.Full_Name,
        Full_Name: formData.Full_Name,
        First_Name: formData.First_Name,
        Last_Name: formData.Last_Name,
        Inquiry_ID: formData.Inquiry_ID,
        inquiryId: formData.Inquiry_ID,
        Email: formData.Email,
        Mobile: formData.Mobile,
        City: formData.City,
        Destination: formData.Destination,
        Destinations: formData.Destination,
        Destination_Type: formData.Destination_Type,
        destinationType: formData.Destination_Type,
        No_of_Days: Number(formData.No_of_Days) || 0,
        noOfDays: Number(formData.No_of_Days) || 0,
        No_of_Nights: Number(formData.No_of_Nights) || 0,
        noOfNights: Number(formData.No_of_Nights) || 0,
        Preferred_Start_date: formData.Preferred_Start_date,
        Travel_End_Date: formData.Travel_End_Date,
        Adults: Number(formData.Adults || 2),
        adults: Number(formData.Adults || 2),
        Kids: Number(formData.Kids || 0),
        kids: Number(formData.Kids || 0),
        Number_Of_Guest: Number(formData.Adults || 2) + Number(formData.Kids || 0),
        numberOfGuests: Number(formData.Adults || 2) + Number(formData.Kids || 0),
        Travel_Style: formData.Travel_Style,
        travelStyle: formData.Travel_Style,
        Trip_Type: formData.Trip_Type,
        tripType: formData.Trip_Type,
        Hotel_Name: formData.Hotel_Name,
        hotelName: formData.Hotel_Name,
        Room_Category: formData.Room_Category,
        preferredRoomCategory: formData.Room_Category,
        Preferred_Room_Category: formData.Room_Category,
        Meal_Plan: formData.Meal_Plan,
        mealPlan: formData.Meal_Plan,
        Special_Requirements: formData.Special_Requirements,
        specialRequirements: formData.Special_Requirements,
        activitiesText: formData.Special_Requirements,
        Final_Quotation_Amount: formData.Final_Quotation_Amount ? Number(formData.Final_Quotation_Amount) : undefined,
        finalQuotationAmount: formData.Final_Quotation_Amount ? Number(formData.Final_Quotation_Amount) : undefined,
        baseQuotationAmount: baseQuotation ? Number(baseQuotation) : undefined,
        marginPercentage: marginPercent ? Number(marginPercent) : 0,
        marginAmount: ((Number(formData.Final_Quotation_Amount) || 0) - (Number(baseQuotation) || 0)) || 0,
        Per_Adult_Price: formData.Per_Adult_Price ? Number(formData.Per_Adult_Price) : undefined,
        perAdultPrice: formData.Per_Adult_Price ? Number(formData.Per_Adult_Price) : undefined,
        Per_Kid_Price: formData.Per_Kid_Price ? Number(formData.Per_Kid_Price) : undefined,
        perKidPrice: formData.Per_Kid_Price ? Number(formData.Per_Kid_Price) : undefined
      };

      const response = await fetch('/api/webhook/zoho', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payloadToSend)
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      setResult(data);

      // Refresh existing options after creation
      if (leadQuery) {
        checkExistingOptionsForLead(leadQuery);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isSelectedOptionCreated = Boolean(existingOptions.find(o => o.optionNumber === selectedOptionNumber));

  const baseNum = Number(baseQuotation) || 0;
  const finalNum = Number(formData.Final_Quotation_Amount) || 0;
  const marginNum = Number(marginPercent) || 0;
  const marginAmount = baseNum > 0 && marginNum > 0
    ? Math.round(baseNum * (marginNum / 100))
    : (finalNum > baseNum ? finalNum - baseNum : 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-24 grow">

        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Parachute className="w-3.5 h-3.5 text-orange-600" />
            Zoho CRM Direct Integration
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fetch from Zoho CRM & AI Itinerary Generator
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Fetch any live lead directly from Zoho CRM using Lead ID or Inquiry ID, select option number (Option 1, 2, or 3), and generate the luxury proposal template!
          </p>
        </div>

        {/* 1. DIRECT ZOHO FETCH BAR & OPTION SELECTION */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700 mb-8 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs uppercase font-extrabold text-orange-400 tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Step 1: Enter Lead ID & Select Option
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter Zoho Lead ID (e.g. <span className="font-mono text-amber-300">843125000010916169</span>) or Inquiry ID (e.g. <span className="font-mono text-amber-300">WNDPQ349</span>)
              </p>
            </div>

            {checkingOptions && (
              <span className="inline-flex items-center gap-1 text-amber-300 text-xs font-semibold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Verifying Lead ID...
              </span>
            )}

            {!checkingOptions && verifyMessage && (
              <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${existingOptions.length > 0
                  ? 'text-amber-300 bg-amber-950/60 border-amber-500/40'
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                }`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> {verifyMessage}
              </span>
            )}
          </div>

          {/* INPUT BAR */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                value={leadQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
                onBlur={() => {
                  if (leadQuery.trim()) checkExistingOptionsForLead(leadQuery);
                }}
                placeholder="Enter Zoho Lead ID or Inquiry ID (e.g. 843125000010916169 or WNDPQ349)"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-xs sm:text-sm py-5 rounded-2xl focus:border-orange-500 w-full"
              />
            </div>

            <Button
              onClick={handleFetchFromZoho}
              disabled={fetchingLead || !leadQuery.trim() || isSelectedOptionCreated}
              className={`font-extrabold text-xs sm:text-sm px-6 py-5 rounded-2xl shadow-lg shrink-0 transition-all cursor-pointer ${isSelectedOptionCreated
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
                }`}
            >
              {fetchingLead ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Fetching Option {selectedOptionNumber}...
                </span>
              ) : isSelectedOptionCreated ? (
                <span>Option {selectedOptionNumber} Already Created</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Fetch from Zoho for Option {selectedOptionNumber}
                </span>
              )}
            </Button>
          </div>

          {/* 3 OPTION BUTTONS WITH VERIFICATION & DIRECT LINKS */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Select Option to Generate:</span>
              <span className="text-amber-400 text-[10px] lowercase">
                {existingOptions.length > 0 ? `${existingOptions.length} option(s) already exist` : 'fresh lead'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((optNum) => {
                const existing = existingOptions.find(o => o.optionNumber === optNum);
                const isCreated = Boolean(existing);
                const isSelected = selectedOptionNumber === optNum;

                return (
                  <div
                    key={optNum}
                    onClick={() => {
                      if (!isCreated) {
                        setSelectedOptionNumber(optNum);
                      }
                    }}
                    className={`relative rounded-2xl p-3.5 border transition-all duration-200 flex flex-col justify-between ${isCreated
                        ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-300'
                        : isSelected
                          ? 'bg-orange-500/20 border-orange-500 text-white ring-2 ring-orange-500/40 cursor-pointer scale-[1.02]'
                          : 'bg-white/5 border-white/10 hover:border-white/25 text-slate-300 hover:text-white cursor-pointer'
                      }`}
                  >
                    {/* TOP BADGE & DIRECT LINK */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isCreated
                          ? 'bg-emerald-900 text-emerald-300 border border-emerald-400/40'
                          : isSelected
                            ? 'bg-orange-500 text-white'
                            : 'bg-white/10 text-slate-300'
                        }`}>
                        Option {optNum}
                      </span>

                      {isCreated && existing && (
                        <a
                          href={existing.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-black text-amber-300 hover:text-amber-200 underline underline-offset-2 transition bg-black/40 px-2 py-0.5 rounded-md border border-amber-300/30"
                        >
                          <span>View Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* STATUS TEXT */}
                    <div className="space-y-0.5">
                      <div className="text-xs font-black text-white flex items-center gap-1">
                        {isCreated ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">Created ({existing?.id || existing?.slug})</span>
                          </>
                        ) : (
                          <span>Option {optNum} {optNum === 1 ? '(Base / Initial)' : optNum === 2 ? '(2nd Revision)' : '(3rd Upgrade)'}</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        {isCreated
                          ? 'Already generated. Click "View Link" above to open.'
                          : isSelected
                            ? `Active for Zoho Fetch & Generation`
                            : `Click to select Option ${optNum}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {rawLeadFull && (
            <div className="pt-2 text-xs text-slate-300 border-t border-white/10 flex flex-wrap items-center gap-4">
              <span><strong>Lead ID:</strong> {rawLeadFull.leadId}</span>
              <span><strong>Hotels:</strong> {rawLeadFull.hotels?.length || 0} Stays</span>
              <span><strong>Activities:</strong> {rawLeadFull.dayActivities?.length || 0} Days</span>
              <span><strong>Zoho Quote:</strong> ₹{rawLeadFull.finalQuotationAmount?.toLocaleString('en-IN') || 'Pending'}</span>
              {marginPercent && Number(marginPercent) > 0 && (
                <span className="text-emerald-300 font-semibold bg-emerald-950/70 border border-emerald-500/50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  Final ({marginPercent}% Margin): ₹{Number(formData.Final_Quotation_Amount || 0).toLocaleString('en-IN')}
                </span>
              )}
              <span><strong>Active Target:</strong> <span className="text-amber-300 font-bold font-mono">Option {selectedOptionNumber}</span></span>
            </div>
          )}
        </div>

        {/* 2. FORM DETAILS PREVIEW & GENERATE (CATEGORIZED ZOHO FIELDS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl mb-8">
          <div className="text-xs uppercase font-extrabold text-orange-600 tracking-wider mb-6 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Parachute className="w-4 h-4" /> Step 2: Review All Zoho CRM Fields & Generate Itinerary
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Section A: Lead & Contact Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-orange-600" /> 1. Traveler & Contact Info (Zoho Leads)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Traveler Full Name
                  </label>
                  <Input
                    value={formData.Full_Name}
                    onChange={(e) => setFormData({ ...formData, Full_Name: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Inquiry ID
                  </label>
                  <Input
                    value={formData.Inquiry_ID}
                    onChange={(e) => setFormData({ ...formData, Inquiry_ID: e.target.value })}
                    className="rounded-xl border-slate-200 font-mono font-bold text-orange-600"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Departure / Origin City
                  </label>
                  <Input
                    value={formData.City}
                    onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                    className="rounded-xl border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.Email}
                    onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                    className="rounded-xl border-slate-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Mobile / WhatsApp Phone
                  </label>
                  <Input
                    value={formData.Mobile}
                    onChange={(e) => setFormData({ ...formData, Mobile: e.target.value })}
                    className="rounded-xl border-slate-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Costing Status
                  </label>
                  <Input
                    value={formData.Costing_Request_Status || 'Pending'}
                    onChange={(e) => setFormData({ ...formData, Costing_Request_Status: e.target.value })}
                    className="rounded-xl border-slate-200 text-xs font-semibold text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section B: Trip & Journey Configuration */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-600" /> 2. Trip & Route Details (Zoho Leads)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Destination(s)
                  </label>
                  <Input
                    value={formData.Destination}
                    onChange={(e) => setFormData({ ...formData, Destination: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 font-black text-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Destination Type
                  </label>
                  <Input
                    value={formData.Destination_Type}
                    onChange={(e) => setFormData({ ...formData, Destination_Type: e.target.value })}
                    className="rounded-xl border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Adults
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.Adults}
                    onChange={(e) => {
                      const a = e.target.value;
                      const k = formData.Kids || '0';
                      setFormData({
                        ...formData,
                        Adults: a,
                        Number_Of_Guest: String((Number(a) || 0) + (Number(k) || 0))
                      });
                    }}
                    required
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Kids
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.Kids}
                    onChange={(e) => {
                      const k = e.target.value;
                      const a = formData.Adults || '2';
                      setFormData({
                        ...formData,
                        Kids: k,
                        Number_Of_Guest: String((Number(a) || 0) + (Number(k) || 0))
                      });
                    }}
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    No. of Days
                  </label>
                  <Input
                    value={formData.No_of_Days}
                    onChange={(e) => setFormData({ ...formData, No_of_Days: e.target.value })}
                    required
                    placeholder="e.g. 6"
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    No. of Nights
                  </label>
                  <Input
                    value={formData.No_of_Nights}
                    onChange={(e) => setFormData({ ...formData, No_of_Nights: e.target.value })}
                    required
                    placeholder="e.g. 5"
                    className="rounded-xl border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Travel Style
                  </label>
                  <Input
                    value={formData.Travel_Style}
                    onChange={(e) => setFormData({ ...formData, Travel_Style: e.target.value })}
                    placeholder="e.g. Family Trip, Couple"
                    className="rounded-xl border-slate-200 font-semibold text-[#7A2B20]"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Trip Type
                  </label>
                  <Input
                    value={formData.Trip_Type}
                    onChange={(e) => setFormData({ ...formData, Trip_Type: e.target.value })}
                    className="rounded-xl border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Preferred Start Date
                  </label>
                  <Input
                    value={formData.Preferred_Start_date}
                    onChange={(e) => setFormData({ ...formData, Preferred_Start_date: e.target.value })}
                    placeholder="YYYY-MM-DD"
                    className="rounded-xl border-slate-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Travel End Date
                  </label>
                  <Input
                    value={formData.Travel_End_Date}
                    onChange={(e) => setFormData({ ...formData, Travel_End_Date: e.target.value })}
                    placeholder="YYYY-MM-DD"
                    className="rounded-xl border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Section C: Stay & Accommodation Details */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-orange-600" /> 3. Stay & Accommodation Details (Zoho Leads)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Hotel Stays (Hotel_1..6+ Nights)
                  </label>
                  <Input
                    value={formData.Hotel_Name}
                    onChange={(e) => setFormData({ ...formData, Hotel_Name: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Preferred Room Category
                  </label>
                  <Input
                    value={formData.Room_Category}
                    onChange={(e) => setFormData({ ...formData, Room_Category: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Quotation & Margin Control Suite */}
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                    Quotation & Itinerary Margin Pricing
                  </div>
                  {(baseNum > 0 || finalNum > 0) && (
                    <div className="flex items-center flex-wrap gap-1 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-500">Quick Margin:</span>
                      {[5, 10, 12, 15, 20].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => applyQuickMargin(pct)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold transition cursor-pointer border ${marginPercent === String(pct)
                              ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                              : 'bg-white text-slate-700 hover:bg-orange-50 hover:border-orange-300 border-slate-200'
                            }`}
                        >
                          +{pct}%
                        </button>
                      ))}
                      {marginPercent && Number(marginPercent) > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMarginChange('0')}
                          className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-red-600 transition cursor-pointer"
                          title="Reset Margin to 0%"
                        >
                          ✕ Reset
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 items-start">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                      Meal Plan
                    </label>
                    <Input
                      value={formData.Meal_Plan}
                      onChange={(e) => setFormData({ ...formData, Meal_Plan: e.target.value })}
                      placeholder="e.g. Breakfast & Dinner (MAP)"
                      className="rounded-xl border-slate-200 bg-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1 flex items-center justify-between">
                      <span>Zoho CRM Quotation (₹)</span>
                      <span className="text-[9px] text-slate-400 font-normal">Base Cost</span>
                    </label>
                    <Input
                      type="number"
                      value={baseQuotation}
                      onChange={(e) => handleBaseQuotationChange(e.target.value)}
                      placeholder="e.g. 45000"
                      className="rounded-xl border-slate-300 bg-white font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-orange-700 font-extrabold">
                        <Percent className="w-3 h-3 text-orange-600" /> Margin (%)
                      </span>
                      {marginNum > 0 && (
                        <span className="text-[10px] font-black text-orange-600">
                          +{marginNum}%
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        value={marginPercent}
                        onChange={(e) => handleMarginChange(e.target.value)}
                        placeholder="e.g. 15"
                        className="rounded-xl border-orange-300 focus:border-orange-500 bg-orange-50/50 font-mono font-black text-orange-800 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-500 font-black text-xs pointer-events-none">
                        %
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-emerald-800 block mb-1 flex items-center justify-between">
                      <span className="font-extrabold">Final Package Base (₹)</span>
                      {marginAmount > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700">
                          (+₹{marginAmount.toLocaleString('en-IN')})
                        </span>
                      )}
                    </label>
                    <Input
                      value={formData.Final_Quotation_Amount}
                      onChange={(e) => handleFinalQuotationChange(e.target.value)}
                      placeholder="e.g. 51750"
                      className="rounded-xl border-emerald-400 focus:border-emerald-600 bg-emerald-50/60 font-mono font-black text-emerald-800 text-sm"
                    />
                  </div>
                </div>

                {/* Per Adult Cost & Per Child Cost Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-200/60">
                  <div className="bg-white/80 rounded-xl p-3 border border-slate-200">
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1 flex items-center justify-between">
                      <span>Per Adult Cost (₹)</span>
                      {basePerAdult && (
                        <span className="text-[9px] text-slate-400">Zoho: ₹{Number(basePerAdult).toLocaleString('en-IN')}</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      value={formData.Per_Adult_Price}
                      onChange={(e) => setFormData({ ...formData, Per_Adult_Price: e.target.value })}
                      placeholder="e.g. 39966"
                      className="rounded-xl border-slate-300 font-mono font-bold text-slate-800"
                    />
                    {Number(formData.Per_Adult_Price) > 0 && (
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                        + 5% GST (₹{Math.round(Number(formData.Per_Adult_Price) * 0.05).toLocaleString('en-IN')}) = Grand Total ₹{Math.round(Number(formData.Per_Adult_Price) * 1.05).toLocaleString('en-IN')}/-
                      </div>
                    )}
                  </div>

                  <div className="bg-white/80 rounded-xl p-3 border border-slate-200">
                    <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1 flex items-center justify-between">
                      <span>Per Child Cost (₹)</span>
                      {basePerKid && (
                        <span className="text-[9px] text-slate-400">Zoho: ₹{Number(basePerKid).toLocaleString('en-IN')}</span>
                      )}
                    </label>
                    <Input
                      type="number"
                      value={formData.Per_Kid_Price}
                      onChange={(e) => setFormData({ ...formData, Per_Kid_Price: e.target.value })}
                      placeholder="e.g. 11083"
                      className="rounded-xl border-slate-300 font-mono font-bold text-slate-800"
                    />
                    {Number(formData.Per_Kid_Price) > 0 && (
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                        + 5% GST (₹{Math.round(Number(formData.Per_Kid_Price) * 0.05).toLocaleString('en-IN')}) = Grand Total ₹{Math.round(Number(formData.Per_Kid_Price) * 1.05).toLocaleString('en-IN')}/-
                      </div>
                    )}
                  </div>
                </div>

                {/* Live Calculation Explainer with 5% GST */}
                {(baseNum > 0 || finalNum > 0) && (
                  <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-100/90 border border-emerald-300 text-emerald-950 font-medium px-3 py-1.5 rounded-xl shadow-xs">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          Package Base (Post-Margin): <strong className="font-mono">₹{finalNum.toLocaleString('en-IN')}</strong> +{' '}
                          <strong className="text-emerald-800">5% GST: ₹{Math.round(finalNum * 0.05).toLocaleString('en-IN')}</strong> ={' '}
                          Total Payable: <strong className="font-mono text-emerald-950 text-xs font-black">₹{Math.round(finalNum * 1.05).toLocaleString('en-IN')}/-</strong>
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section D: Activities & Experiences Subform */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <label className="text-[10px] uppercase font-bold text-slate-500 block">
                Activities & Experiences (From Zoho Subform: Activities_and_Experiences_1)
              </label>
              <textarea
                rows={7}
                value={formData.Special_Requirements}
                onChange={(e) => setFormData({ ...formData, Special_Requirements: e.target.value })}
                placeholder="Day-wise activities, transit routes, en-route experiences from Zoho CRM subform..."
                className="w-full rounded-2xl border border-slate-200 p-4 text-xs leading-relaxed font-mono focus:border-orange-500 focus:outline-none bg-stone-50/60 shadow-inner"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-black text-sm py-6 rounded-2xl shadow-lg shadow-orange-500/20 transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Luxury Itinerary Content with AI & Saving to MongoDB...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Parachute className="w-4 h-4" />
                  Generate Itinerary with AI ↗
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl mb-8">
            ⚠️ Error: {error}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-lg animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              Itinerary Created Successfully!
            </div>

            <div className="bg-white rounded-2xl p-4 border border-emerald-200/60 space-y-2 text-xs">
              <div><strong>Generated ID:</strong> <span className="font-mono font-bold text-orange-600">{result.id}</span></div>
              <div><strong>SubTitle:</strong> &ldquo;{result.data?.subTitle}&rdquo;</div>
              <div><strong>AI Description:</strong> &ldquo;{result.data?.description}&rdquo;</div>
              <div><strong>Total Days Generated:</strong> {result.data?.daysCount} Days</div>
            </div>

            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm py-4 rounded-2xl transition shadow-md"
            >
              <span>Open Generated Itinerary Template in Browser</span>
              <ExternalLink className="w-4 h-4 text-orange-400" />
            </a>
          </div>
        )}

        {/* 3. GENERATED ITINERARY HISTORY & AUDIT LOGS */}
        <ItineraryHistorySection lastGeneratedId={result?.id || result?.slug} />
      </main>

      <Footer />
    </div>
  );
}
