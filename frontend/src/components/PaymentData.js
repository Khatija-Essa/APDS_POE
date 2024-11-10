import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentData.css';

export default function PaymentData() {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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

    // Handle payment approval
    const handleApproveClick = async (paymentId) => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`https://localhost:3001/payment/approve-payment/${paymentId}`, {
                method: "PUT",  // Use PUT to update the payment status
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Update payment status in the state to "approved"
                setPayments(prevPayments =>
                    prevPayments.map(payment =>
                        payment._id === paymentId ? { ...payment, status: "approved" } : payment
                    )
                );
                navigate("/verified");
            } else {
                const result = await response.json();
                setError(result.message || "Failed to approve payment.");
            }
        } catch (error) {
            setError("Failed to approve payment.");
            console.error("Approval error:", error);
        }
    };

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
                                <td>{payment.status}</td>
                                <td>
                                    {payment.status === "in progress" && (
                                        <button
                                            onClick={() => handleApproveClick(payment._id)}
                                            className="btn btn-success"
                                        >
                                            Approve Payment
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="10">No payments found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
