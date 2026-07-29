// src/pages/Dashboard/SellerDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import {
  Home,
  Plus,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Star,
  ChevronRight,
  DollarSign,
  Clock,
  AlertCircle,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  User,
  Edit,
  Trash2,
  Upload,
  Calendar,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from 'lucide-react';

interface PropertyStats {
  total: number;
  active: number;
  pending: number;
  sold: number;
  views: number;
  inquiries: number;
}

interface PropertyListing {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  type: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
  inquiries: number;
  createdAt: string;
}

const SellerDashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PropertyStats>({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
    views: 0,
    inquiries: 0,
  });

  const [properties, setProperties] = useState<PropertyListing[]>([
    {
      id: '1',
      title: 'Modern Villa with Garden',
      location: 'Kathmandu, Budhanilkantha',
      price: 'Rs 5.2 Cr',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
      type: 'VILLA',
      status: 'active',
      views: 245,
      inquiries: 12,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Luxury Apartment with View',
      location: 'Pokhara, Lakeside',
      price: 'Rs 3.2 Cr',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      type: 'APARTMENT',
      status: 'pending',
      views: 89,
      inquiries: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Commercial Complex',
      location: 'Lalitpur, Jawalakhel',
      price: 'Rs 12 Cr',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
      type: 'COMMERCIAL',
      status: 'sold',
      views: 567,
      inquiries: 23,
      createdAt: new Date().toISOString(),
    },
  ]);

  // ✅ Fetch seller data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setStats({
            total: 12,
            active: 8,
            pending: 2,
            sold: 2,
            views: 1245,
            inquiries: 67,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  // ✅ Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Active
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full flex items-center gap-1">
            <ClockIcon className="w-3 h-3" /> Pending
          </span>
        );
      case 'sold':
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Sold
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Seller'}! 🏠
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your properties and track performance
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link to="/list-property">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  List New Property
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-full flex items-center justify-center">
                  <Home className="w-6 h-6 text-[#2D5A27]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Sold</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.sold}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Views</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.views}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inquiries</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.inquiries}</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Properties List - Left Column (2/3) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your Properties</h2>
                    <div className="flex gap-2">
                      <Link to="/list-property">
                        <Button variant="primary" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add New
                        </Button>
                      </Link>
                      <Link to="/my-properties" className="text-sm text-[#2D5A27] hover:underline flex items-center">
                        View All <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {properties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 truncate">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="text-xs">{property.location}</span>
                              </p>
                            </div>
                            {getStatusBadge(property.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="font-semibold text-[#2D5A27]">{property.price}</span>
                            <span>{property.type}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {property.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" /> {property.inquiries} inquiries
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Link to={`/property/${property.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3 mr-1" /> Edit
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column (1/3) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Performance Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Views</span>
                      <span className="font-semibold">{stats.views}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Inquiries</span>
                      <span className="font-semibold">{stats.inquiries}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="font-semibold text-green-600">5.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Response Time</span>
                      <span className="font-semibold">2.5 hrs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/list-property">
                      <Button variant="outline" size="sm" fullWidth>
                        <Plus className="w-4 h-4 mr-2" />
                        List Property
                      </Button>
                    </Link>
                    <Link to="/my-properties">
                      <Button variant="outline" size="sm" fullWidth>
                        <Home className="w-4 h-4 mr-2" />
                        My Properties
                      </Button>
                    </Link>
                    <Link to="/messages">
                      <Button variant="outline" size="sm" fullWidth>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                    <Link to="/analytics">
                      <Button variant="outline" size="sm" fullWidth>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Pro Tips
                  </h4>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Add high-quality photos to get more views
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Respond to inquiries within 24 hours
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      Keep your listings updated regularly
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;