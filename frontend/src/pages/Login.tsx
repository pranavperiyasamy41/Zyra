import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { useGoogleLogin } from '@react-oauth/google';
import { ArrowLeft, Mail, Lock, ArrowRight, User } from 'lucide-react';

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
      const msg = err.response?.data?.message || 'Login failed.';
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
        const msg = err.response?.data?.message || "Google Login Failed";
        setError(msg);
      }
    },
    onError: () => setError("Google Login Failed"),
  });

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

        {/* --- MAIN LOGIN CONTAINER --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 transition-all duration-300">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl mb-6 shadow-xl shadow-blue-500/30">
                    Z
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                    Welcome Back
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    Sign in to your Zyra account.
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center mb-8 animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            {/* CUSTOM GOOGLE BUTTON */}
            <button 
                onClick={() => googleLogin()}
                className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-white font-bold text-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group mb-8"
            >
                <GoogleIcon />
                <span>Sign in with Google</span>
            </button>

            <div className="relative flex py-2 items-center mb-8">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Or Login with Email</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Email or Username</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all placeholder:text-slate-400"
                            placeholder="user@example.com"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-bold text-slate-900 dark:text-white">Password</label>
                        <Link to="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="password"
                            className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all placeholder:text-slate-400"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                    {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </button>
            </form>

            <p className="text-center text-slate-400 text-xs mt-8 font-medium">
                New to Zyra? <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline underline-offset-4 ml-1">Create an account</Link>
            </p>

        </div>
      </div>
    </div>
  );
};

export default Login;