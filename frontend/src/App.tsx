// src/App.tsx

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar/Navbar';
import { AuthProvider } from './components/context/AuthContext';
import { LanguageProvider } from './components/context/LanguageContext';
import HomePage from './pages/HomePage/HomePage';
import Footer from './components/common/Footer/Footer';
import Properties from './pages/Properties/Properties';
import PropertyDetail from './pages/PropertyDetail/PropertyDetail';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

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

// ✅ Layout component that conditionally renders Navbar & Footer
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  // Pages where Navbar & Footer should be hidden
  const hideNavbarFooter = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-[var(--color-primary)]">
      {!hideNavbarFooter && <Navbar />}
      <main className={hideNavbarFooter ? '' : 'pt-16 md:pt-20'}>
        {children}
      </main>
      {!hideNavbarFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            } />
            <Route path="/properties" element={
              <AppLayout>
                <Properties />
              </AppLayout>
            } />
            <Route path="/property/:slug" element={
              <AppLayout>
                <PropertyDetail />
              </AppLayout>
            } />
            <Route path="/about" element={
              <AppLayout>
                <About />
              </AppLayout>
            } />
            <Route path="/contact" element={
              <AppLayout>
                <Contact />
              </AppLayout>
            } />
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            {/* ✅ Login & Register - Without Navbar & Footer */}
            <Route path="/login" element={
              <AppLayout>
                <Login />
              </AppLayout>
            } />
            <Route path="/register" element={
              <AppLayout>
                <Register />
              </AppLayout>
            } />
          </Routes>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;