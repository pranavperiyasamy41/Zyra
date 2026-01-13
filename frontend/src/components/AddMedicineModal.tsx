import React, { useState } from 'react';
import apiClient from '../api';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // ✅ Added this Prop
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
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
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        expiryDate: formData.expiryDate
      });
      
      alert('✅ Medicine Added!');
      setFormData({ name: '', quantity: '', price: '', expiryDate: '' }); // Reset form
      onSuccess(); // ✅ Trigger the refresh
      onClose();
    } catch (error) {
      alert('Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Stock</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <input 
            className="p-3 border rounded dark:bg-slate-700 dark:text-white dark:border-slate-600" 
            placeholder="Medicine Name" 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />

          <div className="flex gap-4">
            <input 
              type="number" 
              className="p-3 border rounded w-1/2 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
              placeholder="Quantity" 
              required
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
            />
            <input 
              type="number" 
              className="p-3 border rounded w-1/2 dark:bg-slate-700 dark:text-white dark:border-slate-600" 
              placeholder="Price ($)" 
              required
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
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
              className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
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