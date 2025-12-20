import { Router } from 'express';
import protect from '../middleware/auth.middleware.js';
import adminProtect from '../middleware/adminAuth.middleware.js'; // Ensure Admin only for POST/DELETE
import { 
    createAnnouncement, 
    getAnnouncements, 
    deleteAnnouncement 
} from '../controllers/announcement.controller.js';

const router = Router();

router.route('/')
    // Only Admin can create announcements
    .post(protect, adminProtect, createAnnouncement) 
    // Any logged-in user can view announcements
    .get(protect, getAnnouncements); 

router.route('/:id')
    .delete(protect, adminProtect, deleteAnnouncement); // Only Admin can delete

export default router;