import { useState } from 'react';
import { useAllMedicines, type Medicine } from '../hooks/useMedicines';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal'; 
import ShoppingCartModal from '../components/ShoppingCartModal';// <-- 1. Import the new cart modal
import apiClient from '../api';

const InventoryPage = () => {
  const { medicines, isLoading, isError, mutate } = useAllMedicines();
  
  // --- New State for Cart/Shopping Workflow ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // <-- 2. Add state for the Cart modal
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<Medicine[]>([]);
  
  // --- Search is correct ---
  const [searchTerm, setSearchTerm] = useState('');

  // --- Helper to add/remove items from the cart ---
  const toggleCartItem = (med: Medicine) => {
    // Check if the item is already in the cart
    const isAdded = cart.some(item => item._id === med._id);
    if (isAdded) {
      setCart(cart.filter(item => item._id !== med._id));
    } else {
      // Check if there is stock available before adding
      if (med.quantity > 0) {
        // Add the item, setting its initial quantity to 1 (this will be overridden in the modal)
        setCart([...cart, med]); 
      } else {
        alert(`Cannot add ${med.name}. Stock is 0.`);
      }
    }
  };

  // --- DELETE, EDIT (re-use old logic) ---
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiClient.delete(`/medicines/${id}`);
      mutate();
    } catch (err) {
      console.error(err);
      alert('Failed to delete medicine');
    }
  };

  const handleOpenEditModal = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };
  
  // --- Filtering (is correct) ---
  const filteredMedicines = medicines
    ? medicines.filter(
        (med: Medicine) =>
          med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          med.batchId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // --- New Calculation for total items in cart (correct) ---
  const totalCartItems = cart.length; // Count of unique items in cart

  if (isLoading) return <div className="p-8 dark:text-slate-300">Loading inventory...</div>;
  if (isError) return <div className="p-8 text-red-500">Failed to load inventory</div>;

  return (
    <div className="p-8 relative"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Current Inventory</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          + Add New Medicine
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or batch ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
        />
      </div>

      {/* --- Inventory Table --- */}
      <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Select</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">S.No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Batch ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">MRP</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Expiry Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {filteredMedicines && filteredMedicines.map((med: Medicine, index: number) => (
              <tr key={med._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                {/* --- NEW: CHECKBOX COLUMN --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <input 
                        type="checkbox"
                        checked={cart.some(item => item._id === med._id)}
                        onChange={() => toggleCartItem(med)}
                        disabled={med.quantity === 0}
                        className="rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                    />
                </td>
                {/* --- Existing Columns --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{index + 1}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{med.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{med.batchId}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{med.quantity}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{med.mrp}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                  {new Date(med.expiryDate).toLocaleDateString()}
                </td>
                
                {/* --- RETAINED: ONLY EDIT/DELETE --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleOpenEditModal(med)}
                      className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(med._id)}
                      className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- FLOATING SELL BUTTON --- */}
      {cart.length > 0 && (
          <button
              onClick={() => setIsCartModalOpen(true)} // <-- 3. Open modal on click
              className="fixed bottom-10 right-10 rounded-full bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-xl hover:bg-green-700 transition-transform duration-200"
          >
              Sell {totalCartItems} {totalCartItems === 1 ? 'Item' : 'Items'}
          </button>
      )}


      {/* --- Modals --- */}
      <AddMedicineModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      <EditMedicineModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        medicine={selectedMedicine}
      />
      
      {/* --- NEW: Shopping Cart Modal --- */}
      <ShoppingCartModal 
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        initialCart={cart}
        setInitialCart={setCart}
      />
    </div>
  );
};

export default InventoryPage;