'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, CheckCircle2, ExternalLink, Download, Search, Hotel, Calendar, Users, MapPin } from 'lucide-react';

export default function ItineraryTestPage() {
  const [leadQuery, setLeadQuery] = useState('');
  const [fetchingLead, setFetchingLead] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

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

  // Fetch lead directly from Zoho CRM API
  const handleFetchFromZoho = async () => {
    if (!leadQuery.trim()) return;
    setFetchingLead(true);
    setError(null);
    setFetchSuccess(false);

    try {
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
        Number_Of_Guest: String(lead.numberOfGuests || 2),
        Travel_Style: lead.travelStyle || 'Family Trip',
        Trip_Type: lead.tripType || 'Customised Trip',
        Hotel_Name: hotelNames,
        Room_Category: lead.preferredRoomCategory || '',
        Meal_Plan: lead.mealPlan || lead.rawLeadData?.Meal_Plan || '',
        Final_Quotation_Amount: lead.finalQuotationAmount ? String(lead.finalQuotationAmount) : '',
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
        Number_Of_Guest: Number(formData.Number_Of_Guest) || 2,
        numberOfGuests: Number(formData.Number_Of_Guest) || 2,
        Travel_Style: formData.Travel_Style,
        travelStyle: formData.Travel_Style,
        Trip_Type: formData.Trip_Type,
        tripType: formData.Trip_Type,
        Hotel_Name: formData.Hotel_Name,
        hotelName: formData.Hotel_Name,
        Room_Category: formData.Room_Category,
        preferredRoomCategory: formData.Room_Category,
        Meal_Plan: formData.Meal_Plan,
        mealPlan: formData.Meal_Plan,
        Final_Quotation_Amount: formData.Final_Quotation_Amount ? Number(formData.Final_Quotation_Amount) : undefined
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
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-24 grow">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            Zoho CRM Direct Integration
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Fetch from Zoho CRM & AI Itinerary Generator
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Fetch any live lead directly from Zoho CRM using Lead ID or Inquiry ID, preview the exact mapped fields, and generate the luxury proposal template!
          </p>
        </div>

        {/* 1. DIRECT ZOHO FETCH BAR */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-700 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <div className="text-xs uppercase font-extrabold text-orange-400 tracking-wider flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Step 1: Fetch Live Lead from Zoho CRM
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Enter Zoho Lead ID (e.g. <span className="font-mono text-amber-300">843125000010916169</span>) or Inquiry ID (e.g. <span className="font-mono text-amber-300">WNDPQ349</span>)
              </p>
            </div>
            {fetchSuccess && (
              <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Lead Fetched Successfully!
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={leadQuery}
              onChange={(e) => setLeadQuery(e.target.value)}
              placeholder="Enter Zoho Lead ID or Inquiry ID (e.g. 843125000010916169 or WNDPQ349)"
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 font-mono text-xs sm:text-sm py-5 rounded-2xl focus:border-orange-500"
            />
            <Button
              onClick={handleFetchFromZoho}
              disabled={fetchingLead}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm px-6 py-5 rounded-2xl shadow-lg shrink-0 cursor-pointer"
            >
              {fetchingLead ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Fetching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4" /> Fetch from Zoho CRM
                </span>
              )}
            </Button>
          </div>

          {rawLeadFull && (
            <div className="pt-2 text-xs text-slate-300 border-t border-white/10 flex flex-wrap gap-4">
              <span><strong>Lead ID:</strong> {rawLeadFull.leadId}</span>
              <span><strong>Hotels:</strong> {rawLeadFull.hotels?.length || 0} Stays</span>
              <span><strong>Activities:</strong> {rawLeadFull.dayActivities?.length || 0} Days</span>
              <span><strong>Quotation:</strong> ₹{rawLeadFull.finalQuotationAmount?.toLocaleString('en-IN') || 'Pending'}</span>
            </div>
          )}
        </div>

        {/* 2. FORM DETAILS PREVIEW & GENERATE (CATEGORIZED ZOHO FIELDS) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl mb-8">
          <div className="text-xs uppercase font-extrabold text-orange-600 tracking-wider mb-6 flex items-center gap-1.5 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4" /> Step 2: Review All Zoho CRM Fields & Generate Itinerary
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
                    Number of Guests
                  </label>
                  <Input
                    value={formData.Number_Of_Guest}
                    onChange={(e) => setFormData({ ...formData, Number_Of_Guest: e.target.value })}
                    required
                    className="rounded-xl border-slate-200 font-semibold"
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
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-orange-600" /> 3. Stay & Accommodation Details (Zoho Leads)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Hotel Stays (Hotel_1..4 + Nights)
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

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Meal Plan
                  </label>
                  <Input
                    value={formData.Meal_Plan}
                    onChange={(e) => setFormData({ ...formData, Meal_Plan: e.target.value })}
                    placeholder="e.g. Breakfast & Dinner (MAP)"
                    className="rounded-xl border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Final Quotation Amount (₹)
                  </label>
                  <Input
                    value={formData.Final_Quotation_Amount}
                    onChange={(e) => setFormData({ ...formData, Final_Quotation_Amount: e.target.value })}
                    placeholder="e.g. 45000"
                    className="rounded-xl border-slate-200 font-mono font-bold text-emerald-700"
                  />
                </div>
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
                  <Sparkles className="w-4 h-4" />
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
      </main>

      <Footer />
    </div>
  );
}
