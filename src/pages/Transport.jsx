import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PanelLeftClose, PanelLeft, BarChart3 } from 'lucide-react';

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
import TransportDetailModal from '../components/transport/TransportDetailModal'
import MainStatistics from '../components/main/MainStatistics';



const Icons = {
  Import: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
};

const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'structure_1', label: 'Structure 1' },
  { key: 'structure_2', label: 'Structure 2' },
  { key: 'raw_labels', label: 'Raw Labels' },
  { key: 'mark_name', label: 'Mark Name' },
  { key: 't_qty', label: 'Qty' },
  { key: 't_leftover_qty', label: 'Leftover QTY' },
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

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    rowId: null,
  });

  
  const [isStatsVisible, setIsStatsVisible] = useState(false);

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

  // const handlePageChange = useCallback((page) => {
  //   dispatch(setPagination({ offset: (page - 1) * pagination.limit, page: page - 1 }));
  // }, [dispatch, pagination.limit]);

  const handlePageChange = useCallback((page) => {
    console.log('The page is-1 ', page)
    console.log('The page is-2 ', pagination.limit)
    dispatch(setPagination({ offset: (page - 1) * pagination.limit, page: page - 1 }));
}, [dispatch, pagination.limit]);

  const handleToggleColumn = useCallback((key) => {
    setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleResetColumns = useCallback(() => {
    setColumnVisibility(Object.fromEntries(ALL_COLUMNS.map(c => [c.key, true])));
  }, []);


  // For modal Operations
  const handleRowAction = useCallback((action, rowId) => {
    if (action === 'delete') {
      // Handle delete separately (confirmation dialog later)
      console.log('Delete item:', rowId);
      return;
    }

    setModalState({
      isOpen: true,
      mode: action,  // 'view' | 'edit' | 'duplicate' | 'transport' | 'erected'
      rowId: rowId,
    });
  }, []);

  // Add handleModalClose
  const handleModalClose = useCallback(() => {
    setModalState({ isOpen: false, mode: null, rowId: null });
  }, []);



  const handleModalSuccess = useCallback(() => {
    // Refetch transport data after successful operation
    dispatch(fetchTransportData({
      limit: pagination.limit,
      offset: pagination.offset,
      ...filters,
    }));
  }, [dispatch, pagination, filters]);



  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(total / pagination.limit) || 1;
  const visibleColumnsCount = ALL_COLUMNS.filter(c => columnVisibility[c.key]).length;

  return (

    <div className="flex flex-row min-h-screen bg-gray-50">
       {/* Statistics Panel with slide animation */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isStatsVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}
      `}>
        <MainStatistics />
      </div>

      <div className="flex-1 min-h-screen bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-6">
          <div className="flex items-center gap-4">
            {/* Toggle Button */}
            <button
              onClick={() => setIsStatsVisible(!isStatsVisible)}
              className={`
                group relative p-2.5 rounded-xl transition-all duration-300
                ${isStatsVisible 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600' 
                  : 'bg-white text-gray-500 hover:text-blue-600 hover:bg-blue-50 border-2 border-dashed border-gray-300 hover:border-blue-300'
                }
              `}
              title={isStatsVisible ? 'Hide Statistics' : 'Show Statistics'}
            >
              {isStatsVisible ? (
                <PanelLeftClose className="w-5 h-5 transition-transform group-hover:scale-110" />
              ) : (
                <>
                  <PanelLeft className="w-5 h-5 transition-transform group-hover:scale-110" />
                  {/* Pulsing dot to attract attention */}
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </>
              )}
            </button>

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transport</h1>
            
            {loading && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
                <span className="text-indigo-500"><Icons.Loader /></span>
                <span className="text-xs text-indigo-600 font-medium">Loading...</span>
              </div>
            )}
          </div>

          {/* Optional: Quick stat indicator when panel is hidden */}
          {!isStatsVisible && (
            <button
              onClick={() => setIsStatsVisible(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                         rounded-xl text-sm font-medium text-gray-600 hover:text-blue-600 
                         hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Show Statistics</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                Live
              </span>
            </button>
          )}
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


        {/* Modal */}
        <TransportDetailModal
          mode={modalState.mode}
          rowId={modalState.rowId}
          isOpen={modalState.isOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />

      </div>

    </div>

  );
}

export default Transport;