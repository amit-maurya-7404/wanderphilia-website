'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2, CheckCircle2, ExternalLink, Download, Search, Hotel, Calendar, Users, MapPin } from 'lucide-react';

export default function ItineraryTestPage() {
  const [leadQuery, setLeadQuery] = useState('843125000010916169');
  const [fetchingLead, setFetchingLead] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  const [formData, setFormData] = useState({
    First_Name: 'Amit',
    Last_Name: 'Maurya',
    Email: 'amit.maurya7404@gmail.com',
    Mobile: '09137290903',
    City: 'Mumbai',
    Destination: 'Rajasthan (Jodhpur & Jaipur)',
    Inquiry_ID: 'WNDPQ349',
    Hotel_Name: 'Amit Residensy (Jodhpur) & Popular Residency (Jaipur)',
    Room_Category: 'Deluxe',
    Meal_Plan: 'Breakfast & Dinner (MAP)',
    Duration: '6 Days / 5 Nights',
    Number_Of_Guest: '4',
    Travel_Style: 'Family Trip',
    Special_Requirements: 'Family trip covering Jodhpur Rock Park, Boating, Jaipur Elephant Village, Camel Safari and Vintage Car Ride.'
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
      const res = await fetch(`/api/zoho/fetch-lead?query=${encodeURIComponent(leadQuery.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch lead from Zoho CRM');
      }

      const lead = data.lead;
      setRawLeadFull(lead);

      // Assemble hotels text
      const hotelNames = lead.hotels && lead.hotels.length > 0
        ? lead.hotels.map((h: any) => `${h.hotelName} (${h.city}) - ${h.nights}N`).join(' + ')
        : 'Curated 5-Star Luxury Resort';

      // Assemble activities summary
      const experiencesSummary = lead.dayActivities && lead.dayActivities.length > 0
        ? lead.dayActivities.map((d: any) => `[${d.dayText} - ${d.city}]: ${d.experiences.map((e: any) => e.experienceName).join(', ')}`).join(' | ')
        : '';

      setFormData({
        First_Name: lead.firstName || lead.leadName.split(' ')[0] || '',
        Last_Name: lead.lastName || lead.leadName.split(' ').slice(1).join(' ') || '',
        Email: lead.email || '',
        Mobile: lead.mobile || '',
        City: lead.city || '',
        Destination: lead.destinations || 'Rajasthan',
        Inquiry_ID: lead.inquiryId || '',
        Hotel_Name: hotelNames,
        Room_Category: lead.preferredRoomCategory || 'Deluxe',
        Meal_Plan: 'Breakfast & Royal Dinner',
        Duration: `${lead.noOfDays} Days / ${lead.noOfNights} Nights`,
        Number_Of_Guest: String(lead.numberOfGuests || 2),
        Travel_Style: lead.travelStyle || 'Family Trip',
        Special_Requirements: experiencesSummary || lead.rawLeadData?.Specific_Requirements || 'Customized luxury family holiday'
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
      const payloadToSend = rawLeadFull
        ? { ...rawLeadFull, ...formData }
        : formData;

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
            Fetch any live lead directly from Zoho CRM using Lead ID or Inquiry ID, preview the details, and generate the complete luxury itinerary template!
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

          {rawLeadFull && rawLeadFull.hotels && (
            <div className="pt-2 text-xs text-slate-300 border-t border-white/10 flex flex-wrap gap-4">
              <span><strong>Hotels:</strong> {rawLeadFull.hotels.length} Stays</span>
              <span><strong>Activities:</strong> {rawLeadFull.dayActivities?.length || 0} Days</span>
              <span><strong>Quotation:</strong> ₹{rawLeadFull.finalQuotationAmount?.toLocaleString('en-IN') || 'Pending'}</span>
            </div>
          )}
        </div>

        {/* 2. FORM DETAILS PREVIEW & GENERATE */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl mb-8">
          <div className="text-xs uppercase font-extrabold text-orange-600 tracking-wider mb-4 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Step 2: Review Fields & Generate AI Itinerary
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Lead / Traveler Name
                </label>
                <Input
                  value={`${formData.First_Name} ${formData.Last_Name}`.trim()}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setFormData({ ...formData, First_Name: parts[0] || '', Last_Name: parts.slice(1).join(' ') || '' });
                  }}
                  required
                  className="rounded-xl border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Inquiry ID
                </label>
                <Input
                  value={formData.Inquiry_ID}
                  onChange={(e) => setFormData({ ...formData, Inquiry_ID: e.target.value })}
                  className="rounded-xl border-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Destination(s)
                </label>
                <Input
                  value={formData.Destination}
                  onChange={(e) => setFormData({ ...formData, Destination: e.target.value })}
                  required
                  className="rounded-xl border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Hotel Stay Details
                </label>
                <Input
                  value={formData.Hotel_Name}
                  onChange={(e) => setFormData({ ...formData, Hotel_Name: e.target.value })}
                  required
                  className="rounded-xl border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
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
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Meal Plan
                </label>
                <Input
                  value={formData.Meal_Plan}
                  onChange={(e) => setFormData({ ...formData, Meal_Plan: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Duration / Days
                </label>
                <Input
                  value={formData.Duration}
                  onChange={(e) => setFormData({ ...formData, Duration: e.target.value })}
                  className="rounded-xl border-slate-200 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                  Guests Count & Travel Style
                </label>
                <Input
                  value={`${formData.Number_Of_Guest} Guests • ${formData.Travel_Style}`}
                  onChange={(e) => setFormData({ ...formData, Number_Of_Guest: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] uppercase font-bold text-slate-500 block mb-1">
                Activities & Experiences (From Zoho Subform)
              </label>
              <textarea
                rows={3}
                value={formData.Special_Requirements}
                onChange={(e) => setFormData({ ...formData, Special_Requirements: e.target.value })}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed focus:border-orange-500 focus:outline-none"
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
