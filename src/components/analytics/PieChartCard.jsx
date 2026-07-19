import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const STATUS_COLORS = {
  'New': '#9784B0',
  'Contacted': '#6B46C1',
  'Meeting Scheduled': '#9272D4',
  'Proposal Sent': '#FF8AAE',
  'Won': '#22C55E',
  'Lost': '#EF4444',
};

const DEFAULT_COLOR = '#DDD3ED';

/**
 * Renders a custom legend that includes counts and percentages.
 */
const renderCustomLegend = (props) => {
  const { payload } = props;
  const total = payload.reduce((sum, entry) => sum + entry.payload.value, 0);

  return (
    <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs text-text-gray">
      {payload.map((entry, index) => {
        const percent = total > 0 ? Math.round((entry.payload.value / total) * 100) : 0;
        return (
          <li key={`item-${index}`} className="flex items-center space-x-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="font-medium">{entry.value}</span>
            <span className="font-bold text-text-dark ml-1">{entry.payload.value}</span>
            <span className="text-[10px] opacity-70">({percent}%)</span>
          </li>
        );
      })}
    </ul>
  );
};

export default function PieChartCard({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6 shrink-0">
        <PieChartIcon className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-text-dark">Pipeline Distribution</h2>
      </div>

      <div className="flex-1 min-h-[260px] w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-sm text-text-gray italic text-center">
            No pipeline data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                nameKey="name"
                animationDuration={800}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || DEFAULT_COLOR}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} Leads`, 'Count']}
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-slate-200)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
                itemStyle={{ color: 'var(--color-text-dark)' }}
              />
              <Legend content={renderCustomLegend} verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
