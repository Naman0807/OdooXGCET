const express = require('express');
const { signUp, signIn, verifyEmail, resendVerification, getUserStatus } = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/status', getUserStatus);

module.exports = router;