import express from 'express';
import cors from 'cors';
import fs from "fs";
import userRoutes from "./routes/user.mjs";
import paymentRoutes from "./routes/payment.mjs";
import https from "https";

const PORT = process.env.PORT || 3001;
const app = express();

const options = {
  key: fs.readFileSync('keys/privateKey.pem'),
  cert: fs.readFileSync('keys/certificate.pem')
}

app.use(express.json());
app.use(cors());

// CORS configuration
app.use((reg, res, next) =>
 {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  next();
});


app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use("/user", userRoutes);
app.route("/user" , userRoutes);
app.use("/payment", paymentRoutes );
app.route("/payment" , paymentRoutes );


let server = https.createServer(options, app);

server.listen(PORT);
