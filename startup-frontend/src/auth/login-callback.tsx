import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [authComplete, setAuthComplete] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Supabase auth event: ${event}`);

      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user);
        setAuthComplete(true);
        navigate('/app/home/dashboard');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed:', session);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        // If you want to redirect on sign out
        // navigate('/login');
      } else if (event === "INITIAL_SESSION" && session) {
        setAuthComplete(true);
        navigate("/app/home/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!authComplete) {
    return <div>Processing authentication...</div>;
  }

  return <div>Authentication Complete</div>;
};

export default AuthCallback;