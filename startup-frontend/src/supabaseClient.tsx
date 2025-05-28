import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const getAccessToken = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
  
    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }
  
    if (session) {
      return session.access_token;
    } else {
      console.warn("No active session found.");
      return null;
    }
};