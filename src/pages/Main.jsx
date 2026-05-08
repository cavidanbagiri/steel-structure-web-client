// pages/Main.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchMainData, 
    fetchUniqueValues,
    fetchStatistics,
    setFilters, 
    resetFilters, 
    setPagination,
    toggleColumn,
    resetColumnVisibility,
    selectMainData,
    selectMainLoading,
    selectMainError,
    selectMainPagination,
    selectMainFilters,
    selectMainStatistics,
    selectColumnVisibility
} from '../stores/main_slice';

import Table from '../components/main/Table';
import Pagination from '../components/main/Pagination';
import ColumnVisibilityControl from '../components/main/ColumnVisibilityControl';
import StatisticsCards from '../components/main/StatisticsCards';

function Main() {
    const dispatch = useDispatch();
    
    // Selectors
    const data = useSelector(selectMainData);
    const loading = useSelector(selectMainLoading);
    const error = useSelector(selectMainError);
    const pagination = useSelector(selectMainPagination);
    const filters = useSelector(selectMainFilters);
    const statistics = useSelector(selectMainStatistics);
    const columnVisibility = useSelector(selectColumnVisibility);
    const uniqueValues = useSelector(state => state.main.uniqueValues);
    
    // Local state for table filters
    const [tableFilters, setTableFilters] = useState({});
    const isInitialMount = useRef(true);
    const debounceTimer = useRef(null);
    
    // Define columns with filter configurations
    const columns = [
        { key: 'id', label: 'ID', sortable: true, type: 'number', filterType: 'number' },
        { key: 'area', label: 'Area', sortable: true, type: 'text', filterType: 'select', options: uniqueValues.area || [] },
        { key: 'zone', label: 'Zone', sortable: true, type: 'text', filterType: 'select', options: uniqueValues.zone || [] },
        { key: 'key', label: 'Key', sortable: true, type: 'text', filterType: 'text' },
        { key: 'row_labels', label: 'Row Labels', sortable: true, type: 'text', filterType: 'text' },
        { key: 'item', label: 'Item', sortable: true, type: 'text', filterType: 'text' },
        { key: 'p_s', label: 'P/S', sortable: true, type: 'text', filterType: 'select', options: ['Primary', 'Secondary'] },
        { key: 'qty', label: 'Quantity', sortable: true, type: 'number', filterType: 'range' },
        { key: 'description', label: 'Description', sortable: true, type: 'text', filterType: 'text' },
        { key: 'section', label: 'Section', sortable: true, type: 'text', filterType: 'text' },
        { key: 'length', label: 'Length (mm)', sortable: true, type: 'number', filterType: 'range' },
        { key: 'weight', label: 'Weight (kg)', sortable: true, type: 'number', filterType: 'range' },
        { key: 'weight_total', label: 'Total Weight (kg)', sortable: true, type: 'number', filterType: 'range' },
        { key: 'dwgn', label: 'Drawing No.', sortable: true, type: 'text', filterType: 'text' }
    ];
    
    // Load data function - wrap with useCallback to prevent recreation
    const loadData = useCallback(() => {
      console.log('here worked')
        const params = {
            ...filters,
            limit: pagination.limit,
            offset: pagination.offset
        };
        dispatch(fetchMainData(params));
    }, [dispatch, filters, pagination.limit, pagination.offset]);
    useEffect(() => {
    loadData();
}, []); // Empty array - only once
    
    // Load statistics only once on mount
    useEffect(() => {
        dispatch(fetchStatistics());
    }, [dispatch]);
    
    // Load unique values only once on mount
    useEffect(() => {
        const loadUniqueValues = async () => {
            const selectColumns = ['area', 'zone'];
            for (const column of selectColumns) {
                if (!uniqueValues[column] || uniqueValues[column].length === 0) {
                    dispatch(fetchUniqueValues(column));
                }
            }
        };
        loadUniqueValues();
    }, [dispatch]); // Empty dependency array - only run once
    
    // Load data when filters or pagination change (but not on initial mount)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            loadData();
        } else {
            loadData();
        }
    }, [loadData]); // Only depend on loadData function
    
    // Handle filter changes with debounce
    const handleFilterChange = (newFilters) => {
        setTableFilters(newFilters);
        
        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        // Set new timer
        debounceTimer.current = setTimeout(() => {
            // Convert table filters to backend format
            const backendFilters = {};
            
            Object.keys(newFilters).forEach(key => {
                const value = newFilters[key];
                if (value !== null && value !== '' && value !== undefined) {
                    // Handle range filters (min_qty, max_qty, etc.)
                    if (key.startsWith('min_') || key.startsWith('max_')) {
                        backendFilters[key] = value;
                    } else {
                        backendFilters[key] = value;
                    }
                }
            });
            
            dispatch(setFilters(backendFilters));
        }, 500);
    };
    
    const handlePageChange = (newOffset) => {
        dispatch(setPagination({ offset: newOffset }));
    };
    
    const handleLimitChange = (newLimit) => {
        dispatch(setPagination({ limit: newLimit, offset: 0 }));
    };
    
    const handleSort = (column, direction) => {
        dispatch(setFilters({ 
            order_by: column.key, 
            order_direction: direction 
        }));
    };
    
    const handleResetFilters = () => {
        setTableFilters({});
        dispatch(resetFilters());
    };
    
    // Cleanup debounce timer
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);
    
    if (loading && data.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                Error: {JSON.stringify(error)}
            </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 py-6">
            {/* Page Title */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Main Data Management</h1>
                    <p className="text-gray-600">View and manage main data records</p>
                </div>
                <div className="flex space-x-2">
                    {/* Reset Filters Button */}
                    {(Object.keys(filters).some(key => filters[key] !== null && filters[key] !== '')) && (
                        <button
                            onClick={handleResetFilters}
                            className="px-3 py-2 text-sm text-red-600 hover:text-red-800 border rounded-md hover:bg-red-50"
                        >
                            Clear All Filters
                        </button>
                    )}
                    {/* Column Visibility Control */}
                    <ColumnVisibilityControl 
                        columns={columns}
                        visibility={columnVisibility}
                        onToggle={(columnKey) => dispatch(toggleColumn(columnKey))}
                        onReset={() => dispatch(resetColumnVisibility())}
                    />
                </div>
            </div>
            
            {/* Statistics Cards */}
            {statistics && (
                <StatisticsCards statistics={statistics} />
            )}
            
            {/* Top Pagination */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Showing {data.length} of {pagination.total} records
                </div>
                <Pagination 
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>
            
            {/* Main Table with Filters in Header */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table 
                    columns={columns}
                    data={data}
                    loading={loading}
                    columnVisibility={columnVisibility}
                    onSort={handleSort}
                    onFilter={handleFilterChange}
                    filters={tableFilters}
                    sortBy={filters.order_by}
                    sortDirection={filters.order_direction}
                />
            </div>
            
            {/* Bottom Pagination */}
            <div className="mt-4 flex justify-end">
                <Pagination 
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                />
            </div>
        </div>
    );
}

export default Main;