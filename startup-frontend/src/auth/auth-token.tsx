import { supabase } from "@/supabaseClient";

const AuthToken = async ({setError, setIsLoading}: {setError: (error: string) => void, setIsLoading: (loading: boolean) => void}) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        setError('No active session found');
        setIsLoading(false);
        return null;
    }
    return session.access_token;
};

export default AuthToken;