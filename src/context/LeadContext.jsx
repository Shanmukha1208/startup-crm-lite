import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Lead object shape:
 * {
 *   id: string,
 *   name: string,
 *   company: string,
 *   email: string,
 *   phone: string,
 *   status: 'New' | 'Contacted' | 'Meeting Scheduled' | 'Proposal Sent' | 'Won' | 'Lost',
 *   source: 'Website' | 'Referral' | 'LinkedIn' | 'Cold Call' | 'Email Campaign' | 'Other',
 *   createdAt: string (ISO date),
 *   date: string (YYYY-MM-DD for backward compatibility)
 * }
 */

// Sample initial leads if no local storage data is found
const INITIAL_LEADS = [
  { id: crypto.randomUUID(), name: 'Alice Smith', company: 'TechNova', email: 'alice@technova.io', phone: '+1 555-0199', status: 'New', source: 'Website', createdAt: '2026-06-15T10:00:00Z', date: '2026-06-15' },
  { id: crypto.randomUUID(), name: 'Bob Johnson', company: 'Apex Global', email: 'bob@apex.com', phone: '+1 555-0142', status: 'Contacted', source: 'LinkedIn', createdAt: '2026-06-14T10:00:00Z', date: '2026-06-14' },
  { id: crypto.randomUUID(), name: 'Charlie Davis', company: 'Initech Solutions', email: 'charlie@initech.co', phone: '+1 555-0176', status: 'Meeting Scheduled', source: 'Referral', createdAt: '2026-06-12T10:00:00Z', date: '2026-06-12' },
  { id: crypto.randomUUID(), name: 'Diana Prince', company: 'Wayne Enterprises', email: 'diana@wayne.com', phone: '+1 555-0188', status: 'Proposal Sent', source: 'Email Campaign', createdAt: '2026-06-10T10:00:00Z', date: '2026-06-10' },
  { id: crypto.randomUUID(), name: 'Ethan Hunt', company: 'Impossible Labs', email: 'ethan@impossible.org', phone: '+1 555-0131', status: 'Lost', source: 'Cold Call', createdAt: '2026-06-08T10:00:00Z', date: '2026-06-08' },
  { id: crypto.randomUUID(), name: 'Fiona Gallagher', company: 'Patsy\'s Pies', email: 'fiona@patsys.com', phone: '+1 555-0212', status: 'Won', source: 'Other', createdAt: '2026-06-16T10:00:00Z', date: '2026-06-16' }
];

export const LeadContext = createContext(undefined);

/**
 * Provider component that wraps the application and supplies lead state and actions.
 * @component
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  /**
   * Adds a new lead to the state and local storage.
   * Auto-generates id, createdAt, and date fields.
   * @param {Object} formData The lead data from the input form
   */
  const addLead = (formData) => {
    const timestamp = new Date();
    const newLead = {
      ...formData,
      id: crypto.randomUUID(),
      createdAt: timestamp.toISOString(),
      date: timestamp.toISOString().split('T')[0] // Backward compatibility for existing components
    };
    setLeads((prev) => [newLead, ...prev]);
  };

  /**
   * Updates an existing lead's information.
   * @param {string} id The unique identifier of the lead to update
   * @param {Object} updatedData The updated fields
   */
  const updateLead = (id, updatedData) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updatedData } : lead))
    );
  };

  /**
   * Deletes a lead from the system.
   * @param {string} id The unique identifier of the lead to delete
   */
  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  /**
   * Retrieves a specific lead by its unique ID.
   * @param {string} id The unique identifier of the lead
   * @returns {Object|undefined} The matched lead object or undefined if not found
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id);
  };

  return (
    <LeadContext.Provider value={{ leads, addLead, updateLead, deleteLead, getLeadById }}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume the LeadContext.
 * @returns {Object} Context payload containing leads state and action functions
 * @throws {Error} If called outside of a LeadProvider
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
