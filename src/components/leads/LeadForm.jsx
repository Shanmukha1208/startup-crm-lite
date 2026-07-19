import React, { useState, useEffect } from 'react';

// Options list definitions
const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];

/**
 * LeadForm component handles lead record creation and modification.
 * Features built-in required field validation (Name, Company, Email) and formatting checks.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} [props.initialData] - Existing lead data for editing mode (optional)
 * @param {function} props.onSubmit - Function called on successful validation with form values
 * @param {function} props.onCancel - Function called to cancel the action
 * @returns {React.ReactElement} The rendered LeadForm component
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  // Initialize state variables for input fields
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
    priority: 'Medium',
    notes: '',
  });

  // Track field validation error messages
  const [errors, setErrors] = useState({});

  // Sync state if editing an existing lead
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
        priority: initialData.priority || 'Medium',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  // Handle generic text/dropdown inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user begins correcting it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Run validation checks on submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate Name (Required)
    if (!formData.name.trim()) {
      newErrors.name = 'Lead Name is required';
    }

    // Validate Company (Required)
    if (!formData.company.trim()) {
      newErrors.company = 'Company Name is required';
    }

    // Validate Email (Required + Format)
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // If validation fails, set errors and halt submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Call onSubmit callback with formatted inputs
    onSubmit({
      ...formData,
      name: formData.name.trim(),
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      notes: formData.notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Grid: Name & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name Input */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Lead Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Jane Doe"
            className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
              errors.name ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
            }`}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <span className="text-xs font-semibold text-danger">
              {errors.name}
            </span>
          )}
        </div>

        {/* Company Input */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="company" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Company <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Acme Inc"
            className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
              errors.company ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
            }`}
            aria-invalid={!!errors.company}
          />
          {errors.company && (
            <span className="text-xs font-semibold text-danger">
              {errors.company}
            </span>
          )}
        </div>
      </div>

      {/* Grid: Job Title & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Job Title Input */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="jobTitle" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. VP of Product"
            className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all"
          />
        </div>

        {/* Email Input */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Email <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. jane@acme.com"
            className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
              errors.email ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
            }`}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className="text-xs font-semibold text-danger">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="phone" className="text-xs font-bold text-text-dark uppercase tracking-wider">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g. +1 (555) 019-2834"
          className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all"
        />
      </div>

      {/* Grid: Status, Source & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="status" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark focus:outline-none focus:border-primary focus:bg-card transition-all cursor-pointer"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="source" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Source
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark focus:outline-none focus:border-primary focus:bg-card transition-all cursor-pointer"
          >
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="priority" className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark focus:outline-none focus:border-primary focus:bg-card transition-all cursor-pointer"
          >
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Textarea */}
      <div className="flex flex-col space-y-1.5">
        <label htmlFor="notes" className="text-xs font-bold text-text-dark uppercase tracking-wider">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add background notes or discussion details..."
          className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all resize-none"
        />
      </div>

      {/* Dialog Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4.5 py-2 text-sm font-semibold text-text-gray hover:text-text-dark hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/95 shadow-md shadow-primary/10 rounded-xl transition-all cursor-pointer"
        >
          {initialData ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
