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
  db.query("SELECT * FROM PATIENTS WHERE patient_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result[0]);
  });
};

// 2. Update patient profile
exports.updateProfile = (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, dob, address_id, phone_num, email, sex } = req.body;
  db.query(
    `UPDATE PATIENTS SET first_name = ?, last_name = ?, dob = ?, address_id = ?, phone_num = ?, email = ?, sex = ? WHERE patient_id = ?`,
    [first_name, last_name, dob, address_id, phone_num, email, sex, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Profile updated successfully" });
    }
  );
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
  const { id } = req.params;
  const { provider_name, policy_number, covrage_details, effective_from, effective_to } = req.body;
  db.query(
    `UPDATE INSURANCE_PLAN SET provider_name = ?, policy_number = ?, covrage_details = ?, effective_from = ?, effective_to = ? WHERE insurance_id = ?`,
    [provider_name, policy_number, covrage_details, effective_from, effective_to, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Insurance updated successfully" });
    }
  );
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

exports.createDummyPatient = (req, res) => {
  const db = req.app.get("db");

  // 1. ADDRESS (columns: address_id, street_num, street_name, postal_code, city, state)
  const address = {
    address_id: 1,
    street_num: "123",
    street_name: "Demo Street",
    postal_code: "12345",
    city: "Testville",
    state: "TS"
  };

  // 2. PATIENTS (columns: patient_id, first_name, last_name, dob, address_id, phone_num, email, sex)
  const patient = {
    patient_id: 999,
    first_name: "Demo",
    last_name: "User",
    dob: "1999-01-01",
    address_id: address.address_id,
    phone_num: "5551234567",
    email: "demo@patient.com",
    sex: "female"
  };

  // 3. INSURANCE_PLAN (columns: insurance_id, patient_id, provider_name, policy_number, covrage_details, effective_from, effective_to)
  const insurance = {
    insurance_id: 999,
    patient_id: patient.patient_id,
    provider_name: "TestCare",
    policy_number: "POLICY999",
    covrage_details: "Full Coverage",
    effective_from: "2024-01-01",
    effective_to: "2025-01-01"
  };

  // 4. BILLING (columns: billing_id, patient_id, total_amount, payment_status)
  // const billing = {
  //   billing_id: 999,
  //   patient_id: patient.patient_id,
  //   total_amount: 100.00,
  //   payment_status: "Unpaid"
  // };

  // SQL insert statements
  const insertAddress = `INSERT INTO ADDRESS SET ?`;
  const insertPatient = `INSERT INTO PATIENTS SET ?`;
  const insertInsurance = `INSERT INTO INSURANCE_PLAN SET ?`;
  //const insertBilling = `INSERT INTO BILLING SET ?`;

  // Execute the inserts
  db.query(insertAddress, address, (err) => {
    if (err && err.errno !== 1062) {
      return res.status(500).json({ error: "Address insert failed", details: err });
    }

    db.query(insertPatient, patient, (err) => {
      if (err) return res.status(500).json({ error: "Patient insert failed", details: err });

      db.query(insertInsurance, insurance, (err) => {
        if (err) return res.status(500).json({ error: "Insurance insert failed", details: err });

        // db.query(insertBilling, billing, (err) => {
        //   if (err) return res.status(500).json({ error: "Billing insert failed", details: err });

          res.json({
            message: "Dummy patient, insurance, address, and bill created successfully",
            patient_id: patient.patient_id
          });
        //});
      });
    });
  });
};