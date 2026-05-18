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
import MainStatistics from '../components/main/MainStatistics';


import { PanelLeftClose, PanelLeft, BarChart3 } from 'lucide-react';

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

    const [modalState, setModalState] = useState({
      isOpen: false,
      mode: null,
      rowId: null,
    });
  
    
    const [isStatsVisible, setIsStatsVisible] = useState(false);

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

            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Erected</h1>
            
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

    </div>

  );
}

export default Erected;