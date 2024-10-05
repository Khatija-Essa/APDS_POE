import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

// Helper function for input validation
const validateInput = (input) => {
    if (!input.fullName || input.fullName.length < 2) {
        return "Full name is required and should be at least 2 characters long";
    }
    if (!input.username || input.username.length < 3) {
        return "Username is required and should be at least 3 characters long";
    }
    if (!input.email || !isValidEmail(input.email)) {
        return "A valid email address is required";
    }
    if (!input.idNumber || !/^\d{13}$/.test(input.idNumber)) {
        return "ID number is required and should be 13 digits";
    }
    if (!input.accountNumber || !/^\d{10}$/.test(input.accountNumber)) {
        return "Account number is required and should be 10 digits";
    }
    if (!input.password || input.password.length < 8 || !/[!@#$%^&*(),.?":{}|<>]/.test(input.password)) {
        return "Password is required, should be at least 8 characters long, and must contain at least one special character";
    }
    return null;
};

// Email validation function using RegEx
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

router.post("/signup", async (req, res) => {
    try {
        const { fullName, username, email, idNumber, accountNumber, password } = req.body;

        // Validate input
        const validationError = validateInput({ fullName, username, email, idNumber, accountNumber, password });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Hash password with salt (bcrypt handles the salt automatically)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newDocument = {
            fullName,
            username,
            email,
            idNumber,
            accountNumber,
            password: hashedPassword
        };

        let collection = await db.collection("client_details");
        
        // Check if user already exists
        const existingUser = await collection.findOne({ 
            $or: [
                { username: username },
                { email: email },
                { idNumber: idNumber },
                { accountNumber: accountNumber }
            ]
        });

        if (existingUser) {
            return res.status(409).json({ message: "User with this username, email, ID number, or account number already exists" });
        }

        let result = await collection.insertOne(newDocument);
        
        console.log("Signup result:", result);
        
        if (result.acknowledged) {
            res.status(201).json({
                message: "User created successfully",
                userId: result.insertedId
            });
        } else {
            res.status(500).json({ message: "Failed to create user" });
        }
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
});

router.post("/login", bruteforce.prevent, async (req, res) => {
    const { username, email, accountNumber, password } = req.body;
    console.log(`Login attempt for username: ${username}, email: ${email}, account number: ${accountNumber}`);

    if (!username || !email || !accountNumber || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        const collection = await db.collection("client_details");
        const user = await collection.findOne({ username, email, accountNumber });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Authentication successful
            const token = jwt.sign(
                { username: user.username, email: user.email, accountNumber: user.accountNumber },
                "this_secret_should_be_longer_than_it_is",
                { expiresIn: "1h" }
            );
            res.status(200).json({ 
                message: "Authentication successful", 
                token: token, 
                username: user.username,
                email: user.email,
                fullName: user.fullName
            });
            console.log("New token generated for user:", user.username);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});

export default router;