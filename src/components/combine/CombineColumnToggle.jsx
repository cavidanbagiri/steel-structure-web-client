import React, { useState, useEffect, useRef } from 'react';

function CombineColumnToggle({ columnGroups, columnVisibility, onToggle, onReset }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  const allColumns = columnGroups.flatMap(group => group.columns);

  return (
    <div className="relative flex justify-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all duration-200"
        title="Toggle columns"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800">Toggle Columns</span>
            <button
              onClick={onReset}
              className="text-xs text-indigo-600 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {columnGroups.map(group => (
              <div key={group.key}>
                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase bg-gray-50">
                  {group.label}
                </div>
                {group.columns.map(col => (
                  <label
                    key={col.key}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={columnVisibility[col.key] !== false}
                      onChange={() => onToggle(col.key)}
                      className="w-4 h-4 rounded border-gray-300 bg-white text-indigo-500 focus:ring-indigo-300"
                    />
                    <span className="text-sm text-gray-700">{col.label}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(CombineColumnToggle);