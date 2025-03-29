const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// get all employees
router.get('/employees', adminController.getAllEmployees);
router.get('/employees/by-clinic', adminController.getEmployeesByClinic);//by clinic
// add new employee
router.post("/create-employee", adminController.createEmployee); // admin route
//admin/getclinics
router.get("/clinics", adminController.getClinics);
//admin/get departments
router.get("/departments", adminController.getDepartments);
//create schedule
router.post('/schedules', adminController.createSchedule);
//update schedule
router.put('/schedules/:schedule_id', adminController.updateSchedule);
//get schedules
router.get('/schedules/:id', adminController.getSchedulesByEmployeeId);
module.exports = router;