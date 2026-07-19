import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * PRODUCTION SECURITY NOTE:
 * In a production environment, express-rate-limit should be applied to authentication routes
 * (specifically /login and /register) to mitigate brute-force and credential-stuffing attacks.
 * Example:
 *   import rateLimit from 'express-rate-limit';
 *   const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: 'Too many requests' });
 *   router.post('/login', authLimiter, ...);
 */

/**
 * Helper function to generate a signed JWT token for an authenticated user.
 *
 * @param {string|mongoose.Types.ObjectId} userId - MongoDB user ID
 * @returns {string} Signed JWT token string
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new user account.
 *
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user with given email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user (password is automatically hashed by UserSchema pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });

    // Generate authentication token
    const token = generateToken(user._id);

    // Return 201 Created with token and user object (toJSON() strips password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Authenticate user and issue JWT token.
 *
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH DEBUG] Incoming login request for email: ${email}`);

    if (!email || !password) {
      console.log('[AUTH DEBUG] Login failed: Email or password missing in request body');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email and explicitly select password for verification
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      console.log(`[AUTH DEBUG] Login failed: No user found with email ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`[AUTH DEBUG] Login failed: Password comparison failed for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please try again.',
      });
    }

    // Check if user account is deactivated
    if (!user.isActive) {
      console.log(`[AUTH DEBUG] Login failed: User account ${email} is inactive`);
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact support.',
      });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);
    console.log(`[AUTH DEBUG] Login successful for ${email}. JWT issued.`);

    // Return 200 OK with token and user object (toJSON() strips password)
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user,
    });
  } catch (error) {
    console.error('[AUTH DEBUG] Server error during login:', error.message);
    next(error);
  }
};

/**
 * Get current authenticated user profile.
 *
 * @route GET /api/auth/me
 * @access Private
 */
export const getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated user profile (name and/or password).
 *
 * @route PUT /api/auth/me
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, currentPassword, newPassword } = req.body;

    // Find user with password selected for verification
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update name if provided (email changes require verification flow)
    if (name) {
      user.name = name;
    }

    // If updating password, verify current password first
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Incorrect current password',
        });
      }

      user.password = newPassword; // Will be hashed by pre-save hook on save()
    }

    // Save changes
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  generateToken,
  register,
  login,
  getProfile,
  updateProfile,
};
