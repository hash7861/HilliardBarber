from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from dateutil import parser

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS immediately after app is created

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///barber_queue.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Reservation model
class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(16), nullable=False)  # Format: YYYY-MM-DD HH:MM

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "time": self.time
        }

# Create DB tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Hilliard Barber API!"})

@app.route('/api/queue', methods=['GET', 'DELETE'])
def manage_queue():
    current_reservation = Reservation.query.order_by(Reservation.time).first()

    if request.method == 'GET':
        waiting_time = Reservation.query.count() * 30  # Estimate: 30 min per client
        return jsonify({
            "now_serving": current_reservation.to_dict() if current_reservation else None,
            "waiting_time": waiting_time
        })

    elif request.method == 'DELETE':
        if current_reservation:
            db.session.delete(current_reservation)
            db.session.commit()
            next_reservation = Reservation.query.order_by(Reservation.time).first()
            return jsonify({
                "message": "Customer served and removed from queue!",
                "next_serving": next_reservation.to_dict() if next_reservation else None
            })
        return jsonify({"error": "No customers in queue"}), 404

@app.route('/api/available-slots', methods=['GET'])
def get_available_slots():
    now = datetime.now()
    available_slots = []

    for day in range(7):
        date = (now + timedelta(days=day)).date()
        for hour in range(11, 20):  # From 11:00 AM to 7:30 PM
            for minute in [0, 30]:
                slot_time = datetime(date.year, date.month, date.day, hour, minute)
                if slot_time > now:
                    formatted_slot = slot_time.strftime("%Y-%m-%d %H:%M")
                    available_slots.append(formatted_slot)

    booked_times = {r.time for r in Reservation.query.with_entities(Reservation.time).all()}
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
        reservation_time = parser.parse(time)
        now = datetime.now()

        if reservation_time < now:
            return jsonify({"error": "Cannot book a past time"}), 400

        new_reservation = Reservation(
            name=name,
            phone=phone,
            time=reservation_time.strftime("%Y-%m-%d %H:%M")
        )
        db.session.add(new_reservation)
        db.session.commit()

        return jsonify({"message": "Reservation created successfully!"})

    except ValueError:
        return jsonify({"error": "Invalid time format"}), 400

@app.route('/api/waitlist', methods=['GET'])
def get_waitlist():
    reservations = Reservation.query.order_by(Reservation.time).all()
    return jsonify({"waitlist": [r.to_dict() for r in reservations]})

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="localhost", port=5000, debug=True)
