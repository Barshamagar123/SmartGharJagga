// src/pages/GoogleCallback.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    // Check for error from backend
    if (errorParam) {
      setError('Google authentication failed. Please try again.');
      setTimeout(() => {
        navigate('/login?error=' + errorParam);
      }, 3000);
      return;
    }

    if (accessToken && refreshToken && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        
        // ✅ Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // ✅ Redirect to dashboard or home
        setTimeout(() => {
          navigate('/', { replace: true });
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
  }, [searchParams, navigate]);

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