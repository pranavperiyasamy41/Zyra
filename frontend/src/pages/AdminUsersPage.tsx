import React, { useState } from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; 
import EditUserModal from '../components/EditUserModal';
import AddUserModal from '../components/AddUserModal';
import { AlertTriangle, Users, ShieldCheck, Trash2, CheckCircle, UserCog, Search, Filter, MoreVertical, X, Shield, Edit3, ChevronDown, Lock, Unlock, UserPen, UserMinus, Plus, FileText, Check, User as UserIcon, Save, Ban } from 'lucide-react';

interface AppUser {
  _id: string;
  email: string;
  username: string;
  role: string;
  pharmacyName: string;
  isApproved: boolean; 
  status: string;
  isSuspended: boolean;
  licenseDocument?: string; // 🆕 Added Field
  // ... other fields are optional in list view
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  drugLicense?: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminUsersPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const { data: users, error, isLoading, mutate } = useSWR<AppUser[]>(
    isAdmin ? '/admin/users' : null, 
    fetcher
  ); 
  
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [userToEdit, setUserToEdit] = useState<AppUser | null>(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // 🆕 Custom Confirmation State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'delete' | 'suspend' | null;
    user: AppUser | null;
  }>({ isOpen: false, action: null, user: null });

  // 🆕 Custom Role State
  const [roleModal, setRoleModal] = useState<{
    isOpen: boolean;
    user: AppUser | null;
    newRole: string;
  }>({ isOpen: false, user: null, newRole: '' });

  const [searchTerm, setSearchTerm] = useState('');

  const processedUsers = users?.map(u => ({
    ...u,
    isApproved: u.status === 'APPROVED'
  })) || [];

  const filteredUsers = processedUsers.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.pharmacyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingUsers = filteredUsers.filter(u => !u.isApproved);
  const displayUsers = activeTab === 'pending' ? pendingUsers : filteredUsers;

  const handleApprove = async (userId: string) => {
      try {
          await apiClient.put(`/admin/approve/${userId}`);
          mutate(); 
          toast.success("User Approved Successfully!");
      } catch (err: any) {
          toast.error('Approval failed.');
      }
  };

  const initiateRoleChange = (user: AppUser) => {
    setRoleModal({ isOpen: true, user, newRole: user.role });
  };

  const executeRoleChange = async () => {
    const { user, newRole } = roleModal;
    if (!user) return;
    try {
        await apiClient.put(`/admin/users/${user._id}`, { role: newRole });
        mutate(); 
        toast.success("Role Updated");
    } catch (err: any) {
        toast.error('Failed to update role.');
    } finally {
        setRoleModal({ isOpen: false, user: null, newRole: '' });
    }
  };

  // 🟢 Trigger Suspend Modal
  const initiateSuspend = (user: AppUser) => {
    setConfirmModal({ isOpen: true, action: 'suspend', user });
  };

  // 🔴 Trigger Delete Modal
  const initiateDelete = (user: AppUser) => {
    setConfirmModal({ isOpen: true, action: 'delete', user });
  };

  // ⚡ Execute Action
  const executeConfirmation = async () => {
    const { action, user } = confirmModal;
    if (!user || !action) return;

    try {
        if (action === 'suspend') {
            await apiClient.put(`/admin/users/${user._id}/suspend`);
            toast.success(user.isSuspended ? "User Access Restored" : "User Suspended");
        } else if (action === 'delete') {
            await apiClient.delete(`/admin/users/${user._id}`);
            toast.success("User Account Deleted");
        }
        mutate(); // Refresh List
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Action failed.');
    } finally {
        setConfirmModal({ isOpen: false, action: null, user: null });
    }
  };

