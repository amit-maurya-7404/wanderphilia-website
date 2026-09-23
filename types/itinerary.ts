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
  sharingType?: string;
  budget?: string | number;
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
  subTitle: string; // AI-generated 1-3 words (e.g. "Desert Tent", "Luxury Suite")
  description: string; // AI-generated clean one-liner luxury description
  title?: string;
  destination: string;
  stateOrCountry?: string;
  leadDetails?: ItineraryLeadDetails;
  stay?: ItineraryStayDetails;
  hotelName?: string;
  roomCategory?: string;
  mealPlan?: string;
  dayPlans?: ItineraryDayPlan[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  amenities?: string[];
  packingTips?: string[];
  importantNotes?: string[];
  heroImage?: string;
  galleryImages?: string[];
  status: 'active' | 'draft' | 'archived';
  rawZohoData?: Record<string, any>;
  createdAt: string | Date;
  updatedAt: string | Date;
}
