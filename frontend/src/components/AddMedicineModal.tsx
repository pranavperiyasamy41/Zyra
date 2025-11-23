import { useState } from 'react';
import { useAllMedicines } from '../hooks/useMedicines';
import apiClient from '../api';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mrp, setMrp] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutate } = useAllMedicines();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/medicines', {
        name, batchId,
        quantity: Number(quantity),
        mrp: Number(mrp),
        expiryDate,
      });
      mutate();
      setLoading(false);
      handleClose(); // Call close handler
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to add medicine');
    }
  };
  
  // Clear form on close
  const handleClose = () => {
    setName('');
    setBatchId('');
    setQuantity('');
    setMrp('');
    setExpiryDate('');
    setError(null);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">Add New Medicine</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Batch ID</label>
              <input
                type="text" value={batchId} onChange={(e) => setBatchId(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Quantity</label>
              <input
                type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">MRP</label>
              <input
                type="number" step="0.01" value={mrp} onChange={(e) => setMrp(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Expiry Date</label>
              <input
                type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">{error}</p>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddMedicineModal;