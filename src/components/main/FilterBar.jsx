// components/FilterBar.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUniqueValues } from '../../stores/main_slice';

const FilterBar = ({ 
    filters, 
    values, 
    onChange, 
    onApply, 
    onReset,
    uniqueValues 
}) => {
    const dispatch = useDispatch();
    const [isExpanded, setIsExpanded] = useState(false);
    const [localValues, setLocalValues] = useState(values || {});
    const [loadingFields, setLoadingFields] = useState({});
    
    // Update local values when props change
    useEffect(() => {
        setLocalValues(values || {});
    }, [values]);
    
    // Load unique values for select fields when expanded or on mount
    useEffect(() => {
        const selectFields = filters.filter(f => f.type === 'select' && f.key !== 'p_s');
        selectFields.forEach(async (field) => {
            if (!uniqueValues[field.key] || uniqueValues[field.key].length === 0) {
                setLoadingFields(prev => ({ ...prev, [field.key]: true }));
                await dispatch(fetchUniqueValues(field.key));
                setLoadingFields(prev => ({ ...prev, [field.key]: false }));
            }
        });
    }, []);
    
    const handleChange = (key, value) => {
        const newValues = { ...localValues, [key]: value || null };
        setLocalValues(newValues);
        onChange(newValues);
    };
    
    const handleRangeChange = (minKey, maxKey, minValue, maxValue) => {
        const newValues = { 
            ...localValues, 
            [minKey]: minValue || null,
            [maxKey]: maxValue || null 
        };
        setLocalValues(newValues);
        onChange(newValues);
    };
    
    const hasActiveFilters = () => {
        return Object.keys(localValues).some(key => {
            const value = localValues[key];
            if (value === null || value === '' || value === undefined) return false;
            if (typeof value === 'object') {
                return Object.values(value).some(v => v !== null && v !== '');
            }
            return true;
        });
    };
    
    const getUniqueOptions = (key) => {
        if (key === 'p_s') return ['Primary', 'Secondary'];
        return uniqueValues[key] || [];
    };
    
    const renderFilterInput = (filter) => {
        switch (filter.type) {
            case 'select':
                if (loadingFields[filter.key]) {
                    return (
                        <div className="w-full px-3 py-2 border rounded-md bg-gray-50">
                            <div className="animate-pulse h-5 bg-gray-200 rounded"></div>
                        </div>
                    );
                }
                return (
                    <select
                        value={localValues[filter.key] || ''}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        {getUniqueOptions(filter.key).map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                );
                
            case 'range':
                const [minKey, maxKey] = filter.fields;
                return (
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            step="any"
                            placeholder={`Min`}
                            value={localValues[minKey] || ''}
                            onChange={(e) => handleRangeChange(minKey, maxKey, e.target.value, localValues[maxKey])}
                            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            step="any"
                            placeholder={`Max`}
                            value={localValues[maxKey] || ''}
                            onChange={(e) => handleRangeChange(minKey, maxKey, localValues[minKey], e.target.value)}
                            className="w-1/2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                );
                
            default:
                return (
                    <input
                        type="text"
                        placeholder={filter.placeholder || `Search...`}
                        value={localValues[filter.key] || ''}
                        onChange={(e) => handleChange(filter.key, e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                );
        }
    };
    
    // Show first 4 filters when collapsed
    const visibleFilters = isExpanded ? filters : filters.slice(0, 4);
    
    return (
        <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
                    <div className="flex space-x-2">
                        {hasActiveFilters() && (
                            <button
                                onClick={onReset}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                            >
                                Reset All
                            </button>
                        )}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            {isExpanded ? 'Show Less' : `Show All (${filters.length})`}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {visibleFilters.map((filter) => (
                        <div key={filter.key} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {filter.label}
                            </label>
                            {renderFilterInput(filter)}
                        </div>
                    ))}
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onReset}
                        className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onApply}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;