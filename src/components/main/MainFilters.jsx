// src/components/main/MainFilters.jsx
import React from 'react';

const Icons = {
  Search: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  X: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

function MainFilters({ column, filterValue, onChange, onClear }) {
  // For numeric columns, show min/max range inputs
  // if (column.filterType === 'range') {
  //   const minValue = filterValue?.min || '';
  //   const maxValue = filterValue?.max || '';
    
  //   return (
  //     <div className="px-2 pb-2.5 flex gap-1.5">
  //       <div className="relative flex-1">
  //         <input
  //           type="number"
  //           placeholder="Min"
  //           value={minValue}
  //           onChange={(e) => onChange({ ...filterValue, min: e.target.value })}
  //           className="w-full h-8 px-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all duration-200"
  //         />
  //       </div>
  //       <span className="text-gray-300 text-xs flex items-center">–</span>
  //       <div className="relative flex-1">
  //         <input
  //           type="number"
  //           placeholder="Max"
  //           value={maxValue}
  //           onChange={(e) => onChange({ ...filterValue, max: e.target.value })}
  //           className="w-full h-8 px-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-700 placeholder-gray-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all duration-200"
  //         />
  //       </div>
  //       {(minValue || maxValue) && (
  //         <button
  //           onClick={onClear}
  //           className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
  //         >
  //           <Icons.X />
  //         </button>
  //       )}
  //     </div>
  //   );
  // }

  // For text columns, show single text input
  return (
    <div className="px-2 pb-2.5">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Icons.Search />
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
            <Icons.X />
          </button>
        )}
      </div>
    </div>
  );
}

export default React.memo(MainFilters);