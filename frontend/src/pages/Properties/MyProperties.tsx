// src/pages/MyProperties/MyProperties.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Home, Plus, Eye, Edit, Trash2, Star, 
  MapPin, Bed, Bath, Maximize2, Car,
  CheckCircle, XCircle, Clock, AlertCircle,
  RefreshCw, ChevronDown, ChevronUp,
  Filter, Search, Loader2
} from 'lucide-react';
import { propertyApi } from '../../services/api/property';
import { formatArea } from '../../utils/areaUtils';
import type { Property } from '../../types/property';
import StatusBadge from '../../components/admin/StatusBadge';
import { Button } from '../../components/common/Button/Button';

// Image helper
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('//')) return `http:${path}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
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
      
      console.log('📊 My Properties:', data);
      
      // Process images
      const processedProperties = data.map((property: Property) => ({
        ...property,
        images: property.images?.map((img: string) => getImageUrl(img)) || [],
        mainImage: getImageUrl(property.mainImage || property.images?.[0]),
      }));
      
      setProperties(processedProperties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
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

        {/* Properties Grid */}
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
              <div
                key={property.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={property.mainImage || property.images?.[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <StatusBadge status={property.status} size="sm" />
                    {property.isFeatured && (
                      <span className="bg-[#D4AF37] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <Star className="w-3 h-3 fill-white" /> Featured
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    <Link
                      to={`/property/${property.id}`}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                      title="View Property"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                    <Link
                      to={`/edit-property/${property.id}`}
                      className="p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors"
                      title="Edit Property"
                    >
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Link>
                    <button
                      onClick={() => handleToggleFeatured(property.id)}
                      className={`p-1.5 bg-white/90 hover:bg-white rounded-lg shadow-md transition-colors ${
                        property.isFeatured ? 'text-yellow-600' : 'text-gray-400'
                      }`}
                      title={property.isFeatured ? 'Remove Featured' : 'Make Featured'}
                      disabled={actionLoading}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(property.id)}
                      className="p-1.5 bg-white/90 hover:bg-red-50 rounded-lg shadow-md transition-colors text-red-500 hover:text-red-600"
                      title="Delete Property"
                      disabled={actionLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-[#2D5A27]">
                      {formatPrice(property.price)}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      {property.bedrooms && (
                        <span className="flex items-center gap-1">
                          <Bed className="w-3 h-3" /> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" /> {property.bathrooms}
                        </span>
                      )}
                      {property.area && property.areaUnit && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3 h-3" /> {formatArea(property.area, property.areaUnit)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">
                      Listed: {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      👁️ {property.views || 0} views
                    </span>
                  </div>
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