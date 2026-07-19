// src/context/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// ============================================
// TYPES
// ============================================
export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';  // ✅ ADD ADMIN HERE!

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;  // ✅ Use the expanded type
  avatarUrl?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

// ============================================
// MOCK USERS
// ============================================
const MOCK_BUYER: User = {
  id: 'user-123',
  email: 'buyer@example.com',
  name: 'Buyer User',
  role: 'BUYER',
  isVerified: true,
};

const MOCK_SELLER: User = {
  id: 'user-456',
  email: 'seller@example.com',
  name: 'Seller User',
  role: 'SELLER',
  isVerified: true,
};

const MOCK_ADMIN: User = {
  id: 'user-789',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'ADMIN',
  isVerified: true,
};

// ============================================
// CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    
    if (storedToken && storedRole) {
      setToken(storedToken);
      // Set mock user based on stored role
      let mockUser: User;
      switch (storedRole) {
        case 'BUYER':
          mockUser = MOCK_BUYER;
          break;
        case 'SELLER':
          mockUser = MOCK_SELLER;
          break;
        case 'ADMIN':
          mockUser = MOCK_ADMIN;
          break;
        default:
          mockUser = MOCK_BUYER;
      }
      setUser(mockUser);
    }
    setIsLoading(false);
  }, []);

  // ============================================
  // LOGIN
  // ============================================
  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ Determine role
    let userRole: UserRole = 'BUYER';
    
    if (role) {
      userRole = role;
    } else if (email.includes('seller')) {
      userRole = 'SELLER';
    } else if (email.includes('admin')) {
      userRole = 'ADMIN';
    }
    
    // ✅ Set correct mock user
    let mockUser: User;
    switch (userRole) {
      case 'BUYER':
        mockUser = MOCK_BUYER;
        break;
      case 'SELLER':
        mockUser = MOCK_SELLER;
        break;
      case 'ADMIN':
        mockUser = MOCK_ADMIN;
        break;
      default:
        mockUser = MOCK_BUYER;
    }
    
    setUser(mockUser);
    setToken('mock-token-123');
    localStorage.setItem('accessToken', 'mock-token-123');
    localStorage.setItem('userRole', userRole);
    setIsLoading(false);
  };

  // ============================================
  // REGISTER
  // ============================================
  const register = async (data: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ Get role from data or default to BUYER
    const role = data.role as UserRole || 'BUYER';
    
    let mockUser: User;
    switch (role) {
      case 'BUYER':
        mockUser = MOCK_BUYER;
        break;
      case 'SELLER':
        mockUser = MOCK_SELLER;
        break;
      case 'ADMIN':
        mockUser = MOCK_ADMIN;
        break;
      default:
        mockUser = MOCK_BUYER;
    }
    
    setUser(mockUser);
    setToken('mock-token-123');
    localStorage.setItem('accessToken', 'mock-token-123');
    localStorage.setItem('userRole', role);
    setIsLoading(false);
  };

  // ============================================
  // LOGOUT
  // ============================================
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// ============================================
// HELPER: Get Role Display Name
// ============================================
export const getRoleDisplay = (role: UserRole): string => {
  switch (role) {
    case 'BUYER':
      return 'Buyer';
    case 'SELLER':
      return 'Seller';
    case 'ADMIN':
      return 'Admin';
    default:
      return '';
  }
};