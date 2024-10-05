import React from 'react';
import './About.css'; 

const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Our International Payment System</h1>
      <p className="about-description">
        Welcome to our International Payment System, designed to provide seamless and secure transactions for our valued customers. As a leading bank in South Africa, we understand the complexities and requirements of international payments, and we are committed to delivering a top-notch service that meets your needs.
      </p>
      <h2 className="about-subtitle">Our Mission</h2>
      <p className="about-description">
        Our mission is to simplify the process of making international payments while ensuring the highest level of security and compliance. We strive to enhance customer satisfaction by providing an intuitive online banking experience, allowing you to focus on what matters most – your business.
      </p>
      <h2 className="about-subtitle">Key Features</h2>
      <ul className="about-features">
        <li>Secure Registration: Customers can easily register by providing their full name, ID number, account number, and password, ensuring that your sensitive information is kept safe.</li>
        <li>Easy Login: Access your account effortlessly using your username, account number, and password.</li>
        <li>International Payment Options: Choose the relevant currency and payment provider, with SWIFT as our primary option for international transactions.</li>
        <li>Efficient Payment Process: Enter the amount, select the provider, and provide the necessary account information and SWIFT code for your transaction.</li>
        <li>Transaction Tracking: After you make a payment, your transaction will be securely stored in our database and visible on our dedicated payments portal for our staff to access.</li>
      </ul>
      <h2 className="about-subtitle">Employee Portal</h2>
      <p className="about-description">
        Our dedicated staff members are pre-registered on the payments portal, allowing them to review transactions and ensure that payments are processed correctly. Our team verifies the payee's account information and SWIFT codes to maintain the integrity of our payment system. Once verified, staff members can submit transactions to SWIFT with just a click, ensuring a smooth and efficient process.
      </p>
      <h2 className="about-subtitle">Commitment to Security</h2>
      <p className="about-description">
        At our bank, we prioritize your security. Our systems are equipped with the latest encryption technologies and security protocols to safeguard your information and transactions. Our dedicated team constantly monitors the system for any suspicious activity, ensuring your peace of mind.
      </p>
      <h2 className="about-subtitle">Get in Touch</h2>
      <p className="about-description">
        We are here to assist you! If you have any questions or need support regarding our International Payment System, please contact our customer service team. We are committed to providing you with the best banking experience possible.
      </p>
    </div>
  );
};

export default About;
