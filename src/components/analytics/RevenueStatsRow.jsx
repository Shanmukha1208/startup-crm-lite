import React from 'react';
import { DollarSign, PieChart, TrendingUp } from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

export default function RevenueStatsRow({ stats }) {
  const { winRateValue, pipelinePotential, totalWon } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      
      {/* Metric 1: Total Won Revenue */}
      <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-success/10 text-success rounded-xl">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-gray uppercase tracking-wide">Total Won Revenue</p>
          <p className="text-xl font-bold text-text-dark">{formatCurrency(totalWon)}</p>
        </div>
      </div>

      {/* Metric 2: Pipeline Potential */}
      <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-gray uppercase tracking-wide">Pipeline Potential</p>
          <p className="text-xl font-bold text-text-dark">{formatCurrency(pipelinePotential)}</p>
        </div>
      </div>

      {/* Metric 3: Revenue Win Rate % */}
      <div className="p-6 bg-card border border-slate-200/60 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-warning/10 text-warning rounded-xl">
          <PieChart className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-gray uppercase tracking-wide">Win Rate (By Value)</p>
          <p className="text-xl font-bold text-text-dark">{winRateValue}%</p>
        </div>
      </div>

    </div>
  );
}
