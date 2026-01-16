import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal'; // 👈 IMPORTED

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const InventoryPage = () => {
  const { data: medicines, error, mutate } = useSWR('/medicines', fetcher);
  const [searchParams] = useSearchParams();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // ✅ Edit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // ✅ DELETE FUNCTION
  const handleDelete = async (id: string) => {
    if(window.confirm("Are you sure you want to delete this medicine?")) {
        try {
            await apiClient.delete(`/medicines/${id}`);
            mutate(); // Refresh list
        } catch (err) {
            alert("Failed to delete");
        }
    }
  }

  // ✅ OPEN EDIT MODAL
  const handleEditClick = (med: any) => {
    setSelectedMedicine(med);
    setIsEditModalOpen(true);
  }

  // FILTERING LOGIC
  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];
    let result = medicines;

    const filterType = searchParams.get('filter');
    if (filterType === 'low-stock') {
      result = result.filter((m: any) => (m.stock || m.quantity || 0) <= 10);
    } else if (filterType === 'expiring') {
      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);
      result = result.filter((m: any) => {
        const d = new Date(m.expiryDate);
        return d > today && d <= thirtyDays;
      });
    }

    if (searchTerm) {
      result = result.filter((m: any) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (m.batchId && m.batchId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return result;
  }, [medicines, searchTerm, searchParams]);

  if (error) return <div className="p-8 text-red-500 font-bold">Failed to load inventory. Check Backend.</div>;

  return (
    <div className="p-8">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">INVENTORY</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="🔍 Search name or batch..." 
            className="p-2 border rounded-lg w-full md:w-64 dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all whitespace-nowrap"
          >
            + Add Stock
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Medicine Name</th>
              <th className="p-4">Batch ID</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
              {/* ✅ ADDED MISSING HEADER */}
              <th className="p-4 text-center">Actions</th> 
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredMedicines.length > 0 ? filteredMedicines.map((med: any) => {
              const displayStock = med.stock ?? med.quantity ?? 0;
              const displayPrice = med.price ?? med.mrp ?? 0;
              const isExpiring = new Date(med.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 30));

              return (
                <tr key={med._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-bold dark:text-white capitalize">{med.name}</td>
                  <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-600">
                        {med.batchId || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 dark:text-gray-300 font-mono font-bold">{displayStock}</td>
                  <td className="p-4 dark:text-gray-300 font-bold text-green-600">₹{displayPrice}</td>
                  <td className={`p-4 font-medium ${isExpiring ? 'text-red-500' : 'dark:text-gray-300'}`}>
                    {new Date(med.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${displayStock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {displayStock < 10 ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                  
                  {/* ✅ ADDED ACTIONS COLUMN */}
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                        onClick={() => handleEditClick(med)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded dark:hover:bg-slate-700 transition"
                        title="Edit"
                    >
                        ✏️
                    </button>
                    <button 
                        onClick={() => handleDelete(med._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded dark:hover:bg-slate-700 transition"
                        title="Delete"
                    >
                        🗑️
                    </button>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400">No medicines found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS */}
      <AddMedicineModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => mutate()} 
      />

      {/* ✅ CONNECTED EDIT MODAL */}
      <EditMedicineModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => mutate()}
        medicine={selectedMedicine}
      />
    </div>
  );
};

export default InventoryPage;