import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def test():
    uri = "mongodb+srv://riteshrakhit2006:RiteshRakshit@2006@practice.hfpnoec.mongodb.net/art_gallery?retryWrites=true&w=majority"
    print(f"Connecting to: {uri[:60]}...")
    client = AsyncIOMotorClient(uri)
    db = client.test_db
    try:
        res = await db.test_col.insert_one({"test": "data"})
        print(f"Success! Inserted ID: {res.inserted_id}")
        await db.test_col.delete_one({"_id": res.inserted_id})
        print("Cleanup successful.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test())
