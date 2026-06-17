import React from 'react';
import { Mail, Phone, Edit, Trash2, Building, Calendar, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * LeadCard component displays details of a single lead in a visually structured card layout.
 * Includes quick email, phone contact details, source information, and edit/delete triggers.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.lead - Lead data structure containing name, company, email, status, phone, source, etc.
 * @param {function} props.onEdit - Callback invoked with the lead object when edit pencil button is clicked
 * @param {function} props.onDelete - Callback invoked with the lead's ID when trash button is clicked
 * @returns {React.ReactElement} The rendered LeadCard component
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
  const { id, name, company, email, phone, status, source, date } = lead;

  return (
    <div className="bg-card border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4 group">
      {/* Top Section: Name, Company, Badge and Action Buttons */}
      <div className="space-y-2.5">
        <div className="flex justify-between items-start gap-2">
          {/* Lead Identity */}
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-text-dark font-roboto leading-tight group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center space-x-1 text-xs text-text-gray">
              <Building className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{company}</span>
            </div>
          </div>

          {/* Action Button Controls */}
          <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(lead)}
              aria-label={`Edit ${name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5 active:scale-95 transition-all cursor-pointer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              aria-label={`Delete ${name}`}
              className="p-1.5 rounded-lg text-slate-400 hover:text-danger hover:bg-danger/5 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="pt-0.5">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Middle Section: Communication details */}
      <div className="space-y-1.5 text-xs text-text-gray border-t border-slate-100 pt-3">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center space-x-2 hover:text-primary transition-colors py-0.5"
          >
            <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{email}</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center space-x-2 hover:text-primary transition-colors py-0.5"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{phone}</span>
          </a>
        )}
      </div>

      {/* Bottom Section: Meta details (Source and Date) */}
      <div className="flex items-center justify-between text-[10px] text-text-gray/80 pt-2 border-t border-slate-100/60 font-medium">
        {source && (
          <span className="flex items-center space-x-1 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Source: {source}</span>
          </span>
        )}
        {date && (
          <span className="flex items-center space-x-1 ml-auto">
            <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              {new Date(date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
