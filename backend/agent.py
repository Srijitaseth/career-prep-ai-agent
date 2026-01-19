from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
import json


model = OpenAIChatModel("mistralai/mistral-7b-instruct")

class CareerInput(BaseModel):
    role: str
    experience: str
    goal: str

class CareerOutput(BaseModel):
    resume_feedback: str
    interview_questions: list[str]
    learning_roadmap: list[str]

career_agent = Agent(
    model=model,
    system_prompt=(
        "You are a career preparation assistant.\n"
        "Return ONLY valid JSON in this format:\n"
        "{\n"
        '  "resume_feedback": "...",\n'
        '  "interview_questions": ["...", "..."],\n'
        '  "learning_roadmap": ["...", "..."]\n'
        "}\n"
        "Do not include any extra text."
    )
)

def parse_agent_output(raw_text: str) -> CareerOutput:
    """
    Converts the model's JSON string into a validated CareerOutput object.
    """
    data = json.loads(raw_text)
    return CareerOutput(**data)
