import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function BarChartCard({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6 shrink-0">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-text-dark">Monthly Lead Generation</h2>
      </div>

      <div className="flex-1 min-h-[260px] w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-sm text-text-gray italic text-center">
            No pipeline data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-slate-200)" />
              <XAxis 
                dataKey="month" 
                tickLine={false} 
                axisLine={false} 
                stroke="var(--color-text-gray)" 
                style={{ fontSize: '12px' }} 
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                stroke="var(--color-text-gray)" 
                style={{ fontSize: '12px' }} 
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--color-slate-100)', opacity: 0.5 }}
                formatter={(value) => [`${value} Leads`, 'Volume']}
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
              <Bar 
                dataKey="count" 
                fill="#2563EB" 
                radius={[4, 4, 0, 0]} 
                animationDuration={1000}
                animationEasing="ease-in-out"
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
