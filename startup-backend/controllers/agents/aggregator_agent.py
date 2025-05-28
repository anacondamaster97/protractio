import os
import json

campaigns = [
    {"campaign_name": "Jarvis, Holt and Young Fall Campaign",
    "start_date": "2023-05-17",
    "end_date": "2023-10-16",
    "budget": "57860.99",
    "target_audience": "Senior Citizens",
    "channels": "Display Ads"}
]

conversions = [
    {"customer_id": 17,
    "campaign_id": 5,
    "conversion_type": "Consultation",
    "conversion_date": "2024-03-09",
    "revenue": "3507.06"}
]

customers = [
    {"customer_id": 17,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "1234567890",
    "address": "123 Main St, Anytown, USA"}
]

social_media_analytics = [
    {"customer_id": 17,
    "session_id": "c52be9fc-b48a-441b-9590-c0791065736f",
    "date": "2024-05-07",
    "page_views": 23,
    "session_duration": 1920,
    "bounce_rate": 11.96,
    "traffic_source": "Direct"}
]

website_analytics = [
    {"customer_id": 17,
    "session_id": "c52be9fc-b48a-441b-9590-c0791065736f",
    "date": "2024-05-07",
    "page_views": 23,
    "session_duration": 1920,
    "bounce_rate": 11.96,
    "traffic_source": "Direct"}
]

def aggregator(data):
    types = ["website_analytics", "social_media_analytics", "conversions", "campaigns", "customers"]
    tables = {}
    for index, elems in enumerate([website_analytics, social_media_analytics, conversions, campaigns, customers]):
        tables[types[index]] = list(elems[0].keys())
        print(types[index])
        print(tables[types[index]])
    try:
        file_path = f"controllers/data/seed_data/{types[0]}.json"
        if not os.path.exists(file_path):
            return None
            
        with open(file_path, 'r') as f:
            data = json.load(f)
            
        if not data:
            return None
            
        #headers = list(data[0].keys())
        #entries = [list(entry.values()) for entry in data[:5]]  # Convert each entry to array of values
            
        """ return {
            "entries": entries,
            "header": headers
        } """
        return tables
    except Exception as e:
        print(f"Error reading {data} data: {str(e)}")
        return None
    
def get_tables():
    types = ["website_analytics", "social_media_analytics", "conversions", "campaigns", "customers"]
    