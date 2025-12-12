import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs
from elevenlabs.types import (
    ConversationalConfig,
    AgentConfig,
    PromptAgentApiModelOutput,
    PromptAgentApiModelOutputToolsItem_Webhook,
    WebhookToolApiSchemaConfigOutput,
    WebhookToolApiSchemaConfigOutputMethod,
    ObjectJsonSchemaPropertyOutput,
    LiteralJsonSchemaProperty,
    ArrayJsonSchemaPropertyOutput
)
from elevenlabs.conversational_ai.phone_numbers import PhoneNumbersCreateRequestBody_Twilio

load_dotenv()

def deploy_agent():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found in .env")
        return

    client = ElevenLabs(api_key=api_key)

    # This tool will be called by the agent when the order is ready.
    webhook_url = "https://sj300.app.n8n.cloud/webhook/preference-data" 
    
    print(f"Deploying Agent with Webhook URL: {webhook_url}")

    place_order_tool = PromptAgentApiModelOutputToolsItem_Webhook(
        name="sendPreferences",
        description="Send the collected user preferences to the orchestrator system",
        api_schema=WebhookToolApiSchemaConfigOutput(
            url=webhook_url,
            method="POST",
            request_body_schema=ObjectJsonSchemaPropertyOutput(
                type="object",
                properties={
                    "dietary": ArrayJsonSchemaPropertyOutput(
                        type="array",
                        description="List of dietary restrictions (vegetarian, vegan, gluten-free, halal, kosher). Empty array if none.",
                        items=LiteralJsonSchemaProperty(type="string", description="dietary restrictions like vegetarian, vegan, gluten-free, halal, kosher")
                    ),
                    "budget": LiteralJsonSchemaProperty(
                        type="string", 
                        description="Budget level: $ for cheap, $$ for moderate, $$$ for fancy"
                    ),
                    "userId": LiteralJsonSchemaProperty(
                        type="string", 
                        description="Unique identifier for the user"
                    ),
                    "groupSize": LiteralJsonSchemaProperty(
                        type="number", 
                        description="Number of people dining"
                    ),
                    "cuisine": LiteralJsonSchemaProperty(
                        type="string", 
                        description="Type of cuisine (e.g., Italian, Japanese, Mexican, Chinese, Indian)"
                    )
                }
            )
        )
    )

    # 2. Define the System Prompt
    system_prompt = """
    You are a helpful food ordering assistant. 
    Your goal is to collect the user's name, location, dietary restrictions, and food preferences.
    Once you have all the details and the user confirms the order, you MUST call the 'place_order' tool.
    
    Start by asking for their name and what they are looking for today.
    """

    # 3. Create the Agent
    try:
        response = client.conversational_ai.agents.create(
            conversation_config=ConversationalConfig(
                agent=AgentConfig(
                    prompt=PromptAgentApiModelOutput(
                        prompt=system_prompt,
                        tools=[place_order_tool]
                    ),
                    first_message="Hi! I'm your food ordering assistant. What's your name?",
                    language="en"
                )
            ),
            name="Food Ordering Agent (N8N)"
        )
        
        print(f"Successfully created Agent!")
        print(f"Agent ID: {response.agent_id}")
        print(f"View in Dashboard: https://elevenlabs.io/app/conversational-ai/agents/{response.agent_id}")

        # 4. Integrate Twilio Phone Number
        twilio_sid = os.getenv("TWILIO_PHONE_NUMBER_SID")
        twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
        twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

        if twilio_sid and twilio_token and twilio_number:
            print("Configuring Twilio integration...")
            try:
                # Check if number already exists/import it
                # Note: create() for Twilio imports the number if it doesn't exist or updates it? 
                # Based on docstring: "Import Phone Number from provider configuration"
                phone_id = None
                
                # List existing numbers
                existing_numbers = client.conversational_ai.phone_numbers.list()
                for num in existing_numbers:
                    if num.phone_number == twilio_number or num.phone_number == f"+{twilio_number}" or num.phone_number == f"+1{twilio_number}":
                        phone_id = num.phone_number_id
                        print(f"Found existing phone number ID: {phone_id}")
                        break
                
                if not phone_id:
                    print("Importing Twilio number...")
                    phone_resp = client.conversational_ai.phone_numbers.create(
                        request=PhoneNumbersCreateRequestBody_Twilio(
                            phone_number=twilio_number,
                            label="Twilio Integration",
                            sid=twilio_sid,
                            token=twilio_token
                        )
                    )
                    phone_id = phone_resp.phone_number_id
                    print(f"Imported phone number ID: {phone_id}")

                # Link to Agent
                print(f"Linking Agent {response.agent_id} to Phone {phone_id}...")
                client.conversational_ai.phone_numbers.update(
                    phone_number_id=phone_id,
                    agent_id=response.agent_id
                )
                print("Successfully linked Agent to Twilio number!")

            except Exception as e:
                print(f"Error configuring Twilio: {e}")
        else:
             print("Twilio credentials not found in .env, skipping phone integration.")

    except Exception as e:
        print(f"Failed to deploy agent: {e}")

if __name__ == "__main__":
    deploy_agent()
