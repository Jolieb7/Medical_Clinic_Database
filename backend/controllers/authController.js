//authcontroller.js is the controller for the authentication of the user.
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.error("MySQL connection error:", err);
});

const JWT_SECRET = process.env.JWT_SECRET || "superscretkey";

// ===================== AUTH CONTROLLER ===================== //

exports.test = (req, res) => {
  res.send("Server is running!");
};

exports.getAllUsers = (req, res) => {
  db.query("SELECT * FROM USER_CREDENTIALS", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

exports.registerUser = [
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    db.query(
      "INSERT INTO USER_CREDENTIALS (username, password) VALUES (?, ?)",
      [username, password],
      (err, result) => {
        if (err) return res.status(400).json({ error: "Registration failed", details: err });
        res.json({ message: "User registered successfully!" });
      }
    );
  },
];

exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  db.query("SELECT * FROM USER_CREDENTIALS WHERE username = ?", [username], (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (result.length === 0 || password !== result[0].password) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    

    const user = result[0];
    const token = jwt.sign(
      {
        user_id: user.user_id,
        employee_id: user.employee_id,
        username: user.username,
        role: user.role,
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  });
};

exports.registerPatient = (req, res) => {
    const {
      username,
      password,
      first_name,
      last_name,
      dob,
      phone_num,
      email,
      sex,
      street_num,
      street_name,
      postal_code,
      city,
      state,
      emergency_first_name,
      emergency_last_name,
      emergency_relationship,
      emergency_phone,
      provider_name,
      policy_number,
      coverage_details,
      effective_from,
      effective_to,
    } = req.body;
  
    db.beginTransaction((err) => {
      if (err) return res.status(500).json({ error: "Failed to start transaction" });
  
      // 1. Insert into ADDRESS
      const addressQuery =
        "INSERT INTO ADDRESS (street_num, street_name, postal_code, city, state) VALUES (?, ?, ?, ?, ?)";
      db.query(addressQuery, [street_num, street_name, postal_code, city, state], (err, addressResult) => {
        if (err) return db.rollback(() => res.status(500).json({ error: "Address insert failed", details: err }));
  
        const address_id = addressResult.insertId;
  
        // 2. Insert into PATIENTS
        const patientQuery =
          "INSERT INTO PATIENTS (first_name, last_name, dob, address_id, phone_num, email, sex) VALUES (?, ?, ?, ?, ?, ?, ?)";
        db.query(
          patientQuery,
          [first_name, last_name, dob, address_id, phone_num, email, sex],
          (err, patientResult) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "Patient insert failed", details: err }));
  
            const patient_id = patientResult.insertId;
  
            /// 3. Insert into USER_CREDENTIALS
const credentialsQuery =
"INSERT INTO USER_CREDENTIALS (username, password, role) VALUES (?, ?, 'Patient')";
db.query(credentialsQuery, [username, password], (err) => {
if (err) {
  //Catch duplicate username
  if (err.code === 'ER_DUP_ENTRY') {
    return db.rollback(() =>
      res.status(400).json({ error: "Username already exists. Please choose another." })
    );
  }
  //General insert failure
  return db.rollback(() =>
    res.status(500).json({ error: "Credentials insert failed", details: err })
  );
}
  
              // 4. Insert into EMERGENCY_CONTACT
              const emergencyQuery = `
                INSERT INTO EMERGENCY_CONTACT 
                (patient_id, contact_first_name, contact_last_name, relationship, phone) 
                VALUES (?, ?, ?, ?, ?)`;
              db.query(
                emergencyQuery,
                [patient_id, emergency_first_name, emergency_last_name, emergency_relationship, emergency_phone],
                (err) => {
                  if (err)
                    return db.rollback(() =>
                      res.status(500).json({ error: "Emergency contact insert failed", details: err })
                    );
  
                  // 5. Optionally insert INSURANCE_PLAN if filled
                  if (provider_name || policy_number || coverage_details || effective_from || effective_to) {
                    const insuranceQuery = `
                      INSERT INTO INSURANCE_PLAN 
                      (patient_id, provider_name, policy_number, covrage_details, effective_from, effective_to) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
                    db.query(
                      insuranceQuery,
                      [
                        patient_id,
                        provider_name || null,
                        policy_number || null,
                        coverage_details || null,
                        effective_from || null,
                        effective_to || null,
                      ],
                      (err) => {
                        if (err)
                          return db.rollback(() =>
                            res.status(500).json({ error: "Insurance insert failed", details: err })
                          );
  
                        db.commit((err) => {
                          if (err)
                            return db.rollback(() =>
                              res.status(500).json({ error: "Commit failed", details: err })
                            );
                          res.status(201).json({ message: "Patient registered successfully!", patient_id });
                        });
                      }
                    );
                  } else {
                    // No insurance — commit transaction
                    db.commit((err) => {
                      if (err)
                        return db.rollback(() =>
                          res.status(500).json({ error: "Commit failed", details: err })
                        );
                      res.status(201).json({ message: "Patient registered successfully!", patient_id });
                    });
                  }
                }
              );
            });
          }
        );
      });
    });
  };
  