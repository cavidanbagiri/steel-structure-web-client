import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTransportData,
  fetchFilterOptions,
  importTransportData,
  setFilters,
  clearFilters,
  setPagination,
  selectTransportItems,
  selectTransportLoading,
  selectTransportTotal,
  selectTransportFilters,
  selectPagination,
  selectFilterOptions,
  selectImportStatus
} from '../stores/transport_slice';
import TransportStats from '../components/transport/TransportStats';
import TransportPagination from '../components/transport/TransportPagination';
import TransportTable from '../components/transport/TransportTable';

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'structure_1', label: 'Structure 1' },
  { key: 'structure_2', label: 'Structure 2' },
  { key: 'raw_labels', label: 'Raw Labels' },
  { key: 'mark_name', label: 'Mark Name' },
  { key: 't_qty', label: 'Qty' },
  { key: 't_weight', label: 'Weight' },
  { key: 't_date', label: 'Date' },
  { key: 't_status', label: 'Status' },
  { key: 'proce_qty', label: 'Proc Qty' },
  { key: 'order_no', label: 'Order No' },
  { key: 'key', label: 'Key' },
  { key: 'area', label: 'Area' },
  { key: 'location', label: 'Location' },
];

function Transport() {
  const dispatch = useDispatch();
  
  const items = useSelector(selectTransportItems);
  const loading = useSelector(selectTransportLoading);
  const total = useSelector(selectTransportTotal);
  const filters = useSelector(selectTransportFilters);
  const pagination = useSelector(selectPagination);
  const filterOptions = useSelector(selectFilterOptions);
  const importStatus = useSelector(selectImportStatus);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [localFilters, setLocalFilters] = useState({});
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const saved = localStorage.getItem('transport_column_visibility');
    if (saved) return JSON.parse(saved);
    return Object.fromEntries(ALL_COLUMNS.map(c => [c.key, true]));
  });
  
  const prevParamsRef = useRef('');

  // Fetch filter options on mount
  useEffect(() => {
    dispatch(fetchFilterOptions());
  }, [dispatch]);

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
      dispatch(fetchTransportData(params));
    }
  }, [dispatch, pagination.limit, pagination.offset, filters]);

  // Sync filters to local state
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Save column visibility
  useEffect(() => {
    localStorage.setItem('transport_column_visibility', JSON.stringify(columnVisibility));
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
    dispatch(setPagination({ offset: (page - 1) * pagination.limit, page: page - 1 }));
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
  const totalPages = Math.ceil(total / pagination.limit) || 1;
  const visibleColumnsCount = ALL_COLUMNS.filter(c => columnVisibility[c.key]).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Transport</h1>
          {loading && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-600 font-medium">
              Loading...
            </span>
          )}
          {importStatus.importing && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-600 font-medium">
              Importing...
            </span>
          )}
          {importStatus.importResult && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-xs text-green-600 font-medium">
              Import complete
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(importTransportData())}
            disabled={importStatus.importing}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 text-sm font-medium shadow-sm"
          >
            Import Data
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all duration-200 text-sm font-medium">
            Add New
          </button>
        </div>
      </div>

      {/* Top Pagination */}
      <TransportPagination
        total={total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={handlePageChange}
      />

      {/* Table */}
      <TransportTable
        columns={ALL_COLUMNS}
        columnVisibility={columnVisibility}
        data={items}
        loading={loading}
        sortConfig={sortConfig}
        filterValues={localFilters}
        filterOptions={filterOptions}
        onToggleColumn={handleToggleColumn}
        onResetColumns={handleResetColumns}
        onSort={handleSort}
        onFilterChange={handleFilterChange}
        onFilterClear={handleFilterClear}
        onRowAction={handleRowAction}
      />

      {/* Bottom Pagination */}
      <TransportPagination
        total={total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Transport;