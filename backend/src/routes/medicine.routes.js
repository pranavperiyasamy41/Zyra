import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js'; // ✅ FIXED: Added { } curly braces

// Import all controller functions
import { 
  addMedicine, 
  getMedicines,
  updateMedicine,
  deleteMedicine,
  getLowStockAlerts,
  getExpiryAlerts,
  getOutOfStockAlerts,
  bulkAddMedicines // 🆕 IMPORT
} from '../controllers/medicine.controller.js';

const router = Router();

// --- Define our protected routes ---

// Routes for /api/medicines
router.route('/')
  .get(protect, getMedicines)   // Gets all medicines
  .post(protect, addMedicine);  // Adds a new medicine

// 🆕 Bulk Import
router.post('/bulk', protect, bulkAddMedicines);

// Alert routes
// These must come BEFORE the /:id route
router.get('/alerts/low-stock', protect, getLowStockAlerts);
router.get('/alerts/expiry', protect, getExpiryAlerts);
router.get('/alerts/out-of-stock', protect, getOutOfStockAlerts);

// Routes for /api/medicines/:id
router.route('/:id')
  .put(protect, updateMedicine)     // Updates a specific medicine
  .delete(protect, deleteMedicine); // Deletes a specific medicine

export default router;