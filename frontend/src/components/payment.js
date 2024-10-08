import React, { useState, useEffect } from 'react';
import './Register.css';

function Payment() {
    const [payment, setPayment] = useState({
        amount: '',
        currency: '',
        recipientAccount: '',
        swiftCode: '',
    });

    const [username, setUsername] = useState('');
    const [error, setError] = useState("");

    // Fetch the username on component load
    useEffect(() => {
        const fetchUsername = async () => {
            const token = localStorage.getItem("jwt");

            if (!token) {
                setError("Unauthorized access. Please log in again.");
                return;
            }

            try {
                const response = await fetch("https://localhost:3001/user/details", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setUsername(result.client_details); // Assuming API response has `client_details`
                } else {
                    setError(`Failed to fetch user details: ${result.message}`);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("There was an error fetching your details. Please try again later.");
            }
        };

        fetchUsername();
    }, []);

    function updatePayment(value) {
        return setPayment((prev) => ({ ...prev, ...value }));
    }

    async function submitPayment(e) {
        e.preventDefault();
        setError("");

        const { amount, currency, recipientAccount, swiftCode } = payment;

        if (!amount || isNaN(amount) || amount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }
        if (!currency || currency.length !== 3) {
            setError("Please enter a valid 3-letter currency code.");
            return;
        }
        if (!recipientAccount || !/^\d{10}$/.test(recipientAccount)) {
            setError("Recipient account number should be 10 digits.");
            return;
        }
        if (!swiftCode || swiftCode.length < 8 || swiftCode.length > 11) {
            setError("Please enter a valid SWIFT code (8-11 characters).");
            return;
        }

        try {
            const token = localStorage.getItem("jwt");

            const response = await fetch("https://localhost:3001/payment/make-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount,
                    currency: currency.toUpperCase(),
                    recipientAccount,
                    swiftCode: swiftCode.toUpperCase(),
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Payment processed successfully");
            } else {
                setError(`Payment failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Payment submission error:", error);
            setError("There was an error processing your payment. Please try again later.");
        }
    }

    return (
        <div className="login-container mt-5">
            <h3 className="login-title mb-3">Make a Payment</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={submitPayment} className="login-form">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        readOnly
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        id="amount"
                        placeholder="Enter amount"
                        value={payment.amount}
                        onChange={(e) => updatePayment({ amount: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="currency" className="form-label">Currency</label>
                    <input
                        type="text"
                        className="form-control"
                        id="currency"
                        placeholder="Enter currency code (e.g., USD)"
                        value={payment.currency}
                        onChange={(e) => updatePayment({ currency: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="recipientAccount" className="form-label">Recipient Account</label>
                    <input
                        type="text"
                        className="form-control"
                        id="recipientAccount"
                        placeholder="Enter 10-digit account number"
                        value={payment.recipientAccount}
                        onChange={(e) => updatePayment({ recipientAccount: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="swiftCode" className="form-label">SWIFT Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="swiftCode"
                        placeholder="Enter SWIFT code"
                        value={payment.swiftCode}
                        onChange={(e) => updatePayment({ swiftCode: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn">Pay Now</button>
            </form>
        </div>
    );
}

export default Payment;
