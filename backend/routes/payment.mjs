import express from "express";
import db from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import checkauth from "../check-auth.mjs";

const router = express.Router();
const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store);

const validatePaymentInput = (input) => {
    if (!input.amount || isNaN(input.amount) || input.amount <= 0) {
        return "A valid payment amount is required and should be a positive number";
    }
    if (!input.currency || input.currency.length !== 3) {
        return "Currency code is required and should be a 3-letter ISO code";
    }
    if (!input.recipientAccount || !/^\d{10}$/.test(input.recipientAccount)) {
        return "Recipient account number is required and should be 10 digits";
    }
    if (!input.swiftCode || input.swiftCode.length < 8 || input.swiftCode.length > 11) {
        return "A valid SWIFT code is required, with a length between 8 and 11 characters";
    }
    return null;
};



// POST endpoint to process payments
router.post("/make-payment", bruteforce.prevent, checkauth, async (req, res) => {
    try {
        const { amount, currency, recipientAccount, swiftCode } = req.body;

        // Validate payment input
        const validationError = validatePaymentInput({ amount, currency, recipientAccount, swiftCode });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // Prepare sanitized payment data
        const sanitizedData = {
            userId: req.user.username, // Assuming username is a unique identifier
            amount: parseFloat(amount),
            currency: currency.toUpperCase(),
            recipientAccount: recipientAccount.trim(),
            swiftCode: swiftCode.trim().toUpperCase(),
            provider: "SWIFT",
            timestamp: new Date(),
        };

        const collection = await db.collection("transactions");

        // Insert the transaction data
        const result = await collection.insertOne(sanitizedData);

        if (result.acknowledged) {
            res.status(201).json({ message: "Payment processed successfully", transactionId: result.insertedId });
        } else {
            res.status(500).json({ message: "Failed to process payment" });
        }
    } catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;