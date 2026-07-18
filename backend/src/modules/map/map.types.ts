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

export interface NearbyPlace {
  id: string;
  name: string;
  type: 'school' | 'hospital' | 'market' | 'park' | 'restaurant';
  lat: number;
  lng: number;
  distance: number; // in meters
}