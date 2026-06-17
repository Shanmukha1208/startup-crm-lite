import React, { useState } from 'react';
import { LayoutGrid, Table, Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';
import LeadCard from './LeadCard';

/**
 * LeadTable component handles rendering the list of leads.
 * It provides an interactive header to toggle between Table (list-based) and Card (grid-based) views.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Array<Object>} props.leads - Array of lead data objects
 * @param {function} props.onEdit - Callback invoked with lead details to trigger edit modal
 * @param {function} props.onDelete - Callback invoked with lead ID to delete record
 * @returns {React.ReactElement} The rendered LeadTable component
 */
export default function LeadTable({ leads = [], onEdit, onDelete }) {
  // Toggle layout mode: 'table' or 'cards'
  const [viewMode, setViewMode] = useState('table');

  return (
    <div className="space-y-4">
      {/* View Controller Header */}
      <div className="flex items-center justify-between p-4 bg-card border border-slate-200/60 rounded-2xl shadow-sm">
        <span className="text-xs font-semibold text-text-gray font-roboto">
          Showing <span className="font-bold text-text-dark">{leads.length}</span> lead{leads.length !== 1 && 's'}
        </span>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/30">
          <button
            onClick={() => setViewMode('table')}
            aria-label="Table view"
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-gray hover:text-text-dark'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode('cards')}
            aria-label="Card grid view"
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all duration-200 ${
              viewMode === 'cards'
                ? 'bg-white text-primary shadow-sm'
                : 'text-text-gray hover:text-text-dark'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Conditional Layout Rendering */}
      {leads.length === 0 ? (
        <div className="p-12 text-center bg-card border border-slate-200/60 rounded-2xl shadow-sm flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-full">
            <Table className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-text-dark">No Lead Records Available</p>
          <p className="text-xs text-text-gray max-w-xs">
            Start populating your pipeline by clicking "Add New Lead" to create your first contact.
          </p>
        </div>
      ) : viewMode === 'cards' ? (
        /* Card Grid view layout: Responsive 1 col on mobile, 2 on tablet, 3 on desktop */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        /* Desktop Table view layout */
        <div className="bg-card border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-semibold text-text-gray uppercase tracking-wider">
                  <th className="px-6 py-4">Lead Name</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Date Added</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-text-dark font-medium">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/50 transition-colors duration-150 group"
                  >
                    {/* Name */}
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {lead.name}
                    </td>

                    {/* Company */}
                    <td className="px-6 py-4 text-text-gray font-normal">
                      {lead.company}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center space-x-1.5 text-xs text-text-gray hover:text-primary transition-colors font-normal"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.email}</span>
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center space-x-1.5 text-xs text-text-gray hover:text-primary transition-colors font-normal"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs bg-slate-50 border border-slate-150 text-text-gray font-medium rounded-md">
                        {lead.source || 'Other'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-text-gray font-normal text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {lead.date ? new Date(lead.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(lead)}
                          aria-label={`Edit ${lead.name}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(lead.id)}
                          aria-label={`Delete ${lead.name}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/5 active:scale-95 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
