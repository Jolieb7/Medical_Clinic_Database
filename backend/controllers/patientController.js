// const db = require("../config/db");
// const registerPatient = (req, res) => {
//   const { first_name, last_name, dob, address_id, phone_num, email, sex, password, insurance } = req.body;
//   const patientSQL = `INSERT INTO PATIENTS (first_name, last_name, dob, address_id, phone_num, email, sex, date_registered, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), 1)`;
//   db.query(patientSQL, [first_name, last_name, dob, address_id, phone_num, email, sex], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     const patient_id = result.insertId;

//     const loginSQL = `INSERT INTO USER_CREDENTIALS (username, password, role, is_active) VALUES (?, ?, 'Patient', 1)`;
//     db.query(loginSQL, [email, password], (err2) => {
//       if (err2) return res.status(500).json({ error: err2 });

//       if (insurance) {
//         const insuranceSQL = `INSERT INTO INSURANCE_PLAN (patient_id, provider_name, policy_number, covrage_details, effective_from, effective_to) VALUES (?, ?, ?, ?, ?, ?)`;
//         db.query(insuranceSQL, [patient_id, ...insurance], (err3) => {
//           if (err3) return res.status(500).json({ error: err3 });
//           return res.json({ message: "Patient and insurance info registered" });
//         });
//       } else {
//         res.json({ message: "Patient registered successfully" });
//       }
//     });
//   });
// };
// module.exports = { registerPatient };

//backend/controllers/patientController.js
const db = require("../config/db");


// 1. Get patient profile
exports.getProfile = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.*, a.*, ec.contact_first_name, ec.contact_last_name, ec.relationship, ec.phone
    FROM PATIENTS p
    JOIN ADDRESS a ON p.address_id = a.address_id
    LEFT JOIN EMERGENCY_CONTACT ec ON p.patient_id = ec.patient_id
    WHERE p.patient_id = ?
  `;
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};


// 2. Update patient profile
exports.updateProfile = (req, res) => {
  const {
    first_name, last_name, dob, phone_num, email, sex,
    street_num, street_name, postal_code, city, state,
    emergency_first_name, emergency_last_name, emergency_relationship, emergency_phone
  } = req.body;
  const { id } = req.params;

  // Step 1: Get address_id of the patient
  db.query("SELECT address_id FROM PATIENTS WHERE patient_id = ?", [id], (err, result) => {
    if (err || result.length === 0) {
      return res.status(500).json({ error: "Failed to get address ID", details: err });
    }

    const address_id = result[0].address_id;

    // Step 2: Update PATIENTS table
    db.query(
      `UPDATE PATIENTS 
       SET first_name = ?, last_name = ?, dob = ?, phone_num = ?, email = ?, sex = ? 
       WHERE patient_id = ?`,
      [first_name, last_name, dob, phone_num, email, sex, id],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to update patient", details: err });
        }

        // Step 3: Update ADDRESS table
        db.query(
          `UPDATE ADDRESS 
           SET street_num = ?, street_name = ?, postal_code = ?, city = ?, state = ? 
           WHERE address_id = ?`,
          [street_num, street_name, postal_code, city, state, address_id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Failed to update address", details: err });
            }

            // Step 4: Conditionally update EMERGENCY_CONTACT
            if (
              emergency_first_name &&
              emergency_last_name &&
              emergency_relationship &&
              emergency_phone
            ) {
              const upsertEC = `
                INSERT INTO EMERGENCY_CONTACT 
                  (patient_id, contact_first_name, contact_last_name, relationship, phone)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                  contact_first_name = ?, contact_last_name = ?, relationship = ?, phone = ?
              `;
              db.query(
                upsertEC,
                [
                  id, emergency_first_name, emergency_last_name, emergency_relationship, emergency_phone,
                  emergency_first_name, emergency_last_name, emergency_relationship, emergency_phone
                ],
                (err) => {
                  if (err) {
                    return res.status(500).json({ error: "Failed to update emergency contact", details: err });
                  }

                  return res.json({ message: "Profile updated successfully" });
                }
              );
            } else {
              // No emergency contact info provided, just complete update
              return res.json({ message: "Profile updated successfully (no emergency contact changes)" });
            }
          }
        );
      }
    );
  });
};




// 3. Get insurance
exports.getInsurance = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM INSURANCE_PLAN WHERE patient_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

// 4. Update insurance
exports.updateInsurance = (req, res) => {
  const { id } = req.params; // this is patient_id, not insurance_id
  const { provider_name, policy_number, covrage_details, effective_from, effective_to } = req.body;

  const upsertInsurance = `
    INSERT INTO INSURANCE_PLAN 
    (patient_id, provider_name, policy_number, covrage_details, effective_from, effective_to)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    provider_name = ?, policy_number = ?, covrage_details = ?, effective_from = ?, effective_to = ?
  `;

  db.query(
    upsertInsurance,
    [
      id, provider_name, policy_number, covrage_details, effective_from, effective_to,
      provider_name, policy_number, covrage_details, effective_from, effective_to
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Insurance updated successfully" });
    }
  );
};

//delete insurance
exports.deleteInsurance = (req, res) => {
  const { id } = req.params; // patient_id
  const sql = "DELETE FROM INSURANCE_PLAN WHERE patient_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Insurance record deleted successfully" });
  });
};


// 5. Get bills
exports.getBills = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM BILLING WHERE patient_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

// 6. Pay bill (simulate)
exports.markBillPaid = (req, res) => {
  const { billing_id } = req.params;
  const { payment_method } = req.body;
  db.query(
    `UPDATE BILLING SET payment_status = 'Paid', payment_method = ?, payment_date = NOW() WHERE billing_id = ?`,
    [payment_method, billing_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Bill marked as paid" });
    }
  );
};

// 7. Get immunizations
exports.getImmunizations = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT * FROM PATIENT_IMMUNIZATIONS JOIN IMMUNIZATIONS USING(immunization_id) WHERE patient_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// 8. Add immunization
exports.addImmunization = (req, res) => {
  const { patient_id, immunization_id, date_administered } = req.body;
  db.query(
    `INSERT INTO PATIENT_IMMUNIZATIONS (patient_id, immunization_id, date_administered) VALUES (?, ?, ?)`,
    [patient_id, immunization_id, date_administered],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Immunization added" });
    }
  );
};

// 9. Get diagnostics
exports.getDiagnostics = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT * FROM DIAGNOSTIC_TESTS WHERE patient_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// 10. Get prescriptions
exports.getPrescriptions = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT * FROM PRESCRIPTIONS WHERE patient_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

// 11. Get medical records
exports.getMedicalRecords = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT * FROM MEDICAL_RECORDS WHERE patient_id = ?`,
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result);
    }
  );
};

