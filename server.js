import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';

// Database Connection
import { connectDB } from './config/database.js';

// Route Handlers
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

// Global Error Handler Middleware
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables from .env file
dotenv.config();

/**
 * Validates mandatory environment variables before attempting database connection.
 * Prevents deploying or launching server with missing configuration.
 */
const checkRequiredEnvVars = () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  const port = process.env.PORT;

  const missingVars = [];
  if (!mongoUri) missingVars.push('MONGO_URI / MONGODB_URI');
  if (!jwtSecret) missingVars.push('JWT_SECRET');
  if (!port) missingVars.push('PORT');

  if (missingVars.length > 0) {
    console.error('\n------------------------------------------------------------');
    console.error('CRITICAL CONFIGURATION ERROR:');
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please check your .env file and ensure all mandatory keys are set.');
    console.error('------------------------------------------------------------\n');
    process.exit(1);
  }
};

// Initialize Express application
const app = express();

/**
 * -----------------------------------------------------------------------------
 * Security & Optimization Middlewares
 * -----------------------------------------------------------------------------
 */

// 1. Helmet helps secure Express apps by setting various HTTP headers
app.use(helmet());

// 2. Environment-aware Morgan HTTP logger
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// 3. Prevent MongoDB NoSQL Operator Injection Attacks (Express 5 compatible)
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});

// 4. Rate Limiting Middlewares
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per IP per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 200, // Higher limit in development for seamless testing
  message: {
    success: false,
    message: 'Too many auth attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters to API routes
app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// 5. Cross-Origin Resource Sharing (CORS) Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

// 6. Parse incoming JSON requests with a strict size limit to prevent payload attacks
app.use(express.json({ limit: '10kb' }));

// 7. Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

/**
 * -----------------------------------------------------------------------------
 * API Route Declarations
 * -----------------------------------------------------------------------------
 */

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Primary Business Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/profile', profileRoutes);

/**
 * -----------------------------------------------------------------------------
 * Centralized Error Handling Middleware
 * Must be registered LAST, after all API routes
 * -----------------------------------------------------------------------------
 */
app.use(errorHandler);

/**
 * -----------------------------------------------------------------------------
 * Server Initialization & Database Connection
 * -----------------------------------------------------------------------------
 */
let server;

const startServer = async () => {
  try {
    // 1. Verify required environment variables on startup
    checkRequiredEnvVars();

    // 2. Connect to MongoDB Atlas
    await connectDB();

    const PORT = process.env.PORT || 5000;
    const NODE_ENV = process.env.NODE_ENV || 'development';

    // 3. Start Express listener
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

/**
 * -----------------------------------------------------------------------------
 * Graceful Shutdown Handler
 * Closes HTTP listener & MongoDB connection cleanly on SIGTERM / SIGINT
 * -----------------------------------------------------------------------------
 */
const handleGracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed cleanly.');
        process.exit(0);
      } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

startServer();

export default app;
