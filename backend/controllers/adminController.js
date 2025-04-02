const db = require("../config/db");

// Get all clinics
exports.getClinics = (req, res) => {
  const db = req.app.get("db");
  db.query("SELECT clinic_id, clinic_name FROM CLINIC", (err, results) => {
    if (err) {
      console.error("Error fetching clinics:", err); 
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
};

// Get all departments
exports.getDepartments = (req, res) => {
  const db = req.app.get("db");
  db.query("SELECT department_id, department_name FROM DEPARTMENTS", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(200).json(results);
  });
};

// Get all employees
exports.getAllEmployees = (req, res) => {
  const db = req.app.get('db');
  db.query('SELECT first_name, last_name, phone, role, clinic_id FROM EMPLOYEES', (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) {
      return res.status(404).json({ message: "No employees found" });
    }
    res.status(200).json(result);
  });
};
// get employee by clinic
exports.getEmployeesByClinic = (req, res) => {
  const db = req.app.get("db");
  const { clinic_id } = req.query;

  db.query(
    "SELECT employee_id, first_name, last_name FROM EMPLOYEES WHERE clinic_id = ?",
    [clinic_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching employees by clinic:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json(results);
    }
  );
};
// Add new employee
exports.createEmployee = (req, res) => {
  const db = req.app.get("db");
  const {
    first_name, last_name, middle_name, address, email, phone,
    sex, dob, education, role, specialization, clinic_id,
    department_id, hire_date, license_number 
  } = req.body;
  

  const normalizedRole = role === "1" ? "Doctor"
                      : role === "2" ? "Nurse"
                      : role === "3" ? "Receptionist"
                      : role === "4" ? "Database Admin"
                      : role;

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
      console.error("Address insert error:", addressErr);
      return res.status(500).json({ error: "Failed to insert address" });
    }

    const addressId = addressResult.insertId;

    const insertEmployeeQuery = `
      INSERT INTO EMPLOYEES 
      (first_name, last_name, middle_name, address_id, email, phone, sex,
      date_of_birth, education, role, specialization, clinic_id, department_id, date_hired)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(insertEmployeeQuery, [
      first_name, last_name, middle_name || null,
      addressId, email, phone, sex, dob,
      education || null, normalizedRole,
      specialization || null, clinic_id,
      department_id || null, hire_date
    ], (employeeErr, employeeResult) => {
      if (employeeErr) {
        console.error("Employee insert error:", employeeErr);
        return res.status(500).json({ error: "Failed to create employee" });
      }

      const employeeId = employeeResult.insertId;

      // Role-based insertion
      if (normalizedRole === "Doctor") {
        const doctorQuery = `
  INSERT INTO DOCTORS (employee_id, clinic_id, department_id, specialization, degree, license_number)
  VALUES (?, ?, ?, ?, '', ?)`;
db.query(doctorQuery, [employeeId, clinic_id, department_id, specialization, license_number], (err) => {
          if (err) {
            console.error("DOCTORS insert error:", err);
            return res.status(500).json({ error: "Failed to insert into DOCTORS" });
          }
          return res.status(200).json({ message: "Doctor added successfully!" });
        });
      } else if (normalizedRole === "Nurse") {
        const nurseQuery = `
        INSERT INTO NURSES (employee_id, clinic_id, department_id, license_number)
        VALUES (?, ?, ?, ?)`;
      db.query(nurseQuery, [employeeId, clinic_id, department_id, normalizedRole, license_number], (err) => {
          if (err) {
            console.error("NURSES insert error:", err);
            return res.status(500).json({ error: "Failed to insert into NURSES" });
          }
          return res.status(200).json({ message: "Nurse added successfully!" });
        });
      } else if (normalizedRole === "Receptionist") {
        const recQuery = `
          INSERT INTO RECEPTIONIST (employee_id, clinic_id, phone, email)
          VALUES (?, ?, ?, ?)`;
        db.query(recQuery, [employeeId, clinic_id, phone, email], (err) => {
          if (err) {
            console.error("RECEPTIONIST insert error:", err);
            return res.status(500).json({ error: "Failed to insert into RECEPTIONIST" });
          }
          return res.status(200).json({ message: "Receptionist added successfully!" });
        });
      } else if (normalizedRole === "Database Admin") {
        const dbAdminQuery = `
          INSERT INTO DATABASE_MANAGER (employee_id, last_login)
          VALUES (?, NOW())`;
        db.query(dbAdminQuery, [employeeId], (err) => {
          if (err) {
            console.error("DATABASE_MANAGER insert error:", err);
            return res.status(500).json({ error: "Failed to insert into DATABASE_MANAGER" });
          }
          return res.status(200).json({ message: "Database Admin added successfully!" });
        });
      } else {
        return res.status(200).json({ message: "Employee created successfully!" });
      }
    });
  });
};
// View schedule by employee ID
exports.getSchedulesByEmployeeId = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  db.query(
    "SELECT * FROM SCHEDULES WHERE employee_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Error fetching schedule:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No schedule found for this employee" });
      }
      res.status(200).json(results);
    }
  );
};

// Add schedule for an employee
exports.createSchedule = (req, res) => {
  const db = req.app.get("db");
  const { employee_id, clinic_id, day_of_week, start_time, end_time } = req.body;

  const insertScheduleQuery = `
    INSERT INTO SCHEDULES (employee_id, clinic_id, day_of_week, start_time, end_time)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertScheduleQuery, [employee_id, clinic_id, day_of_week, start_time, end_time], (err, result) => {
    if (err) {
      console.error("Schedule insert error:", err);
      return res.status(500).json({ error: "Failed to create schedule" });
    }
    res.status(200).json({ message: "Schedule added successfully!" });
  });
};

//update schedule
exports.updateSchedule = (req, res) => {
  const db = req.app.get("db");
  const scheduleId = req.params.schedule_id;

  const {
    employee_id,
    clinic_id,
    start_time,
    end_time,
    day_of_week
  } = req.body;

  const query = `
    UPDATE SCHEDULES
    SET employee_id = ?, clinic_id = ?, start_time = ?, end_time = ?, day_of_week = ?
    WHERE schedule_id = ?
  `;

  db.query(query, [employee_id, clinic_id, start_time, end_time, day_of_week, scheduleId], (err, result) => {
    if (err) {
      console.error("Schedule update error:", err);
      return res.status(500).json({ error: "Failed to update schedule" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.status(200).json({ message: "Schedule updated successfully!" });
  });
};
