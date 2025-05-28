# create_project.py
from aws_interactions.aws_config import get_dynamodb_client
from datetime import datetime
from flask import jsonify

def create_dashboard(dashboardId, userId, dashboardName, description, dashboardData):
    """
    Create a new dashboard item in the DynamoDB table.
    Returns a tuple of (success: bool, message: str)
    """
    try:
        # Initialize DynamoDB resource
        dynamodb = get_dynamodb_client()
        
        # Get the table
        table = dynamodb.Table('Dashboards')
        
        # Verify table exists by accessing its metadata
        try:
            table.table_status
            print(f"Connected to table: {table.name}, Status: {table.table_status}")
        except Exception as e:
            print(f"Error accessing table: {str(e)}")
            return False, "Failed to access DynamoDB table"

        # Add timestamp using UTC
        now = datetime.utcnow().isoformat()

        # Create the item
        item = {
            'dashboardId': dashboardId,
            'userId': userId,
            'dashboardName': dashboardName,
            'description': description,
            'dashboardData': dashboardData,
            'createdAt': now,
            'updatedAt': now
        }

        print(f"Attempting to insert item: {item}")  # Debug log

        # Insert item into DynamoDB
        response = table.put_item(Item=item)
        
        print(f"DynamoDB response: {response}")  # Debug log
        
        # Check if the operation was successful
        if response['ResponseMetadata']['HTTPStatusCode'] == 200:
            print(f"Successfully created dashboard: {dashboardId}")  # Debug log
            return True, f"Dashboard '{dashboardName}' created successfully with ID: {dashboardId}"
        else:
            print(f"Unexpected response: {response}")  # Debug log
            return False, "Failed to create dashboard: Unexpected response from DynamoDB"

    except Exception as e:
        error_message = f"Failed to create dashboard: {str(e)}"
        print(error_message)
        return False, error_message
