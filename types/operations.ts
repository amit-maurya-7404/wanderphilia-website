export type OperationsStatus =
  | 'pending_ops'        // Handed over by Sales, awaiting ops start
  | 'in_progress'        // Hotel / transport bookings underway
  | 'issue'              // Hotel sold out or rate change needed
  | 'ops_confirmed'      // All hotels and transport confirmed
  | 'synced_to_finance'; // Synced to Zoho CRM Finance module

export interface OperationsHotelItem {
  id: string; // e.g. "hotel-1", "hotel-2"
  city: string;
  nights: number;
  hotelName: string;
  hotelId?: string; // Zoho CRM Hotel record ID if resolved
  category?: string; // Deluxe / Luxury / Premium / Standard
  roomCategory: string;
  roomsCount: number;
  sharingType?: string;
  dates?: string; // e.g. "25-Nov-2026 to 26-Nov-2026"
  basePrice?: number;
  pricePerNight?: number; // Actual B2B net contract rate per night (Price_Per_Night)
  b2bCostPerNight?: number;
  b2bTotalCost: number;
  extraBedPrice?: number; // Extra bed rate per night
  extraBedCount?: number; // Number of extra beds required
  extraBedTotalCost?: number; // Total extra bed cost (rate * count * nights)
  childWithoutBedPrice?: number;
  childWithoutBedCount?: number;
  childWithoutBedTotalCost?: number;
  clientQuotationCost?: number;
  status: 'requested' | 'confirmed' | 'sold_out' | 'issue';
  confirmationNumber?: string;
  voucherUrl?: string;
  notes?: string;
  isManualCost?: boolean; // When manual cost override is toggled
  proofUrl?: string; // Compulsory proof screenshot when manual cost is entered
  proofFileName?: string;
}

export interface OperationsTransportItem {
  vehicleType: string;
  vehicleId?: string; // Zoho CRM Vehicle record ID
  vendorName?: string;
  vendorId?: string; // Zoho CRM Vendor record ID
  totalDays: number;
  costPerDay?: number;
  b2bTotalCost: number;
  clientQuotationCost?: number;
  status: 'assigned' | 'confirmed';
  driverName?: string;
  driverMobile?: string;
  vehicleNumber?: string;
  notes?: string;
  isManualCost?: boolean;
  proofUrl?: string; // Compulsory proof screenshot when manual transport cost is entered
  proofFileName?: string;
}

export interface ChildTravelerDetail {
  age: number;
  bedPreference: 'Extra Bed' | 'Without Bed' | 'Sharing';
}

export interface OperationsBooking {
  id: string; // e.g. "OPS-INQ-1002" or unique ID
  bookingId?: string; // Zoho CRM Deal/Booking ID (e.g. 843125000013291001)
  inquiryId: string; // Zoho CRM Inquiry / Lead ID (e.g. INQ-1002)
  zohoLeadId?: string;
  zohoOperationsId?: string;
  zohoFinanceId?: string;
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
  childrenDetails?: ChildTravelerDetail[];
  numberOfGuests: number;
  adultsCount?: number;
  paxCount?: number;
  hotelCategory?: string; // Deluxe, Luxury, Premium, Standard
  roomsCount: number;
  sharingType: string;
  roomCategory?: string;
  selectedOptionNumber: number; // 1, 2, or 3
  selectedOptionTitle: string;
  itineraryUrl: string;
  itineraryDocId?: string;

  // Zoho CRM Operations Flags (matching CustomModule11)
  isTransportBooked?: boolean;
  isAllHotelsBooked?: boolean;
  isActivitiesBooked?: boolean;
  isManualCalculation?: boolean;
  isSyncToFinance?: boolean;
  operationOwner?: string;

  // Financials
  totalQuotationAmount: number; // Selling price to client
  advanceAmountPaid: number; // Advance paid
  balancePendingAmount: number; // Balance pending
  paymentMode: 'bank_transfer' | 'upi' | 'cheque' | 'cash' | 'razorpay' | 'other';
  utrNumber?: string; // Bank UTR or Transaction Ref
  paymentDate?: string;
  paymentProofUrl?: string; // Uploaded receipt/screenshot

  // Handover Info
  salesRepName?: string;
  salesNotes?: string;
  handedOverAt: string;

  // Operations Execution State
  opsStatus: OperationsStatus;
  hotels: OperationsHotelItem[];
  transport: OperationsTransportItem;
  dayActivities?: any[];
  specialRequirements?: string;

  // Live Profitability
  totalB2BHotelCost: number;
  totalB2BTransportCost: number;
  totalB2BCost: number;
  grossMarginAmount: number;
  grossMarginPercentage: number;

  // Finance Sync Info
  syncedToFinanceAt?: string;
  financeSyncResponse?: any;
  experiencesTotalCost?: number;
  experiencesListWithCost?: string;
  extraAmountPaidByTransportVendor?: number;
  extraAmountDetails?: string;

  // Audit Trail
  updatedAt: string;
  createdAt: string;
}

export interface OperationsSummaryStats {
  totalBookings: number;
  pendingOps: number;
  inProgress: number;
  issues: number;
  confirmed: number;
  syncedToFinance: number;
  totalClientRevenue: number;
  totalB2BCost: number;
  totalProjectedProfit: number;
}
