import time
import re
from flask import request, jsonify, Blueprint
from utils.middleware import requires_auth
from groq import Groq
import os
from dotenv import load_dotenv
from controllers.data_engineering.data_engineer_agent import data_engineer_agent
from controllers.pipeline_builder.file_tree import update_file_content, file_change

data_engineering_bp = Blueprint('data-engineering', __name__)
origin = '/data-engineering'

load_dotenv()
groq_api_key = os.getenv('GROQ_API_KEY')

@data_engineering_bp.route(origin + '/agent', methods=['POST'])
def get_data_engineering():
    data = request.get_json()

    # return data_engineer_agent(data)
    return jsonify({'code_blocks': 'Code block recorded successfully'}), 200
@data_engineering_bp.route(origin + '/agent/submit', methods=['POST'])
def submit_data_engineering():
    data = request.get_json()
    if 'id' not in data: return jsonify({'error': 'Missing id in request'}), 400
    if 'code' not in data: return jsonify({'error': 'Missing code in request'}), 400

    return jsonify({'message': 'Code block recorded successfully'}), 200


@data_engineering_bp.route(origin + '/agent/chat', methods=['POST'])
def chat_data_engineering():
    data = request.get_json()
    user_response = data['content']
    history = data['messages']
    #print(data['fileRefs'])
    updated_files = file_change(data['files'], data['fileRefs'], user_response)
    return jsonify({"updatedFiles": updated_files, "content": "Here is the updated file structure:"}), 200

@data_engineering_bp.route(origin + '/agent/chat/submit', methods=['POST'])
def chat_data_engineering_submit():
    data = request.get_json()
    print(data['files'])
    return jsonify("success"), 200