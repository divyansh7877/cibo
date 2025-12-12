from src.models import OrderContext

def extract_preferences(context: OrderContext) -> OrderContext:
    """
    A. Preference Extraction Agent
    Logic: Parse and extract structured data from context.call_transcript_snippet.
    """
    new_context = context.model_copy(deep=True)
    transcript = new_context.call_transcript_snippet.lower()
    
    # Mock Logic for Cursor as requested: Simple keyphrase extraction
    if "my name is" in transcript:
        try:
            parts = transcript.split("my name is")
            if len(parts) > 1:
                name_part = parts[1].split(".")[0].strip().split(",")[0].strip()
                new_context.user_name = name_part.title()
        except:
             pass # Fallback or keep empty

    if "live at" in transcript:
        try:
             parts = transcript.split("live at")
             if len(parts) > 1:
                 addr_part = parts[1].split(".")[0].strip()
                 new_context.location_address = addr_part.title()
        except:
            pass

    if "vegetarian" in transcript:
        new_context.dietary_restrictions.append("Vegetarian")
    if "vegan" in transcript:
        new_context.dietary_restrictions.append("Vegan")
    if "gluten free" in transcript or "gluten-free" in transcript:
        new_context.dietary_restrictions.append("Gluten-Free")

    if "pizza" in transcript:
        new_context.food_preferences.append("Pizza")
    if "sushi" in transcript:
        new_context.food_preferences.append("Sushi")
    if "burger" in transcript:
        new_context.food_preferences.append("Burger")
    
    return new_context
