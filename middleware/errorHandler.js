/**
 * Global Express Error Handling Middleware.
 * Catches all unhandled errors thrown in route handlers and middleware,
 * formats them into standardized JSON API error responses, and suppresses stack traces in production.
 *
 * @param {Error} err - Error object passed down via next(err)
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server error';
  let errors = null;

  // 1. Handle Mongoose ValidationError (Field-by-field schema validation failure)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors || {}).reduce((acc, curr) => {
      acc[curr.path] = curr.message;
      return acc;
    }, {});
  }

  // 2. Handle Mongoose CastError (Invalid BSON ObjectId formatting)
  else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // 3. Handle MongoDB Duplicate Key Error (Code 11000, e.g. Unique email constraint)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : null;
    message = field
      ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
      : 'Email already exists';
  }

  // 4. Handle JWT Authentication Errors (Invalid signature or expired token)
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid or expired token';
  }

  // Construct standard error payload
  const responseBody = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  // Include stack trace only in non-production environments
  if (process.env.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

export default errorHandler;
