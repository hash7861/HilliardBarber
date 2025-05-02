import React, { useState, useEffect } from 'react';
import './styles.css';

const API_BASE_URL = "http://localhost:5000";
console.log("🔌 API_BASE_URL is:", API_BASE_URL);

function Reservations() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/available-slots`);
                const data = await response.json();
                setAvailableSlots(data.available_slots || []);
                setError('');
            } catch (err) {
                console.error("Error fetching available slots:", err);
                setError("Failed to load available slots. Please refresh.");
            }
        };

        fetchAvailableSlots();
    }, []);

    const formatTimeAMPM = (time) => {
        const [hourStr, minuteStr] = time.split(":");
        let hour = parseInt(hourStr);
        const minute = minuteStr.padStart(2, '0');
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    };

    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateString = maxDate.toISOString().split("T")[0];

    const getFilteredTimeSlots = () => {
        if (!selectedDate) return [];
        return availableSlots
            .filter(slot => slot.startsWith(selectedDate))
            .map(slot => slot.split(" ")[1]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedDate || !selectedTime || !name || !phone) {
            setError("Please fill in all required fields.");
            return;
        }

        const fullTime = `${selectedDate} ${selectedTime}`;

        try {
            const response = await fetch(`${API_BASE_URL}/api/reservations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    phone,
                    time: fullTime
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Appointment booked successfully! See Waitlist tab.");
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setPhone('');
            } else {
                setError(data.error || "Failed to book the appointment.");
            }
        } catch (err) {
            console.error("Error creating reservation:", err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Book Your Appointment</h1>
            <br />
            <h4>Please see details about booking on Home page. Note: This page is still in development</h4>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedTime('');
                        }}
                        min={today}
                        max={maxDateString}
                        required
                    />
                </div>

                <div>
                    <label>Time:</label>
                    <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select a time slot</option>
                        {getFilteredTimeSlots().map((time, idx) => (
                            <option key={idx} value={time}>
                                {formatTimeAMPM(time)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}

                <button
                    type="submit"
                    style={{
                        marginTop: '10px',
                        padding: '10px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '5px'
                    }}
                >
                    Book Appointment
                </button>
            </form>
        </div>
    );
}

export default Reservations;
