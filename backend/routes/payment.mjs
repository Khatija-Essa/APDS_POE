import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import checkauth from "../check-auth.mjs";

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

// Endpoint to get user details
router.get("/details/:id", /*checkauth,*/ async (req, res) => {
    try {
        const usersCollection = await db.collection("client_details");
        const user = await usersCollection.findOne({ username: req.user.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ username: user.username, accountNumber: user.accountNumber });
    } catch (error) {
        console.error("Error fetching user details:", error);
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
        };

        const transactionsCollection = db.collection("transactions");
        const result = await transactionsCollection.insertOne(sanitizedData);

        if (result.acknowledged) {
            const usersCollection = db.collection("client_details");
            await usersCollection.updateOne(
                { username: username },
                { $push: { transactionHistory: result.insertedId } }
            );

            res.status(201).json({ message: "Payment processed successfully", transactionId: result.insertedId, amountUSD: amountUSD.toFixed(2) });
        } else {
            res.status(500).json({ message: "Failed to process payment" });
        }
    } catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Endpoint to fetch transaction history
router.get("/transaction-history", async (req, res) => {
    try {
        const usersCollection = db.collection("client_details");
        const transactionsCollection = db.collection("transactions");

        const user = await usersCollection.findOne({ username: req.user.username });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.transactionHistory || user.transactionHistory.length === 0) return res.status(404).json({ message: "No transactions found" });

        const transactions = await transactionsCollection.find({ _id: { $in: user.transactionHistory } }).toArray();
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transaction history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all the records.
router.get("/get",checkauth, async (req, res) => {
    let collection = await db.collection("transactions");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });

export default router;
