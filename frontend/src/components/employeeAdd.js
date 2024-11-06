import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './EmployeeAdd.css';

function isTokenExpired(token) {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return currentTime > payload.exp;
}

export default function EmployeeAdd() {
    const [form, setForm] = useState({
        fullName: "",
        employeeID: "",
        email: "",
        role: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("jwt");

            if (isTokenExpired(token)) {
                localStorage.removeItem("jwt");
                throw new Error("Session expired. Please log in again.");
            }

            if (!token) {
                throw new Error("Access denied. Token required.");
            }

            const response = await fetch("https://localhost:3001/employee/add-employee/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            setSuccessMessage("Employee successfully added!");
            setTimeout(() => {
                navigate("/employeeData");
            }, 2000);

        } catch (error) {
            console.error("Error adding employee:", error);
            setError(`Failed to add employee: ${error.message}`);
        }
    }

    return (
        <div className="employee-add-container mt-5">
            <h3 className="employee-add-title mb-3">Add New Employee</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={onSubmit} className="employee-add-form">
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
                    <label htmlFor="employeeID" className="form-label">Employee ID</label>
                    <input
                        type="text"
                        className="form-control"
                        id="employeeID"
                        value={form.employeeID}
                        onChange={(e) => updateForm({ employeeID: e.target.value })}
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
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Role</label>
                    <select
                        className="form-select"
                        id="role"
                        value={form.role}
                        onChange={(e) => updateForm({ role: e.target.value })}
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="employee">Employee</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add Employee</button>
            </form>
            <div className="view-database-link mt-3">
                <p className="text-center">
                    Don't need to add a new employee? 
                    <a href="/employeeData" className="view-link">View the Employee Database</a>
                </p>
            </div>
        </div>
    );
}
