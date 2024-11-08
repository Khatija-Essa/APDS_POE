import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // Retrieve user type from localStorage
  const userType = localStorage.getItem("userType"); // "employee" or "user"

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>

            {userType === "employee" ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/employeeData">
                    Employee Data
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/employeeAdd">
                    Add Employee
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/about">
                    About
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/howWork">
                    How It Works
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/payment">
                    Payment
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
