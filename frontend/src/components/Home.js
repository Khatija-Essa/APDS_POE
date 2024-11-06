import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const goToCustomerLogin = () => {
    navigate('/login');
  };

  const goToAdminLogin = () => {
    navigate('/employee/login');  // Corrected route path
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Money Gold</h1>
      <p className="home-description">
        At Money Gold, we provide a secure platform for international payments. 
        Customers can easily register to make payments by entering their details, 
        selecting amounts, currencies, and payment providers, primarily using SWIFT.
      </p>
      <p className="home-description">
        Our dedicated portal allows pre-registered staff to manage transactions 
        and ensure secure processing for all international payments. 
        Start your journey with us today!
      </p>
      <div className="button-group">
        <button onClick={goToCustomerLogin} className="home-button">
          Customer Login
        </button>
        <button onClick={goToAdminLogin} className="home-button">
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default Home;
