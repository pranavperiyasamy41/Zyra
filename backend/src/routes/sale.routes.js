import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; 
// ✅ FIXED IMPORT: Changed 'sales.controller.js' to 'sale.controller.js'
import { createSale, getSales, getLastOrder, getSalesPredictions } from '../controllers/sale.controller.js';

const router = Router();

router.route('/')
  .post(protect, createSale)
  .get(protect, getSales);

// Rapid Refill
router.get('/last-order/:mobile', protect, getLastOrder);

// 🔮 AI Predictions Route
router.get('/predict', protect, getSalesPredictions);

export default router;