import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js'; // Import User type
import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export const handleLogout = async () => {
    const [user, setUser] = useState<User | null>(null); // Update state type
    const navigate = useNavigate();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error.message);
    } else {
      setUser(null); // Reset user state to null
      navigate('/'); // Redirect to home or another page after logout
    }
};

export const LogOutButton = () => {
    const [user, setUser] = useState<User | null>(null); // Update state type
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing session
        const fetchUser = async () => {
        const session = await supabase.auth.getSession();
        setUser(session.data?.session?.user || null); // Correctly handle both User and null
        };

        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error.message);
        } else {
          setUser(null); // Reset user state to null
          navigate('/'); // Redirect to home or another page after logout
        }
    };

    if (user) {
        return (
            <Button
                onClick={handleLogout}
                variant="destructive"
            >
                Logout
            </Button>
        );
    }
    return null;
}