const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
dotenv.config();
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",   // Allow frontend to access backend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));
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

// Server Listening on PORT 5000
const PORT =  5000;
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
  const { username, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const query = "INSERT INTO USER_CREDENTIALS (username, password) VALUES (?, ?)";
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: "Registration failed" });
    }
    res.json({ message: "User registered successfully!" });
  });
});


//User login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt with:", username, password);  // Log input data

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid username or password" });
  }

  

  // Check username 
  const query = "SELECT * FROM USER_CREDENTIALS WHERE username = ?";

  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Something went wrong, login failed" });
    }

    console.log("Query result:", result);  // Log query result

    if (result.length === 0) {
      console.log("No user found with username:", username);
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const user = result[0];
    console.log("User data from DB:", user);

    if (password === user.password) {  // No hashing (plain-text comparison)
      const token = jwt.sign(
        { user_id: user.user_id, employee_id: user.employee_id, username: user.username, role: user.role },
        JWT_SECRET
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          employee_id: user.employee_id,
          username: user.username,
          role: user.role,
          last_login: user.last_login,
          is_active: user.is_active
        },
      });
    } else {
      console.log("Password mismatch for user:", username);
      res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

// Employee registration route
app.post("/api/employees", (req, res) => {
  const { first_name, last_name, email, role } = req.body;

  const query = "INSERT INTO EMPLOYEES (first_name, last_name, email, role) VALUES (?, ?, ?, ?)";
  db.query(query, [first_name, last_name, email, role], (err, result) => {
    if (err) {
      console.log("DB error:",err);
      return res.status(400).json({ error: "Failed to add employee" });
    }
    res.json({ message: "Employee added successfully!" });
  });
});

// POST New Employee address /api/addresses
app.post('/api/addresses', (req, res) => {
  const { street_num, street_name, postal_code, city, state } = req.body;

  const query = 'INSERT INTO addresses (street_num, street_name, postal_code, city, state) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [street_num, street_name, postal_code, city, state], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Failed to add address' });
    }
    res.status(200).json({ address_id: result.insertId });
  });
});

// POST New Employee /api/employees
app.post('/api/employees', (req, res) => {
  const { first_name, last_name, middle_name, email, phone, sex, date_of_birth, education, role, specialization, clinic_id, department_id, hire_date } = req.body;

  const query = 'INSERT INTO employees (first_name, last_name, middle_name, email, phone, sex, date_of_birth, education, role, specialization, clinic_id, department_id, hire_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [first_name, last_name, middle_name, email, phone, sex, date_of_birth, education, role, specialization, clinic_id, department_id, hire_date], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Failed to add employee' });
    }
    res.status(200).json({ message: 'Employee added successfully' });
  });
});
