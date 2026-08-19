// src/components/Favorites/FavoritesToolbar.tsx

import React from 'react';
import { 
  Bell, 
  ChevronDown, 
  Grid3X3, 
  List, 
  Search, 
  Trash2 
} from 'lucide-react';

interface FavoritesToolbarProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  sortBy: 'recent' | 'price_low' | 'price_high' | 'views';
  setSortBy: (sort: 'recent' | 'price_low' | 'price_high' | 'views') => void;
  selectedCount: number;
  onRemoveSelected: () => void;
  onRemoveAll: () => void;
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onToggleSelectAll: () => void;
  isAllSelected: boolean;
  notificationCount: number;
}

const FavoritesToolbar: React.FC<FavoritesToolbarProps> = ({ 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy, 
  selectedCount, 
  onRemoveSelected, 
  onRemoveAll,
  totalCount,
  searchTerm,
  setSearchTerm,
  onToggleSelectAll,
  isAllSelected,
  notificationCount
}) => {
  const sortOptions = [
    { value: 'recent', label: 'Recently Added', icon: '🕐' },
    { value: 'price_low', label: 'Price: Low to High', icon: '💰' },
    { value: 'price_high', label: 'Price: High to Low', icon: '💎' },
    { value: 'views', label: 'Most Viewed', icon: '👁️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-8 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        {/* Left Section */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Notification Badge */}
          {notificationCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full animate-pulse">
              <Bell className="w-4 h-4" />
              <span className="text-sm font-medium">
                {notificationCount} new {notificationCount === 1 ? 'favorite' : 'favorites'}
              </span>
            </div>
          )}

          {/* Select All Checkbox */}
          {totalCount > 0 && (
            <button
              onClick={onToggleSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                isAllSelected 
                  ? 'bg-[#2D5A27] border-[#2D5A27] text-white' 
                  : 'border-gray-300 hover:border-[#2D5A27]'
              }`}
              aria-label={isAllSelected ? 'Deselect all' : 'Select all'}
            >
              {isAllSelected && <span className="text-xs">✓</span>}
            </button>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-transparent pr-8 py-1.5 text-sm text-[#0F172A] font-medium cursor-pointer focus:outline-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.icon} {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
          </div>
          
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          
          {/* View Toggle */}
          <div className="flex gap-1 bg-[#F8FAFC] rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-white shadow-sm text-[#2D5A27]' 
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-white shadow-sm text-[#2D5A27]' 
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-1.5 text-sm bg-[#F8FAFC] border border-gray-200 rounded-lg focus:outline-none focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] transition-all w-40 md:w-48"
              aria-label="Search favorites"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          </div>

          {selectedCount > 0 && (
            <button
              onClick={onRemoveSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              aria-label={`Remove ${selectedCount} selected favorites`}
            >
              <Trash2 className="w-4 h-4" />
              Remove ({selectedCount})
            </button>
          )}
          
          {totalCount > 0 && (
            <button
              onClick={onRemoveAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#475569] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Remove all favorites"
            >
              <Trash2 className="w-4 h-4" />
              Remove All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesToolbar;