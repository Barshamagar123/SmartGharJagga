// src/pages/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Home, TrendingUp, DollarSign,
  Eye, CheckCircle, Clock, XCircle,
  ArrowUp, ArrowDown, MoreVertical,
  Activity, Calendar, MapPin, Star
} from 'lucide-react';
import { adminApi } from '../../services/api/admin'
import StatsCard from '../../components/admin/StatsCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, activityData, propertiesData] = await Promise.all([
          adminApi.getStats(),
          adminApi.getRecentActivity(),
          adminApi.getRecentProperties()
        ]);
        setStats(statsData);
        setRecentActivity(activityData);
        setRecentProperties(propertiesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      icon: Users,
      label: 'Total Users',
      value: stats.totalUsers || 0,
      change: '+12.5%',
      trend: 'up',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Home,
      label: 'Properties',
      value: stats.totalProperties || 0,
      change: '+8.3%',
      trend: 'up',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: DollarSign,
      label: 'Revenue (NPR)',
      value: `Rs ${(stats.revenue || 0).toLocaleString()}`,
      change: '+23.7%',
      trend: 'up',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: TrendingUp,
      label: 'Active Listings',
      value: stats.activeListings || 0,
      change: '-2.1%',
      trend: 'down',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
  ];

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
            {row.user?.charAt(0) || 'U'}
          </div>
          <span className="text-sm font-medium">{row.user}</span>
        </div>
      )
    },
    { key: 'action', label: 'Action' },
    { key: 'target', label: 'Target' },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
    { key: 'time', label: 'Time' },
  ];

  const propertyColumns = [
    { key: 'title', label: 'Property' },
    { key: 'price', label: 'Price' },
    { key: 'location', label: 'Location' },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => <StatusBadge status={row.status} />
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#1B6B45] text-white rounded-lg hover:bg-[#0F3D2E] transition-colors text-sm">
            <Calendar className="w-4 h-4 inline mr-2" />
            Today
          </button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Revenue Overview"
          type="line"
          data={stats.revenueData || []}
          height={300}
        />
        <ChartCard
          title="Property Listings"
          type="bar"
          data={stats.listingData || []}
          height={300}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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
        >
          <DataTable
            title="Recent Properties"
            columns={propertyColumns}
            data={recentProperties}
            loading={loading}
            actionButton={(row) => (
              <button className="text-[#1B6B45] hover:text-[#0F3D2E] text-sm font-medium">
                View
              </button>
            )}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;