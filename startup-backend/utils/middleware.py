# utils.py
from functools import wraps
from flask import request, jsonify
from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(url, key)

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({'error': 'Authorization header is missing'}), 401

        try:
            # Extract the token
            token = auth_header.split(" ")[1]
            
            # Verify the token using Supabase's get_user method
            user_response = supabase.auth.get_user(token)

            if not user_response.user:
                print("user not found")
                return jsonify({'error': 'Invalid token'}), 401


        except Exception as e:
            print("exception", e)
            return jsonify({'error': 'Error decoding token', 'message': str(e)}), 401
        return f(*args, **kwargs)

    return decorated