import { useState, useEffect } from 'react';
import { type Medicine, useAllMedicines } from '../hooks/useMedicines';
import { useSalesHistory } from '../hooks/useSales';
import apiClient from '../api';

interface RecordSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

const RecordSaleModal: React.FC<RecordSaleModalProps> = ({ isOpen, onClose, medicine }) => {
  const [quantitySold, setQuantitySold] = useState('1');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutate: mutateInventory } = useAllMedicines();
  const { mutate: mutateSales } = useSalesHistory();

  useEffect(() => {
    if (isOpen) {
      setQuantitySold('1');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!medicine || Number(quantitySold) <= 0) {
      setError('Please enter a valid quantity.');
      setLoading(false);
      return;
    }
    if (Number(quantitySold) > medicine.quantity) {
      setError(`Not enough stock. Only ${medicine.quantity} available.`);
      setLoading(false);
      return;
    }
    try {
      const saleData = {
        itemsSold: [
          {
            medicine: medicine._id,
            medicineName: medicine.name, // <-- It's being sent here
            quantitySold: Number(quantitySold),
            pricePerUnit: medicine.mrp,
          },
        ],
        totalAmount: Number(quantitySold) * medicine.mrp,
      };
      await apiClient.post('/sales', saleData);
      mutateInventory();
      mutateSales();
      setLoading(false);
      onClose();
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to record sale');
    }
  };

  if (!isOpen || !medicine) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800 dark:border dark:border-slate-700">
        <h2 className="mb-6 text-2xl font-bold dark:text-white">Record Sale: {medicine.name}</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-slate-400">
          Available Quantity: {medicine.quantity}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Quantity to Sell</label>
            <input
              type="number"
              name="quantitySold"
              value={quantitySold}
              onChange={(e) => setQuantitySold(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
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
              className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:bg-green-400 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {loading ? 'Recording...' : 'Record Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RecordSaleModal;