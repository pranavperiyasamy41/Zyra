import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/admin-login', { 
        emailOrUsername, 
        password 
      });

      if (res.data.token) {
        login(res.data.token, res.data.user);
        navigate('/admin-dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Admin authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Heavy Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-dark/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-brand-highlight/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out-expo px-2 sm:px-0">
        
        {/* Navigation */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center px-2 animate-in fade-in slide-in-from-left-4 duration-1000 delay-300 fill-mode-both">
            <Link to="/login" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Standard Login</span>
            </Link>
        </div>

        {/* --- MAIN ADMIN LOGIN CONTAINER --- */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/60 dark:border-slate-700 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-brand-primary/10 hover:border-brand-primary/20">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-6 sm:mb-8 animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
                <img src="/logo.png" alt="Zyra Logo" className="w-16 sm:w-20 h-auto mx-auto mb-3 sm:mb-4 object-contain drop-shadow-lg transform transition-transform hover:scale-110 hover:rotate-3" />
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 dark:bg-brand-highlight/10 border border-brand-primary/20 dark:border-brand-highlight/20 mb-3 sm:mb-4">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-primary dark:text-brand-highlight" />
                    <span className="text-[9px] sm:text-[10px] font-black text-brand-primary dark:text-brand-highlight uppercase tracking-[0.15em]">Admin Portal</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                    Console Access
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium">
                    Authorized personnel only
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-2xl text-xs font-bold text-center mb-6 animate-in fade-in zoom-in-95 duration-300">
                    {error}
                </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
                <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Username</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-11 md:pl-12 pr-5 py-3 md:py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary dark:text-white shadow-sm transition-all placeholder:text-slate-400/70 hover:bg-white dark:hover:bg-slate-800/50 hover:border-brand-primary/30"
                            placeholder="Email or Username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                            type={showPwd ? "text" : "password"}
                            className="w-full pl-11 md:pl-12 pr-11 md:pr-12 py-3 md:py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary dark:text-white shadow-sm transition-all placeholder:text-slate-400/70 hover:bg-white dark:hover:bg-slate-800/50 hover:border-brand-primary/30"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPwd(!showPwd)}
                            className="absolute right-4 top-3 md:top-3.5 text-slate-400 hover:text-brand-primary transition-all"
                        >
                            {showPwd ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative overflow-hidden w-full h-12 md:h-14 bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-brand-btn-start/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    <span className="relative flex items-center gap-2">
                        {loading ? 'Authenticating...' : 'Login'} <ShieldCheck className="w-4 h-4" />
                    </span>
                </button>
            </form>

            <p className="text-center text-slate-400 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.2em] mt-8 sm:mt-10 animate-in fade-in duration-1000 delay-700 fill-mode-both">
                System Security Layer 4.0
            </p>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;