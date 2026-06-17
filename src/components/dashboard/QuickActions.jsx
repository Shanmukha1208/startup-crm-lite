import React from 'react';
import { Plus, List, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * QuickActions component displays shortcuts to perform actions like adding leads,
 * viewing all leads list, or exporting leads data.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onAddLead - Handler invoked when 'Add New Lead' is clicked
 * @param {function} props.onExportData - Handler invoked when 'Export Data' is clicked
 * @returns {React.ReactElement} The rendered QuickActions component
 */
export default function QuickActions({ onAddLead, onExportData }) {
  return (
    <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-text-dark font-roboto">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Action: Add New Lead */}
        <button
          onClick={onAddLead}
          className="group flex items-center justify-center space-x-2 px-4 py-3 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 active:scale-98 transition-all duration-300 cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>Add New Lead</span>
        </button>

        {/* Action: View All Leads */}
        <Link
          to="/leads"
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 border border-slate-200 text-text-gray hover:text-text-dark hover:bg-slate-100 hover:border-slate-300 rounded-xl font-bold transition-all duration-300 cursor-pointer text-sm"
        >
          <List className="w-4 h-4" />
          <span>View All Leads</span>
        </Link>

        {/* Action: Export Data */}
        <button
          onClick={onExportData}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 border border-slate-200 text-text-gray hover:text-text-dark hover:bg-slate-100 hover:border-slate-300 rounded-xl font-bold transition-all duration-300 cursor-pointer text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
}
