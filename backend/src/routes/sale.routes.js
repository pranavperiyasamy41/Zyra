import { Router } from 'express';
import { recordSale, getSalesHistory, deleteSale, updateSale } from '../controllers/sale.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.route('/')
  .post(protect, recordSale)
  .get(protect, getSalesHistory);

// --- ADD THESE NEW ROUTES ---
router.route('/:id')
  .delete(protect, deleteSale)
  .put(protect, updateSale);

export default router;