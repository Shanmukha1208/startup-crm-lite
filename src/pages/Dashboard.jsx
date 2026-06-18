import React from 'react';
import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Import our custom sub-components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

import { useLeads } from '../context/LeadContext';

/**
 * Dashboard page component of Startup CRM Lite.
 * Integrates statistics cards, quick interaction actions, pipeline visualizations,
 * and a recent lead monitoring panel inside a fully responsive grid.
 * 
 * @component
 * @returns {React.ReactElement} The rendered Dashboard page
 */
export default function Dashboard() {
  const { leads } = useLeads();
  
  /**
   * Action handler triggered when clicking 'Add New Lead' from QuickActions.
   * Prompts the user with a notification about future feature integrations.
   */
  const handleAddLead = () => {
    toast('Lead creation dialog will be wired in Phase 8!', {
      icon: '💡',
      style: {
        borderRadius: '12px',
        background: '#0F172A',
        color: '#FFF',
      },
    });
  };

  /**
   * Action handler triggered when clicking 'Export Data'.
   * Generates a CSV file dynamically from the sample leads dataset and initiates a download.
   */
  const handleExportData = () => {
    const toastId = toast.loading('Preparing leads export...');
    
    try {
      // Create CSV content headers and rows
      const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Status', 'Date Added'];
      const rows = leads.map(lead => [
        lead.id,
        `"${lead.name.replace(/"/g, '""')}"`,
        `"${lead.company.replace(/"/g, '""')}"`,
        lead.email,
        lead.phone,
        lead.status,
        lead.date
      ]);
      
      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Auto trigger browser download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `crm_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Leads exported successfully!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Failed to export leads data.', { id: toastId });
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-full">
      {/* Toast notifications container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Page header and introductory status */}
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold font-roboto text-text-dark tracking-tight">Dashboard</h1>
        <p className="text-text-gray text-sm">Welcome back! Here is a summary of your startup's CRM performance.</p>
      </div>

      {/* Responsive Grid for Stats Cards */}
      {/* Responsive breakpoints: 1 col on mobile (default), 2 cols on tablet (sm:), 4 cols on desktop (lg:) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Leads" 
          value={leads.length.toString()} 
          icon={Users} 
          change="+12%" 
          color="primary" 
        />
        <StatsCard 
          title="New Leads (Today)" 
          value={leads.filter(l => l.status === 'New').length.toString()} 
          icon={UserPlus} 
          change="+5%" 
          color="success" 
        />
        <StatsCard 
          title="Expected Revenue" 
          value="$45,200" 
          icon={DollarSign} 
          change="+18%" 
          color="warning" 
        />
        <StatsCard 
          title="Conversion Rate" 
          value="24.3%" 
          icon={TrendingUp} 
          change="+2.1%" 
          color="danger" 
        />
      </div>

      {/* Quick Actions Shortcuts */}
      <QuickActions 
        onAddLead={handleAddLead} 
        onExportData={handleExportData} 
      />

      {/* Core Insights grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left main block: Recent Leads table (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <RecentLeads leads={leads} />
        </div>
        
        {/* Right sidebar block: Pipeline status overview (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <PipelineOverview leads={leads} />
        </div>

      </div>
    </div>
  );
}
