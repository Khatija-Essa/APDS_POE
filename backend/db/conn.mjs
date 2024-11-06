// db/conn.mjs
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient(connectionString);

let db;
try {
    await client.connect();
    console.log("MongoDB is CONNECTED!!! :)");
    db = client.db("client_details");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
}

export default db;
