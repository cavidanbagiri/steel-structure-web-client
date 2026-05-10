import React, { useState, useMemo } from 'react';
import TransportColumnToggle from './TransportColumnToggle';
import TransportFilters from './TransportFilters';
import TransportContextMenu from './TransportContextMenu';

function TransportTable({
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
  const [contextMenu, setContextMenu] = useState(null);

  const visibleColumns = useMemo(
    () => columns.filter(col => columnVisibility[col.key] !== false),
    [columns, columnVisibility]
  );

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sortConfig]);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="w-12 bg-gray-50 sticky top-0 z-20">
                <TransportColumnToggle
                  columns={columns}
                  columnVisibility={columnVisibility}
                  onToggle={onToggleColumn}
                  onReset={onResetColumns}
                />
              </th>
              {visibleColumns.map(column => (
                <th key={column.key} className="bg-gray-50 sticky top-0 z-10 px-2 py-0">
                  <div className="flex flex-col">
                    <div
                      onClick={() => onSort(column.key)}
                      className="flex items-center gap-1.5 px-3 pt-3.5 pb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                    >
                      <span className="truncate">{column.label}</span>
                      {sortConfig.key === column.key && (
                        <span className="text-indigo-500 flex-shrink-0">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                    <TransportFilters
                      column={column}
                      filterValue={filterValues[column.key]}
                      filterOptions={filterOptions}
                      onChange={(value) => onFilterChange(column.key, value)}
                      onClear={() => onFilterClear(column.key)}
                    />
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
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
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
                        setContextMenu({ x: rect.left, y: rect.bottom + 4, rowId: row.id });
                      }}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </td>
                  {visibleColumns.map(column => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-sm whitespace-nowrap ${
                        column.key === 'id' ? 'text-gray-400 font-mono text-xs' :
                        column.key === 'key' || column.key === 'structure_2' ? 'max-w-xs truncate text-gray-700' :
                        'text-gray-800'
                      }`}
                      title={column.key === 'key' || column.key === 'structure_2' ? row[column.key] : undefined}
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

      {contextMenu && (
        <TransportContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          rowId={contextMenu.rowId}
          onAction={onRowAction}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default React.memo(TransportTable);