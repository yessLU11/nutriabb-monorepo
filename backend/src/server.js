require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const connectMongo = require("./config/mongo");

const app = express();
const PORT = process.env.PORT || 4000;

connectMongo();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/auth', require('./routes/authRoutes'));
app.use('/profile', require('./routes/profileRoutes'));
app.use('/calculate', require('./routes/nutritionRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: "OK" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
