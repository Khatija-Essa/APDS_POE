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

        fetch("https://localhost:3001/payment/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to fetch payment data");
                return response.json();
            })
            .then((data) => {
                console.log("Fetched transactions:", data);
                setPayments(data);
            })
            .catch((err) => {
                setError("Failed to fetch payment data.");
                console.error("Error fetching payments:", err);
            });
    }, []);

    return (
        <div className="payment-data-container">
            <h3>Payment Transactions</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Account Number</th>
                        <th>Amount</th>
                        <th>Amount (USD)</th>
                        <th>Currency</th>
                        <th>SWIFT Code</th>
                        <th>Provider</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.length > 0 ? (
                        payments.map((payment) => (
                            <tr key={payment._id}>
                                <td>{payment.username}</td>
                                <td>{payment.accountNumber}</td>
                                <td>{payment.amount.toFixed(2)}</td>
                                <td>{payment.amountUSD.toFixed(2)}</td>
                                <td>{payment.currency}</td>
                                <td>{payment.swiftCode}</td>
                                <td>{payment.provider}</td>
                                <td>{new Date(payment.timestamp).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
