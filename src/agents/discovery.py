from src.models import OrderContext, DiscoveryOption

def find_options(context: OrderContext) -> OrderContext:
    """
    B. Discovery & Curation Agent
    Logic: Use extracted preferences to curate options.
    """
    new_context = context.model_copy(deep=True)
    
    # Hardcoded list of options
    all_options = [
        DiscoveryOption(name="Luigi's Pizzeria", description="Authentic Italian Pizza", price="15.99", mock_order_link="http://mock.link/luigi"),
        DiscoveryOption(name="Sushi World", description="Fresh Fish & Rolls", price="22.50", mock_order_link="http://mock.link/sushi"),
        DiscoveryOption(name="Burger King (Not the chain)", description="Gourmet Burgers", price="12.99", mock_order_link="http://mock.link/burger"),
        DiscoveryOption(name="Veggie Delight", description="All Vegetarian goodness", price="14.00", mock_order_link="http://mock.link/veggie"),
        DiscoveryOption(name="The Vegan Joint", description="100% Vegan comfort food", price="16.50", mock_order_link="http://mock.link/vegan"),
    ]
    
    filtered_options = []
    
    # Simple filtering logic
    for option in all_options:
        score = 0
        # Boost score if matches preferences
        for pref in new_context.food_preferences:
            if pref.lower() in option.name.lower() or pref.lower() in option.description.lower():
                score += 2
        
        # Boost score if matches dietary restrictions
        for restriction in new_context.dietary_restrictions:
            if restriction.lower() in option.description.lower() or restriction.lower() in option.name.lower():
                score += 1
        
        if (not new_context.food_preferences and not new_context.dietary_restrictions) or score > 0:
            filtered_options.append((score, option))
    
    # Sort by score descending and take top 3
    filtered_options.sort(key=lambda x: x[0], reverse=True)
    
    new_context.discovery_results = [opt[1] for opt in filtered_options[:3]]
    
    return new_context
