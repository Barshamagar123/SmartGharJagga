// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Layout from './components/common/Layout/Layout';

// Pages
import Home from './pages/HomePage/HomePage';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import GoogleCallback from './pages/Login/GoogleCallback';
import Profile from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import PropertiesPage from './pages/Properties/PropertiesPage';
import AddProperty from './pages/Properties/AddProperty';
import EditProperty from './pages/Properties/EditProperty';
import MyProperties from './pages/Properties/MyProperties';
import PropertyDetailPremium from './pages/PropertyDetail/PropertyDetail';
import Favorites from './pages/Favorites/Favorites';
import FindMyMatch from './pages/FindMyMatch/FindMyMatch';
import MapSearchPage from './pages/MapSearch/MapSearchPage';
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import PropertyManagement from './pages/Admin/Properties/PropertyManagement';
import ReviewManagement from './pages/Admin/Review/ReviewManagement';
import UserManagement from './pages/Admin/Users/UserManagement';
import RoleBasedRoute from './components/common/ProtectedRoute/ProtectedRoute';

// ✅ Import RoleBasedRoute from correct path

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <LanguageProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 5000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  borderRadius: '12px',
                },
                success: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<GoogleCallback />} />

              {/* LAYOUT ROUTES */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/property/:id" element={<PropertyDetailPremium />} />
                <Route path="/map-search" element={<MapSearchPage />} />

                {/* ✅ AUTHENTICATED USERS (BUYER, SELLER, ADMIN) */}
                <Route
                  path="/profile"
                  element={
                    <RoleBasedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
                      <Profile />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={['BUYER', 'SELLER', 'ADMIN']}>
                      <Dashboard />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <RoleBasedRoute allowedRoles={['BUYER', 'SELLER']}>
                      <SubscriptionPlans />
                    </RoleBasedRoute>
                  }
                />

                {/* ✅ BUYER ONLY */}
                <Route
                  path="/favorites"
                  element={
                    <RoleBasedRoute allowedRoles={['BUYER']}>
                      <Favorites />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/match"
                  element={
                    <RoleBasedRoute allowedRoles={['BUYER']}>
                      <FindMyMatch />
                    </RoleBasedRoute>
                  }
                />

                {/* ✅ SELLER & ADMIN */}
                <Route
                  path="/list-property"
                  element={
                    <RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <AddProperty />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/my-properties"
                  element={
                    <RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <MyProperties />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/property/:id/edit"
                  element={
                    <RoleBasedRoute allowedRoles={['SELLER', 'ADMIN']}>
                      <EditProperty />
                    </RoleBasedRoute>
                  }
                />
              </Route>

              {/* ✅ ADMIN ONLY */}
              <Route
                path="/admin"
                element={
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <AdminLayout />
                  </RoleBasedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="properties" element={<PropertyManagement />} />
                <Route path="reviews" element={<ReviewManagement />} />
              </Route>

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900">404</h1>
                      <p className="text-xl text-gray-600 mt-4">Page not found</p>
                      <a
                        href="/"
                        className="mt-6 inline-block px-6 py-3 bg-[#2D5A27] text-white rounded-lg hover:bg-[#23461E] transition-colors"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </LanguageProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;