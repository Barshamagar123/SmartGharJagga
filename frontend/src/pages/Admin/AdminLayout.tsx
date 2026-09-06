// src/pages/admin/AdminLayout.tsx

import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, Users, Home, BarChart3,
  FileText, FileBarChart, CreditCard, DollarSign,
  Image, Settings, ShieldCheck, LogOut, Bell, Search,
  ChevronDown, MessageCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
// ✅ Import NotificationBell component
import NotificationBell from '../../components/admin/NotificationBell';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Home, label: 'Property Management', path: '/admin/properties' },
    { icon: MessageCircle, label: 'Reviews', path: '/admin/reviews' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FileText, label: 'Content Management', path: '/admin/content' },
    { icon: FileBarChart, label: 'Reports', path: '/admin/reports' },
    { icon: CreditCard, label: 'Subscriptions', path: '/admin/subscriptions' },
    { icon: DollarSign, label: 'Commissions', path: '/admin/commissions' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: ShieldCheck, label: 'Verification', path: '/admin/verification' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Sticky and fixed */}
      <aside
        className={`fixed lg:sticky top-0 z-50 w-72 h-screen bg-gradient-to-b from-[#0F3D2E] to-[#1B6B45] transition-all duration-300 flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${!sidebarOpen && !isMobile ? 'w-20' : 'w-72'}`}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between p-6 border-b border-white/10 ${
          !sidebarOpen && !isMobile ? 'flex-col gap-2' : ''
        }`}>
          <div className={`flex items-center gap-3 ${!sidebarOpen && !isMobile ? 'flex-col' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🏠</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-white/50 text-xs">SmartGharJagga</p>
              </div>
            )}
          </div>
          
          {/* Toggle button for desktop */}
          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white/50 hover:text-white transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
          )}
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation - Scrollable but sidebar stays fixed */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              } ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}
              title={!sidebarOpen && !isMobile ? item.label : ''}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${
                isActive(item.path) ? 'text-white' : 'text-white/70 group-hover:text-white'
              }`} />
              {sidebarOpen && (
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
              )}
              {isActive(item.path) && sidebarOpen && (
                <span className="w-1.5 h-8 bg-white rounded-full" />
              )}
              {isActive(item.path) && !sidebarOpen && (
                <span className="absolute right-0 w-1 h-8 bg-white rounded-full" />
              )}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 ${
                !sidebarOpen && !isMobile ? 'justify-center' : ''
              }`}
              title={!sidebarOpen && !isMobile ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* Desktop menu toggle */}
              {!isMobile && (
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
              )}
              
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-[#1B6B45] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* ✅ Notification Bell Component */}
              <NotificationBell />
              
              {/* User Profile */}
              <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B6B45] to-[#0F3D2E] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;