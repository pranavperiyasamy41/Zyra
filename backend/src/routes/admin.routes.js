import { Router } from 'express';
import protect from '../middleware/auth.middleware.js'; 
import adminProtect from '../middleware/adminAuth.middleware.js'; 
import { 
    getAllUsers, 
    updateUserRole, 
    deleteUser,
    getAdminMetrics, // <-- NEW IMPORT
    setUserApprovalStatus // <-- NEW IMPORT
} from '../controllers/admin.controller.js'; 

const router = Router();

// Route for getting ALL users
router.route('/users')
    .get(protect, adminProtect, getAllUsers);

// Route for specific user actions
router.route('/users/:id')
    .put(protect, adminProtect, updateUserRole) 
    .delete(protect, adminProtect, deleteUser); 

// --- NEW ROUTE: ADMIN DASHBOARD METRICS ---
router.route('/metrics')
    .get(protect, adminProtect, getAdminMetrics); 

// --- NEW ROUTE: SET USER APPROVAL STATUS ---
router.route('/users/:id/approve')
    .put(protect, adminProtect, setUserApprovalStatus); 

export default router;