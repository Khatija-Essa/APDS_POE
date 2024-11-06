import express from 'express';
import cors from 'cors';
import fs from "fs";
import dotenv from "dotenv";
import userRoutes from "./routes/user.mjs";
import paymentRoutes from "./routes/payment.mjs";
import employeeRoutes from "./routes/employee.mjs";
import https from "https";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;
const app = express();

// SSL/TLS Configuration
const options = {
    key: fs.readFileSync('keys/privateKey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

// Middleware
app.use(express.json());
app.use(cors());

// CORS Configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'API Server is running!' });
});

// Routes
app.use("/user", userRoutes);
app.route("/user", userRoutes);
app.use("/payment", paymentRoutes);
app.route("/payment", paymentRoutes);
app.use("/employee", employeeRoutes);
app.route("/employee", employeeRoutes);

// Create HTTPS server
const server = https.createServer(options, app);

// Start server
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});

// Error handling
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutting down');
        process.exit(0);
    });
});