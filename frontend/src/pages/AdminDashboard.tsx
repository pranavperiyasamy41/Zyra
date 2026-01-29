import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import AdminAnnouncementModal from '../components/AdminAnnouncementModal';
import toast from 'react-hot-toast'; // 🆕 IMPORT
import { Trash2, AlertTriangle } from 'lucide-react';

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
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

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
          <div key={ann._id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
            <div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                  ann.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
              }`}>
                  {ann.type}
              </span>
              <h3 className="font-bold dark:text-white mt-1">{ann.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ann.content}</p>
            </div>
            <button 
                onClick={() => handleDeleteAnnouncement(ann._id)} 
                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-300 opacity-60 group-hover:opacity-100"
                title="Delete Announcement"
            >
                <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <AdminAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mutateAnnouncements={mutateAnnouncements} />

      {/* Delete Confirmation Modal */}
      {announcementToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-slate-700 scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Announcement?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                This will permanently remove this announcement from all user dashboards.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setAnnouncementToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
                >
                  Delete
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