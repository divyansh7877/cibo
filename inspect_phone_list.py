from elevenlabs import ElevenLabs
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("ELEVENLABS_API_KEY")
client = ElevenLabs(api_key=api_key)

try:
    resp = client.conversational_ai.phone_numbers.list()
    print("Type of response:", type(resp))
    print("Response content:", resp)
    
    if hasattr(resp, 'phone_numbers'):
        print("Attribute 'phone_numbers' exists.")
    else:
        print("Attribute 'phone_numbers' DOES NOT exist.")
        
except Exception as e:
    print(f"Error: {e}")
