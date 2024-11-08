import React, { useEffect, useState } from 'react';
import './PaymentData.css';

export default function PaymentData() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            setError("Access denied. Token required.");
            return;
        }

        fetch("https://localhost:3001/payment", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setPayments(data);
            })
            .catch((err) => {
                setError("Failed to fetch payment data.");
                console.error("Error fetching payments:", err);
            });
    }, []);

    return (
        <div className="payment-data-container">
            <h3>Employee Payments</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Employee ID</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Date</th>
                        <th>SWIFT Code</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td>{payment.paymentID}</td>
                            <td>{payment.employeeID}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.currency}</td>
                            <td>{payment.date}</td>
                            <td>{payment.swiftCode}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
