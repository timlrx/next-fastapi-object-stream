import asyncio
import httpx
import json


async def stream_response():
    url = "http://localhost:8000/api/object_stream"
    data = {
        "expense": f"Please categorize the following expense: Movie tickets for $15.00"
    }

    async with httpx.AsyncClient() as client:
        async with client.stream("POST", url, json=data) as response:
            async for chunk in response.aiter_text():
                print(chunk, end="", flush=True)


async def main():
    await stream_response()


if __name__ == "__main__":
    asyncio.run(main())
