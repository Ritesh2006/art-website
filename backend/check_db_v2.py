import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def check():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB_NAME")
    print(f"Connecting to: {db_name}")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    art_count = await db.artworks.count_documents({})
    ord_count = await db.orders.count_documents({})
    
    print(f"Artworks: {art_count}")
    print(f"Orders: {ord_count}")

if __name__ == "__main__":
    asyncio.run(check())
