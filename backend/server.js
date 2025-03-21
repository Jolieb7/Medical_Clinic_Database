const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

// Server Listening
const PORT = process.env.PORT || 3306;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "superscretkey";

//  Test Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

//  Fetch all users from MySQL (for testing)
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM USER_CREDENTIALS";
  db.query(sql, (err, result) => {
    if (err) return res.json({ error: err });
    res.json(result);
  });
});

//  User registration route
app.post("/api/register", [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
], (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const query = "INSERT INTO USER_CREDENTIALS (username, email, password) VALUES (?, ?, ?)";
  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "Registration failed" });
    }
    res.json({ message: "User registered successfully!" });
  });
});

//User login route
app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;

  console.log("Login attempt with:", identifier, password);  // Log input data

  if (!identifier || !password) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  // Check username only
  const query = "SELECT * FROM USER_CREDENTIALS WHERE username = ?";

  db.query(query, [identifier], async (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Something went wrong, login failed" });
    }

    console.log("Query result:", result);  // Log query result

    if (result.length === 0) {
      console.log("No user found with username:", identifier);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = result[0];
    console.log("User data from DB:", user);

    if (password === user.password) {  // No hashing (plain-text comparison)
      const token = jwt.sign(
        { user_id: user.user_id, username: user.username, role: user.role },
        JWT_SECRET
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          last_login: user.last_login,
          is_active: user.is_active
        },
      });
    } else {
      console.log("Password mismatch for user:", identifier);
      res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

