// components/Table.jsx
import React, { useState } from 'react';

const Table = ({ 
    columns, 
    data, 
    loading, 
    columnVisibility, 
    onSort,
    onFilter,  // New prop for filter changes
    filters,   // Current filter values
    sortBy,
    sortDirection 
}) => {
    const [hoveredRow, setHoveredRow] = useState(null);
    const [localFilters, setLocalFilters] = useState(filters || {});
    
    const handleSort = (column) => {
        if (!column.sortable) return;
        
        let newDirection = 'asc';
        if (sortBy === column.key && sortDirection === 'asc') {
            newDirection = 'desc';
        }
        onSort(column, newDirection);
    };
    
    const handleFilterChange = (columnKey, value) => {
        const newFilters = { ...localFilters, [columnKey]: value || null };
        setLocalFilters(newFilters);
        onFilter(newFilters);
    };
    
    const getSortIcon = (column) => {
        if (!column.sortable) return null;
        if (sortBy !== column.key) {
            return (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };
    
    const formatValue = (value, type) => {
        if (value === null || value === undefined) return '-';
        
        switch (type) {
            case 'number':
                if (typeof value === 'number') {
                    return value.toLocaleString();
                }
                return value;
            case 'date':
                return new Date(value).toLocaleDateString();
            default:
                return value;
        }
    };
    
    const renderFilterInput = (column) => {
        const value = localFilters[column.key] || '';
        
        switch (column.filterType) {
            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="">All</option>
                        {column.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
                
            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        placeholder={`Filter ${column.label}`}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                    />
                );
                
            case 'range':
                return (
                    <div className="flex space-x-1">
                        <input
                            type="number"
                            placeholder="Min"
                            value={localFilters[`min_${column.key}`] || ''}
                            onChange={(e) => handleFilterChange(`min_${column.key}`, e.target.value)}
                            className="w-1/2 px-1 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={localFilters[`max_${column.key}`] || ''}
                            onChange={(e) => handleFilterChange(`max_${column.key}`, e.target.value)}
                            className="w-1/2 px-1 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                );
                
            default:
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        placeholder={`Filter ${column.label}`}
                        className="w-full px-2 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                    />
                );
        }
    };
    
    const visibleColumns = columns.filter(col => columnVisibility[col.key] !== false);
    
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {/* Main Header Row - Column Names */}
                    <tr>
                        {visibleColumns.map((column) => (
                            <th
                                key={column.key}
                                onClick={() => handleSort(column)}
                                className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                                }`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>{column.label}</span>
                                    {getSortIcon(column)}
                                </div>
                            </th>
                        ))}
                    </tr>
                    
                    {/* Filter Header Row - Filter inputs under each column */}
                    <tr className="bg-gray-50 border-t border-gray-200">
                        {visibleColumns.map((column) => (
                            <th
                                key={`filter-${column.key}`}
                                className="px-4 py-2"
                            >
                                {renderFilterInput(column)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loading && data.length === 0 ? (
                        <tr>
                            <td colSpan={visibleColumns.length} className="px-6 py-8 text-center">
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500">Loading data...</div>
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={visibleColumns.length} className="px-6 py-8 text-center text-gray-500">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr
                                key={row.id || index}
                                className={`hover:bg-gray-50 transition-colors ${
                                    hoveredRow === index ? 'bg-gray-50' : ''
                                }`}
                                onMouseEnter={() => setHoveredRow(index)}
                                onMouseLeave={() => setHoveredRow(null)}
                            >
                                {visibleColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                    >
                                        {formatValue(row[column.key], column.type)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;