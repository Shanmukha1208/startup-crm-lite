import React from 'react';

/**
 * Configuration mapping lead statuses to color styles.
 * Provides CSS color classes for the segmented progress bar and legend badges.
 */
const STATUS_CONFIGS = {
  'New': { label: 'New', colorClass: 'bg-primary', textClass: 'text-primary border-primary/20 bg-primary/5' },
  'Contacted': { label: 'Contacted', colorClass: 'bg-warning', textClass: 'text-warning border-warning/20 bg-warning/5' },
  'Qualified': { label: 'Qualified', colorClass: 'bg-success', textClass: 'text-success border-success/20 bg-success/5' },
  'Proposal Sent': { label: 'Proposal Sent', colorClass: 'bg-purple-500', textClass: 'text-purple-600 border-purple-200 bg-purple-50' },
  'Won': { label: 'Won', colorClass: 'bg-emerald-500', textClass: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  'Lost': { label: 'Lost', colorClass: 'bg-slate-400', textClass: 'text-slate-500 border-slate-200 bg-slate-50' }
};

/**
 * PipelineOverview component renders a horizontal segmented bar displaying lead stage distribution.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.leads - Array of lead data objects containing status fields
 * @returns {React.ReactElement} The rendered PipelineOverview component
 */
export default function PipelineOverview({ leads = [] }) {
  const totalLeads = leads.length;

  // Aggregate leads by status
  const countsByStatus = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Calculate percentages and prepare segment data
  const segments = Object.keys(countsByStatus).map((status) => {
    const count = countsByStatus[status];
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    const config = STATUS_CONFIGS[status] || {
      label: status,
      colorClass: 'bg-slate-300',
      textClass: 'text-slate-500 border-slate-200 bg-slate-50'
    };

    return {
      status,
      count,
      percentage,
      ...config
    };
  });

  // Sort segments by status sequence order: New, Contacted, Qualified, Proposal Sent, Won, Lost
  const order = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
  segments.sort((a, b) => {
    const aIndex = order.indexOf(a.status);
    const bIndex = order.indexOf(b.status);
    return (aIndex !== -1 ? aIndex : 99) - (bIndex !== -1 ? bIndex : 99);
  });

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-dark font-roboto">Lead Pipeline</h2>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-text-gray rounded-full border border-slate-200">
          {totalLeads} Total Leads
        </span>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="relative">
        <div className="flex h-5 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
          {totalLeads === 0 ? (
            <div className="w-full flex items-center justify-center text-xs text-text-gray/60 italic">
              No lead records found
            </div>
          ) : (
            segments.map((segment) => {
              if (segment.percentage === 0) return null;
              return (
                <div
                  key={segment.status}
                  style={{ width: `${segment.percentage}%` }}
                  className={`h-full transition-all duration-500 hover:opacity-90 relative group/seg ${segment.colorClass}`}
                >
                  {/* Micro-hover effect showing tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/seg:block z-20">
                    <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                      {segment.label}: {segment.count} ({segment.percentage.toFixed(1)}%)
                    </div>
                    {/* Tooltip arrow */}
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1"></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Grid Legend showing metrics per stage */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {order.map((status) => {
          const segment = segments.find((s) => s.status === status) || {
            status,
            count: 0,
            percentage: 0,
            ...(STATUS_CONFIGS[status] || {
              label: status,
              colorClass: 'bg-slate-300',
              textClass: 'text-slate-400 border-slate-100 bg-slate-50'
            })
          };

          return (
            <div
              key={status}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all duration-200 hover:shadow-sm ${segment.textClass}`}
            >
              <span className="text-xs font-bold truncate">
                {segment.label}
              </span>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-lg font-extrabold font-roboto">
                  {segment.count}
                </span>
                <span className="text-[10px] font-medium opacity-80">
                  {segment.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
