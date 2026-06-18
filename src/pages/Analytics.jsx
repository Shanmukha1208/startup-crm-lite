// Import React for JSX and component creation
import React, { useMemo } from 'react';
// Import utility icons from lucide-react to represent trends
import { Users, Award, Clock, Calendar } from 'lucide-react';
// Import Context hook
import { useLeads } from '../context/LeadContext';
// Import utility functions
import { 
  getStatusDistribution, 
  getMonthlyLeads, 
  getConversionByMonth,
  getFunnelData,
  getActivityHeatmap,
  getRevenuePercentages
} from '../utils/analyticsHelpers';
// Import chart components
import PieChartCard from '../components/analytics/PieChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import ActivityHeatmapCard from '../components/analytics/ActivityHeatmapCard';
import RevenueStatsRow from '../components/analytics/RevenueStatsRow';
import RevenueChartCard from '../components/analytics/RevenueChartCard';

// Define the Analytics page component
export default function Analytics() {
  const { leads } = useLeads();

  // Compute dynamic stats
  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status === 'Won').length;
  const wonRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
  
  // Transform data for charts
  const statusData = useMemo(() => getStatusDistribution(leads), [leads]);
  const monthlyLeadsData = useMemo(() => getMonthlyLeads(leads), [leads]);
  const conversionData = useMemo(() => getConversionByMonth(leads), [leads]);
  const funnelData = useMemo(() => getFunnelData(leads), [leads]);
  const heatmapData = useMemo(() => getActivityHeatmap(leads), [leads]);
  const revenueStats = useMemo(() => getRevenuePercentages(leads), [leads]);

  // Render the page's JSX layout
  return (
    // Outer content wrapper with margin/padding consistent with other pages
    <div className="p-6 md:p-8 space-y-6">
      
      {/* Title section of the Analytics page */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold font-roboto text-text-dark">Analytics Reports</h1>
        <p className="text-text-gray text-sm">Visualize customer acquisition trends, conversion rates, and growth metrics.</p>
      </div>

      {/* Highlight metrics cards using our dynamic Revenue component */}
      <RevenueStatsRow stats={revenueStats} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Row 1 */}
        <PieChartCard data={statusData} />
        <FunnelChartCard data={funnelData} />

        {/* Row 2 */}
        <BarChartCard data={monthlyLeadsData} />
        <ActivityHeatmapCard data={heatmapData} />
        
        {/* Row 3: Revenue Chart Card spans full width */}
        <RevenueChartCard leads={leads} />
        
        {/* Row 4: Line Chart Card (spans full width on bottom) */}
        <div className="lg:col-span-2">
          <LineChartCard data={conversionData} />
        </div>
      </div>

    </div>
  );
}
