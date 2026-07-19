import api from './api';

/**
 * Lead Management API Service handling CRM lead CRUD operations and pipeline analytics.
 */

/**
 * Fetch paginated leads list with optional filtering and search parameters.
 *
 * @param {Object} [params={}] - Filter and pagination query parameters
 * @returns {Promise<Object>} API response data containing array of leads & pagination info
 */
export const getLeads = async (params = {}) => {
  const response = await api.get('/api/leads', { params });
  return response.data;
};

/**
 * Create a new lead record.
 *
 * @param {Object} leadData - Lead details payload
 * @returns {Promise<Object>} API response data containing created lead object
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return response.data;
};

/**
 * Update an existing lead record.
 *
 * @param {string} id - Lead MongoDB ObjectId
 * @param {Object} leadData - Fields to update
 * @returns {Promise<Object>} API response data containing updated lead object
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return response.data;
};

/**
 * Update only the status of a lead record.
 *
 * @param {string} id - Lead MongoDB ObjectId
 * @param {string} status - New lead status
 * @returns {Promise<Object>} API response data containing updated lead object
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return response.data;
};

/**
 * Delete a lead record.
 *
 * @param {string} id - Lead MongoDB ObjectId
 * @returns {Promise<Object>} API response data with operation message
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fetch dashboard pipeline summary statistics.
 *
 * @returns {Promise<Object>} API response data containing aggregate stats
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats');
  return response.data;
};

/**
 * Fetch 6-month historical monthly analytics for pipeline charts.
 *
 * @returns {Promise<Object>} API response data containing monthly aggregation array
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/monthly-stats');
  return response.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
};
