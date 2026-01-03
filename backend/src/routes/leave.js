const express = require('express');
const { applyLeave, getMyLeaves, getPendingLeaves, approveLeave, rejectLeave } = require('../controllers/leaveController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Apply for leave
router.post('/apply', authMiddleware, applyLeave);

// Get leaves
router.get('/my', authMiddleware, getMyLeaves);
router.get('/pending', authMiddleware, adminOnly, getPendingLeaves);

// Approve/Reject leave (Admin only)
router.put('/:id/approve', authMiddleware, adminOnly, approveLeave);
router.put('/:id/reject', authMiddleware, adminOnly, rejectLeave);

module.exports = router;