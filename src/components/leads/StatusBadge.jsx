import React from 'react';

/**
 * StatusBadge component displays a pill-shaped colored badge corresponding to a lead's workflow status.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.status - The lead status (e.g. 'New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost')
 * @returns {React.ReactElement} The rendered StatusBadge component
 */
export default function StatusBadge({ status }) {
  // Normalize status to clean string or default to 'New'
  const normalizedStatus = status ? String(status).trim() : 'New';

  // CSS mappings for each status stage
  let badgeClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (normalizedStatus) {
    case 'New':
      badgeClasses = 'bg-slate-100 text-slate-600 border-slate-200';
      break;
    case 'Contacted':
      badgeClasses = 'bg-warning/10 text-warning border-warning/20';
      break;
    case 'Meeting Scheduled':
      badgeClasses = 'bg-blue-100 text-blue-700 border-blue-200';
      break;
    case 'Proposal Sent':
      badgeClasses = 'bg-purple-100 text-purple-700 border-purple-200';
      break;
    case 'Won':
      badgeClasses = 'bg-success/10 text-success border-success/20';
      break;
    case 'Lost':
      badgeClasses = 'bg-danger/10 text-danger border-danger/20';
      break;
    default:
      badgeClasses = 'bg-slate-100 text-slate-500 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full border ${badgeClasses}`}>
      {normalizedStatus}
    </span>
  );
}
