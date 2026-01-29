import React, { useState, useMemo, useRef } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal';
import toast from 'react-hot-toast'; 
import { Search, Plus, Trash2, Edit2, AlertTriangle, CheckCircle, Calendar, Download, Upload, Package } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const InventoryPage = () => {
  const { data: medicines, error, mutate } = useSWR('/medicines', fetcher);
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const handleDelete = (id: string) => {
    setMedicineToDelete(id);
  }

  const confirmDelete = async () => {
    if (!medicineToDelete) return;
    try {
        await apiClient.delete(`/medicines/${medicineToDelete}`);
        mutate(); 
        toast.success("Medicine deleted");
    } catch (err) {
        toast.error("Failed to delete");
    } finally {
        setMedicineToDelete(null);
    }
  }

  const handleExport = () => {
    if (!medicines || medicines.length === 0) return toast.error("No data to export");
    
    const headers = ["Name", "Batch ID", "Barcode", "Stock", "Price", "Expiry Date (YYYY-MM-DD)", "Category"];
    const rows = medicines.map((m: any) => [
        `"${m.name}"`, 
        `"${m.batchId || ''}"`, 
        `"${m.barcode || ''}"`, 
        m.stock || 0, 
        m.mrp || 0, 
        new Date(m.expiryDate).toISOString().split('T')[0],
        `"${m.category || 'General'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const text = event.target?.result as string;
            const lines = text.split('\n').filter(l => l.trim());
            const dataRows = lines.slice(1); // Skip header

            const parsedData = dataRows.map(line => {
                const values = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
                return {
                    name: values[0],
                    batchId: values[1],
                    barcode: values[2],
                    stock: Number(values[3]),
                    mrp: Number(values[4]),
                    expiryDate: values[5],
                    category: values[6]
                };
            }).filter(item => item.name && item.stock >= 0);

            if (parsedData.length === 0) throw new Error("No valid data found in CSV");

            const res = await apiClient.post('/medicines/bulk', parsedData);
            toast.success(res.data.message);
            mutate();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Import failed. Check file format.");
        } finally {
            setImporting(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    reader.readAsText(file);
  };

  const handleEditClick = (med: any) => {
    setSelectedMedicine(med);
    setIsEditModalOpen(true);
  }

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
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
        <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-600" /> INVENTORY
            </h1>
            <div className="flex gap-2.5 mt-4">
                <button 
                  onClick={handleExport} 
                  className="group px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-95 active:translate-y-0 active:shadow-none"
                >
                    <Download className="w-3 h-3 group-hover:scale-110 transition-transform duration-300" /> Export CSV
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={importing}
                  className="group px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:shadow-xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-95 active:translate-y-0 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:hover:bg-white/50 disabled:hover:text-slate-600"
                >
                    <Upload className={`w-3 h-3 group-hover:scale-110 transition-transform duration-300 ${importing ? 'animate-bounce' : ''}`} /> 
                    {importing ? 'Importing...' : 'Import Data'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            </div>
        </div>
        
                <div className="flex gap-4 w-full md:w-auto">
                  {/* Search Input */}
                  <div className="relative w-full md:w-72 group">
                     <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                     <input 
                        type="text" 
                        placeholder="Search name, batch..." 
                        className="pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium shadow-sm group-hover:shadow-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Plus className="w-5 h-5 relative z-10" /> 
                    <span className="relative z-10">Add Stock</span>
                  </button>
                </div>
              </div>
        
              {/* CONTENT AREA */}
              <div className="p-6 md:p-8 pt-4">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-widest sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="p-6">Medicine Name</th>
                        <th className="p-6">Batch ID</th>
                        <th className="p-6">Stock</th>
                        <th className="p-6">Price</th>
                        <th className="p-6">Expiry</th>
                        <th className="p-6">Status</th>
                        <th className="p-6 text-center">Actions</th> 
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                      {filteredMedicines.length > 0 ? filteredMedicines.map((med: any) => {
                        const displayStock = med.stock ?? med.quantity ?? 0;
                        const displayPrice = med.price ?? med.mrp ?? 0;
                        const isExpiring = new Date(med.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 30));
        
                        return (
                          <tr key={med._id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                            <td className="p-6 font-bold text-slate-900 dark:text-white capitalize text-sm">{med.name}</td>
                            
                            <td className="p-6">
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-mono border border-slate-200 dark:border-slate-700">
                                  {med.batchId || 'N/A'}
                              </span>
                            </td>
                            
                            <td className="p-6">
                                <span className={`font-mono font-bold text-sm ${displayStock < 10 ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {displayStock}
                                </span>
                            </td>
                            
                            <td className="p-6 text-slate-700 dark:text-slate-300 font-bold text-sm">
                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(displayPrice)}
                            </td>
                            
                            <td className="p-6">
                                <div className={`flex items-center gap-2 text-xs font-bold ${isExpiring ? 'text-orange-500' : 'text-slate-500'}`}>
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(med.expiryDate).toLocaleDateString()}
                                </div>
                            </td>
                            
                            <td className="p-6">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                                  displayStock < 10 
                                  ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                              }`}>
                                {displayStock < 10 ? <AlertTriangle className="w-3 h-3"/> : <CheckCircle className="w-3 h-3"/>}
                                {displayStock < 10 ? 'Low Stock' : 'In Stock'}
                              </div>
                            </td>
                            
                            <td className="p-6 text-center">
                              <div className="flex justify-center gap-2 transition-all duration-200">
                                <button 
                                    onClick={() => handleEditClick(med)}
                                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                                    title="Edit"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDelete(med._id)}
                                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );              }) : (
                <tr><td colSpan={7} className="p-12 text-center text-slate-400 text-sm font-medium">No medicines found matching your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddMedicineModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => mutate()} 
      />

      <EditMedicineModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={() => mutate()}
        medicine={selectedMedicine}
      />

      {/* Delete Confirmation Modal */}
      {medicineToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Item?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                This will permanently remove <br/> <strong>Inventory Item</strong> from your database.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setMedicineToDelete(null)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all text-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
