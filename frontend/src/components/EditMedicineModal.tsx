import { useState, useEffect } from 'react';
import { useAllMedicines, type Medicine } from '../hooks/useMedicines';
import apiClient from '../api';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

const formatToISODate = (dateString: string) => {
  if (!dateString) return '';
  return dateString.split('T')[0];
};

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, medicine }) => {
  const [formData, setFormData] = useState<Partial<Medicine>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutate } = useAllMedicines();

  useEffect(() => {
    if (medicine) {
      setFormData({
        ...medicine,
        expiryDate: formatToISODate(medicine.expiryDate),
      });
    }
  }, [medicine, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!medicine) return;
    try {
      await apiClient.put(`/medicines/${medicine._id}`, formData);
      mutate();
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update medicine');
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">Edit {medicine.name}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Name</label>
              <input
                type="text" name="name" value={formData.name || ''} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Batch ID</label>
              <input
                type="text" name="batchId" value={formData.batchId || ''} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Quantity</label>
              <input
                type="number" name="quantity" value={formData.quantity || ''} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">MRP</label>
              <input
                type="number" step="0.01" name="mrp" value={formData.mrp || ''} onChange={handleChange} required
                className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Expiry Date</label>
              <input
                type="date" name="expiryDate" value={formData.expiryDate || ''} onChange={handleChange} required
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
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditMedicineModal;