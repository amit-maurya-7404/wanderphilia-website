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
  dayPlans: ManualDayPlan[];
  accommodations?: ManualAccommodation[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry?: string[];
  finalQuotationAmount?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  baseAmount?: number;
  gstPercentage?: number;
  tcsPercentage?: number;
  gstAmount?: number;
  tcsAmount?: number;
}
