import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { useGoogleLogin } from '@react-oauth/google';
import { ArrowLeft, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Login: React.FC = () => {
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
      const res = await apiClient.post('/auth/login', { 
        emailOrUsername, 
        password 
      });

      if (res.data.token) {
        const userRole = res.data.user.role;
        if (userRole === 'admin' || userRole === 'superadmin') {
            setError("⛔ Admins must use the Admin Portal.");
            setLoading(false);
            return; 
        }
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      let msg = err.response?.data?.message || 'Login failed.';
      if (msg === 'Invalid credentials') {
          msg = "Incorrect password or username. Please try again.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await apiClient.post('/auth/google', {
          token: tokenResponse.access_token
        });
        
        const userRole = res.data.user.role;
        if (userRole === 'admin' || userRole === 'superadmin') {
           setError("⛔ Admins must use the Admin Portal.");
           return;
        }

        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } catch (err: any) {
        console.error("Google Login API Error:", err);
        const msg = err.response?.data?.message || "Google Login Failed";
        setError(msg);
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Heavy Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-dark/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-brand-highlight/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out-expo px-2 sm:px-0">
        
        {/* Back navigation */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center px-2 animate-in fade-in slide-in-from-left-4 duration-1000 delay-300 fill-mode-both">
            <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-all">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Return to Home</span>
            </Link>
        </div>

        {/* --- MAIN LOGIN CONTAINER --- */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/60 dark:border-slate-700 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-brand-primary/10 hover:border-brand-primary/20">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-6 sm:mb-8 animate-in fade-in zoom-in-95 duration-1000 delay-150 fill-mode-both">
                <img src="/logo.png" alt="Zyra Logo" className="w-16 sm:w-20 h-auto mx-auto mb-3 sm:mb-4 object-contain drop-shadow-lg transform transition-transform hover:scale-110 hover:rotate-3" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                    Welcome Back
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                    Secure Dashboard Access
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold text-center mb-6 animate-in fade-in zoom-in-95 duration-300">
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
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight">Password</label>
                        <Link to="/forgot-password" title="Recover Access" className="text-[9px] sm:text-[10px] font-bold text-brand-primary dark:text-brand-highlight hover:opacity-70 transition-all">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                        <input
                                                                type={showPwd ? "text" : "password"}
                                                                autoComplete="current-password"
                                                                className="w-full pl-11 md:pl-12 pr-11 md:pr-12 py-3 md:py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-sm outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary dark:text-white shadow-sm transition-all placeholder:text-slate-400/70 hover:bg-white dark:hover:bg-slate-800/50 hover:border-brand-primary/30"
                                                                placeholder="Enter Password"                            value={password}
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
                        {loading ? 'Verifying...' : 'Sign In'} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </form>

            <div className="relative flex py-5 sm:py-6 items-center animate-in fade-in duration-1000 delay-500 fill-mode-both">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Or Access with</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            <button 
                onClick={() => googleLogin()}
                className="w-full h-11 md:h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-700 dark:text-white font-bold text-xs transition-all duration-300 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 active:scale-[0.98] flex items-center justify-center gap-3 mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-600 fill-mode-both"
            >
                <GoogleIcon />
                <span>Google Account</span>
            </button>

            <p className="text-center text-slate-400 text-[10px] sm:text-xs font-medium animate-in fade-in duration-1000 delay-700 fill-mode-both">
                New to Zyra? <Link to="/register" className="text-brand-primary dark:text-brand-highlight font-bold hover:opacity-70 transition-colors ml-1">Create Account</Link>
            </p>

        </div>
      </div>
    </div>
  );
};

export default Login;