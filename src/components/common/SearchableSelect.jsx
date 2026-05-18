import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';

function SearchableSelect({
  value,
  options = [],
  placeholder = 'Select...',
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = useMemo(() => {
    return options.filter(option =>
      option.value.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="
          w-full h-8 px-3
          border border-gray-300
          rounded-sm
          bg-white
          text-xs
          flex items-center justify-between
          hover:border-indigo-400
          transition-colors
        "
      >
        <span className="truncate text-gray-700">
          {selectedOption?.value || placeholder}
        </span>

        <div className="flex items-center gap-1">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={14} />
            </span>
          )}

          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute z-50 mt-1 w-[320px]
            bg-white border border-gray-200
            rounded-lg shadow-xl
            overflow-hidden
          "
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full h-9 pl-9 pr-3
                  border border-gray-200
                  rounded-md
                  text-sm
                  outline-none
                  focus:border-indigo-400
                "
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-80 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-sm text-gray-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className="
                    w-full px-3 py-2.5
                    hover:bg-indigo-50
                    border-b border-gray-50
                    transition-colors
                    text-left
                  "
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {option.value}
                      </div>

                      <div className="text-xs text-gray-500 mt-0.5">
                        {option.count} pcs
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-indigo-600 whitespace-nowrap">
                      {Number(option.weight_total || 0).toLocaleString()} kg
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(SearchableSelect);