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
  Check,
  Building2,
  FileText,
  Calendar,
  Users
} from 'lucide-react';
import { Parachute } from '@/components/parachute-icon';
import { RiWhatsappLine } from 'react-icons/ri';
import { contactPhoneDisplay } from '@/lib/contact';

export type ItineraryPaymentType = 'token' | 'advance' | 'remaining_advance' | 'remaining_balance' | 'full';

interface ItineraryBookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itineraryId: string;
  destination: string;
  proposalTitle?: string;
  perAdultPrice?: number;
  adults?: number;
  baseAmount?: number;
  gstPercentage?: number;
  tcsPercentage?: number;
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
  perAdultPrice = 170772,
  adults = 5,
  baseAmount,
  gstPercentage = 5,
  tcsPercentage = 2,
  totalQuotationAmount,
  advanceAmountPaid = 0,
  balancePendingAmount,
  initialPaymentType,
  initialLeadName = 'Aneesh',
  initialEmail = 'experiences@wanderphilia.com',
  initialPhone = '9137290903',
  zohoLeadId,
  inquiryId,
  numDays = 15,
  numNights = 14,
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
    if (alreadyPaid <= 0) return 'token'; // Default to 10% Token
    if (alreadyPaid > 0 && alreadyPaid < fiftyPercentAmount) return 'remaining_advance';
    return 'remaining_balance';
  };

  const [paymentType, setPaymentType] = useState<ItineraryPaymentType>(getDefaultPaymentType());
  const [gstNumber, setGstNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
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

  const clientDisplayName = initialLeadName && initialLeadName !== 'Valued Traveler' ? initialLeadName : 'Aneesh';
  const itineraryDisplayName = proposalTitle || `${destination} Tour Itinerary`;

  const handlePayNow = async () => {
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
          customerName: clientDisplayName,
          customerEmail: initialEmail || 'experiences@wanderphilia.com',
          customerMobile: initialPhone || '+91 9137290903',
          customerGstNo: gstNumber.trim() ? gstNumber.trim().toUpperCase() : undefined,
          customerPanNo: panNumber.trim() ? panNumber.trim().toUpperCase() : undefined,
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
        description: `${installmentLabel} for ${itineraryDisplayName}`,
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
                customerName: clientDisplayName,
                customerEmail: initialEmail || 'experiences@wanderphilia.com',
                customerMobile: initialPhone || '+91 9137290903',
                customerGstNo: gstNumber.trim() ? gstNumber.trim().toUpperCase() : undefined,
                customerPanNo: panNumber.trim() ? panNumber.trim().toUpperCase() : undefined,
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
          name: clientDisplayName,
          email: initialEmail || 'experiences@wanderphilia.com',
          contact: initialPhone ? initialPhone.replace(/\D/g, '') : '9137290903',
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

  if (!open) {
    return null;
  }

  return (
    <Dialog open={open && !isRazorpayOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden bg-[#FAF8F5] border border-stone-300 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col w-[94vw] sm:w-full">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-[#6E1E14] via-[#5C1810] to-[#3D0F0A] text-white p-4 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
            <CreditCard className="w-36 h-36 text-amber-300" />
          </div>

          <div className="relative z-10 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-stone-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                <Parachute size={13} className="w-3.5 h-3.5 text-stone-950" /> Secure Online Booking
              </span>
              <span className="text-[10px] font-mono font-bold text-amber-200/90 bg-white/10 px-2 py-0.5 rounded-md">
                Ref: {itineraryId}
              </span>
            </div>

            <DialogTitle className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-white leading-snug">
              {itineraryDisplayName}
            </DialogTitle>

            <DialogDescription className="text-xs text-amber-100/90 flex flex-wrap items-center gap-x-2 gap-y-1 font-medium">
              <span>Guest: <strong className="text-white font-bold">{clientDisplayName}</strong></span>
              <span>•</span>
              <span>Rate: <strong className="text-white font-bold">₹{perAdultPrice.toLocaleString('en-IN')}/adult</strong> ({adults} Adults)</span>
              <span>•</span>
              <span className="text-amber-300 font-bold">5% GST & 2% TCS Included</span>
            </DialogDescription>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-5">

          {/* === 0. VERIFYING & GENERATING INVOICE LOADING VIEW === */}
          {isVerifying ? (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-4 border-amber-500 text-amber-700 flex items-center justify-center mx-auto shadow-md animate-spin">
                <Parachute size={24} className="w-6 h-6 text-amber-700" />
              </div>
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black uppercase px-3 py-1 rounded-full">
                  Processing Payment
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  Verifying Transaction...
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  Payment captured! We are now generating your official Wanderphilia Tax Invoice and updating your booking record in Zoho CRM. Please do not refresh.
                </p>
              </div>
            </div>
          ) : paymentSuccessData ? (
            /* === 1. SUCCESS VIEW IF PAYMENT COMPLETED === */
            <div className="space-y-5 py-2 text-center">
              
              {/* Green Animated Badge */}
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Payment Confirmed & Verified
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  {paymentSuccessData.balanceDue <= 0 ? '100% Tour Confirmed! ✈️' : 'Payment Received! ✈️'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you, <b>{clientDisplayName}</b>! Your payment has been received and verified. Your hotel accommodations and chauffeur transport are now being secured.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-white rounded-xl border-2 border-emerald-600/30 p-4 text-left space-y-2.5 shadow-xs max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 font-bold uppercase">Invoice Number</span>
                  <span className="text-sm font-mono font-black text-[#6E1E14]">
                    {paymentSuccessData.invoiceNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 font-bold uppercase">Amount Paid Today</span>
                  <span className="text-base font-black text-emerald-600">
                    ₹{paymentSuccessData.paidAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 font-bold uppercase">Total Paid To Date</span>
                  <span className="text-xs font-black text-stone-900">
                    ₹{paymentSuccessData.totalPaid.toLocaleString('en-IN')} / ₹{totalQuotationAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {gstNumber && (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                    <span className="text-stone-500 font-bold uppercase">GST Number</span>
                    <span className="font-mono font-bold text-stone-800">{gstNumber.toUpperCase()}</span>
                  </div>
                )}

                {panNumber && (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2 text-xs">
                    <span className="text-stone-500 font-bold uppercase">PAN Card</span>
                    <span className="font-mono font-bold text-stone-800">{panNumber.toUpperCase()}</span>
                  </div>
                )}

                {paymentSuccessData.balanceDue > 0 ? (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs text-stone-500 font-bold uppercase">Remaining Balance</span>
                    <span className="text-xs font-bold text-[#6E1E14]">
                      ₹{paymentSuccessData.balanceDue.toLocaleString('en-IN')} (Due 15 days before departure)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs text-stone-500 font-bold uppercase">Payment Status</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
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
              <div className="space-y-2.5 max-w-lg mx-auto pt-1">
                <Button
                  onClick={handleDownloadInvoice}
                  className="w-full h-11 rounded-xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition hover:scale-[1.01] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Tax Invoice (PDF)</span>
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition hover:scale-[1.01] cursor-pointer"
                >
                  <RiWhatsappLine className="w-4 h-4" />
                  <span>Connect with Tour Coordinator on WhatsApp</span>
                </a>
              </div>
            </div>
          ) : isFullyPaid ? (
            /* === FULLY PAID INITIAL VIEW === */
            <div className="space-y-5 py-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Booking 100% Cleared
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-stone-900">
                  Tour Fully Paid & Confirmed! ✈️
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  The entire package quotation of <b>₹{totalQuotationAmount.toLocaleString('en-IN')}</b> has been cleared.
                </p>
              </div>

              <div className="space-y-2.5 max-w-md mx-auto pt-1">
                <Button
                  onClick={handleDownloadInvoice}
                  className="w-full h-11 rounded-xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Latest Tax Invoice (PDF)</span>
                </Button>
                <a
                  href={`https://wa.me/91${contactPhoneDisplay}?text=Hi%20Wanderphilia,%20my%20${destination}%20booking%20(${itineraryId})%20is%20fully%20paid.%20Please%20share%20further%20updates.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs"
                >
                  <RiWhatsappLine className="w-4 h-4" />
                  <span>Chat with Trip Coordinator</span>
                </a>
              </div>
            </div>
          ) : (
            /* === 2. PAYMENT SELECTION & CHECKOUT FORM === */
            <div className="space-y-5">

              {/* PAYMENT OPTION SELECTOR */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#6E1E14] flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Select Payment Option:
                </label>

                {/* CASE 1: 0% PAID (FRESH LINK) -> 3 OPTIONS */}
                {alreadyPaid <= 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    
                    {/* OPTION 1: 10% TOKEN AMOUNT */}
                    <div
                      onClick={() => setPaymentType('token')}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
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
                        <div className="text-base sm:text-lg font-black text-[#6E1E14] pt-0.5">
                          ₹{tenPercentAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
                          Locks proposal & dates. 50% Advance payable within 7 days.
                        </p>
                      </div>
                    </div>

                    {/* OPTION 2: 50% ADVANCE AMOUNT */}
                    <div
                      onClick={() => setPaymentType('advance')}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
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
                        <div className="text-base sm:text-lg font-black text-[#6E1E14] pt-0.5">
                          ₹{fiftyPercentAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
                          Locks hotel stays, activities & transfers. Balance due 15 days before departure.
                        </p>
                      </div>
                    </div>

                    {/* OPTION 3: FULL 100% PAYMENT */}
                    <div
                      onClick={() => setPaymentType('full')}
                      className={`p-3 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
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
                        <div className="text-base sm:text-lg font-black text-stone-900 pt-0.5">
                          ₹{totalQuotationAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
                          Zero pending dues, instant confirmed booking.
                        </p>
                      </div>
                    </div>

                  </div>
                )}

                {/* CASE 2: 10% TOKEN PAID -> SHOW 2 OPTIONS */}
                {isTokenPaid && (
                  <div className="space-y-2.5">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-950 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>10% Token Paid: <b>₹{alreadyPaid.toLocaleString('en-IN')}</b></span>
                      </div>
                      <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black">
                        TOKEN ACTIVE
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* OPTION A: REMAINING 40% ADVANCE */}
                      <div
                        onClick={() => setPaymentType('remaining_advance')}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          paymentType === 'remaining_advance'
                            ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                            : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Next Stage (40%)
                          </span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            paymentType === 'remaining_advance' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                          }`}>
                            {paymentType === 'remaining_advance' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-xs font-black text-stone-900">
                            Pay Remaining Advance
                          </h4>
                          <div className="text-base sm:text-lg font-black text-[#6E1E14] pt-0.5">
                            ₹{remainingAdvanceAmount.toLocaleString('en-IN')}
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
                            Completes 50% advance. Balance due 15 days before travel.
                          </p>
                        </div>
                      </div>

                      {/* OPTION B: REMAINING FULL BALANCE (90%) */}
                      <div
                        onClick={() => setPaymentType('remaining_balance')}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                          paymentType === 'remaining_balance'
                            ? 'border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20'
                            : 'border-stone-200 bg-white/70 hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="bg-emerald-100 text-emerald-900 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Clear All Dues
                          </span>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            paymentType === 'remaining_balance' ? 'border-[#6E1E14] bg-[#6E1E14]' : 'border-stone-300'
                          }`}>
                            {paymentType === 'remaining_balance' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>

                        <div className="pt-2">
                          <h4 className="text-xs font-black text-stone-900">
                            Pay Remaining Balance
                          </h4>
                          <div className="text-base sm:text-lg font-black text-stone-900 pt-0.5">
                            ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                          </div>
                          <p className="text-[10px] text-stone-500 leading-tight pt-0.5">
                            Clears 100% tour quotation immediately with 0 balance pending.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* CASE 3: 50% ADVANCE PAID -> SHOW FINAL 50% REMAINING BALANCE */}
                {isAdvancePaid && (
                  <div className="space-y-2.5">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 font-bold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>50% Advance Paid: <b>₹{alreadyPaid.toLocaleString('en-IN')}</b></span>
                      </div>
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">
                        ADVANCE CLEARED
                      </span>
                    </div>

                    <div
                      onClick={() => setPaymentType('remaining_balance')}
                      className="p-3.5 rounded-xl border-2 border-[#6E1E14] bg-white shadow-md ring-2 ring-[#6E1E14]/20 cursor-pointer relative flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between gap-1.5">
                        <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                          Final Payment
                        </span>
                        <div className="w-4 h-4 rounded-full border-2 border-[#6E1E14] bg-[#6E1E14] flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      </div>

                      <div className="pt-2">
                        <h4 className="text-xs font-black text-stone-900">
                          Pay Remaining 50% Balance
                        </h4>
                        <div className="text-lg sm:text-xl font-black text-[#6E1E14] pt-0.5">
                          ₹{remainingBalanceAmount.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[10px] text-stone-600 leading-tight pt-0.5">
                          Due 15 days before departure. Clears all travel services and issues final invoice.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* OPTIONAL CORPORATE BILLING / TAX DETAILS */}
              <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-stone-800">
                    <Building2 className="w-3.5 h-3.5 text-[#6E1E14]" />
                    <span>Billing & Tax Details (Optional)</span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Optional</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-600 uppercase mb-1">
                      GST Number (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. 07AAAAA0000A1Z5"
                      value={gstNumber}
                      maxLength={15}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      className="h-9 text-xs uppercase font-mono bg-[#FAF8F5] border-stone-300 rounded-lg focus:border-[#6E1E14]"
                    />
                    <p className="text-[9px] text-stone-400 mt-0.5">For corporate GST input credit invoice.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-600 uppercase mb-1">
                      PAN Card Number (Optional)
                    </label>
                    <Input
                      type="text"
                      placeholder="e.g. ABCDE1234F"
                      value={panNumber}
                      maxLength={10}
                      onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                      className="h-9 text-xs uppercase font-mono bg-[#FAF8F5] border-stone-300 rounded-lg focus:border-[#6E1E14]"
                    />
                    <p className="text-[9px] text-stone-400 mt-0.5">For TCS record & formal billing.</p>
                  </div>
                </div>
              </div>

              {/* PAYMENT SUMMARY BREAKDOWN CARD */}
              <div className="bg-gradient-to-br from-stone-900 via-[#4A140D] to-[#300B07] text-white p-4 rounded-xl shadow-md space-y-2.5">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 text-stone-300">
                  <span>Total Tour Package ({adults} Adults):</span>
                  <span className="font-bold text-white">₹{totalQuotationAmount.toLocaleString('en-IN')}</span>
                </div>

                {alreadyPaid > 0 && (
                  <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2 text-emerald-300 font-bold">
                    <span>Already Paid So Far:</span>
                    <span>₹{alreadyPaid.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-0.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                      Amount Payable Today ({installmentLabel})
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-white">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {postPaymentBalance > 0 ? (
                    <div className="text-right text-[10px] text-stone-300">
                      <span>Remaining Balance:</span>
                      <div className="font-black text-amber-300 text-xs sm:text-sm">
                        ₹{postPaymentBalance.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-right text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-800">
                      ✓ 100% Cleared (0 Balance)
                    </div>
                  )}
                </div>
              </div>

              {/* PAY BUTTON & GATEWAY BADGE */}
              <div className="space-y-2 pt-0.5">
                <Button
                  onClick={handlePayNow}
                  disabled={isProcessing || payableAmount <= 0}
                  className="w-full h-11 sm:h-12 rounded-xl bg-[#6E1E14] hover:bg-[#5C1810] text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      <span>Opening Secure Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pay ₹{payableAmount.toLocaleString('en-IN')} Securely with Razorpay</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </Button>

                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9px] sm:text-[10px] text-stone-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-bit SSL Encrypted • Razorpay Certified</span>
                  </span>
                  <span>UPI • GPay • Cards • Netbanking</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
