import React from 'react';
import useSWR from 'swr';
import apiClient from '../api';

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminAuditLogs = () => {
  const { data: logs, error } = useSWR('/admin/logs', fetcher, { refreshInterval: 5000 });

  if (!logs) return <div className="p-8 text-white">Loading Logs...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-black text-white mb-6">🛡️ SECURITY AUDIT LOGS</h1>
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
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
            {logs.map((log: any) => (
              <tr key={log._id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 font-mono text-xs text-blue-400">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-4 font-bold text-white">{log.actorName || 'Unknown'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold border ${
                      log.action.includes('APPROVED') ? 'bg-green-900/30 text-green-400 border-green-800' :
                      log.action.includes('RESOLVED') ? 'bg-purple-900/30 text-purple-400 border-purple-800' :
                      'bg-slate-700 text-gray-300 border-slate-600'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminAuditLogs;