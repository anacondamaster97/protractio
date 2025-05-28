
from utils.middleware import requires_auth, supabase
import os

async def add_project_id():
  try:
    # Update the project_ids array
    data = await supabase.table('projects').update(
        {'project_ids': supabase.rpc('array_append', {
          'input': [3],  # New project ID to add
          'original': supabase.ref('project_ids')
        })}
    ).eq('id', 1).execute()  # Replace 1 with the actual project ID

    print("Project IDs updated successfully:", data)

  except Exception as e:
    print("Error updating project IDs:", e)