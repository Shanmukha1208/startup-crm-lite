import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * Helper to determine theme colors for the icon container.
 * Supports standard presets ('primary', 'success', 'warning', 'danger') or custom Tailwind CSS classes.
 * 
 * @param {string} color - The color scheme or CSS classes.
 * @returns {string} Tailwind CSS classes for icon styling.
 */
const getIconBgColor = (color) => {
  const presets = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    danger: 'text-danger bg-danger/10',
  };
  return presets[color] || color || 'text-slate-600 bg-slate-100';
};

/**
 * StatsCard component displays a single CRM dashboard metric.
 * It features an icon, a primary numeric value, a descriptive label,
 * and a styled indicators showing comparison against the previous period.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.title - The label/title of the metric (e.g. "Total Leads")
 * @param {string|number} props.value - The metric value (e.g. "1,248", "$45,200")
 * @param {React.ComponentType} props.icon - A Lucide React icon component to display
 * @param {string|number} [props.change] - The percentage change indicator (e.g., "+12%", "-5%")
 * @param {string} [props.color='primary'] - Color theme key ('primary'|'success'|'warning'|'danger') or custom Tailwind classes
 * @returns {React.ReactElement} The rendered StatsCard component
 */
export default function StatsCard({ title, value, icon: IconComponent, change, color = 'primary' }) {
  // Parse the change direction (positive, negative, or neutral)
  const changeStr = change ? String(change).trim() : '';
  const isNegative = changeStr.startsWith('-');
  const isPositive = changeStr.startsWith('+') || (!isNegative && parseFloat(changeStr) > 0);

  // Setup trend icons and text colors based on change value
  let TrendIcon = Minus;
  let trendColorClass = 'text-text-gray bg-slate-50 border-slate-200';
  
  if (isPositive) {
    TrendIcon = ArrowUpRight;
    trendColorClass = 'text-success bg-success/10 border-success/20';
  } else if (isNegative) {
    TrendIcon = ArrowDownRight;
    trendColorClass = 'text-danger bg-danger/10 border-danger/20';
  }

  // Get finalized classes for the main metric icon container
  const iconContainerClasses = getIconBgColor(color);

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group">
      <div className="space-y-3">
        {/* Title / Label */}
        <span className="text-xs font-semibold text-text-gray uppercase tracking-wider block">
          {title}
        </span>
        
        {/* Metric Value and Trend Badge */}
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold text-text-dark font-roboto leading-none">
            {value}
          </span>
          {change && (
            <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-bold rounded-full border ${trendColorClass}`}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{change}</span>
            </span>
          )}
        </div>
        
        {/* Extra context description */}
        {change && (
          <span className="text-[10px] text-text-gray/80 font-medium block">
            vs. last month
          </span>
        )}
      </div>

      {/* Styled icon container with dynamic colors */}
      <div className={`p-3.5 rounded-xl transition-all duration-300 group-hover:scale-110 shrink-0 ${iconContainerClasses}`}>
        {IconComponent && <IconComponent className="w-6 h-6" />}
      </div>
    </div>
  );
}
