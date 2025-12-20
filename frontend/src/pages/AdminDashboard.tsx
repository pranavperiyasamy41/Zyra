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

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SECURE FETCH: SWR will only run if user is an admin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  
  const { data: metrics, error: metricsError, isLoading: loadingMetrics } = useSWR<AdminMetrics>(
    isAdmin ? '/admin/metrics' : null, 
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
  if (loadingMetrics) return <div className="p-8 dark:text-slate-300 animate-pulse text-center font-mono">SECURE ADMIN LOAD...</div>;
  if (metricsError) return <div className="p-8 text-red-500">Session Error. Please log in again.</div>;

  const cards = [
    { title: "Approvals", count: metrics?.pendingApprovalsCount, color: "bg-red-500", icon: "👤" },
    { title: "Low Stock", count: metrics?.lowStockCount, color: "bg-yellow-500", icon: "📦" },
    { title: "Expiry", count: metrics?.expiryAlertsCount, color: "bg-orange-500", icon: "⚠️" },
    { title: "Alerts", count: metrics?.suspiciousAlertsCount, color: "bg-purple-500", icon: "🚨" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">System Controller</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div key={card.title} className={`${card.color} text-white p-6 rounded-2xl shadow-xl`}>
            <div className="flex items-center justify-between opacity-80">
              <p className="text-xs font-bold uppercase">{card.title}</p>
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-5xl font-black mt-2">{card.count ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-b dark:border-slate-700 pb-4 mb-6">
        <h2 className="text-xl font-bold dark:text-white uppercase">Announcements</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-white dark:bg-slate-800 text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
          + POST NEW
        </button>
      </div>

      <div className="space-y-4">
        {announcements?.map((ann) => (
          <div key={ann._id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border dark:border-slate-700 shadow-sm flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded uppercase">{ann.type}</span>
              <h3 className="font-bold dark:text-white mt-1">{ann.title}</h3>
              <p className="text-sm text-gray-500">{ann.content}</p>
            </div>
            <button onClick={() => handleDeleteAnnouncement(ann._id)} className="text-red-500 font-bold text-xs">DELETE</button>
          </div>
        ))}
      </div>

      <AdminAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mutateAnnouncements={mutateAnnouncements} />
    </div>
  );
};

export default AdminDashboardPage;