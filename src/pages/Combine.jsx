import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';


import { PanelLeftClose, PanelLeft, BarChart3 } from 'lucide-react';

import {
  fetchCombineData,
  setFilters,
  setPagination,
  selectCombineData,
  selectCombineLoading,
  selectCombinePagination,
  selectCombineFilters,
} from '../stores/combine_slice';
import CombineStats from '../components/combine/CombineStats';
import CombinePagination from '../components/combine/CombinePagination';
import CombineTable from '../components/combine/CombineTable';
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

const COLUMN_GROUPS = [
  {
    key: 'main',
    label: 'Main',
    bgColor: 'bg-blue-50 text-blue-700',
    columns: [
      { key: 'main_id', label: 'ID', accessor: (row) => row.main?.id, filterable: false, tdClass: 'text-gray-400 font-mono text-xs' },
      { key: 'main_area', label: 'Area', accessor: (row) => row.main?.area, filterable: true },
      { key: 'main_zone', label: 'Zone', accessor: (row) => row.main?.zone, filterable: true },
      { key: 'main_item', label: 'Item', accessor: (row) => row.main?.item, filterable: true },
      { key: 'main_p_s', label: 'P/S', accessor: (row) => row.main?.p_s, filterable: true },
      { key: 'main_qty', label: 'Qty', accessor: (row) => row.main?.qty, filterable: true },
      { key: 'main_left_over', label: 'Left Over', accessor: (row) => row.main?.left_over_qty, filterable: true },
      { key: 'main_weight', label: 'Weight', accessor: (row) => row.main?.weight, filterable: true },
      { key: 'main_weight_total', label: 'Total Wt', accessor: (row) => row.main?.weight_total, filterable: true },
      { key: 'main_section', label: 'Section', accessor: (row) => row.main?.section, filterable: true, title: true },
    ],
  },
  {
    key: 'transport',
    label: 'Transport',
    bgColor: 'bg-emerald-50 text-emerald-700',
    columns: [
      { key: 't_id', label: 'ID', accessor: (row) => row.transport?.id, filterable: false, tdClass: 'text-gray-400 font-mono text-xs' },
      { key: 't_qty', label: 'T Qty', accessor: (row) => row.transport?.t_qty, filterable: true },
      { key: 't_leftover', label: 'Leftover', accessor: (row) => row.transport?.t_leftover_qty, filterable: true },
      { key: 't_weight', label: 'T Weight', accessor: (row) => row.transport?.t_weight, filterable: true },
      { key: 't_date', label: 'T Date', accessor: (row) => row.transport?.t_date, filterable: true },
      { key: 't_status', label: 'Status', accessor: (row) => row.transport?.t_status, filterable: true },
      { key: 't_order', label: 'Order No', accessor: (row) => row.transport?.order_no, filterable: true },
      { key: 't_area', label: 'Area', accessor: (row) => row.transport?.area, filterable: true },
      { key: 't_location', label: 'Location', accessor: (row) => row.transport?.location, filterable: true },
    ],
  },
  {
    key: 'erection',
    label: 'Erection',
    bgColor: 'bg-amber-50 text-amber-700',
    columns: [
      { key: 'e_id', label: 'E ID', 
        accessor: (row) => row.erections?.[0]?.erected?.id,
        erectionAccessor: (erection) => erection.id,
        filterable: false, tdClass: 'text-gray-400 font-mono text-xs' 
      },
      { key: 'e_qty', label: 'E Qty', 
        accessor: (row) => row.total_erected_qty,
        erectionAccessor: (erection) => erection.e_qty,
        filterable: true 
      },
      { key: 'e_weight', label: 'E Weight', 
        accessor: (row) => row.erections?.reduce((sum, e) => sum + (e.erected?.e_weight || 0), 0),
        erectionAccessor: (erection) => erection.e_weight,
        filterable: true 
      },
      { key: 'e_date', label: 'E Date', 
        accessor: (row) => row.erections?.[0]?.erected?.daily_e_date,
        erectionAccessor: (erection) => erection.daily_e_date,
        filterable: true 
      },
      { key: 'e_axis', label: 'Axis', 
        accessor: (row) => row.erections?.[0]?.erected?.axis,
        erectionAccessor: (erection) => erection.axis,
        filterable: true 
      },
      { key: 'e_range', label: 'Range', 
        accessor: (row) => row.erections?.[0]?.erected?.range,
        erectionAccessor: (erection) => erection.range,
        filterable: true 
      },
      { key: 'e_altitude_1', label: 'Alt Mark 1', 
        accessor: (row) => row.erections?.[0]?.erected?.altitude_mark_1,
        erectionAccessor: (erection) => erection.altitude_mark_1,
        filterable: true 
      },
      { key: 'e_altitude_2', label: 'Alt Mark 2', 
        accessor: (row) => row.erections?.[0]?.erected?.altitude_mark_2,
        erectionAccessor: (erection) => erection.altitude_mark_2,
        filterable: true 
      },
    ],
  },
];

