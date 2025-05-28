import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FaGoogle } from "react-icons/fa"
import { useEffect, useState } from "react"
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js'; // Import User type
import { useNavigate } from 'react-router';
import { Loading } from "../components/loading";

const SignUpPage = () => {
  const [user, setUser] = useState<User | null>(null); // Update state type
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
      // Check for existing session
    const fetchUser = async () => {
      const session = await supabase.auth.getSession();
      setUser(session.data?.session?.user || null); // Correctly handle both User and null
      
      if (session.data?.session?.user){
        navigate('/');
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // Redirect URL
      },
    });
    if (error) console.error('Login error:', error.message);
  };

  if (loading){
    <Loading />
  }

  const SignUpForm = () => {
    return (
      <div className={cn("flex flex-col gap-8 bg-gradient-to-br from-green-100 to-blue-300 border-[1px] border-black px-8 py-16 rounded-xl")}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-sm text-zinc-500 dark:text-zinc-400">
          Sign up to get started
        </p>
      </div>
      <div className="grid gap-6">
        
        <Button onClick={handleSignUp} variant="outline" className="w-full">
          <FaGoogle />
          Sign Up with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/signin" className="underline underline-offset-4">
          Sign In
        </a>
      </div>
    </div>
    )
  }

  return (
    <div>
    {!loading && <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <img src="/logo.png" className="size-4" />
            </div>
            Protractio.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://5vo2pguut9.ufs.sh/f/IzAdECdWv58duPbV3lZ0QAI12mY3hXRBJOEkaVNgW6FoynDL"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>}
    </div>
  )
};

export default SignUpPage;