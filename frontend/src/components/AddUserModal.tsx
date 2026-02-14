import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { X, Save, User, Store, Mail, MapPin, Smartphone, FileText, Lock, Shield } from 'lucide-react';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, mutate }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    pharmacyName: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    drugLicense: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/admin/users', formData);
      toast.success('User created successfully');
      mutate();
      onClose();
      // Reset Form
      setFormData({
        username: '', email: '', password: '', role: 'user',
        pharmacyName: '', mobile: '', address: '', city: '', state: '', pincode: '', drugLicense: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-2xl scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* HEADER */}
        <div 
          style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
          className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          
          <div className="relative z-10 text-white flex items-center gap-4">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
              <User className="w-6 h-6 text-white" /> 
            </div>
            <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Create New User</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-red-200 transition-all backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900/50">
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Account Info */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Account Credentials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Full Name *</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input name="username" value={formData.username} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Name" required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Email Address *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input name="email" value={formData.email} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Email" required />
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Initial Password *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Password" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Assign Role *</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'user', label: 'Pharmacy Owner', icon: Store, color: 'emerald' },
                                { id: 'admin', label: 'Administrator', icon: Shield, color: 'purple' }
                            ].map((role) => (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.id })}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                                        formData.role === role.id 
                                        ? `border-${role.color}-500 bg-${role.color}-50/50 dark:bg-${role.color}-900/20 shadow-lg shadow-${role.color}-500/10` 
                                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <role.icon className={`w-5 h-5 ${formData.role === role.id ? `text-${role.color}-600 dark:text-${role.color}-400` : 'text-slate-400'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${formData.role === role.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                        {role.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Entity Section */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Pharmacy Details (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Pharmacy Name</label>
                        <div className="relative">
                            <Store className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input name="pharmacyName" value={formData.pharmacyName} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Pharmacy Name" />
                        </div>
                    </div>
                    <div className="space-y-1">
                         <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Mobile Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                            <input name="mobile" value={formData.mobile} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Mobile" />
                        </div>
                    </div>
                </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Drug License</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input name="drugLicense" value={formData.drugLicense} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white font-mono shadow-sm" placeholder="License No" />
                    </div>
                </div>
            </div>

            {/* Address Section */}
             <div className="space-y-4">
                <h3 className="text-xs font-black text-black dark:text-white uppercase tracking-widest border-b border-slate-200 dark:border-slate-700 pb-2 mb-4">Location</h3>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-black dark:text-white ml-1 uppercase tracking-wider">Street Address</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        <input name="address" value={formData.address} onChange={handleChange} className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Address" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <input name="city" value={formData.city} onChange={handleChange} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="City" />
                    <input name="state" value={formData.state} onChange={handleChange} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="State" />
                    <input name="pincode" value={formData.pincode} onChange={handleChange} className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/50 outline-none transition-all dark:text-white shadow-sm" placeholder="Pincode" />
                </div>
            </div>

          </form>
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} type="button" className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors text-sm">
            Cancel
          </button>
          <button 
            form="add-user-form"
            disabled={loading}
            type="submit" 
            className="group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white px-8 py-3 rounded-xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-95 flex items-center gap-2 text-sm"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10 flex items-center gap-2">
                {loading ? 'Creating...' : (
                    <>
                        <Save className="w-4 h-4" /> Create User
                    </>
                )}
            </span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default AddUserModal;