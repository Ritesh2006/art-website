import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

async def test_conn():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    print(f"Testing URI: {uri}")
    try:
        client = AsyncIOMotorClient(uri)
        print("Client created successfully.")
        await client.admin.command('ping')
        print("Pinged! Connection OK.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
