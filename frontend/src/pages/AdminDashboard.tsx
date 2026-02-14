import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import AdminAnnouncementModal from '../components/AdminAnnouncementModal';
import AdminSalesChart from '../components/AdminSalesChart';
import toast from 'react-hot-toast'; 
import { Trash2, AlertTriangle, ShieldAlert, UserCheck, Megaphone, Plus, BarChart3, TrendingUp, Activity, Ticket, CalendarDays, ChevronDown } from 'lucide-react';

interface AdminMetrics {
  pendingApprovalsCount: number;
  activeUsersCount: number;
  openTicketsCount: number;
  suspiciousAlertsCount: number;
}

interface Announcement { _id: string; title: string; content: string; type: string; createdAt: string; }

interface AggregatedSale { _id: string; totalRevenue: number; totalOrders: number; }

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState(30);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  const { data: metrics, error: metricsError, isLoading: loadingMetrics } = useSWR<AdminMetrics>(
    isAdmin ? '/admin/stats' : null, 
    fetcher
  );

  const { data: salesData } = useSWR<AggregatedSale[]>(
    isAdmin ? `/admin/analytics/sales?days=${timeRange}` : null, 
    fetcher
  );
  
  const { data: announcements, mutate: mutateAnnouncements } = useSWR<Announcement[]>(
    isAdmin ? '/announcements' : null, 
    fetcher
  );

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncementToDelete(id);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    try {
        await apiClient.delete(`/announcements/${announcementToDelete}`);
        mutateAnnouncements();
        toast.success("Announcement deleted");
    } catch (err: any) {
        toast.error('Failed to delete.');
    } finally {
        setAnnouncementToDelete(null);
    }
  };

  if (!isAdmin && !loadingMetrics) return <div className="p-8 text-red-500 font-bold text-center">ACCESS DENIED: ADMINS ONLY</div>;
  if (loadingMetrics) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying System Overview Access...</div>;
  
  if (metricsError) return (
    <div className="p-8 text-red-500 font-bold bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 m-6 flex items-center justify-center">
        ⚠️ System Error: Unable to fetch dashboard metrics.
    </div>
  );

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex items-center justify-between transition-all shadow-md">
        <div className="flex-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <BarChart3 className="w-5 h-5 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> System Overview
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Real-time monitoring and alerts.</p>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[100px] md:h-[110px] lg:h-[100px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-4 md:pt-6 lg:pt-4 max-w-[1600px] mx-auto">
        
        {/* METRICS GRID - Fully Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
            
            {/* 1. Pending Approvals */}
            <div className="relative group bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-700 overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-teal-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2.5 md:p-3 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-xl md:rounded-2xl shadow-sm dark:shadow-teal-500/20">
                            <UserCheck className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-2 py-1 rounded-lg border border-teal-100/50 dark:border-teal-500/20">NEW</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-0.5 md:mb-1">
                        {metrics?.pendingApprovalsCount ?? 0}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Approvals</p>
                </div>
            </div>

            {/* 2. Active Users */}
            <div className="relative group bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-700 overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2.5 md:p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl md:rounded-2xl shadow-sm dark:shadow-emerald-500/20">
                            <Activity className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-100/50 dark:border-emerald-500/20">LIVE</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-0.5 md:mb-1">
                        {metrics?.activeUsersCount ?? 0}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Active Users (24h)</p>
                </div>
            </div>

            {/* 3. Open Tickets */}
            <div className="relative group bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-700 overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2.5 md:p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-xl md:rounded-2xl shadow-sm dark:shadow-purple-500/20">
                            <Ticket className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-2 py-1 rounded-lg border border-purple-100/50 dark:border-purple-500/20">OPEN</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-0.5 md:mb-1">
                        {metrics?.openTicketsCount ?? 0}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Support Tickets</p>
                </div>
            </div>

            {/* 4. Security Alerts */}
            <div className="relative group bg-white dark:bg-slate-800 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-white/20 dark:border-slate-700 overflow-hidden hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-500/20 transition-all"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                        <div className="p-2.5 md:p-3 bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl md:rounded-2xl shadow-sm dark:shadow-red-500/20">
                            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-[9px] md:text-[10px] font-black bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-1 rounded-lg border border-red-100/50 dark:border-red-500/20">WARN</span>
                    </div>
                    <p className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-0.5 md:mb-1">
                        {metrics?.suspiciousAlertsCount ?? 0}
                    </p>
                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Security Flags</p>
                </div>
            </div>
        </div>

        {/* ANALYTICS CHART SECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 p-5 md:p-8 mb-10 relative overflow-hidden lg:overflow-visible">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8 relative z-30">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Global Revenue</h2>
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold">Aggregate sales performance across all pharmacies</p>
                    </div>
                </div>

                {/* Date Filter Dropdown */}
                <div className="relative z-50 w-full md:w-auto">
                    <button 
                        onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                        className="w-full md:w-auto group flex items-center justify-between md:justify-start gap-3 pl-5 pr-4 py-2.5 md:py-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/50 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-0.5 outline-none focus:ring-4 focus:ring-teal-500/10"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-xl group-hover:bg-teal-500 transition-colors duration-300">
                                <CalendarDays className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-[0.15em] text-slate-700 dark:text-slate-200">
                                {timeRange === 90 ? 'Last 3 Months' : timeRange === 180 ? 'Last 6 Months' : `Last ${timeRange} Days`}
                            </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <div className={`absolute right-0 top-full mt-2 w-full md:w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 transform origin-top transition-all duration-200 ${isTimeDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                        {[7, 14, 30, 90, 180].map((days) => (
                            <button
                                key={days}
                                onClick={() => { setTimeRange(days); setIsTimeDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-between group ${
                                    timeRange === days 
                                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400' 
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <span>{days === 90 ? 'Last 3 Months' : days === 180 ? 'Last 6 Months' : `Last ${days} Days`}</span>
                                {timeRange === days && <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="h-[250px] md:h-[300px] w-full relative z-10">
                {salesData ? (
                    <AdminSalesChart data={salesData} />
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Loading Chart Data...</div>
                )}
            </div>

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        </div>

      </div>

      <AdminAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mutateAnnouncements={mutateAnnouncements} />

      {/* Delete Confirmation Modal */}
      {announcementToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl max-w-sm w-full p-8 border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Delete Announcement?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                This will permanently remove this broadcast from all user dashboards.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setAnnouncementToDelete(null)}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-xl hover:shadow-[#0B5E4A]/30 transition-all text-sm active:scale-95"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;