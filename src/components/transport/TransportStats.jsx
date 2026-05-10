import React from 'react';

function TransportStats({ total, visibleColumnsCount, currentPage, totalPages, limit }) {
  const stats = [
    { value: total.toLocaleString(), label: 'Total Records', color: 'border-l-indigo-500' },
    { value: visibleColumnsCount, label: 'Visible Columns', color: 'border-l-emerald-500' },
    { value: `${currentPage} / ${totalPages}`, label: 'Current Page', color: 'border-l-amber-500' },
    { value: limit, label: 'Rows Per Page', color: 'border-l-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`bg-white rounded-xl border border-gray-200 border-l-4 ${stat.color} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(TransportStats);