import express from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  searchLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to ALL routes in leadRoutes
router.use(protect);

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
 * Validation rules for creating a lead
 */
const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Lead name must be between 2 and 100 characters'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('jobTitle').optional().trim(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('phone').optional().trim(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    ),
  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(
      `Source must be one of: ${VALID_SOURCES.join(', ')}`
    ),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be one of: Low, Medium, High'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

/**
 * Validation rules for updating a lead
 */
const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Lead name must be between 2 and 100 characters'),
  body('company')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('phone').optional().trim(),
  body('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    ),
  body('source')
    .optional()
    .isIn(VALID_SOURCES)
    .withMessage(
      `Source must be one of: ${VALID_SOURCES.join(', ')}`
    ),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes cannot exceed 1000 characters'),
];

/**
 * Validation rules for updating lead status only
 */
const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(VALID_STATUSES)
    .withMessage(
      `Status must be one of: ${VALID_STATUSES.join(', ')}`
    ),
];

/**
 * Lead Routes
 * NOTE: Specific named routes (/stats, /monthly-stats) MUST be defined before parameterized routes (/:id)
 */

// 1. Get Dashboard Pipeline Stats
router.get('/stats', getLeadStats);

// 2. Get 6-Month Pipeline Analytics Stats
router.get('/monthly-stats', getMonthlyStats);

// 3. Quick Autocomplete Search Endpoint
router.get('/search', searchLeads);

// 4. Get All Leads (Paginated, Filtered, Searched)
router.get('/', getLeads);

// 4. Create New Lead
router.post('/', validate(createLeadValidation), createLead);

// 5. Get Lead by ID
router.get('/:id', getLeadById);

// 6. Update Lead
router.put('/:id', validate(updateLeadValidation), updateLead);

// 7. Update Lead Status Only
router.patch('/:id/status', validate(updateStatusValidation), updateLeadStatus);

// 8. Delete Lead
router.delete('/:id', deleteLead);

export default router;
