import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
// 🆕 Icons
import { Shield, Receipt, Key, Save } from 'lucide-react';

const SettingsPage = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

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

  // 1. 💾 MAIN SAVE
  const handleConfigUpdate = async () => {
    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        pharmacyName: formData.pharmacyName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        drugLicense: formData.drugLicense,
        pharmacyContact: formData.pharmacyContact
      };
      
      const res = await apiClient.put('/users/profile', payload);

      const token = localStorage.getItem('token');
      if (token) {
        login(token, res.data);
      }

      alert("✅ Configuration Saved Successfully!");
      
    } catch (err: any) {
      console.error("Settings Error:", err);
      alert(`Failed to update: ${err.response?.data?.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  // 2. 🔒 PASSWORD SAVE
  const handlePasswordUpdate = async () => {
    if (!formData.password || !formData.confirmPassword) {
        alert("⚠️ Please enter a new password.");
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    try {
        setPwdLoading(true);

        const payload = {
            ...formData,
            password: formData.password
        };

        await apiClient.put('/users/profile', payload);

        alert("✅ Password Changed Successfully!");
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); 

    } catch (err: any) {
        alert(`Failed to change password: ${err.response?.data?.message || "Server Error"}`);
    } finally {
        setPwdLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800 p-6 md:p-8 transition-all">
         <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight">Settings & Configuration</h1>
      </div>

      <div className="p-6 md:p-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Account & Security */}
          <div className="lg:col-span-1 space-y-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 h-full">
                <h2 className="text-xl font-bold dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" /> Account & Security
                </h2>
                
                {/* Email Section */}
                <div className="mb-8">
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Registered Email</label>
                    <input 
                        className="w-full p-3 bg-gray-100 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed"
                        value={formData.email}
                        readOnly
                    />
                    <p className="text-[10px] text-gray-400 mt-2">To change your email, please contact Super Admin.</p>
                </div>

                {/* Password Section */}
                <div className="pt-6 border-t dark:border-slate-700">
                    <h3 className="text-orange-500 font-bold mb-4 flex items-center gap-2">
                        <Key className="w-4 h-4" /> Update Password
                    </h3>
                    <div className="space-y-4 mb-4">
                        <input 
                            type="password" 
                            placeholder="New Password" 
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-orange-500" 
                            value={formData.password} 
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-lg dark:text-white outline-none focus:ring-2 focus:ring-orange-500" 
                            value={formData.confirmPassword} 
                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                        />
                    </div>
                    <button 
                        onClick={handlePasswordUpdate}
                        disabled={pwdLoading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                    >
                        {pwdLoading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
              </div>
          </div>

          {/* RIGHT COLUMN: Invoice Settings */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-700 text-white h-full">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <Receipt className="w-5 h-5" /> Invoice Configuration
                    </h2>
                    <span className="text-[10px] bg-slate-700 px-2 py-1 rounded text-gray-300">Appears on Bill</span>
                </div>
                
                <div className="space-y-4">
                    {/* Form Fields... (No changes needed to inputs) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Pharmacy Name</label>
                            <input 
                                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none font-bold text-lg"
                                value={formData.pharmacyName}
                                onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 uppercase font-bold block mb-1">Operator Name</label>
                            <input 
                                className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none"
                                value={formData.username}
                                onChange={e => setFormData({...formData, username: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-emerald-500 outline-none h-20 resize-none"
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
                        onClick={handleConfigUpdate} 
                        disabled={loading} 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" /> {loading ? 'Updating System...' : 'Save Configuration'}
                    </button>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SettingsPage;