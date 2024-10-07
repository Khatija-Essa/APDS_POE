// payment.js
import React from 'react';

// Function to handle payment submission
async function submitPayment() {
    // Get payment details from form inputs
    const amount = document.getElementById("amount").value;
    const currency = document.getElementById("currency").value;
    const recipientAccount = document.getElementById("recipientAccount").value;
    const swiftCode = document.getElementById("swiftCode").value;

    // Validate input
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    if (!currency || currency.length !== 3) {
        alert("Please enter a valid 3-letter currency code.");
        return;
    }
    if (!recipientAccount || !/^\d{10}$/.test(recipientAccount)) {
        alert("Recipient account number should be 10 digits.");0
        return;
    }
    if (!swiftCode || swiftCode.length < 8 || swiftCode.length > 11) {
        alert("Please enter a valid SWIFT code (8-11 characters).");
        return;
    }

    // Prepare payment data object
    const paymentData = {
        amount,
        currency: currency.toUpperCase(), // Normalize to uppercase
        recipientAccount,
        swiftCode: swiftCode.toUpperCase(), // Normalize to uppercase
    };

    try {
        // Fetch token from session storage (user is already authenticated)
        const token = sessionStorage.getItem("authToken");

        if (!token) {
            alert("Unauthorized access. Please log in again.");
            return;
        }

        // Send payment data to backend
        const response = await fetch("/api/make-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Pass token for authentication
            },
            body: JSON.stringify(paymentData)
        });

        // Handle backend response
        const result = await response.json();

        if (response.ok) {
            alert("Payment processed successfully");
        } else {
            alert(`Payment failed: ${result.message}`);
        }
    } catch (error) {
        console.error("Payment submission error:", error);
        alert("There was an error processing your payment. Please try again later.");
    }
}

// Attach event listener to the 'Pay Now' button
document.getElementById("payNowButton").addEventListener("click", submitPayment);
