import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';

// Define the User interface for the frontend
interface AppUser {
  _id: string;
  email: string;
  username: string;
  role: string;
  pharmacyName: string;
  pharmacyLocation: string;
  isApproved: boolean; // <-- NEW FIELD
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch all users using the admin endpoint
  const { data: users, error, isLoading, mutate } = useSWR<AppUser[]>('/admin/users', fetcher); 
  
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState('');
  
  // --- ACTIONS ---
  
  const handleRoleChange = async (userId: string) => { 
    try {
        await apiClient.put(`/admin/users/${userId}`, { role: newRole });
        mutate(); // Re-fetch the user list
        setEditingUserId(null); 
        setNewRole(''); 
    } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to update role.');
    }
  };

  const handleSetApproval = async (userId: string, status: boolean) => {
      const action = status ? 'approve' : 'reject';
      if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;

      try {
          await apiClient.put(`/admin/users/${userId}/approve`, { isApproved: status });
          mutate(); // Re-fetch the user list
      } catch (err: any) {
          alert(err.response?.data?.message || `Failed to ${action} user.`);
      }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    
    try {
        await apiClient.delete(`/admin/users/${userId}`);
        mutate(); // Re-fetch the user list
    } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };
  
  // ... (Access checks are the same) ...
  if (isLoading) return <div className="p-8 dark:text-slate-300">Loading all users...</div>;
  if (error || (user && user.role !== 'superadmin')) {
    return (
      <div className="p-8">
        <div className="rounded-lg bg-red-100 p-6 shadow dark:bg-red-900/30">
          <h2 className="text-xl font-bold text-red-800 dark:text-red-300">Access Denied</h2>
          <p className="mt-2 text-red-600 dark:text-red-400">
            You do not have Super Admin privileges to view this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">System User Management</h1>
      <p className="mb-4 text-sm text-red-600 dark:text-red-400">
        This panel is for Super Administrators only. Displaying all {users ? users.length : 0} registered users.
      </p>

      {/* --- Users Table --- */}
      <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-slate-800 dark:border dark:border-slate-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Status</th> {/* <-- STATUS COLUMN */}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Pharmacy Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {users && users.map((appUser) => (
              <tr key={appUser._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{appUser.username}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{appUser.email}</td>
                
                {/* --- STATUS CELL (Pending/Approved) --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold">
                    <span 
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${appUser.isApproved 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                        }`}
                    >
                        {appUser.isApproved ? 'Approved' : 'PENDING'}
                    </span>
                </td>

                {/* --- ROLE DISPLAY/EDIT CELL --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {editingUserId === appUser._id ? (
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="border rounded p-1 text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                        >
                            <option value="user">USER</option>
                            <option value="admin">ADMIN</option>
                            <option value="superadmin">SUPERADMIN</option>
                        </select>
                    ) : (
                        <span className={`font-semibold ${appUser.role === 'superadmin' ? 'text-red-500' : 'text-green-600'} dark:text-opacity-90`}>
                            {appUser.role.toUpperCase()}
                        </span>
                    )}
                </td>
                
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{appUser.pharmacyName || 'N/A'}</td>

                {/* --- ACTIONS CELL --- */}
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {/* APPROVAL ACTIONS */}
                    {!appUser.isApproved && (
                        <button 
                            onClick={() => handleSetApproval(appUser._id, true)} 
                            className="text-green-600 hover:text-green-800 mr-2 text-xs font-semibold"
                        >
                            APPROVE
                        </button>
                    )}
                    {appUser.isApproved && (
                         <button 
                            onClick={() => handleSetApproval(appUser._id, false)} 
                            className="text-yellow-600 hover:text-yellow-800 mr-2 text-xs font-semibold"
                            disabled={user?.id === appUser._id} // Cannot un-approve yourself
                        >
                            DISABLE
                        </button>
                    )}

                    {/* ROLE EDIT/DELETE ACTIONS */}
                    {editingUserId === appUser._id ? (
                        <div className="flex space-x-2 mt-1">
                            <button onClick={() => handleRoleChange(appUser._id)} className="text-green-600 hover:text-green-800 text-xs">Save</button>
                            <button onClick={() => setEditingUserId(null)} className="text-gray-500 hover:text-gray-700 text-xs">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex space-x-2 mt-1">
                            <button 
                                onClick={() => { setEditingUserId(appUser._id); setNewRole(appUser.role); }}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                                disabled={user?.id === appUser._id} // Disable editing your own role
                            >
                                EDIT ROLE
                            </button>
                            <button 
                                onClick={() => handleDeleteUser(appUser._id)}
                                disabled={user?.id === appUser._id} // Disable deleting your own account
                                className="text-red-600 hover:text-red-800 disabled:opacity-30 text-xs"
                            >
                                DELETE
                            </button>
                        </div>
                    )}
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