// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext'; // ✅ Import LanguageProvider
import Layout from './components/common/Layout/Layout.tsx';
import Home from './pages/HomePage/HomePage.tsx';

import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AIMatching from './pages/AIMatching/AIMatching';

import GoogleCallback from './pages/Login/GoogleCallback.tsx';
import Profile from './pages/Profile/Profile.tsx';
import PropertiesPage from './pages/Properties/PropertiesPage.tsx';
import AddProperty from './pages/Properties/AddProperty.tsx';
import EditProperty from './pages/Properties/EditProperty.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import AdminLayout from './pages/Admin/AdminLayout.tsx';
import { RoleBasedRoute } from './components/common/ProtectedRoute/ProtectedRoute.tsx';
import AdminDashboard from './pages/Admin/AdminDashboard.tsx';
import PropertyManagement from './pages/Admin/Properties/PropertyManagement.tsx';
import ReviewManagement from './pages/Admin/Review/ReviewManagement.tsx';
import UserManagement from './pages/Admin/Users/UserManagement.tsx';
import PropertyListingHeader from './components/properties/PropertyListingHeader.tsx';
import MyProperties from './pages/Properties/MyProperties.tsx';
import SubscriptionPlans from './pages/Subscription/SubscriptionPlans.tsx';
import PropertyDetailPremium from './pages/PropertyDetail/PropertyDetail';
import FindMyMatch from './pages/FindMyMatch/FindMyMatch.tsx';
import MapSearchPage from './pages/MapSearch/MapSearchPage.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>  {/* ✅ Wrap all routes with LanguageProvider */}
          <Routes>
            {/* ✅ Layout Routes - With Navbar & Footer */}
            <Route element={<Layout />}>
              {/* Home */}
              <Route path="/" element={<Home />} />
              
              {/* Properties */}
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/property/:id" element={<PropertyDetailPremium />} />
              <Route path="/property/:id/edit" element={<EditProperty />} />
              <Route path="/list-property" element={<AddProperty />} />
              <Route path="/my-properties" element={<MyProperties />} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<GoogleCallback />} />
              
              {/* User */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Features */}
              <Route path="/ai-matching" element={<AIMatching />} />
              <Route path="/map-search" element={<MapSearchPage />} />
              <Route path="/match" element={<FindMyMatch />} />
              
              {/* Other */}
              <Route path='/listing' element={<PropertyListingHeader />} />
              <Route path='/subscription' element={<SubscriptionPlans />} />
            </Route>

            {/* ✅ Admin Routes - Without Layout */}
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
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;