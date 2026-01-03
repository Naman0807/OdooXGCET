const express = require('express');
const { getMyPayroll, getAllPayroll } = require('../controllers/payrollController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Get payroll
router.get('/my', authMiddleware, getMyPayroll);
router.get('/all', authMiddleware, adminOnly, getAllPayroll);

module.exports = router;