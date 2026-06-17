// Import React for JSX and component creation
import React from 'react';
// Import Recharts components for beautiful data visualization
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// Import utility icons from lucide-react to represent trends
import { TrendingUp, Award, Calendar, BarChart2 } from 'lucide-react';

// Define the mock chart data representing monthly lead generation
const monthlyData = [
  { month: 'Jan', newLeads: 45, conversions: 12 },
  { month: 'Feb', newLeads: 52, conversions: 18 },
  { month: 'Mar', newLeads: 68, conversions: 24 },
  { month: 'Apr', newLeads: 85, conversions: 35 },
  { month: 'May', newLeads: 110, conversions: 48 },
  { month: 'Jun', newLeads: 145, conversions: 72 }
];

// Define the Analytics page component
export default function Analytics() {
  // Render the page's JSX layout
  return (
    // Outer content wrapper with margin/padding consistent with other pages
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Title section of the Analytics page */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold font-roboto text-text-dark">Analytics Reports</h1>
        <p className="text-text-gray text-sm">Visualize customer acquisition trends, conversion rates, and growth metrics.</p>
      </div>

      {/* Grid of highlight metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Monthly Growth */}
        <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-gray uppercase">Monthly Growth</p>
            <p className="text-xl font-bold text-text-dark">+32.5% YoY</p>
          </div>
        </div>

        {/* Metric 2: Average Conversion Rate */}
        <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-success/10 text-success rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-gray uppercase">Avg Conversion Rate</p>
            <p className="text-xl font-bold text-text-dark">18.4% Average</p>
          </div>
        </div>

        {/* Metric 3: Time Range indicator */}
        <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-warning/10 text-warning rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-gray uppercase">Selected Period</p>
            <p className="text-xl font-bold text-text-dark">Last 6 Months</p>
          </div>
        </div>

      </div>

      {/* Chart visualization card */}
      <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-dark">Acquisition vs. Conversion Performance</h2>
        </div>

        {/* Chart Container wrapper with absolute sizing */}
        <div className="h-80 w-full">
          {/* Responsive container from recharts to dynamically size content */}
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart 
              data={monthlyData} 
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* Add styling definitions for background linear gradients inside chart */}
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              {/* Chart grid background elements */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              {/* X Axis element matching Month property from data */}
              <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#64748B" style={{ fontSize: '12px' }} />
              {/* Y Axis element displaying lead volume numeric count */}
              <YAxis tickLine={false} axisLine={false} stroke="#64748B" style={{ fontSize: '12px' }} />
              {/* Tooltip hovering utility overlay */}
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF', 
                  borderColor: '#E2E8F0', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                }} 
              />
              {/* Plotted Area representing New Leads */}
              <Area 
                type="monotone" 
                dataKey="newLeads" 
                stroke="#2563EB" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
                name="New Leads"
              />
              {/* Plotted Area representing Conversions */}
              <Area 
                type="monotone" 
                dataKey="conversions" 
                stroke="#22C55E" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorConversions)" 
                name="Conversions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
