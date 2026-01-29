import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Shield, Receipt, Key, Save, Cog, User, MapPin, Phone, Mail, FileText, Lock, CheckCircle, ChevronRight } from 'lucide-react';

const SettingsPage = () => {
  const { user, login } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'invoice'>('account');

  const [formData, setFormData] = useState({
    username: '', 
    pharmacyName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      if (token) login(token, res.data);
      toast.success("Configuration Saved Successfully!");
    } catch (err: any) {
      toast.error(`Failed: ${err.response?.data?.message || "Server Error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!formData.password || !formData.confirmPassword) return toast.error("Please enter a new password.");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match!");

    try {
        setPwdLoading(true);
        const payload = { ...formData, password: formData.password };
        await apiClient.put('/users/profile', payload);
        toast.success("Password Changed Successfully!");
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' })); 
    } catch (err: any) {
        toast.error(`Failed: ${err.response?.data?.message || "Server Error"}`);
    } finally {
        setPwdLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex items-center justify-between transition-all">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <Cog className="w-8 h-8 text-blue-600 animate-spin-slow" /> Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage system preferences.</p>
         </div>
      </div>

      <div className="p-6 md:p-8 pt-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full lg:w-72 flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('account')}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    activeTab === 'account' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                    <Shield className={`w-5 h-5 ${activeTab === 'account' ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'}`} />
                    <span className="font-bold text-sm">Account & Security</span>
                </div>
                {activeTab === 'account' && <ChevronRight className="w-4 h-4" />}
              </button>

              <button 
                onClick={() => setActiveTab('invoice')}
                className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    activeTab === 'invoice' 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-105' 
                    : 'bg-white/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                    <Receipt className={`w-5 h-5 ${activeTab === 'invoice' ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'}`} />
                    <span className="font-bold text-sm">Invoice Settings</span>
                </div>
                {activeTab === 'invoice' && <ChevronRight className="w-4 h-4" />}
              </button>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 h-full relative overflow-hidden">
                
                {/* Account & Security Form */}
                {activeTab === 'account' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Account Security</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Update your password and view account details.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Email Address</label>
                                <div className="relative">
                                    <div className="w-full p-4 pl-12 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 font-mono text-sm flex items-center">
                                        {formData.email}
                                    </div>
                                    <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200 dark:border-slate-700/50">
                                <h3 className="text-orange-500 font-black text-sm uppercase tracking-wide mb-6 flex items-center gap-2">
                                    <Key className="w-4 h-4" /> Change Password
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="relative group">
                                        <input 
                                            type="password" 
                                            placeholder="New Password" 
                                            className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-bold" 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                        />
                                        <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type="password" 
                                            placeholder="Confirm Password" 
                                            className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-bold" 
                                            value={formData.confirmPassword} 
                                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                                        />
                                        <CheckCircle className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-orange-500 transition-colors" />
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePasswordUpdate}
                                    disabled={pwdLoading}
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/30 transition-all active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50"
                                >
                                    {pwdLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Invoice Settings Form */}
                {activeTab === 'invoice' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Invoice Configuration</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">Customize the details that appear on your printed bills.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Pharmacy Name</label>
                                <input 
                                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-black text-lg transition-all focus:ring-2 focus:ring-emerald-500/20"
                                    value={formData.pharmacyName}
                                    onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Operator Name</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-bold transition-all focus:ring-2 focus:ring-emerald-500/20"
                                        value={formData.username}
                                        onChange={e => setFormData({...formData, username: e.target.value})}
                                    />
                                    <User className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Drug License No.</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-mono font-bold transition-all focus:ring-2 focus:ring-emerald-500/20"
                                        value={formData.drugLicense}
                                        onChange={e => setFormData({...formData, drugLicense: e.target.value})}
                                    />
                                    <FileText className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Contact Phone</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-bold transition-all focus:ring-2 focus:ring-emerald-500/20"
                                        value={formData.pharmacyContact}
                                        onChange={e => setFormData({...formData, pharmacyContact: e.target.value})}
                                    />
                                    <Phone className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block pl-1">Address</label>
                            <div className="relative group">
                                <textarea 
                                    className="w-full p-4 pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none h-24 resize-none font-medium transition-all focus:ring-2 focus:ring-emerald-500/20 leading-relaxed"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                />
                                <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-emerald-500 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <input placeholder="City" className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-medium transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            <input placeholder="State" className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-medium transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                            <input placeholder="Pincode" className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-mono font-medium transition-all focus:ring-2 focus:ring-emerald-500/20" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button 
                                onClick={handleConfigUpdate} 
                                disabled={loading} 
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-emerald-600/30 transition-all active:scale-95 text-sm uppercase tracking-wide flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Configuration'}
                            </button>
                        </div>
                    </div>
                )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SettingsPage;