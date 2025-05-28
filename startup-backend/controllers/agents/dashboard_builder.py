import re
import json
import psycopg2
import os
from dotenv import load_dotenv
from groq import Groq

def build_dashboard(user_prompt):
    with open('prompts/structures_sql_query_prompt.txt', 'r') as file:
        prompt = file.read()
    
    pass

def get_sql_query(sql_query):
    # AWS RDS PostgreSQL credentials
    
    # RDS Database Connection Info
    DB_HOST = "database-1.c2zqqs6oyp6j.us-east-1.rds.amazonaws.com"
    DB_NAME = "databasemock"
    DB_USER = "postgres"
    DB_PASSWORD = "MockDb!012"
    DB_PORT = "5432"  # Default PostgreSQL port

    try:
        # Connect to the RDS database
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port=DB_PORT,
            # Additional recommended parameters for RDS
            sslmode='require',  # Enables SSL encryption
            connect_timeout=5   # Connection timeout in seconds
        )
        
        # Create a cursor
        cur = conn.cursor()
        
        # Execute the query
        cur.execute(sql_query)
        
        # Fetch all results
        results = cur.fetchall()
        
        # Close cursor and connection
        cur.close()
        conn.close()
        
        return results
    except Exception as e:
        print(f"Database error: {str(e)}")
        return []
    
def sql_test(sql_query):
    return [sql_query]

def parse_llm_dashboard_data(input_text):
    # Extract JSON data between <JSONOutput> tags
    json_match = re.search(r'<JSONOutput>(.*?)</JSONOutput>', input_text, re.DOTALL)
    summary_match = re.search(r"\*\*Summary\*\*(.*)", input_text, re.DOTALL)

    if not json_match:
        return {}
    
    try:
        # Parse the JSON string into a Python object
        json_str = json_match.group(1).strip()
        json_data = json.loads(json_str)
        if 'data' in json_data:
            json_data['data'] = build_dashboard_from_json(json_data['data'])
        if summary_match:
            json_data['summary'] = summary_match.group(1).strip()
        return json_data
    except json.JSONDecodeError:
        return {}

def build_dashboard_from_json(data):
    # Process each chart in the data array
    print(data)
    for chart in data:
        # Execute SQL query and add results to the chart data
        
        sql_results = get_sql_query(chart['PostgreSQLQuery'])
        chart['data'] = sql_results
    
    return data

def get_llm_response(user_prompt):
    # Load environment variables
    load_dotenv()
    api_key = os.getenv('GROQ_API_KEY')
    
    # Initialize Groq client
    client = Groq(api_key=api_key)
    prompt = ""
    # Load the prompt
    with open('prompts/sql_query_getter_prompt.txt', 'r') as file:
        prompt = file.read()
        prompt += user_prompt
    
    try:
        # Send request using Groq SDK
        completion = client.chat.completions.create(
            model="deepseek-r1-distill-llama-70b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.1
        )
        
        return completion.choices[0].message.content
            
    except Exception as e:
        print(f"Error calling Groq API: {str(e)}")
        return None