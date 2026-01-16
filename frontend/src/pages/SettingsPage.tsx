import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';

const SettingsPage = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '', 
    pharmacyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Invoice Fields
    address: '',
    city: '',
    state: '',
    pincode: '',
    drugLicense: '',
    pharmacyContact: ''
  });

  // Load User Data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || '',
        pharmacyName: user.pharmacyName || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        drugLicense: user.drugLicense || '',
        pharmacyContact: user.pharmacyContact || ''
      }));
    }
  }, [user]);

  const handleUpdate = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {
        username: formData.username,
        pharmacyName: formData.pharmacyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        drugLicense: formData.drugLicense,
        pharmacyContact: formData.pharmacyContact
      };
      
      if (formData.password) payload.password = formData.password;

      const res = await apiClient.put('/users/profile', payload);

      // ✅ Update Context Immediately
      const token = localStorage.getItem('token');
      if (token) {
        login(token, res.data);
      }

      alert("✅ Settings Updated Successfully!");
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
    } catch (err: any) {
      console.error("Settings Error:", err);
      alert(`Failed to update: ${err.response?.data?.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-8">SETTINGS & CONFIGURATION</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: Profile & Security */}
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
            <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">👤 Operator Profile</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Operator Name</label>
                    <input 
                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Email (Read Only)</label>
                    <input 
                        className="w-full p-3 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-500 cursor-not-allowed"
                        value={formData.email}
                        readOnly
                    />
                </div>
            </div>

            <div className="pt-6 mt-6 border-t dark:border-slate-700">
                <h3 className="text-orange-500 font-bold mb-4 flex items-center gap-2">🔒 Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                        type="password" 
                        placeholder="New Password" 
                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-orange-500" 
                        value={formData.password} 
                        onChange={e => setFormData({...formData, password: e.target.value})} 
                    />
                    <input 
                        type="password" 
                        placeholder="Confirm" 
                        className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-orange-500" 
                        value={formData.confirmPassword} 
                        onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                    />
                </div>
            </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Invoice Settings */}
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-700 text-white">
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">🧾 Invoice Configuration</h2>
                <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-gray-300">Appears on Bill</span>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Pharmacy Name</label>
                    <input 
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none font-bold text-lg"
                        value={formData.pharmacyName}
                        onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Drug License No.</label>
                        <input 
                            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none font-mono"
                            placeholder="DL-123456"
                            value={formData.drugLicense}
                            onChange={e => setFormData({...formData, drugLicense: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Contact Phone</label>
                        <input 
                            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                            placeholder="For Customer Support"
                            value={formData.pharmacyContact}
                            onChange={e => setFormData({...formData, pharmacyContact: e.target.value})}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Street Address</label>
                    <textarea 
                        className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none h-24 resize-none"
                        value={formData.address}
                        onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <input 
                        placeholder="City" 
                        className="p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                     <input 
                        placeholder="State" 
                        className="p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                        value={formData.state}
                        onChange={e => setFormData({...formData, state: e.target.value})}
                    />
                     <input 
                        placeholder="Pincode" 
                        className="p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                        value={formData.pincode}
                        onChange={e => setFormData({...formData, pincode: e.target.value})}
                    />
                </div>

                <button 
                    onClick={handleUpdate} 
                    disabled={loading} 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transform hover:scale-[1.02] transition-all"
                >
                    {loading ? 'Updating System...' : '💾 Save Configuration'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};
export default SettingsPage;