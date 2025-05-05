# HilliardBarber

// began project on Jan 18. So far setting the backbones for this project. Got the server on React to work.
// all that the website prints is "Welcome to abdurrahim's Hilliard barbershop"

// March 17th
// major progress made; finally configured the Services and Reservations tabs
// now starting to work on figuring out SQL to keep a database for a Waitlist 

// May 2nd
// completed hosting process via Render.com; after what felt like forever this project is DONE
// continuous tweaking being done 

// May 5th
// configured admin login access, enabling it with tasks to call and remove customers from the queue; some other tedious changes were made
// website is deployed, awaiting response from the client(s) before making new changes

# HilliardBarberCuts

A full-stack web application built to modernize how a local barber shop in Hilliard, Ohio manages client appointments and walk-in traffic. It enables clients to book appointments and check their place in a real-time waitlist, while providing barbers with a dedicated admin view to manage the queue efficiently. The system is built with a custom React frontend and a Flask backend, and is deployed as a single unified service on Render.

---

## 🚀 Live Demo

Visit the live site: [https://hilliardbarbercuts.onrender.com](https://hilliardbarbercuts.onrender.com)

---

## 📦 Tech Stack

### Frontend
- **React** — component-based UI
- **JavaScript (ES6+)** — interactivity
- **Webpack** — custom build setup
- **HTML/CSS** — responsive styling

### Backend
- **Flask** — web framework (API + routing)
- **Flask-CORS** — development access across ports
- **Flask-SQLAlchemy** — ORM for managing reservations
- **Gunicorn** — WSGI server for production hosting
- **python-dateutil** — time parsing/validation

### Database
- **SQLite** — lightweight relational database (locally persisted)

### Deployment
- **Render.com** — deployed as a single web service with static frontend + dynamic backend

---

## ✨ Features

✅ Responsive Landing Page — built for both mobile and desktop

📅 Appointment Booking — choose from only valid time slots (no Sundays or blocked hours)

🔐 Admin Dashboard — secure view for barbers to monitor and manage clients

📋 Live Waitlist — barbers and clients can see who is on the chair, who is next for that day, and who else is on the waitlist

⏱ Next Appointment Times For Today — informs customers the next available appointment for that day

💾 Data Persistence — all reservations stored in a SQLite database

📆 Date Restrictions — bookings limited to current day up to one week ahead

📱 Modern UI/UX — user-friendly design tailored for simplicity and clarity

---

## 📁 Project Structure

HilliardBarber/
├── backend/
│ ├── app.py
│ ├── templates/
│ │ └── index.html
│ ├── static/
│ │ └── bundle.js
│ ├── requirements.txt
│ └── ...
├── frontend/
│ ├── src/
│ ├── dist/
│ └── ...


---

## 🧑‍💻 How to Run Locally

1. Clone the repository  
   `git clone https://github.com/hash7861/HilliardBarber.git`

2. Navigate to backend  
   `cd HilliardBarber/backend`

3. Create virtual environment (optional but recommended)  
   `python -m venv venv && source venv/bin/activate` (Linux/macOS)  
   `venv\Scripts\activate` (Windows)

4. Install dependencies  
   `pip install -r requirements.txt`

5. Run the app  
   `python app.py`

6. Frontend is served from Flask (no separate React server needed)

---

## 📌 Future Improvements

- SMS appointment reminders
- More responsive design on smaller devices
- Add more Services and visual pictures to Home/Services tab
- Allocate more days for bookings (right now it is 6 days in advance)
- Enable a cleaner view to see upcoming reservations/bookings on the Waitlist Page

---

## 📬 Contact

**Ibrahim Hashmi**  
Computer Science & Engineering  
The Ohio State University  
Email: hashmi.48@osu.edu  
GitHub: [https://github.com/hash7861](https://github.com/hash7861)
