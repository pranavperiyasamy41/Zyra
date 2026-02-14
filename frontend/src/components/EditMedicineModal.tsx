import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api';
import toast from 'react-hot-toast';
import PremiumDatePicker from './PremiumDatePicker';
import { X, Save, Pill, Hash, Package, IndianRupee, Calendar, Edit3 } from 'lucide-react';

interface EditMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  medicine: any; 
}

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ isOpen, onClose, onSuccess, medicine }) => {
  const [formData, setFormData] = useState({
    name: '',
    batchNumber: '',
    stock: '',
    price: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Load medicine data when modal opens
  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name,
        batchNumber: medicine.batchId,
        stock: medicine.stock !== undefined ? medicine.stock : medicine.quantity,
        price: medicine.price || medicine.mrp,
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split('T')[0] : ''
      });
    }
  }, [medicine]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put(`/medicines/${medicine._id}`, {
        name: formData.name,
        batchId: formData.batchNumber,
        stock: Number(formData.stock),
        mrp: Number(formData.price), 
        expiryDate: formData.expiryDate
      });
      
      toast.success('Medicine Updated!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !medicine) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-2xl md:rounded-[2.5rem] shadow-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-visible">
        
        {/* Premium Header */}
        <div 
            style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
            className="p-5 md:p-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0 rounded-t-2xl md:rounded-t-[2.5rem]"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 text-white flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                    <Edit3 className="w-5 h-5 md:w-6 md:h-6 text-brand-highlight" />
                </div>
                <div>
                    <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">Edit Medicine</h2>
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase tracking-[0.2em] opacity-80">Update Inventory Details</p>
                </div>
            </div>
            
            <button 
                onClick={onClose}
                className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 active:scale-95"
            >
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900 rounded-b-2xl md:rounded-b-[2.5rem]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            
            {/* Name */}
            <div className="md:col-span-2 relative group">
                <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Medicine Name</label>
                <div className="relative">
                    <Pill className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-colors" />
                    <input 
                        className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="e.g. Paracetamol 500mg"
                    />
                </div>
            </div>

            {/* Batch ID */}
            <div className="relative group opacity-70">
                <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Batch ID (Read Only)</label>
                <div className="relative">
                    <Hash className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5" />
                    <input 
                        className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl text-xs md:text-sm font-mono text-slate-500 cursor-not-allowed" 
                        value={formData.batchNumber}
                        readOnly 
                    />
                </div>
            </div>

            {/* Price */}
            <div className="relative group">
                <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Unit Price (₹)</label>
                <div className="relative">
                    <IndianRupee className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-colors" />
                    <input 
                        type="number" 
                        className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: e.target.value})}
                        required
                        placeholder="0.00"
                    />
                </div>
            </div>

            {/* Stock */}
            <div className="relative group">
                <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Current Stock</label>
                <div className="relative">
                    <Package className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-colors" />
                    <input 
                        type="number" 
                        className="w-full pl-11 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 transition-all" 
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: e.target.value})}
                        required
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Expiry */}
            <div className="md:col-span-2 relative group">
                <label className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Expiry Date</label>
                <PremiumDatePicker 
                    selected={formData.expiryDate}
                    onChange={(date) => setFormData({...formData, expiryDate: date})}
                    placeholder="Select Expiry Date"
                    className="w-full md:max-w-xs"
                />
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button 
                type="button" 
                onClick={onClose} 
                className="w-full sm:flex-1 py-3 md:py-3.5 rounded-xl md:rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-xs md:text-sm uppercase tracking-widest"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:flex-[2] group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white py-3 md:py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide disabled:opacity-50"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Save className="w-4 h-4 md:w-5 md:h-5 relative z-10" /> 
                <span className="relative z-10">{loading ? 'Updating...' : 'Save Updates'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default EditMedicineModal;