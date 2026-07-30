// src/modules/map/map.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { 
  PropertyLocation, 
  HeatMapData, 
  SearchArea, 
  NearbyPlace, 
  NearbyPlacesRequest,
  GooglePlacesResponse,
  GooglePlace
} from './map.types';

export class MapService {
  private googlePlacesApiKey: string;

  constructor(private prisma: PrismaClient) {
    this.googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    
    if (!this.googlePlacesApiKey) {
      console.warn('⚠️ GOOGLE_PLACES_API_KEY is not set. Nearby places will use database fallback.');
    }
  }

  // ============================================
  // 1. Get All Property Locations
  // ============================================
  async getPropertyLocations(): Promise<PropertyLocation[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        images: true,
        mainImage: true,
      },
    });

    return properties.map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      location: p.location,
      latitude: p.latitude!,
      longitude: p.longitude!,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      area: p.area || 0,
      images: p.images,
      mainImage: p.mainImage || undefined,
    }));
  }

  // ============================================
  // 2. Get Heat Map Data
  // ============================================
  async getHeatMapData(): Promise<HeatMapData[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        price: true,
        views: true,
      },
    });

    const maxPrice = Math.max(...properties.map((p) => Number(p.price)), 1);
    const maxViews = Math.max(...properties.map((p) => p.views), 1);

    return properties.map((p) => ({
      lat: p.latitude!,
      lng: p.longitude!,
      weight: (Number(p.price) / maxPrice) * 0.5 + (p.views / maxViews) * 0.5,
      propertyId: p.id,
    }));
  }

  // ============================================
  // 3. Get Price Heat Map Data
  // ============================================
  async getPriceHeatMapData(): Promise<HeatMapData[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        price: true,
      },
    });

    const maxPrice = Math.max(...properties.map((p) => Number(p.price)), 1);

    return properties.map((p) => ({
      lat: p.latitude!,
      lng: p.longitude!,
      weight: Number(p.price) / maxPrice,
      propertyId: p.id,
    }));
  }

  // ============================================
  // 4. Search Properties by Area (Draw-to-Search)
  // ============================================
  async searchByArea(searchArea: SearchArea): Promise<PropertyLocation[]> {
    const { lat, lng, radius } = searchArea;

    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        longitude: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        images: true,
        mainImage: true,
      },
    });

    return properties.map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      location: p.location,
      latitude: p.latitude!,
      longitude: p.longitude!,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      area: p.area || 0,
      images: p.images,
      mainImage: p.mainImage || undefined,
    }));
  }

  // ============================================
  // 5. Get Nearby Places - DYNAMIC (Google Places API)
  // ============================================
  async getNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 2,
    types: string[] = ['school', 'hospital', 'market', 'park', 'restaurant', 'bank', 'pharmacy', 'supermarket', 'cafe', 'gym'],
    limit: number = 20,
    keyword?: string,
    minRating?: number
  ): Promise<NearbyPlace[]> {
    try {
      // ✅ Use Google Places API if key is available
      if (this.googlePlacesApiKey) {
        console.log(`📍 Fetching nearby places from Google Places API for ${lat}, ${lng}`);
        const places = await this.fetchFromGooglePlaces(lat, lng, radius, types, limit, keyword, minRating);
        
        if (places.length > 0) {
          console.log(`✅ Found ${places.length} places from Google Places API`);
          return places;
        }
      }
      
      // ✅ Fallback to database
      console.log('⚠️ Falling back to database for nearby places');
      return await this.getNearbyPlacesFromDB(lat, lng, radius, limit);
    } catch (error) {
      console.error('❌ Error fetching nearby places:', error);
      return await this.getNearbyPlacesFromDB(lat, lng, radius, limit);
    }
  }

  // ============================================
  // 5a. Fetch from Google Places API
  // ============================================
  private async fetchFromGooglePlaces(
    lat: number,
    lng: number,
    radius: number,
    types: string[],
    limit: number,
    keyword?: string,
    minRating?: number
  ): Promise<NearbyPlace[]> {
    // ✅ Map our types to Google Places types
    const typeMapping: Record<string, string[]> = {
      'school': ['school'],
      'hospital': ['hospital'],
      'market': ['shopping_mall', 'market'],
      'park': ['park'],
      'restaurant': ['restaurant', 'food'],
      'bank': ['bank'],
      'pharmacy': ['pharmacy'],
      'supermarket': ['supermarket', 'grocery_or_supermarket'],
      'cafe': ['cafe'],
      'gym': ['gym'],
      'mall': ['shopping_mall'],
      'atm': ['atm'],
      'bus_station': ['bus_station'],
    };

    // ✅ Build Google Places API URL
    const googleTypes = types.flatMap(t => typeMapping[t] || [t]);
    const typeParam = googleTypes.join('|');
    
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius * 1000}&key=${this.googlePlacesApiKey}`;
    
    if (typeParam) {
      url += `&types=${typeParam}`;
    }
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    console.log(`📤 Google Places API URL: ${url}`);

    const response = await fetch(url);
    
    // ✅ FIX: Parse JSON and cast to GooglePlacesResponse
    const rawData = await response.json();
    const data = rawData as GooglePlacesResponse;

    // ✅ Check for errors
    if (data.status === 'REQUEST_DENIED') {
      console.error('❌ Google Places API: Request denied. Check API key and permissions.');
      throw new Error('Google Places API request denied. Please check API key and enable Places API.');
    }

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`❌ Google Places API error: ${data.status}`);
      throw new Error(`Google Places API error: ${data.status}`);
    }

    if (!data.results || data.results.length === 0) {
      return [];
    }

    // ✅ Transform Google Places response to our format
    let places: NearbyPlace[] = data.results.map((place: GooglePlace) => {
      // Determine the primary type
      let primaryType: NearbyPlace['type'] = 'restaurant';
      for (const [key, googleTypes] of Object.entries(typeMapping)) {
        if (place.types.some(t => googleTypes.includes(t))) {
          primaryType = key as NearbyPlace['type'];
          break;
        }
      }

      // Calculate distance from user location
      const distance = this.calculateDistance(
        lat,
        lng,
        place.geometry.location.lat,
        place.geometry.location.lng
      ) * 1000; // Convert to meters

      return {
        id: place.place_id,
        name: place.name,
        address: place.vicinity || place.formatted_address || '',
        type: primaryType,
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        distance: Math.round(distance * 100) / 100,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        phoneNumber: place.formatted_phone_number,
        website: place.website,
        openingHours: place.opening_hours?.weekday_text,
        photoReference: place.photos?.[0]?.photo_reference,
        isOpen: place.opening_hours?.open_now,
      };
    });

    // ✅ Filter by min rating if specified
    if (minRating) {
      places = places.filter(p => p.rating && p.rating >= minRating);
    }

    // ✅ Sort by distance
    places.sort((a, b) => a.distance - b.distance);

    // ✅ Limit results
    return places.slice(0, limit);
  }

  // ============================================
  // 5b. Fallback: Get Nearby Places from Database
  // ============================================
  private async getNearbyPlacesFromDB(
    lat: number,
    lng: number,
    radius: number,
    limit: number
  ): Promise<NearbyPlace[]> {
    const latDelta = radius / 111;
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: {
          gte: lat - latDelta,
          lte: lat + latDelta,
        },
        longitude: {
          gte: lng - lngDelta,
          lte: lng + lngDelta,
        },
      },
      take: limit,
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        location: true,
      },
    });

    const typeMap: Record<string, NearbyPlace['type']> = {
      HOUSE: 'school',
      RESIDENTIAL_LAND: 'park',
      COMMERCIAL_LAND: 'market',
      SHOP: 'market',
      OFFICE: 'bank',
      HOTEL: 'restaurant',
      RESTAURANT: 'restaurant',
    };

    const places: NearbyPlace[] = properties.map((p) => {
      const distance = this.calculateDistance(
        lat,
        lng,
        p.latitude!,
        p.longitude!
      ) * 1000;

      return {
        id: p.id,
        name: p.title,
        address: p.location,
        type: typeMap[p.propertyType] || 'restaurant',
        lat: p.latitude!,
        lng: p.longitude!,
        distance: Math.round(distance * 100) / 100,
      };
    });

    places.sort((a, b) => a.distance - b.distance);
    return places;
  }

  // ============================================
  // 6. Get Nearest Properties
  // ============================================
  async getNearestProperties(
    lat: number,
    lng: number,
    limit: number = 10
  ): Promise<PropertyLocation[]> {
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      take: limit * 2,
      select: {
        id: true,
        title: true,
        price: true,
        location: true,
        latitude: true,
        longitude: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        area: true,
        images: true,
        mainImage: true,
      },
    });

    const withDistance = properties.map((p) => {
      const distance = this.calculateDistance(
        lat,
        lng,
        p.latitude!,
        p.longitude!
      );
      return { ...p, distance };
    });

    withDistance.sort((a, b) => a.distance - b.distance);
    
    return withDistance.slice(0, limit).map((p) => ({
      id: p.id,
      title: p.title,
      price: Number(p.price),
      location: p.location,
      latitude: p.latitude!,
      longitude: p.longitude!,
      propertyType: p.propertyType,
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      area: p.area || 0,
      images: p.images,
      mainImage: p.mainImage || undefined,
    }));
  }

  // ============================================
  // 7. Get Place Photo URL (Helper)
  // ============================================
  getPlacePhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.googlePlacesApiKey) return '';
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.googlePlacesApiKey}`;
  }

  // ============================================
  // Helper: Calculate Distance (Haversine formula)
  // ============================================
  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}