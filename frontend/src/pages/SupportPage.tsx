import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { LifeBuoy, Send, MessageSquare, AlertCircle, CheckCircle, Clock, User, MessageCircle, Plus, X, FileText } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const SupportPage = () => {
  const { data: tickets, mutate } = useSWR('/tickets/my', fetcher);
  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isCreateOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCreateOpen]);

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
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-md">
        <div className="text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <LifeBuoy className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Support Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-sm mt-0.5 md:mt-1 font-medium">Get help and track your support tickets.</p>
        </div>
        
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full md:w-auto px-6 md:px-8 py-2.5 md:py-3 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Plus className="w-4 h-4 md:w-5 md:h-4 relative z-10 text-white" /> 
          <span className="relative z-10">New Ticket</span>
        </button>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[160px] md:h-[120px] w-full"></div>

      <div className="p-4 md:p-8 pt-2 md:pt-4 w-full max-w-7xl mx-auto">
        
        {/* Ticket History */}
        <div className="w-full">
            <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 pl-1 flex items-center gap-2">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-slate-400" /> Ticket History
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {tickets && tickets.length > 0 ? tickets.map((t: any) => (
                <div key={t._id} className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-lg hover:shadow-2xl border border-white/20 dark:border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div className="flex items-start gap-3 md:gap-4 overflow-hidden">
                            <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl shrink-0 ${t.status === 'OPEN' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                {t.status === 'OPEN' ? <Clock className="w-5 h-5 md:w-6 md:h-6" /> : <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-black text-slate-900 dark:text-white text-base md:text-lg leading-tight mb-1 truncate">{t.subject}</h3>
                                <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    ID: #{t._id.slice(-6)}
                                </span>
                            </div>
                        </div>
                        
                        <span className={`px-2.5 md:px-4 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm flex-shrink-0 ${
                            t.status === 'OPEN' 
                            ? 'bg-orange-50 text-orange-600 border-orange-200' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                            {t.status}
                        </span>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] border border-slate-100 dark:border-slate-700/50 mb-4 md:mb-6 flex-1">
                        <div className="flex items-start gap-3">
                            <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mt-1 shrink-0" />
                            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium line-clamp-3">
                                {t.message}
                            </p>
                        </div>
                    </div>

                    {t.adminReply ? (
                        <div className="bg-teal-50/80 dark:bg-teal-900/20 p-4 md:p-6 rounded-xl md:rounded-[1.5rem] border border-teal-100 dark:border-teal-900/30 flex items-start gap-3 md:gap-4 mt-auto">
                            <div className="p-1.5 md:p-2 bg-teal-100 dark:bg-teal-800 text-teal-600 rounded-lg md:rounded-xl shrink-0">
                                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <div>
                                <strong className="text-teal-600 dark:text-teal-400 text-[10px] md:text-xs font-black uppercase tracking-widest block mb-1.5 md:mb-2">
                                    Support Team
                                </strong> 
                                <span className="text-slate-700 dark:text-slate-300 text-xs md:text-sm font-medium leading-relaxed line-clamp-3">
                                    {t.adminReply}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 pl-1 md:pl-2 mt-auto">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-slate-300 rounded-full animate-pulse"></div>
                            <span className="text-[10px] md:text-xs font-bold italic">Waiting for response...</span>
                        </div>
                    )}
                </div>
            )) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 bg-white/40 dark:bg-slate-900/40 rounded-[2.5rem] border border-dashed border-slate-300 dark:border-slate-700 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 md:mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-1 md:mb-2">No Tickets Yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-xs md:text-sm px-4">
                        Need help? Click "New Ticket" above to get started.
                    </p>
                </div>
            )}
            </div>
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateOpen && createPortal(
        <div className="fixed top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-950 w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                
                {/* Premium Header */}
                <div 
                    style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
                    className="p-6 flex justify-between items-center shadow-lg relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="relative z-10 text-white flex items-center gap-4">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md border border-white/10">
                            <MessageSquare className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight">Create New Ticket</h2>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsCreateOpen(false)}
                        className="relative z-10 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:text-red-200 transition-all backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto max-h-[80vh]">
                    <div className="flex flex-col gap-6">
                        <div className="relative group">
                            <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Ticket Subject</label>
                            <div className="relative">
                                <AlertCircle className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                                <input 
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400" 
                                    placeholder="Brief summary of the issue" 
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <label className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-2 block pl-1">Message Details</label>
                            <div className="relative">
                                <FileText className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 group-focus-within:text-teal-500 transition-all duration-300 transform group-hover:scale-110" />
                                <textarea 
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-teal-400 dark:hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/5 transition-all placeholder:text-slate-400 h-48 resize-none leading-relaxed" 
                                    placeholder="Describe your issue in detail..." 
                                    value={formData.message}
                                    onChange={e => setFormData({...formData, message: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                        <button 
                            type="button" 
                            onClick={() => setIsCreateOpen(false)}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="flex-[2] group relative overflow-hidden bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:shadow-brand-btn-end/40 text-white py-3.5 rounded-2xl font-black shadow-xl shadow-brand-btn-start/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wide"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                            <Send className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                            <span className="relative z-10">Submit Ticket</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default SupportPage;