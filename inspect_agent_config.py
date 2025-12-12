import os
from elevenlabs import ElevenLabs

def load_env_manual():
    try:
        with open('.env', 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    except Exception as e:
        print(f"Warning: Could not read .env file: {e}")

load_env_manual()

def inspect_agents():
    api_key = os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found in .env")
        return

    client = ElevenLabs(api_key=api_key)
    
    try:
        print("Fetching agents...")
        response = client.conversational_ai.agents.list()
        print(f"Found {len(response.agents)} agents. Listing details:")
        for agent in response.agents:
            agent_id = agent.agent_id
            name = agent.name
            
            try:
                details = client.conversational_ai.agents.get(agent_id)
                prompt = details.conversation_config.agent.prompt
                tools = prompt.tools if prompt.tools else []
                
                tool_info = []
                for t in tools:
                    if t.type == 'webhook':
                        url = getattr(t.api_schema, 'url', 'NO_URL')
                        tool_info.append(f"{t.name} -> {url}")
                    else:
                        tool_info.append(f"{t.type}:{t.name}")
                
                tools_str = ", ".join(tool_info) if tool_info else "No tools"
                print(f"Agent: '{name}' | ID: {agent_id} | Tools: [{tools_str}]")
            except Exception as e:
                print(f"Agent: '{name}' | ID: {agent_id} | Error: {e}")

    except Exception as e:
        print(f"Error inspecting agents: {e}")

if __name__ == "__main__":
    inspect_agents()
