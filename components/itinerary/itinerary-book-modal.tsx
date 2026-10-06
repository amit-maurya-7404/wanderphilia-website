'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Lock,
  CreditCard,
  Download,
  ShieldCheck,
  User,
  Phone,
  Mail,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  Clock
} from 'lucide-react';
import { RiWhatsappLine } from 'react-icons/ri';
import { CountryCodeSelect } from '@/components/ui/country-code-select';
import { DEFAULT_COUNTRY_CODE } from '@/lib/country-codes';
import { contactPhoneDisplay } from '@/lib/contact';

export type ItineraryPaymentType = 'token' | 'advance' | 'remaining_advance' | 'remaining_balance' | 'full';

interface ItineraryBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itineraryId: string;
  destination: string;
  proposalTitle?: string;
  totalQuotationAmount: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  initialPaymentType?: ItineraryPaymentType;
  initialLeadName?: string;
  initialEmail?: string;
  initialPhone?: string;
  zohoLeadId?: string;
  inquiryId?: string;
  numDays?: number;
  numNights?: number;
  travelStartDate?: string;
  travelEndDate?: string;
  onPaymentSuccess?: (data: any) => void;
}

export function ItineraryBookModal({
  open,
  onOpenChange,
  itineraryId,
  destination,
  proposalTitle,
  totalQuotationAmount,
  advanceAmountPaid = 0,
  balancePendingAmount,
  initialPaymentType,
  initialLeadName = '',
  initialEmail = '',
  initialPhone = '',
  zohoLeadId,
  inquiryId,
  numDays = 5,
  numNights = 4,
  travelStartDate,
  travelEndDate,
  onPaymentSuccess,
}: ItineraryBookModalProps) {
  const router = useRouter();

  const alreadyPaid = Number(advanceAmountPaid || 0);
  const tenPercentAmount = Math.round(totalQuotationAmount * 0.1);
  const fiftyPercentAmount = Math.round(totalQuotationAmount * 0.5);
  const remainingAdvanceAmount = Math.max(0, fiftyPercentAmount - alreadyPaid);
  const remainingBalanceAmount = Math.max(0, totalQuotationAmount - alreadyPaid);

  // Compute default payment type based on current paid stage
  const getDefaultPaymentType = (): ItineraryPaymentType => {
    if (initialPaymentType) return initialPaymentType;
    if (alreadyPaid <= 0) return 'token'; // Default to 10% Token for quick booking
    if (alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount) return 'remaining_advance';
    return 'remaining_balance';
  };

  const [paymentType, setPaymentType] = useState<ItineraryPaymentType>(getDefaultPaymentType());
  const [fullName, setFullName] = useState(initialLeadName);
  const [email, setEmail] = useState(initialEmail);
  const [mobileNumber, setMobileNumber] = useState(initialPhone);
  const [countryCode, setCountryCode] = useState(DEFAULT_COUNTRY_CODE);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; mobileNumber?: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{
    invoiceNumber: string;
    paidAmount: number;
    totalPaid: number;
    balanceDue: number;
    paymentId: string;
    orderId: string;
    paymentType: string;
    invoiceBase64?: string;
    invoiceFileName?: string;
  } | null>(null);

  // Reset payment type when initialPaymentType or open state changes
  useEffect(() => {
    if (open) {
      setPaymentType(getDefaultPaymentType());
    }
  }, [open, alreadyPaid, initialPaymentType]);

  // Determine payable amount and balance due based on chosen payment option
  let payableAmount = 0;
  let installmentLabel = 'Package Payment';
  let postPaymentTotal = alreadyPaid;
  let postPaymentBalance = remainingBalanceAmount;

  if (paymentType === 'token') {
    payableAmount = tenPercentAmount;
    installmentLabel = '10% Token Booking Amount';
    postPaymentTotal = alreadyPaid + tenPercentAmount;
    postPaymentBalance = Math.max(0, totalQuotationAmount - postPaymentTotal);
  } else if (paymentType === 'advance') {
    payableAmount = fiftyPercentAmount;
    installmentLabel = '50% Booking Advance';
    postPaymentTotal = alreadyPaid + fiftyPercentAmount;
    postPaymentBalance = Math.max(0, totalQuotationAmount - postPaymentTotal);
  } else if (paymentType === 'remaining_advance') {
    payableAmount = remainingAdvanceAmount;
    installmentLabel = 'Remaining 40% Booking Advance';
    postPaymentTotal = alreadyPaid + remainingAdvanceAmount;
    postPaymentBalance = Math.max(0, totalQuotationAmount - postPaymentTotal);
  } else if (paymentType === 'remaining_balance') {
    payableAmount = remainingBalanceAmount;
    installmentLabel = alreadyPaid >= fiftyPercentAmount ? 'Remaining 50% Balance' : 'Remaining Balance';
    postPaymentTotal = totalQuotationAmount;
    postPaymentBalance = 0;
  } else {
    // 'full'
    payableAmount = remainingBalanceAmount > 0 ? remainingBalanceAmount : totalQuotationAmount;
    installmentLabel = 'Full Package Payment (100%)';
    postPaymentTotal = totalQuotationAmount;
    postPaymentBalance = 0;
  }

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayNow = async () => {
    if (!validateForm()) return;
    if (payableAmount <= 0) {
      alert('Invalid package quotation amount or no balance due.');
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay Order specifically for this Itinerary booking
      const orderRes = await fetch('/api/itinerary/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itineraryId,
          leadId: zohoLeadId || inquiryId,
          paymentType,
          customerName: fullName.trim(),
          customerEmail: email.trim(),
          customerMobile: `${countryCode} ${mobileNumber}`.trim(),
          destination,
          customAmount: totalQuotationAmount,
        }),
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json().catch(() => null);
        throw new Error(errJson?.error || 'Failed to initialize payment gateway.');
      }

      const orderData = await orderRes.json();
      const razorpayKey =
        orderData.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_ITINERARY_KEY_ID ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        alert('Payment gateway key is not configured.');
        setIsProcessing(false);
        return;
      }

      // 2. Configure Razorpay Checkout Options
      const options = {
        key: razorpayKey,
        amount: orderData.amountPaise,
        currency: orderData.currency || 'INR',
        name: 'Wanderphilia Experiences',
        description: `${installmentLabel} for ${destination} Tour (${itineraryId})`,
        image: '/images/Made_LOGO.png',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          setIsRazorpayOpen(false);
          setIsProcessing(false);
          setIsVerifying(true);
          try {
            // 3. Verify Payment & Generate/Attach Invoice & Dispatch Emails
            const verifyRes = await fetch('/api/itinerary/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                itineraryId,
                leadId: zohoLeadId || inquiryId,
                paymentType,
                customerName: fullName.trim(),
                customerEmail: email.trim(),
                customerMobile: `${countryCode} ${mobileNumber}`.trim(),
                destination,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentSuccessData({
                invoiceNumber: verifyData.invoiceNumber,
                paidAmount: verifyData.paidAmount,
                totalPaid: verifyData.totalPaid || (alreadyPaid + verifyData.paidAmount),
                balanceDue: verifyData.balanceDue,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                paymentType,
                invoiceBase64: verifyData.invoiceBase64,
                invoiceFileName: verifyData.invoiceFileName,
              });

              if (onPaymentSuccess) {
                onPaymentSuccess(verifyData);
              }

              // Soft refresh page to re-render updated data from DB
              try {
                router.refresh();
              } catch (rErr) {
                console.log('Router refresh notice:', rErr);
              }
            } else {
              alert(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (verifyErr: any) {
            console.error('Payment verification failed:', verifyErr);
            alert('A verification error occurred. Please contact support.');
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: fullName.trim(),
          email: email.trim(),
          contact: mobileNumber.replace(/\D/g, ''),
        },
        theme: {
          color: '#6E1E14', // Rust Brand Theme
        },
        modal: {
          ondismiss: function () {
            setIsRazorpayOpen(false);
            setIsProcessing(false);
          },
        },
      };

      // 4. Open Razorpay Modal & temporarily hide background booking dialog
      setIsRazorpayOpen(true);

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error('Itinerary checkout error:', err);
      alert(err.message || 'An error occurred initiating checkout.');
      setIsProcessing(false);
      setIsRazorpayOpen(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (paymentSuccessData?.invoiceBase64) {
      const byteCharacters = atob(paymentSuccessData.invoiceBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = paymentSuccessData.invoiceFileName || `Wanderphilia_Invoice_${paymentSuccessData.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open(`/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`, '_blank');
    }
  };

  const invoiceDownloadUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`
    : `/api/itinerary/invoice?id=${encodeURIComponent(itineraryId)}`;

  const whatsappMsg = encodeURIComponent(
    `Hi Wanderphilia! I have completed my payment of ₹${paymentSuccessData?.paidAmount?.toLocaleString('en-IN') || ''} (${installmentLabel}) for my ${destination} tour (${itineraryId}).\n\n• Invoice No: ${paymentSuccessData?.invoiceNumber || ''}\n• Payment ID: ${paymentSuccessData?.paymentId || ''}\n• Download Invoice PDF: ${invoiceDownloadUrl}\n\nLooking forward to connecting with my trip coordinator!`
  );
  const whatsappUrl = `https://wa.me/91${contactPhoneDisplay}?text=${whatsappMsg}`;

  // Check which state we are in
  const isFullyPaid = remainingBalanceAmount <= 0;
  const isTokenPaid = alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount;
  const isAdvancePaid = alreadyPaid >= fiftyPercentAmount && !isFullyPaid;

  return (
    <Dialog open={open && !isRazorpayOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-[#FAF8F5] border border-stone-300 rounded-3xl shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#6E1E14] via-[#5C1810] to-[#3D0F0A] text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <CreditCard className="w-40 h-40 text-amber-300" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                <Sparkles className="w-3 h-3" /> Secure Online Booking
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white">
                {isFullyPaid ? 'Tour Booking Confirmed' : `Book Your ${destination} Escape`}
              </DialogTitle>
              <DialogDescription className="text-xs text-amber-100/90 font-medium">
                Ref: <span className="font-mono font-bold text-amber-300">{itineraryId}</span> • Total Quotation: <span className="font-black text-white">₹{totalQuotationAmount.toLocaleString('en-IN')}</span>
                {alreadyPaid > 0 && (
                  <span className="text-emerald-300 ml-1 font-bold">
                    (₹{alreadyPaid.toLocaleString('en-IN')} Paid)
                  </span>
                )}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-5 sm:p-7 overflow-y-auto grow space-y-6">

          {/* === 0. VERIFYING & GENERATING INVOICE LOADING VIEW === */}
          {isVerifying ? (
            <div className="py-16 px-4 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-amber-500 text-amber-700 flex items-center justify-center mx-auto shadow-md animate-spin">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
                  Processing Payment
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Verifying Transaction...
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Payment captured! We are now generating your official Wanderphilia Tax Invoice and updating your booking record in Zoho CRM. Please do not refresh.
                </p>
              </div>
            </div>
          ) : paymentSuccessData ? (
            /* === 1. SUCCESS VIEW IF PAYMENT COMPLETED === */
            <div className="space-y-6 py-2 text-center">
              
              {/* Green Animated Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Confirmed & Verified
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                  {paymentSuccessData.balanceDue <= 0 ? '100% Tour Confirmed! ✈️' : 'Payment Received! ✈️'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <b>{fullName}</b>! Your payment has been received and verified. Your hotel accommodations and chauffeur transport are now being secured.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-4 sm:p-5 text-left space-y-3 shadow-sm max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-xs text-stone-500 font-bold uppercase">Invoice Number</span>
                  <span className="text-sm font-mono font-black text-[#6E1E14]">
                    {paymentSuccessData.invoiceNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-xs text-stone-500 font-bold uppercase">Amount Paid Today</span>
                  <span className="text-lg font-black text-emerald-600">
                    ₹{paymentSuccessData.paidAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <span className="text-xs text-stone-500 font-bold uppercase">Total Paid To Date</span>
                  <span className="text-sm font-black text-stone-900">
                    ₹{paymentSuccessData.totalPaid.toLocaleString('en-IN')} / ₹{totalQuotationAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {paymentSuccessData.balanceDue > 0 ? (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <span className="text-xs text-stone-500 font-bold uppercase">Remaining Balance</span>
                    <span className="text-sm font-bold text-[#6E1E14]">
                      ₹{paymentSuccessData.balanceDue.toLocaleString('en-IN')} (Due 15 days before departure)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <span className="text-xs text-stone-500 font-bold uppercase">Payment Status</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ✓ 100% Fully Cleared
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Razorpay Payment ID</span>
                  <span className="font-mono font-semibold text-stone-800">
                    {paymentSuccessData.paymentId}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Download PDF Invoice & WhatsApp */}
              <div className="space-y-3 max-w-lg mx-auto pt-2">
                <Button
                  onClick={handleDownloadInvoice}
                  className="w-full h-12 rounded-xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition hover:scale-[1.02] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Tax Invoice (PDF)</span>
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition hover:scale-[1.02] cursor-pointer"
                >
                  <RiWhatsappLine className="w-4 h-4" />
                  <span>Connect with Tour Coordinator on WhatsApp</span>
                </a>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-900 text-left max-w-lg mx-auto flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  A copy of this official invoice has been sent to <b>{email}</b> and saved directly to your booking record in Zoho CRM.
                </span>
              </div>
            </div>
          ) : isFullyPaid ? (
            /* === FULLY PAID INITIAL VIEW === */
            <div className="space-y-6 py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Booking 100% Cleared
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
                  Tour Fully Paid & Confirmed! ✈️
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  The entire package quotation of <b>₹{totalQuotationAmount.toLocaleString('en-IN')}</b> has been cleared.
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto pt-2">
                <Button
                  onClick={handleDownloadInvoice}
                  className="w-full h-12 rounded-xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Latest Tax Invoice (PDF)</span>
                </Button>
                <a
                  href={`https://wa.me/91${contactPhoneDisplay}?text=Hi%20Wanderphilia,%20my%20${destination}%20booking%20(${itineraryId})%20is%20fully%20paid.%20Please%20share%20further%20updates.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <RiWhatsappLine className="w-4 h-4" />
                  <span>Chat with Trip Coordinator</span>
                </a>
              </div>
            </div>
          ) : (
            /* === 2. PAYMENT SELECTION & CHECKOUT FORM === */
            <div className="space-y-6">

              {/* PAYMENT OPTION SELECTOR (DYNAMICALLY RENDERED BASED ON CURRENT STAGE) */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6E1E14] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Select Payment Option:
                </label>

                {/* CASE 1: 0% PAID (FRESH LINK) -> 3 OPTIONS */}
                {alreadyPaid <= 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* OPTION 1: 10% TOKEN AMOUNT */}
                    <div
                      onClick={() => setPaymentType('token')}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        paymentType === 'token'
                          ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                          : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="bg-amber-100 text-amber-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                          10% Token
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          paymentType === 'token' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                        }`}>
                          {paymentType === 'token' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-xs font-black text-stone-900">
                          Token Amount
                        </h4>
                        <div className="text-lg sm:text-xl font-black text-[#6E1E14] pt-0.5">
                          ₹{tenPercentAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-1">
                          Fast token lock to secure your dates and proposal.
                        </p>
                      </div>
                    </div>

                    {/* OPTION 2: 50% ADVANCE AMOUNT */}
                    <div
                      onClick={() => setPaymentType('advance')}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        paymentType === 'advance'
                          ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                          : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                          Recommended
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          paymentType === 'advance' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                        }`}>
                          {paymentType === 'advance' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-xs font-black text-stone-900">
                          50% Advance
                        </h4>
                        <div className="text-lg sm:text-xl font-black text-[#6E1E14] pt-0.5">
                          ₹{fiftyPercentAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-1">
                          Locks in luxury resort & private chauffeur.
                        </p>
                      </div>
                    </div>

                    {/* OPTION 3: 100% FULL PAYMENT */}
                    <div
                      onClick={() => setPaymentType('full')}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        paymentType === 'full'
                          ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                          : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                          100% Cleared
                        </span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          paymentType === 'full' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                        }`}>
                          {paymentType === 'full' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-xs font-black text-stone-900">
                          Full Payment
                        </h4>
                        <div className="text-lg sm:text-xl font-black text-stone-900 pt-0.5">
                          ₹{totalQuotationAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-1">
                          Zero pending dues, complete peace of mind.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* CASE 2: 10% TOKEN PAID -> SHOW 40% REMAINING ADVANCE & 90% REMAINING BALANCE */}
                {isTokenPaid && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>10% Token Amount Paid: <b>₹{alreadyPaid.toLocaleString('en-IN')}</b></span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                        TOKEN CLEARED
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {/* OPTION A: REMAINING ADVANCE (40%) */}
                      <div
                        onClick={() => setPaymentType('remaining_advance')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          paymentType === 'remaining_advance'
                            ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                            : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              Next Step (Advance 50%)
                            </span>
                            <h4 className="text-sm font-black text-stone-900 pt-1">
                              Pay Remaining Advance (40%)
                            </h4>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            paymentType === 'remaining_advance' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                          }`}>
                            {paymentType === 'remaining_advance' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 mt-3 space-y-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-black text-[#6E1E14]">
                              ₹{remainingAdvanceAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-stone-500 font-bold uppercase">Payable Today</span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight">
                            Completes 50% booking advance. Balance ₹{fiftyPercentAmount.toLocaleString('en-IN')} due 15 days before travel.
                          </p>
                        </div>
                      </div>

                      {/* OPTION B: REMAINING FULL BALANCE (90%) */}
                      <div
                        onClick={() => setPaymentType('remaining_balance')}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          paymentType === 'remaining_balance'
                            ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                            : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              Clear All Dues
                            </span>
                            <h4 className="text-sm font-black text-stone-900 pt-1">
                              Pay Remaining Balance (90%)
                            </h4>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            paymentType === 'remaining_balance' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                          }`}>
                            {paymentType === 'remaining_balance' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-100 mt-3 space-y-1">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl sm:text-2xl font-black text-stone-900">
                              ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-emerald-700 font-bold uppercase">Full Settlement</span>
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight">
                            Clears 100% tour quotation immediately with 0 balance pending.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* CASE 3: 50% ADVANCE PAID -> SHOW FINAL 50% REMAINING BALANCE */}
                {isAdvancePaid && (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>50% Advance Paid: <b>₹{alreadyPaid.toLocaleString('en-IN')}</b></span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                        ADVANCE CLEARED
                      </span>
                    </div>

                    {/* ONLY REMAINING 50% BALANCE CARD */}
                    <div
                      onClick={() => setPaymentType('remaining_balance')}
                      className="p-4 rounded-2xl border-2 border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20 cursor-pointer relative flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                            Final Payment
                          </span>
                          <h4 className="text-sm font-black text-stone-900 pt-1">
                            Pay Remaining 50% Balance
                          </h4>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-[#6E1E14] bg-[#6E1E14] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 mt-3 space-y-1">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black text-[#6E1E14]">
                            ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-500 font-bold uppercase">Final Balance</span>
                        </div>
                        <p className="text-[11px] text-stone-600 leading-tight">
                          Due 15 days before departure. Clears all travel services and issues final invoice.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* CONTACT DETAILS SECTION */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                  <User className="w-4 h-4 text-[#6E1E14]" />
                  <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                    Primary Traveler / Billing Details
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <Input
                      placeholder="e.g. Rahul Sharma"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                      }}
                      className={`h-10 text-xs bg-[#FAF8F5] border-stone-300 rounded-xl ${
                        errors.fullName ? 'border-rose-500' : ''
                      }`}
                    />
                    {errors.fullName && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Email (for Invoice PDF) <span className="text-rose-600">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        className={`h-10 text-xs bg-[#FAF8F5] border-stone-300 rounded-xl ${
                          errors.email ? 'border-rose-500' : ''
                        }`}
                      />
                      {errors.email && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 uppercase mb-1">
                        Mobile Number <span className="text-rose-600">*</span>
                      </label>
                      <div className={`flex rounded-xl border bg-[#FAF8F5] overflow-hidden h-10 transition ${
                        errors.mobileNumber ? 'border-rose-500' : 'border-stone-300'
                      }`}>
                        <CountryCodeSelect
                          value={countryCode}
                          onChange={setCountryCode}
                          disabled={isProcessing}
                        />
                        <Input
                          type="tel"
                          placeholder="9876543210"
                          value={mobileNumber}
                          maxLength={15}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setMobileNumber(val);
                            if (errors.mobileNumber) setErrors(prev => ({ ...prev, mobileNumber: undefined }));
                          }}
                          className="border-0 shadow-none focus-visible:ring-0 rounded-none h-full flex-1 text-xs font-semibold bg-transparent"
                        />
                      </div>
                      {errors.mobileNumber && <p className="text-[10px] text-rose-600 font-bold mt-1">{errors.mobileNumber}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* PAYMENT SUMMARY BREAKDOWN CARD */}
              <div className="bg-gradient-to-br from-stone-900 to-[#4A140D] text-white p-4 sm:p-5 rounded-2xl shadow-md space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 text-stone-300">
                  <span>Total Tour Quotation Cost:</span>
                  <span className="font-bold text-white">₹{totalQuotationAmount.toLocaleString('en-IN')}</span>
                </div>

                {alreadyPaid > 0 && (
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 text-emerald-300 font-bold">
                    <span>Already Paid So Far:</span>
                    <span>₹{alreadyPaid.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Amount Payable Today ({installmentLabel})
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {postPaymentBalance > 0 ? (
                    <div className="text-right text-[11px] text-stone-300">
                      <span>Remaining Balance After Payment:</span>
                      <div className="font-black text-amber-300 text-sm">
                        ₹{postPaymentBalance.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-right text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800">
                      ✓ 100% Cleared (0 Balance)
                    </div>
                  )}
                </div>
              </div>

              {/* PAY BUTTON & GATEWAY BADGE */}
              <div className="space-y-3 pt-1">
                <Button
                  onClick={handlePayNow}
                  disabled={isProcessing || payableAmount <= 0}
                  className="w-full h-12 rounded-2xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#6E1E14]/25 transition hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      <span>Opening Secure Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-300" />
                      <span>Pay ₹{payableAmount.toLocaleString('en-IN')} Securely with Razorpay</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500 px-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit SSL Encrypted • Razorpay Certified Gateway</span>
                  </span>
                  <span>UPI • GPay • Cards • Netbanking • Wallets</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
