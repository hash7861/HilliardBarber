from flask import Flask, request, jsonify, render_template, send_from_directory, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
from dateutil import parser
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Create Flask app with static and template folders
app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "super_secret_key"  # Change this in production
CORS(app, supports_credentials=True)  # Enable session cookie over CORS

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

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Create DB tables and a default admin user if not exists
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username="admin").first():
        hashed_pw = generate_password_hash("admin")
        db.session.add(User(username="admin", password_hash=hashed_pw))
        db.session.commit()

# React frontend entry point
@app.route("/")
def index():
    return render_template("index.html")

# Serve static files like bundle.js
@app.route("/static/<path:filename>")
def static_files(filename):
    return send_from_directory(os.path.join(app.root_path, "static"), filename)

# API: Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401

# API: Logout
@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out"})

# API: Check login session
@app.route('/api/check_login', methods=['GET'])
def check_login():
    return jsonify({"logged_in": 'user_id' in session})

# API: Get current queue status or serve next customer
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

# API: Return available reservation slots
@app.route('/api/available-slots', methods=['GET'])
def get_available_slots():
    now = datetime.now()
    available_slots = []

    for day in range(7):
        date = (now + timedelta(days=day)).date()
        weekday = date.weekday()  # Monday = 0, Sunday = 6

        if weekday == 6:
            continue  # Skip Sundays

        for hour in range(11, 20):  # 11 AM to 7:30 PM
            for minute in [0, 30]:
            # Skip Friday 2 PM – 4 PM
                if weekday == 4 and (hour == 14 or hour == 15):
                    continue

                slot_time = datetime(date.year, date.month, date.day, hour, minute)

                # Filter today's slots to be in the future only
                if slot_time.date() == now.date() and slot_time <= now:
                    continue

                formatted_slot = slot_time.strftime("%Y-%m-%d %H:%M")
                available_slots.append(formatted_slot)


    booked_times = {r.time for r in Reservation.query.with_entities(Reservation.time).all()}
    available_slots = [slot for slot in available_slots if slot not in booked_times]

    return jsonify({"available_slots": available_slots})

# API: Create a new reservation
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

# API: Get full waitlist
@app.route('/api/waitlist', methods=['GET'])
def get_waitlist():
    reservations = Reservation.query.order_by(Reservation.time).all()
    return jsonify({"waitlist": [r.to_dict() for r in reservations]})

# API: Remove a reservation by ID (must be logged in)
@app.route('/api/remove_client/<int:client_id>', methods=['DELETE'])
def remove_client(client_id):
    if 'user_id' not in session:
        return jsonify({"error": "Unauthorized"}), 403

    reservation = Reservation.query.get(client_id)
    if reservation:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Reservation removed successfully!"})
    else:
        return jsonify({"error": "Reservation not found"}), 404

# Start Flask app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host="localhost", port=5000, debug=True)
