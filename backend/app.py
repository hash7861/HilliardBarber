from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Enable CORS

# Add this route for the root URL
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Hilliard Barber API!"})

reservations = []
barber_start_time = 11  # 11 AM
barber_end_time = 20   # 8 PM

@app.route('/api/queue', methods=['GET'])
def get_queue():
    now = datetime.now()
    current_reservation = next(
        (r for r in reservations if datetime.strptime(r['time'], "%Y-%m-%d %H:%M") <= now),
        None
    )
    waiting_time = len(reservations) * 30  # Assuming 30 minutes per client
    return jsonify({"now_serving": current_reservation, "waiting_time": waiting_time})

@app.route('/api/available-slots', methods=['GET'])
def get_available_slots():
    now = datetime.now()
    available_slots = []

    for day in range(6):
        date = (now + timedelta(days=day)).date()
        for hour in range(barber_start_time, barber_end_time):
            slot_time = datetime(date.year, date.month, date.day, hour)
            if slot_time > now:
                available_slots.append(slot_time.strftime("%Y-%m-%d %H:%M"))

    booked_times = {r['time'] for r in reservations}
    available_slots = [slot for slot in available_slots if slot not in booked_times]
    return jsonify({"available_slots": available_slots})

@app.route('/api/reservations', methods=['POST'])
def create_reservation():
    data = request.get_json()
    name = data.get('name')
    phone = data.get('phone')
    time = data.get('time')

    if not name or not phone or not time:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        reservation_time = datetime.strptime(time, "%Y-%m-%d %H:%M")
        now = datetime.now()
        if reservation_time < now:
            return jsonify({"error": "Cannot book a past time"}), 400
    except ValueError:
        return jsonify({"error": "Invalid time format"}), 400

    reservations.append({"name": name, "phone": phone, "time": time})
    return jsonify({"message": "Reservation created successfully!"})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
