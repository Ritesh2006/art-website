import os
import asyncio
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

async def update_orders():
    load_dotenv()
    uri = os.getenv("MONGO_URI")
    db_name = os.getenv("MONGO_DB_NAME")
    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    
    # Force all existing orders to this user for the test
    res = await db.orders.update_many(
        {}, 
        {"$set": {"email": "riteshrakhit2006@gmail.com"}}
    )
    print(f"Updated {res.modified_count} orders to riteshrakhit2006@gmail.com")

if __name__ == "__main__":
    asyncio.run(update_orders())
