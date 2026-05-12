import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchErectedData,
  setFilters,
  setPagination,
  selectErectedData,
  selectErectedLoading,
  selectErectedPagination,
  selectErectedFilters,
} from '../stores/erected_slice';
import ErectedStats from '../components/erected/ErectedStats';
import ErectedPagination from '../components/erected/ErectedPagination';
import ErectedTable from '../components/erected/ErectedTable';

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'area', label: 'Area' },
  { key: 'structure', label: 'Structure' },
  { key: 'row_labels', label: 'Row Labels' },
  { key: 'mark_names', label: 'Mark Name' },
  { key: 'e_qty', label: 'Qty' },
  { key: 'e_weight', label: 'Weight' },
  { key: 'daily_e_date', label: 'Date' },
  { key: 'altitude_mark_1', label: 'Altitude Mark-1' },
  { key: 'altitude_mark_2', label: 'Altitude Mark-2' },
  { key: 'axis', label: 'Axis' },
  { key: 'range', label: 'Range' },
  { key: 'proce_qty', label: 'Proce QTY' },
];

function Erected() {
  const dispatch = useDispatch();
  
  const data = useSelector(selectErectedData);
  const loading = useSelector(selectErectedLoading);
  const pagination = useSelector(selectErectedPagination);
  const filters = useSelector(selectErectedFilters);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [localFilters, setLocalFilters] = useState({});
  const [contextMenu, setContextMenu] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const saved = localStorage.getItem('erected_column_visibility');
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(ALL_COLUMNS.map(c => [c.key, true]));
  });
  
  const prevParamsRef = useRef('');

  // Build params and fetch
  useEffect(() => {
    const params = { limit: pagination.limit, offset: pagination.offset };
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params[key] = filters[key];
      }
    });
    
    const paramsStr = JSON.stringify(params);
    
    if (paramsStr !== prevParamsRef.current) {
      prevParamsRef.current = paramsStr;
      dispatch(fetchErectedData(params));
    }
  }, [dispatch, pagination.limit, pagination.offset, filters]);

  // Sync filters to local state
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Save column visibility
  useEffect(() => {
    localStorage.setItem('erected_column_visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Handlers
  const handleSort = useCallback((key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    dispatch(setFilters({ [key]: value || null }));
  }, [dispatch]);

  const handleFilterClear = useCallback((key) => {
    setLocalFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    dispatch(setFilters({ [key]: null }));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPagination({ offset: (page - 1) * pagination.limit }));
  }, [dispatch, pagination.limit]);

  const handleToggleColumn = useCallback((key) => {
    setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumnVisibility(Object.fromEntries(ALL_COLUMNS.map(c => [c.key, true])));
  }, []);

  const handleRowAction = useCallback((action, rowId) => {
    console.log(`Action: ${action}, Row ID: ${rowId}`);
  }, []);

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
  const visibleColumnsCount = ALL_COLUMNS.filter(c => columnVisibility[c.key]).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Erected</h1>
          {loading && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-600 font-medium">
              Loading...
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium shadow-sm">
            Import Data
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all duration-200 text-sm font-medium">
            Add New
          </button>
        </div>
      </div>

      {/* Top Pagination */}
      <ErectedPagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={handlePageChange}
      />

      {/* Table */}
      <ErectedTable
        columns={ALL_COLUMNS}
        columnVisibility={columnVisibility}
        data={data}
        loading={loading}
        sortConfig={sortConfig}
        filterValues={localFilters}
        onToggleColumn={handleToggleColumn}
        onResetColumns={handleResetColumns}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        onFilterClear={handleFilterClear}
        onRowAction={handleRowAction}
        contextMenu={contextMenu}
        onOpenContextMenu={setContextMenu}
        onCloseContextMenu={() => setContextMenu(null)}
      />

      {/* Bottom Pagination */}
      <ErectedPagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Erected;