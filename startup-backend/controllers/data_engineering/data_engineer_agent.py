import re
from groq import Groq
from flask import jsonify
from dotenv import load_dotenv
import os

system_prompt = """
    You are a data engineering expert. Your task is to provide code solutions for data pipeline and data transfer tasks.
    The type of data base is PostgreSQL. 
    You need to use this information to authenticate to the database, use the following credentials and I will fill them in later:
    DB_NAME = "your_database_name"
    DB_USER = "your_master_username"
    DB_PASSWORD = "your_master_password"
    DB_HOST = "your-rds-endpoint"
    DB_PORT = "5432"
    IMPORTANT: Place ALL code inside a code block using the following format:
    <code>
    # Your code here
    </code>
    
    Your solution should include:
    - Proper imports and dependencies
    - Clear code comments explaining the logic
    - Error handling
    - Logging where appropriate
    - Best practices for data engineering
    
    Provide only working, production-ready code within the code blocks.
    And write a description of the code in the end after the code block.
    """
def llm_response_getter(user_prompt, db_info):
    load_dotenv()
    groq_api_key = os.getenv('GROQ_API_KEY')
    try:
        # Initialize Groq client
        client = Groq(api_key=groq_api_key) 
        
        # Call Groq API
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.7,
        )
        
        response = chat_completion.choices[0].message.content
        
        # Extract all code blocks from between ```python tags
        code_pattern = r'```python(.*?)```'
        code_blocks = re.findall(code_pattern, response, re.DOTALL)
        
        # Replace database credentials in each code block
        processed_blocks = []
        for block in code_blocks:
            # Replace the database credentials if they exist in the block
            block = block.replace(
                'DB_NAME = "your_database_name"', f'DB_NAME = "{db_info["DB_NAME"]}"'
            ).replace(
                'DB_USER = "your_master_username"', f'DB_USER = "{db_info["DB_USER"]}"'
            ).replace(
                'DB_PASSWORD = "your_master_password"', f'DB_PASSWORD = "{db_info["DB_PASSWORD"]}"'
            ).replace(
                'DB_HOST = "your-rds-endpoint"', f'DB_HOST = "{db_info["DB_HOST"]}"'
            ).replace(
                'DB_PORT = "5432"', f'DB_PORT = "{db_info["DB_PORT"]}"'
            )
            processed_blocks.append(block.strip())
            print(processed_blocks)
            print("\n\n\n--------------------------------\n\n\n")
            print(code_blocks)
            
            # Combine all code blocks with double newlines between them
            combined_code_blocks = '\n\n'.join(processed_blocks)
            
            # Return combined code blocks and full response
            return jsonify({
                'code_blocks': combined_code_blocks,
                'full_response': response
            }), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

def data_engineer_agent(data):
    db_info = {"DB_NAME" : "name",
    "DB_USER" : "username",
    "DB_PASSWORD" : "password",
    "DB_HOST" : "host",
    "DB_PORT" : "port"}
    
    if 'user_prompt' not in data:
        return {'error': 'Missing user_prompt in request'}
    
    return llm_response_getter(data['user_prompt'], db_info)
    