from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
from dotenv import load_dotenv
from pathlib import Path

from agent import career_agent, CareerInput, parse_agent_output

# Load env vars
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Career Prep AI Agent",
    description="AI-powered career guidance API",
    version="1.0.0",
)

# ✅ CORS FIX (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for demo/interview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Career Prep AI Agent running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/generate")
async def generate(data: CareerInput):
    logger.info(f"Received request for role: {data.role}")

    if len(data.experience.strip()) < 5:
        raise HTTPException(
            status_code=400,
            detail="Experience description is too short",
        )

    try:
        result = await career_agent.run(data.dict())
        parsed_output = parse_agent_output(result.output)
        return parsed_output

    except Exception as e:
        logger.error(f"Agent error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate career guidance",
        )

