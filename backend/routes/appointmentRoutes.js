//appointmentRoutes 
const express = require("express");
const { 
  createAppointment, 
  createAppointmentByReceptionist, 
  updateAppointment, 
  cancelAppointment, 
  checkInPatient, 
  checkOutPatient, 
  completeAppointment, 
  getAppointmentsByStatus 
} = require("../controllers/appointmentController");
const { authenticateUser, authorizeRole } = require("../middlewares/authMiddleware");

const router = express.Router();

/* 
  APPOINTMENT CREATION ROUTES
 */
// Patients create their own appointments
router.post("/create", authenticateUser, authorizeRole(["Patient"]), createAppointment);

// Receptionists create appointments for patients
router.post("/create-by-receptionist", authenticateUser, authorizeRole(["Receptionist"]), createAppointmentByReceptionist);

/* 
  APPOINTMENT MANAGEMENT ROUTES
 */
// Updating appointment details
router.put("/update/:appointment_id", authenticateUser, updateAppointment);

// Cancel an appointment (Patients & Receptionists, includes fine enforcement)
router.put("/cancel/:appointment_id", authenticateUser, cancelAppointment);

// Mark appointment as "Finished" (Doctors & Receptionists)
router.put("/complete/:appointment_id", authenticateUser, authorizeRole(["Doctor", "Receptionist"]), completeAppointment);

// Checking in a patient (Receptionists)
router.put("/check-in/:appointment_id", authenticateUser, authorizeRole(["Receptionist"]), checkInPatient);

// Checking out a patient (Receptionists, also marks appointment as finished)
router.put("/check-out/:appointment_id", authenticateUser, authorizeRole(["Receptionist"]), checkOutPatient);

/* 
  FETCHING APPOINTMENTS ROUTE
 */
// Get appointments filtered by status ("Scheduled", "Canceled", "Finished")
router.get("/status", authenticateUser, getAppointmentsByStatus);

module.exports = router;

