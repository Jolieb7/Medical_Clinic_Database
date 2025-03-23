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
  