import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * Initial dummy list of leads to populate the system.
 */
const INITIAL_LEADS = [
  { id: 1, name: 'Alice Smith', company: 'TechNova', email: 'alice@technova.io', phone: '+1 555-0199', status: 'New', source: 'Website', date: '2026-06-15' },
  { id: 2, name: 'Bob Johnson', company: 'Apex Global', email: 'bob@apex.com', phone: '+1 555-0142', status: 'Contacted', source: 'LinkedIn', date: '2026-06-14' },
  { id: 3, name: 'Charlie Davis', company: 'Initech Solutions', email: 'charlie@initech.co', phone: '+1 555-0176', status: 'Meeting Scheduled', source: 'Referral', date: '2026-06-12' },
  { id: 4, name: 'Diana Prince', company: 'Wayne Enterprises', email: 'diana@wayne.com', phone: '+1 555-0188', status: 'Proposal Sent', source: 'Email Campaign', date: '2026-06-10' },
  { id: 5, name: 'Ethan Hunt', company: 'Impossible Labs', email: 'ethan@impossible.org', phone: '+1 555-0131', status: 'Lost', source: 'Cold Call', date: '2026-06-08' },
  { id: 6, name: 'Fiona Gallagher', company: 'Patsy\'s Pies', email: 'fiona@patsys.com', phone: '+1 555-0212', status: 'Won', source: 'Other', date: '2026-06-16' }
];

/**
 * Lead Management page of Startup CRM Lite.
 * Coordinates lead storage state, filter criteria, and create/edit modal dialog lifecycles.
 *
 * @component
 * @returns {React.ReactElement} The rendered Leads page
 */
export default function Leads() {
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? { ...lead, ...formData }
            : lead
        )
      );
      toast.success(`${formData.name} updated successfully!`);
    } else {
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0]
      };
      setLeads((prev) => [newLead, ...prev]);
      toast.success(`${formData.name} added to pipeline!`);
    }
    closeModal();
  };

  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${leadToDelete.name}?`)) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      toast.error(`${leadToDelete.name} has been removed.`, {
        icon: '🗑️'
      });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  const filteredLeads = leads
    .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="p-6 md:p-8 space-y-6 bg-background min-h-full">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-roboto text-text-dark tracking-tight">Lead Management</h1>
          <p className="text-text-gray text-sm">Organize, track, and convert prospective startup clients efficiently.</p>
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center justify-center space-x-2 px-4.5 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Lead</span>
        </button>
      </div>

      <div className="space-y-4 p-4 bg-card border border-slate-200/60 rounded-2xl shadow-sm">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {filteredLeads.length === 0 ? (
        <EmptyState
          hasLeads={leads.length > 0}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <LeadTable
          leads={filteredLeads}
          onEdit={handleEditClick}
          onDelete={handleDeleteLead}
        />
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-250 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up">
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-dark font-roboto">
                {selectedLead ? 'Edit Lead Profile' : 'Add New Lead'}
              </h2>
              <button
                onClick={closeModal}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-slate-400 hover:text-text-dark hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <LeadForm
                initialData={selectedLead}
                onSubmit={handleFormSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
