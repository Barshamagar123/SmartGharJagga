// src/App.tsx - With Lazy Loading

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react'; // ✅ Import lazy and Suspense
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/common/Layout/Layout.tsx';
import { RoleBasedRoute } from './components/common/ProtectedRoute/ProtectedRoute.tsx';

// ✅ Lazy load pages
const Home = lazy(() => import('./pages/HomePage/HomePage.tsx'));
const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const PropertiesPage = lazy(() => import('./pages/Properties/PropertiesPage.tsx'));
// ... lazy load all other pages

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* ✅ Layout Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* ... other routes */}
              </Route>
            </Routes>
          </Suspense>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;