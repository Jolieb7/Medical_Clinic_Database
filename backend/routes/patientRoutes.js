const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");


// Get patient profile
router.get("/profile/:id", patientController.getProfile);

// Update patient profile
router.put("/profile/:id", patientController.updateProfile);

// Get insurance info
router.get("/insurance/:id", patientController.getInsurance);

// Update insurance info
router.put("/insurance/:id", patientController.updateInsurance);
router.delete("/insurance/:id", patientController.deleteInsurance);

// Get patient bills
router.get("/bills/:id", patientController.getBills);

// Simulate payment
router.put("/bills/pay/:billing_id", patientController.markBillPaid);

// Get patient immunizations
router.get("/immunizations/:id", patientController.getImmunizations);

// Add immunization
router.post("/immunizations", patientController.addImmunization);

// Get diagnostic tests
router.get("/diagnostics/:id", patientController.getDiagnostics);

// Get prescriptions
router.get("/prescriptions/:id", patientController.getPrescriptions);

// Get medical records
router.get("/medical-records/:id", patientController.getMedicalRecords);

module.exports = router;
