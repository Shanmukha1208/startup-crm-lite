import React from 'react';
import { SearchX, Users } from 'lucide-react';

/**
 * Empty state shown when no leads match the current search or filter criteria.
 *
 * @param {Object} props
 * @param {boolean} props.hasLeads - True when leads exist but none match filters
 * @param {function} props.onClearFilters - Resets search and filter selection
 */
export default function EmptyState({ hasLeads, onClearFilters }) {
  if (!hasLeads) {
    return (
      <div className="p-12 text-center bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-3 animate-fade-in">
        <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
          <Users className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-text-dark">No leads yet</p>
          <p className="text-xs text-text-gray max-w-xs">
            Your pipeline is empty. Click &ldquo;Add New Lead&rdquo; to create your first contact.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12 text-center bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-3 animate-fade-in">
      <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
        <SearchX className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-dark">No leads found</p>
        <p className="text-xs text-text-gray max-w-xs">
          No leads match your current search or filter. Try adjusting your criteria.
        </p>
      </div>
      <button
        type="button"
        onClick={onClearFilters}
        className="mt-1 px-4 py-2 text-xs font-semibold text-primary bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors duration-200 cursor-pointer"
      >
        Clear search and filters
      </button>
    </div>
  );
}
