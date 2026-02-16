import React, { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import { Filter, Search, RotateCcw, Shield, Clock, User, Activity, ChevronDown, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminAuditLogs = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const [filterAction, setFilterAction] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [isActionOpen, setIsActionOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const query = new URLSearchParams();
  if (filterAction) query.append('action', filterAction);
  if (searchUser) query.append('search', searchUser);

  const { data: logs, error, isLoading } = useSWR(
    isAdmin ? `/admin/logs?${query.toString()}` : null, 
    fetcher, 
    { refreshInterval: 5000 }
  );

  useEffect(() => setPage(1), [filterAction, searchUser]);

  const displayedLogs = logs?.slice((page - 1) * itemsPerPage, page * itemsPerPage) || [];
  const totalPages = Math.ceil((logs?.length || 0) / itemsPerPage);

  const resetFilters = () => {
      setFilterAction('');
      setSearchUser('');
  };

  const actionTypes = [
      "USER_APPROVED", 
      "USER_DELETED", 
      "ROLE_UPDATED", 
      "TICKET_CREATED", 
      "TICKET_RESOLVED",
      "LOGIN"
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsActionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (authLoading || (isAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying Audit Access...</div>;

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
        ⚠️ Failed to fetch audit logs.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent transition-colors">
      
      {/* 📌 FIXED HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all shadow-md">
        <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> Security Audit
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Monitor system activities and user actions.</p>
        </div>

        {/* FILTERS TOOLBAR */}
        <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
            {/* Custom Action Dropdown */}
            <div className="relative w-full md:w-auto" ref={dropdownRef}>
                <div 
                    onClick={() => setIsActionOpen(!isActionOpen)}
                    className={`pl-11 pr-10 py-2.5 md:py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800 cursor-pointer flex items-center w-full md:min-w-[220px] select-none ${
                        isActionOpen ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 dark:border-slate-700'
                    }`}
                >
                    <Filter className={`absolute left-4 top-3 md:top-3.5 w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${isActionOpen ? 'text-teal-500' : 'text-slate-400'}`} />
                    <span className="truncate">{filterAction ? filterAction.replace('_', ' ') : 'All Actions'}</span>
                    <ChevronDown className={`absolute right-4 top-3 md:top-3.5 w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-300 ${isActionOpen ? 'rotate-180 text-teal-500' : 'text-slate-400'}`} />
                </div>

                {isActionOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 md:mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-[1.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-2 space-y-1">
                            <div 
                                onClick={() => { setFilterAction(''); setIsActionOpen(false); }}
                                className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all ${!filterAction ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                            >
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">All Actions</span>
                                {!filterAction && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2 my-1"></div>
                            {actionTypes.map(action => (
                                <div 
                                    key={action}
                                    onClick={() => { setFilterAction(action); setIsActionOpen(false); }}
                                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all ${filterAction === action ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
                                >
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{action.replace('_', ' ')}</span>
                                    {filterAction === action && <Check className="w-3.5 h-3.5" />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* User Search */}
            <div className="relative group w-full md:w-auto">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] flex items-center justify-center shadow-lg shadow-[#0B5E4A]/20 transition-all group-focus-within:scale-110 group-focus-within:shadow-[#1FAE63]/40 z-10">
                    <Search className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search Actor..." 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="w-full pl-14 pr-4 py-2.5 md:py-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 md:min-w-[200px] shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800"
                />
            </div>

            {/* Reset */}
            {(filterAction || searchUser) && (
                <button 
                    onClick={resetFilters}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 md:py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl md:rounded-2xl text-xs md:text-sm font-black hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all shadow-sm active:scale-95 w-full md:w-auto"
                >
                    <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" /> Reset
                </button>
            )}
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[280px] md:h-[165px] lg:h-[195px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-2 max-w-7xl mx-auto">
        
        {/* DESKTOP TABLE VIEW */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <th className="sticky top-0 z-20 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-slate-50 dark:bg-slate-800 shadow-sm">Timestamp</th>
                            <th className="sticky top-0 z-20 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-slate-50 dark:bg-slate-800 shadow-sm">Actor</th>
                            <th className="sticky top-0 z-20 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-slate-50 dark:bg-slate-800 shadow-sm">IP Address</th>
                            <th className="sticky top-0 z-20 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-slate-50 dark:bg-slate-800 shadow-sm">Event Type</th>
                            <th className="sticky top-0 z-20 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black dark:text-white bg-slate-50 dark:bg-slate-800 shadow-sm">Description</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        {displayedLogs.length > 0 ? (
                            displayedLogs.map((log: any) => (
                                <tr key={log._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-xs">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                                            <User className="w-4 h-4 text-blue-500" />
                                            {log.actorName || 'System'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                            {log.ipAddress || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide border ${
                                            log.action.includes('APPROVED') ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' :
                                            log.action.includes('DELETED') ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                                            log.action.includes('RESOLVED') ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' :
                                            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                                        }`}>
                                            <Activity className="w-3 h-3" /> {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {log.details}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-24 text-center">
                                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-700">
                                        <Search className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-bold">No activity logs found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* MOBILE CARD VIEW */}
        <div className="md:hidden space-y-4">
            {displayedLogs.length > 0 ? displayedLogs.map((log: any) => (
                <div key={log._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wide border ${
                            log.action.includes('APPROVED') ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' :
                            log.action.includes('DELETED') ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                            log.action.includes('RESOLVED') ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' :
                            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400'
                        }`}>
                            <Activity className="w-3 h-3" /> {log.action.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">{log.details}</p>
                    <div className="flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
                            <User className="w-3.5 h-3.5 text-blue-500" />
                            {log.actorName || 'System'}
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
                            {log.ipAddress || 'Unknown'}
                        </span>
                    </div>
                </div>
            )) : (
                <div className="text-center py-12 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-400 font-bold text-sm">No logs found.</p>
                </div>
            )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
            <div className="mt-4 p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center backdrop-blur-md rounded-2xl md:rounded-none md:bg-transparent">
                <span className="text-[10px] md:text-xs font-black text-black dark:text-white uppercase tracking-wide ml-2">
                    Page {page} / {totalPages}
                </span>
                <div className="flex gap-2">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="p-2 md:p-2.5 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-lg shadow-[#0B5E4A]/20 transition-all hover:shadow-[#1FAE63]/40 active:scale-95 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminAuditLogs;