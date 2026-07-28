// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './components/context/LanguageContext';

import Properties from './pages/Properties/Properties';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import AIMatching from './pages/AIMatching/AIMatching';
import MapSearch from './pages/MapSearch/MapSearch';
import Layout from './components/common/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';


function App() {
  return (
    <Router>
      {/* ✅ AuthProvider MUST wrap ALL routes */}
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:slug" element={<PropertyDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ai-matching" element={<AIMatching />} />
              <Route path="/map-search" element={<MapSearch />} />
            </Route>
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;