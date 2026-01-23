import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
// 🆕 Icons
import { 
  LayoutDashboard, 
  Pill, 
  History, 
  StickyNote, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Users, 
  ShieldCheck, 
  BarChart3,
  Ticket
} from 'lucide-react';

const DashboardWrapper: React.FC = () => {
  const { logout, user } = useAuth(); 
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

  const displayName = user?.pharmacyName || "Zyra";
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

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
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col
      `}>
        <div className="p-6 flex-1 overflow-y-auto">
          {/* LOGO AREA */}
          <div className="flex items-center gap-3 mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 ${isAdmin ? 'bg-red-600 shadow-red-500/30' : 'bg-blue-600 shadow-blue-500/30'}`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h1 className={`text-lg font-black tracking-tighter leading-tight break-words ${isAdmin ? 'text-red-600' : 'text-blue-600'}`}>
                {displayName}
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {isAdmin ? (
               <>
                 <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Control Panel</div>
                 <NavLink to="/admin-dashboard" end className={navLinkClass}><BarChart3 className="w-5 h-5"/> System Overview</NavLink>
                 <NavLink to="/admin-users" className={navLinkClass}><Users className="w-5 h-5"/> Manage Users</NavLink>
                 <NavLink to="/admin-logs" className={navLinkClass}><ShieldCheck className="w-5 h-5"/> Audit Logs</NavLink> 
                 <NavLink to="/admin-support" className={navLinkClass}><Ticket className="w-5 h-5"/> Support Tickets</NavLink>
               </>
            ) : (
               /* 💊 USER VIEW */
               <>
                 <NavLink to="/dashboard" end className={navLinkClass}><LayoutDashboard className="w-5 h-5"/> Dashboard</NavLink>
                 <div className="my-4 border-t border-gray-200 dark:border-slate-700"></div>
                 <div className="px-4 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">My Pharmacy</div>
                 <NavLink to="/inventory" className={navLinkClass}><Pill className="w-5 h-5"/> Inventory</NavLink>
                 <NavLink to="/sales" className={navLinkClass}><History className="w-5 h-5"/> Sales History</NavLink>
                 <NavLink to="/notes" className={navLinkClass}><StickyNote className="w-5 h-5"/> Notes</NavLink>
                 <NavLink to="/support" className={navLinkClass}><LifeBuoy className="w-5 h-5"/> Support</NavLink>
                 <div className="my-4 border-t border-gray-200 dark:border-slate-700"></div>
                 <NavLink to="/settings" className={navLinkClass}><Settings className="w-5 h-5"/> Settings</NavLink>
               </>
            )}
          </nav>
        </div>

        {/* BOTTOM PROFILE SECTION */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
          
          <div className="flex items-center gap-3 mb-4 px-1">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${isAdmin ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.username || 'User'}</p>
              <p className={`text-[10px] font-black uppercase tracking-wider ${isAdmin ? 'text-red-500' : 'text-blue-500'}`}>
                {user?.role} Account
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm h-10 cursor-pointer">
               <ThemeToggle />
            </div>

            <button 
              onClick={handleLogout}
              className="flex-[3] flex items-center justify-center gap-2 bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30 h-10 rounded-lg font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>

      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2">
             <span className="font-black text-gray-900 dark:text-white truncate max-w-[200px]">{displayName}</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-600 dark:text-white">
            ☰
          </button>
        </header>

        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-slate-900/50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardWrapper;