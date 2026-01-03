const express = require('express');
const { getAllEmployees, getEmployeeById, getMyProfile, updateEmployee } = require('../controllers/employeeController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get my profile (Employee)
router.get('/me', authMiddleware, getMyProfile);

// Get all employees (Admin only)
router.get('/', authMiddleware, adminOnly, getAllEmployees);

// Get employee by ID
router.get('/:id', authMiddleware, getEmployeeById);

// Update employee profile
router.put('/:id', authMiddleware, updateEmployee);

module.exports = router;