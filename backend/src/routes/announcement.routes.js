import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { adminProtect } from '../middleware/adminAuth.middleware.js'; // 👈 Import Bodyguard
import { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement 
} from '../controllers/announcement.controller.js';

const router = Router();

// Public: Users can read
router.get('/', protect, getAnnouncements);

// 🔒 Restricted: Only Admins can Post/Delete
router.post('/', protect, adminProtect, createAnnouncement);
router.delete('/:id', protect, adminProtect, deleteAnnouncement);

export default router;