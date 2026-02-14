import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import AdminAnnouncementModal from '../components/AdminAnnouncementModal';
import toast from 'react-hot-toast';
import { Megaphone, Trash2, Search, Filter, Plus, Bell, Info, AlertTriangle } from 'lucide-react';

interface Announcement { _id: string; title: string; content: string; type: string; createdAt: string; }

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminAnnouncements = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const { data: announcements, mutate, error, isLoading } = useSWR<Announcement[]>(
    isAdmin ? '/announcements' : null, 
    fetcher
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (authLoading || (isAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying Broadcast Access...</div>;

  if (!authLoading && !isAdmin) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⛔ Access Denied: Administrator Privileges Required
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⚠️ Failed to fetch announcements.
      </div>
    );
  }

  const filteredAnnouncements = announcements?.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || ann.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await apiClient.delete(`/announcements/${deleteId}`);
      mutate();
      toast.success("Announcement Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      
      {/* HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 shadow-md transition-all">
        <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <Megaphone className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Broadcast Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Manage system-wide alerts and notifications.</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full md:w-auto px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black shadow-lg shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider whitespace-nowrap"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus className="w-4 h-4 relative z-10" /> <span className="relative z-10">New Post</span>
            </button>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[180px] md:h-[140px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-2 md:pt-6 max-w-5xl mx-auto">
        
        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
            <div className="relative flex-1 group">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] flex items-center justify-center shadow-lg shadow-[#0B5E4A]/20 transition-all group-focus-within:scale-110 group-focus-within:shadow-[#1FAE63]/40 z-10">
                    <Search className="w-3.5 h-3.5 text-white" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search announcements..." 
                    className="w-full pl-12 md:pl-14 pr-4 py-2.5 md:py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-teal-500/50 dark:text-white transition-all shadow-sm text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl md:rounded-2xl overflow-x-auto scrollbar-hide">
                {['all', 'system', 'alert', 'internal'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                            filterType === type 
                            ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-md' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
            {filteredAnnouncements?.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                    <Megaphone className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm md:text-lg">No announcements found.</p>
                </div>
            ) : filteredAnnouncements?.map((ann) => (
                <div key={ann._id} className="group relative bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-5 h-full">
                        <div className={`p-3 rounded-2xl h-fit shrink-0 w-fit ${
                            ann.type === 'alert' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                            ann.type === 'internal' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                        }`}>
                            {ann.type === 'alert' ? <AlertTriangle className="w-5 h-5 md:w-6 md:h-6" /> : 
                             ann.type === 'internal' ? <Info className="w-5 h-5 md:w-6 md:h-6" /> : 
                             <Bell className="w-5 h-5 md:w-6 md:h-6" />}
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white line-clamp-1 md:line-clamp-none">{ann.title}</h3>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg whitespace-nowrap ml-2">
                                    {new Date(ann.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Card Content */}
                            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed font-medium mb-4 flex-1 line-clamp-3 md:line-clamp-none">
                                {ann.content}
                            </p>

                            {/* Card Footer (Tags + Action) */}
                            <div className="flex justify-between items-end mt-auto">
                                <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-md text-[9px] md:text-[10px] font-black uppercase tracking-wide ${
                                    ann.type === 'alert' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                    ann.type === 'internal' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                                    'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                }`}>
                                    {ann.type}
                                </span>

                                <button 
                                    onClick={() => setDeleteId(ann._id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 transform md:translate-y-2 md:group-hover:translate-y-0"
                                    title="Delete Announcement"
                                >
                                    <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>

      <AdminAnnouncementModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        mutateAnnouncements={mutate} 
      />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 text-center">Confirm Delete?</h3>
                <p className="text-center text-slate-500 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                    <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                    <button onClick={handleDelete} className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30">Delete</button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminAnnouncements;