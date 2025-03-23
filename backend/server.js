
// backend/service.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const patientRoutes = require("./routes/patientRoutes");
const mysql = require("mysql2");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error(" MySQL connection error:", err.message);
    return;
  }
  console.log("Connected to MySQL");
});

// Attach db to app for global access in controllers
app.set("db", db);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is up and running!");
});

// Register patient routes
app.use("/api/patient", patientRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
