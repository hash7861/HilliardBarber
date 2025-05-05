import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000";

function Waitlist() {
    const [waitlist, setWaitlist] = useState([]);
    const [nowServing, setNowServing] = useState('N/A');
    const [nextSlot, setNextSlot] = useState('Loading...');
    const [animate, setAnimate] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchWaitlist();
        fetchQueueStatus();
        fetchNextAvailableSlot();

        const interval = setInterval(() => {
            fetchWaitlist();
            fetchQueueStatus();
            fetchNextAvailableSlot();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchWaitlist = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/waitlist`);
            const data = await res.json();
            setWaitlist(data.waitlist || []);
        } catch (error) {
            console.error("Error fetching waitlist:", error);
        }
    };

    const fetchQueueStatus = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/queue`);
            const data = await res.json();

            setNowServing(prev => {
                if (data.now_serving?.name && data.now_serving.name !== prev) {
                    setAnimate(true);
                    setTimeout(() => setAnimate(false), 1000);
                }
                return data.now_serving?.name || 'N/A';
            });
        } catch (error) {
            console.error("Error fetching queue status:", error);
        }
    };

    const fetchNextAvailableSlot = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/available-slots`);
            const data = await res.json();
            const todaySlots = (data.available_slots || []).filter(slot => slot.startsWith(today));
            if (todaySlots.length > 0) {
                const time = todaySlots[0].split(" ")[1];
                setNextSlot(convertTo12HourFormat(time));
            } else {
                setNextSlot("Fully Booked");
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
            setNextSlot("Error");
        }
    };

    const convertTo12HourFormat = (timeStr) => {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Barber's Waitlist</h1>

            <div style={{
                border: "2px solid #4d7c0f",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "40px",
                backgroundColor: "#f9fff2",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                maxWidth: "600px",
                marginLeft: "auto",
                marginRight: "auto"
            }}>
                <h2
                    className={animate ? "now-serving-animate" : ""}
                    style={{ color: "red", padding: "8px", borderRadius: "5px" }}
                >
                    Now Serving: {nowServing}
                </h2>

                <h3 style={{ color: "green" }}>
                    Next Slot Available Today: {nextSlot}
                </h3>

                <div style={{ marginTop: "20px", fontSize: "14px", textAlign: "left" }}>
                    <strong>Legend:</strong>
                    <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "8px" }}>
                        <li style={{ marginBottom: "5px" }}>
                            <span style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor: "#ffdddd",
                                border: "1px solid #ccc",
                                marginRight: "8px",
                                verticalAlign: "middle"
                            }}></span>
                            Now Serving
                        </li>
                        <li>
                            <span style={{
                                display: "inline-block",
                                width: "15px",
                                height: "15px",
                                backgroundColor: "#cce5ff",
                                border: "1px solid #ccc",
                                marginRight: "8px",
                                verticalAlign: "middle"
                            }}></span>
                            Appointment Today
                        </li>
                    </ul>
                    <p style={{ marginTop: "12px", fontSize: "13px", color: "#555" }}>
                        <strong>Note:</strong> If the next slot shows <em>Fully Booked</em>, there may be no availability left today.
                        The barber's phone number is <strong>+1 (123) 456-7890</strong>. This list updates every <strong>30 seconds</strong>.
                    </p>
                </div>
            </div>

            <div style={{ overflowX: "auto", width: "100%", marginTop: "20px" }}>
                <table style={{
                    margin: "0 auto",
                    borderCollapse: "collapse",
                    width: "90%",
                    minWidth: "500px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
                }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f4f4f4" }}>
                            <th style={tableHeaderStyle}>#</th>
                            <th style={tableHeaderStyle}>Date</th>
                            <th style={tableHeaderStyle}>Name</th>
                            <th style={tableHeaderStyle}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {waitlist.length > 0 ? (
                            waitlist.map((person, index) => {
                                const [date, time] = person.time.split(" ");
                                const isCurrent = person.name === nowServing;
                                const isToday = date === today;

                                let backgroundColor = index % 2 === 0 ? "#fff" : "#f9f9f9";
                                if (isToday) backgroundColor = "#cce5ff";
                                if (isCurrent) backgroundColor = "#ffdddd";

                                return (
                                    <tr
                                        key={index}
                                        style={{
                                            backgroundColor,
                                            borderBottom: "1px solid #ddd"
                                        }}
                                    >
                                        <td style={tableCellStyle}>{index + 1}</td>
                                        <td style={tableCellStyle}>{date}</td>
                                        <td style={tableCellStyle}>{person.name}</td>
                                        <td style={tableCellStyle}>{convertTo12HourFormat(time)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "10px", fontStyle: "italic" }}>
                                    Reservation queue is empty.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const tableHeaderStyle = {
    padding: "12px",
    fontWeight: "600",
    backgroundColor: "#e9ecef",
    borderBottom: "2px solid #ccc",
    textAlign: "center"
};

const tableCellStyle = {
    padding: "10px",
    textAlign: "center",
    fontSize: "15px"
};

export default Waitlist;
