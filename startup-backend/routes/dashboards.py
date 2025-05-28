
from flask import request, jsonify, Blueprint
from utils.middleware import requires_auth, supabase
import os
from supabase_interactions.add_project_id import add_project_id
from aws_interactions.aws_create_dashboard import create_dashboard
from controllers.dashboards.publish_dashboard import publish_dashboard
from controllers.dashboards.get_dashboards import get_all_dashboards
import uuid
import time


dashboards_bp = Blueprint('dashboards', __name__)
origin = '/dashboards'

published_dashboards = {'title': 'Marketing Dashboard', 'dashboardData': [{'data': [{'budget': 188885.88, 'category': 'Senior Citizens', 'revenue': 249960}, {'budget': 106988.13, 'category': 'Students', 'revenue': 184795.15}, {'budget': 163428.85, 'category': 'Tech Enthusiasts', 'revenue': 241812.1}, {'budget': 134953.91999999998, 'category': 'Young Professionals', 'revenue': 147651.28}, {'budget': 108775.73000000001, 'category': 'Parents', 'revenue': 112824.23}, {'budget': 173195.16999999998, 'category': 'Small Business Owners', 'revenue': 195510.51}], 'graphType': 'radarchart', 'id': '8562dd6f-f98e-419f-a7da-aa9c7bdafb0c', 'sql_query': '\nSELECT \n    conversion_type AS category,\n    COUNT(*) AS value\nFROM \n    conversions\nGROUP BY \n    conversion_type;\n                '}, {'data': [{'bounce_rate': 51.45, 'category': 'Direct', 'page_views': 4674, 'session_duration': 1734.38}, {'bounce_rate': 49.64, 'category': 'Social Media', 'page_views': 3773, 'session_duration': 1774.56}, {'bounce_rate': 47.55, 'category': 'Referral', 'page_views': 4278, 'session_duration': 1770.78}, {'bounce_rate': 53.36, 'category': 'Organic Search', 'page_views': 4456, 'session_duration': 1778.92}, {'bounce_rate': 53.22, 'category': 'Paid Search', 'page_views': 4072, 'session_duration': 1612.68}, {'bounce_rate': 47.5, 'category': 'Email', 'page_views': 4431, 'session_duration': 1812.99}], 'graphType': 'barchart', 'id': '7ff68bef-7b0a-41d0-a301-342b49125e62', 'sql_query': '\nSELECT \n    conversion_type AS category,\n    COUNT(*) AS value\nFROM \n    conversions\nGROUP BY \n    conversion_type;\n                '}], 'dashboard': [{'id': '1', 'layout': 'three-equal', 'components': [{'data': [{'budget': 188885.88, 'category': 'Senior Citizens', 'revenue': 249960}, {'budget': 106988.13, 'category': 'Students', 'revenue': 184795.15}, {'budget': 163428.85, 'category': 'Tech Enthusiasts', 'revenue': 241812.1}, {'budget': 134953.91999999998, 'category': 'Young Professionals', 'revenue': 147651.28}, {'budget': 108775.73000000001, 'category': 'Parents', 'revenue': 112824.23}, {'budget': 173195.16999999998, 'category': 'Small Business Owners', 'revenue': 195510.51}], 'graphType': 'radarchart', 'id': '8562dd6f-f98e-419f-a7da-aa9c7bdafb0c', 'sql_query': '\nSELECT \n    conversion_type AS category,\n    COUNT(*) AS value\nFROM \n    conversions\nGROUP BY \n    conversion_type;\n                '}, {'data': [{'bounce_rate': 51.45, 'category': 'Direct', 'page_views': 4674, 'session_duration': 1734.38}, {'bounce_rate': 49.64, 'category': 'Social Media', 'page_views': 3773, 'session_duration': 1774.56}, {'bounce_rate': 47.55, 'category': 'Referral', 'page_views': 4278, 'session_duration': 1770.78}, {'bounce_rate': 53.36, 'category': 'Organic Search', 'page_views': 4456, 'session_duration': 1778.92}, {'bounce_rate': 53.22, 'category': 'Paid Search', 'page_views': 4072, 'session_duration': 1612.68}, {'bounce_rate': 47.5, 'category': 'Email', 'page_views': 4431, 'session_duration': 1812.99}], 'graphType': 'barchart', 'id': '7ff68bef-7b0a-41d0-a301-342b49125e62', 'sql_query': '\nSELECT \n    conversion_type AS category,\n    COUNT(*) AS value\nFROM \n    conversions\nGROUP BY \n    conversion_type;\n                '}]}], 'userId': 'e6f48ae0-7226-41c2-8b68-9b031708e5ff', 'description': "This dashboard shows the marketing data for the user's business.", 'id': 'bf9b4681-4aab-4838-894c-89a23c585e8e'}

