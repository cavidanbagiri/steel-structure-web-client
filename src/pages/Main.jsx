// src/pages/Main.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMainData,
  setFilters,
  setPagination,
  toggleColumn,
  resetColumnVisibility,
  selectMainData,
  selectMainLoading,
  selectMainPagination,
  selectMainFilters,
  selectColumnVisibility
} from '../stores/main_slice';
import MainStats from '../components/main/MainStats';
import MainPagination from '../components/main/MainPagination';
import MainTable from '../components/main/MainTable';
import MainDetailModal from '../components/main/MainDetailModal';

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
  { key: 'zone', label: 'Zone', sortable: true, filterable: true, filterType: 'text' },
  { key: 'key', label: 'Key', sortable: true, filterable: true, filterType: 'text' },
  { key: 'row_labels', label: 'Row Labels', sortable: true, filterable: true, filterType: 'text' },
  { key: 'item', label: 'Item', sortable: true, filterable: true, filterType: 'text' },
  { key: 'p_s', label: 'P/S', sortable: true, filterable: true, filterType: 'text' },
  { key: 'qty', label: 'Qty', sortable: true, filterable: true, filterType: 'range' },
  { key: 'left_over_qty', label: 'Left Over', sortable: true, filterable: true, filterType: 'range' },  // NEW
  { key: 'description', label: 'Description', sortable: true, filterable: true, filterType: 'text' },
  { key: 'section', label: 'Section', sortable: true, filterable: true, filterType: 'text' },
  { key: 'length', label: 'Length', sortable: true, filterable: true, filterType: 'range' },
  { key: 'weight', label: 'Weight', sortable: true, filterable: true, filterType: 'range' },
  { key: 'weight_total', label: 'Total Weight', sortable: true, filterable: true, filterType: 'range' },
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


  useEffect(() => {
    const activeFilters = {};
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        activeFilters[key] = filters[key];
      }
    });

    const params = {
      limit: pagination.limit,
      offset: pagination.offset,
      ...activeFilters,
    };


    dispatch(fetchMainData(params));
  }, [dispatch, pagination.limit, pagination.offset, filters]);

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




  return (
    <div className="min-h-screen bg-gray-50 py-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Main Data</h1>
          {loading && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full">
              <span className="text-indigo-500"><Icons.Loader /></span>
              <span className="text-xs text-indigo-600 font-medium">Loading...</span>
            </div>
          )}
        </div>
      </div>

      <div className='mt-5'>

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
        onSuccess={handleModalSuccess}   // ADD THIS
      />
    </div>
  );
}

export default Main;