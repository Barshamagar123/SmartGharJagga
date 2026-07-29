// src/pages/GoogleCallback.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState('BUYER');
  const [userData, setUserData] = useState<any>(null);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    const accessTokenParam = searchParams.get('accessToken');
    const refreshTokenParam = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');
    const isNewUser = searchParams.get('isNewUser');

    if (errorParam) {
      setError('Google authentication failed. Please try again.');
      setTimeout(() => {
        navigate('/login?error=' + errorParam);
      }, 3000);
      return;
    }

    if (accessTokenParam && refreshTokenParam && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // ✅ Check if user is new (no role selected yet)
        if (isNewUser === 'true' || !user.role) {
          setUserData(user);
          setAccessToken(accessTokenParam);
          setRefreshToken(refreshTokenParam);
          setShowRoleSelection(true); // ✅ Show role selection
          return;
        }

        // ✅ Existing user - direct login
        googleLogin(user, accessTokenParam, refreshTokenParam);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        setError('Failed to process login data. Please try again.');
        setTimeout(() => {
          navigate('/login?error=invalid_data');
        }, 3000);
      }
    } else {
      setError('Missing authentication data. Please try again.');
      setTimeout(() => {
        navigate('/login?error=missing_tokens');
      }, 3000);
    }
  }, [searchParams, navigate, googleLogin]);

  // ✅ Handle Role Selection
  const handleRoleSelection = async () => {
    try {
      // ✅ Update user role via API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/v1/auth/update-role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();
      
      if (data.success) {
        const updatedUser = { ...userData, role: selectedRole };
        googleLogin(updatedUser, accessToken, refreshToken);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1000);
      } else {
        setError('Failed to update role. Please try again.');
      }
    } catch (error) {
      console.error('Role update error:', error);
      setError('Failed to update role. Please try again.');
    }
  };

  // ✅ Role Selection UI
  if (showRoleSelection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">👋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to SmartGharJagga!
            </h2>
            <p className="text-gray-600 mb-6">
              Please select your account type to continue
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setSelectedRole('BUYER')}
              className={`w-full p-4 border-2 rounded-xl transition-all duration-200 flex items-center gap-4 ${
                selectedRole === 'BUYER'
                  ? 'border-[#2D5A27] bg-[#2D5A27]/5'
                  : 'border-gray-200 hover:border-[#2D5A27]/50'
              }`}
            >
              <div className="text-3xl">🏠</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Buyer</h3>
                <p className="text-sm text-gray-500">Looking to buy properties</p>
              </div>
              {selectedRole === 'BUYER' && (
                <span className="ml-auto text-[#2D5A27]">✓</span>
              )}
            </button>

            <button
              onClick={() => setSelectedRole('SELLER')}
              className={`w-full p-4 border-2 rounded-xl transition-all duration-200 flex items-center gap-4 ${
                selectedRole === 'SELLER'
                  ? 'border-[#2D5A27] bg-[#2D5A27]/5'
                  : 'border-gray-200 hover:border-[#2D5A27]/50'
              }`}
            >
              <div className="text-3xl">📈</div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Seller</h3>
                <p className="text-sm text-gray-500">Looking to sell properties</p>
              </div>
              {selectedRole === 'SELLER' && (
                <span className="ml-auto text-[#2D5A27]">✓</span>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRoleSelection}
            className="w-full mt-6 py-3 bg-[#2D5A27] text-white font-semibold rounded-xl hover:bg-[#23461E] transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // ✅ Loading State
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-400 mt-4">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto"></div>
            <p className="mt-4 text-gray-600">Completing Google sign-in...</p>
            <p className="text-sm text-gray-400 mt-2">Please wait while we verify your account</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;