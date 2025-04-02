const db = require("../config/db");

// 1. Get employee profile
exports.getProfile = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM EMPLOYEES WHERE employee_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

// 2. Update employee profile (NOT complete)
/* exports.updateProfile = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, middle_name, dob, address_id, phone_num} = req.body;
  db.query(
    `UPDATE EMPLOYEES SET first_name = ?, last_name = ?, middle_name = ?, dob = ?, address_id = ?, phone_num = ? WHERE employee_id = ?`,
    [first_name, last_name, middle_name, dob, address_id, phone_num, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );}; */

  // 3. 