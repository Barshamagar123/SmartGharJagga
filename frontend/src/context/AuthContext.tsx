// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api/auth';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  updateProfile: (data: any) => Promise<any>;
  changePassword: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  changePassword: async () => {},
});

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

  // ✅ FIX: Register function - MUST return response
  const register = async (data: any) => {
    try {
      console.log('📝 AuthContext.register called with:', data);
      
      const response = await authApi.register(data);
      
      console.log('📥 AuthContext.register response:', response);
      
      // ✅ Check if response exists
      if (!response) {
        throw new Error('No response from server');
      }
      
      // ✅ Check if response has data
      if (response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        const fullUser = {
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
        };
        
        setUser(fullUser);
        console.log('✅ User set in context:', fullUser);
      }
      
      // ✅ MUST return the response
      return response;
      
    } catch (error: any) {
      console.error('❌ AuthContext.register error:', error);
      console.error('❌ Error response:', error.response);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      return response;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    const updatedUser = await authApi.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (data: any) => {
    await authApi.changePassword(data);
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
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;