import React, { useState, useEffect } from 'react';
import apiClient from '../api';

// Define the shape of Medicine expected here
interface Medicine {
  _id: string;
  name: string;
  quantity: number;
  price?: number;
  mrp?: number;
  expiryDate: string;
}

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null; // ✅ Accepts the full object or null
  onSuccess: () => void;     // ✅ Added callback
}

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, medicine, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Load medicine data when modal opens
  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        quantity: medicine.quantity,
        price: medicine.price || medicine.mrp || 0,
        // Format date to YYYY-MM-DD for input field
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : ''
      });
    }
  }, [medicine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicine) return;
    setLoading(true);

    try {
      await apiClient.put(`/medicines/${medicine._id}`, {
        name: formData.name,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        expiryDate: formData.expiryDate
      });
      
      alert('✅ Medicine Updated!');
      onSuccess(); // ✅ Trigger Refresh
      onClose();
    } catch (error) {
      alert('Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Medicine</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
            <input 
              className="w-full p-3 border rounded mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="text-xs font-bold text-gray-500 uppercase">Quantity</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                required
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
              />
            </div>
            <div className="w-1/2">
              <label className="text-xs font-bold text-gray-500 uppercase">Price ($)</label>
              <input 
                type="number" 
                className="w-full p-3 border rounded mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
                required
                value={formData.price}
                onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Expiry Date</label>
            <input 
              type="date" 
              className="w-full p-3 border rounded mt-1 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
              required
              value={formData.expiryDate}
              onChange={e => setFormData({...formData, expiryDate: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-300">Cancel</button>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 text-white px-6 py-2 rounded font-bold hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMedicineModal;