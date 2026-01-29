import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  createSupplier, 
  getSuppliers, 
  updateSupplier, 
  deleteSupplier 
} from '../controllers/supplier.controller.js';

const router = Router();

router.route('/')
  .post(protect, createSupplier)
  .get(protect, getSuppliers);

router.route('/:id')
  .put(protect, updateSupplier)
  .delete(protect, deleteSupplier);

export default router;