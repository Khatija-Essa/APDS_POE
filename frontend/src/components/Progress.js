import React, { useEffect, useState } from 'react';
import './PaymentData.css';

export default function Progress() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");

    // Fetch payments data on mount and every 10 seconds
    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setError("Access denied. Token required.");
                return;
            }

            try {
                const response = await fetch("https://localhost:3001/payment/get", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch payment data");

                const data = await response.json();
                setPayments(data);
            } catch (err) {
                setError("Failed to fetch payment data.");
                console.error("Error fetching payments:", err);
            }
        };

        fetchPayments();

        // Set up polling for real-time updates every 10 seconds
        const intervalId = setInterval(fetchPayments, 10000);

        return () => clearInterval(intervalId); // Clean up on component unmount
    }, []);

    return (
        <div className="payment-data-container">
            <h3>Payment Progress</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Provider</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.username}</td>
                                <td>{payment.provider}</td>
                                <td>{new Date(payment.timestamp).toLocaleString()}</td>
                                <td>{payment.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">No payments found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
