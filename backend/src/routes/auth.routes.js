import { Router } from 'express';
import { 
  registerEmail, 
  registerVerify, 
  loginUser,
  forgotPassword,  // <-- 1. Import
  resetPassword
} from '../controllers/auth.controller.js';

const router = Router();

// Define the route
// When a POST request comes to /register, use the registerUser function
router.post('/register-email', registerEmail);
router.post('/register-verify', registerVerify);

router.post('/login', loginUser);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;