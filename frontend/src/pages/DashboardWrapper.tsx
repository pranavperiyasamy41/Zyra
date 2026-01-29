import React, { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import apiClient from '../api';
import toast from 'react-hot-toast';
import ImageCropModal from '../components/ImageCropModal';
// 🆕 Icons
import { 
  LayoutDashboard, 
  Pill, 
  Truck, 
  History, 
  StickyNote, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Users, 
  ShieldCheck, 
  BarChart3,
  Ticket,
  Camera
} from 'lucide-react';

const DashboardWrapper: React.FC = () => {
  const { logout, login, user } = useAuth(); 
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit for raw file
      toast.error("Image too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    };
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (croppedImage: string) => {
    try {
        const res = await apiClient.put('/users/profile', { avatar: croppedImage });
        login(res.data.token, res.data);
        toast.success("Profile Photo Updated");
        setSelectedImage(null);
    } catch (err) {
        toast.error("Failed to upload photo");
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide ${
      isActive 
        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/30 translate-x-1' 
        : 'text-slate-500 hover:bg-white/50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white hover:pl-6'
    }`;

  const displayName = user?.pharmacyName || "Zyra";
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-white/20 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl
      `}>
        <div className="p-6 flex-1 overflow-y-auto no-scrollbar">
          {/* LOGO AREA */}
          <div className="flex items-center gap-4 mb-10 pl-2">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shrink-0 ${isAdmin ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30' : 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30'}`}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h1 className={`text-xl font-black tracking-tighter leading-none ${isAdmin ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                {displayName}
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {isAdmin ? 'System Admin' : 'Pharmacy OS'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            {isAdmin ? (
               <>
                 <div className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Control Panel</div>
                 <NavLink to="/admin-dashboard" end className={navLinkClass}><BarChart3 className="w-5 h-5"/> System Overview</NavLink>
                 <NavLink to="/admin-users" className={navLinkClass}><Users className="w-5 h-5"/> Manage Users</NavLink>
                 <NavLink to="/admin-logs" className={navLinkClass}><ShieldCheck className="w-5 h-5"/> Audit Logs</NavLink> 
                 <NavLink to="/admin-support" className={navLinkClass}><Ticket className="w-5 h-5"/> Support Tickets</NavLink>
               </>
            ) : (
               /* 💊 USER VIEW */
               <>
                 <NavLink to="/dashboard" end className={navLinkClass}><LayoutDashboard className="w-5 h-5"/> Dashboard</NavLink>
                 
                 <div className="my-6 border-t border-slate-200/50 dark:border-slate-800"></div>
                 
                 <div className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operations</div>
                 <NavLink to="/inventory" className={navLinkClass}><Pill className="w-5 h-5"/> Inventory</NavLink>
                 <NavLink to="/suppliers" className={navLinkClass}><Truck className="w-5 h-5"/> Suppliers</NavLink>
                 <NavLink to="/sales" className={navLinkClass}><History className="w-5 h-5"/> Sales History</NavLink>
                 
                 <div className="my-6 border-t border-slate-200/50 dark:border-slate-800"></div>

                 <div className="px-4 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workspace</div>
                 <NavLink to="/notes" className={navLinkClass}><StickyNote className="w-5 h-5"/> Notes</NavLink>
                 <NavLink to="/support" className={navLinkClass}><LifeBuoy className="w-5 h-5"/> Support</NavLink>
                 <NavLink to="/settings" className={navLinkClass}><Settings className="w-5 h-5"/> Settings</NavLink>
               </>
            )}
          </nav>
        </div>

        {/* BOTTOM PROFILE SECTION */}
        <div className="p-4 m-4 mt-0 bg-white/50 dark:bg-slate-800/50 rounded-[2rem] border border-white/40 dark:border-slate-700/50 backdrop-blur-md shadow-lg">
          
          {/* Top Row: Avatar + Info + Toggle */}
          <div className="flex items-center gap-3 mb-4">
            {/* Profile Avatar with Hover Edit */}
            <div 
                className="relative w-11 h-11 cursor-pointer group shrink-0"
                onClick={() => fileInputRef.current?.click()}
            >
                {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover shadow-md ring-2 ring-white dark:ring-slate-700" />
                ) : (
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-700 ${isAdmin ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4 text-white" />
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfileUpload} />
            </div>

            <div className="overflow-hidden flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate leading-tight">{user?.username || 'User'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Online</p>
              </div>
            </div>

            <div className="shrink-0">
               <ThemeToggle />
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 mb-4 mx-1"></div>

          {/* Bottom Row: Logout */}
          <button 
            onClick={handleLogout}
            className="w-full group relative overflow-hidden flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 h-11 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm active:scale-[0.98] hover:shadow-red-500/20 hover:text-white dark:hover:text-white"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign Out
            </span>
          </button>
        </div>

      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

        <header className="lg:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 flex justify-between items-center z-10 sticky top-0">
          <div className="flex items-center gap-2">
             <span className="font-black text-gray-900 dark:text-white truncate max-w-[200px]">{displayName}</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-2xl text-gray-600 dark:text-white">
            ☰
          </button>
        </header>

        <div className="flex-1 overflow-auto bg-transparent relative z-10">
          <Outlet />
        </div>
      </main>

      {/* CROP MODAL */}
      {selectedImage && (
        <ImageCropModal 
            imageSrc={selectedImage} 
            onCancel={() => { setSelectedImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
            onSave={handleCropSave}
        />
      )}
    </div>
  );
};

export default DashboardWrapper;