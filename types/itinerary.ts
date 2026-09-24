export interface ItineraryLeadDetails {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  guests?: number;
  startDate?: string;
  endDate?: string;
  duration?: string;
  noOfDays?: number;
  noOfNights?: number;
  travelStyle?: string;
  tripType?: string;
  vehicleType?: string;
  preferredRoomCategory?: string;
  mealPlan?: string;
  sharingType?: string;
  budget?: string | number;
  finalQuotationAmount?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  notes?: string;
}

export interface ItineraryDayPlan {
  day: number;
  title: string;
  description: string;
  stayLocation?: string;
  activities?: string[];
  timeline?: string[]; // Chronological flowchart milestones (morning to night)
  image?: string;
  meals?: string;
  highlights?: string[];
}

export interface ItineraryStayDetails {
  hotelName?: string;
  roomCategory?: string;
  rating?: number | string;
  mealPlan?: string;
  checkIn?: string;
  checkOut?: string;
  amenities?: string[];
  location?: string;
}

export interface ItineraryDocument {
  _id?: string;
  id: string; // Public unique slug/ID (e.g. wp-x7k9q2)
  slug: string;
  subTitle?: string; // AI-generated 1-3 words or travel style
  description?: string; // AI-generated clean one-liner luxury description
  title?: string;
  destination: string;
  stateOrCountry?: string;
  travelStyle?: string; // e.g. "Family Trip", "Couple Trip" from Zoho Leads.Travel Style
  tripType?: string;
  vehicleType?: string; // e.g. "Sedan / Innova / Tempo Traveller" from Zoho Leads.Vehicle Type
  noOfDays?: number; // e.g. from Zoho Leads.No. of Days
  noOfNights?: number; // e.g. from Zoho Leads.No. of Nights
  inquiryId?: string;
  leadDetails?: ItineraryLeadDetails;
  stay?: ItineraryStayDetails;
  hotelName?: string;
  roomCategory?: string;
  mealPlan?: string;
  finalQuotationAmount?: number;
  perAdultPrice?: number;
  perKidPrice?: number;
  adults?: number;
  kids?: number;
  advanceAmountPaid?: number;
  balancePendingAmount?: number;
  dayPlans?: ItineraryDayPlan[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  amenities?: string[];
  packingTips?: string[];
  importantNotes?: string[];
  paymentTerms?: string[];
  cancellationPolicy?: string[];
  forceMajeurePolicy?: string[];
  heroImage?: string;
  galleryImages?: string[];
  status: 'active' | 'draft' | 'archived';
  rawZohoData?: Record<string, any>;
  createdAt: string | Date;
  updatedAt: string | Date;
}