@dashboards_bp.route(origin, methods=['GET'])
def get_dashboards():
    dashboards = get_all_dashboards()
    return jsonify({'message': 'Dashboard returned', 'dashboards': dashboards}), 200

@dashboards_bp.route(origin, methods=['POST'])
def post_dashboards():
    data = request.get_json()
    if 'dashboardName' not in data or 'userId' not in data or 'dashboardData' not in data or 'description' not in data:
        return jsonify({'error': 'Missing dashboard_name'}), 400
    dashboardId = str(uuid.uuid4())
    print(dashboardId, data['userId'], data['dashboardName'], data['description'], data['dashboardData'])
    response = create_dashboard(dashboardId, data['userId'], data['dashboardName'], data['description'], data['dashboardData'])
    if response:
        return jsonify({'message': 'Dashboard created successfully', 'dashboardId': dashboardId}), 200
    else:
        return jsonify({'error': 'Failed to create dashboard'}), 500
    
@dashboards_bp.route(origin + '/<dashboardId>', methods=['GET'])
def get_dashboard(dashboardId):
    print(dashboardId)
    return jsonify({'message': 'Dashboard returned', 'id': dashboardId, 'publishedDashboard': published_dashboards}), 200

@dashboards_bp.route(origin + '/publish', methods=['POST'])
@requires_auth
def publish_dashboard_route():
  data = request.get_json()
  userId = data['userId'] #supabase.auth.get_user().user.id
  #userId = '123'
  if not 'title' in data: return jsonify({'error': 'Missing title'}), 400
  if not 'dashboardData' in data: return jsonify({'error': 'Missing dashboardData'}), 400
  if not 'dashboard' in data: return jsonify({'error': 'Missing dashboard'}), 400
  if not 'description' in data: return jsonify({'error': 'Missing description'}), 400

  dashboardId = 'bf9b4681-4aab-4838-894c-89a23c585e8e' # str(uuid.uuid4())
  response = publish_dashboard(dashboardId, data)
  if response:
      return jsonify({'message': 'Dashboard published', 'id': dashboardId}), 200
  else:
      return jsonify({'error': 'Failed to publish dashboard'}), 500
    

    
@dashboards_bp.route(origin + '/type/<dashboardType>', methods=['GET'])
@requires_auth
def get_dashboards_by_type(dashboardType):
  time.sleep(3)
  print(dashboardType)
  if dashboardType == 'marketing':
      return jsonify({'message': 'Dashboard returned', 'dashboardData': dashboardData, 'dashboardType': dashboardType}), 200
  else:
      return jsonify({'message': 'Dashboard returned', 'dashboardData': dashboardData, 'dashboardType': dashboardType}), 200
  

dashboardData = [
    {
      "title": "Sales Performance",
      "description": "Track key sales metrics and overall performance.",
      "createdAt": "2023-10-26",
      "status": "active",
      "type": "marketin",
    },
    {
      "title": "Marketing Campaign Analytics",
      "description": "Analyze marketing campaign effectiveness and ROI.",
      "createdAt": "2023-11-15",
      "status": "draft",
      "type": "marketing",
    },
    {
      "title": "User Engagement Dashboard",
      "description": "Monitor user activity, retention, and engagement.",
      "createdAt": "2023-12-05",
      "status": "archived",
      "type": "marketing",
    },
    {
      "title": "Financial Overview",
      "description": "High-level overview of financial health and KPIs.",
      "createdAt": "2024-01-10",
      "status": "active",
      "type": "marketing",
    },
    {
      "title": "Financial Overview",
      "description": "High-level overview of financial health and KPIs.",
      "createdAt": "2024-01-10",
      "status": "active",
      "type": "marketing",
    },
  ];