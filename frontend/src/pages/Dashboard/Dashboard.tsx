// src/pages/Dashboard/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BuyerDashboard from './BuyerDashboard';
import SellerDashboard from './SellerDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      // ✅ Admin lai directly /admin ma pathau
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
        return;
      }
      setLoading(false);
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Seller → Seller Dashboard
  if (user?.role === 'SELLER') {
    return <SellerDashboard />;
  }

  // ✅ Buyer → Buyer Dashboard (Default)
  return <BuyerDashboard />;
};

export default Dashboard;