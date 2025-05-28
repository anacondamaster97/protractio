import json
import os
import uuid

def marketing_agent(data, response_data):
    print('user_response', data['user_response'])
    if 'table' in data['user_response'].lower():
        for elems in ["website_analytics", "social_media_analytics", "conversions", "campaigns", "customers"]:
            #print(elems)
            try:
                if data['user_response'].lower().index(elems) != -1:
                    if 'table' not in response_data:
                        response_data['table'] = [get_marketing_data(elems)]
                    else:
                        response_data['table'].append(get_marketing_data(elems))
            except:
                pass
    if 'graph' in data['user_response'].lower() or 'chart' in data['user_response'].lower():
        dashboard = []
        for elems in ['campaigns', 'website_analytics']:
            try:
                if elems in data['user_response'].lower():
                    response_data['graph'] = get_aggregate_data(elems)
                    dashboard.append(get_aggregate_data(elems))
            except:
                pass
        if len(dashboard) > 1:
            response_data['dashboard'] = {'data':dashboard}
    if 'dashboard' in response_data:
        response_data['dashboard']['title'] = "Marketing Dashboard"
        response_data['dashboard']['description'] = "This dashboard shows the marketing data for the user's business."
        print('response_data', json.dumps(response_data['dashboard'], indent=4))
    return response_data

def get_marketing_data(data_type):
    try:
        file_path = f"controllers/data/seed_data/{data_type}.json"
        if not os.path.exists(file_path):
            return None
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        if not data:
            return None
            
        headers = list(data[0].keys())
        entries = [list(entry.values()) for entry in data[:5]]  # Convert each entry to array of values
            
        return {
            "entries": entries,
            "header": headers
        }
    except Exception as e:
        print(f"Error reading {data_type} data: {str(e)}")
        return None
    
def get_aggregate_data(aggregate_type):
    """
    Get aggregate data from either campaigns or website analytics and format for charts
    
    Args:
        aggregate_type (str): Either 'campaigns' or 'website_analytics'
        
    Returns:
        dict: Formatted chart data with graphType and data array, or None if invalid
    """
    valid_types = {
        'campaigns': {
            'filename': 'campaign_aggregates.json',
            'graphType': 'radarchart'
        },
        'website_analytics': {
            'filename': 'website_analytics_aggregates.json',
            'graphType': 'barchart'
        }
    }
    
    try:
        if aggregate_type not in valid_types:
            return None
            
        file_path = f"controllers/data/seed_data/{valid_types[aggregate_type]['filename']}"
        print(file_path)
        if not os.path.exists(file_path):
            return None
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        return {
            "graphType": valid_types[aggregate_type]['graphType'],
            "data": data,
            "id": str(uuid.uuid4()),
            "sql_query": 
                """
SELECT 
    target_audience,
    SUM(CAST(budget AS NUMERIC)) as total_budget
FROM campaigns
GROUP BY target_audience
ORDER BY target_audience;
                """
        }
            
    except Exception as e:
        print(f"Error reading {aggregate_type} aggregate data: {str(e)}")
        return None
    