// components/ColumnVisibilityControl.jsx
import React, { useState } from 'react';

const ColumnVisibilityControl = ({ columns, visibility, onToggle, onReset }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const visibleCount = Object.values(visibility).filter(v => v === true).length;
    const totalCount = columns.length;
    
    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-2 border rounded-md bg-white hover:bg-gray-50 flex items-center space-x-2"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>Columns</span>
                <span className="text-xs text-gray-500">
                    ({visibleCount}/{totalCount})
                </span>
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-20 border">
                        <div className="p-3 border-b">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Show/Hide Columns</h4>
                                <button
                                    onClick={onReset}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2">
                            {columns.map((column) => (
                                <label
                                    key={column.key}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={visibility[column.key] !== false}
                                        onChange={() => onToggle(column.key)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{column.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ColumnVisibilityControl;