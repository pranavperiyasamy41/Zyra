import React, { useState, useEffect } from 'react';
import apiClient from '../api';
import toast from 'react-hot-toast';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  medicine: any; // Using any to handle both stock/quantity flexibility
}

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, onSuccess, medicine }) => {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    stock: '',
    price: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Load medicine data when modal opens
  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        batchNumber: medicine.batchId,
        // ✅ Fix: Check both fields (stock is new, quantity is old)
        stock: medicine.stock !== undefined ? medicine.stock : medicine.quantity,
        price: medicine.price || medicine.mrp,
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : ''
      });
    }
  }, [medicine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put(`/medicines/${medicine._id}`, {
        name: formData.name,
        batchId: formData.batchNumber, // Be careful changing Batch IDs!
        stock: Number(formData.stock), // Send as 'stock'
        mrp: Number(formData.price), 
        expiryDate: formData.expiryDate
      });
      
      toast.success('Medicine Updated!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Medicine</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Name */}
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
             <input 
                className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Batch ID (Read Only) */}
          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">Batch ID</label>
             <input 
                className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-slate-900 text-gray-500 cursor-not-allowed" 
                value={formData.batchNumber}
                readOnly 
                title="Batch IDs cannot be changed"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                <input 
                  type="number" 
                  className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                />
            </div>
            <div className="w-1/2">
                <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                <input 
                  type="number" 
                  className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
            <input 
              type="date" 
              className="w-full p-3 border rounded-lg mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={formData.expiryDate}
              onChange={e => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 font-bold text-sm">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicineModal;