// src/pages/admin/subscriptions/SubscriptionManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MoreVertical, CreditCard, DollarSign,
  Calendar, Clock, CheckCircle,  RefreshCw,
  Eye, Trash2, Edit, Plus, Users, TrendingUp,
  Download, Printer, Mail, Phone, AlertCircle
} from 'lucide-react';
import { adminApi } from '../../../services/api/admin';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';

interface Subscription {
  id: string;
  userId: string;
  planType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  price: number;
  startDate: string;
  endDate: string;
  paymentId?: string;
  isActive: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSubscriptions();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      await adminApi.updateSubscription(id, { status: 'CANCELLED' });
      setShowCancelModal(false);
      fetchSubscriptions();
    }
  };

  const handleUpdateSubscription = async (id: string, data: any) => {
    await adminApi.updateSubscription(id, data);
    setShowEditModal(false);
    fetchSubscriptions();
  };

  const handleViewDetails = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailModal(true);
  };

  const openEditModal = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowEditModal(true);
  };

  const formatPrice = (price: number) => {
    return `Rs ${price.toLocaleString()}`;
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // ✅ Stats
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'ACTIVE').length,
    expired: subscriptions.filter(s => s.status === 'EXPIRED').length,
    cancelled: subscriptions.filter(s => s.status === 'CANCELLED').length,
    premium: subscriptions.filter(s => s.planType === 'PREMIUM').length,
    revenue: subscriptions
      .filter(s => s.status === 'ACTIVE')
      .reduce((sum, s) => sum + s.price, 0),
  };

  // ✅ Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || sub.planType === filterPlan;
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // ✅ Columns
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] font-semibold text-sm">
            {row.user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.user?.name || 'Unknown'}</p>
            <p className="text-xs text-gray-500">{row.user?.email || 'No email'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'plan',
      label: 'Plan',
      render: (row: any) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          row.planType === 'PREMIUM' ? 'bg-[#D4AF37] text-white' :
          row.planType === 'ENTERPRISE' ? 'bg-purple-600 text-white' :
          'bg-gray-200 text-gray-700'
        }`}>
          {row.planType}
        </span>
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
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (row: any) => {
        const days = getDaysRemaining(row.endDate);
        return (
          <div className="text-sm">
            <span className="font-medium">{days} days</span>
            <span className="text-xs text-gray-400 block">
              {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
            </span>
          </div>
        );
      }
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
          <button
            onClick={() => openEditModal(row)}
            className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600 hover:text-purple-700 transition-colors"
            title="Edit Subscription"
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'ACTIVE' && (
            <button
              onClick={() => {
                setSelectedSubscription(row);
                setShowCancelModal(true);
              }}
              className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
              title="Cancel Subscription"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-500">Manage all user subscriptions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchSubscriptions}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscription
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Expired</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-orange-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Premium Users</p>
          <p className="text-2xl font-bold text-[#D4AF37]">{stats.premium}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="text-2xl font-bold text-[#1B6B45]">{formatPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Plans</option>
          <option value="FREE">Free</option>
          <option value="PREMIUM">Premium</option>
          <option value="ENTERPRISE">Enterprise</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="EXPIRED">Expired</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="PENDING">Pending</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredSubscriptions}
          loading={loading}
        />
      </div>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Subscription Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedSubscription.planType} Plan
                  </h3>
                  <p className="text-gray-500">Subscription #{selectedSubscription.id.slice(0, 8)}</p>
                </div>
                <StatusBadge status={selectedSubscription.status} size="md" />
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">User Information</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] font-semibold">
                    {selectedSubscription.user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedSubscription.user?.name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">{selectedSubscription.user?.email}</p>
                    {selectedSubscription.user?.phone && (
                      <p className="text-sm text-gray-500">{selectedSubscription.user.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Plan Type</p>
                  <p className="font-medium text-gray-900">{selectedSubscription.planType}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium text-[#1B6B45]">{formatPrice(selectedSubscription.price)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSubscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSubscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Days Remaining</p>
                  <p className="font-medium text-gray-900">
                    {getDaysRemaining(selectedSubscription.endDate)} days
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSubscription.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {selectedSubscription.status === 'ACTIVE' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setSelectedSubscription(selectedSubscription);
                      setShowCancelModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4 inline mr-2" />
                    Cancel Subscription
                  </button>
                )}
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openEditModal(selectedSubscription);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Edit Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {showEditModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Edit Subscription</h3>
              <p className="text-sm text-gray-500 mb-4">
                Update subscription for {selectedSubscription.user?.name}
              </p>

              <div className="space-y-4">
                {/* Plan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type
                  </label>
                  <select
                    defaultValue={selectedSubscription.planType}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45]"
                  >
                    <option value="FREE">Free</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue={selectedSubscription.status}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45]"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="EXPIRED">Expired</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedSubscription.endDate.split('T')[0]}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <Button variant="primary" onClick={() => handleUpdateSubscription(selectedSubscription.id, {})}>
                  Update Subscription
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Cancel Confirmation Modal */}
      {showCancelModal && selectedSubscription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                Cancel Subscription
              </h3>
              <p className="text-sm text-center text-gray-500 mb-4">
                Are you sure you want to cancel the subscription for{' '}
                <span className="font-medium">{selectedSubscription.user?.name}</span>?
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleCancelSubscription(selectedSubscription.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Yes, Cancel
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1"
                >
                  No, Keep
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ✅ XCircle icon component
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default SubscriptionManagement;