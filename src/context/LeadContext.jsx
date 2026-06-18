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
 *   estimatedValue: number,
 *   createdAt: string (ISO date),
 *   date: string (YYYY-MM-DD for backward compatibility)
 * }
 */

import useLocalStorage from '../hooks/useLocalStorage';
import { SAMPLE_LEADS } from '../data/sampleLeads';

export const LeadContext = createContext(undefined);

/**
 * Provider component that wraps the application and supplies lead state and actions.
 * @component
 */
export function LeadProvider({ children }) {
  // useLocalStorage automatically manages syncing state changes to localStorage under the given key
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', SAMPLE_LEADS);

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
