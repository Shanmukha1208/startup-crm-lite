/**
 * Sample leads data for the initial load of the application.
 * Contains realistic-looking fake data with Indian names and companies.
 * Varied statuses: 2 New, 1 Contacted, 1 Won, 1 Lost, 1 Meeting Scheduled.
 */
export const SAMPLE_LEADS = [
  { 
    id: crypto.randomUUID(), 
    name: 'Aarav Sharma', 
    company: 'Bharat Tech Solutions', 
    email: 'aarav.sharma@bharattech.in', 
    phone: '+91 98765 43210', 
    status: 'New', 
    source: 'Website', 
    estimatedValue: 45000,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(), 
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0] 
  },
  { 
    id: crypto.randomUUID(), 
    name: 'Priya Patel', 
    company: 'Gujarat Innovates', 
    email: 'priya.patel@gujratinnovates.com', 
    phone: '+91 87654 32109', 
    status: 'New', 
    source: 'LinkedIn', 
    estimatedValue: 120000,
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), 
    date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0] 
  },
  { 
    id: crypto.randomUUID(), 
    name: 'Rohan Gupta', 
    company: 'Delhi Dynamics', 
    email: 'rohan.gupta@delhidynamics.in', 
    phone: '+91 76543 21098', 
    status: 'Contacted', 
    source: 'Referral', 
    estimatedValue: 85000,
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(), 
    date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0] 
  },
  { 
    id: crypto.randomUUID(), 
    name: 'Neha Reddy', 
    company: 'Hyderabad Systems', 
    email: 'neha.reddy@hydsystems.co.in', 
    phone: '+91 65432 10987', 
    status: 'Meeting Scheduled', 
    source: 'Email Campaign', 
    estimatedValue: 210000,
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(), 
    date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0] 
  },
  { 
    id: crypto.randomUUID(), 
    name: 'Vikram Singh', 
    company: 'Punjab Enterprises', 
    email: 'vikram.singh@punjabent.com', 
    phone: '+91 54321 09876', 
    status: 'Lost', 
    source: 'Cold Call', 
    estimatedValue: 35000,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(), 
    date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0] 
  },
  { 
    id: crypto.randomUUID(), 
    name: 'Ananya Desai', 
    company: 'Mumbai Ventures', 
    email: 'ananya.desai@mumbaiventures.in', 
    phone: '+91 43210 98765', 
    status: 'Won', 
    source: 'Other', 
    estimatedValue: 500000,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), 
    date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0] 
  }
];
