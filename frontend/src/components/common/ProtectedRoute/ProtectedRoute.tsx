// src/components/common/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('🔍 RoleBasedRoute Check:');
  console.log('   isLoading:', isLoading);
  console.log('   isAuthenticated:', isAuthenticated);
  console.log('   User:', user);
  console.log('   User Role:', user?.role);
  console.log('   Allowed Roles:', allowedRoles);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D5A27] mx-auto" />
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role?.toUpperCase();
  const hasAccess = allowedRoles.some((role) => role.toUpperCase() === userRole);
  const isAdmin = userRole === 'ADMIN';

  console.log(`   User Role (upper): ${userRole}`);
  console.log(`   Has Access: ${hasAccess}`);
  console.log(`   Is Admin: ${isAdmin}`);

  // ✅ Allow access if user has allowed role OR is ADMIN
  if (hasAccess || isAdmin) {
    console.log(`✅ Access granted for role: ${userRole}`);
    return <>{children}</>;
  }

  console.log(`❌ Access denied. Role: ${userRole}, Required: ${allowedRoles.join(' or ')}`);
  return <Navigate to="/dashboard" replace />;
};

export default RoleBasedRoute;