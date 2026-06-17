import React from 'react';
import { Users, UserPlus, DollarSign, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Import our custom sub-components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * Sample leads data for the dashboard presentation.
 * In a production release (Phase 8), this data will be retrieved from the central state or API.
 */
const SAMPLE_LEADS = [
  { id: 1, name: 'Alice Smith', company: 'TechNova', email: 'alice@technova.io', phone: '+1 555-0199', status: 'New', date: '2026-06-15' },
  { id: 2, name: 'Bob Johnson', company: 'Apex Global', email: 'bob@apex.com', phone: '+1 555-0142', status: 'Contacted', date: '2026-06-14' },
  { id: 3, name: 'Charlie Davis', company: 'Initech Solutions', email: 'charlie@initech.co', phone: '+1 555-0176', status: 'Qualified', date: '2026-06-12' },
  { id: 4, name: 'Diana Prince', company: 'Wayne Enterprises', email: 'diana@wayne.com', phone: '+1 555-0188', status: 'Proposal Sent', date: '2026-06-10' },
  { id: 5, name: 'Ethan Hunt', company: 'Impossible Labs', email: 'ethan@impossible.org', phone: '+1 555-0131', status: 'Lost', date: '2026-06-08' },
  { id: 6, name: 'Fiona Gallagher', company: 'Patsy\'s Pies', email: 'fiona@patsys.com', phone: '+1 555-0212', status: 'Won', date: '2026-06-16' },
  { id: 7, name: 'George Cooper', company: 'Medford High', email: 'george@medford.edu', phone: '+1 555-0223', status: 'Contacted', date: '2026-06-13' },
  { id: 8, name: 'Hannah Abbott', company: 'Leaky Cauldron', email: 'hannah@leakycauldron.co.uk', phone: '+1 555-0234', status: 'Qualified', date: '2026-06-11' },
  { id: 9, name: 'Ian Malcolm', company: 'Jurassic Park', email: 'ian@chaos.org', phone: '+1 555-0245', status: 'New', date: '2026-06-16' },
  { id: 10, name: 'Julia Roberts', company: 'Pretty Woman Inc', email: 'julia@prettywoman.com', phone: '+1 555-0256', status: 'Proposal Sent', date: '2026-06-09' }
];

/**
 * Dashboard page component of Startup CRM Lite.
 * Integrates statistics cards, quick interaction actions, pipeline visualizations,
 * and a recent lead monitoring panel inside a fully responsive grid.
 * 
 * @component
 * @returns {React.ReactElement} The rendered Dashboard page
 */
export default function Dashboard() {
  
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
      const rows = SAMPLE_LEADS.map(lead => [
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
          value="1,248" 
          icon={Users} 
          change="+12%" 
          color="primary" 
        />
        <StatsCard 
          title="New Leads (Today)" 
          value="36" 
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
          <RecentLeads leads={SAMPLE_LEADS} />
        </div>
        
        {/* Right sidebar block: Pipeline status overview (1/3 width on desktop) */}
        <div className="lg:col-span-1">
          <PipelineOverview leads={SAMPLE_LEADS} />
        </div>

      </div>
    </div>
  );
}
