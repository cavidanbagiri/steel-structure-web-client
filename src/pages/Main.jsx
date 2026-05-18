// src/pages/Main.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PanelLeftClose, PanelLeft, BarChart3 } from 'lucide-react';

import {
  fetchMainData,
  fetchUniqueValues,
  setFilters,
  setPagination,
  toggleColumn,
  resetColumnVisibility,
  selectMainData,
  selectMainLoading,
  selectMainPagination,
  selectMainFilters,
  selectColumnVisibility,
  selectUniqueValues
} from '../stores/main_slice';

import MainPagination from '../components/main/MainPagination';
import MainTable from '../components/main/MainTable';
import MainDetailModal from '../components/main/MainDetailModal';
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

// Column definitions with filterType
const ALL_COLUMNS = [
  { key: 'id', label: 'ID', sortable: true, filterable: false },
  { key: 'area', label: 'Area', sortable: true, filterable: true, filterType: 'text' },
  { key: 'zone', label: 'Zone', sortable: true, filterable: true, filterType: 'select' },
  { key: 'key', label: 'Key', sortable: true, filterable: true, filterType: 'text' },
  { key: 'row_labels', label: 'Row Labels', sortable: true, filterable: true, filterType: 'select' },
  { key: 'item', label: 'Item', sortable: true, filterable: true, filterType: 'text' },
  { key: 'p_s', label: 'P/S', sortable: true, filterable: true, filterType: 'text' },
  { key: 'qty', label: 'Qty', sortable: true, filterable: true, filterType: 'text' },
  { key: 'left_over_qty', label: 'Left Over', sortable: true, filterable: true, filterType: 'text' },  // NEW
  { key: 'description', label: 'Description', sortable: true, filterable: true, filterType: 'text' },
  { key: 'section', label: 'Section', sortable: true, filterable: true, filterType: 'text' },
  { key: 'length', label: 'Length', sortable: true, filterable: true, filterType: 'text' },
  { key: 'weight', label: 'Weight', sortable: true, filterable: true, filterType: 'text' },
  { key: 'weight_total', label: 'Total Weight', sortable: true, filterable: true, filterType: 'text' },
  { key: 'dwgn', label: 'Drawing', sortable: true, filterable: true, filterType: 'text' },
];

function Main() {
  const dispatch = useDispatch();

  const data = useSelector(selectMainData);
  const loading = useSelector(selectMainLoading);
  const pagination = useSelector(selectMainPagination);
  const filters = useSelector(selectMainFilters);
  const columnVisibility = useSelector(selectColumnVisibility);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterValues, setFilterValues] = useState({});

  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    rowId: null,
  });

  const [isStatsVisible, setIsStatsVisible] = useState(false);

  // Build stable filters key to prevent infinite re-fetching
  const filtersKey = useMemo(() => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        activeFilters[key] = filters[key];
      }
    });
    return JSON.stringify({ limit: pagination.limit, offset: pagination.offset, filters: activeFilters });
  }, [filters, pagination.limit, pagination.offset]);


  // Sorting
  const handleSort = useCallback((columnKey) => {
    setSortConfig(prev => {
      if (prev.key === columnKey) {
        if (prev.direction === 'asc') return { key: columnKey, direction: 'desc' };
        return { key: columnKey, direction: 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);


  const zoneOptions = useSelector(state =>
    selectUniqueValues(state, 'zone')
  );

  const row_labelsOptions = useSelector(state =>
    selectUniqueValues(state, 'row_labels')
  );

  const handleFilterChange = useCallback((columnKey, value) => {
    setFilterValues(prev => ({ ...prev, [columnKey]: value }));
    dispatch(setFilters({ [columnKey]: value || null }));
  }, [dispatch]);

  const handleFilterClear = useCallback((columnKey) => {
    setFilterValues(prev => {
      const updated = { ...prev };
      delete updated[columnKey];
      return updated;
    });
    dispatch(setFilters({ [columnKey]: null }));
  }, [dispatch]);

  // Pagination
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;

  const handlePageChange = useCallback((newOffset) => {
    dispatch(setPagination({ offset: newOffset }));
  }, [dispatch]);

  // Column toggle
  const handleToggleColumn = useCallback((columnKey) => {
    dispatch(toggleColumn(columnKey));
  }, [dispatch]);

  const handleResetColumns = useCallback(() => {
    dispatch(resetColumnVisibility());
  }, [dispatch]);



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
    // Refetch main data after successful transport/operation
    dispatch(fetchMainData({
      limit: pagination.limit,
      offset: pagination.offset,
      ...filters,
    }));
  }, [dispatch, pagination, filters]);


  // Fetch data when pagination or filters change
  useEffect(() => {
    const { filters: activeFilters, limit, offset } = JSON.parse(filtersKey);

    // Build params matching backend expectations
    const params = { limit, offset };

    Object.keys(activeFilters).forEach(key => {
      const value = activeFilters[key];
      const column = ALL_COLUMNS.find(col => col.key === key);

      if (column?.filterType === 'range') {
        // For range filters, send min_* and max_*
        if (value?.min !== undefined && value.min !== '') {
          params[`min_${key}`] = value.min;
        }
        if (value?.max !== undefined && value.max !== '') {
          params[`max_${key}`] = value.max;
        }
      } else if (key === 'search') {
        params.search = value;
      } else {
        // For text filters, send as is
        params[key] = value;
      }
    });

    dispatch(fetchMainData(params));
  }, [dispatch, filtersKey]);

  // Sync Redux filters to local filterValues for display
  useEffect(() => {
    setFilterValues(prev => {
      const updated = { ...prev };
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined) {
          updated[key] = filters[key];
        }
      });
      return updated;
    });
  }, [filters]);


  // New Added
  useEffect(() => {
    dispatch(fetchUniqueValues('zone'));
    dispatch(fetchUniqueValues('row_labels'));
  }, [dispatch]);



  return (
    <div className="flex flex-row min-h-screen bg-gray-50">
      {/* Statistics Panel with slide animation */}
      <div className={`
        transition-all duration-300 ease-in-out
        ${isStatsVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 absolute'}
      `}>
        <MainStatistics />
      </div>

      <div className="flex-1">
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

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Main Data</h1>

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

        <div className=''>
          {/* Top Pagination */}
          <MainPagination
            total={pagination.total}
            limit={pagination.limit}
            offset={pagination.offset}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Table */}
        <MainTable
          columns={ALL_COLUMNS}
          columnVisibility={columnVisibility}
          data={data}
          loading={loading}
          sortConfig={sortConfig}
          filterValues={filterValues}
          filterOptions={{
            zone: zoneOptions,
            row_labels: row_labelsOptions 
          }}
          onToggleColumn={handleToggleColumn}
          onResetColumns={handleResetColumns}
          onSort={handleSort}
          onFilterChange={handleFilterChange}
          onFilterClear={handleFilterClear}
          onRowAction={handleRowAction}
        />

        {/* Bottom Pagination */}
        <MainPagination
          total={pagination.total}
          limit={pagination.limit}
          offset={pagination.offset}
          onPageChange={handlePageChange}
        />

        {/* Modal */}
        <MainDetailModal
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

export default Main;