
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/common/Navbar/Navbar';
import { AuthProvider } from './components/context/AuthContext';
import { LanguageProvider } from './components/context/LanguageContext';
import HomePage from './pages/HomePage/HomePage';



const Properties = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">Properties</h1>
  </div>
);

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

const Login = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">Login</h1>
  </div>
);

const Register = () => (
  <div className="container-custom py-12">
    <h1 className="text-3xl font-bold">Register</h1>
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
          <div className="min-h-screen bg-background">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;