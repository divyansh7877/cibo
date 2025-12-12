from elevenlabs import ElevenLabs
import inspect

client = ElevenLabs(api_key="dummy")
print(inspect.signature(client.conversational_ai.phone_numbers.create))
print(client.conversational_ai.phone_numbers.create.__doc__)
