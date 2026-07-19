/**
 * Generates an array of the last 6 months for grouping data.
 * @returns {Array} Array of month objects containing label, month index, and year.
 */
function getLast6Months() {
  const months = [];
  const date = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      month: d.getMonth(),
    });
  }
  return months;
}

/**
 * Transforms leads into a status distribution array for a Pie chart.
 * @param {Array} leads - The array of lead objects
 * @returns {Array} Array of objects { name: 'Status', value: count }
 */
export function getStatusDistribution(leads) {
  if (!leads || leads.length === 0) return [];
  
  const counts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    // Sort by count descending for a better visual
    .sort((a, b) => b.value - a.value);
}

/**
 * Groups leads by month for the last 6 months for a Bar chart.
 * @param {Array} leads - The array of lead objects
 * @returns {Array} Array of objects { month: 'Jan', count: 12 }
 */
export function getMonthlyLeads(leads) {
  if (!leads) return [];
  
  const last6Months = getLast6Months();
  return last6Months.map((m) => {
    const count = leads.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    }).length;
    return { month: m.label, count };
  });
}

/**
 * Calculates conversion rate (Won / Total) per month for the last 6 months for a Line chart.
 * @param {Array} leads - The array of lead objects
 * @returns {Array} Array of objects { month: 'Jan', rate: 45 }
 */
export function getConversionByMonth(leads) {
  if (!leads) return [];
  
  const last6Months = getLast6Months();
  return last6Months.map((m) => {
    const monthLeads = leads.filter((l) => {
      if (!l.createdAt) return false;
      const d = new Date(l.createdAt);
      return d.getMonth() === m.month && d.getFullYear() === m.year;
    });
    
    const total = monthLeads.length;
    const won = monthLeads.filter((l) => l.status === 'Won').length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    
    return { month: m.label, rate };
  });
}

/**
 * Calculates cumulative pipeline funnel data.
 * Assumes a linear progression: New -> Contacted -> Meeting -> Proposal -> Won
 * @param {Array} leads - The array of lead objects
 * @returns {Array} Array formatted for Recharts FunnelChart
 */
export function getFunnelData(leads) {
  if (!leads || leads.length === 0) return [];

  const counts = {
    'New': 0,
    'Contacted': 0,
    'Meeting Scheduled': 0,
    'Proposal Sent': 0,
    'Won': 0
  };

  // Using a simplistic level-based assumption for historical progression 
  // since we don't have a history log of status changes for each lead.
  const levels = {
    'New': 1,
    'Contacted': 2,
    'Meeting Scheduled': 3,
    'Proposal Sent': 4,
    'Won': 5,
    'Lost': 1 // Assume lost leads were at least 'New' before being lost
  };

  leads.forEach(lead => {
    const level = levels[lead.status] || 0;
    if (level >= 1) counts['New']++;
    if (level >= 2) counts['Contacted']++;
    if (level >= 3) counts['Meeting Scheduled']++;
    if (level >= 4) counts['Proposal Sent']++;
    if (level >= 5) counts['Won']++;
  });

  return [
    { name: 'Total Leads', value: counts['New'], fill: '#9784B0' },
    { name: 'Contacted', value: counts['Contacted'], fill: '#6B46C1' },
    { name: 'Meeting', value: counts['Meeting Scheduled'], fill: '#9272D4' },
    { name: 'Proposal', value: counts['Proposal Sent'], fill: '#FF8AAE' },
    { name: 'Won', value: counts['Won'], fill: '#22C55E' }
  ];
}

/**
 * Generates an array of lead creation counts for the last 35 days (5 weeks).
 * @param {Array} leads - The array of lead objects
 * @returns {Array} Array of objects { date: 'YYYY-MM-DD', count: 2 }
 */
export function getActivityHeatmap(leads) {
  if (!leads) return [];
  
  const today = new Date();
  const heatmap = [];
  
  // 35 days fits perfectly into a 7-row CSS grid (5 weeks)
  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const count = leads.filter(l => l.date === dateStr).length;
    heatmap.push({
      date: dateStr,
      count
    });
  }
  
  return heatmap;
}

/**
 * Calculates revenue percentages including Win Rate by Value and Period Growth.
 * @param {Array} leads - The array of lead objects
 * @returns {Object} Object containing winRateValue and pipelinePotential
 */
export function getRevenuePercentages(leads) {
  if (!leads) return { winRateValue: 0, pipelinePotential: 0, totalWon: 0 };

  let totalWon = 0;
  let pipelinePotential = 0;

  leads.forEach(lead => {
    const value = Number(lead.estimatedValue) || 0;
    if (lead.status === 'Won') {
      totalWon += value;
    } else if (lead.status !== 'Lost') {
      pipelinePotential += value;
    }
  });

  const totalValue = totalWon + pipelinePotential;
  const winRateValue = totalValue > 0 ? Math.round((totalWon / totalValue) * 100) : 0;

  return { winRateValue, pipelinePotential, totalWon };
}

/**
 * Generates monthly revenue data for a given number of months.
 * @param {Array} leads - The array of lead objects
 * @param {number} monthsCount - The number of trailing months to include (3, 6, or 12)
 * @returns {Array} Array of objects { month: 'Jan YYYY', revenue: 50000 }
 */
export function getRevenueChartData(leads, monthsCount = 6) {
  if (!leads) return [];
  
  const months = [];
  const date = new Date();
  
  // Generate the last N months
  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    months.push({
      label: d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear().toString().slice(2),
      year: d.getFullYear(),
      month: d.getMonth()
    });
  }

  return months.map(m => {
    const monthRevenue = leads
      .filter(l => {
        if (!l.createdAt || l.status !== 'Won') return false;
        const d = new Date(l.createdAt);
        return d.getMonth() === m.month && d.getFullYear() === m.year;
      })
      .reduce((sum, l) => sum + (Number(l.estimatedValue) || 0), 0);
      
    return { month: m.label, revenue: monthRevenue };
  });
}

