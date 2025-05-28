# aws_config.py
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError

def get_dynamodb_client():
    """
    Initialize and return a DynamoDB client using AWS credentials.
    """
    try:
        # Initialize DynamoDB client
        dynamodb = boto3.resource(
            'dynamodb',
            region_name='us-west-1'  # Replace with your AWS region
        )
        return dynamodb
    except (NoCredentialsError, PartialCredentialsError) as e:
        print("AWS credentials not found or incomplete. Please configure your credentials.")
        raise e
    except Exception as e:
        print(f"An error occurred while initializing DynamoDB client: {e}")
        raise e