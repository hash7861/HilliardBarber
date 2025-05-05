import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Reservations from './Reservations';  
import Waitlist from './Waitlist';  
import Services from './Services';
import Administration from './Administration';
import Login from './Login';
import './styles.css';

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to Hilliard Cuts!</h1>
            <br />
            <h4 className="intro-text">
                <strong>Welcome to Hilliard Cuts! I'm Abdur Raheem, your neighborhood barber with over 10 years of experience. 
                Whether you're looking for a sharp fade, a classic cut, or a clean beard lineup — I've got you covered. 
                Let's get you looking your best.</strong>
            </h4>

            <section className="info-section">
                <h2>📍Location & Hours</h2>
                <br />
                <p>
                    Our shop is located at <strong>3249 Hilliard Rome Road, Hilliard, Ohio, 43026</strong> at the Tinapple Plaza. 
                    We are located in the same plaza as Qamaria, Pine Coast Restaurant, and Hippie Hut Smoke Shop.
                    <strong>We accept cash and card payments!</strong>
                </p>
                <br />
                <p className="highlight">📅 Open Hours: <strong>11 AM - 8 PM (Closed on Sundays; Fridays 2 PM - 4 PM for Jumua Salah)</strong></p>
            </section>

            <section className="info-section">
                <h2>💈Our Services</h2>
                <br />
                <p>
                    I specialize in a <strong>variety of grooming services</strong>, including precise skin fades, taper fades, beard lineups, 
                    edge-ups, and kids’ cuts — all done with attention to <strong>detail and care</strong>. I stay up to date with the latest 
                    styles and techniques to ensure every client leaves the chair looking and feeling their best.
                </p>
                <br />
                <p>
                    <strong>For a complete list of services and their prices, click the button below:</strong>
                </p>
                <Link to="/services" className="cta-button">View Services</Link>
            </section>

            <section className="info-section">
                <h2>✂️ Booking a Reservation</h2>
                <br />
                <p>
                    Appointment bookings can be made same day up to <strong>6 days in advance!</strong><br />
                    Book your appointment <strong>in advance</strong> to ensure you get the time slot you desire.<br />
                    Each appointment approximately takes <strong>30 minutes</strong>, depending on the service.<br />
                    We also accept walk-ins, but please note that it <strong>depends on the waitlist time.</strong><br />
                    <strong>To book an appointment, click the button below:</strong>
                </p>
                <Link to="/reservations" className="cta-button">Book an Appointment</Link>
            </section>

            <section className="questions">
                <h2>📩 Questions & Feedback</h2>
                <br />
                <p>
                    To ask any questions or provide any suggestions to this website, please email us at 
                    <strong> (store email address) </strong> with your name, phone number, and appointment details.
                </p>
            </section>

            <section className="reviews-section">
                <h2>⭐ Customer Reviews</h2>
                <br />
                <p>
                    We value your experience at Hilliard Cuts! Share your experience with us. 
                    We hope to see you soon at Hilliard Cuts.
                </p>
                <a
                    href="https://www.google.com/maps/search/Hilliard+Barber+Shop+reviews"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cta-button"
                >
                    Leave a Google Review
                </a>
            </section>
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check session on load
        fetch('http://localhost:5000/api/check_login', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setIsLoggedIn(data.logged_in));
    }, []);

    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/reservations">Reservations</Link></li>
                        <li><Link to="/waitlist">Waitlist</Link></li>
                        <li><Link to="/login">Admin Login</Link></li>
                    </ul>
                </nav>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/waitlist" element={<Waitlist />} />
                    <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
                    <Route path="/administration" element={
                        isLoggedIn ? <Administration /> : <Navigate to="/login" />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
