// src/pages/admin/users/UserManagement.tsx

import React, { useState, useEffect } from 'react';
import {
  Search, Filter, MoreVertical, UserX, UserCheck, Ban, Trash2, Mail, Phone, Shield, Eye,
  RefreshCw, ChevronDown, ChevronUp, Edit, Plus, CheckCircle, 
} from 'lucide-react';
import { adminApi } from '../../../services/api/admin';
import DataTable from '../../../components/admin/DataTable';
import { Button } from '../../../components/common/Button/Button';
import StatusBadge from '../../../components/admin/StatusBadge';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  propertiesCount?: number;
  avatarUrl?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (id: string) => {
    if (window.confirm('Are you sure you want to block this user?')) {
      await adminApi.blockUser(id);
      fetchUsers();
    }
  };

  const handleUnblockUser = async (id: string) => {
    if (window.confirm('Are you sure you want to unblock this user?')) {
      await adminApi.unblockUser(id);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      await adminApi.deleteUser(id);
      fetchUsers();
    }
  };

  const handleRoleChange = async (id: string, role: string) => {
    await adminApi.updateUserRole(id, role);
    setShowRoleModal(false);
    fetchUsers();
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setShowRoleModal(true);
  };

  // ✅ Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    blocked: users.filter(u => !u.isActive).length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    sellers: users.filter(u => u.role === 'SELLER').length,
    buyers: users.filter(u => u.role === 'BUYER').length,
  };

  // ✅ Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && user.isActive) ||
                         (filterStatus === 'blocked' && !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ✅ Columns for DataTable
  const columns = [
    {
      key: 'user',
      label: 'User',
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] font-semibold text-sm flex-shrink-0 overflow-hidden">
            {row.avatarUrl ? (
              <img src={row.avatarUrl} alt={row.name} className="w-full h-full object-cover" />
            ) : (
              row.name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      render: (row: any) => (
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
          row.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
          row.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {row.role}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.isActive ? 'active' : 'blocked'} />
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (row: any) => (
        <span className="text-sm text-gray-600">{row.phone || '—'}</span>
      )
    },
    {
      key: 'properties',
      label: 'Properties',
      render: (row: any) => (
        <span className="text-sm font-medium text-gray-900">{row.propertiesCount || 0}</span>
      )
    },
    {
      key: 'joined',
      label: 'Joined',
      render: (row: any) => (
        <span className="text-sm text-gray-500">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      )
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
            onClick={() => openRoleModal(row)}
            className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600 hover:text-purple-700 transition-colors"
            title="Change Role"
          >
            <Shield className="w-4 h-4" />
          </button>
          {row.isActive ? (
            <button
              onClick={() => handleBlockUser(row.id)}
              className="p-1.5 hover:bg-yellow-50 rounded-lg text-yellow-600 hover:text-yellow-700 transition-colors"
              title="Block User"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => handleUnblockUser(row.id)}
              className="p-1.5 hover:bg-green-50 rounded-lg text-green-600 hover:text-green-700 transition-colors"
              title="Unblock User"
            >
              <UserCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDeleteUser(row.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700 transition-colors"
            title="Delete User"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage all users on the platform</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchUsers}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
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
          <p className="text-sm text-gray-500">Blocked</p>
          <p className="text-2xl font-bold text-red-600">{stats.blocked}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Admins</p>
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Sellers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sellers}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500">Buyers</p>
          <p className="text-2xl font-bold text-green-600">{stats.buyers}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative min-w-[200px]">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Roles</option>
          <option value="BUYER">Buyer</option>
          <option value="SELLER">Seller</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B6B45] text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Apply Filters
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredUsers}
          loading={loading}
        />
      </div>

      {/* ✅ Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#EDF5EC] flex items-center justify-center text-[#1B6B45] text-3xl font-bold overflow-hidden">
                  {selectedUser.avatarUrl ? (
                    <img src={selectedUser.avatarUrl} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      selectedUser.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedUser.role}
                    </span>
                    <StatusBadge status={selectedUser.isActive ? 'active' : 'blocked'} size="sm" />
                    {selectedUser.isEmailVerified && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                        ✅ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{selectedUser.phone || 'Not provided'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Properties</p>
                  <p className="font-medium text-gray-900">{selectedUser.propertiesCount || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    openRoleModal(selectedUser);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Change Role
                </button>
                {selectedUser.isActive ? (
                  <button
                    onClick={() => {
                      handleBlockUser(selectedUser.id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    <Ban className="w-4 h-4 inline mr-2" />
                    Block User
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleUnblockUser(selectedUser.id);
                      setShowDetailModal(false);
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 inline mr-2" />
                    Unblock User
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteUser(selectedUser.id);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-2" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Change User Role</h3>
              <p className="text-sm text-gray-500 mb-4">
                Update role for <span className="font-medium">{selectedUser.name}</span>
              </p>
              <div className="space-y-3">
                {['BUYER', 'SELLER', 'ADMIN'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedRole === role
                        ? 'border-[#1B6B45] bg-[#EDF5EC]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900">{role}</span>
                    {selectedRole === role && (
                      <CheckCircle className="w-5 h-5 text-[#1B6B45]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 mt-6">
                <Button
                  variant="primary"
                  onClick={() => handleRoleChange(selectedUser.id, selectedRole)}
                >
                  Update Role
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRoleModal(false)}
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

// ✅ XCircle icon component
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default UserManagement;