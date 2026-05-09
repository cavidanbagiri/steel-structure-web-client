// src/components/main/MainStats.jsx
import React from 'react';

const Icons = {
  Database: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Columns: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" />
    </svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Hash: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="9" x2="20" y2="9" /><line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" /><line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  ),
};

const statsConfig = (pagination, visibleColumnsCount, currentPage, totalPages) => [
  { value: pagination.total.toLocaleString(), label: 'Total Records', icon: <Icons.Database />, color: 'border-l-indigo-500' },
  { value: visibleColumnsCount, label: 'Visible Columns', icon: <Icons.Columns />, color: 'border-l-emerald-500' },
  { value: `${currentPage} / ${totalPages}`, label: 'Current Page', icon: <Icons.FileText />, color: 'border-l-amber-500' },
  { value: pagination.limit, label: 'Rows Per Page', icon: <Icons.Hash />, color: 'border-l-rose-500' },
];

function MainStats({ pagination, visibleColumnsCount, currentPage, totalPages }) {
  const stats = statsConfig(pagination, visibleColumnsCount, currentPage, totalPages);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${stat.color} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-400">{stat.icon}</div>
          </div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(MainStats);