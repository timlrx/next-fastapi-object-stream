import asyncio
import litellm
import logfire
from pydantic import BaseModel, Field
from datetime import date
from typing import (
    AsyncGenerator,
    Generator,
    List,
)
from fastapi import FastAPI, Request
from dotenv import load_dotenv
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from simple_ai_agents.chat_session import ChatLLMSession
from simple_ai_agents.models import LLMOptions
from simple_ai_agents.utils import (
    async_pydantic_to_text_stream,
    pydantic_to_text_stream,
)


load_dotenv()

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")
openai = LLMOptions(model="gpt-4o-mini")
github = LLMOptions(model="github/gpt-4o-mini")
llm_provider = github

# Logging configuration
litellm.success_callback = ["logfire"]
logfire.configure()
logfire.instrument_fastapi(app)


class Expense(BaseModel):
    category: str = Field(
        description="Category of the expense. Allowed categories: TRAVEL, MEALS, ENTERTAINMENT, OFFICE SUPPLIES, OTHER."
    )
    amount: float = Field(description="Amount of the expense in USD.")
    details: str = Field(description="Name of the product or service.")
    participants: List[str] = Field(
        description="Participants in the expense, as usernames."
    )
    date: str = Field(
        description=f"Date of the expense, in dd-MMM format if provided. If not provided, defaults to today's date: {date.today().strftime('%d-%b')}"
    )


class ExpenseSchema(BaseModel):
    expense: Expense


@app.get("/api/hello")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


async def fake_stream():
    """Generate fake AI model response and stream it."""
    for i in range(6):
        await asyncio.sleep(0.1)
        yield f"Here's a sample of a response stream in text form {i}\n\n"


@app.post("/api/text_stream")
async def query(request: Request):
    body = await request.json()
    messages = body.get("messages")
    prompt = messages[-1]["content"]

    def stream_text(prompt: str):
        """Generate the AI model response and stream it."""
        sess = ChatLLMSession(llm_options=llm_provider)
        stream = sess.stream(prompt)
        for chunk in stream:
            yield chunk["delta"]

    # response = StreamingResponse(stream_text(prompt))
    response = StreamingResponse(fake_stream())
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response


@app.post("/api/object_stream")
async def query(request: Request):
    body = await request.json()
    expense = body.get("expense")
    prompt = f"Please categorize the following expense: {expense}"

    def stream_object(prompt: str):
        """Generate the AI model response and stream it."""
        sess = ChatLLMSession(llm_options=llm_provider)
        stream = sess.stream_model(prompt, response_model=ExpenseSchema)
        for delta in pydantic_to_text_stream(stream, mode="delta"):
            yield delta

    response = StreamingResponse(stream_object(prompt))
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response


@app.post("/api/stream_object_json")
async def query(request: Request):
    body = await request.json()
    expense = body.get("expense")
    prompt = f"Please categorize the following expense: {expense}"

    def stream_object_json(prompt: str):
        """Generate the AI model response and stream it."""
        sess = ChatLLMSession(llm_options=llm_provider)
        stream = sess.stream_model(prompt, response_model=Expense)
        for delta in stream:
            result = delta.model_dump_json()
            yield result

    response = StreamingResponse(stream_object_json(prompt))
    response.headers["x-vercel-ai-data-stream"] = "v1"
    return response
