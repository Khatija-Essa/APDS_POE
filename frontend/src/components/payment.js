import React, { useState, useEffect } from 'react';
import './Payment.css';

const exchangeRates = {
    USD: 1,
    EUR: 0.84,
    GBP: 0.72,
    JPY: 110.23,
};

const Payment = () => {
    const [payment, setPayment] = useState({
        username: '',
        accountNumber: '',
        amount: '',
        currency: 'USD',
        swiftCode: '',
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) {
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
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
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
            setError("Payment processing error. Please try again.");
        }
    }

    if (loading) {
        return <div className="loading">Loading user details...</div>;
    }

    return (
        <div className="payment-container">
            <div className="payment-form-container">
                <h2 className="payment-title">Make a Payment</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <form onSubmit={submitPayment} className="payment-form">
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
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
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

                    <button type="submit" className="submit-button">
                        Pay Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
