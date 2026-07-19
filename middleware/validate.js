import { validationResult } from 'express-validator';

/**
 * Express-validator middleware wrapper.
 * Runs an array of validation rules and returns a 400 Bad Request response with structured error messages if validation fails.
 *
 * @param {Array} validations - Array of express-validator ValidationChain objects
 * @returns {Function} Express middleware function
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validation rules concurrently against the request
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors into array of { field, message } objects
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return res.status(400).json({
      success: false,
      message: formattedErrors[0]?.message || 'Validation Error',
      errors: formattedErrors,
    });
  };
};

export default validate;
