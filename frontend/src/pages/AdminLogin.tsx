import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { ArrowLeft, Lock, ArrowRight, ShieldCheck, UserCog } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
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
      console.error("Admin Login Error:", err);
      const msg = err.response?.data?.message || 'Access Denied';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-4 relative">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-[500px] relative z-10">
        
        {/* Back navigation */}
        <div className="mb-8 flex justify-between items-center px-2">
            <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Home</span>
            </Link>
        </div>

        {/* --- MAIN CARD --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 transition-all duration-300">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl mb-6 shadow-xl shadow-blue-500/30">
                    <ShieldCheck className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                    Admin Portal
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Restricted access for system administrators.
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center mb-8 animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Admin ID</label>
                    <div className="relative group">
                        <UserCog className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all placeholder:text-slate-400"
                            placeholder="Enter Admin ID"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Secure Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="password"
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all placeholder:text-slate-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? 'Verifying...' : 'Access Dashboard'} <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <div className="mt-8 text-center">
                <Link to="/login" className="text-slate-400 hover:text-blue-600 text-xs font-bold uppercase tracking-widest transition-colors">
                    Switch to User Login
                </Link>
            </div>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;