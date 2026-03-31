import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def main():
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "art_gallery")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[MONGO_DB_NAME]
    
    art = await db.artworks.find_one({})
    if art:
        print("ARTWORK KEYS:", art.keys())
        print("ARTWORK ID VALUE:", art.get("id"))
        print("ARTWORK _ID VALUE:", art.get("_id"))
    else:
        print("NO ARTWORKS FOUND")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
