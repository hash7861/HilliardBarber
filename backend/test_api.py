import requests

BASE_URL = "http://127.0.0.1:5000"

# Test the root endpoint
response = requests.get(f"{BASE_URL}/")
print("GET /:", response.json())

# Test /api/queue
response = requests.get(f"{BASE_URL}/api/queue")
print("GET /api/queue:", response.json())

# Test /api/available-slots
response = requests.get(f"{BASE_URL}/api/available-slots")
print("GET /api/available-slots:", response.json())

# Test /api/reservations
data = {
    "name": "John Doe",
    "phone": "555-555-5555",
    "time": "2025-01-20 12:00"
}
response = requests.post(f"{BASE_URL}/api/reservations", json=data)
print("POST /api/reservations:", response.json())

# Test /api/queue again to see if the reservation updated the queue
response = requests.get(f"{BASE_URL}/api/queue")
print("GET /api/queue (after reservation):", response.json())
