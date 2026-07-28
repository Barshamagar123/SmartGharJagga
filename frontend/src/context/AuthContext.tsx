// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi,type AuthResponse,type UserProfile } from '../services/api/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

// ✅ Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
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

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: userData } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const fullUser: UserProfile = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isVerified,
      isEmailVerified: false,
      isActive: true,
      avatarUrl: userData.avatarUrl || '',
      languagePref: 'ENGLISH',
      phone: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUser(fullUser);
    return response;
  };

  const register = async (data: any) => {
    const response = await authApi.register(data);
    const { accessToken, refreshToken, user: userData } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    
    const fullUser: UserProfile = {
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
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updatedUser = await authApi.updateProfile(data);
    setUser(updatedUser);
    return updatedUser;
  };

  const changePassword = async (data: { currentPassword: string; newPassword: string }) => {
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

// ✅ Fixed: Better error handling for useAuth
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // ✅ Return default values instead of throwing error
  if (!context) {
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => ({ success: false, data: null, message: 'Auth not initialized' }),
      register: async () => ({ success: false, data: null, message: 'Auth not initialized' }),
      logout: async () => {},
      updateProfile: async () => ({} as UserProfile),
      changePassword: async () => {},
    };
  }
  
  return context;
};

export default AuthContext;