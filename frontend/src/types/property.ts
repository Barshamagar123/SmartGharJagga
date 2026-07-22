// src/types/property.ts

export type PropertyType = 'VILLA' | 'HOUSE' | 'APARTMENT' | 'BUNGALOW' | 'LAND';
export type PropertyStatus = 'AVAILABLE' | 'SOLD' | 'UNDER_CONTRACT' | 'RENTED';

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
  status?: PropertyStatus;
}

export interface Agent {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  company: string;
  experience?: string;
  propertiesSold?: number;
  rating?: number;
  verified?: boolean;
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
    type: 'school' | 'hospital' | 'mall' | 'park' | 'transport' | 'restaurant';
    icon?: string;
  }[];
  images: string[];
  rating?: number;
  reviews?: number;
  agent: Agent;
  virtualTour?: string;
  floorPlan?: string;
  lastUpdated?: string;
}