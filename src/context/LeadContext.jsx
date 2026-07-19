import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';

export const LeadContext = createContext(undefined);

/**
 * Normalizes backend MongoDB lead document to ensure full compatibility with existing UI components.
 * Guarantees `id` and `date` fields exist.
 */
const normalizeLead = (lead) => {
  if (!lead) return lead;
  return {
    ...lead,
    id: lead._id || lead.id,
    date: lead.createdAt || lead.date || new Date().toISOString(),
  };
};

/**
 * Provider component that wraps the application and manages lead state via backend API operations.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  });
  const [stats, setStats] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);

  /**
   * Fetches paginated lead records from backend API.
   *
   * @param {Object} [params={}] - Filter and pagination query options
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads(params);
      if (res.success && Array.isArray(res.data)) {
        const normalized = res.data.map(normalizeLead);
        setLeads(normalized);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      const errMsg = error.response?.data?.message || 'Failed to load leads from server';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetches pipeline aggregate stats for dashboard metrics.
   */
  const fetchLeadStats = useCallback(async () => {
    try {
      const res = await leadService.getLeadStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    }
  }, []);

  /**
   * Fetches 6-month historical monthly analytics for charts.
   */
  const fetchMonthlyStats = useCallback(async () => {
    try {
      const res = await leadService.getMonthlyStats();
      if (res.success && res.data) {
        setMonthlyStats(res.data);
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
    }
  }, []);

  // Fetch leads automatically on mount
  useEffect(() => {
    const token = localStorage.getItem('crm-token');
    if (token) {
      fetchLeads();
      fetchLeadStats();
      fetchMonthlyStats();
    }
  }, [fetchLeads, fetchLeadStats, fetchMonthlyStats]);

  /**
   * Creates a new lead record.
   *
   * @param {Object} formData Form input fields
   */
  const addLead = async (formData) => {
    setIsLoading(true);
    try {
      const res = await leadService.createLead(formData);
      if (res.success && res.data) {
        const newLead = normalizeLead(res.data);
        setLeads((prev) => [newLead, ...prev]);
        toast.success(`${newLead.name} added to pipeline!`);
        fetchLeadStats();
        fetchMonthlyStats();
        return newLead;
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to create lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates an existing lead record.
   *
   * @param {string} id Unique identifier of lead to update
   * @param {Object} updatedData Fields to update
   */
  const updateLead = async (id, updatedData) => {
    setIsLoading(true);
    try {
      const res = await leadService.updateLead(id, updatedData);
      if (res.success && res.data) {
        const updated = normalizeLead(res.data);
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id || lead._id === id ? updated : lead))
        );
        toast.success(`${updated.name} updated successfully!`);
        fetchLeadStats();
        fetchMonthlyStats();
        return updated;
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to update lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Updates only the status of a lead record.
   *
   * @param {string} id Unique identifier of lead
   * @param {string} status New status value
   */
  const updateLeadStatus = async (id, status) => {
    try {
      const res = await leadService.updateLeadStatus(id, status);
      if (res.success && res.data) {
        const updated = normalizeLead(res.data);
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id || lead._id === id ? updated : lead))
        );
        toast.success(`Status updated to ${status}`);
        fetchLeadStats();
        fetchMonthlyStats();
        return updated;
      }
    } catch (error) {
      console.error('Error updating status:', error);
      const errMsg = error.response?.data?.message || 'Failed to update status';
      toast.error(errMsg);
      throw error;
    }
  };

  /**
   * Deletes a lead record from the backend.
   *
   * @param {string} id Unique identifier of lead to delete
   */
  const deleteLead = async (id) => {
    setIsLoading(true);
    try {
      const targetLead = leads.find((l) => l.id === id || l._id === id);
      const leadName = targetLead ? targetLead.name : 'Lead';

      const res = await leadService.deleteLead(id);
      if (res.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
        toast.error(`${leadName} has been removed.`, { icon: '🗑️' });
        fetchLeadStats();
        fetchMonthlyStats();
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to delete lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Retrieves a specific lead by its ID from memory state.
   *
   * @param {string} id Unique identifier
   * @returns {Object|undefined}
   */
  const getLeadById = (id) => {
    return leads.find((lead) => lead.id === id || lead._id === id);
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        stats,
        monthlyStats,
        fetchLeads,
        fetchLeadStats,
        fetchMonthlyStats,
        addLead,
        updateLead,
        updateLeadStatus,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume LeadContext.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}

export default LeadContext;
