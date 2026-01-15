import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminProtect } from '../middleware/adminAuth.middleware.js';
import { 
    getAllUsers, 
    approveUser, 
    rejectUser, 
    getPendingUsers,
    getSystemStats,
    updateUserRole // 👈 Import new function
} from '../controllers/admin.controller.js';

const router = Router();

router.use(protect, adminProtect);

router.get('/metrics', getSystemStats);
router.get('/users', getAllUsers);
router.get('/pending-users', getPendingUsers);

// ✅ FIXED: Matches Frontend Calls
router.put('/approve/:id', approveUser);
router.delete('/users/:id', rejectUser); // Changed from /reject/:id to match generic delete if preferred, or keep as reject.
// Let's match the Frontend's expectation for Role Update:
router.put('/users/:id', updateUserRole); 

export default router;