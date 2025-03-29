const db = require("../config/db");

// Get all employees
exports.getAllEmployees = (req, res) => {
    const db = req.app.get('db'); // Get the database connection
  
    db.query('SELECT first_name, last_name, phone, role, clinic_id FROM EMPLOYEES', (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      
      if (result.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }
  
      res.status(200).json(result);
    });
  };
  
// Add new employee
exports.createEmployee = (req, res) => {
  const {
    first_name,
    last_name,
    middle_name,
    address,
    email,
    phone,
    sex,
    dob,
    education,
    role,
    specialization,
    clinic_id,
    department_id,
    hire_date
  } = req.body;

  // inserting address to ADDRESS table
  const insertAddressQuery = `
    INSERT INTO ADDRESS (street_num, street_name, postal_code, city, state)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertAddressQuery, [
    address.street_num,
    address.street_name,
    address.postal_code,
    address.city,
    address.state
  ], (addressErr, addressResult) => {
    if (addressErr) {
      return res.status(500).json({ error: "Failed to insert address" });
    }

    const addressId = addressResult.insertId; // Get the address_id

    // insert employee details
    const insertEmployeeQuery = `
      INSERT INTO EMPLOYEES 
      (first_name, last_name, middle_name, address_id, email, phone, sex,
      date_of_birth, education, role, specialization, clinic_id, department_id, hire_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertEmployeeQuery, [
      first_name,
      last_name,
      middle_name || null, //  can be null
      addressId,
      email,
      phone,
      sex,
      dob,
      education || null, // can be null
      role,
      specialization || null, //  can be null
      clinic_id,
      department_id || null, //  can be null
      hire_date
    ], (employeeErr, employeeResult) => {
      if (employeeErr) {
        return res.status(500).json({ error: "Failed to create employee" });
      }

      res.status(200).json({ message: "Employee created successfully!" });
    });
  });
};
