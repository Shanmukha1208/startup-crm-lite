import React from 'react';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';
import { Filter } from 'lucide-react';

export default function FunnelChartCard({ data }) {
  // We only show data if there is at least one lead in the top of the funnel
  const hasData = data && data.length > 0 && data[0].value > 0;

  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-6 shrink-0">
        <Filter className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-bold text-text-dark">Pipeline Funnel</h2>
      </div>

      <div className="flex-1 min-h-[300px] w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-sm text-text-gray italic text-center">
            No pipeline data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <Tooltip 
                formatter={(value) => [`${value} Leads`, 'Volume']}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Funnel
                dataKey="value"
                data={data}
                isAnimationActive={true}
              >
                {/* Stage Name outside the funnel */}
                <LabelList 
                  position="right" 
                  fill="#64748B" 
                  stroke="none" 
                  dataKey="name" 
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                {/* Count inside the funnel */}
                <LabelList 
                  position="center" 
                  fill="#FFFFFF" 
                  stroke="none" 
                  dataKey="value" 
                  style={{ fontSize: '14px', fontWeight: 'bold' }}
                />
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
