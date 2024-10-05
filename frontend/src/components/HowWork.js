import React from 'react';
import './HowWork.css'; 

const HowWork = () => {
  return (
    <div className="how-work-container">
      <h1 className="how-work-title">How Does It Work?</h1>
      <p className="how-work-intro">
        Our international payment system allows customers to make secure international payments through our online banking portal. Here’s how it works:
      </p>

      <h2 className="how-work-step-title">For Customers</h2>
      <ol className="how-work-steps">
        <li>
          <strong>Registration:</strong> Customers must register for the system by providing their full name, ID number, account number, and password. This sensitive information is secured using industry-standard encryption.
        </li>
        <li>
          <strong>Login:</strong> After registering, customers can log in using their username, account number, and password.
        </li>
        <li>
          <strong>Initiate Payment:</strong> Once logged in, customers can enter the amount they need to pay, select the relevant currency, and choose a payment provider (mainly SWIFT in South Africa).
        </li>
        <li>
          <strong>Account Details:</strong> Customers will be prompted to provide the payee's account information and the corresponding SWIFT code.
        </li>
        <li>
          <strong>Finalize Payment:</strong> Customers click the "Pay Now" button to complete the transaction.
        </li>
      </ol>

            <p className="how-work-conclusion">
        Our payment system is designed with security and user experience in mind, ensuring that both customers and employees can navigate the process with ease.
      </p>
    </div>
  );
}

export default HowWork;
