from flask import Blueprint, request, jsonify
from supabase import create_client, Client
import os

data_sources_bp = Blueprint('data_sources', __name__)
origin = '/data-sources'

dataSources = [
  {
    "id": 1,
    "name": 'Data Source 1',
    "description": 'Description for data source 1',
    "connection": 'AWS',
  },
  {
    "id": 2,
    "name": 'Data Source 2',
    "description": 'Description for data source 2',
    "connection": 'Azure',
  },
  {
    "id": 3,
    "name": 'Data Source 3',
    "description": 'Description for data source 3',
    "connection": 'Azure',
  },
  {
    "id": 4,
    "name": 'Data Source 4',
    "description": 'Description for data source 4',
    "connection": 'Azure',
  },
];

@data_sources_bp.route(origin, methods=['GET'])
def get_data_sources():
    
    # data = supabase.table('data_sources').select('*').eq('user_id', user_id).execute()
    return jsonify({'dataSources': dataSources}), 200

@data_sources_bp.route(origin, methods=['POST'])
def post_data_sources():
    data = request.get_json()
    print(data)
    # add data to dataSources
    supabase: Client = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_SERVICE_ROLE_KEY"))
    supabase.table('data_sources').insert(data).execute()
    return jsonify({'dataSources': dataSources}), 200