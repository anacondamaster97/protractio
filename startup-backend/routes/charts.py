from flask import Blueprint, jsonify, request
from controllers.charts.build_chart import build_chart

charts_bp = Blueprint('charts', __name__)
origin = '/charts'

@charts_bp.route(origin + '/create-chart', methods=['POST'])
def create_chart():
    data = request.get_json()
    if not 'graphType' in data or not 'dataDescription' in data:
        return jsonify({'error': 'Missing graphType or dataDescription'}), 400

    chart = build_chart(data['graphType'], data['dataDescription'])
    if not chart: return jsonify({'error': 'Failed to create chart'}), 500
    return jsonify({'message': 'Chart created', 'chart': chart}), 200