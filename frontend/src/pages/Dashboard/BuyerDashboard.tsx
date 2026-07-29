// src/pages/Dashboard/BuyerDashboard.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button/Button';
import { Card, CardContent } from '../../components/common/Card/Card';
import { authApi } from '../../services/api/auth';

// Icons (using Lucide or simple emoji)
import {
  Home,
  Heart,
  Search,
  Clock,
  TrendingUp,
  MessageCircle,
  Calendar,
  ChevronRight,
  Star,
  MapPin,
  Filter,
  Download,
  Settings,
  LogOut,
  Bell,
  User,
  Eye,
  Share2,
  Phone,
  Mail,
} from 'lucide-react';

interface DashboardStats {
  totalSaved: number;
  totalViewed: number;
  totalInquiries: number;
  totalMatches: number;
}

interface RecentProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  status: 'saved' | 'viewed' | 'inquiry';
  createdAt: string;
}

interface SavedSearch {
  id: string;
  name: string;
  criteria: string;
  matches: number;
  lastRun: string;
}

const BuyerDashboard: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalSaved: 0,
    totalViewed: 0,
    totalInquiries: 0,
    totalMatches: 0,
  });
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([
    {
      id: '1',
      title: 'Modern Villa with Garden',
      location: 'Kathmandu, Budhanilkantha',
      price: 'Rs 5.2 Cr',
      image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
      type: 'VILLA',
      beds: 5,
      baths: 4,
      sqft: 4200,
      status: 'saved',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Luxury Apartment with View',
      location: 'Pokhara, Lakeside',
      price: 'Rs 3.2 Cr',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
      type: 'APARTMENT',
      beds: 3,
      baths: 2,
      sqft: 1800,
      status: 'viewed',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Commercial Complex',
      location: 'Lalitpur, Jawalakhel',
      price: 'Rs 12 Cr',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
      type: 'COMMERCIAL',
      beds: 0,
      baths: 4,
      sqft: 5500,
      status: 'inquiry',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [savedSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Luxury Homes in Kathmandu',
      criteria: 'Price: 3-7 Cr, Type: Villa/House',
      matches: 12,
      lastRun: '2 hours ago',
    },
    {
      id: '2',
      name: 'Affordable Apartments',
      criteria: 'Price: Under 1.5 Cr, Type: Apartment',
      matches: 8,
      lastRun: '1 day ago',
    },
    {
      id: '3',
      name: 'Commercial Spaces',
      criteria: 'Price: 5-15 Cr, Type: Commercial',
      matches: 5,
      lastRun: '3 days ago',
    },
  ]);

  // ✅ Fetch dashboard data
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch real data from API
        // const statsData = await dashboardApi.getStats();
        // setStats(statsData);
        // const properties = await dashboardApi.getRecentProperties();
        // setRecentProperties(properties);
        
        // Simulate API call
        setTimeout(() => {
          setStats({
            totalSaved: 24,
            totalViewed: 156,
            totalInquiries: 18,
            totalMatches: 42,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  // ✅ Format currency
  const formatPrice = (price: string) => {
    return price;
  };

  // ✅ Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'saved':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Saved</span>;
      case 'viewed':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Viewed</span>;
      case 'inquiry':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">Inquiry Sent</span>;
      default:
        return null;
    }
  };

  // ✅ Loading state
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
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-500 mt-1">
                Here's what's happening with your property search
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Link to="/properties">
                <Button variant="primary" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Find Properties
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
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Saved Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSaved}</p>
                </div>
                <div className="w-12 h-12 bg-[#2D5A27]/10 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#2D5A27]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Properties Viewed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViewed}</p>
                </div>
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Inquiries Sent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">AI Matches</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Properties - Left Column (2/3) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <Link to="/properties" className="text-sm text-[#2D5A27] hover:underline flex items-center">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentProperties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
                                <MapPin className="w-3 h-3" />
                                {property.location}
                              </p>
                            </div>
                            {getStatusBadge(property.status)}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="font-semibold text-[#2D5A27]">{formatPrice(property.price)}</span>
                            <span>{property.beds} beds</span>
                            <span>{property.baths} baths</span>
                            <span>{property.sqft} sqft</span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Link to={`/property/${property.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <Heart className="w-4 h-4" />
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

          {/* Saved Searches - Right Column (1/3) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Saved Searches */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Saved Searches</h2>
                    <Link to="/saved-searches" className="text-sm text-[#2D5A27] hover:underline">
                      Manage
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {savedSearches.map((search) => (
                      <div key={search.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{search.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{search.criteria}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-medium text-[#2D5A27] bg-[#2D5A27]/10 px-2 py-1 rounded">
                                {search.matches} matches
                              </span>
                              <span className="text-xs text-gray-400">{search.lastRun}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#2D5A27]">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Link to="/saved-searches/new">
                    <Button variant="outline" size="sm" fullWidth className="mt-4">
                      <Filter className="w-4 h-4 mr-2" />
                      Create New Search
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/properties">
                      <Button variant="outline" size="sm" fullWidth>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </Link>
                    <Link to="/favorites">
                      <Button variant="outline" size="sm" fullWidth>
                        <Heart className="w-4 h-4 mr-2" />
                        Favorites
                      </Button>
                    </Link>
                    <Link to="/messages">
                      <Button variant="outline" size="sm" fullWidth>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Messages
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="outline" size="sm" fullWidth>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-[#2D5A27] to-[#23461E] text-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold">🤖 AI-Powered Recommendations</h3>
                  <p className="text-white/80 mt-1">
                    Based on your search history, we found 12 properties you might love
                  </p>
                </div>
                <Link to="/ai-matching">
                  <Button variant="primary" className="bg-white text-[#2D5A27] hover:bg-gray-100 mt-4 md:mt-0">
                    View Recommendations
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BuyerDashboard;