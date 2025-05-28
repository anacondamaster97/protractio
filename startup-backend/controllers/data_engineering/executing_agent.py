from crewai import Agent, Task, Crew
from openai import OpenAI
import subprocess

# Set up the LLM for code generation
llm = OpenAI(api_key="your-openai-key")

# Define the agent that generates Python code
code_gen_agent = Agent(
    name="Code Generator",
    role="Python Developer",
    goal="Generate safe and efficient Python code",
    backstory="An AI expert in Python programming",
    llm=llm,
)

# Define the agent that safely executes code
def execute_code(code):
    """Safely execute Python code and return output"""
    safe_globals = {"__builtins__": {}}
    try:
        exec(code, safe_globals)
        return {"output": "Executed successfully"}
    except Exception as e:
        return {"error": str(e)}

exec_agent = Agent(
    name="Code Executor",
    role="Python Runtime",
    goal="Execute safe Python code securely in the cloud",
    backstory="A secure Python sandbox environment",
    llm=llm,
)

# Define the task for generating code
gen_code_task = Task(
    description="Generate a Python script to print a Fibonacci series up to 10.",
    agent=code_gen_agent,
)

# Define the task for executing code
exec_code_task = Task(
    description="Execute the generated Python script securely.",
    agent=exec_agent,
    output=execute_code,  # Calls the execution function
)

# Create a crew to run the tasks
crew = Crew(agents=[code_gen_agent, exec_agent], tasks=[gen_code_task, exec_code_task])
crew.kickoff()
