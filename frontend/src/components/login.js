import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

export default function Login() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        accountNumber: "",
        password: "",
    });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    function updateForm(value) {
        return setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("https://localhost:3001/user/login/", {
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
                localStorage.setItem("username", data.username);
                localStorage.setItem("role", data.role); // Assuming role is returned from the backend
                
                // Check the role and navigate accordingly
                if (data.role === "employee") {
                    navigate("/employeeDashboard"); // Redirect to employee dashboard
                } else {
                    navigate("/userDashboard"); // Redirect to user dashboard
                }
            } else {
                throw new Error("Login failed: No token received");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(`Login failed: ${error.message}`);
        }
    }

    return (
        <div className="login-container mt-5">
            <h3 className="login-title mb-3">Login</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit} className="login-form">
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={form.username}
                        onChange={(e) => updateForm({ username: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="accountNumber" className="form-label">Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="accountNumber"
                        value={form.accountNumber}
                        onChange={(e) => updateForm({ accountNumber: e.target.value })}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="btn">Login</button>
            </form>
            <div className="register-link mt-3">
                <p className="text-center">
                    Don't have an account? <a href="/register" className="register-text">Register here</a>
                </p>
            </div>
        </div>
    );
}
