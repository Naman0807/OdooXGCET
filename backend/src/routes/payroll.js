const express = require('express');
const { getMyPayroll, getAllPayroll, generatePayroll, generatePayslip, updateSalary } = require('../controllers/payrollController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get payroll
router.get('/my', authMiddleware, getMyPayroll);
router.get('/all', authMiddleware, adminOnly, getAllPayroll);

// Generate payroll
router.post('/generate', authMiddleware, adminOnly, generatePayroll);

// Generate payslip PDF
router.get('/payslip', authMiddleware, generatePayslip);

// Update salary details
router.put('/salary', authMiddleware, adminOnly, updateSalary);

module.exports = router;