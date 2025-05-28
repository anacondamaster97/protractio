pipeline = '''
import psycopg2
from pymongo import MongoClient
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def transfer_conversions_table(cursor, collection, table_name="conversions", batch_size=1000):
    """
    Transfer data from the 'conversions' PostgreSQL table to a MongoDB collection.

    Args:
        cursor: psycopg2 cursor object
        collection: pymongo collection object
        table_name (str): Name of the table (default: 'conversions')
        batch_size (int): Number of rows to fetch and insert per batch
    """
    # Fetch all data from the conversions table
    query = f"SELECT customer_id, campaign_id, conversion_type, conversion_date, revenue FROM {table_name}"
    cursor.execute(query)
    columns = [desc[0] for desc in cursor.description]

    # Transfer data in batches
    total_rows = 0
    while True:
        rows = cursor.fetchmany(batch_size)
        if not rows:
            break

        documents = []
        for row in rows:
            doc = dict(zip(columns, row))
            # Convert data types as needed for MongoDB
            doc["conversion_date"] = str(doc["conversion_date"])  # Convert date to string
            doc["revenue"] = float(doc["revenue"])  # Ensure revenue is a float
            documents.append(doc)

        collection.insert_many(documents)
        total_rows += len(documents)
        logger.info(f"Inserted {len(documents)} documents into {collection.name}")

    logger.info(f"Total rows transferred for {table_name}: {total_rows}")

def main():
    """
    Main function to transfer the 'conversions' table from PostgreSQL to MongoDB.
    """
    # Get connection parameters from environment variables
    pg_conn_str = (
        f"host={os.environ['PG_HOST']} "
        f"port={os.environ['PG_PORT']} "
        f"dbname={os.environ['PG_DB']} "
        f"user={os.environ['PG_USER']} "
        f"password={os.environ['PG_PASSWORD']}"
    )
    mongo_uri = os.environ['MONGO_URI']

    # Connect to PostgreSQL
    try:
        pg_conn = psycopg2.connect(pg_conn_str)
        cursor = pg_conn.cursor()
        logger.info("Connected to PostgreSQL")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
        return

    # Connect to MongoDB
    try:
        mongo_client = MongoClient(mongo_uri)
        db = mongo_client.get_database()  # Uses database specified in MONGO_URI
        logger.info("Connected to MongoDB")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        cursor.close()
        pg_conn.close()
        return

    # Define the collection for conversions
    collection = db["conversions"]

    # Delete existing documents in the collection
    try:
        collection.delete_many({})
        logger.info(f"Deleted existing documents in collection {collection.name}")
    except Exception as e:
        logger.error(f"Failed to delete documents from {collection.name}: {e}")
        cursor.close()
        pg_conn.close()
        mongo_client.close()
        return

    # Transfer the conversions table
    try:
        transfer_conversions_table(cursor, collection)
    except Exception as e:
        logger.error(f"Failed to transfer conversions table: {e}")

    # Close connections
    cursor.close()
    pg_conn.close()
    mongo_client.close()
    logger.info("Data transfer completed")

if __name__ == "__main__":
    main()
'''
new_files = [{'name': 'Pipeline', 'type': 'folder', 'path': '/Pipeline', 'children': [{'name': 'main.py', 'type': 'file', 'path': '/Pipeline/main.py', 'content': pipeline}, {'name': 'helpers.py', 'type': 'file', 'path': '/Pipeline/helpers.py', 'content': '# Helper functions'}]}]

file = {
    "name": "src",
    "type": "folder",
    "path": "/src",
    "children": [
      {
        "name": 'pipelines',
        "type": 'folder',
        "path": '/src/pipelines',
        "children": [
          {
            "name": 'main.py',
            "type": 'file',
            "path": '/src/pipelines/main.py',
            "content": pipeline
          },
          
        ]
      },
      {
        "name": 'utils',
        "type": 'folder',
        "path": '/src/utils',
        "children": [
          {
            "name": 'helpers.py',
            "type": 'file',
            "path": '/src/utils/helpers.py',
            "content": '# Helper functions'
          }
        ]
      }
    ]
  }

def flatten_files(file_structure):
    flat_files = []
    
    def traverse(node):
        if node['type'] == 'file':
            flat_files.append({
                'filepath': node['path'],
                'content': node['content']
            })
        elif node['type'] == 'folder' and 'children' in node:
            for child in node['children']:
                traverse(child)
    
    traverse(file_structure)
    return flat_files

def rebuild_tree(flat_files):
    def create_folder_structure(path):
        return {
            "name": path.split('/')[-1],
            "type": "folder",
            "path": path,
            "children": []
        }
    
    root = create_folder_structure("/src")
    
    for file in flat_files:
        path_parts = file['filepath'].split('/')[2:]  # Skip /src/
        current = root
        
        # Create folders
        for i, part in enumerate(path_parts[:-1]):
            folder_path = "/src/" + "/".join(path_parts[:i+1])
            existing = next((c for c in current['children'] if c['path'] == folder_path), None)
            
            if not existing:
                new_folder = create_folder_structure(folder_path)
                current['children'].append(new_folder)
                current = new_folder
            else:
                current = existing
        
        # Add file
        current['children'].append({
            "name": path_parts[-1],
            "type": "file",
            "path": file['filepath'],
            "content": file['content']
        })
    
    return root

def update_file_content(files, fileRefs, new_content):
    def traverse(node):
        if node['type'] == 'file' and node['path'] in fileRefs:
            node['content'] = new_content
            return True
        elif node['type'] == 'folder' and 'children' in node:
            for child in node['children']:
                if traverse(child):
                    return True
        return False
    
    traverse(files)
    return files

def file_change(files, fileRefs, new_content):
    print(files)
    return new_files