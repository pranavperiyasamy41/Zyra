import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { 
  getNotes, 
  createNote, // ✅ FIXED: Changed 'addNote' to 'createNote'
  deleteNote 
} from '../controllers/note.controller.js';

const router = Router();

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote); // ✅ FIXED: Uses createNote

router.delete('/:id', protect, deleteNote);

export default router;