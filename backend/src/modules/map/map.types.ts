// src/modules/map/map.types.ts

export interface PropertyLocation {
  id: string;
  title: string;
  price: number;
  location: string;
  latitude: number;
  longitude: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  mainImage?: string;
}

export interface HeatMapData {
  lat: number;
  lng: number;
  weight: number;
  propertyId?: string;
}

export interface SearchArea {
  lat: number;
  lng: number;
  radius: number; // in kilometers
}

// ✅ Updated NearbyPlace with more fields
export interface NearbyPlace {
  id: string;
  name: string;
  address?: string;
  type: 'school' | 'hospital' | 'market' | 'park' | 'restaurant' | 'bank' | 'pharmacy' | 'supermarket' | 'cafe' | 'gym' | 'mall' | 'atm' | 'bus_station';
  lat: number;
  lng: number;
  distance: number; // in meters
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  phoneNumber?: string;
  website?: string;
  openingHours?: string[];
  photoReference?: string;
  isOpen?: boolean;
}

// ✅ Google Places API Response Types
export interface GooglePlacesResponse {
  results: GooglePlace[];
  status: string;
  next_page_token?: string;
}

export interface GooglePlace {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  price_level?: number;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text: string[];
  };
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
  permanently_closed?: boolean;
}

// ✅ Nearby Places Request
export interface NearbyPlacesRequest {
  lat: number;
  lng: number;
  radius?: number; // in km
  types?: string[];
  limit?: number;
  keyword?: string;
  minRating?: number;
}