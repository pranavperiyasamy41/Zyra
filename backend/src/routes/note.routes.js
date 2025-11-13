import { Router } from 'express';
import { getNotes, createNote, deleteNote } from '../controllers/note.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

router.route('/:id')
  .delete(protect, deleteNote);

export default router;
