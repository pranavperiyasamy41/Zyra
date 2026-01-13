import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Fixed Import
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/stats', protect, getDashboardStats);

export default router;