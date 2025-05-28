from flask import request, jsonify, Blueprint
from utils.middleware import requires_auth, supabase
import os
from supabase import create_client, Client
from utils.get_user import get_user
login_bp = Blueprint('login', __name__)
origin = '/login'
import uuid
import datetime

@login_bp.route(origin, methods=['POST'])
@requires_auth 
def login():
    try:
        # Access user information from request.user (set by the decorator)
        data = request.get_json()
        print(data)
        user_id = data['user_id']
        email = data['email']
        name = data['name']
        auth_token = request.headers.get('Authorization').split(' ')[1]
        print(user_id, email, name, auth_token)

        supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))
        return jsonify({
        "dataSources": [
            {
                "id": str(uuid.uuid4()),
                "name": "Snowflake Data Warehouse",
                "description": "Enterprise data warehouse hosted on Snowflake",
                "connection": "snowflake://account/warehouse/db"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "AWS S3",
                "description": "Analytics data stored in AWS S3",
                "connection": "s3://analytics-bucket/data"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "AWS RDS - PostgreSQL",
                "description": "Relational database hosted on AWS RDS",
                "connection": "postgres://user:password@rds-instance.amazonaws.com:5432/db"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "MongoDB Atlas",
                "description": "NoSQL database hosted on MongoDB Atlas",
                "connection": "mongodb+srv://user:password@cluster.mongodb.net/db"
            }
        ],
        "dashboards": [
            {
                "id": str(uuid.uuid4()),
                "name": "Sales Performance",
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "status": "active"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Marketing Analytics",
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "status": "inactive"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Operational Metrics",
                "createdAt": datetime.datetime.utcnow().isoformat(),
                "status": "active"
            }
        ]
        })
        # Check if the user exists in your database
        data = supabase.table('users').select('*').eq('email', email).execute()
        
        if len(data.data) == 0:
            # Create a new user in your database
            new_user = {
                'id': user_id,
                'email': email,
                'full_name': name,
                
            }
            supabase.table('users').insert(new_user).execute()
            return jsonify({'message': 'User created successfully!', 'user_id': user_id})

        return jsonify({'message': 'Login successful!', 'user_id': user_id})
    except Exception as e:
        print("Error: " + str(e))
        return jsonify({'error': str(e)}), 500
