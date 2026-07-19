/**
 * Sends a standardized success API response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {any} [data=null] - Payload to be returned in the response
 * @param {string} [message='Operation successful'] - Descriptive success message
 * @param {number} [statusCode=200] - HTTP status code
 * @returns {import('express').Response} Express JSON response
 */
export const successResponse = (
  res,
  data = null,
  message = 'Operation successful',
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends a standardized error API response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {string} [message='An error occurred'] - Descriptive error message
 * @param {number} [statusCode=500] - HTTP status code
 * @param {any} [errors=null] - Additional detailed error objects or array of validation errors
 * @returns {import('express').Response} Express JSON response
 */
export const errorResponse = (
  res,
  message = 'An error occurred',
  statusCode = 500,
  errors = null
) => {
  const responseBody = {
    success: false,
    message,
  };

  if (errors !== null) {
    responseBody.errors = errors;
  }

  return res.status(statusCode).json(responseBody);
};

/**
 * Sends a standardized paginated data API response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {Array} data - Array of record items for current page
 * @param {number} total - Total count of records matching criteria
 * @param {number} page - Current page number
 * @param {number} limit - Number of items per page
 * @returns {import('express').Response} Express JSON response
 */
export const paginatedResponse = (res, data, total, page, limit, extra = {}) => {
  const numericTotal = Number(total) || 0;
  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 10;
  const pages = Math.ceil(numericTotal / numericLimit) || 1;

  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total: numericTotal,
      page: numericPage,
      limit: numericLimit,
      pages,
      hasNext: numericPage < pages,
      hasPrev: numericPage > 1,
      ...extra,
    },
  });
};

export default {
  successResponse,
  errorResponse,
  paginatedResponse,
};
