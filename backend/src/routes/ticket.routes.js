import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  createTicket, 
  getMyTickets,
  getAllTickets,
  resolveTicket
} from '../controllers/ticket.controller.js';

const router = Router();

// User Routes
router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);

// Admin Routes
router.get('/all', protect, admin, getAllTickets);
router.put('/:id/resolve', protect, admin, resolveTicket);

export default router;