import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const router = express.Router();
const DEFAULT_EMPLOYEE = {
    fullName: "John Doe",
    employeeID: "EMP001",
    email: "john.doe@example.com",
    role: "admin",
    password: "DefaultEmployeePass123!"
};

// Pre-register an employee in MongoDB
const preRegisterEmployee = async (employee) => {
    const collection = await db.collection("employees");

    const existingEmployee = await collection.findOne({ employeeID: employee.employeeID });
    if (!existingEmployee) {
        await collection.insertOne(employee);
        console.log(`Employee ${employee.fullName} pre-registered successfully.`);
    } else {
        console.log(`Employee ${employee.fullName} already exists.`);
    }
};

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
    console.log("Login attempt with:", { employeeID, email });

    if (!employeeID || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const collection = await db.collection("employees");

        const employee = await collection.findOne({ employeeID: employeeID, email: email });

        console.log("Database query result:", employee ? "Employee found" : "Employee not found");

        if (!employee) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (employeeID === DEFAULT_EMPLOYEE.employeeID) {
            if (password !== employee.password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
        } else {
            const passwordMatch = await bcrypt.compare(password, employee.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
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
        console.log("Login successful for employee:", employee.employeeID);

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

        const existingEmployee = await collection.findOne({ employeeID: employeeID });
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

export default router;
