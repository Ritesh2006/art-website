import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    uri = "mongodb+srv://riteshrakhit2006:RiteshRakshit%402006@practice.hfpnoec.mongodb.net/art_modern_v2?retryWrites=true&w=majority"
    print(f"Connecting to Atlas with RiteshRakshit@2006...")
    client = AsyncIOMotorClient(uri)
    try:
        # The ismaster command is cheap and does not require auth.
        # But we want to test auth, so we'll try to list collections in a DB.
        db = client.art_gallery
        await db.command("ping")
        print("✅ Ping successful!")
        cols = await db.list_collection_names()
        print(f"✅ Auth successful! Collections: {cols}")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(test())
