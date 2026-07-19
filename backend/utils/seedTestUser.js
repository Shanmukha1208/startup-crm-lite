import connectDB from '../config/database.js';
import User from '../models/User.js';

/**
 * Seed script to ensure standard demo user exists for testing authentication.
 */
export const seedTestUser = async () => {
  try {
    await connectDB();

    const email = 'demo@example.com';
    const password = 'Password123!';

    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({
        name: 'Gowtham Kumar',
        username: 'gowtham',
        email: email.toLowerCase(),
        password,
        role: 'admin',
        avatar: 'purple',
        isActive: true,
        lastLogin: new Date(),
      });
      console.log(`[SEED] Created new test user: ${email} with password: ${password}`);
    } else {
      user.name = user.name || 'Gowtham Kumar';
      user.username = user.username || 'gowtham';
      user.password = password;
      user.isActive = true;
      user.lastLogin = new Date();
      await user.save();
      console.log(`[SEED] Updated existing test user: ${email} with password: ${password}`);
    }
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed test user:', error.message);
  }
};

// If run directly from command line
seedTestUser().then(() => process.exit(0));
