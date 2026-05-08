// components/Pagination.jsx
import React from 'react';

const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
    const { total, limit, offset } = pagination;
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    const handlePrevious = () => {
        if (offset > 0) {
            onPageChange(offset - limit);
        }
    };
    
    const handleNext = () => {
        if (offset + limit < total) {
            onPageChange(offset + limit);
        }
    };
    
    const handleLimitChange = (e) => {
        onLimitChange(parseInt(e.target.value));
    };
    
    const handlePageClick = (page) => {
        onPageChange((page - 1) * limit);
    };
    
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };
    
    return (
        <div className="flex items-center space-x-4">
            {/* Limit selector */}
            <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                    value={limit}
                    onChange={handleLimitChange}
                    className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
            </div>
            
            {/* Pagination controls */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePrevious}
                    disabled={offset === 0}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Previous
                </button>
                
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageClick(page)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                            currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : page === '...'
                                ? 'cursor-default border-transparent'
                                : 'hover:bg-gray-50'
                        }`}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={handleNext}
                    disabled={offset + limit >= total}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Next
                </button>
            </div>
            
            {/* Info */}
            <div className="text-sm text-gray-600">
                {offset + 1} - {Math.min(offset + limit, total)} of {total}
            </div>
        </div>
    );
};

export default Pagination;