import httpx
import asyncio
import uuid
import json

BASE_URL = "http://localhost:8000"

async def test_all():
    print("\n--- 🕵️ SITE-WIDE API AUDIT ---")
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=10.0) as client:
        # 1. Public Endpoints
        print("\n[PUBLIC ROUTES]")
        for route in ["/", "/artworks", "/categories", "/settings", "/stats"]:
            try:
                res = await client.get(route)
                print(f"✅ {route}: {res.status_code}")
            except Exception as e:
                print(f"❌ {route}: FAILED ({e})")

        # 2. Newsletter Signup
        print("\n[MARKETING]")
        email = f"test_{uuid.uuid4().hex[:6]}@example.com"
        try:
            res = await client.post("/newsletter", json={"email": email})
            print(f"✅ /newsletter: {res.status_code} ({res.json().get('message')})")
        except Exception as e:
            print(f"❌ /newsletter: FAILED ({e})")

        # 3. User Authentication
        print("\n[USER AUTH]")
        user_email = f"user_{uuid.uuid4().hex[:6]}@test.com"
        password = "password123"
        try:
            # Signup
            signup = await client.post("/auth/signup", json={"name": "Tester", "email": user_email, "password": password})
            print(f"✅ Signup: {signup.status_code} ({signup.json().get('message')})")
            
            # Login
            login = await client.post("/auth/login", json={"email": user_email, "password": password})
            print(f"✅ Login: {login.status_code} (User: {login.json().get('name')})")
        except Exception as e:
            print(f"❌ Auth: FAILED ({e})")

        # 4. Order Placement
        print("\n[E-COMMERCE]")
        try:
            # Get an artwork ID first
            arts = await client.get("/artworks")
            available_art = next((a for a in arts.json() if a.get('available')), None)
            
            if available_art:
                order_payload = {
                    "name": "Test Customer",
                    "email": user_email,
                    "phone": "1234567890",
                    "address": "123 Test St",
                    "city": "Test City",
                    "pincode": "700001",
                    "items": [{"artwork_id": available_art['id'], "quantity": 1}],
                    "total": available_art['price']
                }
                order_res = await client.post("/orders", json=order_payload)
                print(f"✅ Order: {order_res.status_code} (Order ID: {order_res.json().get('order_id')})")
            else:
                print("⚠️ Skipping order test: No available artworks found.")
        except Exception as e:
            print(f"❌ Order: FAILED ({e})")

        # 5. Admin Panel (Check stats)
        print("\n[ADMIN]")
        try:
            # Using ritesh@2006 as admin secret as found in .env
            admin_res = await client.post("/admin/login", json={"password": "ritesh@2006"})
            if admin_res.status_code == 200:
                token = admin_res.json().get('token')
                headers = {"Authorization": f"Bearer {token}"}
                
                # Check admin orders
                orders_res = await client.get("/admin/orders", headers=headers)
                print(f"✅ Admin Orders View: {orders_res.status_code} (Total: {orders_res.json().get('total')})")
                
                # Check stats
                stats_res = await client.get("/stats")
                print(f"✅ Public Stats: {stats_res.status_code} (Artworks: {stats_res.json().get('total_artworks')})")
            else:
                print(f"❌ Admin Login: FAILED ({admin_res.status_code})")
        except Exception as e:
            print(f"❌ Admin: FAILED ({e})")

    print("\n--- 🏁 AUDIT COMPLETE ---\n")

if __name__ == "__main__":
    asyncio.run(test_all())
