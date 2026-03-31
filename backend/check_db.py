import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://riteshrakhit2006:[EMAIL_ADDRESS]/?appName=Cluster0")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "art_gallery")
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

async def check():
    print("\n--- 🔍 LIVE DATABASE SNAPSHOT ---")
    
    # Check Artworks
    total_arts = await db.artworks.count_documents({})
    available = await db.artworks.count_documents({"available": True})
    print(f"🎨 Total Artworks: {total_arts} ({available} available)")
    
    # List top 5 artworks
    arts = await db.artworks.find({}, {"_id": 0, "id": 1, "title": 1, "price": 1, "available": 1}).to_list(5)
    for a in arts:
        status = "✅ Available" if a['available'] else "❌ Sold"
        print(f"   • {a['id']}: {a['title']} - ₹{a['price']:,} [{status}]")
        
    # Check Orders
    total_orders = await db.orders.count_documents({})
    print(f"\n📦 Total Orders: {total_orders}")
    
    # Check Users
    total_users = await db.users.count_documents({})
    print(f"👥 Registered Collectors: {total_users}")
    
    print("----------------------------------\n")

if __name__ == "__main__":
    asyncio.run(check())
