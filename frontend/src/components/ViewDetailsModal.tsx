import React, { useState } from 'react';
import { type Sale, useSalesHistory } from '../hooks/useSales';
import apiClient from '../api';

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

const ViewDetailsModal: React.FC<ViewDetailsModalProps> = ({ isOpen, onClose, sale }) => {
    if (!isOpen || !sale) return null;
    
    const { customerName, customerId, customerPhone, totalAmount, itemsSold, saleDate } = sale;
    const { mutate } = useSalesHistory(); 

    const [isEditing, setIsEditing] = useState(false);
    // Initialize form data state with current sale data
    const [formData, setFormData] = useState({ 
        customerName: customerName, 
        customerPhone: customerPhone, 
        customerId: customerId 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // --- Delete Logic ---
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete sale ID ${sale.customerId}?`)) return;

        try {
            await apiClient.delete(`/sales/${sale._id}`);
            mutate(); // Refresh the sales list
            onClose();
        } catch (err) {
            setError("Failed to delete record.");
        }
    };

    // --- Edit Logic ---
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            await apiClient.put(`/sales/${sale._id}`, formData);
            mutate(); // Refresh the sales list
            setIsEditing(false); // Exit edit mode
        } catch (err: any) {
             setError(err.response?.data?.message || "Failed to update metadata.");
        } finally {
            setLoading(false);
        }
    };
    
    // Logic to switch between display mode and edit mode
    const customerInfoContent = isEditing ? (
        // --- EDIT MODE (with labels added) ---
        <form onSubmit={handleSave}>
            <div className="mb-2">
                <label className="block text-xs font-semibold dark:text-slate-300 mb-1">Customer Name</label>
                <input type="text" name="customerName" required value={formData.customerName} 
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full rounded-md border p-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
            </div>
            <div className="mb-2">
                <label className="block text-xs font-semibold dark:text-slate-300 mb-1">Phone Number</label>
                <input type="text" name="customerPhone" value={formData.customerPhone} 
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full rounded-md border p-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
            </div>
            <div className="mb-4">
                <label className="block text-xs font-semibold dark:text-slate-300 mb-1">Customer ID</label>
                <input type="text" name="customerId" required value={formData.customerId} 
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full rounded-md border p-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">ID must be unique (100-10000).</p>
            </div>
            
            {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
            
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-gray-500">Cancel</button>
                <button type="submit" disabled={loading} className="text-sm bg-blue-600 text-white rounded-md px-3 py-1">Save</button>
            </div>
        </form>
    ) : (
        // --- DISPLAY MODE (unchanged) ---
        <div className="grid grid-cols-2 gap-y-2 text-sm dark:text-slate-300">
            <div><span className="font-semibold">Customer:</span> {customerName}</div>
            <div><span className="font-semibold">Phone:</span> {customerPhone || 'N/A'}</div>
            <div><span className="font-semibold">Customer ID:</span> {customerId}</div>
            <div><span className="font-semibold">Date:</span> {new Date(saleDate).toLocaleString()}</div>
        </div>
    );
    

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-slate-800 dark:border dark:border-slate-700">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4 dark:border-slate-700">
                    <h2 className="text-xl font-bold dark:text-white">Sale Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-slate-400 text-2xl leading-none">
                        &times;
                    </button>
                </div>

                {/* Customer Info */}
                <div className="mb-6">
                    {customerInfoContent}
                </div>

                {/* Items List */}
                <h3 className="text-lg font-semibold mb-3 dark:text-white border-t pt-3 dark:border-slate-700">Items Purchased</h3>
                <ul className="divide-y divide-gray-200 dark:divide-slate-700 max-h-48 overflow-y-auto mb-4">
                    {itemsSold.map((item, index) => (
                        <li key={index} className="flex justify-between py-2 text-sm">
                            <span className="dark:text-white">{item.medicineName}</span>
                            <span className="text-gray-600 dark:text-slate-400">x{item.quantitySold} @ ${item.pricePerUnit.toFixed(2)}</span>
                        </li>
                    ))}
                </ul>

                {/* Footer / Total */}
                <div className="flex justify-between items-center border-t pt-3 dark:border-slate-700">
                    <span className="text-xl font-bold dark:text-white">Total Cost:</span>
                    <span className="text-xl font-bold text-green-600">${totalAmount.toFixed(2)}</span>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    {!isEditing && (
                        <>
                            <button 
                                onClick={handleDelete}
                                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Delete Sale
                            </button>
                            <button 
                                onClick={() => { setIsEditing(true); setFormData({ customerName, customerPhone, customerId }); setError(null); }}
                                className="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                            >
                                Edit Metadata
                            </button>
                            <button 
                                onClick={onClose}
                                className="rounded-md bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
                            >
                                Close
                            </button>
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ViewDetailsModal;