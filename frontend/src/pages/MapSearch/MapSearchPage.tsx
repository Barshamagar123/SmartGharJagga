// src/pages/MapSearch/MapSearchPage.tsx

import React from 'react';
import SearchMap from './MapSearch';


const MapSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      <div className="pt-20 pb-12">
        <SearchMap />
      </div>
    </div>
  );
};

export default MapSearchPage;