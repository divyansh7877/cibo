import elevenlabs
from elevenlabs import ElevenLabs
import inspect

print("ElevenLabs SDK Version:", elevenlabs.__version__ if hasattr(elevenlabs, '__version__') else "Unknown")

client = ElevenLabs(api_key="dummy")
print("\nClient attributes:")
print(dir(client))

if hasattr(client, 'conversational_ai'):
    print("\nconversational_ai attributes:")
    print(dir(client.conversational_ai))
    
    if hasattr(client.conversational_ai, 'agents'):
        print("\nconversational_ai.agents attributes:")
        print(dir(client.conversational_ai.agents))

    if hasattr(client.conversational_ai, 'phone_numbers'):
        print("\nconversational_ai.phone_numbers attributes:")
        print(dir(client.conversational_ai.phone_numbers))
