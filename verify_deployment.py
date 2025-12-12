import os
from dotenv import load_dotenv
from elevenlabs import ElevenLabs

def verify_deployment():
    print("--- Starting Verification ---")
    
    # 1. Check Environment
    load_dotenv()
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("❌ Error: ELEVENLABS_API_KEY not found in .env")
        return
    print("✅ Environment variables loaded.")

    client = ElevenLabs(api_key=api_key)

    # 2. Verify Agent
    target_agent_name = "Food Ordering Agent (N8N)"
    agent_id = None
    
    print(f"Searching for agent: '{target_agent_name}'...")
    try:
        # Note: Depending on SDK version, this might need pagination or different structure
        # inspect_phone_list.py used client.conversational_ai.phone_numbers.list()
        # structure seems to be client.conversational_ai.agents.list()
        response = client.conversational_ai.agents.list()
        
        # Check if response has agents directly or matches specific structure
        agents = response.agents if hasattr(response, 'agents') else []
        
        found_agent = False
        for agent in agents:
            if agent.name == target_agent_name:
                agent_id = agent.id
                print(f"✅ Found Agent: {agent.name} (ID: {agent.id})")
                found_agent = True
                break
        
        if not found_agent:
            print(f"❌ Agent '{target_agent_name}' not found.")
            print("Available agents:")
            for agent in agents:
                print(f" - {agent.name}")
            return

    except Exception as e:
        print(f"❌ Error listing agents: {e}")
        return

    # 3. Verify Phone Number Linkage
    print("Verifying Phone Number Linkage...")
    try:
        phone_resp = client.conversational_ai.phone_numbers.list()
        phone_numbers = phone_resp.phone_numbers if hasattr(phone_resp, 'phone_numbers') else []
        
        linked = False
        for phone in phone_numbers:
            if phone.agent_id == agent_id:
                print(f"✅ Phone Number {phone.phone_number} is correctly linked to Agent {agent_id}")
                linked = True
        
        if not linked:
            print(f"❌ No phone number found linked to Agent {agent_id}")
            print("Available Phone Numbers and their Links:")
            for phone in phone_numbers:
                print(f" - {phone.phone_number}: Linked to {phone.agent_id}")

    except Exception as e:
        print(f"❌ Error listing phone numbers: {e}")

    print("--- Verification Complete ---")

if __name__ == "__main__":
    verify_deployment()
