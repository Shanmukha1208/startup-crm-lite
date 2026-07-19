import User from '../models/User.js';

/**
 * Get current authenticated user profile.
 *
 * @route GET /api/profile
 * @access Private
 */
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Ensure username is present if missing
    if (!user.username && user.email) {
      user.username = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
      await user.save();
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update authenticated user profile details (name, username, email, avatar).
 *
 * @route PUT /api/profile
 * @access Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, username, email, avatar } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // If email is changing, check for uniqueness
    if (email && email.toLowerCase() !== user.email) {
      const existingEmail = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account',
        });
      }
      user.email = email.toLowerCase();
    }

    // If username is changing, check for uniqueness
    if (username && username.toLowerCase() !== user.username) {
      const existingUsername = await User.findOne({
        username: username.toLowerCase(),
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken',
        });
      }
      user.username = username.toLowerCase();
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

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

/**
 * Change authenticated user's password securely.
 *
 * @route PUT /api/profile/change-password
 * @access Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Confirm password does not match new password',
      });
    }

    // Password Complexity Validation Rules:
    // - Minimum 8 characters
    // - At least one uppercase letter
    // - At least one lowercase letter
    // - At least one number
    // - At least one special character
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long',
      });
    }

    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_+-]/.test(newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({
        success: false,
        message:
          'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      });
    }

    // Select user with password field to compare
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Assign new password (will be hashed automatically by UserSchema pre-save hook)
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};
