from flask import Blueprint, request, jsonify
from controllers.agents.dashboard_builder import get_llm_response, parse_llm_dashboard_data
from utils.middleware import requires_auth
from controllers.agents.marketing_agent import marketing_agent
import json
import time

marketing_agent_bp = Blueprint('marketing_agent', __name__)
origin = '/marketing'

@marketing_agent_bp.route(origin + '/real/agent', methods=['POST'])
def post_real_marketing_agent():
    data = request.get_json()
    llm_response = get_llm_response(data['user_response'])
    print(llm_response)
    print('--------------------------------')
    result = parse_llm_dashboard_data(llm_response)
    print(json.dumps(result, indent=2))
    return jsonify(result), 200

@marketing_agent_bp.route(origin + '/agent', methods=['POST'])
def post_marketing_agent():
    data = request.get_json()
    
    if 'user_response' not in data or 'history' not in data:
        return jsonify({'error': 'Missing info'}), 400
    
    agent_response = 'Here is the data you requested in a beautiful format. Please let me know if you need anything else.'
    data['history'].append({"role": "user", "content": data['user_response']})
    data['history'].append({"role": "assistant", "content": agent_response})
    
    response_data = {
        'history': data['history'], 
        'agent_response': agent_response
    }

    
    response_data = marketing_agent(data, response_data)
    #print('response_data', response_data)
    
    time.sleep(3) # simulate server response time
    
    return jsonify(response_data), 200
