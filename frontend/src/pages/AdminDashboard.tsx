import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import AdminAnnouncementModal from '../components/AdminAnnouncementModal';

interface AdminMetrics {
  pendingApprovalsCount: number;
  lowStockCount: number;
  expiryAlertsCount: number;
  suspiciousAlertsCount: number;
}

interface Announcement { _id: string; title: string; content: string; type: string; createdAt: string; }

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  // ✅ FIX 1: Changed '/admin/metrics' to '/admin/stats' to match your backend
  const { data: metrics, error: metricsError, isLoading: loadingMetrics } = useSWR<AdminMetrics>(
    isAdmin ? '/admin/stats' : null, 
    fetcher
  );
  
  const { data: announcements, mutate: mutateAnnouncements } = useSWR<Announcement[]>(
    isAdmin ? '/announcements' : null, 
    fetcher
  );

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
        await apiClient.delete(`/announcements/${id}`);
        mutateAnnouncements();
    } catch (err: any) {
        alert('Failed to delete.');
    }
  };

  if (!isAdmin) return <div className="p-8 text-red-500 font-bold text-center">ACCESS DENIED: ADMINS ONLY</div>;
  if (loadingMetrics) return <div className="p-8 dark:text-slate-300 animate-pulse text-center font-mono">Loading System Overview...</div>;
  
  if (metricsError) return (
    <div className="p-8 text-red-500 font-bold bg-red-100 rounded-xl border border-red-200 mt-6">
        ⚠️ Error loading stats. The backend route /admin/stats might be unreachable.
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white mb-8">SYSTEM CONTROLLER</h1>
      
      {/* METRICS ROW (Updated with Gradient UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Approvals */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
            <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Pending Approvals</p>
                <p className="text-5xl font-black mt-2">{metrics?.pendingApprovalsCount ?? 0}</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">👤</div>
        </div>

        {/* Low Stock */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Global Low Stock</p>
                <p className="text-5xl font-black mt-2">{metrics?.lowStockCount ?? 0}</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">📦</div>
        </div>

        {/* Expiry */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg shadow-red-500/20 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Expiring Soon</p>
                <p className="text-5xl font-black mt-2">{metrics?.expiryAlertsCount ?? 0}</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">⚠️</div>
        </div>

        {/* Security Alerts */}
        <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-500/20 relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">Security Alerts</p>
                <p className="text-5xl font-black mt-2">{metrics?.suspiciousAlertsCount ?? 0}</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">🚨</div>
        </div>
      </div>

      <div className="flex justify-between items-center border-b dark:border-slate-700 pb-4 mb-6">
        <h2 className="text-xl font-bold dark:text-white uppercase">ANNOUNCEMENTS</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
          + POST NEW
        </button>
      </div>

      <div className="space-y-4">
        {announcements?.length === 0 ? (
            <div className="text-gray-500 italic">No active announcements.</div>
        ) : announcements?.map((ann) => (
          <div key={ann._id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  ann.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                  {ann.type}
              </span>
              <h3 className="font-bold dark:text-white mt-1">{ann.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ann.content}</p>
            </div>
            <button onClick={() => handleDeleteAnnouncement(ann._id)} className="text-red-500 font-bold text-xs hover:text-red-700 px-3 py-1">DELETE</button>
          </div>
        ))}
      </div>

      <AdminAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mutateAnnouncements={mutateAnnouncements} />
    </div>
  );
};

export default AdminDashboard;