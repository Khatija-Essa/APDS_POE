import React, { useEffect, useState } from 'react';
import './PaymentData.css';

export default function PaymentData() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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
    }, []);

    // Verify payment function
    const verifyPayment = async (paymentId) => {
        const token = localStorage.getItem("jwt");

        try {
            const response = await fetch(`https://localhost:3001/payment/verify/${paymentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Failed to verify payment");

            setPayments((prev) =>
                prev.map((payment) =>
                    payment._id === paymentId ? { ...payment, verified: true } : payment
                )
            );
            setMessage("Payment successfully verified.");
        } catch (err) {
            setMessage("Error verifying payment.");
            console.error("Error verifying payment:", err);
        }
    };

   
    

    return (
        <div className="payment-data-container">
            <h3>Payment Transactions</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-info">{message}</div>}
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
                        <th>Status</th>
                        <th>Actions</th>
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
                                <td>{payment.verified ? "Verified" : "Pending"}</td>
                                <td>
                                    <button
                                        onClick={() => verifyPayment(payment._id)}
                                        disabled={payment.verified}
                                        className="btn btn-success"
                                    >
                                        Verify
                                    </button>
                                    
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" className="text-center">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
