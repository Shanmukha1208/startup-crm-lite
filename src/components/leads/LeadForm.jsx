import React, { useState, useEffect } from 'react';

// Options list definitions
const STATUS_OPTIONS = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const SOURCE_OPTIONS = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

/**
 * LeadForm component handles lead record creation and modification.
 * Features built-in required field validation (Name, Company, Email) and email formatting checks.
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
    email: '',
    phone: '',
    status: 'New',
    source: 'Website',
  });

  // Track field validation error messages
  const [errors, setErrors] = useState({});

  // Sync state if editing an existing lead
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        company: initialData.company || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        status: initialData.status || 'New',
        source: initialData.source || 'Website',
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
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          placeholder="e.g. John Doe"
          className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
            errors.name ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
          }`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" className="text-xs font-semibold text-danger">
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
          placeholder="e.g. ACME Corp"
          className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
            errors.company ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
          }`}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'company-error' : undefined}
        />
        {errors.company && (
          <span id="company-error" className="text-xs font-semibold text-danger">
            {errors.company}
          </span>
        )}
      </div>

      {/* Grid: Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            placeholder="e.g. john@company.com"
            className={`px-4 py-2.5 text-sm bg-slate-50 border rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all ${
              errors.email ? 'border-danger focus:border-danger ring-1 ring-danger/10' : 'border-slate-200'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="text-xs font-semibold text-danger">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Input */}
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
            placeholder="e.g. +1 555-0199"
            className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark placeholder-text-gray/70 focus:outline-none focus:border-primary focus:bg-card transition-all"
          />
        </div>
      </div>

      {/* Grid: Status & Source */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark focus:outline-none focus:border-primary focus:bg-card transition-all cursor-pointer"
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
            className="px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-text-dark focus:outline-none focus:border-primary focus:bg-card transition-all cursor-pointer"
          >
            {SOURCE_OPTIONS.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>
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
