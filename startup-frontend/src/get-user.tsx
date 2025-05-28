// src/utils/auth.ts 

import { supabase } from './supabaseClient'; // Assuming your supabaseClient is in this location

export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching user session:', error.message);
      return null; 
    }

    if (data.session) {
      const user = data.session.user; 
      const name = user.user_metadata.name;
      const email = user.email;
      console.log(name, email);
      localStorage.setItem('userData', JSON.stringify({user:{name, email, avatar: '/avatars/shadcn.jpg'}}));
      return {name, email, avatar: '/avatars/shadcn.jpg'};

    }
    /* {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      } */

    return null; 
  } catch (error) {
    console.error('Unexpected error fetching user:', error);
    return null;
  }
};