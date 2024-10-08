import React, { useState, useEffect } from 'react';
import './Payment.css';

const exchangeRates = {
    USD: 1,
    EUR: 0.84,
    GBP: 0.72,
    JPY: 110.23,
    // Add more currencies as needed
};

function Payment() {
    const [payment, setPayment] = useState({
        username: '',
        accountNumber: '',
        amount: '',
        currency: 'USD',
        swiftCode: '',
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            const token = localStorage.getItem("jwt");

            if (!token) {
                setError("No authentication token found. Please log in again.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("https://localhost:3001/payment/details", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (response.ok) {
                    setPayment(prev => ({ 
                        ...prev, 
                        username: result.username,
                        accountNumber: result.accountNumber
                    }));
                } else {
                    setError(`Failed to fetch user details: ${result.message}`);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("There was an error connecting to the server. Please check your internet connection and try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    function updatePayment(value) {
        return setPayment((prev) => ({ ...prev, ...value }));
    }

    async function submitPayment(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { username, accountNumber, amount, currency, swiftCode } = payment;

        if (!username || !accountNumber || !amount || !currency || !swiftCode) {
            setError("All fields are required.");
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
                    username,
                    accountNumber,
                    amount,
                    currency,
                    swiftCode,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess(`Payment processed successfully. Amount in USD: $${result.amountUSD}`);
                // Clear the form after successful submission
                setPayment(prev => ({
                    ...prev,
                    amount: '',
                    currency: 'USD',
                    swiftCode: '',
                }));
            } else {
                setError(`Payment failed: ${result.message}`);
            }
        } catch (error) {
            console.error("Payment submission error:", error);
            setError("There was an error processing your payment. Please check your internet connection and try again.");
        }
    }

    if (loading) {
        return <div className="loading">Loading user details...</div>;
    }

    return (
        <div className="payment-container">
            <h2 className="payment-title">Make a Payment</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={submitPayment} className="payment-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={payment.username}
                            onChange={(e) => updatePayment({ username: e.target.value })}
                            required
                            placeholder="Enter username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="accountNumber">Account Number</label>
                        <input
                            type="text"
                            id="accountNumber"
                            value={payment.accountNumber}
                            onChange={(e) => updatePayment({ accountNumber: e.target.value })}
                            required
                            placeholder="Enter account number"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="amount">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            value={payment.amount}
                            onChange={(e) => updatePayment({ amount: e.target.value })}
                            required
                            placeholder="Enter amount"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="currency">Currency</label>
                        <select
                            id="currency"
                            value={payment.currency}
                            onChange={(e) => updatePayment({ currency: e.target.value })}
                            required
                        >
                            {Object.keys(exchangeRates).map(currency => (
                                <option key={currency} value={currency}>{currency}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="swiftCode">SWIFT Code</label>
                    <input
                        type="text"
                        id="swiftCode"
                        value={payment.swiftCode}
                        onChange={(e) => updatePayment({ swiftCode: e.target.value })}
                        required
                        placeholder="Enter SWIFT code"
                    />
                </div>
                <button type="submit" className="submit-button">Pay Now</button>
            </form>
        </div>
    );
}

export default Payment;