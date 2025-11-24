import React from 'react';
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
  pharmacyLocation: string; // Added location for more detail
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();

  // Fetch all users using the admin endpoint
  const { data: users, error, isLoading } = useSWR<AppUser[]>('/admin/users', fetcher);

  if (isLoading) return <div className="p-8 dark:text-slate-300">Loading all users...</div>;
  
  // --- ACCESS CHECK ---
  // The backend already protects the API, but this provides a better frontend UX
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-slate-400">Pharmacy Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {users && users.map((appUser) => (
              <tr key={appUser._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{appUser.username}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{appUser.email}</td>
                <td className={`whitespace-nowrap px-6 py-4 text-sm font-semibold ${appUser.role === 'superadmin' ? 'text-red-500' : 'text-green-600'} dark:text-opacity-90`}>
                    {appUser.role.toUpperCase()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-slate-400">{appUser.pharmacyName || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;