import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Shield, Receipt, Key, Save, Cog, User, MapPin, Phone, Mail, FileText, Lock, CheckCircle, ChevronRight, Bell, AlertTriangle, Calendar, FileBarChart, Settings2, TrendingDown, Percent, Database, Trash2, Download, Store, Eye, EyeOff, Menu, Moon, Sun } from 'lucide-react';

const SettingsPage = () => {
  const { user, login } = useAuth(); 
  const { theme, toggleTheme } = useTheme();  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'invoice' | 'notifications' | 'system' | 'data'>('account');

  const [formData, setFormData] = useState({
    username: '', pharmacyName: '', email: '',
    currentPassword: '', password: '', confirmPassword: '',
    address: '', city: '', state: '', pincode: '', drugLicense: '', pharmacyContact: ''
  });

  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const [notifSettings, setNotifSettings] = useState({
    lowStockEmail: true, lowStockApp: true, expiryAlert: true, dailyReport: false
  });

  const [systemRules, setSystemRules] = useState({
    lowStockThreshold: 10,
    expiryWindow: 30,
    defaultTax: 12
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Danger Zone State
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

  // --- ACTIONS ---

  const handleExport = async () => {
    const toastId = toast.loading("Generating Backup...");
    try {
        const { data: medicines } = await apiClient.get('/medicines');
        if (!medicines || medicines.length === 0) {
            toast.error("No inventory data to export.", { id: toastId });
            return;
        }

        const headers = ["Name", "Batch ID", "Barcode", "Stock", "Price", "Expiry Date", "Category"];
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
        link.setAttribute("download", `inventory_backup_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Backup Downloaded!", { id: toastId });
    } catch (err) {
        console.error(err);
        toast.error("Failed to export data.", { id: toastId });
    }
  };

  const handleReset = () => {
      setShowResetConfirm(true);
  };

  const confirmReset = async () => {
      const toastId = toast.loading("Resetting Dashboard...");
      try {
          await apiClient.delete('/sales/reset');
          toast.success("Sales Data Cleared.", { id: toastId });
          setShowResetConfirm(false);
      } catch (err: any) {
          toast.error(err.response?.data?.message || "Reset Failed", { id: toastId });
          setShowResetConfirm(false);
      }
  };

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
    if (!formData.currentPassword) return toast.error("Please enter your current password.");
    if (!formData.password || !formData.confirmPassword) return toast.error("Please enter a new password.");
    
    // Strict Password Policy
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
        return toast.error("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
    }

    if (formData.password !== formData.confirmPassword) return toast.error("New passwords do not match!");

    try {
        setPwdLoading(true);
        const payload = { 
            currentPassword: formData.currentPassword,
            password: formData.password 
        };
        await apiClient.put('/users/profile', payload);
        toast.success("Password Changed Successfully!");
        setFormData(prev => ({ ...prev, currentPassword: '', password: '', confirmPassword: '' })); 
    } catch (err: any) {
        toast.error(`Failed: ${err.response?.data?.message || "Server Error"}`);
    } finally {
        setPwdLoading(false);
    }
  };

  const handleNotifToggle = (key: keyof typeof notifSettings) => {
      setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
      toast.success("Preference Updated");
  };

  const handleSystemRuleChange = (key: keyof typeof systemRules, val: number) => {
      setSystemRules(prev => ({ ...prev, [key]: val }));
  };

  const togglePwd = (field: keyof typeof showPwd) => {
    setShowPwd(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex items-center justify-between transition-all shadow-md">
         <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <Cog className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400 animate-spin-slow" /> Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Manage system preferences.</p>
         </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[100px] md:h-[120px] w-full"></div>

      <div className="p-4 md:p-8 pt-2 md:pt-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
          
          {/* SIDEBAR NAVIGATION (Mobile: Scrollable, Desktop: Sticky) */}
          <div className="w-full lg:w-80 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide lg:sticky lg:top-[180px] h-fit self-start z-20">
                {[ 
                    { id: 'account', label: 'Account & Security', icon: Shield, color: 'teal' },
                    { id: 'invoice', label: 'Invoice Settings', icon: Receipt, color: 'emerald' },
                    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'purple' },
                    { id: 'system', label: 'System Rules', icon: Settings2, color: 'orange' },
                    { id: 'data', label: 'Data & Backup', icon: Database, color: 'red' }
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 min-w-max lg:min-w-0 ${ 
                            activeTab === tab.id 
                            ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg scale-105' 
                            : 'bg-white dark:bg-slate-800 lg:bg-white/50 lg:dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700 lg:border-transparent'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <tab.icon className={`w-4 h-4 md:w-5 md:h-5 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                            <span className="font-bold text-xs md:text-sm">{tab.label}</span>
                        </div>
                        {activeTab === tab.id && <ChevronRight className="hidden lg:block w-4 h-4" />}
                    </button>
                ))}
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 w-full">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-8 lg:p-10 rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 relative">
                
                {/* 1. Account & Security */}
                {activeTab === 'account' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">Account Security</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm">Update your password and view account details.</p>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Email Address</label>
                                <div className="relative group">
                                    <div className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-500 font-mono text-xs md:text-sm flex items-center">
                                        {formData.email}
                                    </div>
                                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4" />
                                </div>
                            </div>
                            <div className="pt-4 md:pt-6 border-t border-slate-200 dark:border-slate-700/50">
                                <h3 className="text-teal-600 dark:text-teal-400 font-black text-[10px] md:text-sm uppercase tracking-wide mb-4 md:mb-6 flex items-center gap-2">
                                    <Key className="w-3.5 h-3.5 md:w-4 md:h-4" /> Change Password
                                </h3>
                                
                                {/* Current Password Field */}
                                <div className="mb-4 md:mb-6 relative group">
                                    <input 
                                        type={showPwd.current ? "text" : "password"} 
                                        placeholder="Current Password" 
                                        className="w-full p-3.5 md:p-4 pl-11 md:pl-12 pr-11 md:pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-bold" 
                                        value={formData.currentPassword} 
                                        onChange={e => setFormData({...formData, currentPassword: e.target.value})} 
                                    />
                                    <Lock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-teal-500 transition-colors" />
                                    <button 
                                        type="button"
                                        onClick={() => togglePwd('current')}
                                        className="absolute right-4 top-3.5 md:top-4 text-slate-400 hover:text-teal-600"
                                    >
                                        {showPwd.current ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                                    <div className="relative group">
                                        <input 
                                            type={showPwd.new ? "text" : "password"} 
                                            placeholder="New Password" 
                                            className="w-full p-3.5 md:p-4 pl-11 md:pl-12 pr-11 md:pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-bold" 
                                            value={formData.password} 
                                            onChange={e => setFormData({...formData, password: e.target.value})} 
                                        />
                                        <Lock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-teal-500 transition-colors" />
                                        <button 
                                            type="button"
                                            onClick={() => togglePwd('new')}
                                            className="absolute right-4 top-3.5 md:top-4 text-slate-400 hover:text-teal-600"
                                        >
                                            {showPwd.new ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                        </button>
                                    </div>
                                    <div className="relative group">
                                        <input 
                                            type={showPwd.confirm ? "text" : "password"} 
                                            placeholder="Confirm Password" 
                                            className="w-full p-3.5 md:p-4 pl-11 md:pl-12 pr-11 md:pr-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-bold" 
                                            value={formData.confirmPassword} 
                                            onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                                        />
                                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-teal-500 transition-colors" />
                                        <button 
                                            type="button"
                                            onClick={() => togglePwd('confirm')}
                                            className="absolute right-4 top-3.5 md:top-4 text-slate-400 hover:text-teal-600"
                                        >
                                            {showPwd.confirm ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                        </button>
                                    </div>
                                </div>
                                <button onClick={handlePasswordUpdate} disabled={pwdLoading} className="w-full md:w-auto bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white font-black px-8 py-3.5 rounded-xl md:rounded-2xl shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-50">
                                    {pwdLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Invoice Settings */}
                {activeTab === 'invoice' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">Invoice Configuration</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm">Customize the details that appear on your printed bills.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="md:col-span-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Pharmacy Name</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-black text-base md:text-lg transition-all focus:ring-2 focus:ring-emerald-500/20"
                                        value={formData.pharmacyName}
                                        onChange={e => setFormData({...formData, pharmacyName: e.target.value})}
                                        placeholder="Pharmacy Name"
                                    />
                                    <Store className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Operator Name</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-bold transition-all"
                                        value={formData.username}
                                        onChange={e => setFormData({...formData, username: e.target.value})}
                                        placeholder="Your Name"
                                    />
                                    <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Drug License No.</label>
                                <div className="relative group">
                                    <input 
                                        className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none font-mono font-bold transition-all"
                                        value={formData.drugLicense}
                                        onChange={e => setFormData({...formData, drugLicense: e.target.value})}
                                        placeholder="DL-XXXX-XXXX"
                                    />
                                    <FileText className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2 block pl-1">Full Address</label>
                                <div className="relative group">
                                    <textarea 
                                        className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white focus:border-emerald-500 outline-none h-24 resize-none font-medium transition-all leading-relaxed"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        placeholder="Pharmacy Address..."
                                    />
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button onClick={handleConfigUpdate} disabled={loading} className="w-full md:w-auto bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white font-black px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                                <Save className="w-4 h-4 md:w-5 md:h-5" /> Save Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* 3. Notification Settings */}
                {activeTab === 'notifications' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">Notifications</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm">Configure how you receive alerts.</p>
                        </div>
                        <div className="space-y-3 md:space-y-4">
                            {[ 
                                { id: 'lowStockEmail', label: 'Low Stock Alerts', desc: 'Email notifications', icon: AlertTriangle, color: 'red' },
                                { id: 'expiryAlert', label: 'Expiry Warnings', desc: 'Alerts for near expiry', icon: Calendar, color: 'orange' },
                                { id: 'dailyReport', label: 'Daily Sales Report', desc: 'End of day summary', icon: FileBarChart, color: 'teal' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className={`p-2.5 md:p-3 bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 rounded-lg md:rounded-2xl`}>
                                            <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">{item.label}</h3>
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleNotifToggle(item.id as any)}
                                        className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${notifSettings[item.id as keyof typeof notifSettings] ? 'bg-brand-btn-end' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${notifSettings[item.id as keyof typeof notifSettings] ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 4. System Rules */}
                {activeTab === 'system' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">System Rules</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm">Configure global thresholds and appearance.</p>
                        </div>
                        <div className="space-y-4 md:space-y-6">
                            {/* Appearance Mode */}
                            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="p-2.5 md:p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-lg md:rounded-2xl">
                                            {theme === 'light' ? <Moon className="w-5 h-5 md:w-6 md:h-6" /> : <Sun className="w-5 h-5 md:w-6 md:h-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Appearance Mode</h3>
                                            <p className="text-[10px] md:text-xs text-slate-500 font-medium">Switch between themes.</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={toggleTheme}
                                        className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${theme === 'dark' ? 'bg-brand-btn-end' : 'bg-slate-300 dark:bg-slate-700'}`}
                                    >
                                        <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full transition-transform duration-300 shadow-md ${theme === 'dark' ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-[2rem] border border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                                    <div className="p-2.5 md:p-3 bg-teal-100 dark:bg-teal-900/30 text-teal-600 rounded-lg md:rounded-2xl"><TrendingDown className="w-5 h-5 md:w-6 md:h-6" /></div>
                                    <div><h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Low Stock Threshold</h3><p className="text-[10px] md:text-xs text-slate-500 font-medium">Alert when stock is low.</p></div>
                                </div>
                                <div className="relative group">
                                    <input type="number" className="w-full p-3.5 md:p-4 pl-11 md:pl-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 font-bold" value={systemRules.lowStockThreshold} onChange={(e) => handleSystemRuleChange('lowStockThreshold', parseInt(e.target.value))} />
                                    <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-slate-400 absolute left-4 top-3.5 md:top-4 group-focus-within:text-teal-500 transition-colors" />
                                </div>
                            </div>
                            <div className="flex justify-end"><button onClick={() => toast.success("Rules Saved")} className="w-full md:w-auto bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white font-black px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 text-xs md:text-sm uppercase tracking-wide flex items-center justify-center gap-2"><Save className="w-4 h-4 md:w-5 md:h-5" /> Save Rules</button></div>
                        </div>
                    </div>
                )}

                {/* 5. Data & Backup */}
                {activeTab === 'data' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 md:space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-1 md:mb-2">Data Management</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm">Backup or cleanup your database.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="p-6 md:p-8 bg-teal-50 dark:bg-teal-900/20 rounded-xl md:rounded-[2.5rem] border border-teal-100 dark:border-teal-900/30 flex flex-col items-center text-center group">
                                <div className="p-3 md:p-4 bg-white dark:bg-teal-800 rounded-xl md:rounded-2xl text-teal-600 shadow-sm mb-3 md:mb-4 group-hover:scale-110 transition-transform"><Download className="w-6 h-6 md:w-8 md:h-8" /></div>
                                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white mb-1 md:mb-2">Export Data</h3>
                                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mb-4 md:mb-6">Download CSV backup.</p>
                                <button onClick={handleExport} className="w-full py-2.5 md:py-3 bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white rounded-lg md:rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs">Download</button>
                            </div>
                            <div className="p-6 md:p-8 bg-red-50 dark:bg-red-900/20 rounded-xl md:rounded-[2.5rem] border border-red-100 dark:border-red-900/30 flex flex-col items-center text-center group">
                                <div className="p-3 md:p-4 bg-white dark:bg-red-800 rounded-xl md:rounded-2xl text-red-600 shadow-sm mb-3 md:mb-4 group-hover:scale-110 transition-transform"><Trash2 className="w-6 h-6 md:w-8 md:h-8" /></div>
                                <h3 className="font-bold text-sm md:text-base text-slate-900 dark:text-white mb-1 md:mb-2">Reset Data</h3>
                                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mb-4 md:mb-6">Danger zone.</p>
                                <button onClick={handleReset} className="w-full py-2.5 md:py-3 bg-red-600 text-white rounded-lg md:rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 text-xs">Reset All</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
          </div>

        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Are you sure?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                This will <strong>permanently delete</strong> all your sales history and analytics data. This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmReset}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all text-sm active:scale-95"
                >
                  Yes, Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsPage;