const express = require('express');
const { checkIn, checkOut, getMyAttendance, getAllAttendance } = require('../controllers/attendanceController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Check in/out
router.post('/checkin', authMiddleware, checkIn);
router.post('/checkout', authMiddleware, checkOut);

// Get attendance
router.get('/my', authMiddleware, getMyAttendance);
router.get('/all', authMiddleware, adminOnly, getAllAttendance);

module.exports = router;