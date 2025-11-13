import { Router } from 'express';
import { recordSale, getSalesHistory } from '../controllers/sale.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = Router();

router.route('/')
  .post(protect, recordSale)
  .get(protect, getSalesHistory);

export default router;