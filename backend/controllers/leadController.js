import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from '../utils/apiResponse.js';

// Valid Enum values matching Lead Schema
const VALID_STATUSES = [
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

const VALID_SOURCES = [
  'Website',
  'Referral',
  'LinkedIn',
  'Cold Call',
  'Email Campaign',
  'Other',
];

/**
 * Get paginated leads list with dynamic multi-field filtering, search, and date range support.
 *
 * @param {import('express').Request} req - Express request with query params & req.user
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Query Params: page, limit, sortBy, sortOrder, status, search, source, dateFrom, dateTo
 * @outputs Standardized Paginated JSON Response containing matching lead documents & pagination metadata
 */
export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      search,
      source,
      dateFrom,
      dateTo,
    } = req.query;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeads] Querying leads for user: ${req.user._id}`);
    }

    // Always enforce owner isolation
    const filter = { owner: req.user._id };

    // Add status filter if provided and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Add source filter if provided and not 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Add case-insensitive regex search filter across name, company, email
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ];
    }

    // Add dateFrom / dateTo filter on createdAt field
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // Calculate pagination & sorting values
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortBy]: sortDirection };

    // Concurrently fetch matching lead documents and total document count
    const [leads, total] = await Promise.all([
      Lead.find(filter).sort(sortObj).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * Perform a fast autocomplete search for leads.
 *
 * @param {import('express').Request} req - Express request containing req.query.q and optional limit
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Query: q (search term), limit (default 5)
 * @outputs Standardized JSON response returning array of lightweight lead objects (_id, name, company, email, status)
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim() === '') {
      return successResponse(res, [], 'Empty query');
    }

    const searchRegex = new RegExp(q.trim(), 'i');
    const limitNum = Math.min(20, Math.max(1, parseInt(limit, 10)));

    const leads = await Lead.find({
      owner: req.user._id,
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ],
    })
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search results retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lead owned by the current authenticated user.
 *
 * @param {import('express').Request} req - Express request containing lead details in req.body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Body: name, company, jobTitle, email, phone, status, source, priority, notes
 * @outputs 201 Created Response with newly created lead document
 */
export const createLead = async (req, res, next) => {
  try {
    const { name, company, jobTitle, email, phone, status, source, priority, notes } = req.body;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[createLead] Creating lead for user: ${req.user._id}`);
    }

    // Create lead explicitly linking owner to req.user._id
    const lead = await Lead.create({
      name,
      company,
      jobTitle,
      email,
      phone,
      status: status || 'New',
      source: source || 'Website',
      priority: priority || 'Medium',
      notes,
      owner: req.user._id,
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single lead by ID owned by the current authenticated user.
 *
 * @param {import('express').Request} req - Express request containing req.params.id
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Params: id (lead ObjectId)
 * @outputs 200 OK Response with lead document or 404 Not Found
 */
export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadById] Fetching lead ${id} for user ${req.user._id}`);
    }

    // Enforce owner isolation
    const lead = await Lead.findOne({ _id: id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing lead owned by the current authenticated user.
 *
 * @param {import('express').Request} req - Express request containing req.params.id and updated fields in req.body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Params: id; Body: name, company, jobTitle, email, phone, status, source, priority, notes
 * @outputs 200 OK Response with updated lead document or 404 Not Found
 */
export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLead] Updating lead ${id} for user ${req.user._id}`);
    }

    // Clone req.body and strictly prevent changing the owner field
    const updateData = { ...req.body };
    delete updateData.owner;

    // Find and update document ensuring owner isolation
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Update only the status of a lead.
 *
 * @param {import('express').Request} req - Express request with status in req.body
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Params: id; Body: status
 * @outputs 200 OK Response with updated lead document
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return errorResponse(
        res,
        `Status must be one of: ${VALID_STATUSES.join(', ')}`,
        400
      );
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLeadStatus] Updating status of lead ${id} to ${status}`);
    }

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(
      res,
      updatedLead,
      'Lead status updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a lead owned by the current authenticated user.
 *
 * @param {import('express').Request} req - Express request containing req.params.id
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @inputs Params: id (lead ObjectId)
 * @outputs 200 OK Response with deletion confirmation message
 */
export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (process.env.NODE_ENV === 'development') {
      console.log(`[deleteLead] Deleting lead ${id} for user ${req.user._id}`);
    }

    const lead = await Lead.findOne({ _id: id, owner: req.user._id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    await lead.deleteOne();

    return successResponse(res, null, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get dashboard pipeline stats aggregated in a SINGLE MongoDB query using $facet.
 *
 * @param {import('express').Request} req - Express request containing req.user
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @outputs 200 OK Response with totalLeads, statusBreakdown, conversionRate, sourceBreakdown, thisMonthLeads, lastMonthLeads, and growthRate
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadStats] Aggregating stats for user ${req.user._id}`);
    }

    const ownerObjectId = new mongoose.Types.ObjectId(req.user._id);

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [aggregationResults] = await Lead.aggregate([
      { $match: { owner: ownerObjectId } },
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          bySource: [{ $group: { _id: '$source', count: { $sum: 1 } } }],
          thisMonth: [
            { $match: { createdAt: { $gte: startOfThisMonth } } },
            { $count: 'count' },
          ],
          lastMonth: [
            {
              $match: {
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
              },
            },
            { $count: 'count' },
          ],
        },
      },
    ]);

    const totalLeads = aggregationResults?.total[0]?.count || 0;

    // Status breakdown default map
    const statusBreakdown = VALID_STATUSES.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    (aggregationResults?.byStatus || []).forEach((item) => {
      if (item._id && statusBreakdown.hasOwnProperty(item._id)) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Source breakdown default map
    const sourceBreakdown = VALID_SOURCES.reduce((acc, src) => {
      acc[src] = 0;
      return acc;
    }, {});

    (aggregationResults?.bySource || []).forEach((item) => {
      if (item._id && sourceBreakdown.hasOwnProperty(item._id)) {
        sourceBreakdown[item._id] = item.count;
      }
    });

    const wonLeads = statusBreakdown['Won'] || 0;
    const conversionRate =
      totalLeads > 0 ? Number(((wonLeads / totalLeads) * 100).toFixed(1)) : 0;

    const thisMonthLeads = aggregationResults?.thisMonth[0]?.count || 0;
    const lastMonthLeads = aggregationResults?.lastMonth[0]?.count || 0;

    let growthRate = 0;
    if (lastMonthLeads > 0) {
      growthRate = Number(
        (((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1)
      );
    } else if (thisMonthLeads > 0) {
      growthRate = 100;
    }

    const stats = {
      totalLeads,
      statusBreakdown,
      conversionRate,
      sourceBreakdown,
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
    };

    return successResponse(res, stats, 'Lead statistics retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get monthly aggregated lead statistics for the last 6 months for analytics charts.
 *
 * @param {import('express').Request} req - Express request containing req.user
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @outputs 200 OK Response with array of monthly objects: [{ month: 'Jan 2026', total: 12, won: 4, lost: 2, conversionRate: 33.3 }, ...]
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getMonthlyStats] Aggregating 6-month stats for user ${req.user._id}`);
    }

    const ownerObjectId = new mongoose.Types.ObjectId(req.user._id);

    const now = new Date();
    // 5 months back from current month = 6 months total
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyRaw = await Lead.aggregate([
      {
        $match: {
          owner: ownerObjectId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] },
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlyStats = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth(); // 0-indexed
      const monthLabel = `${monthNames[monthIdx]} ${year}`;

      const found = monthlyRaw.find(
        (item) => item._id.year === year && item._id.month === monthIdx + 1
      );

      const total = found ? found.total : 0;
      const won = found ? found.won : 0;
      const lost = found ? found.lost : 0;
      const conversionRate =
        total > 0 ? Number(((won / total) * 100).toFixed(1)) : 0;

      monthlyStats.push({
        month: monthLabel,
        total,
        won,
        lost,
        conversionRate,
      });
    }

    return successResponse(
      res,
      monthlyStats,
      'Monthly statistics retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getLeads,
  searchLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
};
