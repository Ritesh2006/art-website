import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "art_gallery")
client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DB_NAME]

async def seed():
    print("Starting database seeding...")
    
    # 1. Seed Categories
    categories = [
        {
            "id": "charcoal",
            "name": "Charcoal Works",
            "description": "Monochromatic depth using willow and compressed charcoal on premium textured paper."
        },
        {
            "id": "oil-painting",
            "name": "Oil Landscapes",
            "description": "Rich, layered compositions exploring light and atmosphere on stretched canvas."
        },
        {
            "id": "pencil-sketch",
            "name": "Pencil Studies",
            "description": "Detailed graphite renderings focusing on anatomy, light, and shadow."
        },
        {
            "id": "acrylic-painting",
            "name": "Acrylic Abstracts",
            "description": "Modern, vibrant compositions with high-pigment acrylics and heavy textures."
        },
        {
            "id": "acrylic-fiber-portrait",
            "name": "Fiber Portraits",
            "description": "Extraordinary 3D-textured portraits using a unique fusion of acrylic paint and synthetic fibers."
        }
    ]
    
    await db.categories.delete_many({})
    await db.categories.insert_many(categories)
    print(f"Seeded {len(categories)} categories.")

    # 2. Seed Mock Artworks
    artworks = [
        {
            "id": "cha-001",
            "title": "Whispers of the Soul",
            "category": "charcoal",
            "medium": "Charcoal on Paper",
            "price": 12500,
            "original_price": 15000,
            "size": '18" x 24"',
            "year": "2023",
            "description": "A deep exploration of human emotion through subtle gradients and sharp contrasts.",
            "image_url": None, # Will use SVG fallback in frontend if null
            "available": True,
            "featured": True,
            "tags": ["portrait", "realism", "expression"]
        },
        {
            "id": "oil-001",
            "title": "Crimson Dusk",
            "category": "oil-painting",
            "medium": "Oil on Canvas",
            "price": 32000,
            "size": '36" x 24"',
            "year": "2022",
            "description": "Capture the fleeting moment of a Bengali sunset over the rural plains.",
            "image_url": None,
            "available": True,
            "featured": True,
            "tags": ["landscape", "nature", "vibrant"]
        },
        {
            "id": "afp-001",
            "title": "Bride in Crimson",
            "category": "acrylic-fiber-portrait",
            "medium": "Acrylic Fiber Portrait",
            "price": 45000,
            "size": '30" x 30"',
            "year": "2024",
            "description": "A groundbreaking 3D portrait using mixed fibers to create life-like hair and fabric texture.",
            "image_url": None,
            "available": True,
            "featured": True,
            "tags": ["portrait", "texture", "wedding"]
        },
        {
            "id": "pen-001",
            "title": "The Old Boddhi",
            "category": "pencil-sketch",
            "medium": "Graphite on Paper",
            "price": 8500,
            "size": '12" x 16"',
            "year": "2023",
            "description": "Intricate detail of an ancient tree trunk, symbolizing endurance and growth.",
            "image_url": None,
            "available": False,
            "featured": False,
            "tags": ["nature", "detail", "monochrome"]
        },
        {
            "id": "acr-001",
            "title": "Electric Monsoon",
            "category": "acrylic-painting",
            "medium": "Acrylic on Canvas",
            "price": 18500,
            "size": '24" x 30"',
            "year": "2024",
            "description": "An abstract representation of the energy during a sudden summer storm in Kolkata.",
            "image_url": None,
            "available": True,
            "featured": False,
            "tags": ["abstract", "modern", "energy"]
        }
    ]
    
    await db.artworks.delete_many({})
    await db.artworks.insert_many(artworks)
    print(f"Seeded {len(artworks)} artworks.")

    # 3. Seed Initial Settings
    await db.settings.update_one(
        {}, 
        {"$set": {"is_taking_orders": True, "admin_email": "riteshrtt@gmail.com"}},
        upsert=True
    )
    print("Seeded default settings.")

    print("Seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
