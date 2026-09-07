import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isAuthInitialized, currentUser, currentRole } = useApp();
  const location = useLocation();

  // Wait for session restoration on startup
  if (!isAuthInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-blood-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login screen
  if (!isAuthenticated || !currentUser) {
    const isAdminPath = location.pathname.startsWith('/admin');
    return <Navigate to={isAdminPath ? '/admin-login' : '/login'} state={{ from: location }} replace />;
  }

  // Account approval & status check
  if (currentUser.role !== 'admin') {
    if (currentUser.accountStatus === 'pending') {
      return <Navigate to="/account-pending" replace />;
    }
    if (currentUser.accountStatus === 'suspended' || currentUser.accountStatus === 'rejected') {
      return <Navigate to="/account-status" replace />;
    }
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // If admin is logged in but tries to go to donor dashboard or vice versa
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  return <>{children}</>;
};
