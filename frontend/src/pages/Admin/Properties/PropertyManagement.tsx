// src/pages/admin/properties/PropertyManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, CheckCircle, 
  Eye, Trash2, Home, MapPin,
  RefreshCw, 
  Star, Bed, Bath, Square, AlertCircle,
  User, Mail, Phone, Calendar, TrendingUp,
  Heart, Share2, Download, Printer,
  Award, Shield, Clock, DollarSign,
  Building, Maximize2, Minimize2
} from 'lucide-react';
import { propertyApi } from '../../../services/api/property';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { Property } from '../../../types/property';

const API_URL = 'http://localhost:5001';

const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return '/placeholder-property.jpg';
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectPropertyId, setRejectPropertyId] = useState<string | null>(null);
  const [approvePropertyId, setApprovePropertyId] = useState<string | null>(null);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    sold: 0,
    rejected: 0,
    featured: 0,
  });

  useEffect(() => {
    fetchProperties();
    fetchStats();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const filters: any = {};
      if (searchTerm) filters.search = searchTerm;
      if (filterType !== 'all') filters.propertyType = filterType;
      if (filterStatus === 'all') {
        filters.status = 'ALL';
      } else if (filterStatus) {
        filters.status = filterStatus;
      }

      const response = await propertyApi.getAll(filters);
      
      let data: Property[] = [];
      if (response) {
        if (response.properties && Array.isArray(response.properties)) {
          data = response.properties;
        } else if (Array.isArray(response)) {
          data = response;
        } else if (typeof response === 'object') {
          for (const key of Object.keys(response)) {
            if (Array.isArray((response as any)[key])) {
              data = (response as any)[key];
              break;
            }
          }
        }
      }
      
      setProperties(data);
      
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await propertyApi.getStats();
      if (data) {
        setStats({
          total: data.total || 0,
          pending: data.pending || 0,
          approved: data.approved || 0,
          sold: data.sold || 0,
          rejected: data.rejected || 0,
          featured: data.featured || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(true);
      await propertyApi.updateStatus(id, 'APPROVED' as any);
      setShowApproveModal(false);
      setApprovePropertyId(null);
      await fetchProperties();
      await fetchStats();
    } catch (error) {
      alert('Failed to approve property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    try {
      setActionLoading(true);
      await propertyApi.updateStatus(id, 'REJECTED' as any, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      setRejectPropertyId(null);
      await fetchProperties();
      await fetchStats();
    } catch (error) {
      alert('Failed to reject property');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(true);
      await propertyApi.delete(id);
      setShowDeleteModal(false);
      setDeletePropertyId(null);
      await fetchProperties();
      await fetchStats();
    } catch (error) {
      alert('Failed to delete property');
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
      alert('Failed to update featured status');
    } finally {
      setActionLoading(false);
    }
  };

  const openApproveModal = (id: string) => {
    setApprovePropertyId(id);
    setShowApproveModal(true);
  };

  const openRejectModal = (id: string) => {
    setRejectPropertyId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  const openDeleteModal = (id: string) => {
    setDeletePropertyId(id);
    setShowDeleteModal(true);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    return `Rs ${price.toLocaleString()}`;
  };

  const propertyTypes = [...new Set(properties.map(p => p.propertyType))].filter(Boolean);

  const getPropertyTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      HOUSE: Home,
      RESIDENTIAL_LAND: Building,
      COMMERCIAL_LAND: Building,
      AGRICULTURAL_LAND: Building,
      INDUSTRIAL_LAND: Building,
      SHOP: Building,
      OFFICE: Building,
      WAREHOUSE: Building,
      HOTEL: Building,
      RESTAURANT: Building,
    };
    return icons[type] || Home;
  };

  const columns = [
    {
      key: 'property',
      label: 'Property',
      render: (row: Property) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={getImageUrl(row.mainImage || row.images?.[0])}
              alt={row.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
              }}
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900 hover:text-[#1B6B45] transition-colors">
              {row.title}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {row.location}
            </p>
            <p className="text-xs text-gray-400">{row.propertyId}</p>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (row: Property) => (
        <span className="font-bold text-[#1B6B45]">{formatPrice(row.price)}</span>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (row: Property) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="flex items-center gap-1 text-gray-600">
            <Bed className="w-3 h-3" /> {row.bedrooms || 0} Beds
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Bath className="w-3 h-3" /> {row.bathrooms || 0} Baths
          </span>
          {row.area && (
            <span className="flex items-center gap-1 text-gray-600">
              <Square className="w-3 h-3" /> {row.area} {row.areaUnit || 'SQFT'}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (row: Property) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.user?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">{row.user?.email || ''}</p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Property) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={row.status} />
          {row.isFeatured && (
            <span className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full flex items-center gap-1 border border-yellow-300">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Property) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setSelectedProperty(row);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
            title="View Details"
            disabled={actionLoading}
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => openApproveModal(row.id)}
                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition-all duration-200 hover:scale-110"
                title="Approve"
                disabled={actionLoading}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => openRejectModal(row.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-110"
                title="Reject"
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button
            onClick={() => handleToggleFeatured(row.id)}
            className={`p-1.5 rounded-lg transition-all duration-200 hover:scale-110 ${
              row.isFeatured 
                ? 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
            }`}
            title={row.isFeatured ? 'Remove Featured' : 'Make Featured'}
            disabled={actionLoading}
          >
            <Star className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => openDeleteModal(row.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-all duration-200 hover:scale-110"
            title="Delete"
            disabled={actionLoading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Home className="w-7 h-7 text-[#1B6B45]" />
            Property Management
          </h1>
          <p className="text-gray-500 mt-1">Manage all property listings on the platform</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => { fetchProperties(); fetchStats(); }}
          className="shadow-sm hover:shadow-md transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          <div className="w-full h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Sold</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          <div className="w-full h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
          <p className="text-sm text-gray-500">Featured</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
          <div className="w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] focus:border-transparent transition-all text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setTimeout(fetchProperties, 100); }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] focus:border-transparent transition-all text-sm bg-white"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SOLD">Sold</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setTimeout(fetchProperties, 100); }}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] focus:border-transparent transition-all text-sm bg-white"
        >
          <option value="all">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type?.replace('_', ' ')}</option>
          ))}
        </select>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterType('all'); setTimeout(fetchProperties, 100); }}
          className="border-gray-300 hover:border-gray-400"
        >
          <Filter className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={() => fetchProperties()}>
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable columns={columns} data={properties} loading={loading} />
      </div>

      {!loading && properties.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <Home className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-900">No Properties Found</h3>
          <p className="text-gray-500 mt-2">No properties match your current filters. Try adjusting your search or filters.</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterType('all'); setTimeout(fetchProperties, 100); }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* ✅ ENHANCED DETAIL MODAL */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#EDF5EC] rounded-xl">
                  {React.createElement(getPropertyTypeIcon(selectedProperty.propertyType), { className: "w-6 h-6 text-[#1B6B45]" })}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedProperty.title}</h2>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {selectedProperty.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedProperty.status} />
                {selectedProperty.isFeatured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-xs rounded-full flex items-center gap-1 border border-yellow-300">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
                  </span>
                )}
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:rotate-90"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Gallery */}
              <div>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProperty.images && selectedProperty.images.length > 0 ? (
                    <>
                      <div className="col-span-2 row-span-2 rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                        <img
                          src={getImageUrl(selectedProperty.images[0])}
                          alt={selectedProperty.title}
                          className="w-full h-full object-cover"
                          onClick={() => {
                            setSelectedImage(getImageUrl(selectedProperty.images[0]));
                            setShowImageModal(true);
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                          }}
                        />
                      </div>
                      {selectedProperty.images.slice(1, 5).map((img, i) => (
                        <div 
                          key={i} 
                          className="rounded-xl overflow-hidden bg-gray-100 aspect-square cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedImage(getImageUrl(img));
                            setShowImageModal(true);
                          }}
                        >
                          <img
                            src={getImageUrl(img)}
                            alt={`${selectedProperty.title} - ${i + 2}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                            }}
                          />
                        </div>
                      ))}
                      {selectedProperty.images.length > 5 && (
                        <div className="rounded-xl overflow-hidden bg-gray-200 aspect-square flex items-center justify-center text-gray-600 font-semibold">
                          +{selectedProperty.images.length - 5}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="col-span-4 rounded-xl bg-gray-100 p-12 text-center text-gray-400">
                      <Home className="w-16 h-16 mx-auto mb-2" />
                      <p>No images available</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Videos */}
              {selectedProperty.videos && selectedProperty.videos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#1B6B45] rounded-full"></span>
                    Videos
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedProperty.videos.map((video, i) => (
                      <video
                        key={i}
                        src={getImageUrl(video)}
                        controls
                        className="w-full rounded-xl bg-black aspect-video"
                        onError={(e) => {
                          console.error('❌ Video failed:', getImageUrl(video));
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Price</p>
                  <p className="text-2xl font-bold text-[#1B6B45] mt-1">{formatPrice(selectedProperty.price)}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Property Type</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedProperty.propertyType?.replace('_', ' ')}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Property ID</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedProperty.propertyId}</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Purpose</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">For Sale</p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Views</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gray-400" /> {selectedProperty.views || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Favorites</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-400" /> {selectedProperty.favoritesCount || 0}
                  </p>
                </div>
              </div>

              {/* Property Specs */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#1B6B45] rounded-full"></span>
                  Property Specifications
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Bedrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedProperty.bedrooms || 'N/A'}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Bathrooms</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedProperty.bathrooms || 'N/A'}</p>
                  </div>
                  {selectedProperty.area && (
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-xs text-gray-500">Area</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedProperty.area} {selectedProperty.areaUnit || 'SQFT'}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <p className="text-xs text-gray-500">Parking</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedProperty.parking ? '✅ Available' : '❌ Not Available'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#1B6B45] rounded-full"></span>
                    Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{selectedProperty.description}</p>
                </div>
              )}

              {/* Seller Information */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-[#1B6B45] rounded-full"></span>
                  Seller Information
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1B6B45] to-[#0F3D2E] flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selectedProperty.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">{selectedProperty.user?.name || 'Unknown'}</p>
                    <div className="flex flex-wrap gap-4 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-4 h-4" /> {selectedProperty.user?.email || ''}
                      </span>
                      {selectedProperty.user?.phone && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-4 h-4" /> {selectedProperty.user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {selectedProperty.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        openApproveModal(selectedProperty.id);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
                      disabled={actionLoading}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Property
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        openRejectModal(selectedProperty.id);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
                      disabled={actionLoading}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Property
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    handleToggleFeatured(selectedProperty.id);
                    setShowDetailModal(false);
                  }}
                  className={`px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium ${
                    selectedProperty.isFeatured 
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}
                  disabled={actionLoading}
                >
                  <Star className="w-4 h-4" />
                  {selectedProperty.isFeatured ? 'Remove Featured' : 'Make Featured'}
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openDeleteModal(selectedProperty.id);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 font-medium"
                  disabled={actionLoading}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Property
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Fullscreen Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] p-4">
            <button 
              onClick={() => setShowImageModal(false)} 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="w-full h-full object-contain rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ APPROVE CONFIRMATION MODAL */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-green-600 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Approve Property</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this property? This will make it visible to all buyers.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="primary" 
                className="flex-1" 
                onClick={() => handleApprove(approvePropertyId!)} 
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Approving...
                  </span>
                ) : (
                  'Yes, Approve'
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => { setShowApproveModal(false); setApprovePropertyId(null); }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ REJECT CONFIRMATION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Property</h3>
            </div>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this property.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-sm resize-none"
            />
            <div className="flex gap-3 mt-4">
              <Button 
                variant="gold" 
                className="flex-1" 
                onClick={() => handleReject(rejectPropertyId!)} 
                disabled={!rejectReason.trim() || actionLoading}
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rejecting...
                  </span>
                ) : (
                  'Reject Property'
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectPropertyId(null); }}
                disabled={actionLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 animate-scaleUp">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Property</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete this property? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="gold" 
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

// XCircle Component
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default PropertyManagement;