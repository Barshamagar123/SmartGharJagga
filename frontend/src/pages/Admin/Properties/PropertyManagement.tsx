// src/pages/admin/properties/PropertyManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MoreVertical, CheckCircle, 
  Eye, Trash2, Home, MapPin, DollarSign, Clock,
  RefreshCw, ChevronDown, ChevronUp, Edit, Plus
} from 'lucide-react';
import { adminApi } from '../../../services/api/admin';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SOLD' | 'RENTED' | 'INACTIVE';
  propertyType: string;
  purpose: string;
  isFeatured: boolean;
  isVerified: boolean;
  views: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

const PropertyManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectPropertyId, setRejectPropertyId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to approve this property?')) {
      await adminApi.approveProperty(id);
      fetchProperties();
    }
  };

  const handleRejectProperty = async (id: string) => {
    if (rejectReason.trim() === '') {
      alert('Please provide a rejection reason');
      return;
    }
    await adminApi.rejectProperty(id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
    setRejectPropertyId(null);
    fetchProperties();
  };

  const handleDeleteProperty = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this property?')) {
      await adminApi.deleteProperty(id);
      fetchProperties();
    }
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const openRejectModal = (id: string) => {
    setRejectPropertyId(id);
    setShowRejectModal(true);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    }
    return `Rs ${price.toLocaleString()}`;
  };

  // ✅ Stats
  const stats = {
    total: properties.length,
    pending: properties.filter(p => p.status === 'PENDING').length,
    approved: properties.filter(p => p.status === 'APPROVED').length,
    rejected: properties.filter(p => p.status === 'REJECTED').length,
  };

  // ✅ Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesType = filterType === 'all' || property.propertyType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // ✅ Columns for DataTable
  const columns = [
    {
      key: 'property',
      label: 'Property',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Home className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <p className="font-medium text-gray-900 truncate max-w-[200px]">{row.title}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {row.location}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (row: any) => (
        <span className="font-semibold text-[#1B6B45]">{formatPrice(row.price)}</span>
      )
    },
    {
      key: 'seller',
      label: 'Seller',
      render: (row: any) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{row.user?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.user?.email || 'No email'}</p>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: any) => (
        <span className="text-sm text-gray-600">{row.propertyType?.replace('_', ' ')}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: any) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          {row.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleApproveProperty(row.id)}
                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => openRejectModal(row.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => handleDeleteProperty(row.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  // ✅ Get unique property types for filter
  const propertyTypes = [...new Set(properties.map(p => p.propertyType))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-500">Manage all property listings</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchProperties}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Properties</p>
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
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="SOLD">Sold</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Types</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type?.replace('_', ' ')}</option>
          ))}
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredProperties}
          loading={loading}
        />
      </div>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h3>
                  <p className="text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {selectedProperty.location}
                  </p>
                </div>
                <StatusBadge status={selectedProperty.status} size="md" />
              </div>

              {/* Price & Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-xl font-bold text-[#1B6B45]">
                    {formatPrice(selectedProperty.price)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedProperty.propertyType?.replace('_', ' ')}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedProperty.purpose}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedProperty.views}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Seller Information</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] font-semibold">
                    {selectedProperty.user?.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedProperty.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedProperty.user?.email || 'No email'}</p>
                    {selectedProperty.user?.phone && (
                      <p className="text-sm text-gray-500">{selectedProperty.user.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {selectedProperty.isFeatured && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                    ⭐ Featured
                  </span>
                )}
                {selectedProperty.isVerified && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    ✅ Verified
                  </span>
                )}
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {selectedProperty.purpose}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {selectedProperty.status === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        handleApproveProperty(selectedProperty.id);
                        setShowDetailModal(false);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Property
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowDetailModal(false);
                        openRejectModal(selectedProperty.id);
                      }}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Property
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleDeleteProperty(selectedProperty.id);
                    setShowDetailModal(false);
                  }}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Property
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Property</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting this property.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                placeholder="Enter rejection reason..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] transition-all text-sm"
              />
              <div className="flex items-center gap-3 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleRejectProperty(rejectPropertyId!)}
                  disabled={!rejectReason.trim()}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Property
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason('');
                    setRejectPropertyId(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ XCircle icon component (if not imported)
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default PropertyManagement;