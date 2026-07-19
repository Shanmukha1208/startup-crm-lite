import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Authentication Protection Middleware.
 * Verifies JWT token from Authorization header and attaches authenticated user document to req.user.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Extract Bearer token from HTTP Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 1. Check if token is missing
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied',
      });
    }

    // 2. Verify token payload & signature
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired, please login again',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Token is invalid',
      });
    }

    // 3. Find user in database by decoded ID (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      });
    }

    // 4. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated, access denied',
      });
    }

    // Attach user payload to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
