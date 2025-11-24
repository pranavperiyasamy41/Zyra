import { Router } from 'express';
import protect from '../middleware/auth.middleware.js'; // Standard Auth Check
import adminProtect from '../middleware/adminAuth.middleware.js'; // Role Check
import { getAllUsers } from '../controllers/admin.controller.js';

const router = Router();

// --- ALL ROUTES HERE ARE ADMIN ONLY ---
router.route('/users')
    // Route chain: 1. Auth check, 2. Role check, 3. Controller
    .get(protect, adminProtect, getAllUsers);

export default router;