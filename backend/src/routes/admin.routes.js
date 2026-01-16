import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
    getSystemStats, getAllUsers, getPendingUsers, 
    approveUser, rejectUser, updateUserRole, getAuditLogs // 👈 Added getAuditLogs
} from '../controllers/admin.controller.js';
import { getAllTickets, resolveTicket } from '../controllers/ticket.controller.js'; // 👈 Added Ticket Controller

const router = Router();

// --- User Management ---
router.get('/stats', protect, admin, getSystemStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/pending', protect, admin, getPendingUsers);
router.put('/users/:id/approve', protect, admin, approveUser);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, rejectUser);

// --- ✅ NEW: Audit Logs ---
router.get('/logs', protect, admin, getAuditLogs);

// --- ✅ NEW: Admin Support ---
router.get('/tickets', protect, admin, getAllTickets);
router.put('/tickets/:id/resolve', protect, admin, resolveTicket);

export default router;