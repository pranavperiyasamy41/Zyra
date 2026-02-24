import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api';
import toast from 'react-hot-toast';
import ImageCropModal from '../components/ImageCropModal';
import { 
  LayoutDashboard, 
  Pill, 
  Truck, 
  History, 
  NotebookPen, 
  LifeBuoy, 
  Settings, 
  LogOut, 
  Users, 
  ShieldCheck, 
  BarChart3,
  Ticket,
  Camera,
  Megaphone,
  BadgeCheck,
  Menu,
  X,
  ChevronRight,
  Command,
  Moon,
  Sun,
  PanelLeftClose
} from 'lucide-react';

const DashboardWrapper: React.FC = () => {
  const { logout, login, user } = useAuth(); 
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  // 🔄 Force Full Page Reload on Navigation
  const handleNavigation = (path: string) => {
    window.location.href = path; // Force Full Reload for ALL Routes
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { 
      toast.error("Image too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      if (fileInputRef.current) fileInputRef.current.value = ''; 
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

  const displayName = user?.pharmacyName || "Zyra";
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  // --- NAVIGATION CONFIG ---
  const navItems = isAdmin ? [
    { label: 'Overview', path: '/admin-dashboard', icon: BarChart3 },
    { label: 'Manage Users', path: '/admin-users', icon: Users },
    { label: 'Verification', path: '/admin-licenses', icon: BadgeCheck },
    { label: 'Broadcasts', path: '/admin-announcements', icon: Megaphone },
    { label: 'Audit Logs', path: '/admin-logs', icon: ShieldCheck },
    { label: 'Support Tickets', path: '/admin-support', icon: Ticket },
    { label: 'Platform Settings', path: '/admin-settings', icon: Settings },
  ] : [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', path: '/inventory', icon: Pill },
    { label: 'Sales History', path: '/sales', icon: History },
    { label: 'Suppliers', path: '/suppliers', icon: Truck },
    { label: 'Notes', path: '/notes', icon: NotebookPen },
    { label: 'Support', path: '/support', icon: LifeBuoy },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = location.pathname === item.path;
    return (
      <button 
        onClick={() => handleNavigation(item.path)}
        className={`
          w-full group relative flex items-center gap-4 px-4 py-3.5 transition-all duration-300 text-left rounded-xl
          ${isActive 
            ? 'bg-brand-highlight text-brand-dark shadow-md scale-[1.02]' 
            : 'text-brand-50/70 hover:bg-white/5 hover:text-white'
          }
        `}
      >
        <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'text-brand-dark' : 'text-brand-200/60 group-hover:scale-110 group-hover:text-brand-highlight'}`} />
        <span className={`font-bold text-sm tracking-wide ${isActive ? 'text-brand-dark' : ''}`}>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 flex flex-col overflow-hidden">
      
      {/* ==================== 1. FIXED HEADER ==================== */}
      <header 
        style={{ background: 'linear-gradient(90deg, #0E5A4E 0%, #1E7F4F 50%, #25A756 100%)' }}
        className="fixed top-0 left-0 right-0 z-40 h-20 border-b border-brand-dark shadow-md flex items-center justify-between px-6 lg:px-8 transition-all"
      >
        
        {/* Left: Menu Trigger & Brand */}
        <div className="flex items-center gap-6">
            <button 
                onClick={() => setIsMenuOpen(true)}
                className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-brand-50 hover:text-white group"
            >
                <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>
            
            <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => handleNavigation(isAdmin ? '/admin-dashboard' : '/dashboard')}
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary font-black text-xl shadow-lg shrink-0 bg-brand-highlight shadow-black/20 group-hover:scale-105 transition-transform`}>
                    {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden md:block">
                    <h1 className="text-lg font-black tracking-tight text-white group-hover:text-brand-highlight transition-colors">
                        {displayName}
                    </h1>
                </div>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            
            {/* PROFILE DROPDOWN */}
            <div className="relative">
                <button 
                    className="relative w-10 h-10 cursor-pointer group outline-none"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full rounded-full object-cover ring-2 ring-brand-highlight shadow-md hover:ring-white transition-all" />
                    ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-brand-dark text-brand-highlight font-bold text-sm ring-2 ring-brand-highlight hover:ring-white transition-all">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                        <div className="absolute right-0 top-full mt-4 w-72 bg-white dark:bg-[#043F3A] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/5 p-4 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                            
                            {/* User Info Header */}
                            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-white/5 mb-4">
                                <div className="w-12 h-12 rounded-full bg-brand-highlight text-brand-primary flex items-center justify-center font-black text-xl shrink-0 shadow-sm overflow-hidden">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="overflow-hidden text-left">
                                    <p className="font-bold text-slate-900 dark:text-white truncate">{user?.username}</p>
                                    <p className="text-xs text-slate-500 dark:text-brand-200/60 truncate font-medium">{user?.email}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-1.5">
                                {/* Modern Theme Switcher Segmented Control */}
                                <div className="bg-slate-50 dark:bg-black/20 p-1 rounded-xl flex items-center gap-1 mb-2">
                                    <button 
                                        onClick={() => theme !== 'light' && toggleTheme()}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${theme === 'light' ? 'bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-brand-highlight/10 hover:text-brand-highlight'}`}
                                    >
                                        <Sun className="w-3.5 h-3.5" /> Light
                                    </button>
                                    <button 
                                        onClick={() => theme !== 'dark' && toggleTheme()}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${theme === 'dark' ? 'bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white shadow-lg scale-105' : 'text-slate-400 hover:bg-brand-highlight/10 hover:text-brand-highlight'}`}
                                    >
                                        <Moon className="w-3.5 h-3.5" /> Dark
                                    </button>
                                </div>

                                <button 
                                    onClick={() => { fileInputRef.current?.click(); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5 text-slate-600 dark:text-brand-50 font-bold text-xs transition-all duration-300 group hover:scale-[1.02] text-left"
                                >
                                    <div className="p-1.5 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-highlight rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </div>
                                    Change Photo
                                </button>
                                
                                <button 
                                    onClick={() => { handleNavigation(isAdmin ? '/admin-settings' : '/settings'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-white/5 text-slate-600 dark:text-brand-50 font-bold text-xs transition-all duration-300 group hover:scale-[1.02] text-left"
                                >
                                    <div className="p-1.5 bg-brand-primary/10 dark:bg-white/10 text-brand-primary dark:text-brand-highlight rounded-lg group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <Settings className="w-4 h-4" />
                                    </div>
                                    Account Settings
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>

                                <button 
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white hover:opacity-90 transition-all duration-300 font-bold text-xs group hover:scale-[1.02] hover:-translate-y-0.5 shadow-md shadow-brand-btn-start/20 text-left"
                                >
                                    <div className="p-1.5 bg-white/10 text-white rounded-lg group-hover:bg-white/20 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                    </div>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
                
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleProfileUpload} />
            </div>
        </div>
      </header>

      {/* ==================== 2. SLIDING NAVIGATION PANEL ==================== */}
      <div 
        className={`fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-full md:w-[280px] bg-[#043F3A] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) flex flex-col border-r border-white/5
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-white cursor-pointer group" onClick={() => handleNavigation(isAdmin ? '/admin-dashboard' : '/dashboard')}>
                <img src="/logo.png" alt="Zyra Logo" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
            </div>
            <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-brand-highlight hover:bg-brand-highlight hover:text-brand-dark hover:border-brand-highlight transition-all duration-300 group/close shadow-sm shadow-brand-highlight/5"
            >
                <PanelLeftClose className="w-6 h-6 transition-transform group-hover/close:scale-110" />
            </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
            <div className="space-y-1">
                {navItems.map((item, idx) => (
                    <NavItem key={idx} item={item} />
                ))}
            </div>
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/10">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white hover:opacity-90 transition-all duration-300 font-bold text-sm tracking-wide group shadow-lg shadow-brand-btn-start/10 hover:-translate-y-0.5 active:scale-95"
            >
                <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20 transition-colors">
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </div>
                Sign Out
            </button>
        </div>
      </aside>

      {/* ==================== 3. MAIN CONTENT AREA ==================== */}
      <main className="flex-1 overflow-auto bg-transparent relative z-10 pt-20 scroll-smooth transition-all duration-300">
        <div className={(location.pathname === '/dashboard' || location.pathname === '/inventory' || location.pathname === '/sales' || location.pathname === '/suppliers' || location.pathname === '/notes' || location.pathname === '/support' || location.pathname === '/settings' || location.pathname === '/admin-dashboard' || location.pathname === '/admin-users' || location.pathname === '/admin-licenses' || location.pathname === '/admin-announcements' || location.pathname === '/admin-logs' || location.pathname === '/admin-support' || location.pathname === '/admin-settings') ? 'w-full' : 'animate-fade-in-up max-w-7xl mx-auto p-6 lg:p-10'}>
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