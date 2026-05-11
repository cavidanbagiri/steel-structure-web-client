import React, { useState, useEffect } from 'react';
import TransportService from '../../services/TransportService';

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
  Alert: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const modeConfig = {
  view: {
    title: 'Transport Details',
    icon: <Icons.Eye />,
    iconBg: 'bg-blue-100 text-blue-600',
    editable: false,
  },
  edit: {
    title: 'Edit Transport',
    icon: <Icons.Edit />,
    iconBg: 'bg-amber-100 text-amber-600',
    editable: true,
  },
  erected: {
    title: 'Mark as Erected',
    icon: <Icons.Building />,
    iconBg: 'bg-green-100 text-green-600',
    editable: false,
  },
};

const FIELD_LABELS = {
  id: 'ID',
  structure_1: 'Structure 1',
  structure_2: 'Structure 2',
  raw_labels: 'Raw Labels',
  mark_name: 'Mark Name',
  t_qty: 'Qty',
  t_weight: 'Weight',
  t_date: 'Date',
  t_status: 'Status',
  proce_qty: 'Processed Qty',
  order_no: 'Order No',
  key: 'Key',
  area: 'Area',
  location: 'Location',
};

function TransportDetailModal({ mode = 'view', rowId, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);

  // Erected form state
  const [erectedQty, setErectedQty] = useState('');
  const [altitudeMark1, setAltitudeMark1] = useState('');
  const [altitudeMark2, setAltitudeMark2] = useState('');
  const [axis, setAxis] = useState('');
  const [range, setRange] = useState('');

  const config = modeConfig[mode] || modeConfig.view;

  useEffect(() => {
    if (isOpen && rowId) {
      fetchRowData();
    } else {
      setRowData(null);
      setFormData({});
      setErectedQty('');
      setAltitudeMark1('');
      setAltitudeMark2('');
      setAxis('');
      setRange('');
      setError(null);
    }
  }, [isOpen, rowId, mode]);

  const fetchRowData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await TransportService.fetchTransportById(rowId);

      if (response.success && response?.data) {
        setRowData(response?.data);
        setFormData(response?.data);
      } else {
        setError('Failed to load transport details.');
      }
    } catch (err) {
      const errorMessage = err?.detail || err?.message || 'Failed to load transport details.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleErectedSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!erectedQty || Number(erectedQty) <= 0) {
        setError('Please enter a valid quantity greater than 0.');
        setSubmitting(false);
        return;
      }

      if (Number(erectedQty) > rowData?.t_qty) {
        setError(`Erected quantity cannot exceed transport quantity (${rowData?.t_qty}).`);
        setSubmitting(false);
        return;
      }

      // Get user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id || null;

      const erectedData = {
        transport_id: rowId,
        e_qty: Number(erectedQty),
        altitude_mark_1: altitudeMark1 || null,
        altitude_mark_2: altitudeMark2 || null,
        axis: axis || null,
        range: range || null,
        created_by: userId,
      };

      const response = await TransportService.insertToErected(erectedData);

      if (response.success) {
        onSuccess && onSuccess();
        onClose();
      } else {
        setError('Failed to submit erected record. Please try again.');
      }
    } catch (err) {
      const errorMessage = err?.detail || err?.message || 'Failed to submit erected record.';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual update API when ready
      await new Promise(resolve => setTimeout(resolve, 800));
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err?.detail || err?.message || 'Failed to update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
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

  const editableFields = [
    't_status', 'proce_qty', 'order_no', 'area', 'location'
  ];

  // ==================== ERECTED MODE ====================
  if (mode === 'erected') {
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.iconBg}`}>
                {config.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
                <p className="text-xs text-gray-500">Transport ID: {rowId}</p>
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
                <span className="text-gray-500 text-sm">Loading transport details...</span>
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
              <form onSubmit={handleErectedSubmit} className="space-y-5">
                {/* Transport Info Summary */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Transport Info
                  </h3>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div>
                      <span className="text-xs text-gray-400">Mark Name</span>
                      <p className="text-sm font-medium text-gray-900">{rowData?.mark_name || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Structure</span>
                      <p className="text-sm font-medium text-gray-900">{rowData?.structure_2 || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Available to Erect</span>
                        <p className="text-sm font-semibold text-gray-900">
                          {rowData?.t_leftover_qty != null ? rowData?.t_leftover_qty : rowData?.t_qty || 0}
                        </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400">Area</span>
                      <p className="text-sm font-medium text-gray-900">{rowData?.structure_1 || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* Erected Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Erected Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                       type="number"
                        value={erectedQty}
                        onChange={(e) => setErectedQty(e.target.value)}
                        placeholder="Enter erected quantity..."
                        min="1"
                        max={rowData?.t_leftover_qty || rowData?.t_qty || undefined}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                      required
                    />
                    {rowData && Number(erectedQty) > (rowData?.t_leftover_qty ?? rowData?.t_qty) && (
                      <p className="mt-1 text-xs text-amber-600">
                        Quantity exceeds available amount ({rowData?.t_leftover_qty ?? rowData?.t_qty})
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Altitude Mark 1
                      </label>
                      <input
                        type="text"
                        value={altitudeMark1}
                        onChange={(e) => setAltitudeMark1(e.target.value)}
                        placeholder="Enter altitude mark 1..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Altitude Mark 2
                      </label>
                      <input
                        type="text"
                        value={altitudeMark2}
                        onChange={(e) => setAltitudeMark2(e.target.value)}
                        placeholder="Enter altitude mark 2..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Axis
                      </label>
                      <input
                        type="text"
                        value={axis}
                        onChange={(e) => setAxis(e.target.value)}
                        placeholder="Enter axis..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Range
                      </label>
                      <input
                        type="text"
                        value={range}
                        onChange={(e) => setRange(e.target.value)}
                        placeholder="Enter range..."
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-shadow"
                      />
                    </div>
                  </div>
                </div>

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
          {!loading && rowData && (
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
                onClick={handleErectedSubmit}
                disabled={submitting}
                className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && <Icons.Loader />}
                {submitting ? 'Submitting...' : 'Submit Erected'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== VIEW / EDIT MODE ====================
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
              <p className="text-xs text-gray-500">Transport ID: {rowId}</p>
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
              <span className="text-gray-500 text-sm">Loading transport details...</span>
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
            <form onSubmit={handleEditSubmit}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {Object.keys(FIELD_LABELS).map((key) => {
                  const label = FIELD_LABELS[key];
                  const value = formData[key];
                  const isEditable = config.editable && editableFields.includes(key);

                  if (!isEditable) {
                    return (
                      <div key={key} className={key === 'key' || key === 'structure_2' ? 'col-span-2' : ''}>
                        <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
                        <p className="text-sm text-gray-900 py-2 border-b border-gray-100">
                          {formatValue(value)}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className={key === 'key' || key === 'structure_2' ? 'col-span-2' : ''}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      <input
                        type="text"
                        value={value ?? ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                      />
                    </div>
                  );
                })}
              </div>

              {error && rowData && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mt-4">
                  <Icons.Alert />
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!loading && rowData && config.editable && (
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
              onClick={handleEditSubmit}
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <Icons.Loader />}
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransportDetailModal;