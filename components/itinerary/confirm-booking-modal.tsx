'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  CreditCard,
  IndianRupee,
  Building2,
  Car,
  Calendar,
  Users,
  Send,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Copy,
  Check,
  Upload,
  FileText,
  Camera,
  Paperclip
} from 'lucide-react';

export interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiryId: string;
  customerName: string;
  customerMobile?: string;
  customerEmail?: string;
  destination: string;
  travelStartDate: string;
  travelEndDate: string;
  duration: string;
  noOfDays: number;
  noOfNights: number;
  adults: number;
  kids: number;
  roomsCount: number;
  sharingType: string;
  itineraryUrl: string;
  zohoLeadId?: string;
  dayActivities?: any[];
  availableOptions: Array<{
    optionNumber: number;
    title: string;
    totalAmount: number;
    hotels?: any[];
    dayActivities?: any[];
    vehicleType?: string;
    b2bTransportCost?: number;
    url?: string;
  }>;
  initialSelectedOption?: number;
  onBookingConfirmed?: (booking: any) => void;
}

export function ConfirmBookingModal({
  isOpen,
  onClose,
  inquiryId,
  customerName,
  customerMobile,
  customerEmail,
  destination,
  travelStartDate,
  travelEndDate,
  duration,
  noOfDays,
  noOfNights,
  adults,
  kids,
  roomsCount,
  sharingType,
  itineraryUrl,
  zohoLeadId,
  dayActivities,
  availableOptions,
  initialSelectedOption,
  onBookingConfirmed,
}: ConfirmBookingModalProps) {
  const [selectedOptNum, setSelectedOptNum] = useState<number>(() => {
    return initialSelectedOption || availableOptions[0]?.optionNumber || 1;
  });

  React.useEffect(() => {
    if (initialSelectedOption) {
      setSelectedOptNum(initialSelectedOption);
    } else if (availableOptions.length > 0) {
      setSelectedOptNum(availableOptions[0].optionNumber);
    }
  }, [initialSelectedOption, isOpen]);

  const activeOption = availableOptions.find(o => o.optionNumber === selectedOptNum) || availableOptions[0] || {
    optionNumber: 1,
    title: 'Option 1',
    totalAmount: 0,
    hotels: [],
    dayActivities: [],
    vehicleType: 'Dedicated Private Cab',
    b2bTransportCost: 0,
  };

  const [paymentMode, setPaymentMode] = useState<string>('bank_transfer');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [advanceAmount, setAdvanceAmount] = useState<string>(() => {
    const total = activeOption.totalAmount || 0;
    return total > 0 ? String(Math.round(total * 0.25)) : ''; // default 25% advance
  });
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [salesRepName, setSalesRepName] = useState<string>('');
  const [salesNotes, setSalesNotes] = useState<string>('');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [isUploadingProof, setIsUploadingProof] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedResult, setConfirmedResult] = useState<any | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setPaymentProofUrl(data.url);
        setPaymentProofName(file.name);
      } else {
        alert(data.error || 'Failed to upload payment proof');
      }
    } catch (err) {
      alert('Upload failed. Please check network connection.');
    } finally {
      setIsUploadingProof(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!utrNumber.trim()) {
      alert('Please enter Bank UTR / Transaction Reference Number.');
      return;
    }
    const advNum = Number(advanceAmount) || 0;
    if (advNum <= 0) {
      alert('Please enter a valid Advance Amount Paid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        inquiryId,
        zohoLeadId,
        customerName,
        customerMobile,
        customerEmail,
        destination,
        travelStartDate,
        travelEndDate,
        duration,
        noOfDays,
        noOfNights,
        adults,
        kids,
        roomsCount,
        sharingType,
        selectedOptionNumber: activeOption.optionNumber,
        selectedOptionTitle: activeOption.title,
        itineraryUrl: activeOption.url || itineraryUrl,
        totalQuotationAmount: activeOption.totalAmount,
        advanceAmountPaid: advNum,
        paymentMode,
        utrNumber: utrNumber.trim(),
        paymentDate,
        paymentProofUrl: paymentProofUrl.trim(),
        salesRepName: salesRepName.trim() || 'Sales Team',
        salesNotes: salesNotes.trim(),
        hotels: activeOption.hotels || [],
        vehicleType: activeOption.vehicleType || 'Dedicated Private Cab',
        transportCost: activeOption.b2bTransportCost || 0,
        dayActivities: (activeOption.dayActivities && activeOption.dayActivities.length > 0) ? activeOption.dayActivities : (dayActivities || []),
      };

      const res = await fetch('/api/operations/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success && data.booking) {
        setConfirmedResult(data.booking);
        if (onBookingConfirmed) onBookingConfirmed(data.booking);
      } else {
        alert(data.error || 'Failed to confirm booking.');
      }
    } catch (err) {
      alert('Network error while handing over booking to operations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOpsUrl = () => {
    const url = `${window.location.origin}/wanderphilia-operations?id=${confirmedResult?.id || ''}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl text-slate-100 relative my-8">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedResult ? (
          /* SUCCESS CELEBRATION SCREEN */
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-9 h-9 text-white" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                Booking Handed Over to Operations
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                <strong>{customerName}</strong>'s booking has been registered in the Operations queue and Deal record synced with Zoho CRM.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Operations Booking ID:</span>
                <span className="font-mono font-bold text-orange-400">{confirmedResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Itinerary:</span>
                <span className="font-bold text-white">{confirmedResult.selectedOptionTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Selling Price:</span>
                <span className="font-black text-white">₹{(confirmedResult.totalQuotationAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Advance Received (UTR):</span>
                <span className="font-bold text-emerald-400">
                  ₹{(confirmedResult.advanceAmountPaid || 0).toLocaleString('en-IN')} ({confirmedResult.utrNumber})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <a
                href={`/wanderphilia-operations`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 cursor-pointer"
              >
                <span>Open Operations Console ↗</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={copyOpsUrl}
                className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy Operations Link'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING CONFIRMATION FORM */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-orange-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Sales Handover to Operations</span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Confirm Booking & Bank Transfer
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Client: <strong className="text-white">{customerName}</strong> • {destination} ({duration})
              </p>
            </div>

            {/* 1. SELECT FINAL OPTION */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                1. Which Itinerary Option was Finalized by Client?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {availableOptions.map(opt => {
                  const isSel = opt.optionNumber === selectedOptNum;
                  return (
                    <button
                      key={opt.optionNumber}
                      type="button"
                      onClick={() => {
                        setSelectedOptNum(opt.optionNumber);
                        const total = opt.totalAmount || 0;
                        if (total > 0) setAdvanceAmount(String(Math.round(total * 0.25)));
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSel
                        ? 'bg-orange-950/60 border-orange-500 text-white ring-1 ring-orange-500/50 shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Option {opt.optionNumber}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-orange-400" />}
                      </div>
                      <div className="text-sm font-black text-white mt-1">
                        ₹{(opt.totalAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. PAYMENT DETAILS */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-slate-300 block uppercase tracking-wider">
                2. Client Bank Transfer & Advance Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={e => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-medium cursor-pointer"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                    <option value="upi">UPI / QR Code Transfer</option>
                    <option value="razorpay">Razorpay Online Gateway</option>
                    <option value="cheque">Cheque Deposit</option>
                    <option value="cash">Cash Received</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Bank UTR / Transaction Ref No. <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UTR1234567890"
                    value={utrNumber}
                    onChange={e => setUtrNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-mono text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Advance Amount Received (₹) <span className="text-orange-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={advanceAmount}
                    onChange={e => setAdvanceAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white font-black text-emerald-400 text-sm focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={e => setPaymentDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white text-xs"
                  />
                </div>

                {/* PAYMENT PROOF / SCREENSHOT UPLOAD */}
                <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Payment Screenshot / Receipt Proof (For Finance & Ops)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal">PNG, JPG, PDF (Max 10MB)</span>
                  </label>

                  {paymentProofUrl ? (
                    <div className="bg-emerald-950/70 border border-emerald-600/80 rounded-xl p-3 flex items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-500 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-emerald-200 truncate block">
                            {paymentProofName || 'Payment_Proof_Attachment'}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            ✓ Proof attached for Operations & Finance
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentProofUrl('');
                            setPaymentProofName('');
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-red-900/60 hover:text-red-300 text-slate-400 rounded-lg text-xs font-bold transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-700 hover:border-orange-500/70 bg-slate-950/60 hover:bg-slate-950 rounded-xl p-3.5 text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition group">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        onChange={handleFileUpload}
                        disabled={isUploadingProof}
                        className="hidden"
                      />
                      {isUploadingProof ? (
                        <div className="flex items-center gap-2 text-xs text-orange-400 font-bold py-1">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Uploading receipt proof...</span>
                        </div>
                      ) : (
                        <>
                          <div className="w-8 h-8 rounded-full bg-slate-800 group-hover:bg-orange-500/20 text-slate-400 group-hover:text-orange-400 flex items-center justify-center transition">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div className="text-xs text-slate-300 font-medium">
                            <span className="text-orange-400 font-bold group-hover:underline">Click to upload payment screenshot</span> or drag &amp; drop
                          </div>
                          <span className="text-[10px] text-slate-500">
                            Automatically attached to Operations &amp; Zoho Finance module
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* 3. SALES REP & HANDOVER NOTES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Sales Agent Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bhavin Thakker"
                  value={salesRepName}
                  onChange={e => setSalesRepName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Special Notes for Operations
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior citizens, ground floor rooms preferred"
                  value={salesNotes}
                  onChange={e => setSalesNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Confirming & Syncing to Operations...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Confirm Booking & Send to Operations 🚀</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