function Combine() {
  const dispatch = useDispatch();
  
  const data = useSelector(selectCombineData);
  const loading = useSelector(selectCombineLoading);
  const pagination = useSelector(selectCombinePagination);
  const filters = useSelector(selectCombineFilters);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc', accessor: null });
  const [localFilters, setLocalFilters] = useState({});
  const [contextMenu, setContextMenu] = useState(null);

  
    const [modalState, setModalState] = useState({
      isOpen: false,
      mode: null,
      rowId: null,
    });
  
    
    const [isStatsVisible, setIsStatsVisible] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState(() => {
    const saved = localStorage.getItem('combine_column_visibility');
    if (saved) return JSON.parse(saved);
    const defaults = {};
    COLUMN_GROUPS.forEach(g => g.columns.forEach(c => { defaults[c.key] = true; }));
    return defaults;
  });
  
  const prevParamsRef = useRef('');

  // Fetch data
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
      dispatch(fetchCombineData(params));
    }
  }, [dispatch, pagination.limit, pagination.offset, filters]);

  // Sync filters to local
  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  // Save column visibility
  useEffect(() => {
    localStorage.setItem('combine_column_visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const handleSort = useCallback((key, accessor) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc', accessor: prev.accessor };
      }
      return { key, direction: 'asc', accessor };
    });
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
    // Only dispatch filter keys that the backend understands
    const backendFilters = {};
    if (value) {
      backendFilters[key] = value;
    } else {
      backendFilters[key] = null;
    }
    dispatch(setFilters(backendFilters));
  }, [dispatch]);

  const handleFilterClear = useCallback((key) => {
    setLocalFilters(prev => { const next = { ...prev }; delete next[key]; return next; });
    dispatch(setFilters({ [key]: null }));
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    dispatch(setPagination({ offset: (page - 1) * pagination.limit }));
  }, [dispatch, pagination.limit]);

  const handleToggleColumn = useCallback((key) => {
    setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleResetColumns = useCallback(() => {
    const defaults = {};
    COLUMN_GROUPS.forEach(g => g.columns.forEach(c => { defaults[c.key] = true; }));
    setColumnVisibility(defaults);
  }, []);

  const handleRowAction = useCallback((action, combineId) => {
    console.log(`Action: ${action}, Combine ID: ${combineId}`);
  }, []);

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;
  const allCols = COLUMN_GROUPS.flatMap(g => g.columns);
  const visibleColumnsCount = allCols.filter(c => columnVisibility[c.key]).length;

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


        <CombinePagination
          total={pagination.total}
          limit={pagination.limit}
          offset={pagination.offset}
          onPageChange={handlePageChange}
        />

        <CombineTable
          columnGroups={COLUMN_GROUPS}
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

        <CombinePagination
          total={pagination.total}
          limit={pagination.limit}
          offset={pagination.offset}
          onPageChange={handlePageChange}
        />
      </div>

    </div>

  );
}

export default Combine;