import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { Filter, Search, RotateCcw } from 'lucide-react';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminAuditLogs = () => {
  const [filterAction, setFilterAction] = useState('');
  const [searchUser, setSearchUser] = useState('');

  // Construct Query String
  const query = new URLSearchParams();
  if (filterAction) query.append('action', filterAction);
  if (searchUser) query.append('search', searchUser);

  const { data: logs, error } = useSWR(`/admin/logs?${query.toString()}`, fetcher, { refreshInterval: 5000 });

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

  if (!logs && !error) return <div className="p-8 text-white animate-pulse">Loading Logs...</div>;

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">🛡️ Security Audit Logs</h1>
        
        {/* FILTERS TOOLBAR */}
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Action Dropdown */}
            <div className="relative">
                <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <select 
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm outline-none focus:border-blue-500 appearance-none min-w-[180px]"
                >
                    <option value="">All Actions</option>
                    {actionTypes.map(action => (
                        <option key={action} value={action}>{action.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            {/* User Search */}
            <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search Actor..." 
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm outline-none focus:border-blue-500 min-w-[200px]"
                />
            </div>

            {/* Reset */}
            {(filterAction || searchUser) && (
                <button 
                    onClick={resetFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-600 transition-colors"
                >
                    <RotateCcw className="w-4 h-4" /> Reset
                </button>
            )}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
            <thead className="bg-slate-800 text-xs uppercase font-bold text-gray-400">
                <tr>
                <th className="p-4">Time</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {logs && logs.length > 0 ? logs.map((log: any) => (
                <tr key={log._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-blue-400 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-white">{log.actorName || 'Unknown'}</td>
                    <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase border ${
                        log.action.includes('APPROVED') ? 'bg-green-900/30 text-green-400 border-green-800' :
                        log.action.includes('DELETED') ? 'bg-red-900/30 text-red-400 border-red-800' :
                        log.action.includes('RESOLVED') ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                        'bg-slate-700 text-gray-300 border-slate-600'
                    }`}>
                        {log.action}
                    </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">{log.details}</td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">No logs found matching filters.</td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
export default AdminAuditLogs;