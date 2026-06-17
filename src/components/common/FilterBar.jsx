import React from 'react';

const FILTERS = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * Row of status filter buttons with lead counts per filter.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - Currently selected filter
 * @param {function} props.onFilterChange - Called with the selected filter name
 * @param {Array<Object>} props.leads - Full leads array used to compute counts
 */
export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  const getCount = (filter) => {
    if (filter === 'All') return leads.length;
    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter;
        const count = getCount(filter);

        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                : 'bg-slate-50 text-text-gray border-slate-200 hover:bg-slate-100 hover:text-text-dark hover:border-slate-300'
            }`}
          >
            {filter} ({count})
          </button>
        );
      })}
    </div>
  );
}
