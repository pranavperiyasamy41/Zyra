import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';

const SettingsPage = () => {
  // ✅ FIX: Destructure 'login' so we can update the user session instantly
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || '', 
    pharmacyName: user?.pharmacyName || '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        username: user.username || prev.username,
        pharmacyName: user.pharmacyName || prev.pharmacyName
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
        pharmacyName: formData.pharmacyName
      };
      
      if (formData.password) payload.password = formData.password;

      // 1. Send Update to Backend
      const res = await apiClient.put('/users/profile', payload);

      // 2. ✅ CRITICAL FIX: Update Local Context Immediately
      // We get the fresh user data from backend and update the app state
      const token = localStorage.getItem('token');
      if (token) {
        login(token, res.data); // This updates the sidebar name instantly!
      }

      alert("Profile Updated Successfully! ✅");
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
      <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-8">SETTINGS</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">👤 Profile Information</h2>
          <div className="space-y-6">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Operator Name</label>
              <input 
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Pharmacy Name</label>
              <input 
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 outline-none"
                value={formData.pharmacyName}
                onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
              />
            </div>
            <div className="pt-6 border-t border-slate-700">
               <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">🔒 Security</h3>
               <div className="grid grid-cols-2 gap-4">
                 <input type="password" placeholder="New Password" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-orange-500 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                 <input type="password" placeholder="Confirm Password" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-orange-500 outline-none" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
               </div>
            </div>
            <button onClick={handleUpdate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg mt-4">
              {loading ? 'Saving Changes...' : 'Save Updates'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;