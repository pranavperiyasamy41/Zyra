import React from 'react';
import useSWR from 'swr';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, CheckCircle, XCircle, FileText, ExternalLink, BadgeCheck } from 'lucide-react';

interface LicenseUser {
  _id: string;
  username: string;
  pharmacyName: string;
  drugLicense: string;
  licenseDocument?: string;
  email: string;
}

const fetcher = (url: string) => apiClient.get(url).then(res => res.data);

const AdminLicensePage = () => {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const { data: users, mutate, error, isLoading } = useSWR<LicenseUser[]>(
    isAdmin ? '/admin/licenses/pending' : null, 
    fetcher
  );

  const handleVerify = async (id: string, status: boolean) => {
    try {
      await apiClient.put(`/admin/licenses/${id}`, { status });
      mutate();
      toast.success(status ? "License Verified" : "License Rejected");
    } catch (err) {
      toast.error("Action Failed");
    }
  };

  if (authLoading || (isAdmin && isLoading)) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold animate-pulse text-xs uppercase tracking-widest">Verifying License Portal Access...</div>;

  if (!authLoading && !isAdmin) {
    return (
      <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
        ⛔ Access Denied: Administrator Privileges Required
      </div>
    );
  }

  if (error) return (
    <div className="p-8 text-red-500 font-bold text-center mt-10 bg-red-50 dark:bg-red-900/10 rounded-2xl mx-6 border border-red-200 dark:border-red-900/30">
      ⚠️ Failed to fetch licenses. Please check your connection.
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent">
      
      {/* HEADER */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-white dark:bg-slate-900 border-b border-white/20 dark:border-slate-800 p-4 md:p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between shadow-md gap-4">
        <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2 md:gap-3">
                <BadgeCheck className="w-6 h-6 md:w-8 md:h-8 text-teal-600 dark:text-teal-400" /> License Verification
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium">Review and approve pharmacy credentials.</p>
        </div>
      </div>

      {/* 📌 RESPONSIVE SPACER FOR FIXED HEADER */}
      <div className="h-[140px] md:h-[140px] w-full"></div>

      <div className="p-4 md:p-6 lg:p-8 pt-2 md:pt-6 max-w-6xl mx-auto">
        
        {/* LIST */}
        <div className="grid grid-cols-1 gap-4">
            {users?.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-700">
                    <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold text-sm md:text-lg">No pending verifications.</p>
                </div>
            ) : users?.map((user) => (
                <div key={user._id} className="group bg-white dark:bg-slate-900 p-5 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                    
                    {/* INFO */}
                    <div className="flex-1 w-full">
                        <div className="flex items-center justify-between md:justify-start gap-3 mb-1">
                            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white truncate">{user.pharmacyName}</h3>
                            <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wide">Pending</span>
                        </div>
                        <p className="text-[10px] md:text-sm text-slate-500 dark:text-slate-400 font-medium mb-3 truncate">{user.username} • {user.email}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 md:gap-4">
                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                <span className="font-mono text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300">{user.drugLicense}</span>
                            </div>
                            
                            {user.licenseDocument && (
                                <a 
                                    href={user.licenseDocument} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-[10px] md:text-xs font-bold hover:underline bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-900/30"
                                >
                                    View Document <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => handleVerify(user._id, false)}
                            className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/30 transition-colors text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" /> Reject
                        </button>
                        <button 
                            onClick={() => handleVerify(user._id, true)}
                            className="flex-1 md:flex-none justify-center px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-black text-white bg-gradient-to-r from-[#0B5E4A] to-[#1FAE63] hover:shadow-[#1FAE63]/40 shadow-lg shadow-[#0B5E4A]/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                            <CheckCircle className="w-4 h-4" /> Verify
                        </button>
                    </div>

                </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default AdminLicensePage;