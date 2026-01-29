import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
import { createSale, getSales, getLastOrder, getSalesAnalytics } from '../controllers/sale.controller.js';

const router = Router();

router.route('/')
  .post(protect, createSale)
  .get(protect, getSales);

router.get('/analytics', protect, getSalesAnalytics);

// Rapid Refill
router.get('/last-order/:mobile', protect, getLastOrder);

export default router;