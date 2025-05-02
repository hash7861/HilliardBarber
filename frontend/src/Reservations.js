import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://172.31.21.190:5000"; // Updated to match Flask server IP

function Reservations() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [nowServing, setNowServing] = useState('');
    const [waitingTime, setWaitingTime] = useState('');

    // Fetch available slots from the backend
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/available-slots`);
                const data = await response.json();
                setAvailableSlots(data.available_slots || []);
            } catch (error) {
                console.error("Error fetching available slots:", error);
            }
        };
        fetchAvailableSlots();
    }, []);

    // Fetch current queue status from the backend
    useEffect(() => {
        const fetchQueueStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/queue`);
                const data = await response.json();
                setNowServing(data.now_serving?.name || 'N/A');
                setWaitingTime(`${data.waiting_time || 0} minutes`);
            } catch (error) {
                console.error("Error fetching queue status:", error);
            }
        };
        fetchQueueStatus();
    }, []);

    // Validate selected date
    const isDateWithinRange = (date) => {
        const today = new Date();
        const selected = new Date(date);
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 6); // 6 days from today
        return selected >= today && selected <= maxDate;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!selectedTime || !name || !phone) {
            setError('Please fill in all fields.');
            return;
        }

        if (!isDateWithinRange(selectedDate)) {
            setError('Selected date is outside the allowed range.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    time: selectedTime,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Appointment booked successfully!');
                setSelectedDate('');
                setSelectedTime('');
                setName('');
                setPhone('');
            } else {
                setError(data.error || 'Failed to book the appointment.');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div>
            <h1>Book Your Appointment</h1>

            <div>
                <h2>Now Serving: {nowServing}</h2>
                <h3>Estimated Waiting Time: {waitingTime}</h3>
            </div>

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
                        <option value="" disabled>
                            Select a time slot
                        </option>
                        {availableSlots
                            .filter((slot) => slot.startsWith(selectedDate))
                            .map((slot, index) => (
                                <option key={index} value={slot}>
                                    {slot}
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
                        required
                    />
                </div>

                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>{success}</div>}

                <button type="submit">Book Appointment</button>
            </form>

            <div>
                <p>Barber's Working Hours: 11:00 AM - 8:00 PM</p>
            </div>
        </div>
    );
}

export default Reservations;
