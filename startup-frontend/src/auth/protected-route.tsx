import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { supabase } from '../supabaseClient';
import LoadingBox from '@/styled-components/box-loading';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(!!data.session); // Check if a session exists
      }
    };

    checkSession();
  }, []);

  // Show a loading state while checking authentication
  if (isAuthenticated === null) {
    return <LoadingBox />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace/>;
};

export default ProtectedRoute;
