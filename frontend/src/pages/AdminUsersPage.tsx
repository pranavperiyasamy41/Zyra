import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
// 🆕 Icons
import { AlertTriangle, Users, ShieldCheck, Trash2, CheckCircle } from 'lucide-react';

interface AppUser {
  _id: string;
  email: string;
  username: string;
  role: string;
  pharmacyName: string;
  isApproved: boolean; 
  status: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  
  const { data: users, error, isLoading, mutate } = useSWR<AppUser[]>('/admin/users', fetcher); 
  
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');

  const processedUsers = users?.map(u => ({
    ...u,
    isApproved: u.status === 'APPROVED'
  })) || [];

  const pendingUsers = processedUsers.filter(u => !u.isApproved);
  const activeUsers = processedUsers.filter(u => u.isApproved);
  
  const displayUsers = activeTab === 'pending' ? pendingUsers : processedUsers;

  const handleApprove = async (userId: string) => {
      if (users) {
        const updatedUsers = users.map(u => 
            u._id === userId ? { ...u, status: 'APPROVED' } : u
        );
        mutate(updatedUsers, false);
      }

      try {
          await apiClient.put(`/admin/approve/${userId}`);
          mutate(); 
      } catch (err: any) {
          alert('Approval failed. Please check connection.');
          mutate(); 
      }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this user?")) return;
    
    try {
        await apiClient.delete(`/admin/users/${userId}`);
        mutate(); 
    } catch (err: any) {
        alert('Failed to delete user.');
    }
  };

  const handleRoleChange = async (userId: string) => { 
    try {
        await apiClient.put(`/admin/users/${userId}`, { role: newRole });
        mutate(); 
        setEditingUserId(null); 
    } catch (err: any) {
        alert('Failed to update role.');
    }
  };

  if (isLoading) return <div className="p-8 dark:text-slate-300 animate-pulse">Loading Management Portal...</div>;
  
  if (error || (user && user.role !== 'superadmin' && user.role !== 'admin')) {
    return <div className="p-8 text-red-500 font-bold">⛔ Access Denied</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">User Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage approvals and permissions.</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow border dark:border-slate-700 flex gap-4">
              <div className="text-center">
                  <span className="block text-2xl font-bold text-red-500">{pendingUsers.length}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Pending</span>
              </div>
              <div className="w-px bg-gray-200 dark:bg-slate-700"></div>
              <div className="text-center">
                  <span className="block text-2xl font-bold text-green-500">{activeUsers.length}</span>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Active</span>
              </div>
          </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
        <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pending' 
                ? 'bg-white dark:bg-slate-700 text-red-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
            <AlertTriangle className="w-4 h-4" /> Pending Requests ({pendingUsers.length})
        </button>
        <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'all' 
                ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}
        >
            <Users className="w-4 h-4" /> All Users
        </button>
      </div>

      {/* --- TABLE --- */}
      <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">User Details</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Pharmacy</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Role</th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {displayUsers.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        No {activeTab} users found.
                    </td>
                </tr>
            ) : displayUsers.map((appUser) => (
              <tr key={appUser._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                
                <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white">{appUser.username}</span>
                        <span className="text-xs text-gray-500 dark:text-slate-400">{appUser.email}</span>
                    </div>
                </td>
                
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-300">
                    {appUser.pharmacyName || 'N/A'}
                </td>
                
                <td className="px-6 py-4">
                    {appUser.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Approved
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Pending Approval
                        </span>
                    )}
                </td>

                <td className="px-6 py-4">
                    {editingUserId === appUser._id ? (
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="text-xs border rounded p-1 dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        >
                            <option value="">Select Role</option>
                            <option value="user">USER</option>
                            <option value="admin">ADMIN</option>
                        </select>
                    ) : (
                        <span className={`text-xs font-black uppercase ${appUser.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                            {appUser.role}
                        </span>
                    )}
                </td>

                <td className="px-6 py-4 text-right whitespace-nowrap space-x-3">
                    {!appUser.isApproved && (
                        <button 
                            onClick={() => handleApprove(appUser._id)} 
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-500/30 transition-all active:scale-95 flex items-center gap-1 inline-flex"
                        >
                            <CheckCircle className="w-3 h-3" /> APPROVE
                        </button>
                    )}

                    {editingUserId === appUser._id ? (
                        <>
                            <button onClick={() => handleRoleChange(appUser._id)} className="text-green-600 font-bold text-xs hover:underline">Save</button>
                            <button onClick={() => setEditingUserId(null)} className="text-gray-400 font-bold text-xs hover:underline">Cancel</button>
                        </>
                    ) : (
                        <button 
                            onClick={() => { setEditingUserId(appUser._id); setNewRole(appUser.role); }}
                            className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                            disabled={!appUser.isApproved} 
                        >
                            EDIT
                        </button>
                    )}

                    <button 
                        onClick={() => handleDeleteUser(appUser._id)}
                        disabled={user?._id === appUser._id} 
                        className="text-red-500 hover:text-red-700 font-bold text-xs disabled:opacity-30 flex items-center gap-1 inline-flex"
                    >
                        <Trash2 className="w-3 h-3" /> DELETE
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;