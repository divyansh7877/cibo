from elevenlabs import ElevenLabs
from elevenlabs.types import AgentConfig
import inspect

client = ElevenLabs(api_key="dummy")

print("Agent create signature:")
print(inspect.signature(client.conversational_ai.agents.create))

# Check if we can find PhoneNumbersCreateRequestBody_Twilio in the module
import elevenlabs.conversational_ai.phone_numbers as phone_numbers_module
print("\nphone_numbers module dir:")
print(dir(phone_numbers_module))

