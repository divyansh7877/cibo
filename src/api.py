from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.models import OrderContext
from src.main import run_workflow

app = FastAPI(title="ElevenLabs Agent API", description="API to trigger the voice agent workflow for N8N integration")

class WorkflowRequest(BaseModel):
    call_transcript_snippet: str

@app.post("/process-order", response_model=OrderContext)
async def process_order(request: WorkflowRequest):
    """
    Trigger the food ordering agent workflow.
    N8N should send a JSON body with 'call_transcript_snippet'.
    """
    try:
        # Create initial context from request
        initial_context = OrderContext(call_transcript_snippet=request.call_transcript_snippet)
        
        # Run the workflow using the logic from main.py
        # Note: run_workflow is synchronous, but FastAPI handles it fine. 
        # For heavy loads, we might want to run in a threadpool or make run_workflow async.
        final_context = run_workflow(initial_context)
        
        return final_context
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}
