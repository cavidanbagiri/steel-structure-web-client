import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TransportModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        structure_1: '',
        structure_2: '',
        raw_labels: '',
        mark_name: '',
        t_qty: '',
        t_weight: '',
        t_date: '',
        t_status: '',
        proce_qty: '',
        order_no: '',
        key: '',
        area: '',
        location: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                structure_1: initialData.structure_1 || '',
                structure_2: initialData.structure_2 || '',
                raw_labels: initialData.raw_labels || '',
                mark_name: initialData.mark_name || '',
                t_qty: initialData.t_qty || '',
                t_weight: initialData.t_weight || '',
                t_date: initialData.t_date || '',
                t_status: initialData.t_status || '',
                proce_qty: initialData.proce_qty || '',
                order_no: initialData.order_no || '',
                key: initialData.key || '',
                area: initialData.area || '',
                location: initialData.location || ''
            });
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        // Add any validation rules you need
        if (formData.t_qty && isNaN(formData.t_qty)) {
            newErrors.t_qty = 'Quantity must be a number';
        }
        if (formData.t_weight && isNaN(formData.t_weight)) {
            newErrors.t_weight = 'Weight must be a number';
        }
        if (formData.proce_qty && isNaN(formData.proce_qty)) {
            newErrors.proce_qty = 'Process quantity must be a number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert empty strings to null for numbers
            const submitData = {
                ...formData,
                t_qty: formData.t_qty ? parseFloat(formData.t_qty) : null,
                t_weight: formData.t_weight ? parseFloat(formData.t_weight) : null,
                proce_qty: formData.proce_qty ? parseInt(formData.proce_qty) : null,
                t_date: formData.t_date || null
            };
            await onSave(submitData);
            onClose();
            resetForm();
        }
    };

    const resetForm = () => {
        setFormData({
            structure_1: '',
            structure_2: '',
            raw_labels: '',
            mark_name: '',
            t_qty: '',
            t_weight: '',
            t_date: '',
            t_status: '',
            proce_qty: '',
            order_no: '',
            key: '',
            area: '',
            location: ''
        });
        setErrors({});
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {initialData ? 'Edit Transport' : 'Add New Transport'}
                    </h2>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Structure 1
                            </label>
                            <input
                                type="text"
                                name="structure_1"
                                value={formData.structure_1}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Structure 2
                            </label>
                            <input
                                type="text"
                                name="structure_2"
                                value={formData.structure_2}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Raw Labels
                            </label>
                            <input
                                type="text"
                                name="raw_labels"
                                value={formData.raw_labels}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Mark Name
                            </label>
                            <input
                                type="text"
                                name="mark_name"
                                value={formData.mark_name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="t_qty"
                                value={formData.t_qty}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.t_qty ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.t_qty && (
                                <p className="text-xs text-red-500 mt-1">{errors.t_qty}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="t_weight"
                                value={formData.t_weight}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.t_weight ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.t_weight && (
                                <p className="text-xs text-red-500 mt-1">{errors.t_weight}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="t_date"
                                value={formData.t_date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="t_status"
                                value={formData.t_status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select Status</option>
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Process Quantity
                            </label>
                            <input
                                type="number"
                                name="proce_qty"
                                value={formData.proce_qty}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.proce_qty ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            {errors.proce_qty && (
                                <p className="text-xs text-red-500 mt-1">{errors.proce_qty}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order No
                            </label>
                            <input
                                type="text"
                                name="order_no"
                                value={formData.order_no}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Key
                            </label>
                            <input
                                type="text"
                                name="key"
                                value={formData.key}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Area
                            </label>
                            <input
                                type="text"
                                name="area"
                                value={formData.area}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransportModal;