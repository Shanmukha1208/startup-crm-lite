import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';
import { getRevenueChartData } from '../../utils/analyticsHelpers';

const formatCurrency = (value) => {
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`; // Format as Lakhs for easier reading
  }
  return `₹${(value / 1000).toFixed(1)}k`; // Format as thousands
};

export default function RevenueChartCard({ leads }) {
  // State to track the selected time range filter
  const [months, setMonths] = useState(6);
  
  // Recompute the chart data whenever leads or the selected month range changes
  const chartData = useMemo(() => getRevenueChartData(leads, months), [leads, months]);
  const hasData = chartData.some(d => d.revenue > 0);

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full col-span-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 shrink-0">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-success" />
          <h2 className="text-lg font-bold text-text-dark">Revenue Generation</h2>
        </div>
        
        {/* Time Range Filter buttons */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          {[3, 6, 12].map(num => (
            <button
              key={num}
              onClick={() => setMonths(num)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                months === num 
                ? 'bg-white dark:bg-slate-700 text-text-dark shadow-sm' 
                : 'text-text-gray hover:text-text-dark'
              }`}
            >
              {num === 12 ? '1 Year' : `${num} Months`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-sm text-text-gray italic text-center">
            No closed revenue in this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-200)" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="var(--color-text-gray)" style={{ fontSize: '12px' }} />
              <YAxis 
                tickFormatter={formatCurrency}
                tickLine={false} 
                axisLine={false} 
                stroke="var(--color-text-gray)" 
                style={{ fontSize: '12px' }} 
              />
              <Tooltip
                formatter={(value) => [new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value), 'Revenue']}
                labelStyle={{ fontWeight: 'bold', color: 'var(--color-text-gray)' }}
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  borderColor: 'var(--color-slate-200)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22C55E" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
