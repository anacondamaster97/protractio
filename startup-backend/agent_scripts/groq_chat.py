# Warning control
import warnings
warnings.filterwarnings('ignore')
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain_groq import ChatGroq
from langchain import PromptTemplate, LLMChain
import os

# Get the API key from environment variables
groq_api_key = os.environ.get("GROQ_API_KEY")

# Initialize Groq LLM
llm = ChatGroq(api_key=groq_api_key, model="groq/llama-3.3-70b-versatile")

# Define prompt template for the chatbot
template = """You are a friendly and helpful AI assistant. 
{chat_history}
Human: {human_input}
Assistant:"""

prompt = PromptTemplate(
    input_variables=["chat_history", "human_input"], 
    template=template
)

# Initialize conversation chain with buffer memory for context
conversation_chain = ConversationChain(
    llm=llm, 
    prompt=prompt, 
    memory=ConversationBufferMemory()
)

# Start the chatbot interaction loop
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit", "bye"]:
        break
    response = conversation_chain.predict(human_input=user_input)
    print(f"Assistant: {response}")