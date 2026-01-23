import express from 'express';
// ✅ FIX: Import from 'authMiddleware.js' (the existing file name)
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  getSystemStats,
  getAllUsers, 
  getPendingUsers,
  approveUser, 
  rejectUser,
  updateUserRole, 
  getAuditLogs
} from '../controllers/admin.controller.js';

const router = express.Router();

// --- 1. Dashboard Metrics ---
router.get('/stats', protect, admin, getSystemStats);

// --- 2. User Management Routes ---
router.get('/users', protect, admin, getAllUsers);
router.get('/users/pending', protect, admin, getPendingUsers);

// ✅ Approve User
router.put('/approve/:id', protect, admin, approveUser);

// Delete/Reject User
router.delete('/users/:id', protect, admin, rejectUser);

// Update Role
router.put('/users/:id', protect, admin, updateUserRole);

// --- 3. Audit Logs ---
router.get('/logs', protect, admin, getAuditLogs);

export default router;