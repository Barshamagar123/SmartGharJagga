// src/pages/properties/PropertiesPage.tsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyHeader from '../../components/properties/PropertyHeader';
import PropertyFilters from '../../components/properties/PropertyFilters';
import PropertyGrid from '../../components/properties/PropertyGrid';
import PropertyPagination from '../../components/properties/PropertyPagination';
import PropertySort from '../../components/properties/PropertySort';
import { propertyApi } from '../../services/api/property';
import type { Property, PropertyType } from '../../types/property';

// ✅ Image helper - Same as PropertyDetail
const API_URL = 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState({
    propertyType: (searchParams.get('propertyType') as PropertyType) || '',
    maxPrice: parseInt(searchParams.get('maxPrice') || '500'),
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    location: searchParams.get('location') || '',
  });
  
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const filterParams: any = {
          minPrice: 0,
          maxPrice: filters.maxPrice * 100000,
          page: currentPage,
          limit: 12,
          sortBy: sort === 'newest' ? 'createdAt' : sort === 'price_low' ? 'price' : 'views',
          sortOrder: sort === 'price_low' ? 'asc' : 'desc',
        };

        if (filters.propertyType) {
          filterParams.propertyType = filters.propertyType as PropertyType;
        }
        if (filters.bedrooms) {
          filterParams.bedrooms = parseInt(filters.bedrooms);
        }
        if (filters.bathrooms) {
          filterParams.bathrooms = parseInt(filters.bathrooms);
        }
        if (filters.location) {
          filterParams.location = filters.location;
        }

        const result = await propertyApi.getAll(filterParams);

        const processedProperties = result.properties.map((property: Property) => {
          const processedImages = property.images?.map((img: string) => getImageUrl(img)) || [];
          const processedMainImage = getImageUrl(property.mainImage || property.images?.[0]);
          
          return {
            ...property,
            images: processedImages,
            mainImage: processedMainImage,
          };
        });

        setProperties(processedProperties);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, sort, currentPage]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    const params: any = {};
    if (filters.propertyType) params.propertyType = filters.propertyType;
    if (filters.location) params.location = filters.location;
    if (filters.bedrooms) params.bedrooms = filters.bedrooms;
    if (filters.bathrooms) params.bathrooms = filters.bathrooms;
    if (filters.maxPrice !== 500) params.maxPrice = filters.maxPrice;
    if (sort !== 'newest') params.sort = sort;
    setSearchParams(params);
  };

  const handleFavoriteToggle = async (propertyId: string) => {
    try {
      const result = await propertyApi.toggleFavorite(propertyId);
      setProperties(prev =>
        prev.map(p =>
          p.id === propertyId
            ? { ...p, favoritesCount: result.favorited ? p.favoritesCount + 1 : p.favoritesCount - 1 }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <PropertyHeader totalProperties={total} />

      {/* ✅ FIXED: Padding same as PropertyDetail - px-8 */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters - Width same as before */}
          <aside className="lg:w-72 xl:w-80 flex-shrink-0">
            <PropertyFilters
              propertyType={filters.propertyType}
              setPropertyType={(value) => setFilters({ ...filters, propertyType: value as PropertyType })}
              maxPrice={filters.maxPrice}
              setMaxPrice={(value) => setFilters({ ...filters, maxPrice: value })}
              bedrooms={filters.bedrooms}
              setBedrooms={(value) => setFilters({ ...filters, bedrooms: value })}
              bathrooms={filters.bathrooms}
              setBathrooms={(value) => setFilters({ ...filters, bathrooms: value })}
              location={filters.location}
              setLocation={(value) => setFilters({ ...filters, location: value })}
              onApplyFilters={handleApplyFilters}
            />
          </aside>

          <main className="flex-1">
            <PropertySort value={sort} onChange={setSort} />
            
            <PropertyGrid 
              properties={properties} 
              loading={loading}
              onFavoriteToggle={handleFavoriteToggle}
            />

            {totalPages > 1 && (
              <PropertyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;