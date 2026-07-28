// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi,type AuthResponse } from '../services/api/auth';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => void;
}

// ✅ Create context with proper default
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const userData = await authApi.getProfile();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // ✅ FIXED: register function
  const register = async (data: any): Promise<AuthResponse> => {
    console.log('🔥 Register called with:', data);
    
    try {
      const response = await authApi.register(data);
      console.log('🔥 API response:', response);
      
      // ✅ Check if response exists
      if (!response) {
        throw new Error('No response from server');
      }
      
      // ✅ Save tokens
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isVerified: userData.isVerified,
          isEmailVerified: false,
          isActive: true,
          avatarUrl: userData.avatarUrl || '',
          languagePref: 'ENGLISH',
          phone: data.phone || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        console.log('✅ User set in context');
        return response;
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Register error:', error);
      throw error;
    }
  };

  // ✅ FIXED: login function
  const login = async (email: string, password: string): Promise<AuthResponse> => {
    console.log('🔐 Login called');
    
    try {
      const response = await authApi.login({ email, password });
      console.log('🔐 API response:', response);
      
      if (response.success && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
        return response;
      }
      
      return response;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ FIXED: useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;