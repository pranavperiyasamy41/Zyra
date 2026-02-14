import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getSettings, updateSettings } from '../controllers/systemSettings.controller.js';

const router = express.Router();

router.get('/', protect, getSettings); // Authenticated users can view
router.put('/', protect, admin, updateSettings); // Only Admins can edit

export default router;