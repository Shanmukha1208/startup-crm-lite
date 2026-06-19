import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import LeadTable from '../components/leads/LeadTable';
import LeadForm from '../components/leads/LeadForm';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';



import { useLeads } from '../context/LeadContext';

/**
 * Lead Management page of Startup CRM Lite.
 * Coordinates lead storage state, filter criteria, and create/edit modal dialog lifecycles.
 *
 * @component
 * @returns {React.ReactElement} The rendered Leads page
 */
export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);


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
      updateLead(selectedLead.id, formData);
      toast.success(`${formData.name} updated successfully!`);
    } else {
      addLead(formData);
      toast.success(`${formData.name} added to pipeline!`);
    }
    closeModal();
  };

  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to delete ${leadToDelete.name}?`)) {
      deleteLead(id);
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
          <div className="bg-card border border-slate-250 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up">
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
