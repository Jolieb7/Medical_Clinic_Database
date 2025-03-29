const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// get all employees
router.get('/employees', adminController.getAllEmployees);

// add new employee
router.post("/create-employee", adminController.createEmployee); // admin route


module.exports = router;