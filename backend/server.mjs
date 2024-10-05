import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.mjs";

const PORT = process.env.PORT || 3001;
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
