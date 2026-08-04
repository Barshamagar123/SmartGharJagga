// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout/Layout.tsx';
import Home from './pages/HomePage/HomePage.tsx';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AIMatching from './pages/AIMatching/AIMatching';
import MapSearch from './pages/MapSearch/MapSearch';
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
import SubscriptionManagement from './pages/Admin/Subscriptions/SubscriptionManagement.tsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* ✅ Layout Routes - With Navbar & Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/list-property" element={<AddProperty />} />
            <Route path="/property/:id/edit" element={<EditProperty />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<GoogleCallback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ai-matching" element={<AIMatching />} />
            <Route path="/map-search" element={<MapSearch />} />
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
            <Route path="subscriptions" element={<SubscriptionManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;