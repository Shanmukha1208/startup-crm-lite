import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getProfile,
  updateProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

/**
 * PRODUCTION RATE LIMITING NOTE:
 * Attach express-rate-limit middleware to /register and /login routes to prevent brute-force attacks.
 * e.g. const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });
 * router.post('/login', authLimiter, ...);
 */

/**
 * Validation rules for user registration
 */
const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * Validation rules for profile updates
 */
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('currentPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Current password must be at least 6 characters'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
];

// 1. User Registration Route
router.post('/register', validate(registerValidation), register);

// 2. User Login Route
router.post('/login', validate(loginValidation), login);

// 3. Get Authenticated User Profile Route
router.get('/me', protect, getProfile);
router.get('/profile', protect, getProfile);

// 4. Update Authenticated User Profile Route
router.put('/me', protect, validate(updateProfileValidation), updateProfile);
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

export default router;
