import express from 'express';
import { 
  checkUserExists, // 👈 NEW
  sendOtp, 
  verifyOtp, 
  register, 
  login, 
  googleLogin,
  adminLogin,
  forgotPassword, 
  resetPassword
} from '../controllers/auth.controller.js';

const router = express.Router();

// Email Auth Flow
router.post('/check-user', checkUserExists); // 👈 NEW
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Main Actions
router.post('/register', register);    
router.post('/login', login);          

// Social & Admin
router.post('/google', googleLogin); 
router.post('/admin-login', adminLogin);

// ✅ NEW: Password Recovery
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;