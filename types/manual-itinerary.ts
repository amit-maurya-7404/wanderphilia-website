export interface ManualDaySection {
  title: string;
  note?: string;
  items?: string[];
  type?: 'normal' | 'signature' | 'optional' | 'celebration';
}

export interface ManualDayPlan {
  day: number;
  date?: string;
  title: string;
  route?: string;
  durationNote?: string; // e.g. "Approx. 6–7 hrs"
  intro?: string;
  timeline: string[]; // Flowchart bullet points
  sections?: ManualDaySection[];
  outro?: string | string[];
  optionalNote?: string;
  signatureNote?: string;
  stayLocation?: string;
  image?: string;
  meals?: string;
  signOff?: string;
}

export interface ManualAccommodation {
  city: string;
  nights: number;
  hotelName?: string;
  roomCategory?: string;
}

export interface FlightSector {
  fromCity: string;
  toCity: string;
  via?: string;
  airline: string;
  flightNumber: string;
  departureDate: string;
  departureTime: string;
  arrivalDate?: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  baggage: string;
  price?: number;
  paxDetails?: string;
  refundPolicy?: string;
}

export interface FlightQuotationOption {
  optionId?: string;
  optionTitle: string;
  totalPrice: number;
  paxDetails?: string;
  sectors: FlightSector[];
  note?: string;
}

export interface ManualItineraryOption {
  id: string; // e.g. "option-1", "option-2", "deluxe", "luxury"
  title: string; // e.g. "Option 1: 4★ Deluxe Package"
  subtitle?: string; // e.g. "Superior Ocean View + Duplex Suite"
  badge?: string; // e.g. "Recommended", "5-Star Luxury", "Popular"
  isDefault?: boolean;
  
  // Pricing & Breakdown
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  baseAmount?: number;
  gstPercentage?: number;
  tcsPercentage?: number;
  gstAmount?: number;
  tcsAmount?: number;
  finalQuotationAmount?: number;
  childPricingNote?: string;
  kidsDetails?: string;

  // Stays & Accommodations for this specific option
  accommodations?: ManualAccommodation[];

  // Flight Quotations associated with this option
  flightQuotations?: FlightQuotationOption[];

  // Optional Overrides
  dayPlans?: ManualDayPlan[];
  inclusions?: string[];
  exclusions?: string[];
  vehicleType?: string;
  mealPlan?: string;
  duration?: string;
  numDays?: number;
  numNights?: number;
  routeSummary?: string;
  notes?: string;
}

export interface ManualItinerary {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  duration: string; // e.g. "9 Nights / 10 Days | 25 December – 3 January"
  numNights: number;
  numDays: number;
  dates: string; // e.g. "25 December – 3 January"
  route: string; // e.g. "Chandigarh → Dharamshala → Dalhousie → Bir → Manali → Kasol → Chandigarh."
  routeSummary?: string; // e.g. "2N Dharamshala | 2N Dalhousie | 1N Bir | 2N Manali | 2N Kasol"
  destination: string;
  travelStyle?: string;
  tripType?: string;
  leadName?: string;
  vehicleType?: string;
  mealPlan?: string;
  heroImage: string;
  galleryImages: string[];
  moments?: string[];
  highlights?: string[];
  dayPlans: ManualDayPlan[];
  accommodations?: ManualAccommodation[];
  flightQuotations?: FlightQuotationOption[];
  options?: ManualItineraryOption[]; // Multi-Option Interactive Support
  inclusions: string[];
  exclusions: string[];
  thingsToCarry?: string[];
  finalQuotationAmount?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  childPricingNote?: string;
  kidsDetails?: string;
  baseAmount?: number;
  gstPercentage?: number;
  tcsPercentage?: number;
  gstAmount?: number;
  tcsAmount?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  paymentStage?: 'unpaid' | 'token_paid' | 'advance_paid' | 'fully_paid';
  payments?: any[];
}
