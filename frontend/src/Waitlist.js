import React, { useState, useEffect } from 'react'; 

const API_BASE_URL = "http://localhost:5000";

function Waitlist() {
    const [waitlist, setWaitlist] = useState([]);
    const [nowServing, setNowServing] = useState('N/A');
    const [countdown, setCountdown] = useState(null);
    const [animate, setAnimate] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    function convertTo12HourFormat(timeStr) {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    }

    function formatCountdown(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return hrs > 0
            ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
            : `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const fetchWaitlist = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/waitlist`);
            const data = await response.json();
            setWaitlist(data.waitlist || []);
        } catch (error) {
            console.error("Error fetching waitlist:", error);
        }
    };

    const fetchQueueStatus = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/queue`);
            const data = await response.json();

            setNowServing(prev => {
                if (data.now_serving?.name && data.now_serving.name !== prev) {
                    setAnimate(true);
                    setTimeout(() => setAnimate(false), 1000);
                }
                return data.now_serving?.name || 'N/A';
            });

            const { now_serving } = data;
            const todaysClients = (data.waitlist || []).filter(p => p.time.split(" ")[0] === today);
            const indexNowServing = todaysClients.findIndex(p => p.name === data.now_serving?.name);
            const peopleLeft = indexNowServing !== -1 ? todaysClients.length - (indexNowServing + 1) : 0;
            const estimatedWait = peopleLeft * 30 * 60; // in seconds

            setCountdown(peopleLeft > 0 ? estimatedWait : null);
        } catch (error) {
            console.error("Error fetching queue status:", error);
        }
    };

    const serveNextCustomer = async () => {
        const confirm = window.confirm("Are you sure you want to serve the next customer?");
        if (!confirm) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/queue`, {
                method: "DELETE",
            });
            const data = await response.json();
            console.log(data.message);

            fetchWaitlist();
            fetchQueueStatus();
        } catch (error) {
            console.error("Error serving next customer:", error);
        }
    };

    useEffect(() => {
        fetchWaitlist();
        fetchQueueStatus();
        const interval = setInterval(() => {
            fetchWaitlist();
            fetchQueueStatus();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (countdown === null || countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div style={{ textAlign: 'center', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Barber's Waitlist</h1>

            <div style={{
                border: "2px solid #4d7c0f",
                borderRadius: "10px",
                padding: "20px",
                margin: "0 auto 40px auto",
                maxWidth: "600px",
                backgroundColor: "#f9fff2",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
            }}>
                <h2
                    className={animate ? "now-serving-animate" : ""}
                    style={{ color: "red", padding: "8px", borderRadius: "5px" }}
                >
                    Now Serving: {nowServing}
                </h2>

                <h3 style={{ color: "green" }}>
                    Estimated Waiting Time Today: {countdown === null ? "N/A" : countdown > 0 ? formatCountdown(countdown) : "Waiting..."}
                </h3>

                <button 
                    onClick={serveNextCustomer}
                    style={{
                        padding: "10px 15px",
                        fontSize: "16px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }}
                >
                    Serve Next Customer
                </button>

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
                <strong>Note:</strong> If the estimated waiting time says <em>N/A</em>, there may be no one currently in line.
                Please refresh the page to get the latest status <strong>every 30 seconds</strong>
                This could mean the barber is available soon. Feel free to <strong>book now</strong> or <strong>call the barber</strong> to check walk-in availability.
                The barber's phone number is <strong>+1 (123) 456-7890</strong>.
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
                                if (isToday) backgroundColor = "#cce5ff"; // blue for today
                                if (isCurrent) backgroundColor = "#ffdddd"; // red for now serving

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