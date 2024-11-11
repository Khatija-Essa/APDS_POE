import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './Verified.css'; // Add the CSS file

export default function Verified() {
    const navigate = useNavigate(); // Hook to access navigation

    // Function to handle redirect
    const handleRedirect = () => {
        navigate('/payment/PaymentData'); // Redirect to /payment/PaymentData
    };

    return (
        <div className="verified-container">
            <div 
                className="verified-content" 
                onClick={handleRedirect} // Add onClick handler for redirection
            >
               <h3>Payment Sent to SWIFT and Verified</h3>
               <p>The payment has been sent to SWIFT and is verified.</p>
            </div>
        </div>
    );
}
