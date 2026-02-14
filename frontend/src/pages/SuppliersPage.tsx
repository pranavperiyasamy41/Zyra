import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Truck, Plus, Phone, Mail, MapPin, Edit2, Trash2, Search, AlertTriangle, Building, User, X, Save } from 'lucide-react';

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
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-md">
        <div className="text-center md:text-left w-full md:w-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                <Truck className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Suppliers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm mt-0.5 md:mt-1 font-medium">Manage your supply chain partners.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72 group">
             <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] flex items-center justify-center shadow-lg shadow-[#0B5E4A]/20 transition-all group-focus-within:scale-110 z-10">
                <Search className="w-3.5 h-3.5 text-white" />
             </div>
             <input 
                type="text" 
                placeholder="Search suppliers..." 
                className="pl-12 md:pl-14 pr-4 py-2.5 md:py-3 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-xs md:text-sm font-medium shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button 
            onClick={() => openModal()}
            className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <Plus className="w-4 h-4 md:w-5 md:h-5 relative z-10 text-white" /> 
            <span className="relative z-10 text-white">Add Supplier</span>
          </button>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[180px] sm:h-[160px] md:h-[140px] w-full"></div>

      {/* LIST */}
      <div className="p-4 md:p-8 pt-2 md:pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredSuppliers?.map((s: any) => (
            <div key={s._id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-800 hover:scale-[1.02] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4 md:mb-6">
                    <div className="overflow-hidden">
                        <h3 className="font-black text-base md:text-lg text-slate-900 dark:text-white truncate">{s.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{s.contactPerson}</p>
                    </div>
                    <div className="flex gap-1 md:gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                            onClick={() => openModal(s)} 
                            className="p-2 md:p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg md:rounded-xl transition-all"
                            title="Edit Supplier"
                        >
                            <Edit2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                        <button 
                            onClick={() => handleDelete(s._id)} 
                            className="p-2 md:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg md:rounded-xl transition-all"
                            title="Delete Supplier"
                        >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                    </div>
                </div>
                
                <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center gap-3 p-2.5 md:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <div className="p-1.5 md:p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-lg">
                            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                        </div>
                        <span className="text-xs md:text-sm font-mono text-slate-600 dark:text-slate-300">{s.phone}</span>
                    </div>
                    {s.email && (
                        <div className="flex items-center gap-3 p-2.5 md:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-1.5 md:p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg">
                                <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                            </div>
                            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 truncate">{s.email}</span>
                        </div>
                    )}
                    {s.address && (
                        <div className="flex items-start gap-3 p-2.5 md:p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                            <div className="p-1.5 md:p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg shrink-0">
                                <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                            </div>
                            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">{s.address}</span>
                        </div>
                    )}
                </div>
            </div>
        ))}
        
        {filteredSuppliers?.length === 0 && (
            <div className="col-span-full text-center py-20">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold text-sm">No suppliers found.</p>
            </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-3 md:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Premium Header */}
                <div 
                    style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                    className="p-5 md:p-6 flex justify-between items-center shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10 text-white flex items-center gap-3 md:gap-4">
                        <div className="p-2 md:p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
                            <Truck className="w-5 h-5 md:w-6 md:h-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
                                {editingSupplier ? 'Edit Partner' : 'New Supplier'}
                            </h2>
                        </div>
                    </div>
                    
                    <button 
                        onClick={closeModal}
                        className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-red-200 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto max-h-[80vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        
                        <div className="md:col-span-2 relative group">
                            <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Company Name</label>
                            <div className="relative">
                                <Building className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3 md:top-3.5 group-focus-within:text-teal-500 transition-colors" />
                                <input 
                                    className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                                    required 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    placeholder="Company Name" 
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Contact Person</label>
                            <div className="relative">
                                <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3 md:top-3.5 group-focus-within:text-teal-500 transition-colors" />
                                <input 
                                    className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                                    value={formData.contactPerson} 
                                    onChange={e => setFormData({...formData, contactPerson: e.target.value})} 
                                    placeholder="Contact Person" 
                                />
                            </div>
                        </div>

                        <div className="relative group">
                            <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Phone Number</label>
                            <div className="relative">
                                <Phone className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3 md:top-3.5 group-focus-within:text-teal-500 transition-colors" />
                                <input 
                                    className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                                    required 
                                    maxLength={10} 
                                    value={formData.phone} 
                                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                                    placeholder="Phone Number" 
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 relative group">
                            <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3 md:top-3.5 group-focus-within:text-teal-500 transition-colors" />
                                <input 
                                    type="email" 
                                    className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                                    value={formData.email} 
                                    onChange={e => setFormData({...formData, email: e.target.value})} 
                                    placeholder="Email Address (Optional)" 
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 relative group">
                            <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Office Address</label>
                            <div className="relative">
                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3 md:top-3.5 group-focus-within:text-teal-500 transition-colors" />
                                <textarea 
                                    className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all h-24 resize-none leading-relaxed" 
                                    value={formData.address} 
                                    onChange={e => setFormData({...formData, address: e.target.value})} 
                                    placeholder="Full Office Address" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-6 md:mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button 
                            type="button" 
                            onClick={closeModal} 
                            className="w-full sm:flex-1 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs md:text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="w-full sm:flex-[2] group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <Save className="w-4 h-4 md:w-5 md:h-5 relative z-10" /> 
                            <span className="relative z-10">Save Supplier</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {supplierToDelete && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
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
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/30 transition-all text-sm"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SuppliersPage;