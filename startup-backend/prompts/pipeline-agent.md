# Data Pipeline Requirements Form

This form is designed to capture the necessary information for an LLM to generate code for a data pipeline. Please provide as much detail as possible in your answers.

## I. Data Source(s)

**(Repeat this section for each data source)**

1.  **Type of Source:**
    *   **Question:** What is the type of data source?
    *   **Example Options:** Database (SQL - MySQL, PostgreSQL, etc., or NoSQL - MongoDB, Cassandra, etc.), API (REST, GraphQL), CSV file, Excel file, Cloud Storage (AWS S3, Google Cloud Storage, Azure Blob Storage), Web scraping, Streaming source (Kafka, Kinesis)
    *   **Your Answer:** \[Enter your answer here]

2.  **Connection Details/Credentials:**
    *   **Question:** What are the necessary connection details?
    *   **Example Options:** hostname, port, username, password, database name, API endpoint, API key, authentication token, file path, bucket name, region
    *   **Your Answer:** \[Enter your answer here]

3.  **Data Location:**
    *   **Question:** Where is the specific data located within the source?
    *   **Example Options:** database table name, API resource path, specific columns in a file, folder/path in cloud storage
    *   **Your Answer:** \[Enter your answer here]

4.  **Data Format:**
    *   **Question:** What is the format of the data within the source?
    *   **Example Options:** structured table, JSON, XML, CSV, delimited text, fixed-width
    *   **Your Answer:** \[Enter your answer here]

5.  **Data Schema (if applicable):**
    *   **Question:** What is the schema of the data?
    *   **Example Options:** column names, data types, primary keys for databases; data structure and field types for JSON/XML
    *   **Your Answer:** \[Enter your answer here]

6.  **Data Volume (estimate):**
    *   **Question:** How much data is expected to be processed?
    *   **Example Options:** number of records, file size, data rate for streaming
    *   **Your Answer:** \[Enter your answer here]

7.  **Data Access Method:**
    *   **Question:** How should the data be accessed?
    *   **Example Options:** full extraction, incremental updates, specific queries/filters, pagination for APIs
    *   **Your Answer:** \[Enter your answer here]

8.  **Authentication and Authorization:**
    *   **Question:** What are the security requirements for accessing the data?
    *   **Example Options:** OAuth 2.0, API keys, specific user roles/permissions
    *   **Your Answer:** \[Enter your answer here]

9. **Data Encoding:**
   *   **Question:** What is the character encoding of the data?
   *   **Example Options:** UTF-8, Latin-1
   *   **Your Answer:** \[Enter your answer here]

---

## II. Data Transformation

1.  **Desired Format:**
    *   **Question:** What is the desired format for the transformed data?
    *   **Example Options:** JSON, CSV, Avro, Parquet, database table
    *   **Your Answer:** \[Enter your answer here]

2.  **Transformations:**
    *   **Question:** What specific transformations are required?
    *   **Example Options:** data cleaning (handling missing values, removing duplicates), data type conversions, data validation, filtering, aggregation (sum, average, count), joining data from multiple sources, data enrichment, anonymization/pseudonymization
    *   **Your Answer:** \[Enter your answer here]

3.  **Schema Mapping:**
    *   **Question:** How should the source schema map to the target schema?
    *   **Example Options:** renaming fields, splitting/combining fields, creating new calculated fields
    *   **Your Answer:** \[Enter your answer here]

4.  **Business Logic:**
    *   **Question:** Are there any specific business rules or logic that need to be applied during transformation? (Provide examples and clear instructions.)
    *   **Your Answer:** \[Enter your answer here]

5.  **Error Handling:**
    *   **Question:** How should errors during transformation be handled?
    *   **Example Options:** logging, skipping records, failing the pipeline
    *   **Your Answer:** \[Enter your answer here]

---

## III. Data Destination(s)

**(Repeat this section for each data destination)**

1.  **Type of Destination:**
    *   **Question:** What is the type of data destination?
    *   **Example Options:** Database, Data Warehouse, Cloud Storage, API, etc.
    *   **Your Answer:** \[Enter your answer here]

2.  **Connection Details/Credentials:**
    *   **Question:** What are the connection details for the destination?
    *   **Example Options:** hostname, port, username, password, database name, API endpoint, API key, file path, bucket name, region
    *   **Your Answer:** \[Enter your answer here]

3.  **Data Location:**
    *   **Question:** Where should the data be written within the destination?
    *   **Example Options:** table name, file path, bucket name
    *   **Your Answer:** \[Enter your answer here]

4.  **Loading Method:**
    *   **Question:** How should data be loaded into the destination?
    *   **Example Options:** append, overwrite, upsert (update or insert)
    *   **Your Answer:** \[Enter your answer here]

5.  **Data Schema (if applicable):**
    *   **Question:** What is the schema of the data destination?
    *   **Your Answer:** \[Enter your answer here]

---

## IV. Pipeline Orchestration and Execution

1.  **Programming Language:**
    *   **Question:** What programming language should be used for the pipeline?
    *   **Example Options:** Python, Java, Scala
    *   **Your Answer:** \[Enter your answer here]

2.  **Pipeline Framework/Tool:**
    *   **Question:** Are there any preferred frameworks or tools for building the pipeline?
    *   **Example Options:** Apache Airflow, Apache Beam, Apache Spark, AWS Glue, Azure Data Factory, custom scripts
    *   **Your Answer:** \[Enter your answer here]

3.  **Scheduling:**
    *   **Question:** How often should the pipeline run?
    *   **Example Options:** once, hourly, daily, weekly, on-demand
    *   **Your Answer:** \[Enter your answer here]

4.  **Error Handling and Monitoring:**
    *   **Question:** What kind of error handling and monitoring is required?
    *   **Example Options:** logging, alerting, retries, dead-letter queues
    *   **Your Answer:** \[Enter your answer here]

5.  **Deployment Environment:**
    *   **Question:** Where will the pipeline be deployed?
    *   **Example Options:** local machine, cloud environment (specify provider and service), on-premise server
    *   **Your Answer:** \[Enter your answer here]

6.  **Dependencies:**
    *   **Question:** Are there any specific libraries or dependencies that need to be installed?
    *   **Your Answer:** \[Enter your answer here]

7.  **Performance Requirements:**
    *   **Question:** Are there any specific performance requirements or constraints?
    *   **Example Options:** processing time, resource utilization
    *   **Your Answer:** \[Enter your answer here]

8.  **Scalability:**
    *   **Question:** Should the pipeline be scalable to handle increasing data volumes?
    *   **Your Answer:** \[Enter your answer here]

---

## V. Additional Considerations

1.  **Security:**
    *   **Question:** Are there any specific security requirements?
    *   **Example Options:** data encryption at rest and in transit, access control, compliance with regulations
    *   **Your Answer:** \[Enter your answer here]

2.  **Testing:**
    *   **Question:** What kind of testing is required?
    *   **Example Options:** unit tests, integration tests, data quality checks
    *   **Your Answer:** \[Enter your answer here]

3.  **Documentation:**
    *   **Question:** What level of code documentation is needed?
    *   **Your Answer:** \[Enter your answer here]

4.  **Code Style:**
    *   **Question:** Are there any preferred code style guidelines or conventions?
    *   **Your Answer:** \[Enter your answer here]

5.  **Version Control:**
    *   **Question:** Will the code be managed under version control (e.g., Git)?
    *   **Your Answer:** \[Enter your answer here]

---