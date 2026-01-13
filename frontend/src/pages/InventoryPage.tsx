import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'react-router-dom'; // ✅ Import to read Dashboard clicks
import apiClient from '../api';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const InventoryPage = () => {
  const { data: medicines, error, mutate } = useSWR('/medicines', fetcher);
  const [searchParams] = useSearchParams(); // Read URL params
  
  // ✅ State for Search & Modals
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ Form State
  const [newItem, setNewItem] = useState({ name: '', stock: '', price: '', expiryDate: '' });

  // ✅ FILTERING LOGIC
  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];
    
    let result = medicines;

    // 1. Check for URL Filter (from Dashboard Clicks)
    const filterType = searchParams.get('filter'); // e.g., ?filter=low-stock
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

    // 2. Apply Search Bar
    if (searchTerm) {
      result = result.filter((m: any) => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return result;
  }, [medicines, searchTerm, searchParams]);

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.stock || !newItem.price || !newItem.expiryDate) {
      alert("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await apiClient.post('/medicines', {
        name: newItem.name,
        stock: Number(newItem.stock),
        price: Number(newItem.price),
        expiryDate: newItem.expiryDate 
      });
      alert("Medicine Added Successfully! ✅");
      setIsModalOpen(false);
      setNewItem({ name: '', stock: '', price: '', expiryDate: '' }); 
      mutate(); 
    } catch (err: any) {
      alert(`Failed to add: ${err.response?.data?.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="p-8 text-red-500">Failed to load inventory. Check Backend.</div>;

  return (
    <div className="p-8">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">INVENTORY</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          {/* ✅ SEARCH BAR */}
          <input 
            type="text" 
            placeholder="🔍 Search medicines..." 
            className="p-2 border rounded-lg w-full md:w-64 dark:bg-slate-800 dark:text-white dark:border-slate-600 outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-all whitespace-nowrap"
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
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredMedicines.length > 0 ? filteredMedicines.map((med: any) => {
              const displayStock = med.stock ?? med.quantity ?? 0;
              const displayPrice = med.price ?? med.mrp ?? 0;
              return (
                <tr key={med._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 font-bold dark:text-white capitalize">{med.name}</td>
                  <td className="p-4 dark:text-gray-300 font-mono">{displayStock} units</td>
                  <td className="p-4 dark:text-gray-300 font-bold text-emerald-500">₹{displayPrice}</td>
                  <td className="p-4 dark:text-gray-300">{new Date(med.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${displayStock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {displayStock < 10 ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={5} className="p-8 text-center text-gray-400">No medicines found matching your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900 p-8 rounded-2xl w-96 border border-slate-700 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">Add New Stock</h2>
            <input placeholder="Name" className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            <div className="flex gap-4 mb-4">
              <input placeholder="Qty" type="number" className="w-1/2 p-3 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
              <input placeholder="Price (₹)" type="number" className="w-1/2 p-3 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
            </div>
            <input type="date" className="w-full p-3 mb-6 bg-slate-800 border border-slate-700 rounded text-white outline-none focus:border-emerald-500" value={newItem.expiryDate} onChange={e => setNewItem({...newItem, expiryDate: e.target.value})} />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 font-bold">Cancel</button>
              <button onClick={handleAddItem} disabled={loading} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-bold shadow-lg">{loading ? 'Adding...' : 'Add Stock'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InventoryPage;