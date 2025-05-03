# HilliardBarber

// began project on Jan 18. So far setting the backbones for this project. Got the server on React to work.
// all that the website prints is "Welcome to abdurrahim's Hilliard barbershop"

// March 17th
// major progress made; finally configured the Reservations tab
// now starting to work on figuring out SQL to keep a database for a Waitlist 

// May 2nd
// completed hosting process via Render.com; after what felt like forever this project is DONE
// continuous tweaking being done 

# HilliardBarberCuts

A full-stack web application that enables clients to view service options, book appointments, and check their place in a real-time waitlist for a barber shop in Hilliard, Ohio. Built with a custom React frontend and Flask backend, and deployed as a unified web service on Render.

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

- **Responsive Barber Shop Landing Page**
- **Book a Reservation** — clients can choose from available time slots
- **Live Waitlist** — barbers can view who's up next and how long each wait is
- **Real-Time Countdown** — shows how long until each appointment
- **Data Persistence** — reservations stored in a local SQLite database
- **Modern UI/UX** — styled and optimized for web and mobile

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

- Admin login/dashboard for barbers
- SMS appointment reminders
- Calendar view for reservations
- More responsive design on smaller devices

---

## 📬 Contact

**Ibrahim Hashmi**  
Computer Science & Engineering  
The Ohio State University  
Email: hashmi.48@osu.edu  
GitHub: [https://github.com/hash7861](https://github.com/hash7861)
