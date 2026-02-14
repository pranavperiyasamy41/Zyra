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
  toggleUserSuspension,
  updateUserDetails,
  createUser,
  getGlobalSalesAnalytics,
  getAuditLogs,
  getUnverifiedUsers,
  verifyLicense
} from '../controllers/admin.controller.js';

const router = express.Router();

// --- 1. Dashboard Metrics ---
router.get('/stats', protect, admin, getSystemStats);
router.get('/analytics/sales', protect, admin, getGlobalSalesAnalytics);

// --- 2. User Management Routes ---
router.get('/users', protect, admin, getAllUsers);
router.get('/users/pending', protect, admin, getPendingUsers);

// ✅ Approve User
router.put('/approve/:id', protect, admin, approveUser);

// Suspend/Unsuspend User
router.put('/users/:id/suspend', protect, admin, toggleUserSuspension);

// Update User Details
router.put('/users/:id/details', protect, admin, updateUserDetails);

// Create New User (Manual)
router.post('/users', protect, admin, createUser);

// Delete/Reject User
router.delete('/users/:id', protect, admin, rejectUser);

// Update Role
router.put('/users/:id', protect, admin, updateUserRole);

// --- 3. License Verification ---
router.get('/licenses/pending', protect, admin, getUnverifiedUsers); // 🆕
router.put('/licenses/:id', protect, admin, verifyLicense); // 🆕

// --- 4. Audit Logs ---
router.get('/logs', protect, admin, getAuditLogs);

export default router;