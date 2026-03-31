import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
LOCAL_URI = "mongodb://localhost:27017"
CLOUD_URI = "mongodb+srv://riteshrakhit2006:riteshrakhit2006@practice.hfpnoec.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "art_gallery"

async def migrate():
    print(f"\n--- 🚀 DATA MIGRATION: LOCAL TO CLOUD ---")
    
    local_client = AsyncIOMotorClient(LOCAL_URI)
    cloud_client = AsyncIOMotorClient(CLOUD_URI)
    
    local_db = local_client[DB_NAME]
    cloud_db = cloud_client[DB_NAME]
    
    collections = ["artworks", "categories", "users", "settings", "orders"]
    
    for collection_name in collections:
        print(f"📦 Migrating collection: {collection_name}...")
        
        # Get local data
        data = await local_db[collection_name].find({}).to_list(None)
        
        if not data:
            print(f"   • No data found in local {collection_name}. Skipping.")
            continue
            
        print(f"   • Found {len(data)} documents. Transferring...")
        
        # Ensure cloud collection is clean (Optional: for a fresh start)
        # await cloud_db[collection_name].delete_many({})
        
        try:
            # Batch Insert to Cloud
            # We filter out _id to avoid duplicate key errors if already exists
            for doc in data:
                if '_id' in doc: del doc['_id']
            
            await cloud_db[collection_name].insert_many(data)
            print(f"   ✅ Successfully migrated {len(data)} to Cloud Atlas!")
        except Exception as e:
            print(f"   ❌ ERROR migrating {collection_name}: {e}")

    print("\n--- 🏁 MIGRATION COMPLETE ---")
    print(f"Database: {DB_NAME}")
    print(f"Cluster: MongoDB Atlas (Cloud)")
    print("-----------------------------\n")

if __name__ == "__main__":
    asyncio.run(migrate())
