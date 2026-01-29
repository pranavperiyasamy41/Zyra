import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { LifeBuoy, Send, MessageSquare, AlertCircle, CheckCircle, Clock, User, MessageCircle, Plus, X } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SupportPage = () => {
  const { data: tickets, mutate } = useSWR('/tickets/my', fetcher);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return toast.error("Please fill in all fields");
    
    try {
        await apiClient.post('/tickets', formData);
        toast.success("Ticket Created Successfully!");
        setFormData({ subject: '', message: '' });
        setIsCreateOpen(false);
        mutate();
    } catch (err) {
        toast.error("Failed to create ticket");
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 STICKY HEADER */}
      <div className="sticky top-0 z-20 backdrop-blur-2xl bg-white/60 dark:bg-slate-900/60 border-b border-white/20 dark:border-slate-800 p-6 md:p-8 flex justify-between items-center gap-4 transition-all">
        <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <LifeBuoy className="w-8 h-8 text-blue-600" /> Support Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Get help and track your support tickets.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl font-black shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Plus className="w-5 h-5 relative z-10" /> 
          <span className="relative z-10">New Ticket</span>
        </button>
      </div>

      <div className="p-6 md:p-8 pt-4 max-w-6xl mx-auto">
        
        {/* Ticket History (Full Width) */}
        <div className="w-full">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 pl-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Ticket History
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tickets && tickets.length > 0 ? tickets.map((t: any) => (
                <div key={t._id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-2xl ${t.status === 'OPEN' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {t.status === 'OPEN' ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1 line-clamp-1">{t.subject}</h3>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    ID: #{t._id.slice(-6)}
                                </span>
                            </div>
                        </div>
                        
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                            t.status === 'OPEN' 
                            ? 'bg-orange-50 text-orange-600 border-orange-200' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                            {t.status}
                        </span>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-800/50 p-6 rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50 mb-6 flex-1">
                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-slate-400 mt-1 shrink-0" />
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium line-clamp-3">
                                {t.message}
                            </p>
                        </div>
                    </div>

                    {t.adminReply ? (
                        <div className="bg-blue-50/80 dark:bg-blue-900/20 p-6 rounded-[1.5rem] border border-blue-100 dark:border-blue-900/30 flex items-start gap-4 mt-auto">
                            <div className="p-2 bg-blue-100 dark:bg-blue-800 text-blue-600 rounded-xl shrink-0">
                                <MessageCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <strong className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest block mb-2">
                                    Support Team
                                </strong> 
                                <span className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed line-clamp-3">
                                    {t.adminReply}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 pl-2 mt-auto">
                            <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                            <span className="text-xs font-bold italic">Waiting for response...</span>
                        </div>
                    )}
                </div>
            )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Tickets Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
                        Need help? Click "New Ticket" above to get started.
                    </p>
                </div>
            )}
            </div>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 border border-white/20 dark:border-slate-800 animate-in zoom-in-95 relative">
                <button 
                    onClick={() => setIsCreateOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-600" /> Create New Ticket
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <input 
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all font-bold text-sm peer" 
                            placeholder="Subject" 
                            value={formData.subject}
                            onChange={e => setFormData({...formData, subject: e.target.value})}
                            required
                            autoFocus
                        />
                        <AlertCircle className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    
                    <div className="relative group">
                        <textarea 
                            className="w-full pl-4 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all font-medium text-sm h-48 resize-none leading-relaxed" 
                            placeholder="Describe your issue in detail..." 
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex justify-end pt-2">
                        <button className="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl font-black shadow-xl shadow-blue-600/30 transition-all active:scale-95 text-sm uppercase tracking-wide flex items-center justify-center gap-2">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <span className="relative z-10">Submit Ticket</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
export default SupportPage;