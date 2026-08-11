// src/pages/MyProperties/MyProperties.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home, Plus, Eye, Edit, Trash2, Star, 
  MapPin, Bed, Bath, Maximize2, Car,
  CheckCircle, XCircle, Clock, AlertCircle,
  RefreshCw, ChevronDown, ChevronUp,
  Filter, Search, Loader2, Calendar
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { formatArea } from '../../utils/areaUtils';
import type { Property } from '../../types/property';
import StatusBadge from '../../components/admin/StatusBadge';
import { Button } from '../../components/common/Button/Button';
import PropertyCard from '../../components/properties/PropertyCard';


// ✅ SAME AS PropertiesPage - Image helper
const API_URL = 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

const formatPrice = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)} Cr`;
  }
  return `Rs ${price.toLocaleString()}`;
};

// ✅ Property Header Component
const MyPropertiesHeader: React.FC<{ totalProperties: number }> = ({ totalProperties }) => {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 pt-10 md:pt-14 pb-6">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F172A] tracking-tight">
          My <span className="text-[#2D5A27]">Properties</span>
        </h1>
        <p className="text-[#475569] text-base md:text-lg mt-2">
          {totalProperties} {totalProperties === 1 ? 'property' : 'properties'} listed by you
        </p>
      </div>
    </div>
  );
};

const MyProperties: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await propertyApi.getMyProperties();
      
      console.log('📊 My Properties Data:', data);
      
      // ✅ SAME AS PropertiesPage - Process images
      const processedProperties = data.map((property: Property) => {
        const processedImages = property.images?.map((img: string) => getImageUrl(img)) || [];
        const processedMainImage = getImageUrl(property.mainImage || property.images?.[0]);
        
        return {
          ...property,
          images: processedImages,
          mainImage: processedMainImage,
        };
      });
      
      setProperties(processedProperties);
    } catch (error: any) {
      console.error('❌ Error fetching properties:', error);
      setError(error.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true);
      await propertyApi.delete(id);
      setShowDeleteModal(false);
      setDeletePropertyId(null);
      await fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      setActionLoading(true);
      await propertyApi.toggleFeatured(id);
      await fetchProperties();
    } catch (error) {
      console.error('Error toggling featured:', error);
      alert('Failed to update featured status. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setDeletePropertyId(id);
    setShowDeleteModal(true);
  };

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: properties.length,
    pending: properties.filter(p => p.status === 'PENDING').length,
    approved: properties.filter(p => p.status === 'APPROVED').length,
    sold: properties.filter(p => p.status === 'SOLD').length,
    rejected: properties.filter(p => p.status === 'REJECTED').length,
    featured: properties.filter(p => p.isFeatured).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-500">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      {/* Header */}
      <MyPropertiesHeader totalProperties={properties.length} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Sold</p>
            <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Rejected</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm w-48 md:w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D5A27] text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SOLD">Sold</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                fetchProperties();
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/list-property')}
          >
            <Plus className="w-4 h-4 mr-2" />
            List New Property
          </Button>
        </div>

        {/* Properties Grid - Uses PropertyCard */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {filteredProperties.length === 0 && !error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
            <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900">No Properties Found</h3>
            <p className="text-gray-500 mt-2">
              {properties.length === 0 
                ? "You haven't listed any properties yet. Start by listing your first property!" 
                : "No properties match your current filters."}
            </p>
            {properties.length === 0 && (
              <Button
                variant="primary"
                size="sm"
                className="mt-4"
                onClick={() => navigate('/list-property')}
              >
                <Plus className="w-4 h-4 mr-2" />
                List Your First Property
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div key={property.id} className="relative">
                {/* ✅ PropertyCard - Uses same image handling */}
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  price={property.price}
                  location={property.location}
                  area={property.area}
                  areaUnit={property.areaUnit}
                  mainImage={property.mainImage}
                  images={property.images}
                  isFeatured={property.isFeatured}
                  isVerified={property.isVerified}
                  views={property.views}
                  favoritesCount={property.favoritesCount}
                  propertyType={property.propertyType}
                />
                
                {/* Status Overlay */}
                <div className="absolute top-2 left-2 z-10">
                  <StatusBadge status={property.status} size="sm" />
                </div>
                
                {/* Action Buttons */}
                <div className="absolute bottom-2 right-2 z-10 flex gap-1">
                  <Link
                    to={`/property/${property.id}`}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                    title="View Property"
                  >
                    <Eye className="w-3.5 h-3.5 text-gray-600" />
                  </Link>
                  <Link
                    to={`/edit-property/${property.id}`}
                    className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                    title="Edit Property"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                  </Link>
                  <button
                    onClick={() => handleToggleFeatured(property.id)}
                    className={`p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors ${
                      property.isFeatured ? 'text-yellow-600' : 'text-gray-400'
                    }`}
                    title={property.isFeatured ? 'Remove Featured' : 'Make Featured'}
                    disabled={actionLoading}
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(property.id)}
                    className="p-1.5 bg-white/90 hover:bg-red-50 rounded-lg shadow-md transition-colors text-red-500 hover:text-red-600"
                    title="Delete Property"
                    disabled={actionLoading}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Delete Property</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDelete(deletePropertyId!)}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Deleting...
                  </span>
                ) : (
                  'Yes, Delete'
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setShowDeleteModal(false); setDeletePropertyId(null); }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;