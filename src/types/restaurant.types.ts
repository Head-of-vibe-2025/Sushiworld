// Restaurant Types

export interface OpeningHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country?: string;
  };
  openingHours: OpeningHours;
  deliveryInfo?: {
    radius?: string;
    postalCodes?: string[];
    restrictions?: string[];
  };
  associatedLocations?: string[];
  bookingUrl?: string;
  image?: string;
  rating?: number;
}

