import requests
import json

BASE_URL = "http://localhost:5001/api"

def test_endpoint(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    print(f"Testing {method} {url}...")
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200 or response.status_code == 201
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    endpoints = [
        ("/health", "GET", None),
        ("/studies/", "GET", None),
        ("/rooms/", "GET", None),
        ("/podcasts/", "GET", None),
        ("/podcasts/search?q=test", "GET", None),
        ("/podcasts/top", "GET", None),
    ]
    
    success_count = 0
    for path, method, data in endpoints:
        if test_endpoint(path, method, data):
            success_count += 1
            
    print(f"\nSummary: {success_count}/{len(endpoints)} tests passed.")
