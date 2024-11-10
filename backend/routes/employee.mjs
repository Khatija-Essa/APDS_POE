// paymentRoutes.mjs

import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: "Access denied. Token required." });
        }

        jwt.verify(token, "this_secret_should_be_longer_than_it_is", (err, employee) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            req.employee = employee;
            next();
        });
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
};

// Employee Login Route
router.post("/login", async (req, res) => {
    const { employeeID, email, password } = req.body;

    if (!employeeID || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const collection = await db.collection("employees");
        const employee = await collection.findOne({ employeeID, email });

        if (!employee) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(password, employee.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { employeeID: employee.employeeID, email: employee.email, role: employee.role },
            "this_secret_should_be_longer_than_it_is",
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Authentication successful",
            token: token,
            employeeID: employee.employeeID,
            email: employee.email,
            fullName: employee.fullName,
            role: employee.role
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error: error.message });
    }
});

// Add Employee Route (only accessible by admin)
router.post("/add-employee", authenticateToken, async (req, res) => {
    const { fullName, employeeID, email, password, role } = req.body;

    if (req.employee.role !== "admin") {
        return res.status(403).json({ message: "Only admins can add new employees." });
    }

    if (!fullName || !employeeID || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const collection = await db.collection("employees");
        const existingEmployee = await collection.findOne({ employeeID });
        if (existingEmployee) {
            return res.status(409).json({ message: "Employee with this ID already exists." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newEmployee = {
            fullName,
            employeeID,
            email,
            role,
            password: hashedPassword
        };

        await collection.insertOne(newEmployee);
        res.status(201).json({ message: "New employee added successfully." });

    } catch (error) {
        console.error("Error adding employee:", error);
        res.status(500).json({ message: "Failed to add employee", error: error.message });
    }
});

// Verify Payment Route
router.post("/payment/verify/:paymentId", authenticateToken, async (req, res) => {
    const { paymentId } = req.params;

    try {
        const collection = await db.collection("payments");

        // Update the payment status to "approved" where status was "in progress"
        const result = await collection.updateOne(
            { _id: paymentId, status: "in progress" },
            { $set: { status: "approved", verified: true } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Payment not found or already approved" });
        }

        res.status(200).json({ message: "Payment status updated to approved" });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Failed to update payment status", error: error.message });
    }
});

export default router;
