import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ Fixed Import
import { 
  getPendingUsers, 
  approveUser, 
  rejectUser, 
  getAllUsers 
} from '../controllers/admin.controller.js';

const router = Router();

router.get('/pending', protect, getPendingUsers);
router.put('/approve/:id', protect, approveUser);
router.delete('/reject/:id', protect, rejectUser);
router.get('/users', protect, getAllUsers);

export default router;