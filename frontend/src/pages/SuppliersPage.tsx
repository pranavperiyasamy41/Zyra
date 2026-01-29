import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Truck, Plus, Phone, Mail, MapPin, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SuppliersPage = () => {
  const { data: suppliers, mutate } = useSWR('/suppliers', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', contactPerson: '', email: '', phone: '', address: ''
  });

  const filteredSuppliers = suppliers?.filter((s: any) => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(formData.phone)) {
      return toast.error("Phone number must be exactly 10 digits.");
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address.");
    }

    try {
      if (editingSupplier) {
        await apiClient.put(`/suppliers/${editingSupplier._id}`, formData);
        toast.success("Supplier Updated");
      } else {
        await apiClient.post('/suppliers', formData);
        toast.success("Supplier Added");
      }
      closeModal();
      mutate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Operation Failed");
    }
  };

  const handleDelete = (id: string) => {
    setSupplierToDelete(id);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      await apiClient.delete(`/suppliers/${supplierToDelete}`);
      mutate();
      toast.success("Supplier Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setSupplierToDelete(null);
    }
  };

  const openModal = (supplier?: any) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson || '',
        email: supplier.email || '',
        phone: supplier.phone,
        address: supplier.address || ''
      });
    } else {
      setEditingSupplier(null);
      setFormData({ name: '', contactPerson: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Truck className="w-8 h-8 text-blue-600" /> Suppliers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your supply chain partners.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-72 group">
             <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
             <input 
                type="text" 
                placeholder="Search suppliers..." 
                className="pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm font-medium shadow-sm group-hover:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={() => openModal()}
            className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="w-5 h-5 relative z-10" /> 
            <span className="relative z-10">Add Supplier</span>
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="p-6 md:p-8 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers?.map((s: any) => (
            <div key={s._id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/20 dark:border-slate-800 hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{s.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{s.contactPerson}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={() => openModal(s)} 
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                            title="Edit Supplier"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(s._id)} 
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110 active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            title="Delete Supplier"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                            <Phone className="w-4 h-4" /> 
                        </div>
                        <span className="text-sm font-mono text-slate-600 dark:text-slate-300">{s.phone}</span>
                    </div>
                    {s.email && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <Mail className="w-4 h-4" /> 
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{s.email}</span>
                        </div>
                    )}
                    {s.address && (
                        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                                <MapPin className="w-4 h-4" /> 
                            </div>
                            <span className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{s.address}</span>
                        </div>
                    )}
                </div>
            </div>
        ))}
        
        {filteredSuppliers?.length === 0 && (
            <div className="col-span-full text-center py-20">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">No suppliers found.</p>
            </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-white/20 dark:border-slate-800 animate-in zoom-in-95">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                    {editingSupplier ? 'Edit Supplier' : 'New Supplier'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Company Name</label>
                        <input className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all font-medium" 
                            required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Supplier Name" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Contact Person</label>
                        <input className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all" 
                            value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} placeholder="Name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Phone</label>
                            <input className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all font-mono" 
                                required maxLength={10} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="10-digit" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email</label>
                            <input type="email" className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all" 
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Optional" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Address</label>
                        <textarea className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all h-24 resize-none" 
                            value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Office Address" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={closeModal} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3.5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all active:scale-[0.98]">Save Supplier</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {supplierToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Supplier?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Are you sure you want to remove this supplier? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setSupplierToDelete(null)}
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

export default SuppliersPage;