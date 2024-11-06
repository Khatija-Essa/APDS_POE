import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './employeeLogin.css';

export default function EmployeeLogin() {
    const [form, setForm] = useState({
        employeeID: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function handleSubmit(e) { // Renamed to match the onSubmit handler in the form
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://localhost:3001/employee/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            if (data.token) {
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("employeeID", data.employeeID);
                navigate("/employee/add"); 
            } else {
                throw new Error("Login failed: No token received");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(`Login failed: ${error.message}`);
        }
    }

    return (
        <div className="employee-login-container">
            <h2 className="employee-login-title">Employee Login</h2>
            <form onSubmit={handleSubmit} className="employee-login-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label htmlFor="employeeID" className="employee-form-label">Employee ID:</label>
                    <input
                        type="text"
                        id="employeeID"
                        className="employee-form-control"
                        value={form.employeeID}
                        onChange={(e) => updateForm({ employeeID: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email" className="employee-form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="employee-form-control"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="employee-form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="employee-form-control"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="employee-btn">Login</button>

                <div className="employee-register-link">
                    Don't have an account? 
                    <span className="employee-register-text"> Register</span>
                </div>
            </form>
        </div>
    );
}
