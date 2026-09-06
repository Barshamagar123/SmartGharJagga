// src/pages/admin/reviews/ReviewManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, CheckCircle,
  Eye, Trash2, Star, Calendar,
  Clock, RefreshCw, AlertCircle
} from 'lucide-react';
import { adminApi } from '../../../services/api/admin';
import type {Review} from '../../../services/api/admin';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching reviews...');
      const data = await adminApi.getAllReviews();
      console.log('✅ Reviews fetched:', data);
      setReviews(data || []);
    } catch (error: any) {
      console.error('❌ Error fetching reviews:', error);
      setError(error.response?.data?.message || 'Failed to load reviews. Please try again.');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this review?')) return;
    
    try {
      setActionLoading(true);
      await adminApi.approveReview(id);
      await fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this review?')) return;
    
    try {
      setActionLoading(true);
      await adminApi.rejectReview(id);
      await fetchReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Failed to reject review. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
    
    try {
      setActionLoading(true);
      await adminApi.deleteReview(id);
      await fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (review: Review) => {
    setSelectedReview(review);
    setShowDetailModal(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-[#D4AF37] text-[#D4AF37]'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-600">{rating}.0</span>
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.reviewer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.property?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'approved' && review.isApproved) ||
      (filterStatus === 'pending' && !review.isApproved);
    
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter(r => r.isApproved).length,
    pending: reviews.filter(r => !r.isApproved).length,
    averageRating: reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
  };

  const columns = [
    {
      key: 'reviewer',
      label: 'Reviewer',
      render: (row: Review) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] font-semibold text-sm">
            {row.reviewer?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.reviewer?.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{row.reviewer?.email || 'No email'}</p>
          </div>
        </div>
      )
    },
    {
      key: 'property',
      label: 'Property',
      render: (row: Review) => (
        <div>
          <p className="font-medium text-gray-900 truncate max-w-[200px]">{row.property?.title || 'N/A'}</p>
          <p className="text-xs text-gray-500">{row.property?.location || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (row: Review) => renderStars(row.rating)
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row: Review) => (
        <p className="text-sm text-gray-600 truncate max-w-[200px]">
          {row.comment || 'No comment'}
        </p>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Review) => (
        <StatusBadge status={row.isApproved ? 'approved' : 'pending'} />
      )
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row: Review) => (
        <div className="text-sm text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Review) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleViewDetails(row)}
            className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 hover:text-blue-700 transition-colors"
            title="View Details"
            disabled={actionLoading}
          >
            <Eye className="w-4 h-4" />
          </button>
          {!row.isApproved && (
            <>
              <button
                onClick={() => handleApproveReview(row.id)}
                className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition-colors"
                title="Approve"
                disabled={actionLoading}
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRejectReview(row.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
                title="Reject"
                disabled={actionLoading}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => handleDeleteReview(row.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
            title="Delete"
            disabled={actionLoading}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-500">Manage all property reviews</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B6B45] mx-auto" />
            <p className="mt-4 text-gray-500">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
            <p className="text-gray-500">Manage all property reviews</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800">Failed to Load Reviews</h3>
          <p className="text-red-600 mt-1">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-500">Manage all property reviews</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchReviews} disabled={actionLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Total Reviews</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Avg Rating</p>
          <p className="text-2xl font-bold text-[#D4AF37]">{stats.averageRating} ⭐</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reviews..."
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
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Ratings</option>
          <option value="5">⭐⭐⭐⭐⭐ 5</option>
          <option value="4">⭐⭐⭐⭐ 4</option>
          <option value="3">⭐⭐⭐ 3</option>
          <option value="2">⭐⭐ 2</option>
          <option value="1">⭐ 1</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900">No Reviews Found</h3>
            <p className="text-gray-500 mt-1">No reviews match your search or filter criteria</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredReviews}
            loading={loading}
          />
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Review Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Reviewer Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] text-2xl font-bold">
                  {selectedReview.reviewer?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedReview.reviewer?.name || 'Anonymous'}</h3>
                  <p className="text-sm text-gray-500">{selectedReview.reviewer?.email || 'No email'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                <div className="ml-auto">
                  <StatusBadge status={selectedReview.isApproved ? 'approved' : 'pending'} />
                </div>
              </div>

              {/* Property Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Property</h4>
                <p className="font-medium text-gray-900">{selectedReview.property?.title || 'N/A'}</p>
                <p className="text-sm text-gray-500">{selectedReview.property?.location || 'N/A'}</p>
              </div>

              {/* Comment */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Review Comment</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReview.comment || 'No comment provided'}
                  </p>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedReview.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedReview.createdAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                {!selectedReview.isApproved && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        handleApproveReview(selectedReview.id);
                        setShowDetailModal(false);
                      }}
                      disabled={actionLoading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Review
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleRejectReview(selectedReview.id);
                        setShowDetailModal(false);
                      }}
                      disabled={actionLoading}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Review
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleDeleteReview(selectedReview.id);
                    setShowDetailModal(false);
                  }}
                  className="text-red-500 hover:bg-red-50"
                  disabled={actionLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;