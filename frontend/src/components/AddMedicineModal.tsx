import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api';
import toast from 'react-hot-toast';
import PremiumDatePicker from './PremiumDatePicker';
import { 
  PackagePlus, 
  X, 
  Type, 
  ScanBarcode, 
  Hash, 
  Package, 
  IndianRupee, 
  Calendar 
} from 'lucide-react';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    batchNumber: '',
    quantity: '',
    price: '',
    expiryDate: null as Date | null
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.expiryDate) return toast.error("Please select an expiry date");
    setLoading(true);

    try {
      await apiClient.post('/medicines', {
        name: formData.name,
        barcode: formData.barcode,
        batchNumber: formData.batchNumber,
        stock: Number(formData.quantity),
        price: Number(formData.price),
        expiryDate: formData.expiryDate.toISOString()
      });
      
      toast.success('Stock Added Successfully!');
      setFormData({ name: '', barcode: '', batchNumber: '', quantity: '', price: '', expiryDate: null });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen bg-slate-900/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-md transition-all duration-300">
      <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-visible">
        
        {/* Premium Header */}
        <div 
          style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
          className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden rounded-t-[2.5rem]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 text-white flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
              <PackagePlus className="w-6 h-6 text-yellow-300 fill-yellow-300" /> 
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Add New Stock</h2>
                <p className="text-emerald-100 text-[10px] font-bold tracking-widest opacity-80 uppercase">Inventory Management</p>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-red-200 transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 bg-slate-50 dark:bg-slate-900 rounded-b-[2.5rem]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Medicine Name (Full Width) */}
                <div className="md:col-span-2">
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Medicine Name</label>
                    <div className="relative group">
                        <Type className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 group-hover:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                        <input 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                            placeholder="e.g. Dolo 650" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Barcode */}
                <div>
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Barcode (Optional)</label>
                    <div className="relative group">
                        <ScanBarcode className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 group-hover:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                        <input 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                            placeholder="Scan or Type" 
                            value={formData.barcode}
                            onChange={e => setFormData({...formData, barcode: e.target.value})}
                        />
                    </div>
                </div>

                {/* Batch Number */}
                <div>
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Batch ID</label>
                    <div className="relative group">
                        <Hash className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 group-hover:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                        <input 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                            placeholder="Batch Number" 
                            value={formData.batchNumber}
                            onChange={e => setFormData({...formData, batchNumber: e.target.value})}
                        />
                    </div>
                </div>

                {/* Quantity */}
                <div>
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Initial Stock</label>
                    <div className="relative group">
                        <Package className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 group-hover:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                        <input 
                            type="number" 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                            placeholder="Units" 
                            required
                            min="1"
                            value={formData.quantity}
                            onChange={e => setFormData({...formData, quantity: e.target.value})}
                        />
                    </div>
                </div>

                {/* Price */}
                <div>
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Selling Price (MRP)</label>
                    <div className="relative group">
                        <IndianRupee className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 group-hover:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                        <input 
                            type="number" 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                            placeholder="0.00" 
                            required
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={e => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                </div>

                {/* Expiry Date */}
                <div className="md:col-span-2">
                    <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Expiry Date</label>
                    <PremiumDatePicker 
                        selected={formData.expiryDate}
                        onChange={(date) => setFormData({...formData, expiryDate: date})}
                        placeholder="Select Expiry Date"
                        className="w-full md:max-w-xs"
                    />
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white py-3.5 rounded-2xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    {loading ? 'Adding Stock...' : (
                        <>
                            <PackagePlus className="w-5 h-5" /> Save to Inventory
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddMedicineModal;