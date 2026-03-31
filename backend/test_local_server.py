import requests

API_BASE = "http://localhost:8000"
ADMIN_TOKEN = "ritesh_art_vault_2024" # Default if not changed

def test_availability():
    headers = {"Authorization": f"Bearer {ADMIN_TOKEN}"}
    
    # Try to find an artwork first
    try:
        res = requests.get(f"{API_BASE}/artworks")
        if res.status_code != 200:
            print(f"Error fetching artworks: {res.status_code}")
            return
        
        artworks = res.json()
        if not artworks:
            print("No artworks found in DB")
            return
        
        art_id = artworks[0]['id']
        curr_status = artworks[0].get('available', True)
        new_status = not curr_status
        
        print(f"Toggling artwork {art_id} from {curr_status} to {new_status}")
        
        update_res = requests.put(
            f"{API_BASE}/admin/artworks/{art_id}/availability",
            json={"available": new_status},
            headers=headers
        )
        
        print(f"Status Code: {update_res.status_code}")
        print(f"Response: {update_res.text}")
        
    except Exception as e:
        print(f"Local backend not reachable on 8000? Exception: {e}")

if __name__ == "__main__":
    test_availability()
