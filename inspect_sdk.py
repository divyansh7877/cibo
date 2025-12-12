import os
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

try:
    client = ElevenLabs()
    print("Client attributes:", dir(client))
    if hasattr(client, 'conversational_ai'):
        print("Found conversational_ai")
        print(dir(client.conversational_ai))
    elif hasattr(client, 'agents'):
        print("Found agents")
        print(dir(client.agents))
except Exception as e:
    print(e)
