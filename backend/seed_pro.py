import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# New database name requested: art_modern_v2
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = "art_modern_v2" 

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

async def seed():
    print(f"🚀 Initializing Fresh Database: {MONGO_DB_NAME}...")
    
    # 1. Categories (Professional Definitions)
    categories = [
        {"id": "charcoal", "name": "Charcoal Works", "description": "Expressive monochromatic depth using willow and compressed charcoal."},
        {"id": "oil-painting", "name": "Oil Masterpieces", "description": "Lush, layered compositions exploring light and atmosphere on stretched canvas."},
        {"id": "pencil-sketch", "name": "Fine Pencil Studies", "description": "Precision graphite renderings focusing on anatomy and realism."},
        {"id": "acrylic-painting", "name": "Modern Acrylics", "description": "Vibrant, high-impact compositions using modern heavy-body acrylics."},
        {"id": "acrylic-fiber-portrait", "name": "3D Fiber Portraits", "description": "A proprietary blend of acrylic paint and hand-laid synthetic fibers for unique texture."}
    ]

    # 2. Artworks (High-End Collection)
    artworks = [
        {
            "id": "cha-101",
            "title": "Solitude in Motion",
            "category": "charcoal",
            "medium": "Willow Charcoal on Fabriano Paper",
            "price": 14500,
            "original_price": 18000,
            "size": '22" x 30"',
            "year": 2024,
            "available": True,
            "featured": True,
            "description": "A dynamic landscape study capturing the raw power of moving winds across the Sundarbans.",
            "image_url": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000", # Better placeholder
            "tags": ["monochrome", "expressive"]
        },
        {
            "id": "oil-201",
            "title": "Emerald Reverie",
            "category": "oil-painting",
            "medium": "Professional Grade Oil on Linen",
            "price": 42000,
            "original_price": None,
            "size": '36" x 36"',
            "year": 2024,
            "available": True,
            "featured": True,
            "description": "An deep-color forest study focusing on the play of emerald light through dense foliage.",
            "image_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000",
            "tags": ["landscape", "vibrant"]
        },
        {
            "id": "afp-301",
            "title": "The Weaver's Daughter",
            "category": "acrylic-fiber-portrait",
            "medium": "Mixed Media: Acrylic & Raw Silk Fiber",
            "price": 65000,
            "original_price": 75000,
            "size": '24" x 24"',
            "year": 2024,
            "available": True,
            "featured": True,
            "description": "A museum-quality 3D portrait using rare silk fibers to create hyper-realistic textile textures.",
            "image_url": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=1000",
            "tags": ["portrait", "texture", "silk"]
        },
        {
            "id": "psk-401",
            "title": "Anatomy of Grace",
            "category": "pencil-sketch",
            "medium": "Graphite (2H-8B) on Bristol Board",
            "price": 9500,
            "original_price": 12000,
            "size": '14" x 17"',
            "year": 2024,
            "available": False,
            "featured": False,
            "description": "A meticulous study of the human hand, demonstrating mastery over light and anatomy.",
            "image_url": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000",
            "tags": ["study", "hyper-realism"]
        },
        {
            "id": "acp-501",
            "title": "Urban Monsoon",
            "category": "acrylic-painting",
            "medium": "Heavy-Body Acrylic on Canvas Panel",
            "price": 28500,
            "original_price": None,
            "size": '30" x 40"',
            "year": 2024,
            "available": True,
            "featured": True,
            "description": "An abstract take on the electricity and chaos of a Kolkata monsoon afternoon.",
            "image_url": "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000",
            "tags": ["abstract", "modern"]
        }
    ]

    # 3. Clear and Populate
    print("🧹 Cleaning existing collections...")
    await db.categories.delete_many({})
    await db.artworks.delete_many({})
    await db.settings.delete_many({})
    
    print("🌱 Inserting new data...")
    if categories: await db.categories.insert_many(categories)
    if artworks: await db.artworks.insert_many(artworks)
    
    # 4. Global Settings
    await db.settings.insert_one({
        "id": "global",
        "is_taking_orders": True,
        "last_updated": "2026-03-31"
    })

    print(f"✅ SUCCESSFULLY SEEDED: {MONGO_DB_NAME}")
    print(f"🎨 {len(artworks)} Artworks created.")
    print(f"📂 {len(categories)} Categories established.")

if __name__ == "__main__":
    asyncio.run(seed())
