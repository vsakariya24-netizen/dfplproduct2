import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { session, loading } = useAuth();

  // 1. While checking if user is logged in, show a loading spinner
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-dark mb-2 mx-auto" size={32} />
          <p className="text-gray-500 font-medium">Verifying security...</p>
        </div>
      </div>
    );
  }

  // 2. If NOT logged in, redirect to Login page immediately
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  // 3. If logged in, allow access to the Admin pages (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;