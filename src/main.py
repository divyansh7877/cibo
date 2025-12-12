import os
import sys
from dotenv import load_dotenv

# Ensure we can import modules from src if run directly
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from src.models import OrderContext
from src.agents.preference import extract_preferences
from src.agents.discovery import find_options
from src.agents.ordering import place_mock_order

# Load environment variables
load_dotenv()

def run_workflow(initial_context: OrderContext) -> OrderContext:
    """
    Orchestrator Function
    Logic: Implement the sequential flow.
    """
    current_context = initial_context.model_copy(deep=True)
    
    # Step 1: Extract Preferences
    print("Orchestrator: Extracting preferences...")
    current_context = extract_preferences(current_context)
    current_context.order_status = "PREFERENCE_GATHERED"
    print(f"  -> Extracted: Name='{current_context.user_name}', Food={current_context.food_preferences}, Dietary={current_context.dietary_restrictions}")
    
    # Step 2: Discovery
    print("Orchestrator: Finding options...")
    current_context = find_options(current_context)
    current_context.order_status = "OPTIONS_CURATED"
    print(f"  -> Found {len(current_context.discovery_results)} options.")
    
    # Step 3: Mock Selection
    if current_context.discovery_results:
        # Arbitrarily select the first item
        selection = current_context.discovery_results[0]
        current_context.final_selection = selection.name
        print(f"Orchestrator: Mock selection made: {current_context.final_selection}")
    else:
        print("Orchestrator: No options found. Cannot proceed to order.")
        current_context.order_status = "FAILED_NO_OPTIONS"
        return current_context

    current_context.order_status = "ORDERING_INITIATED"
    
    # Step 4: Place Order
    print("Orchestrator: Placing mock order...")
    current_context = place_mock_order(current_context)
    
    return current_context

if __name__ == "__main__":
    # Demonstration Block
    
    # Sample transcript
    sample_transcript = (
        "Hi, my name is Divyansh. I live at 123 Main St. "
        "I'm really craving some Pizza tonight. "
        "Also, I am Vegetarian."
    )
    
    # Create initial context
    initial_ctx = OrderContext(call_transcript_snippet=sample_transcript)
    
    print("--- Starting Workflow ---")
    final_ctx = run_workflow(initial_ctx)
    print("--- Workflow Finished ---\n")
    
    print("Final Order Context:")
    print(final_ctx.model_dump_json(indent=2))
    
    print("\nGenerated Restaurant Call Script:")
    print("-" * 40)
    print(final_ctx.restaurant_call_script)
    print("-" * 40)
