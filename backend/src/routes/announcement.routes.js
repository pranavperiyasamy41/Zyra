import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ FIXED: Added { }
import { 
  createAnnouncement, 
  getAnnouncements, 
  deleteAnnouncement 
} from '../controllers/announcement.controller.js';

const router = Router();

router.route('/')
  .post(protect, createAnnouncement)
  .get(protect, getAnnouncements);

router.delete('/:id', protect, deleteAnnouncement);

export default router;