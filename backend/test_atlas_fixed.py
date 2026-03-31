import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

async def test():
    # URL-encoding the password part with @ symbol
    user = "riteshrakhit2006"
    password = quote_plus("RiteshRakshit@2006")
    cluster = "practice.hfpnoec.mongodb.net"
    dbname = "art_modern_live"
    
    uri = f"mongodb+srv://{user}:{password}@{cluster}/{dbname}?retryWrites=true&w=majority"
    
    print(f"Connecting to: mongodb+srv://{user}:[HIDDEN]@{cluster}/{dbname}...")
    
    client = AsyncIOMotorClient(uri)
    db = client[dbname]
    
    try:
        # Check connection by count
        count = await db.artworks.count_documents({})
        print(f"Connection SUCCESS! Found {count} existing artworks in cloud.")
        
        # Test write
        res = await db.connection_logs.insert_one({"timestamp": "2026-03-31", "type": "migration_test"})
        print(f"Write SUCCESS! Log ID: {res.inserted_id}")
        
    except Exception as e:
        print(f"Connection FAILED: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test())
