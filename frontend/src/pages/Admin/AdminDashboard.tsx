// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Home, TrendingUp, DollarSign,
  Eye, CheckCircle, Clock, XCircle,
  ArrowUp, ArrowDown, MoreVertical,
  Activity, Calendar, MapPin, Star,
  Building, UserCheck, UserX, PlusCircle,
  ShoppingBag, MessageCircle, ThumbsUp
} from 'lucide-react';
import { adminApi } from '../../services/api/admin';
import StatsCard from '../../components/admin/StatsCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  totalProperties: number;
  totalPropertiesPending: number;
  totalPropertiesApproved: number;
  totalPropertiesRejected: number;
  totalPropertiesSold: number;
  totalReviews: number;
  totalRevenue: number;
  totalCommissions: number;
  pendingCommissions: number;
  totalAdmins: number;
  totalSellers: number;
  totalBuyers: number;
  monthlyStats: any[];
  revenueData?: any[];
  listingData?: any[];
}

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  property?: {
    id: string;
    title: string;
  };
}

interface RecentProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  propertyType: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  _count: {
    views: number;
    favorites: number;
  };
  images?: any[];
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    totalProperties: 0,
    totalPropertiesPending: 0,
    totalPropertiesApproved: 0,
    totalPropertiesRejected: 0,
    totalPropertiesSold: 0,
    totalReviews: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    totalAdmins: 0,
    totalSellers: 0,
    totalBuyers: 0,
    monthlyStats: [],
    revenueData: [],
    listingData: [],
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [statsData, activityData, propertiesData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getRecentActivity(10),
        adminApi.getRecentProperties(10)
      ]);

      console.log('📊 Stats Data:', statsData);
      console.log('📋 Activity Data:', activityData);
      console.log('🏠 Properties Data:', propertiesData);

      // ✅ Extract user stats from response
      const totalUsers = statsData?.totalUsers || 0;
      const activeUsers = statsData?.activeStats?.find((s: any) => s.isActive === true)?._count?.isActive || 0;
      const blockedUsers = statsData?.activeStats?.find((s: any) => s.isActive === false)?._count?.isActive || 0;
      
      // ✅ Extract role stats
      const admins = statsData?.roleDistribution?.find((r: any) => r.role === 'ADMIN')?._count?.role || 0;
      const sellers = statsData?.roleDistribution?.find((r: any) => r.role === 'SELLER')?._count?.role || 0;
      const buyers = statsData?.roleDistribution?.find((r: any) => r.role === 'BUYER')?._count?.role || 0;

      // ✅ Set stats with proper data mapping
      setStats({
        totalUsers: totalUsers,
        activeUsers: activeUsers,
        blockedUsers: blockedUsers,
        totalProperties: statsData?.totalProperties || 0,
        totalPropertiesPending: statsData?.totalPropertiesPending || 0,
        totalPropertiesApproved: statsData?.totalPropertiesApproved || 0,
        totalPropertiesRejected: statsData?.totalPropertiesRejected || 0,
        totalPropertiesSold: statsData?.totalPropertiesSold || 0,
        totalReviews: statsData?.totalReviews || 0,
        totalRevenue: statsData?.totalRevenue || 0,
        totalCommissions: statsData?.totalCommissions || 0,
        pendingCommissions: statsData?.totalCommissions || 0,
        totalAdmins: admins,
        totalSellers: sellers,
        totalBuyers: buyers,
        monthlyStats: statsData?.monthlyStats || [],
        revenueData: statsData?.monthlyStats?.map((item: any) => ({
          month: item.month,
          value: item.count || 0
        })) || [],
        listingData: statsData?.monthlyStats?.map((item: any) => ({
          month: item.month,
          value: item.count || 0
        })) || [],
      });

      // Set recent activity
      setRecentActivity(Array.isArray(activityData) ? activityData : []);

      // Set recent properties
      setRecentProperties(Array.isArray(propertiesData) ? propertiesData : []);

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      
      // ✅ Set fallback data on error
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        totalProperties: 0,
        totalPropertiesPending: 0,
        totalPropertiesApproved: 0,
        totalPropertiesRejected: 0,
        totalPropertiesSold: 0,
        totalReviews: 0,
        totalRevenue: 0,
        totalCommissions: 0,
        pendingCommissions: 0,
        totalAdmins: 0,
        totalSellers: 0,
        totalBuyers: 0,
        monthlyStats: [],
        revenueData: [],
        listingData: [],
      });
      setRecentActivity([]);
      setRecentProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Main Stats Cards
  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers || 0,
      change: stats.totalUsers > 0 ? '+12.5%' : '0%',
      trend: stats.totalUsers > 0 ? 'up' : 'neutral',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      subtitle: `${stats.activeUsers || 0} active, ${stats.blockedUsers || 0} blocked`
    },
    {
      icon: Home,
      label: 'Total Properties',
      value: stats.totalProperties || 0,
      change: stats.totalProperties > 0 ? '+8.3%' : '0%',
      trend: stats.totalProperties > 0 ? 'up' : 'neutral',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      subtitle: `${stats.totalPropertiesPending || 0} pending, ${stats.totalPropertiesApproved || 0} approved`
    },
    {
      icon: DollarSign,
      label: 'Revenue (NPR)',
      value: `Rs ${(stats.totalRevenue || 0).toLocaleString()}`,
      change: stats.totalRevenue > 0 ? '+23.7%' : '0%',
      trend: stats.totalRevenue > 0 ? 'up' : 'neutral',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      subtitle: `${stats.pendingCommissions || 0} commissions pending`
    },
    {
      icon: TrendingUp,
      label: 'Active Listings',
      value: stats.totalPropertiesApproved || 0,
      change: stats.totalPropertiesApproved > 0 ? '+5.2%' : '0%',
      trend: stats.totalPropertiesApproved > 0 ? 'up' : 'neutral',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      subtitle: `${stats.totalPropertiesSold || 0} properties sold`
    },
  ];

  // ✅ User Breakdown Stats
  const userStatsCards = [
    {
      icon: UserCheck,
      label: 'Active Users',
      value: stats.activeUsers || 0,
      change: stats.activeUsers > 0 ? '+5.2%' : '0%',
      trend: stats.activeUsers > 0 ? 'up' : 'neutral',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: UserX,
      label: 'Blocked Users',
      value: stats.blockedUsers || 0,
      change: stats.blockedUsers > 0 ? '-3.1%' : '0%',
      trend: stats.blockedUsers > 0 ? 'down' : 'neutral',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
    },
    {
      icon: ShoppingBag,
      label: 'Total Sellers',
      value: stats.totalSellers || 0,
      change: stats.totalSellers > 0 ? '+10.0%' : '0%',
      trend: stats.totalSellers > 0 ? 'up' : 'neutral',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Building,
      label: 'Total Buyers',
      value: stats.totalBuyers || 0,
      change: stats.totalBuyers > 0 ? '+15.3%' : '0%',
      trend: stats.totalBuyers > 0 ? 'up' : 'neutral',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#1B6B45] to-[#0F3D2E] flex items-center justify-center text-white text-xs font-semibold">
            {row.user?.name?.charAt(0) || row.user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <span className="text-sm font-medium">{row.user?.name || 'Unknown'}</span>
            <p className="text-xs text-gray-400">{row.user?.email || ''}</p>
          </div>
        </div>
      )
    },
    {
      key: 'message',
      label: 'Action',
      render: (row: any) => (
        <span className="text-sm">{row.message || row.type || 'Activity'}</span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (row: any) => {
        const typeColors: Record<string, string> = {
          USER_REGISTERED: 'bg-blue-100 text-blue-700',
          PROPERTY_CREATED: 'bg-green-100 text-green-700',
          REVIEW_ADDED: 'bg-purple-100 text-purple-700',
          PROPERTY_SOLD: 'bg-yellow-100 text-yellow-700',
        };
        const color = typeColors[row.type] || 'bg-gray-100 text-gray-700';
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${color}`}>
            {row.type?.replace('_', ' ') || 'Unknown'}
          </span>
        );
      }
    },
    {
      key: 'timestamp',
      label: 'Time',
      render: (row: any) => (
        <span className="text-sm text-gray-500">
          {row.timestamp ? new Date(row.timestamp).toLocaleDateString() : 'N/A'}
        </span>
      )
    },
  ];

  const propertyColumns = [
    {
      key: 'title',
      label: 'Property',
      render: (row: any) => (
        <div>
          <p className="font-medium text-gray-900">{row.title}</p>
          <p className="text-xs text-gray-500">{row.propertyType || 'Property'}</p>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (row: any) => (
        <span className="font-semibold text-gray-900">
          Rs {row.price?.toLocaleString() || 0}
        </span>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (row: any) => (
        <span className="text-sm">{row.location || 'N/A'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    {
      key: 'user',
      label: 'Listed By',
      render: (row: any) => (
        <span className="text-sm">{row.user?.name || 'Unknown'}</span>
      )
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B6B45] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#1B6B45] text-white rounded-lg hover:bg-[#0F3D2E] transition-colors text-sm flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            Refresh
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Today
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* User Breakdown Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStatsCards.map((stat, index) => (
          <motion.div
            key={`user-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {(stats.revenueData && stats.revenueData.length > 0) || 
       (stats.listingData && stats.listingData.length > 0) ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats.revenueData && stats.revenueData.length > 0 && (
            <ChartCard
              title="Revenue Overview"
              type="line"
              data={stats.revenueData}
              height={300}
            />
          )}
          {stats.listingData && stats.listingData.length > 0 && (
            <ChartCard
              title="Property Listings"
              type="bar"
              data={stats.listingData}
              height={300}
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-64">
            <p className="text-gray-400">No revenue data available</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-center h-64">
            <p className="text-gray-400">No listing data available</p>
          </div>
        </div>
      )}

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <DataTable
            title="Recent Activity"
            columns={activityColumns}
            data={recentActivity}
            loading={loading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <DataTable
            title="Recent Properties"
            columns={propertyColumns}
            data={recentProperties}
            loading={loading}
            actionButton={(row) => (
              <button 
                onClick={() => window.location.href = `/properties/${row.id}`}
                className="text-[#1B6B45] hover:text-[#0F3D2E] text-sm font-medium"
              >
                View
              </button>
            )}
          />
        </motion.div>
      </div>

      {/* Empty state when no data */}
      {stats.totalUsers === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No Data Available</h3>
          <p className="text-gray-500 mt-2">
            Start adding users and properties to see analytics here.
          </p>
          <button className="mt-4 px-6 py-2 bg-[#1B6B45] text-white rounded-lg hover:bg-[#0F3D2E] transition-colors">
            <PlusCircle className="w-4 h-4 inline mr-2" />
            Add First Property
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;