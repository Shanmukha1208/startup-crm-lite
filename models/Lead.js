import mongoose from 'mongoose';

/**
 * Lead Schema definition for Startup CRM Lite backend.
 * Represents sales leads tracked within the CRM system, associated with an owner user.
 */
const LeadSchema = new mongoose.Schema(
  {
    /**
     * Full name of the sales lead or primary contact person.
     * Must be between 2 and 100 characters long and trimmed of whitespace.
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minLength: [2, 'Lead name must be at least 2 characters long'],
      maxLength: [100, 'Lead name cannot exceed 100 characters'],
    },

    /**
     * Organization or company associated with the sales lead.
     * Trimmed of leading/trailing whitespace.
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    /**
     * Job title or designation of the lead contact person.
     */
    jobTitle: {
      type: String,
      trim: true,
    },

    /**
     * Priority level of the lead ('Low' | 'Medium' | 'High').
     */
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be one of: Low, Medium, High',
      },
      default: 'Medium',
    },

    /**
     * Contact email address for the lead.
     * Must match valid email regex format and is automatically trimmed.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email must be a valid email address',
      ],
    },

    /**
     * Contact phone number for the lead.
     * Optional field, trimmed of whitespace.
     */
    phone: {
      type: String,
      trim: true,
    },

    /**
     * Current status of the lead in the sales pipeline.
     * Allowed options match frontend UI values exactly:
     * 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost'
     */
    status: {
      type: String,
      enum: {
        values: [
          'New',
          'Contacted',
          'Meeting Scheduled',
          'Proposal Sent',
          'Won',
          'Lost',
        ],
        message:
          'Status must be one of: New, Contacted, Meeting Scheduled, Proposal Sent, Won, Lost',
      },
      default: 'New',
    },

    /**
     * Acquisition source of the lead.
     * Allowed options match frontend UI values exactly:
     * 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other'
     */
    source: {
      type: String,
      enum: {
        values: [
          'Website',
          'Referral',
          'LinkedIn',
          'Cold Call',
          'Email Campaign',
          'Other',
        ],
        message:
          'Source must be one of: Website, Referral, LinkedIn, Cold Call, Email Campaign, Other',
      },
      default: 'Website',
    },

    /**
     * Additional notes, comments, or communication log regarding the lead.
     * Optional field, maximum 1000 characters.
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    /**
     * Reference to the User who owns or created this lead record.
     * Points to the '_id' field of the 'User' model.
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Virtual property calculating the age of the lead in days.
 * Computed dynamically from the `createdAt` timestamp up to the current date.
 * Useful for pipeline analytics and stale lead identification.
 *
 * @returns {number} Number of days since the lead was created.
 */
LeadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  const diffInMs = Date.now() - new Date(this.createdAt).getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
});

/**
 * Compound index on (owner, createdAt) for date range filtering and chronological queries.
 */
LeadSchema.index({ owner: 1, createdAt: -1 });

/**
 * Compound index on (owner, status) to optimize filtered pipeline queries.
 */
LeadSchema.index({ owner: 1, status: 1 });

/**
 * Compound index on (owner, source) for source analytics queries.
 */
LeadSchema.index({ owner: 1, source: 1 });

/**
 * Compound index on (owner, email) for fast lookup.
 */
LeadSchema.index({ owner: 1, email: 1 });

/**
 * Compound index on (owner, name, company) for fast search.
 */
LeadSchema.index({ owner: 1, name: 1, company: 1 });

// Compile and instantiate the Lead model
const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

// Export both the model and the schema separately
export { LeadSchema, Lead };
export default Lead;
