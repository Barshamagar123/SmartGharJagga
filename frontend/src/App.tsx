// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { LanguageProvider } from './components/context/LanguageContext';
import Properties from './pages/Properties/Properties';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import HomePage from './pages/HomePage/HomePage';
import LayoutOf from './components/common/Layout/Layout';
import AIMatching from './pages/AIMatching/AIMatching';

const About = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">About</h1>
  </div>
);

const Contact = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">Contact</h1>
  </div>
);

const Dashboard = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">Dashboard</h1>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            {/* ✅ All routes wrapped in Layout */}
            <Route element={<LayoutOf />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:slug" element={<PropertyDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                        <Route path="/ai-matching" element={<AIMatching />} />  {/* ✅ Add this route */}

            </Route>
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;