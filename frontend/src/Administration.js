import React, { useState, useEffect } from 'react';

const API_BASE_URL = "http://localhost:5000";

function Administration() {
    const [waitlist, setWaitlist] = useState([]);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchWaitlist();
    }, []);

    const fetchWaitlist = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/waitlist`, {
                credentials: 'include'
            });
            const data = await response.json();
            setWaitlist(data.waitlist || []);
        } catch (error) {
            console.error("Error fetching waitlist:", error);
        }
    };

    const handleRemove = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this client?");
        if (!confirmDelete) return;

        try {
            await fetch(`${API_BASE_URL}/api/remove_client/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            fetchWaitlist();
        } catch (error) {
            console.error("Error removing client:", error);
        }
    };

    const handleServeNext = async () => {
        const confirmServe = window.confirm("Serve the next client in line?");
        if (!confirmServe) return;

        try {
            await fetch(`${API_BASE_URL}/api/queue`, {
                method: 'DELETE',
                credentials: 'include'
            });
            fetchWaitlist();
        } catch (error) {
            console.error("Error serving next customer:", error);
        }
    };

    const convertTo12HourFormat = (timeStr) => {
        const [hourStr, minuteStr] = timeStr.split(":");
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12 || 12;
        return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    };

    const formatDateMMDDYYYY = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${month}/${day}/${year}`;
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '10px', color: '#b35c00' }}>📋 Manager Dashboard</h2>

            <button
                onClick={handleServeNext}
                style={{
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    marginBottom: "30px"
                }}
            >
                ✅ Serve Next Customer
            </button>

            {waitlist.length === 0 ? (
                <p>No clients in the waitlist.</p>
            ) : (
                <div style={{ overflowX: "auto", width: "100%" }}>
                    <table style={{
                        margin: "0 auto",
                        borderCollapse: "collapse",
                        width: "90%",
                        minWidth: "600px",
                        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f4f4f4" }}>
                                <th style={tableHeaderStyle}>#</th>
                                <th style={tableHeaderStyle}>Name</th>
                                <th style={tableHeaderStyle}>Date</th>
                                <th style={tableHeaderStyle}>Time</th>
                                <th style={tableHeaderStyle}>Phone</th>
                                <th style={tableHeaderStyle}>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitlist.map((entry, index) => {
                                const [dateStr, timeStr] = entry.time.split(" ");
                                const formattedDate = formatDateMMDDYYYY(dateStr);
                                const formattedTime = convertTo12HourFormat(timeStr);
                                const isToday = dateStr === today;
                                const backgroundColor = isToday ? "#cce5ff" : index % 2 === 0 ? "#fff" : "#f9f9f9";

                                return (
                                    <tr key={entry.id} style={{ backgroundColor, borderBottom: "1px solid #ddd" }}>
                                        <td style={tableCellStyle}>{index + 1}</td>
                                        <td style={tableCellStyle}>{entry.name}</td>
                                        <td style={tableCellStyle}>{formattedDate}</td>
                                        <td style={tableCellStyle}>{formattedTime}</td>
                                        <td style={tableCellStyle}>{entry.phone}</td>
                                        <td style={tableCellStyle}>
                                            <button
                                                onClick={() => handleRemove(entry.id)}
                                                style={{
                                                    backgroundColor: "#b36b00",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    padding: "8px 14px",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                🗑️ Remove
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
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

export default Administration;
