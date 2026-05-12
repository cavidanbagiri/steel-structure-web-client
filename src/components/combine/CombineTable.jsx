// src/components/combine/CombineTable.jsx
import React, { useMemo, useState } from 'react';
import CombineColumnToggle from './CombineColumnToggle';
import CombineFilters from './CombineFilters';
import CombineContextMenu from './CombineContextMenu';

function CombineTable({
  columnGroups,
  columnVisibility,
  data,
  loading,
  sortConfig,
  filterValues,
  onToggleColumn,
  onResetColumns,
  onSort,
  onFilterChange,
  onFilterClear,
  onRowAction,
  contextMenu,
  onOpenContextMenu,
  onCloseContextMenu,
}) {
  const [expandedRows, setExpandedRows] = useState({});

  const visibleGroupColumns = (group) => group.columns.filter(c => columnVisibility[c.key] !== false);

  // Build flat list of all visible columns for colSpan
  const allVisibleColumns = useMemo(
    () => columnGroups.flatMap(g => visibleGroupColumns(g)),
    [columnGroups, columnVisibility]
  );

  const totalColSpan = allVisibleColumns.length + 2; // +2 for action and expand columns

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = sortConfig.accessor(a);
      const bVal = sortConfig.accessor(b);
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [data, sortConfig]);

  const toggleExpand = (combineId) => {
    setExpandedRows(prev => ({ ...prev, [combineId]: !prev[combineId] }));
  };

  const mainColumns = columnGroups.find(g => g.key === 'main')?.columns || [];
  const transportColumns = columnGroups.find(g => g.key === 'transport')?.columns || [];
  const erectionColumns = columnGroups.find(g => g.key === 'erection')?.columns || [];

  const visibleMainCols = mainColumns.filter(c => columnVisibility[c.key] !== false);
  const visibleTransportCols = transportColumns.filter(c => columnVisibility[c.key] !== false);
  const visibleErectionCols = erectionColumns.filter(c => columnVisibility[c.key] !== false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {/* Group headers */}
            <tr className="border-b border-gray-200">
              <th className="w-12 bg-gray-100 sticky top-0 z-20"></th>
              <th className="w-10 bg-gray-100 sticky top-0 z-20"></th>
              {columnGroups.map(group => {
                const visibleCount = visibleGroupColumns(group).length;
                if (visibleCount === 0) return null;
                return (
                  <th
                    key={group.key}
                    colSpan={visibleCount}
                    className={`${group.bgColor} sticky top-0 z-10 px-3 py-2 text-center text-xs font-bold uppercase tracking-wider`}
                  >
                    {group.label}
                  </th>
                );
              })}
            </tr>
            {/* Column headers with filters */}
            <tr className="border-b-2 border-gray-200">
              <th className="w-12 bg-gray-50 sticky top-[41px] z-20">
                <CombineColumnToggle
                  columnGroups={columnGroups}
                  columnVisibility={columnVisibility}
                  onToggle={onToggleColumn}
                  onReset={onResetColumns}
                />
              </th>
              <th className="w-10 bg-gray-50 sticky top-[41px] z-20"></th>
              {columnGroups.map(group =>
                visibleGroupColumns(group).map(column => (
                  <th key={column.key} className="bg-gray-50 sticky top-[41px] z-10 px-2 py-0">
                    <div className="flex flex-col">
                      <div
                        onClick={() => onSort(column.key, (row) => column.accessor(row))}
                        className="flex items-center gap-1.5 px-3 pt-3.5 pb-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                      >
                        <span className="truncate">{column.label}</span>
                        {sortConfig.key === column.key && (
                          <span className="text-indigo-500 flex-shrink-0">
                            {sortConfig.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                      {column.filterable && (
                        <CombineFilters
                          column={column}
                          filterValue={filterValues[column.key]}
                          onChange={(value) => onFilterChange(column.key, value)}
                          onClear={() => onFilterClear(column.key)}
                        />
                      )}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={totalColSpan} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-500 text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={totalColSpan} className="py-20 text-center">
                  <span className="text-gray-500 text-sm">No data found</span>
                </td>
              </tr>
            ) : (
              sortedData.flatMap((row) => {
                const combineId = row.transport?.id || row.main?.id || Math.random();
                const erections = row.erections || [];
                const isExpanded = expandedRows[combineId];

                const rows = [];

                // ===== MAIN ROW =====
                rows.push(
                  <tr key={combineId} className="hover:bg-gray-50 transition-colors duration-150 group">
                    {/* Action button */}
                    <td className="px-2 py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.getBoundingClientRect();
                          onOpenContextMenu({ x: rect.left, y: rect.bottom + 4, combineId });
                        }}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-gray-700 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </td>
                    {/* Expand button */}
                    <td className="px-2 py-3 text-center">
                      {erections.length > 0 ? (
                        <button
                          onClick={() => toggleExpand(combineId)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title={isExpanded ? 'Collapse' : `Show ${erections.length} erection(s)`}
                        >
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    {/* All column data using accessor */}
                    {allVisibleColumns.map(column => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm whitespace-nowrap ${column.tdClass || 'text-gray-800'}`}
                        title={column.title ? column.accessor(row) : undefined}
                      >
                        {column.accessor(row) != null ? String(column.accessor(row)) : <span className="text-gray-300">—</span>}
                      </td>
                    ))}
                  </tr>
                );

                // ===== ERECTION SUB-ROWS =====
                if (isExpanded && erections.length > 0) {
                  erections.forEach((erectionItem, idx) => {
                    const erection = erectionItem.erected;
                    rows.push(
                      <tr key={`${combineId}-erection-${idx}`} className="bg-amber-50/50 border-b border-amber-100">
                        <td></td>
                        <td className="px-2 py-2 text-center">
                          <span className="text-xs text-amber-600 font-medium bg-amber-100 rounded-full w-5 h-5 inline-flex items-center justify-center">
                            {idx + 1}
                          </span>
                        </td>
                        {/* Empty cells for Main columns */}
                        {visibleMainCols.map(col => (
                          <td key={`main-empty-${col.key}`} className="px-4 py-2"></td>
                        ))}
                        {/* Empty cells for Transport columns */}
                        {visibleTransportCols.map(col => (
                          <td key={`transport-empty-${col.key}`} className="px-4 py-2"></td>
                        ))}
                        {/* Erection data using erectionAccessor */}
                        {visibleErectionCols.map(column => (
                          <td
                            key={column.key}
                            className={`px-4 py-2 text-sm whitespace-nowrap ${column.tdClass || 'text-gray-700'}`}
                          >
                            {column.erectionAccessor
                              ? (column.erectionAccessor(erection) != null
                                  ? String(column.erectionAccessor(erection))
                                  : <span className="text-gray-300">—</span>)
                              : <span className="text-gray-300">—</span>
                            }
                          </td>
                        ))}
                      </tr>
                    );
                  });
                }

                return rows;
              })
            )}
          </tbody>
        </table>
      </div>

      {contextMenu && (
        <CombineContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          combineId={contextMenu.combineId}
          onAction={onRowAction}
          onClose={onCloseContextMenu}
        />
      )}
    </div>
  );
}

export default React.memo(CombineTable);