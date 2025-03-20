const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,      // Replace with your DB host
  user: process.env.DB_USER,           // MySQL username
  password: process.env.DB_PASSWORD,           // MySQL password
  database: process.env.DB_NAME     // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Fetch data from MySQL
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

// Server Listening
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
