// src/modules/map/map.service.ts

import { PrismaClient } from '@prisma/client';
import { ApiError } from '@/utils/apiError';
import { PropertyLocation, HeatMapData, SearchArea, NearbyPlace } from './map.types';

export class MapService {
  constructor(private prisma: PrismaClient) {}

  // ============================================
  // 1. Get All Property Locations for Map
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

    // Calculate weight based on price and views
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

    // Convert radius to degrees (approximate)
    // 1 degree ≈ 111 km
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
  // 5. Get Nearby Places
  // ============================================
  async getNearbyPlaces(
    lat: number,
    lng: number,
    radius: number = 2 // Default 2km
  ): Promise<NearbyPlace[]> {
    // Note: In production, you would use Google Places API
    // This is a mock implementation for demonstration
    
    // For now, return mock data based on property locations
    const properties = await this.prisma.property.findMany({
      where: {
        status: 'APPROVED',
        latitude: { not: null },
        longitude: { not: null },
      },
      take: 10,
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        propertyType: true,
      },
    });

    // Mock nearby places (schools, hospitals, markets, parks, restaurants)
    const mockPlaces: NearbyPlace[] = [
      {
        id: 'school-1',
        name: 'Kathmandu School',
        type: 'school',
        lat: lat + 0.005,
        lng: lng + 0.003,
        distance: 0.5,
      },
      {
        id: 'hospital-1',
        name: 'Kathmandu Hospital',
        type: 'hospital',
        lat: lat - 0.004,
        lng: lng + 0.006,
        distance: 0.8,
      },
      {
        id: 'market-1',
        name: 'City Market',
        type: 'market',
        lat: lat + 0.008,
        lng: lng - 0.005,
        distance: 1.2,
      },
      {
        id: 'park-1',
        name: 'Central Park',
        type: 'park',
        lat: lat - 0.003,
        lng: lng - 0.007,
        distance: 0.9,
      },
      {
        id: 'restaurant-1',
        name: 'Nepali Restaurant',
        type: 'restaurant',
        lat: lat + 0.007,
        lng: lng + 0.009,
        distance: 1.5,
      },
    ];

    return mockPlaces;
  }

  // ============================================
  // 6. Get Property by Location (Nearest)
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
      take: limit * 2, // Get extra for filtering
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

    // Calculate distance and sort
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