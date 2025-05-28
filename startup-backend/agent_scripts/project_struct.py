import os
import json
import zipfile
import io
from collections import defaultdict

def build_tree(file_struct):
    def add_to_tree(tree, parts):
        if len(parts) == 1:
            tree.append(parts[0])
        else:
            folder = parts[0]
            # Find the folder or create a new sublist for it
            for item in tree:
                if isinstance(item, list) and item[0] == folder:
                    add_to_tree(item[1], parts[1:])
                    break
            else:
                subtree = [folder, []]
                tree.append(subtree)
                add_to_tree(subtree[1], parts[1:])

    # Initialize the tree
    tree = []
    
    # Iterate over each file structure
    for file_info in file_struct:
        filepath = file_info["Filepath"]
        parts = filepath.split("/")
        add_to_tree(tree, parts)

    return tree

def display_tree(file_struct):
    if not file_struct:
        file_struct = [
            {
                "Filepath": "src/components/App.tsx",
                "FileContent": "console.log('Hello world');"
            },
            {
                "Filepath": "example/filepath/ExampleFile.txt",
                "FileContent": "This is an example file content."
            }
        ]

    # Build the tree structure
    tree = build_tree(file_struct)

    # Print the resulting tree as JSON
    print(json.dumps(tree, indent=2))

def create_project_from_json(json_data, base_folder="output_project"):
    """
    Create a project folder structure based on JSON data.
    
    Parameters:
        json_data (list): List of dictionaries containing filepaths and file contents.
        base_folder (str): Root folder to create the project files.
    """
    # Create the base folder if it doesn't exist
    if not os.path.exists(base_folder):
        os.makedirs(base_folder)

    for entry in json_data:
        filepath = entry.get("Filepath")
        file_content = entry.get("FileContent", "")

        if not filepath:
            print("Skipping entry with missing 'Filepath'")
            continue

        # Construct the full path
        full_path = os.path.join(base_folder, filepath)

        # Ensure the directory structure exists
        directory = os.path.dirname(full_path)
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Write the file content to the specified path
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(file_content)

    print(f"Project structure created under '{base_folder}'")


def zip_project_folder(base_folder, zip_filename="project.zip"):
    """
    Create a zip file containing the contents of the project folder.
    
    Parameters:
        base_folder (str): Root folder to compress into a zip file.
        zip_filename (str): Name of the zip file to create.
    """
    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_folder):
            for file in files:
                file_path = os.path.join(root, file)
                # Add the file to the zip archive with a relative path
                zipf.write(file_path, os.path.relpath(file_path, base_folder))

    print(f"Project folder '{base_folder}' zipped into '{zip_filename}'")

def create_zip_in_memory(json_data, output_file="project_test.zip"):
    """
    Create a zip file in memory from the provided JSON data and store it to disk.

    Parameters:
        json_data (list): List of dictionaries containing filepaths and contents.
        output_file (str): Path to store the zip file for testing.

    Returns:
        BytesIO: In-memory zip file object.
    """
    zip_buffer = io.BytesIO()  # Create an in-memory buffer for the zip file

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for entry in json_data:
            filepath = entry.get("Filepath")
            file_content = entry.get("FileContent", "")

            if filepath:
                # Write each file to the zip archive
                zipf.writestr(filepath, file_content)

    zip_buffer.seek(0)  # Reset buffer pointer to the beginning

    # Save the zip file to disk for testing
    with open(output_file, "wb") as f:
        f.write(zip_buffer.getvalue())

    print(f"Zip file saved to disk at: {output_file}")
    return zip_buffer

def download_zip():
    """
    Endpoint to download the zip file.

    Returns:
        Response: Flask response containing the zip file.
    """
    try:
        # Create the zip file in memory and save it to disk for testing
        zip_file = create_zip_in_memory(json_data)

        # Send the zip file as a response
        return send_file(
            zip_file,
            mimetype="application/zip",
            as_attachment=True,
            download_name="project.zip",  # Specify download filename
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def subdomainRouting(host):
    domain = "websitebuilder.com"
    if host.endswith(domain):
        subdomain = host[: -(len(domain) + 1)]
        return subdomain
    return None

# Example usage
if __name__ == "__main__":
    # Example JSON data
    json_data = [
        {
            "Filepath": "src/components/App.tsx",
            "FileContent": "console.log('Hello world');"
        },
        {
            "Filepath": "example/filepath/ExampleFile.txt",
            "FileContent": "This is an example file content."
        },
        {
            "Filepath": ".env",
            "FileContent": "VITE_SUPABASE_URL="+"url"+"\nVITE_SUPABASE_ANON_KEY="+"key"
        }
    ]

    # Convert JSON data to a folder structure and create a zip file
    # create_project_from_json(json_data)
    # zip_project_folder("output_project", "project.zip")
    # create_zip_in_memory(json_data)
    # display_tree(json_data)
    print(subdomainRouting("peter.websitebuilder.com"))

