import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchTransportData, 
  fetchFilterOptions,
  setFilter,
  clearFilters,
  nextPage,
  prevPage,
  importTransportData,
  clearError
} from '../stores/transport_slice';

import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Plus,
  Eye,
  EyeOff,
  Settings,
  Edit2,
  Save,
  Trash2,
  Columns
} from 'lucide-react';

const Transport = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    items, 
    loading, 
    error, 
    total, 
    filters,
    filterOptions,
    importing,
    importResult
  } = useSelector((state) => state.transport);
  const { limit, currentPage, hasMore } = useSelector((state) => state.transport);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Column definitions
  const allColumns = [
    { id: 'id', label: 'ID', type: 'number', width: '80px', visible: true, filterable: true },
    { id: 'structure_1', label: 'Structure 1', type: 'text', width: '150px', visible: true, filterable: true },
    { id: 'structure_2', label: 'Structure 2', type: 'text', width: '150px', visible: true, filterable: true },
    { id: 'raw_labels', label: 'Raw Labels', type: 'text', width: '150px', visible: false, filterable: true },
    { id: 'mark_name', label: 'Mark Name', type: 'text', width: '120px', visible: true, filterable: true },
    { id: 't_qty', label: 'QTY', type: 'number', width: '80px', visible: true, filterable: true },
    { id: 't_weight', label: 'Weight (kg)', type: 'number', width: '110px', visible: true, filterable: true },
    { id: 't_date', label: 'Date', type: 'date', width: '110px', visible: true, filterable: true },
    { id: 't_status', label: 'Status', type: 'text', width: '110px', visible: true, filterable: true },
    { id: 'proce_qty', label: 'Proc QTY', type: 'number', width: '90px', visible: true, filterable: true },
    { id: 'order_no', label: 'Order No', type: 'text', width: '120px', visible: true, filterable: true },
    { id: 'key', label: 'Key', type: 'text', width: '150px', visible: false, filterable: true },
    { id: 'area', label: 'Area', type: 'text', width: '120px', visible: true, filterable: true },
    { id: 'location', label: 'Location', type: 'text', width: '120px', visible: true, filterable: true }
  ];

  const [columns, setColumns] = useState(allColumns);

  useEffect(() => {
    console.log('first 1 - ', filters)
    dispatch(fetchTransportData({ ...filters, limit }));
    dispatch(fetchFilterOptions());
  }, [dispatch, filters, limit, currentPage]);

  useEffect(() => {
    if (importResult?.successful_imports) {
      setTimeout(() => {
        console.log('first 2- ', filters)
        // dispatch(fetchTransportData({ ...filters, limit }));
      }, 1000);
    }
  }, [importResult, dispatch, filters, limit]);

  const handleFilterChange = (columnId, value) => {
    dispatch(setFilter({ key: columnId, value: value || null }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handleSearch = () => {
    dispatch(setFilter({ key: 'search', value: searchTerm || null }));
  };

  const handleImport = async () => {
    if (window.confirm('Are you sure you want to import transport data? This may take a few minutes.')) {
      await dispatch(importTransportData());
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      dispatch(nextPage());
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      dispatch(prevPage());
    }
  };

  const goToPage = (page) => {
    const targetPage = Math.max(0, Math.min(page, Math.ceil(total / limit) - 1));
    const offset = targetPage * limit;
    dispatch(setFilter({ key: 'offset', value: offset }));
    dispatch(setFilter({ key: 'currentPage', value: targetPage }));
  };

  const toggleColumn = (columnId) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const handleEdit = (row) => {
    setEditingRow(row.id);
    setEditedData({ ...row });
  };

  const handleSave = async () => {
    // Here you'll call your update API
    console.log('Saving:', editedData);
    setEditingRow(null);
    setEditedData({});
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedData({});
  };

  const handleInputChange = (columnId, value) => {
    setEditedData({ ...editedData, [columnId]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '';
    return num;
  };

  const formatDisplayNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString();
  };

  const getFilterInput = (column) => {
    const value = filters[column.id] || '';
    
    if (column.type === 'date') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
        />
      );
    } else if (column.type === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          placeholder="Filter..."
        />
      );
    } else {
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleFilterChange(column.id, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
          placeholder="Filter..."
        />
      );
    }
  };

  const renderCell = (column, row) => {
    if (editingRow === row.id) {
      if (column.type === 'date') {
        return (
          <input
            type="date"
            value={formatDate(editedData[column.id])}
            onChange={(e) => handleInputChange(column.id, e.target.value)}
            className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        );
      } else if (column.type === 'number') {
        return (
          <input
            type="number"
            value={formatNumber(editedData[column.id])}
            onChange={(e) => handleInputChange(column.id, e.target.value)}
            className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        );
      } else {
        return (
          <input
            type="text"
            value={editedData[column.id] || ''}
            onChange={(e) => handleInputChange(column.id, e.target.value)}
            className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
          />
        );
      }
    }
    
    const value = row[column.id];
    
    if (column.id === 't_status') {
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          value === 'completed' ? 'bg-green-100 text-green-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'in_progress' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value || 'N/A'}
        </span>
      );
    }
    
    if (column.id === 't_date') {
      return <span>{formatDisplayDate(value)}</span>;
    }
    
    if (column.type === 'number') {
      return <span>{formatDisplayNumber(value)}</span>;
    }
    
    return <span>{value || '-'}</span>;
  };

  const totalPages = Math.ceil(total / limit);
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage + 2)) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
      pageNumbers.push('...');
    }
  }

  const PaginationComponent = () => (
    <div className="flex justify-start items-center">
     
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        {pageNumbers.map((page, idx) => (
          page === '...' ? (
            <span key={idx} className="px-2 text-gray-500">...</span>
          ) : (
            <button
              key={idx}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {page + 1}
            </button>
          )
        ))}
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
       <div className="text-sm text-gray-600">
        Showing {items.length} of {total.toLocaleString()} records
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SS Management</h1>
              <p className="text-sm text-gray-500 mt-1">Transport page</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Columns size={18} />
                  <span>Columns</span>
                </button>
                {showColumnMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-2">
                      <div className="px-3 py-2 text-sm font-semibold text-gray-700 border-b">
                        Toggle Columns
                      </div>
                      {columns.map(col => (
                        <button
                          key={col.id}
                          onClick={() => toggleColumn(col.id)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          <span className="text-sm">{col.label}</span>
                          {col.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => {/* Open add modal */}}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Add New</span>
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {importing ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                <span>{importing ? 'Importing...' : 'Import'}</span>
              </button>
            </div>
          </div>

          {/* Import/Error Alerts */}
          {importResult && (
            <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 text-sm ${
              importResult.successful_imports > 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'
            }`}>
              {importResult.successful_imports > 0 ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>Imported {importResult.successful_imports.toLocaleString()} rows. Failed: {importResult.failed_rows}</span>
              <button onClick={() => dispatch(importTransportData.fulfilled(null))} className="ml-auto">
                <X size={16} />
              </button>
            </div>
          )}
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-800 rounded-lg flex items-center gap-2 text-sm">
              <AlertCircle size={18} />
              <span>{typeof error === 'string' ? error : 'An error occurred'}</span>
              <button onClick={() => dispatch(clearError())} className="ml-auto">
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Top Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <PaginationComponent />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {columns.filter(col => col.visible).map(column => (
                    <th
                      key={column.id}
                      style={{ minWidth: column.width }}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50">
                    Actions
                  </th>
                </tr>
                {/* Filter Row */}
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.filter(col => col.visible && col.filterable).map(column => (
                    <th key={`filter-${column.id}`} className="px-3 py-2">
                      {getFilterInput(column)}
                    </th>
                  ))}
                  <th className="px-3 py-2 sticky right-0 bg-gray-50">
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.filter(c => c.visible).length + 1} className="px-4 py-12 text-center">
                      <Loader2 size={32} className="animate-spin mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-500">Loading...</p>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={columns.filter(c => c.visible).length + 1} className="px-4 py-12 text-center">
                      <p className="text-gray-500">No records found</p>
                    </td>
                  </tr>
                ) : (
                  items.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      {columns.filter(col => col.visible).map(column => (
                        <td key={`${row.id}-${column.id}`} className="px-3 py-2 text-xs text-gray-900">
                          {renderCell(column, row)}
                        </td>
                      ))}
                      <td className="px-3 py-2 sticky right-0 bg-white shadow-left">
                        {editingRow === row.id ? (
                          <div className="flex gap-1">
                            <button
                              onClick={handleSave}
                              className="p-1 text-green-600 hover:text-green-800"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEdit(row)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => {/* Delete */}}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <PaginationComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transport;