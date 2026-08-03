// src/pages/admin/properties/PropertyManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, CheckCircle, 
  Eye, Trash2, Home, MapPin,
  RefreshCw,
  Star, Bed, Bath, Square, AlertCircle
} from 'lucide-react';
import { propertyApi } from '../../../services/api/property';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { Property } from '../../../types/property';

// ✅ Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectPropertyId, setRejectPropertyId] = useState<string | null>(null);
  const [deletePropertyId, setDeletePropertyId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    sold: 0,
    rejected: 0,
    featured: 0,
  });

  // ✅ Helper: Get full image URL
  const getImageUrl = (path: string | undefined | null) => {
    if (!path) return '/placeholder-property.jpg';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

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
    if (!confirm('Approve this property?')) return;
    try {
      setActionLoading(true);
      await propertyApi.updateStatus(id, 'APPROVED' as any);
      await fetchProperties();
      await fetchStats();
    } catch (error) {
      alert('Failed to approve');
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
      alert('Failed to reject');
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
      alert('Failed to delete');
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
      alert('Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    return `Rs ${price.toLocaleString()}`;
  };

  const propertyTypes = [...new Set(properties.map(p => p.propertyType))].filter(Boolean);

  const columns = [
    {
      key: 'property',
      label: 'Property',
      render: (row: Property) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
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
            <p className="font-medium text-gray-900">{row.title}</p>
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
        <span className="font-semibold text-[#1B6B45]">{formatPrice(row.price)}</span>
      )
    },
    {
      key: 'details',
      label: 'Details',
      render: (row: Property) => (
        <div className="flex flex-col gap-0.5 text-xs text-gray-600">
          <span><Bed className="w-3 h-3 inline" /> {row.bedrooms || 0} Beds</span>
          <span><Bath className="w-3 h-3 inline" /> {row.bathrooms || 0} Baths</span>
          {row.area && <span><Square className="w-3 h-3 inline" /> {row.area} {row.areaUnit || 'SQFT'}</span>}
        </div>
      )
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (row: Property) => (
        <div>
          <p className="text-sm font-medium">{row.user?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.user?.email || ''}</p>
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
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" /> Featured
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Property) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setSelectedProperty(row);
              setShowDetailModal(true);
            }}
            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"
            disabled={actionLoading}
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600"
                disabled={actionLoading}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setRejectPropertyId(row.id);
                  setRejectReason('');
                  setShowRejectModal(true);
                }}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          
          <button
            onClick={() => handleToggleFeatured(row.id)}
            className={`p-1.5 rounded-lg ${row.isFeatured ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'}`}
            disabled={actionLoading}
          >
            <Star className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => {
              setDeletePropertyId(row.id);
              setShowDeleteModal(true);
            }}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400"
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-500">Manage all property listings</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchProperties(); fetchStats(); }}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Sold</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-500">Featured</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.featured}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchProperties()}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setTimeout(fetchProperties, 100); }}
          className="px-4 py-2 border rounded-lg text-sm"
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
          className="px-4 py-2 border rounded-lg text-sm"
        >
          <option value="all">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type?.replace('_', ' ')}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setFilterStatus('all'); setFilterType('all'); setTimeout(fetchProperties, 100); }}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={() => fetchProperties()}>
          Apply
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <DataTable columns={columns} data={properties} loading={loading} />
      </div>

      {!loading && properties.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No Properties</h3>
          <p className="text-gray-500">No properties found. Try adjusting filters.</p>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold">Property Details</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {selectedProperty.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {selectedProperty.images.slice(0, 6).map((img, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(img)}
                        alt={selectedProperty.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{selectedProperty.title}</h3>
                  <p className="text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" /> {selectedProperty.location}</p>
                  <p className="text-sm text-gray-400">ID: {selectedProperty.propertyId}</p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <StatusBadge status={selectedProperty.status} />
                  {selectedProperty.isFeatured && <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"><Star className="w-4 h-4 inline" /> Featured</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-[#1B6B45]">{formatPrice(selectedProperty.price)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold">{selectedProperty.propertyType?.replace('_', ' ')}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="text-lg font-semibold">SALE</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-lg font-semibold">{selectedProperty.views || 0}</p>
                </div>
                {selectedProperty.bedrooms && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Bedrooms</p>
                    <p className="text-lg font-semibold">{selectedProperty.bedrooms}</p>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Bathrooms</p>
                    <p className="text-lg font-semibold">{selectedProperty.bathrooms}</p>
                  </div>
                )}
                {selectedProperty.area && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="text-lg font-semibold">{selectedProperty.area} {selectedProperty.areaUnit || 'SQFT'}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Favorites</p>
                  <p className="text-lg font-semibold">{selectedProperty.favoritesCount || 0}</p>
                </div>
              </div>

              {selectedProperty.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700">{selectedProperty.description}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Seller</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center font-semibold">
                    {selectedProperty.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-medium">{selectedProperty.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedProperty.user?.email || ''}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                {selectedProperty.status === 'PENDING' && (
                  <>
                    <Button variant="primary" size="sm" onClick={() => { handleApprove(selectedProperty.id); setShowDetailModal(false); }} disabled={actionLoading}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Approve
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => { setShowDetailModal(false); setRejectPropertyId(selectedProperty.id); setRejectReason(''); setShowRejectModal(true); }} disabled={actionLoading}>
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="sm" onClick={() => { handleToggleFeatured(selectedProperty.id); setShowDetailModal(false); }} className={selectedProperty.isFeatured ? 'text-yellow-600' : 'text-gray-600'}>
                  <Star className="w-4 h-4 mr-2" /> {selectedProperty.isFeatured ? 'Remove Featured' : 'Make Featured'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setShowDetailModal(false); setDeletePropertyId(selectedProperty.id); setShowDeleteModal(true); }} className="text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Reject Property</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Provide a reason for rejection</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Enter reason..."
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
            />
            <div className="flex gap-3 mt-4">
              <Button variant="primary" size="sm" onClick={() => handleReject(rejectPropertyId!)} disabled={!rejectReason.trim() || actionLoading}>
                {actionLoading ? 'Rejecting...' : 'Reject'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setShowRejectModal(false); setRejectReason(''); setRejectPropertyId(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-xl font-bold">Delete Property</h3>
            </div>
            <p className="text-gray-600 mb-4">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="gold" size="sm" onClick={() => handleDelete(deletePropertyId!)} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Yes, Delete'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setShowDeleteModal(false); setDeletePropertyId(null); }}>
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