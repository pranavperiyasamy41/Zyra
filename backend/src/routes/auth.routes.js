import express from 'express';
import { 
  sendOtp, 
  verifyOtp, 
  register, 
  login, 
  googleLogin,
  adminLogin
} from '../controllers/auth.controller.js';

const router = express.Router();

// Email Auth Flow
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Main Actions
router.post('/register', register);    // Handles Wizard Signup
router.post('/login', login);          // Handles Email/Password Login

// ✅ FIX: Change '/google-login' to '/google' to match Frontend
router.post('/google', googleLogin); 
router.post('/admin-login', adminLogin);

export default router;