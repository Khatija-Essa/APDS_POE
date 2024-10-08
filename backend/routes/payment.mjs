import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import checkauth from "../check-auth.mjs";

const router = express.Router();
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

// Simple exchange rates (normally you'd use an API for live rates)
const exchangeRates = {
    USD: 1,
    EUR: 0.84,
    GBP: 0.72,
    JPY: 110.23,
    // Add more currencies as needed
};

const validatePaymentInput = (input) => {
    if (!input.username || input.username.length < 3) {
        return "Username is required and should be at least 3 characters long";
    }
    if (!input.accountNumber || !/^\d{10}$/.test(input.accountNumber)) {
        return "Account number is required and should be 10 digits";
    }
    if (!input.amount || isNaN(input.amount) || input.amount <= 0) {
        return "A valid payment amount is required and should be a positive number";
    }
    if (!input.currency || input.currency.length !== 3 || !exchangeRates[input.currency]) {
        return "Currency code is required and should be a supported 3-letter ISO code";
    }
    if (!input.swiftCode || input.swiftCode.length < 8 || input.swiftCode.length > 11) {
        return "A valid SWIFT code is required, with a length between 8 and 11 characters";
    }
    return null;
};

// GET endpoint to fetch user details
router.get("/details", checkauth, async (req, res) => {
    try {
        const usersCollection = await db.collection("client_details");
        const user = await usersCollection.findOne({ username: req.user.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            username: user.username,
            accountNumber: user.accountNumber
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// POST endpoint to process payments
router.post("/make-payment", bruteforce.prevent, checkauth, async (req, res) => {
    try {
        const { username, accountNumber, amount, currency, swiftCode } = req.body;

        // Validate payment input
        const validationError = validatePaymentInput({ username, accountNumber, amount, currency, swiftCode });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Convert amount to USD
        const amountUSD = parseFloat(amount) / exchangeRates[currency];

        // Prepare sanitized payment data
        const sanitizedData = {
            username,
            accountNumber,
            amount: parseFloat(amount),
            amountUSD,
            currency: currency.toUpperCase(),
            swiftCode: swiftCode.trim().toUpperCase(),
            provider: "SWIFT",
            timestamp: new Date(),
        };

        // Get the transactions collection from the client_details database
        const transactionsCollection = db.collection("transactions");

        // Insert the transaction data
        const result = await transactionsCollection.insertOne(sanitizedData);

        if (result.acknowledged) {
            // Update the user's transaction history
            const usersCollection = db.collection("client_details");
            await usersCollection.updateOne(
                { username: username },
                { $push: { transactionHistory: result.insertedId } }
            );

            res.status(201).json({ 
                message: "Payment processed successfully", 
                transactionId: result.insertedId,
                amountUSD: amountUSD.toFixed(2)
            });
        } else {
            res.status(500).json({ message: "Failed to process payment" });
        }
    } catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET endpoint to fetch transaction history
router.get("/transaction-history", checkauth, async (req, res) => {
    try {
        const usersCollection = db.collection("client_details");
        const transactionsCollection = db.collection("transactions");

        const user = await usersCollection.findOne({ username: req.user.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const transactions = await transactionsCollection.find(
            { _id: { $in: user.transactionHistory || [] } }
        ).toArray();

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

export default router;