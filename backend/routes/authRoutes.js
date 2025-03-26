//authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// General
router.get("/users", authController.getAllUsers);
router.get("/", authController.test);

// Auth
router.post("/register", authController.registerUser);       // basic user
router.post("/login", authController.loginUser);             // login
router.post("/register-patient", authController.registerPatient); // patient-only
module.exports = router;
