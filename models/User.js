import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition for Startup CRM Lite backend.
 * Handles user identity, authentication credentials, authorization roles, and account status.
 */
const UserSchema = new mongoose.Schema(
  {
    /**
     * User's full name.
     * Must be between 2 and 50 characters long and will be automatically trimmed of leading/trailing whitespace.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },

    /**
     * User's primary email address used for authentication and communications.
     * Must be unique across the system, valid email format, and stored in lowercase.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email must be a valid email address',
      ],
    },

    /**
     * Hashed user password for authentication.
     * Minimum 6 characters before hashing. Automatically hashed before saving using bcryptjs.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },

    /**
     * User authorization role determining system permissions.
     * Options: 'admin' | 'user'. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be either admin or user',
      },
      default: 'user',
    },

    /**
     * Unique username for user profile handle.
     */
    username: {
      type: String,
      trim: true,
      lowercase: true,
    },

    /**
     * Profile photo or avatar URL.
     */
    avatar: {
      type: String,
      default: '',
    },

    /**
     * Timestamp of the user's last login session.
     */
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    /**
     * Flag indicating whether the user account is active.
     * Can be set to false to deactivate a user account without deleting record history.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

/**
 * Pre-save middleware to hash the user password before persisting to MongoDB.
 * Hashing is only performed if the password field has been modified (or is new).
 */
UserSchema.pre('save', async function () {
  if (!this.username && this.email) {
    const defaultUsername = this.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_');
    this.username = defaultUsername;
  }

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a plain text candidate password with the user's stored hashed password.
 *
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} True if the candidate password matches the stored hash, false otherwise.
 */
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override default toJSON method to remove sensitive password field when converting document to JSON.
 *
 * @returns {Object} User document object without the password field.
 */
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Compile and instantiate the User model
const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Export both the model and the schema separately
export { UserSchema, User };
export default User;
