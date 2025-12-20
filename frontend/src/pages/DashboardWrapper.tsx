import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboardPage from './AdminDashboard';
import DashboardPage from './Dashboard';

const DashboardWrapper: React.FC = () => {
  const { user } = useAuth();

  // If there is no user yet, show nothing or a loader
  if (!user) return <div className="p-8">Loading session...</div>;

  // LOG THIS: Open F12 Console and see what prints here
  console.log("DASHBOARD_WRAPPER: User Role is ->", user.role);

  // If role is admin/superadmin, show the Red/Yellow/Purple dashboard
  if (user.role === 'admin' || user.role === 'superadmin') {
    return <AdminDashboardPage />;
  }

  // FOR SATHYA: Show the standard user dashboard
  return <DashboardPage />;
};

export default DashboardWrapper;