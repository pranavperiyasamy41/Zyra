import React, { useState } from 'react';
import apiClient from '../api';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    barcode: '', // 👈 NEW STATE
    batchNumber: '',
    quantity: '',
    price: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.post('/medicines', {
        name: formData.name,
        barcode: formData.barcode, // Send Barcode
        batchNumber: formData.batchNumber,
        stock: Number(formData.quantity),
        price: Number(formData.price),
        expiryDate: formData.expiryDate
      });
      
      alert('✅ Stock Added Successfully!');
      setFormData({ name: '', barcode: '', batchNumber: '', quantity: '', price: '', expiryDate: '' });
      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-slate-700">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Add Inventory</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* MEDICINE NAME */}
          <input 
            className="p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Medicine Name (e.g. Dolo 650)" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />

          {/* 🔫 BARCODE INPUT */}
          <div className="relative">
            <input 
                className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none pl-10" 
                placeholder="Scan Barcode (Optional)" 
                value={formData.barcode}
                onChange={e => setFormData({...formData, barcode: e.target.value})}
                autoFocus // Ready to scan!
            />
            <span className="absolute left-3 top-3.5 text-lg">🔫</span>
          </div>

          {/* BATCH NUMBER */}
          <div className="relative">
            <input 
                className="w-full p-3 border rounded-lg dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Batch ID (Optional)" 
                value={formData.batchNumber}
                onChange={e => setFormData({...formData, batchNumber: e.target.value})}
            />
            <span className="absolute right-3 top-3.5 text-xs text-gray-400">
                {formData.batchNumber ? 'Manual' : 'Auto'}
            </span>
          </div>

          <div className="flex gap-4">
            <input 
              type="number" 
              className="p-3 border rounded-lg w-1/2 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Qty" 
              required
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
            <input 
              type="number" 
              className="p-3 border rounded-lg w-1/2 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="MRP ($)" 
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Expiry Date</label>
            <input 
              type="date" 
              className="w-full p-3 border rounded-lg mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none" 
              required
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
              {loading ? 'Adding...' : 'Save Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;