from supabase import create_client, Client
import os
def get_user(auth_header):
    supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))
    token = auth_header.split(" ")[1]
    return supabase.auth.get_user(token)