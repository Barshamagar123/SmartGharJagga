// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api/auth';

// ✅ User interface
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  isEmailVerified?: boolean;
  avatarUrl?: string | null;
  phone?: string;
  isGoogleUser?: boolean;
  googleId?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  googleLogin: (userData: any, accessToken: string, refreshToken: string) => void;
  updateUser: (userData: any) => void;
}

// ✅ Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      console.log('🔍 Loading user from localStorage...');
      console.log('🔍 Token:', token ? '✅ Present' : '❌ Missing');
      console.log('🔍 Stored User:', storedUser);
      
      if (token && storedUser) {
        try {
          // ✅ Try to get fresh user data from API
          const userData = await authApi.getProfile();
          if (userData) {
            const data = userData as any;
            console.log('🔍 Profile API Response:', data);
            console.log('🔍 User Role from API:', data.role);
            
            const formattedUser: User = {
              id: data.id || '',
              email: data.email || '',
              name: data.name || '',
              role: data.role || 'BUYER',
              isVerified: data.isVerified || false,
              isEmailVerified: data.isEmailVerified || false,
              avatarUrl: data.avatarUrl || null,
              phone: data.phone || '',
              isGoogleUser: data.isGoogleUser || false,
              googleId: data.googleId || null,
            };
            
            console.log('✅ Formatted User from API:', formattedUser);
            console.log('✅ User Role:', formattedUser.role);
            
            setUser(formattedUser);
            localStorage.setItem('user', JSON.stringify(formattedUser));
          }
        } catch (error) {
          console.error('❌ Error loading user profile:', error);
          // ✅ Fallback to stored user
          try {
            const parsedUser = JSON.parse(storedUser);
            const data = parsedUser as any;
            const formattedUser: User = {
              id: data.id || '',
              email: data.email || '',
              name: data.name || '',
              role: data.role || 'BUYER',
              isVerified: data.isVerified || false,
              isEmailVerified: data.isEmailVerified || false,
              avatarUrl: data.avatarUrl || null,
              phone: data.phone || '',
              isGoogleUser: data.isGoogleUser || false,
              googleId: data.googleId || null,
            };
            
            console.log('✅ Using stored user:', formattedUser);
            console.log('✅ User Role (stored):', formattedUser.role);
            
            setUser(formattedUser);
          } catch (parseError) {
            console.error('Failed to parse stored user:', parseError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      } else {
        console.log('ℹ️ No stored session found');
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // ✅ Regular login with email & password
  const login = async (email: string, password: string) => {
    try {
      console.log('🔍 Attempting login for:', email);
      const response = await authApi.login({ email, password });
      
      if (response && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        const data = userData as any;
        
        console.log('🔍 Login Response User Data:', data);
        console.log('🔍 User Role from Backend:', data.role);
        
        const formattedUser: User = {
          id: data.id || '',
          email: data.email || '',
          name: data.name || '',
          role: data.role || 'BUYER',
          isVerified: data.isVerified || false,
          isEmailVerified: data.isEmailVerified || false,
          avatarUrl: data.avatarUrl || null,
          phone: data.phone || '',
          isGoogleUser: data.isGoogleUser || false,
          googleId: data.googleId || null,
        };
        
        console.log('✅ Formatted User:', formattedUser);
        console.log('✅ User Role:', formattedUser.role);
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        setUser(formattedUser);
        
        console.log('✅ Login successful!');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Login error:', error);
      if (error.response?.data?.message?.includes('Google Sign-In')) {
        throw new Error('This account uses Google Sign-In. Please use "Continue with Google" instead.');
      }
      throw error;
    }
  };

  // ✅ Register new user
  const register = async (data: any) => {
    try {
      console.log('🔍 Registering new user:', data.email);
      const response = await authApi.register(data);
      
      if (response && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        const userDataTyped = userData as any;
        
        console.log('🔍 Register Response User Data:', userDataTyped);
        console.log('🔍 User Role from Backend:', userDataTyped.role);
        
        const formattedUser: User = {
          id: userDataTyped.id || '',
          email: userDataTyped.email || '',
          name: userDataTyped.name || '',
          role: userDataTyped.role || 'BUYER',
          isVerified: userDataTyped.isVerified || false,
          isEmailVerified: userDataTyped.isEmailVerified || false,
          avatarUrl: userDataTyped.avatarUrl || null,
          phone: userDataTyped.phone || '',
          isGoogleUser: userDataTyped.isGoogleUser || false,
          googleId: userDataTyped.googleId || null,
        };
        
        console.log('✅ Formatted User:', formattedUser);
        console.log('✅ User Role:', formattedUser.role);
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        setUser(formattedUser);
        
        console.log('✅ Registration successful!');
      }
      return response;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  };

  // ✅ Google Login - Direct authentication
  const googleLogin = (userData: any, accessToken: string, refreshToken: string) => {
    const data = userData as any;
    
    console.log('🔍 Google Login User Data:', data);
    console.log('🔍 User Role from Backend:', data.role);
    
    const formattedUser: User = {
      id: data.id || '',
      email: data.email || '',
      name: data.name || '',
      role: data.role || 'BUYER',
      isVerified: data.isVerified || false,
      isEmailVerified: true, // Google emails are verified
      avatarUrl: data.avatarUrl || null,
      phone: data.phone || '',
      isGoogleUser: true,
      googleId: data.googleId || null,
    };
    
    console.log('✅ Formatted User:', formattedUser);
    console.log('✅ User Role:', formattedUser.role);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
    
    console.log('✅ Google Login successful!');
  };

  // ✅ Update user data
  const updateUser = (userData: any) => {
    const data = userData as any;
    console.log('🔍 Updating user data:', data);
    
    const formattedUser: User = {
      id: data.id || '',
      email: data.email || '',
      name: data.name || '',
      role: data.role || 'BUYER',
      isVerified: data.isVerified || false,
      isEmailVerified: data.isEmailVerified || false,
      avatarUrl: data.avatarUrl || null,
      phone: data.phone || '',
      isGoogleUser: data.isGoogleUser || false,
      googleId: data.googleId || null,
    };
    
    console.log('✅ Updated User:', formattedUser);
    
    localStorage.setItem('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  // ✅ Logout
  const logout = () => {
    console.log('🔍 Logging out...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    console.log('✅ Logout successful');
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
        googleLogin,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;