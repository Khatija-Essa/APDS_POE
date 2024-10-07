import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        username: "",
        email: "",
        idNumber: "",
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
            const response = await fetch("https://localhost:3001/user/signup", {
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

            alert("Registration successful!");
            navigate("/HowWork");
        } catch (error) {
            console.error("Registration error:", error);
            setError(`Registration failed: ${error.message}`);
        }
    }

    return (
        <div className="login-container mt-5">
            <h3 className="login-title mb-3">Register</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit} className="login-form">
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={form.fullName}
                        onChange={(e) => updateForm({ fullName: e.target.value })}
                        required
                    />
                </div>
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
                    <label htmlFor="idNumber" className="form-label">ID Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="idNumber"
                        value={form.idNumber}
                        onChange={(e) => updateForm({ idNumber: e.target.value })}
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
                <button type="submit" className="btn">Register</button>
                </form>
            <div className="register-link mt-3">
                <p className="text-center">
                    Do have an account? <a href="/login" className="register-text">Login here</a>
                </p>
            </div>
        </div>
    );
}
