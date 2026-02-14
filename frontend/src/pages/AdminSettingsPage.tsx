import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { 
  Settings, Save, AlertTriangle, Clock, Globe, Shield, 
  Lock, Power, Activity, DollarSign, Users, Timer, Menu, ChevronRight, Moon, Sun 
} from 'lucide-react';

const AdminSettingsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    // Identity
    platformName: 'Zyra',
    supportEmail: '',
    // Limits
    maxUploadSizeMB: 5,
    auditLogRetentionDays: 90,
    // Security
    sessionTimeoutHours: 24,
    // Operations
    maintenanceMode: false,
    allowRegistration: true
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'superadmin') {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const res = await apiClient.get('/settings');
      setSettings(res.data);
    } catch (error) {
      toast.error('Failed to load system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setSettings({ ...settings, [e.target.name]: value });
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await apiClient.put('/settings', settings);
      toast.success('Configuration Updated Successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = (user && (user.role === 'admin' || user.role === 'superadmin'));

  if (authLoading || (isAdmin && loading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying Configuration Access...</div>;

  if (!authLoading && !isAdmin) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⛔ Access Denied: Administrator Privileges Required
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'Platform Identity & Limits', icon: Globe, color: 'blue' },
    { id: 'security', label: 'Security & Access', icon: Shield, color: 'emerald' },
    { id: 'operations', label: 'Platform Operations', icon: Activity, color: 'purple' },
  ];

  return (
    <div className="relative min-h-screen bg-transparent transition-colors pb-20">
      
      {/* 📌 HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex items-center justify-between transition-all shadow-md">
        <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-teal-600 dark:bg-teal-500 text-white rounded-xl shadow-xl">
                    <Settings className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow" />
                </div>
                Platform Settings
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Global platform configuration and policies.</p>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[100px] md:h-[120px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-4 md:pt-6 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION (Mobile: Stacked, Tablet: Grid, Desktop: Sticky Sidebar) */}
        <div className="w-full lg:w-72 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-2 lg:sticky lg:top-[180px] h-fit self-start z-20">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-300 w-full ${
                        activeTab === tab.id 
                        ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-xl shadow-[#0B5E4A]/20 scale-105 border border-transparent' 
                        : 'hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent border border-slate-100 dark:border-slate-700 lg:border-transparent'
                    }`}
                >
                    <div className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-colors ${activeTab === tab.id ? `bg-white/20 text-white` : 'bg-slate-100 dark:bg-slate-900 lg:bg-slate-100 lg:dark:bg-slate-800'}`}>
                        <tab.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <span className={`font-bold text-xs md:text-sm text-left ${activeTab === tab.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tab.label}</span>
                </button>
            ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 space-y-4 md:space-y-6 w-full">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    
                    {/* Platform Identity */}
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-500" /> Platform Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">System Name</label>
                                <div className="relative group">
                                    <Activity className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input 
                                        name="platformName" 
                                        value={settings.platformName} 
                                        onChange={handleChange}
                                        placeholder="e.g. Zyra"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Support Contact</label>
                                <input 
                                    name="supportEmail" 
                                    value={settings.supportEmail} 
                                    onChange={handleChange}
                                    placeholder="support@example.com"
                                    className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* System Limits */}
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500" /> System Limits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Upload Size (MB)</label>
                                <input 
                                    type="number"
                                    name="maxUploadSizeMB" 
                                    value={settings.maxUploadSizeMB} 
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl md:rounded-2xl font-black text-amber-900 dark:text-amber-100 outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-sm"
                                />
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold ml-1">License & Image uploads</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Data Retention (Days)</label>
                                <input 
                                    type="number"
                                    name="auditLogRetentionDays" 
                                    value={settings.auditLogRetentionDays} 
                                    onChange={handleChange}
                                    className="w-full px-5 py-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-xl md:rounded-2xl font-black text-orange-900 dark:text-orange-100 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm"
                                />
                                <p className="text-[9px] md:text-[10px] text-slate-400 font-bold ml-1">Audit log storage duration</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                        <button 
                            onClick={handleSubmit} 
                            disabled={saving}
                            className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full md:w-auto px-8 py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            {saving ? 'Saving...' : 'Save General Settings'} <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-emerald-500" /> Access Policies
                        </h3>
                        
                        <div className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700 mb-4 md:mb-6">
                            <div className="flex gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl h-fit">
                                    <Users className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Allow New Registrations</h4>
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1">If disabled, only Admins can create new users.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggle('allowRegistration')}
                                className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${settings.allowRegistration ? 'bg-brand-btn-end' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.allowRegistration ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Session Timeout</label>
                            <div className="relative group">
                                <Timer className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input 
                                    type="number"
                                    name="sessionTimeoutHours" 
                                    value={settings.sessionTimeoutHours} 
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                />
                            </div>
                            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold ml-1">Hours before forced logout (Default: 24)</p>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                        <button 
                            onClick={handleSubmit} 
                            disabled={saving}
                            className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full md:w-auto px-8 py-3.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            {saving ? 'Saving...' : 'Save Security Policies'} <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* OPERATIONS TAB */}
            {activeTab === 'operations' && (
                <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    {/* Admin Appearance */}
                    <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                        <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-4 md:mb-6 flex items-center gap-2">
                            {theme === 'light' ? <Moon className="w-5 h-5 text-orange-500" /> : <Sun className="w-5 h-5 text-orange-500" />} Appearance Settings
                        </h3>
                        <div className="flex items-center justify-between p-4 md:p-6 bg-slate-50 dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div>
                                <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Dark Mode</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1">Switch the admin dashboard theme.</p>
                            </div>
                            <button 
                                onClick={toggleTheme}
                                className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${theme === 'dark' ? 'bg-brand-btn-end' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-red-100 dark:border-red-900/30">
                        <h3 className="text-base md:text-lg font-black text-red-700 dark:text-red-400 mb-4 md:mb-6 flex items-center gap-2">
                            <Power className="w-5 h-5" /> Emergency Controls
                        </h3>
                        
                        <div className="flex items-center justify-between p-4 md:p-6 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
                            <div className="flex gap-3 md:gap-4">
                                <div className="p-2.5 md:p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl h-fit">
                                    <Shield className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm md:text-base text-slate-900 dark:text-white">Maintenance Mode</h4>
                                    <p className="text-[10px] md:text-xs text-slate-500 font-medium mt-0.5 md:mt-1">Lock out all non-admin users immediately.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleToggle('maintenanceMode')}
                                className={`relative w-12 h-7 md:w-14 md:h-8 rounded-full transition-colors duration-300 flex-shrink-0 ${settings.maintenanceMode ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                            >
                                <div className={`absolute top-1 left-1 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings.maintenanceMode ? 'translate-x-5 md:translate-x-6' : 'translate-x-0'}`}></div>
                            </button>
                        </div>
                        
                        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-red-100/50 dark:bg-red-900/20 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-medium text-red-800 dark:text-red-300 leading-relaxed border border-red-200 dark:border-red-800/50">
                            <strong>Warning:</strong> Enabling Maintenance Mode will immediately invalidate all active user sessions. Admins will remain logged in. Use only during scheduled downtime.
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                        <button 
                            onClick={handleSubmit} 
                            disabled={saving}
                            className="group relative overflow-hidden bg-red-600 hover:bg-red-500 text-white w-full md:w-auto px-8 py-3.5 rounded-xl md:rounded-2xl font-black shadow-lg shadow-red-600/20 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            {saving ? 'Saving...' : 'Update Operations'} <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;