  if (authLoading || (isAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying Admin Credentials...</div>;
  
  if (!authLoading && !isAdmin) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⛔ Access Denied: Administrator Privileges Required
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⚠️ Failed to fetch users. Please check your connection.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-transparent transition-colors pb-20">
      
      {/* 📌 PREMIUM HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-all shadow-md">
        <div className="w-full md:w-auto text-center md:text-left">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center justify-center md:justify-start gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-teal-600 dark:bg-teal-500 rounded-xl text-white shadow-lg shadow-teal-600/30 dark:shadow-teal-500/20">
                    <UserCog className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                User Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-1 font-medium">Control panel for system access and roles.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 text-white w-full sm:w-auto px-6 py-3 md:py-2.5 rounded-xl md:rounded-2xl font-black shadow-xl shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider whitespace-nowrap"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Plus className="w-4 h-4 relative z-10" /> <span className="relative z-10 pr-1">Create User</span>
            </button>

            <div className="relative group w-full md:w-72 lg:w-96">
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] flex items-center justify-center shadow-lg shadow-[#0B5E4A]/20 transition-all group-focus-within:scale-110 z-10">
                    <Search className="w-3.5 h-3.5 text-white" />
                </div>
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md dark:text-white outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-xs md:text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[230px] sm:h-[180px] md:h-[140px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-2 md:pt-6 max-w-[1600px] mx-auto">
        
        {/* TAB SWITCHER */}
        <div className="flex justify-center mb-6 md:mb-8">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex w-full md:w-auto gap-1 shadow-inner">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 md:flex-none justify-center px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'pending' 
                        ? 'bg-amber-500 text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" /> Pending ({pendingUsers.length})
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 md:flex-none justify-center px-4 md:px-8 py-2.5 md:py-3 rounded-xl text-[10px] md:text-sm font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'all' 
                        ? 'bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white shadow-md' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                >
                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4" /> All Users
                </button>
            </div>
        </div>

        {/* USER LIST - CARD VIEW */}
        <div className="space-y-4">
            {displayUsers.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm md:text-lg">No users found.</p>
                </div>
            ) : displayUsers.map((appUser) => (
                <div 
                    key={appUser._id} 
                    className={`group relative bg-white dark:bg-slate-900 p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 ${
                        appUser.isSuspended 
                        ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/10' 
                        : 'border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900'
                    }`}
                >
                    {/* AVATAR & INFO */}
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-1/3">
                        <div className={`relative w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black text-white shadow-lg shrink-0 ${
                            appUser.isSuspended ? 'bg-slate-400 grayscale' :
                            appUser.role === 'admin' 
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        }`}>
                            {appUser.username.charAt(0).toUpperCase()}
                            {appUser.isSuspended && (
                                <div className="absolute -bottom-1 -right-1 bg-red-500 text-white p-0.5 md:p-1 rounded-full shadow-sm border-2 border-white dark:border-slate-900">
                                    <Ban className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                </div>
                            )}
                        </div>
                        <div className="overflow-hidden flex-1">
                            <h3 className={`font-black text-sm md:text-lg truncate ${appUser.isSuspended ? 'text-slate-500 dark:text-slate-400 line-through decoration-red-500' : 'text-slate-900 dark:text-white'}`}>
                                {appUser.username}
                            </h3>
                            <p className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                {appUser.role === 'admin' && <Shield className="w-3 h-3 text-purple-500" />}
                                {appUser.email}
                            </p>
                        </div>
                    </div>

                    {/* PHARMACY DETAILS */}
                    <div className="w-full md:w-1/4 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start gap-2">
                        <div className="flex-1 md:flex-none">
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">Pharmacy Name</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200 text-xs md:text-sm truncate">
                                {appUser.pharmacyName || <span className="italic text-slate-400">Not Provided</span>}
                            </p>
                        </div>
                        <div className="flex-shrink-0 md:mt-2">
                            {appUser.licenseDocument ? (
                                <a 
                                    href={appUser.licenseDocument} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[9px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all border border-blue-100 dark:border-blue-900/30 uppercase tracking-wider"
                                >
                                    <FileText className="w-3 h-3" /> <span className="hidden sm:inline">View</span> License
                                </a>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 md:px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[9px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-700 uppercase tracking-wider">
                                    <X className="w-3 h-3" /> No Doc
                                </span>
                            )}
                        </div>
                    </div>

                    {/* STATUS & ROLE */}
                    <div className="w-full md:w-1/4 flex flex-row items-center gap-4 md:gap-6 justify-between md:justify-start">
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            {appUser.isSuspended ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 uppercase tracking-wide border border-red-200 dark:border-red-800">
                                    Suspended
                                </span>
                            ) : appUser.isApproved ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 uppercase tracking-wide border border-emerald-200 dark:border-emerald-800">
                                    Active
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 uppercase tracking-wide border border-amber-200 dark:border-amber-800 animate-pulse">
                                    Pending
                                </span>
                            )}
                        </div>
                        
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Role</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                appUser.role === 'admin' 
                                ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800' 
                                : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                            }`}>
                                {appUser.role}
                            </span>
                        </div>
                    </div>

                    {/* ACTIONS TOOLBAR */}
                    <div className="w-full md:w-auto ml-auto flex items-center justify-between md:justify-end gap-2 bg-slate-50 dark:bg-slate-800/50 md:bg-transparent p-2 md:p-0 rounded-xl md:rounded-none">
                        <div className="flex items-center gap-2 flex-1 md:flex-none justify-center">
                            {!appUser.isApproved && !appUser.isSuspended && (
                                <button 
                                    onClick={() => handleApprove(appUser._id)} 
                                    className="bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] text-white px-3 py-2 rounded-xl text-[10px] font-bold shadow-lg shadow-[#0B5E4A]/30 transition-all active:scale-95 flex items-center gap-1.5 w-full md:w-auto justify-center"
                                >
                                    <CheckCircle className="w-3 h-3" /> Approve
                                </button>
                            )}

                            {appUser.isApproved && (
                                <button 
                                    onClick={() => initiateSuspend(appUser)}
                                    disabled={user?._id === appUser._id}
                                    className={`p-2 rounded-xl transition-all active:scale-95 disabled:opacity-30 flex-1 md:flex-none flex justify-center ${
                                        appUser.isSuspended 
                                        ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-500' 
                                        : 'bg-amber-50 dark:bg-amber-900/10 text-amber-500'
                                    }`}
                                    title={appUser.isSuspended ? "Re-activate" : "Suspend"}
                                >
                                    {appUser.isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                </button>
                            )}

                            <button 
                                onClick={() => setUserToEdit(appUser)}
                                className="p-2 bg-white dark:bg-slate-800 text-slate-500 hover:text-teal-500 rounded-xl transition-all active:scale-95 shadow-sm md:shadow-none flex-1 md:flex-none flex justify-center"
                                title="Edit Details"
                            >
                                <UserPen className="w-4 h-4" />
                            </button>

                            {!appUser.isSuspended && (
                                <button 
                                    onClick={() => initiateRoleChange(appUser)}
                                    disabled={!appUser.isApproved || user?._id === appUser._id}
                                    className="p-2 bg-blue-50 dark:bg-blue-900/10 text-blue-500 rounded-xl active:scale-95 disabled:opacity-30 shadow-sm md:shadow-none flex-1 md:flex-none flex justify-center"
                                    title="Edit Role"
                                >
                                    <Shield className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <button 
                            onClick={() => initiateDelete(appUser)}
                            disabled={user?._id === appUser._id} 
                            className="p-2 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl active:scale-95 disabled:opacity-30 shadow-sm md:shadow-none ml-2 md:ml-0 flex-1 md:flex-none flex justify-center"
                            title="Delete User"
                        >
                            <UserMinus className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Edit Modal */}
        <EditUserModal 
            isOpen={!!userToEdit} 
            onClose={() => setUserToEdit(null)} 
            user={userToEdit} 
            mutate={mutate} 
        />

        <AddUserModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            mutate={mutate} 
        />

        {/* Confirmation Modal */}
        {confirmModal.isOpen && confirmModal.user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200">
                    <div className="flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-sm ${
                            confirmModal.action === 'delete' 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600' 
                            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600'
                        }`}>
                            {confirmModal.action === 'delete' ? <Trash2 className="w-8 h-8" /> : <Ban className="w-8 h-8" />}
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                            {confirmModal.action === 'delete' ? 'Delete User?' : confirmModal.user.isSuspended ? 'Re-activate User?' : 'Suspend User?'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                            {confirmModal.action === 'delete' 
                                ? `Are you sure you want to permanently delete ${confirmModal.user.username}? This action cannot be undone.` 
                                : confirmModal.user.isSuspended 
                                    ? `This will restore access for ${confirmModal.user.username}.`
                                    : `This will block ${confirmModal.user.username} from accessing the platform.`
                            }
                        </p>
                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={() => setConfirmModal({ isOpen: false, action: null, user: null })}
                                className="flex-1 py-3.5 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeConfirmation}
                                className={`flex-1 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all text-sm active:scale-95 ${
                                    confirmModal.action === 'delete' 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30' 
                                    : 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                                }`}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Role Selection Modal */}
        {roleModal.isOpen && roleModal.user && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl w-full max-w-md border border-white/20 dark:border-slate-800 scale-100 animate-in zoom-in-95 duration-200 flex flex-col">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-t-[2rem]">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" /> Assign Role
                            </h2>
                            <p className="text-xs text-slate-500 font-bold mt-1">Change permissions for {roleModal.user.username}</p>
                        </div>
                        <button onClick={() => setRoleModal({ isOpen: false, user: null, newRole: '' })} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-red-500">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-4">
                        {[
                            { id: 'user', label: 'Standard User', desc: 'Can manage own inventory and sales.', icon: UserIcon, color: 'blue' },
                            { id: 'admin', label: 'Administrator', desc: 'Full system access and user management.', icon: ShieldCheck, color: 'purple' }
                        ].map((role) => {
                            const isSelected = roleModal.newRole === role.id;
                            return (
                                <div 
                                    key={role.id}
                                    onClick={() => setRoleModal({ ...roleModal, newRole: role.id })}
                                    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex items-center gap-4 ${
                                        isSelected 
                                        ? `border-${role.color}-500 bg-${role.color}-50/50 dark:bg-${role.color}-900/20 shadow-lg shadow-${role.color}-500/10 scale-[1.02]` 
                                        : 'border-slate-100 dark:border-slate-800 bg-transparent hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <div className={`p-3 rounded-xl ${isSelected ? `bg-${role.color}-100 text-${role.color}-600` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                        <role.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-black text-sm uppercase tracking-wide ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{role.label}</h4>
                                        <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">{role.desc}</p>
                                    </div>
                                    {isSelected && (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shadow-md animate-in zoom-in duration-300 bg-${role.color}-500`}>
                                            <Check className="w-3.5 h-3.5 stroke-[4]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-xl rounded-b-[2rem] flex justify-end gap-3">
                        <button 
                            onClick={() => setRoleModal({ isOpen: false, user: null, newRole: '' })}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-xs uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={executeRoleChange}
                            disabled={roleModal.newRole === roleModal.user.role}
                            className="px-8 py-3 rounded-xl font-black text-white bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 shadow-xl shadow-[#0B5E4A]/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Update Role <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default AdminUsersPage;