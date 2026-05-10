import React, { useState, useEffect } from 'react';

import MainService from '../../services/MainService';

const Icons = {
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Loader: () => (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  Building: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <line x1="9" y1="6" x2="9" y2="6.01" />
      <line x1="15" y1="6" x2="15" y2="6.01" />
      <line x1="9" y1="10" x2="9" y2="10.01" />
      <line x1="15" y1="10" x2="15" y2="10.01" />
      <line x1="9" y1="14" x2="9" y2="14.01" />
      <line x1="15" y1="14" x2="15" y2="14.01" />
      <line x1="9" y1="22" x2="9" y2="18" />
      <line x1="15" y1="22" x2="15" y2="18" />
    </svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Edit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Copy: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

// Field definitions for different modes
const getFieldConfig = (mode) => {
  const readOnlyFields = ['id', 'area', 'zone', 'key', 'row_labels', 'item', 'p_s', 'qty', 'description', 'section', 'length', 'weight', 'weight_total', 'dwgn'];

  switch (mode) {
    case 'view':
      return readOnlyFields.map(f => ({ key: f, editable: false }));
    case 'edit':
      return readOnlyFields.map(f => ({
        key: f,
        editable: !['id'].includes(f) // All fields editable except ID
      }));
    case 'duplicate':
      return readOnlyFields.map(f => ({
        key: f,
        editable: !['id'].includes(f) // Same as edit, but ID will be cleared
      }));
    case 'transport':
    case 'erected':
      // Show summary fields as read-only + quantity input
      return [
        { key: 'id', editable: false },
        { key: 'item', editable: false },
        { key: 'description', editable: false },
        { key: 'dwgn', editable: false },
        { key: 'section', editable: false },
        { key: 'qty', editable: false },
      ];
    default:
      return [];
  }
};

// Mode-specific config
const modeConfig = {
  view: {
    title: 'View Details',
    icon: <Icons.Eye />,
    iconBg: 'bg-blue-100 text-blue-600',
    showQuantityInput: false,
    showForm: true,
    submitLabel: null,
    submitBg: null,
  },
  edit: {
    title: 'Edit Item',
    icon: <Icons.Edit />,
    iconBg: 'bg-amber-100 text-amber-600',
    showQuantityInput: false,
    showForm: true,
    submitLabel: 'Save Changes',
    submitBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  },
  duplicate: {
    title: 'Duplicate Item',
    icon: <Icons.Copy />,
    iconBg: 'bg-purple-100 text-purple-600',
    showQuantityInput: false,
    showForm: true,
    submitLabel: 'Create Copy',
    submitBg: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
  },
  transport: {
    title: 'Transport Item',
    icon: <Icons.Package />,
    iconBg: 'bg-green-100 text-green-600',
    showQuantityInput: true,
    showForm: false,
    submitLabel: 'Submit Transport',
    submitBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  },
  erected: {
    title: 'Mark as Erected',
    icon: <Icons.Building />,
    iconBg: 'bg-indigo-100 text-indigo-600',
    showQuantityInput: true,
    showForm: false,
    submitLabel: 'Submit Erected',
    submitBg: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
  },
};

function MainDetailModal({ mode, rowId, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [formData, setFormData] = useState({});
  const [quantity, setQuantity] = useState('');
  const [transportStatus, setTransportStatus] = useState('');        // ADD
  const [transportOrderNo, setTransportOrderNo] = useState('');      // ADD
  const [transportArea, setTransportArea] = useState('');            // ADD
  const [transportLocation, setTransportLocation] = useState('');    // ADD
  const [error, setError] = useState(null);

  const config = modeConfig[mode] || modeConfig.view;
  const fields = getFieldConfig(mode);

  // Fetch row data when modal opens
  useEffect(() => {
    if (isOpen && rowId) {
      fetchRowData();
    } else {
      // Reset state when modal closes
      setRowData(null);
      setFormData({});
      setQuantity('');
      setTransportStatus('');        // ADD
      setTransportOrderNo('');       // ADD
      setTransportArea('');          // ADD
      setTransportLocation('');      // ADD
      setError(null);
    }
  }, [isOpen, rowId]);

  const fetchRowData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await MainService.fetchRowById(rowId);

      if (response.success && response.data) {
        const data = response.data;
        setRowData(data);

        if (mode === 'duplicate') {
          setFormData({ ...data, id: '' });
        } else {
          setFormData(data);
        }
      } else {
        setError('Failed to load item details.');
      }
    } catch (err) {
      const errorMessage = err?.detail || err?.message || 'Failed to load item details. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  


  const handleSubmit = async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setError(null);

      try {
        if (mode === 'transport') {
          if (!quantity || Number(quantity) <= 0) {
            setError('Please enter a valid quantity greater than 0.');
            setSubmitting(false);
            return;
          }

          // Get user ID from localStorage
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const userId = user.id || null;

          const transportData = {
            row_id: rowId,
            qty: Number(quantity),
            status: transportStatus || null,
            order_no: transportOrderNo || null,
            area: transportArea || null,
            location: transportLocation || null,
            created_by: userId,
          };

          const response = await MainService.insertToTransport(transportData);
          
          if (response.success) {
            onSuccess && onSuccess();  // Trigger data refresh in parent
            onClose();
          } else {
            setError('Failed to submit transport. Please try again.');
          }
        } else if (mode === 'erected') {
          if (!quantity || Number(quantity) <= 0) {
            setError('Please enter a valid quantity greater than 0.');
            setSubmitting(false);
            return;
          }

          // TODO: Replace with actual erected API call when ready
          console.log('Submitting erected:', { rowId, quantity: Number(quantity) });
          await new Promise(resolve => setTimeout(resolve, 800));
          onSuccess && onSuccess();
          onClose();
        } else {
          // Edit / Duplicate modes
          // TODO: Replace with actual API call when ready
          await new Promise(resolve => setTimeout(resolve, 800));
          onSuccess && onSuccess();
          onClose();
        }
      } catch (err) {
        const errorMessage = err?.detail || err?.message || 'Failed to submit. Please try again.';
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    };








  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
              <p className="text-xs text-gray-500">Item ID: {rowId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={submitting}
          >
            <Icons.Close />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <span className="text-indigo-400"><Icons.Loader /></span>
              <span className="text-gray-500 text-sm">Loading item details...</span>
            </div>
          ) : error && !rowData ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <Icons.Alert />
              </div>
              <span className="text-gray-700 text-sm">{error}</span>
              <button
                onClick={fetchRowData}
                className="mt-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Item Summary Card (for transport/erected modes) */}
              {(mode === 'transport' || mode === 'erected') && rowData && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Item Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span className="text-xs text-gray-400">Item</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.item || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Area</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.area || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Zone</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.zone || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Key</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.key || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Row Label</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.row_labels || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Section</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.section || '—'}</p>
                    </div>
                    {/* <div>
                      <span className="text-xs text-gray-400">Drawing</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.dwgn || '—'}</p>
                    </div> */}
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400">Description</span>
                      <p className="text-sm font-medium text-gray-900">{rowData.description || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Available Qty</span>
                      <p className="text-sm font-semibold text-gray-900">{rowData.qty || 0}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Available Qty</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {rowData.left_over_qty != null ? rowData.left_over_qty : rowData.qty || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity Input (for transport/erected) */}
              {/* Quantity Input + Transport Fields (for transport/erected) */}
              {(mode === 'transport' || mode === 'erected') && (
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Quantity to {mode === 'transport' ? 'Transport' : 'Mark as Erected'}
                      <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity..."
                      min="1"
                      max={rowData?.qty || undefined}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                      required
                    />
                    {rowData && Number(quantity) > rowData.qty && (
                      <p className="mt-1 text-xs text-amber-600">
                        Quantity exceeds available amount ({rowData.qty})
                      </p>
                    )}
                  </div>

                  {/* Transport-specific fields */}
                  {mode === 'transport' && (
                    <>
                      {/* Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Status
                        </label>
                        <select
                          value={transportStatus}
                          onChange={(e) => setTransportStatus(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow bg-white"
                        >
                          <option value="">— Select Status —</option>
                          <option value="With Order">With Order</option>
                        </select>
                      </div>

                      {/* Order No */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Order No
                        </label>
                        <input
                          type="text"
                          value={transportOrderNo}
                          onChange={(e) => setTransportOrderNo(e.target.value)}
                          placeholder="Enter order number..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        />
                      </div>

                      {/* Area */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Area
                        </label>
                        <input
                          type="text"
                          value={transportArea}
                          onChange={(e) => setTransportArea(e.target.value)}
                          placeholder="Enter area..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        />
                      </div>

                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Location
                        </label>
                        <input
                          type="text"
                          value={transportLocation}
                          onChange={(e) => setTransportLocation(e.target.value)}
                          placeholder="Enter location..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Full Form Fields (for view/edit/duplicate) */}
              {config.showForm && rowData && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {fields.map(({ key, editable }) => {
                    const value = formData[key];
                    const label = ALL_COLUMNS.find(c => c.key === key)?.label || key;

                    if (!editable) {
                      return (
                        <div key={key} className={key === 'description' || key === 'dwgn' ? 'col-span-2' : ''}>
                          <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                          <p className="text-sm text-gray-900 py-2 border-b border-gray-100">
                            {formatValue(value)}
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div key={key} className={key === 'description' || key === 'dwgn' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                        <input
                          type="text"
                          value={value ?? ''}
                          onChange={(e) => handleFieldChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                          disabled={mode === 'view'}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Error message */}
              {error && rowData && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
                  <Icons.Alert />
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!loading && rowData && (mode !== 'view') && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={submitting}
              className={`px-5 py-2 text-sm font-medium text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${config.submitBg}`}
            >
              {submitting && <Icons.Loader />}
              {submitting ? 'Submitting...' : config.submitLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Need ALL_COLUMNS for labels - import or define locally
const ALL_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'area', label: 'Area' },
  { key: 'zone', label: 'Zone' },
  { key: 'key', label: 'Key' },
  { key: 'row_labels', label: 'Row Labels' },
  { key: 'item', label: 'Item' },
  { key: 'p_s', label: 'P/S' },
  { key: 'qty', label: 'Qty' },
  { key: 'description', label: 'Description' },
  { key: 'section', label: 'Section' },
  { key: 'length', label: 'Length' },
  { key: 'weight', label: 'Weight' },
  { key: 'weight_total', label: 'Total Weight' },
  { key: 'dwgn', label: 'Drawing' },
];

export default MainDetailModal;