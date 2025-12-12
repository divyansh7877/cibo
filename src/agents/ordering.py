from src.models import OrderContext

def place_mock_order(context: OrderContext) -> OrderContext:
    """
    C. Mock Ordering Agent
    Logic: Generate the final script for the voice agent.
    """
    new_context = context.model_copy(deep=True)
    
    if not new_context.final_selection:
        new_context.restaurant_call_script = "Error: No selection made."
        return new_context

    # Construct script
    script = (
        f"Hello, I am calling on behalf of {new_context.user_name or 'a customer'}. "
        f"They would like to place an order for delivery to {new_context.location_address or 'their location'}. "
        f"They have selected {new_context.final_selection}. "
        "Could you please confirm the order total and estimated delivery time?"
    )
    
    new_context.restaurant_call_script = script
    new_context.order_status = "MOCK_ORDER_PLACED"
    
    return new_context
