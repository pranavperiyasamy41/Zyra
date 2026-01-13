import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const DashboardWrapper: React.FC = () => {
  const { logout, user } = useAuth(); // We access 'user' here to get the name
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm uppercase tracking-wide ${
      isActive 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  // Helper to split name for styling (Optional visual effect)
  const displayName = user?.pharmacyName || "Smart Pharmacy";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* ✅ DYNAMIC LOGO AREA */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30 shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-black text-blue-600 tracking-tighter leading-tight break-words">
                {displayName}
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            <NavLink to="/dashboard" end className={navLinkClass}>
              <span>📊</span> Dashboard
            </NavLink>
            <NavLink to="/dashboard/inventory" className={navLinkClass}>
              <span>💊</span> Inventory
            </NavLink>
            <NavLink to="/dashboard/sales" className={navLinkClass}>
              <span>💰</span> Sales History
            </NavLink>
            <NavLink to="/dashboard/notes" className={navLinkClass}>
              <span>📝</span> Notes
            </NavLink>
            <NavLink to="/dashboard/settings" className={navLinkClass}>
              <span>⚙️</span> Settings
            </NavLink>
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 border-t dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <span className="text-xs text-gray-400 uppercase font-bold dark:text-gray-500">Theme</span>
            </div>
            
            {/* Show logged in user name */}
            <div className="text-xs text-center text-gray-400 font-mono">
              Operator: <span className="text-gray-600 dark:text-gray-300 font-bold">{user?.username}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 hover:text-red-700 transition-colors dark:bg-slate-800 dark:text-red-400 dark:hover:bg-slate-700"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header - ✅ DYNAMIC */}
        <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="font-black text-gray-900 dark:text-white truncate max-w-[200px]">{displayName}</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-600 dark:text-white">
            ☰
          </button>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;