// src/pages/Properties/Properties.tsx

import React, { useState } from 'react';
import PropertyHeader from '../../components/properties/PropertyHeader';
import PropertyFilters from '../../components/properties/PropertyFilters';
import PropertySort from '../../components/properties/PropertySort';
import PropertyGrid from '../../components/properties/PropertyGrid';
import PropertyPagination from '../../components/properties/PropertyPagination';
import type { Property } from '../../types/property';
// ============================================
// DATA - Defined directly in the page
// ============================================
const PROPERTIES: Property[] = [
  {
    id: 1,
    slug: 'aspen-ridge-villa',
    title: 'Aspen Ridge Villa',
    price: 'Rs 4.8 Cr',
    location: 'Lalitpur, Bhaisepati',
    beds: 5,
    baths: 4,
    sqft: '4,200',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&auto=format&fit=crop',
    type: 'VILLA',
    featured: true,
  },
  {
    id: 2,
    slug: 'greenwood-townhouse',
    title: 'Greenwood Townhouse',
    price: 'Rs 3.2 Cr',
    location: 'Kathmandu, Baluwatar',
    beds: 4,
    baths: 3,
    sqft: '3,100',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&auto=format&fit=crop',
    type: 'HOUSE',
    featured: true,
  },
  {
    id: 3,
    slug: 'monsoon-loft',
    title: 'Monsoon Loft',
    price: 'Rs 1.4 Cr',
    location: 'Kathmandu, Thamel',
    beds: 2,
    baths: 2,
    sqft: '1,350',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&auto=format&fit=crop',
    type: 'APARTMENT',
    featured: true,
  },
  {
    id: 4,
    slug: 'cedar-bungalow',
    title: 'Cedar Bungalow',
    price: 'Rs 2.6 Cr',
    location: 'Bhaktapur, Suryabinayak',
    beds: 3,
    baths: 3,
    sqft: '2,400',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&auto=format&fit=crop',
    type: 'BUNGALOW',
    featured: true,
  },
  {
    id: 5,
    slug: 'hillside-estate',
    title: 'Hillside Estate',
    price: 'Rs 5.2 Cr',
    location: 'Kavre, Dhulikhel',
    beds: 5,
    baths: 5,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop',
    type: 'VILLA',
    featured: true,
  },
  {
    id: 6,
    slug: 'riverstone-plot',
    title: 'Riverstone Plot',
    price: 'Rs 95 Lakh',
    location: 'Pokhara, Lakeside',
    beds: 0,
    baths: 0,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop',
    type: 'LAND',
    featured: false,
  },
  {
    id: 7,
    slug: 'riverstone-plot',
    title: 'Riverstone Plot',
    price: 'Rs 95 Lakh',
    location: 'Pokhara, Lakeside',
    beds: 0,
    baths: 0,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop',
    type: 'LAND',
    featured: false,
  },
  {
    id: 10,
    slug: 'riverstone-plot',
    title: 'Riverstone Plot',
    price: 'Rs 95 Lakh',
    location: 'Pokhara, Lakeside',
    beds: 0,
    baths: 0,
    sqft: '5,600',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop',
    type: 'LAND',
    featured: false,
  },
];

const Properties: React.FC = () => {
  const [propertyType, setPropertyType] = useState('');
  const [maxPrice, setMaxPrice] = useState(800);
  const [bedrooms, setBedrooms] = useState('Any');
  const [bathrooms, setBathrooms] = useState('Any');
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);

  // This would be actual filter logic in a real app
  const filteredProperties = PROPERTIES;
  const totalPages = 3;

  const handleApplyFilters = () => {
    console.log('Applying filters...');
    // Implement filter logic here
  };

  return (
    <div className="pt-16 md:pt-20 bg-[var(--color-primary)] min-h-screen">
      <PropertyHeader totalProperties={filteredProperties.length} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 xl:px-20 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <PropertyFilters
              propertyType={propertyType}
              setPropertyType={setPropertyType}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              bedrooms={bedrooms}
              setBedrooms={setBedrooms}
              bathrooms={bathrooms}
              setBathrooms={setBathrooms}
              location={location}
              setLocation={setLocation}
              onApplyFilters={handleApplyFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <PropertySort value={sortBy} onChange={setSortBy} />
            <PropertyGrid properties={filteredProperties} />
            <PropertyPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;