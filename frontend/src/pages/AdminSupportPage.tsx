import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { LifeBuoy, MessageSquare, CheckCircle, Clock, User, Send, ChevronRight, Inbox, Plus } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminSupportPage = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const { data: tickets, mutate, error, isLoading } = useSWR(
    isAdmin ? '/tickets/all' : null, 
    fetcher
  );
  const [replyText, setReplyText] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

  const handleResolve = async () => {
    if (!selectedTicket || !replyText) return;
    try {
        await apiClient.put(`/tickets/${selectedTicket._id}/resolve`, { reply: replyText });
        toast.success("Ticket Resolved Successfully!");
        setReplyText('');
        setSelectedTicket(null);
        mutate();
    } catch(err) { toast.error("Failed to resolve ticket"); }
  };

  if (authLoading || (isAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying Support Access...</div>;

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
        ⚠️ Failed to fetch tickets. Please check your connection.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between transition-all shadow-md gap-4">
        <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <LifeBuoy className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Support Desk
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Manage and resolve user inquiries.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto justify-center md:justify-end">
            <div className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-brand-50 dark:bg-brand-primary/10 rounded-xl md:rounded-2xl border border-brand-100 dark:border-brand-primary/20 shadow-sm">
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-500 animate-pulse"></div>
                <span className="text-[10px] md:text-xs font-black text-brand-primary dark:text-brand-highlight uppercase tracking-wider">
                    {tickets?.filter((t: any) => t.status === 'OPEN').length || 0} Pending Requests
                </span>
            </div>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[160px] md:h-[120px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-2 md:pt-4 max-w-[1600px] mx-auto h-[calc(100vh-180px)] md:h-[calc(100vh-140px)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
            
            {/* LEFT COLUMN: TICKET LIST */}
            <div className={`col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 flex flex-col overflow-hidden ${selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xs md:text-sm font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                        <Inbox className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-primary dark:text-brand-highlight" /> Incoming Tickets
                    </h2>
                </div>
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 custom-scrollbar">
                    {tickets?.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-400 font-bold text-sm">No tickets found.</p>
                        </div>
                    ) : tickets?.map((t: any) => (
                        <div 
                            key={t._id} 
                            onClick={() => setSelectedTicket(t)}
                            className={`group p-4 md:p-5 rounded-xl md:rounded-2xl border cursor-pointer transition-all relative overflow-hidden ${
                                selectedTicket?._id === t._id 
                                ? 'bg-brand-50 dark:bg-brand-primary/20 border-brand-primary/50 shadow-md' 
                                : 'bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:bg-brand-50/50 dark:hover:bg-brand-primary/10 hover:border-brand-primary/20 hover:shadow-lg'
                            }`}
                        >
                            {selectedTicket?._id === t._id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-brand-primary"></div>
                            )}
                            
                            <div className="flex justify-between items-start mb-2 md:mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wide border ${
                                    t.status === 'OPEN' 
                                    ? 'bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800' 
                                    : 'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800'
                                }`}>
                                    {t.status === 'OPEN' ? <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" /> : <CheckCircle className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                                    {t.status}
                                </span>
                                <span className="text-[9px] md:text-[10px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            <h3 className={`font-bold text-xs md:text-sm mb-0.5 md:mb-1 line-clamp-1 ${selectedTicket?._id === t._id ? 'text-blue-700 dark:text-blue-300' : 'text-slate-900 dark:text-white'}`}>
                                {t.subject}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                                <User className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="truncate">{t.user?.pharmacyName || 'Unknown User'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT COLUMN: DETAIL & REPLY */}
            <div className={`col-span-1 lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl md:rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-slate-800 flex flex-col overflow-hidden relative ${!selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
                {selectedTicket ? (
                    <>
                        {/* Mobile Back Button */}
                        <div className="lg:hidden p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-md sticky top-0 z-20">
                            <button 
                                onClick={() => setSelectedTicket(null)}
                                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Ticket List
                            </button>
                        </div>

                        {/* Ticket Header */}
                        <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 overflow-y-auto max-h-[40vh] md:max-h-none">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${selectedTicket.status === 'OPEN' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {selectedTicket.status === 'OPEN' ? <Clock className="w-5 h-5 md:w-6 md:h-6" /> : <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedTicket.subject}</h2>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Ticket ID: #{selectedTicket._id.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                    {selectedTicket.message}
                                </p>
                            </div>
                        </div>

                        {/* Reply Section */}
                        <div className="flex-1 p-5 md:p-8 bg-slate-50 dark:bg-slate-900/50 flex flex-col min-h-0">
                            {selectedTicket.status === 'OPEN' ? (
                                <div className="h-full flex flex-col">
                                    <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                                        <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" /> Compose Reply
                                    </h3>
                                    <textarea 
                                        className="flex-1 w-full p-4 md:p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl md:rounded-[2rem] text-xs md:text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 resize-none mb-4 md:mb-6 shadow-sm leading-relaxed"
                                        placeholder="Type your response to the user..."
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <button 
                                            onClick={handleResolve} 
                                            disabled={!replyText.trim()}
                                            className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                            <Send className="w-3.5 h-3.5 md:w-4 md:h-4 relative z-10" /> 
                                            <span className="relative z-10">Send & Resolve</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                    <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-2">Ticket Resolved</h3>
                                    <div className="max-w-md bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-2xl text-left">
                                        <p className="text-[10px] md:text-xs font-bold text-emerald-600 uppercase mb-1">Your Reply:</p>
                                        <p className="text-xs md:text-sm text-emerald-800 dark:text-emerald-300 italic">"{selectedTicket.adminReply}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 md:p-12">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                            <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">Select a Ticket</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
                            Choose a ticket from the list on the left to view details and send a reply.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSupportPage;