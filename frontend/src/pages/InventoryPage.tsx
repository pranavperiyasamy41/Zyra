import React, { useState, useMemo, useRef, useEffect } from 'react';
import useSWR from 'swr';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api';
import AddMedicineModal from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal';
import toast from 'react-hot-toast'; 
import { Search, Plus, Trash2, Edit2, AlertTriangle, CheckCircle, Calendar, Download, Upload, Package } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const InventoryPage = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  const query = new URLSearchParams({
    page: page.toString(),
    limit: '20',
    search: searchTerm
  });

  const { data: inventoryData, error, mutate } = useSWR(`/medicines?${query.toString()}`, fetcher);
  const medicines = inventoryData?.data || [];
  const pagination = inventoryData?.pagination;

  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [medicineToDelete, setMedicineToDelete] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  // Reset page when search term changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

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
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-md">
        <div className="flex flex-col w-full md:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                <Package className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> INVENTORY
            </h1>
            <div className="flex justify-center md:justify-start gap-2 mt-3 md:mt-4">
                <button 
                  onClick={handleExport} 
                  className="group px-3 sm:px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2 hover:bg-teal-600 hover:text-white transition-all duration-300 active:scale-95"
                >
                    <Download className="w-3 h-3 group-hover:scale-110 transition-transform" /> <span className="hidden sm:inline">Export</span> CSV
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={importing}
                  className="group px-3 sm:px-4 py-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2 hover:bg-emerald-600 hover:text-white transition-all duration-300 active:scale-95 disabled:opacity-50"
                >
                    <Upload className={`w-3 h-3 group-hover:scale-110 transition-transform ${importing ? 'animate-bounce' : ''}`} /> 
                    {importing ? '...' : <><span className="hidden sm:inline">Import</span> Data</>}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImport} accept=".csv" className="hidden" />
            </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-72 group">
                <Search className="absolute left-4 top-3.5 md:top-4 w-4 h-4 text-[#064E48] dark:text-[#CDEB8B] z-10 transition-colors" />
                <input 
                type="text" 
                placeholder="Search name, batch..." 
                className="pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl w-full bg-white dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#064E48]/20 dark:focus:ring-[#CDEB8B]/20 transition-all text-xs md:text-sm font-bold shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
            onClick={() => setIsAddModalOpen(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full sm:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap"
            >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-white" /> 
            <span className="relative z-10 text-white">Add Stock</span>
            </button>
        </div>
      </div>
        
      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[230px] sm:h-[180px] md:h-[140px] w-full"></div>

      {/* CONTENT AREA */}
      <div className="p-4 md:p-8 pt-2 md:pt-4">
        
        {/* DESKTOP TABLE VIEW (Visible on tablet/desktop) */}
        <div className="hidden md:block bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 overflow-x-auto">
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
                    <tr key={med._id} className="group hover:bg-teal-50/50 dark:hover:bg-teal-900/10 transition-colors">
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
                            className="p-2.5 text-teal-600 hover:text-white hover:bg-gradient-to-r hover:from-[#0B5E4A] hover:to-[#1FAE63] rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-teal-500/20"
                            title="Edit"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(med._id)}
                            className="p-2.5 text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-red-500/20"
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

        {/* MOBILE CARD VIEW (Visible on mobile) */}
        <div className="md:hidden space-y-4">
            {filteredMedicines.length > 0 ? filteredMedicines.map((med: any) => {
                const displayStock = med.stock ?? med.quantity ?? 0;
                const displayPrice = med.price ?? med.mrp ?? 0;
                const isExpiring = new Date(med.expiryDate) < new Date(new Date().setDate(new Date().getDate() + 30));

                return (
                    <div key={med._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-black text-slate-900 dark:text-white capitalize text-base truncate pr-16">{med.name}</h3>
                            <div className="flex gap-1.5 absolute top-4 right-4">
                                <button onClick={() => handleEditClick(med)} className="p-2 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-lg active:scale-95 active:bg-[#0B5E4A] active:text-white transition-all"><Edit2 className="w-3.5 h-3.5"/></button>
                                <button onClick={() => handleDelete(med._id)} className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg active:scale-95"><Trash2 className="w-3.5 h-3.5"/></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Batch / Price</p>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded w-fit">{med.batchId || 'N/A'}</span>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(displayPrice)}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock / Expiry</p>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-sm font-black ${displayStock < 10 ? 'text-red-500' : 'text-teal-600'}`}>{displayStock} Units</span>
                                    <span className={`text-[10px] font-bold ${isExpiring ? 'text-orange-500' : 'text-slate-400'}`}>{new Date(med.expiryDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`w-full py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest border ${
                            displayStock < 10 
                            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                        }`}>
                            {displayStock < 10 ? '⚠️ LOW STOCK ALERT' : '✅ STOCK HEALTHY'}
                        </div>
                    </div>
                );
            }) : (
                <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-400 font-bold text-sm">No items found.</p>
                </div>
            )}
        </div>

        {/* PAGINATION CONTROLS */}
        {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 p-4 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl flex justify-between items-center shadow-sm">
                <span className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-2">
                    Page {pagination.page} / {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={pagination.page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 border border-white/10 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Trash2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Item?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                This will permanently remove this item from your inventory. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setMedicineToDelete(null)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-xs uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 rounded-2xl font-black text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all active:scale-95 text-xs uppercase tracking-widest"
                >
                  Confirm
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
