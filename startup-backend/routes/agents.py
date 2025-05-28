import time
from flask import request, jsonify, Blueprint
from utils.middleware import requires_auth
import json
import os
import warnings
from controllers.agents.marketing_agent import marketing_agent
from controllers.agents.aggregator_agent import aggregator
from controllers.agents.dashboard_builder import parse_llm_dashboard_data, get_llm_response
warnings.filterwarnings('ignore')

agents_bp = Blueprint('agents', __name__)
origin = '/agents'

@agents_bp.route(origin, methods=['GET'])
@requires_auth
def get_agents():
    with open("routes/agents.txt", 'r') as f:
        agents = f.read()
        return jsonify({'agents': agents}), 200
    return jsonify({'message': 'Hello, World!'}), 200

@agents_bp.route(origin, methods=['POST'])
@requires_auth
def post_agents():
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({'error': 'Missing prompt'}), 400
    with open("routes/agents.txt", 'r') as f:
        code = f.read()
        return jsonify({'code': str(data['prompt']) + '\n' + code}), 200
    return jsonify({'message': 'Hello, World!'}), 200

@agents_bp.route(origin + '/marketing', methods=['POST'])
def post_marketing_agent():
    data = request.get_json()
    
    if 'user_response' not in data or 'history' not in data:
        return jsonify({'error': 'Missing info'}), 400
    
    agent_response = 'Here is the dashboard you requested in a beautiful format. Please let me know if you need anything else.'
    data['history'].append({"role": "user", "content": data['user_response']})
    data['history'].append({"role": "assistant", "content": agent_response})
    
    response_data = {
        'history': data['history'], 
        'agent_response': "Here is your data table" if 'table' not in data['user_response'].lower() else agent_response
    }
    
    response_data = marketing_agent(data, response_data)
    print('response_data', json.dumps(response_data, indent=4))
    
    time.sleep(3) # simulate server response time
    
    return jsonify(response_data), 200

@agents_bp.route(origin + '/report-generation', methods=['POST'])
def post_report_generation():
    data = request.get_json()
    print('data', data)
    return jsonify({'message': 'Report generation successful'}), 200

@agents_bp.route(origin + '/aggregator', methods=['POST'])
def post_aggregator():
    data = request.get_json()
    response = aggregator(data)
    print('response', response)
    return jsonify(response), 200

@agents_bp.route(origin + '/test', methods=['POST'])
async def post_test():
    # Example usage:
    data = request.get_json()

    json_text = """<JSONOutput>
{
    "dashboardTitle": "Marketing Dashboard",
    "dashboardDescription": "This dashboard provides insights into marketing trends, campaign performance, and customer behavior.",
    "data": [
        {
            "chartName": "Bar Chart",
            "sqlQuery": "SELECT c.target_audience AS category, SUM(c.budget) AS value1name, COUNT(cv.conversion_id) AS value2name, SUM(cv.revenue) AS value3name FROM campaigns c LEFT JOIN conversions cv ON c.campaign_id = cv.campaign_id GROUP BY c.target_audience ORDER BY SUM(c.budget) DESC LIMIT 5;"
        },
        {
            "chartName": "Line Chart",
            "sqlQuery": "SELECT DATE_FORMAT(cv.conversion_date, '%Y-%m') AS date, COUNT(cv.conversion_id) AS total_conversions, (COUNT(cv.conversion_id) / (SELECT COUNT(*) FROM customers)) * 100 AS conversion_rate FROM conversions cv GROUP BY DATE_FORMAT(cv.conversion_date, '%Y-%m') ORDER BY date ASC LIMIT 5;"
        },
        {
            "chartName": "Pie Chart",
            "sqlQuery": "SELECT w.traffic_source AS category, COUNT(w.session_id) AS value FROM website_analytics w GROUP BY w.traffic_source ORDER BY COUNT(w.session_id) DESC LIMIT 10;"
        },
        {
            "chartName": "Radar Chart",
            "sqlQuery": "SELECT sm.traffic_source AS category, COUNT(sm.session_id) AS value1name, SUM(sm.session_duration) AS value2name, AVG(sm.bounce_rate) AS value3name, COUNT(DISTINCT sm.customer_id) AS value4name FROM social_media_analytics sm GROUP BY sm.traffic_source ORDER BY COUNT(sm.session_id) DESC LIMIT 5;"
        },
        {
            "chartName": "Bar Chart",
            "sqlQuery": "SELECT c.campaign_name AS category, COUNT(DISTINCT cv.customer_id) AS value1name, SUM(cv.revenue) AS value2name, COUNT(cv.conversion_id) AS value3name FROM campaigns c LEFT JOIN conversions cv ON c.campaign_id = cv.campaign_id GROUP BY c.campaign_name ORDER BY COUNT(DISTINCT cv.customer_id) DESC LIMIT 5;"
        }
    ]
    }
    </JSONOutput>"""
    #result = parse_dashboard(input_text)
    llm_response = await get_llm_response(data['user_response'])
    result = parse_llm_dashboard_data(llm_response)
    print(json.dumps(result, indent=2))
    return jsonify(result), 200