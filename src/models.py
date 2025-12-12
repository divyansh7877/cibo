from typing import List
from pydantic import BaseModel, Field

class DiscoveryOption(BaseModel):
    name: str
    description: str
    price: str
    mock_order_link: str

class OrderContext(BaseModel):
    call_transcript_snippet: str = ""
    user_name: str = ""
    location_address: str = ""
    dietary_restrictions: List[str] = Field(default_factory=list)
    food_preferences: List[str] = Field(default_factory=list)
    price_range: str = ""
    discovery_results: List[DiscoveryOption] = Field(default_factory=list)
    final_selection: str = ""
    order_status: str = "INITIATED"
    restaurant_call_script: str = ""
