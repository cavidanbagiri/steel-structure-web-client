import React from 'react';

function TransportFilters({ column, filterValue, filterOptions, onChange, onClear }) {
  // For columns that have predefined options, show a select dropdown
  const hasOptions = filterOptions && filterOptions[column.key] && filterOptions[column.key].length > 0;

  if (hasOptions) {
    return (
      <div className="px-2 pb-2.5">
        <div className="relative">
          <select
            value={filterValue || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-8 pl-2 pr-8 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all duration-200 appearance-none"
          >
            <option value="">All</option>
            {filterOptions[column.key].map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
          {filterValue && (
            <button
              onClick={onClear}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>
    );
  }

  // Default text input for other columns
  return (
    <div className="px-2 pb-2.5">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Filter..."
          value={filterValue || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8 pl-9 pr-8 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all duration-200"
        />
        {filterValue && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(TransportFilters);