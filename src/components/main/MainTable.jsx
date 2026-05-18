// src/components/main/MainTable.jsx
import React, { useState, useMemo } from 'react';
import MainColumnToggle from './MainColumnToggle';
import MainFilters from './MainFilters';
import MainContextMenu from './MainContextMenu';

const Icons = {
  SortAsc: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5h10M11 9h7M11 13h4" /><path d="M7 20V4M3 8l4-4 4 4" />
    </svg>
  ),
  SortDesc: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 5h10M11 9h7M11 13h4" /><path d="M7 20V4M3 16l4 4 4-4" />
    </svg>
  ),
  ChevronUpDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
      <polyline points="7 16 12 11 17 16" /><polyline points="7 10 12 5 17 10" />
    </svg>
  ),
  MoreVertical: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Search: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

function MainTable({
  columns,
  columnVisibility,
  data,
  loading,
  sortConfig,
  filterValues,
  filterOptions,
  onToggleColumn,
  onResetColumns,
  onSort,
  onFilterChange,
  onFilterClear,
  onRowAction,
}) {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, rowId: null });

  const visibleColumns = useMemo(
    () => columns.filter(col => columnVisibility[col.key] !== false),
    [columns, columnVisibility]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const strA = String(aVal).toLowerCase();
      const strB = String(bVal).toLowerCase();
      if (strA < strB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (strA > strB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return (
    <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="w-12 bg-gray-50 sticky top-0 z-20">
                <MainColumnToggle
                  columns={columns}
                  columnVisibility={columnVisibility}
                  onToggle={onToggleColumn}
                  onReset={onResetColumns}
                />
              </th>
              {visibleColumns.map(column => (
                <th key={column.key} className="bg-gray-50 sticky top-0 z-10  py-0">
                  <div className="flex flex-col">
                    <div
                      onClick={() => column.sortable && onSort(column.key)}
                      className={`flex items-center gap-1.5 px-2 pt-3.5 pb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider select-none ${
                        column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                      }`}
                    >
                      <span className="truncate">{column.label}</span>
                      {column.sortable && (
                        <span className={`flex-shrink-0 ${sortConfig.key === column.key ? 'text-indigo-500' : 'text-gray-300'}`}>
                          {sortConfig.key === column.key ? (
                            sortConfig.direction === 'asc' ? <Icons.SortAsc /> : <Icons.SortDesc />
                          ) : (
                            <Icons.ChevronUpDown />
                          )}
                        </span>
                      )}
                    </div>
                    {column.filterable && (
                      // <MainFilters
                      //   column={column}
                      //   filterValue={filterValues[column.key]}
                      //   onChange={(value) => onFilterChange(column.key, value)}
                      //   onClear={() => onFilterClear(column.key)}
                      // />
                      <MainFilters
                        column={column}
                        filterValue={filterValues[column.key]}
                        options={filterOptions?.[column.key] || []}
                        onChange={(value) => onFilterChange(column.key, value)}
                        onClear={() => onFilterClear(column.key)}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-indigo-400"><Icons.Loader /></span>
                    <span className="text-gray-500 text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Icons.Search />
                    </div>
                    <span className="text-gray-500 text-sm">No data found</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-150 group">
                  <td className="px-2 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setContextMenu({ visible: true, x: rect.left, y: rect.bottom + 4, rowId: row.id });
                      }}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <Icons.MoreVertical />
                    </button>
                  </td>
                  {visibleColumns.map(column => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-xs whitespace-nowrap ${
                        column.key === 'id' ? 'text-gray-400 font-mono text-xs' :
                        column.key === 'description' || column.key === 'dwgn' ? 'max-w-xs truncate text-gray-700' :
                        'text-gray-800'
                      }`}
                      title={column.key === 'description' || column.key === 'dwgn' ? row[column.key] : undefined}
                    >
                      {row[column.key] != null ? String(row[column.key]) : <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && (
        <MainContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowId={contextMenu.rowId}
          onAction={onRowAction}
          onClose={() => setContextMenu({ visible: false, x: 0, y: 0, rowId: null })}
        />
      )}
    </div>
  );
}

export default React.memo(MainTable);