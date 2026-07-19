import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Ensure environment variables are loaded
dotenv.config();

// Configure DNS resolution order for Windows environments
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback gracefully if system restricts custom DNS servers
}

/**
 * Connects to MongoDB Atlas cluster using Mongoose v9 API.
 * Sanitizes connection string, handles errors, and provides detailed troubleshooting output.
 *
 * @async
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
const connectDB = async () => {
  try {
    const rawUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    if (!rawUri) {
      console.error('CRITICAL ERROR: MONGO_URI or MONGODB_URI is not defined in process.env');
      process.exit(1);
    }

    // Sanitize URI string by removing any leading/trailing whitespace
    const sanitizedUri = rawUri.trim();

    // Configure connection with server selection timeout to prevent infinite hanging
    const conn = await mongoose.connect(sanitizedUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[DB LOG] MongoDB Connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('\n------------------------------------------------------------');
    console.error('DATABASE CONNECTION FAILURE:');
    console.error(`Error Message: ${error.message}`);

    if (error.message && error.message.includes('bad auth')) {
      console.error('\nTROUBLESHOOTING MONGODB ATLAS AUTHENTICATION:');
      console.error('1. Check MongoDB Atlas -> Security -> Database Access:');
      console.error('   Verify username "shanmukhadasari7_db_user" and password are exact match.');
      console.error('2. Special Characters in Password:');
      console.error('   If password contains special characters (@, :, /, ?, #, %), ensure it is URL-encoded with encodeURIComponent().');
      console.error('3. Check MongoDB Atlas -> Security -> Network Access:');
      console.error('   Ensure your current IP address (or 0.0.0.0/0) is added to the IP Access List.');
    }
    console.error('------------------------------------------------------------\n');

    process.exit(1);
  }
};

export { connectDB };
export default connectDB;
