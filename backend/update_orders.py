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
    
    # Update orders to match the current login
    res = await db.orders.update_many(
        {"email": "riteshrakhit@gmail.com"}, 
        {"$set": {"email": "riteshrakhit2006@gmail.com"}}
    )
    print(f"Updated {res.modified_count} orders from riteshrakhit@gmail.com to riteshrakhit2006@gmail.com")

if __name__ == "__main__":
    asyncio.run(update_orders())
