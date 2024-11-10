import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';  // Updated import path

export default function Navbar() {
  const [userType, setUserType] = useState(localStorage.getItem("userType"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleUserTypeChange = () => {
      setUserType(localStorage.getItem("userType"));
    };

    window.addEventListener("userTypeChanged", handleUserTypeChange);
    window.addEventListener("storage", handleUserTypeChange);

    return () => {
      window.removeEventListener("userTypeChanged", handleUserTypeChange);
      window.removeEventListener("storage", handleUserTypeChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserType(null);
    window.dispatchEvent(new Event("userTypeChanged"));
    navigate("/");
  };

  const renderUserNav = () => (
    <ul className="navbar-nav me-auto">
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/">
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/about">
          About
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/howWork">
          How It Works
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/payment">
          Payment
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/payment/progress">
          Payment Progress
        </NavLink>
      </li>
    </ul>
  );

  const renderEmployeeNav = () => (
    <ul className="navbar-nav me-auto">
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/payment/PaymentData">
          Employee Data
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/employee/add">
          Add Employee
        </NavLink>
      </li>
    </ul>
  );

  const renderDefaultNav = () => (
    <ul className="navbar-nav me-auto">
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/">
          Home
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/about">
          About
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink className={({isActive}) => isActive ? "nav-link active-nav-link" : "nav-link"} to="/howWork">
          How It Works
        </NavLink>
      </li>
    </ul>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Money Gold International
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {userType === "user" && renderUserNav()}
          {userType === "employee" && renderEmployeeNav()}
          {!userType && renderDefaultNav()}
          
          {(userType === "user" || userType === "employee") && (
            <button onClick={handleLogout} className="nav-logout-btn">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}