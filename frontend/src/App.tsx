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
import BuyerDashboard from './pages/Dashboard/BuyerDashboard.tsx';
import PropertiesPage from './pages/Properties/PropertiesPage.tsx';
import AddProperty from './pages/Properties/AddProperty.tsx';
import EditProperty from './pages/Properties/EditProperty.tsx';

function App() {
  return (
    <Router>
      {/* ✅ CRITICAL: AuthProvider MUST wrap EVERYTHING */}
      <AuthProvider>
       
          <Routes>
            {/* ✅ Layout is INSIDE AuthProvider */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertiesPage />} />
                      <Route path="/list-property" element={<AddProperty />} />
            <Route path="/property/:id/edit" element={<EditProperty />} />

              <Route path="/property/:slug" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth/callback" element={<GoogleCallback />} />
<Route path='/profile' element={<Profile />} />
<Route path='/dashboard' element={<BuyerDashboard />} />
              <Route path="/ai-matching" element={<AIMatching />} />
              <Route path="/map-search" element={<MapSearch />} />
            </Route>
          </Routes>
        
      </AuthProvider>
    </Router>
  );
}

export default App;