import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createTicket, getMyTickets } from '../controllers/ticket.controller.js';

const router = Router();

router.post('/', protect, createTicket);
router.get('/my', protect, getMyTickets);

export default router;