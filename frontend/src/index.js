import React from 'react';
import ReactDOM from 'react-dom/client';  // Make sure to import from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  // Use Link for navigation
import './styles.css';

function Home() {
    return (
        <div>
            <h1>Welcome to the Hilliard Barber Shop!</h1>
            <p>Welcome to the website. My name is Ibrahim. I am a barber here based in Hilliard, Ohio for the past 15 years. More personal information can be here.</p>
            <h2>Location/Hours</h2>
            <p>My barber shop is located in Tinapple Plaza on 3249 Hilliard Rome Road, Hilliard, Ohio, 43026. It is situated near the Hippie Hut Smoke Shop and Pine Coast Restaurant. Directions to the barber shop can be found here.</p>
            <h2>Booking a Reservation</h2>
            <p>To book a reservation for your next visit, please click on <Link to="/reservations">Reservations</Link></p>
        </div>
    );
}

function Reservations() {
    return (
        <div>
            <h1>Reservations</h1>
            <p>Book your appointment here!</p>
            {/* Add a form or other reservation-related content */}
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>  {/* Use Link instead of <a> */}
                        </li>
                        <li>
                            <Link to="/reservations">Reservations</Link>  {/* Use Link instead of <a> */}
                        </li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/reservations" element={<Reservations />} />
                </Routes>
            </div>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
