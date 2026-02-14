import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { updateUserProfile, getUserProfile } from '../controllers/user.controller.js';

const router = Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;