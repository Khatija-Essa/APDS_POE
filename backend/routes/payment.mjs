import express from "express";
import db from "../db/conn.mjs"; // Ensure your database connection is correct
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import checkauth from "../check-auth.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// Mock exchange rates
const exchangeRates = {
    USD: 1,
    EUR: 0.84,
    GBP: 0.72,
    JPY: 110.23,
};

// Helper function for validation
const validatePaymentInput = (input) => {
    if (!input.username || input.username.length < 3) return "Username is required and should be at least 3 characters";
    if (!input.accountNumber || !/^\d{10}$/.test(input.accountNumber)) return "Account number must be 10 digits";
    if (!input.amount || isNaN(input.amount) || input.amount <= 0) return "Valid payment amount required";
    if (!input.currency || input.currency.length !== 3 || !exchangeRates[input.currency]) return "Supported currency code required";
    if (!input.swiftCode || input.swiftCode.length < 8 || input.swiftCode.length > 11) return "SWIFT code length should be 8-11";
    return null;
};

// Endpoint to get user details for the frontend
router.get("/payment/details", checkauth, async (req, res) => {
    try {
        const username = req.user.username; // Assuming user info is in the token
        const usersCollection = db.collection("client_details");
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            username: user.username,
            accountNumber: user.accountNumber, // Assuming accountNumber exists in user document
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint to get all payment records
router.get("/get", checkauth, async (req, res) => {
    try {
        const transactionsCollection = await db.collection("transactions");
        const results = await transactionsCollection.find({}).toArray();
        res.status(200).send(results);
    } catch (error) {
        console.error("Error fetching transaction records:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint to process payments
router.post("/make-payment", bruteforce.prevent, checkauth, async (req, res) => {
    try {
        const { username, accountNumber, amount, currency, swiftCode } = req.body;
        const validationError = validatePaymentInput({ username, accountNumber, amount, currency, swiftCode });
        if (validationError) return res.status(400).json({ message: validationError });

        const amountUSD = parseFloat(amount) / exchangeRates[currency];
        const sanitizedData = {
            username,
            accountNumber,
            amount: parseFloat(amount),
            amountUSD,
            currency: currency.toUpperCase(),
            swiftCode: swiftCode.trim().toUpperCase(),
            provider: "SWIFT",
            timestamp: new Date(),
            status: "in progress", // Add status to indicate payment is in progress
        };

        const transactionsCollection = db.collection("transactions");
        const result = await transactionsCollection.insertOne(sanitizedData);

        if (result.acknowledged) {
            const usersCollection = db.collection("client_details");
            await usersCollection.updateOne(
                { username: username },
                { $push: { transactionHistory: result.insertedId } }
            );

            res.status(201).json({
                message: "Payment processed successfully",
                transactionId: result.insertedId,
                amountUSD: amountUSD.toFixed(2),
                status: sanitizedData.status, // Include initial payment status in the response
            });
        } else {
            res.status(500).json({ message: "Failed to process payment" });
        }
    } catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint to approve payment and update status
router.put("/approve-payment/:transactionId", checkauth, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const transactionsCollection = db.collection("transactions");

        // Find and update the transaction status to "approved"
        const updateResult = await transactionsCollection.updateOne(
            { _id: new ObjectId(transactionId), status: "in progress" }, // Ensure we only update "in progress" payments
            { $set: { status: "approved" } }
        );

        if (updateResult.modifiedCount > 0) {
            res.status(200).json({ message: "Payment status updated to 'approved'" });
        } else {
            res.status(404).json({ message: "Transaction not found or already approved" });
        }
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
