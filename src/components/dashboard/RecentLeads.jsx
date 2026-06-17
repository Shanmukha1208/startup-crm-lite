import React from 'react';
import { Mail, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Returns Tailwind badge classes for a given lead status.
 * Ensures matching color schemas are applied to keep alignment with the system design.
 * 
 * @param {string} status - Lead status string.
 * @returns {string} Tailwind CSS class classes.
 */
const getStatusBadgeStyle = (status) => {
  switch (status) {
    case 'New':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'Contacted':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'Qualified':
      return 'bg-success/10 text-success border-success/20';
    case 'Proposal Sent':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Won':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Lost':
      return 'bg-slate-100 text-slate-500 border-slate-200';
    default:
      return 'bg-slate-100 text-slate-500 border-slate-200';
  }
};

/**
 * RecentLeads component displays the last 5 added leads in a clean, responsive table.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.leads - Master array of all leads
 * @returns {React.ReactElement} The rendered RecentLeads component
 */
export default function RecentLeads({ leads = [] }) {
  // Sort leads by date descending (latest first) and slice the top 5
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-text-dark font-roboto">Recent Leads</h2>
          <p className="text-xs text-text-gray">Lately added prospective clients.</p>
        </div>
        <Link 
          to="/leads" 
          className="inline-flex items-center space-x-1.5 text-xs text-primary hover:text-primary/90 transition-colors font-bold cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle px-6">
          <div className="overflow-hidden border border-slate-100 rounded-xl">
            <table className="min-w-full divide-y divide-slate-100 text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-xs font-semibold text-text-gray uppercase tracking-wider">
                  <th className="px-5 py-3">Lead Name</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-text-dark font-medium bg-white">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-text-gray/70 italic text-xs">
                      No recent leads to display. Click "Add New Lead" to begin.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-slate-50/50 transition-colors duration-150"
                    >
                      {/* Name Column */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800">{lead.name}</span>
                          {/* Quick contact subtext */}
                          {lead.email && (
                            <span className="text-[10px] text-text-gray font-normal flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5" />
                              {lead.email}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Company Column */}
                      <td className="px-5 py-3.5 text-text-gray font-normal">
                        {lead.company || 'N/A'}
                      </td>

                      {/* Status Column */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getStatusBadgeStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="px-5 py-3.5 text-right text-text-gray font-normal text-xs">
                        {lead.date ? new Date(lead.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
