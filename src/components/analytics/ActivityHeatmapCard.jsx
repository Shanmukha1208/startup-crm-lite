import React from 'react';
import { Activity } from 'lucide-react';

export default function ActivityHeatmapCard({ data }) {
  // Determine color intensity based on lead volume
  const getIntensityClass = (count) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (count === 1) return 'bg-success/40';
    if (count === 2) return 'bg-success/70';
    return 'bg-success'; // 3 or more leads
  };

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-success" />
          <h2 className="text-lg font-bold text-text-dark">Lead Creation Activity</h2>
        </div>
        <span className="text-xs font-semibold text-text-gray uppercase tracking-wider">
          Last 35 Days
        </span>
      </div>

      <div className="flex-1 w-full relative flex flex-col items-center justify-center overflow-x-auto min-h-[160px]">
        {/* We use CSS Grid with flow-col and rows-7 to lay out days vertically per week, exactly like GitHub */}
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 p-2">
          {data.map((day, i) => (
            <div 
              key={i} 
              title={`${day.count} leads created on ${day.date}`}
              className={`w-5 h-5 rounded-sm cursor-pointer hover:ring-2 hover:ring-primary/50 ${getIntensityClass(day.count)} transition-all`}
            />
          ))}
        </div>
        
        {/* Heatmap Legend */}
        <div className="flex items-center justify-end space-x-2 mt-6 w-full max-w-[250px] text-xs text-text-gray">
          <span>Less</span>
          <div className="flex space-x-1.5">
            <div className="w-4 h-4 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <div className="w-4 h-4 rounded-sm bg-success/40" />
            <div className="w-4 h-4 rounded-sm bg-success/70" />
            <div className="w-4 h-4 rounded-sm bg-success" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
