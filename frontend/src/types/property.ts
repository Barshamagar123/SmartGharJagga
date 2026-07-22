// src/types/property.ts

export type PropertyType = 'VILLA' | 'HOUSE' | 'APARTMENT' | 'BUNGALOW' | 'LAND';

export interface Property {
  id: number;
  slug: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: PropertyType;
  featured: boolean;
  description?: string;
  yearBuilt?: number;
  garage?: number;
  propertyTax?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyDetail extends Property {
  description: string;
  yearBuilt: number;
  garage: number;
  propertyTax: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  nearby: {
    name: string;
    distance: string;
    type: 'school' | 'hospital' | 'mall' | 'park' | 'transport';
  }[];
  images: string[];
}