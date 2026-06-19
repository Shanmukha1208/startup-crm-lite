import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function LineChartCard({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6 shrink-0">
        <TrendingUp className="w-5 h-5 text-success" />
        <h2 className="text-lg font-bold text-text-dark">Conversion Rate Trend</h2>
      </div>

      <div className="flex-1 min-h-[260px] w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-sm text-text-gray italic text-center">
            No pipeline data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tickLine={false} 
                axisLine={false} 
                stroke="var(--color-text-gray)" 
                style={{ fontSize: '12px' }} 
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Conversion Rate']}
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
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#22C55E" 
                strokeWidth={3}
                dot={{ fill: '#22C55E', stroke: 'var(--color-card)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
