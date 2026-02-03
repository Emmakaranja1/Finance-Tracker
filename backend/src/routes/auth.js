import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, getMe, forgotPassword, verifyOtp, resetPassword } from '../controllers/authController.js';
import { validateSignup, validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Rate limiter specifically for password reset-related endpoints
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: 'Too many password reset requests from this IP, please try again after 5 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', getMe);
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/reset-password', otpLimiter, resetPassword);

export default router;



