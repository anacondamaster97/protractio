import os
import json
import psycopg2

# RDS Database Connection Info
DB_HOST = "database-1.c2zqqs6oyp6j.us-east-1.rds.amazonaws.com"
DB_NAME = "databasemock"
DB_USER = "postgres"
DB_PASSWORD = "MockDb!012"
DB_PORT = "5432"  # Default PostgreSQL port

# Connect to PostgreSQL


# Directory containing JSON files
json_directory = "./seed_data"

def create_table_from_json(file_path, table_name):
    """Reads a JSON file and creates a PostgreSQL table dynamically."""
    conn = psycopg2.connect(
        host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD, port=DB_PORT
    )
    print("Connected to database")
    cursor = conn.cursor()
    with open(file_path, "r") as f:
        data = json.load(f)

    if not data:
        print(f"Skipping empty file: {file_path}")
        return

    # Extract column names & types from first row
    columns = {key: "TEXT" for key in data[0].keys()}  # Default to TEXT, modify if needed

    # Create table SQL statement
    columns_sql = ", ".join([f'"{col}" {dtype}' for col, dtype in columns.items()])
    create_table_sql = f'CREATE TABLE IF NOT EXISTS "{table_name}" ({columns_sql});'

    cursor.execute(create_table_sql)
    conn.commit()
    print(f"Created table: {table_name}")

    # Insert data
    for row in data:
        keys = ", ".join([f'"{k}"' for k in row.keys()])
        values = ", ".join(["%s"] * len(row))
        insert_sql = f'INSERT INTO "{table_name}" ({keys}) VALUES ({values});'
        cursor.execute(insert_sql, tuple(row.values()))

    conn.commit()
    print(f"Inserted {len(data)} rows into {table_name}")
    cursor.close()
    conn.close()

# Process all JSON files in the directory
for filename in os.listdir(json_directory):
    if filename.endswith(".json"):
        file_path = os.path.join(json_directory, filename)
        if filename == "campaign_aggregates.json": continue
        if filename == "website_analytics_aggregates.json": continue
        table_name = os.path.splitext(filename)[0]  # Use filename as table name
        create_table_from_json(file_path, table_name)

# Close connection

print("All tables created and data inserted successfully!")
