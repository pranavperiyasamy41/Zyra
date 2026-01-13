import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Fixed Import
import { updateUserProfile } from '../controllers/user.controller.js';

const router = Router();

router.put('/profile', protect, updateUserProfile);

export default router;