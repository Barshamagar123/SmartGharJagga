// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../services/api/auth';

// ✅ User interface - Sabai fields optional for flexibility
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
  isEmailVerified?: boolean;   // ✅ Optional
  avatarUrl?: string | null;   // ✅ Optional
  phone?: string;              // ✅ Optional
  isGoogleUser?: boolean;      // ✅ Optional
  googleId?: string | null;    // ✅ Optional
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
      
      if (token && storedUser) {
        try {
          const userData = await authApi.getProfile();
          if (userData) {
            // ✅ Use 'as any' to bypass TypeScript errors
            const data = userData as any;
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
            setUser(formattedUser);
            localStorage.setItem('user', JSON.stringify(formattedUser));
          }
        } catch (error) {
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
            setUser(formattedUser);
          } catch (parseError) {
            console.error('Failed to parse stored user:', parseError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  // ✅ Regular login with email & password
  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      if (response && response.data) {
        const { accessToken, refreshToken, user: userData } = response.data;
        const data = userData as any;
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
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(formattedUser));
        setUser(formattedUser);
      }
      return response;
    } catch (error: any) {
      if (error.response?.data?.message?.includes('Google Sign-In')) {
        throw new Error('This account uses Google Sign-In. Please use "Continue with Google" instead.');
      }
      throw error;
    }
  };

  // ✅ Register new user
  const register = async (data: any) => {
    const response = await authApi.register(data);
    if (response && response.data) {
      const { accessToken, refreshToken, user: userData } = response.data;
      const userDataTyped = userData as any;
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
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      setUser(formattedUser);
    }
    return response;
  };

  // ✅ Google Login - Direct authentication
  const googleLogin = (userData: any, accessToken: string, refreshToken: string) => {
    const data = userData as any;
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
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  // ✅ Update user data
  const updateUser = (userData: any) => {
    const data = userData as any;
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
    localStorage.setItem('user', JSON.stringify(formattedUser));
    setUser(formattedUser);
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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