import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile - Fetch current authenticated user profile
router.get('/', protect, getProfile);

// PUT /api/profile - Update current user profile details
router.put('/', protect, updateProfile);

// PUT /api/profile/change-password - Change current user password
router.put('/change-password', protect, changePassword);

export default router;
