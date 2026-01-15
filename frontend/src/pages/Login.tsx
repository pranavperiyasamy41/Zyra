import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { GoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  // Toggle State: 'user' or 'admin'
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Reset form when switching tabs
  const switchTab = (type: 'user' | 'admin') => {
    setLoginType(type);
    setError('');
    setEmailOrUsername('');
    setPassword('');
  };

  // 1. HANDLE LOGIN SUBMISSION (Handles both User and Admin)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Determine Endpoint based on Tab (This part is fine)
    const endpoint = loginType === 'admin' ? '/auth/admin-login' : '/auth/login';

    try {
      const res = await apiClient.post(endpoint, { 
        emailOrUsername, 
        password 
      });

      if (res.data.token) {
        // 1. Save Session
        login(res.data.token, res.data.user);
        
        // 2. ✅ SMART REDIRECT (Checks the REAL role from database)
        if (res.data.user.role === 'admin' || res.data.user.role === 'superadmin') {
           console.log("👑 Admin Detected. Redirecting to Admin Dashboard...");
           navigate('/admin-dashboard');
        } else {
           console.log("👤 User Detected. Redirecting to User Dashboard...");
           navigate('/dashboard');
        }
      } else {
        setError("Login succeeded but token is missing.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const msg = err.response?.data?.message || 'Login failed.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. GOOGLE LOGIN (User Only)
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("❌ Google Login Error:", err);
      // ✅ FIX: Show the actual message from the backend (e.g., "Account Pending")
      const msg = err.response?.data?.message || "Google Login Failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700 transition-all">
        
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">
          {loginType === 'admin' ? 'Admin Portal' : 'Welcome Back'}
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {loginType === 'admin' ? 'System Administrator Access' : 'Login to manage your pharmacy'}
        </p>

        {/* 🔘 TAB SWITCHER */}
        <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-xl mb-8">
          <button
            onClick={() => switchTab('user')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              loginType === 'user' 
                ? 'bg-white dark:bg-slate-600 shadow text-blue-600 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Pharmacy User
          </button>
          <button
            onClick={() => switchTab('admin')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              loginType === 'admin' 
                ? 'bg-red-50 dark:bg-red-900/30 shadow text-red-600 dark:text-red-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
            }`}
          >
            Administrator
          </button>
        </div>

        {/* 🔴 ERROR ALERT */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold text-center border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        {/* 📝 LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              {loginType === 'admin' ? 'Admin Username' : 'Email or Username'}
            </label>
            <input
              type="text"
              className={`w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 transition-all ${
                loginType === 'admin' 
                  ? 'focus:ring-red-500 dark:border-slate-600' 
                  : 'focus:ring-blue-600 dark:border-slate-600'
              }`}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className={`w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 transition-all ${
                loginType === 'admin' 
                  ? 'focus:ring-red-500 dark:border-slate-600' 
                  : 'focus:ring-blue-600 dark:border-slate-600'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 ${
              loginType === 'admin' 
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
            }`}
          >
            {loading ? 'Authenticating...' : loginType === 'admin' ? 'Access Control Panel' : 'Login to Dashboard'}
          </button>
        </form>

        {/* 🌐 GOOGLE LOGIN (User Tab Only) */}
        {loginType === 'user' && (
          <div className="mt-8">
            <div className="relative flex py-2 items-center mb-6">
              <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase">Or continue with</span>
              <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="filled_blue"
                shape="pill"
                width="100%"
              />
            </div>

            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        )}

        {/* 🔙 Back Link (Admin Tab Only) */}
        {loginType === 'admin' && (
          <p className="mt-6 text-center text-sm text-gray-500">
            <button onClick={() => switchTab('user')} className="hover:text-gray-800 dark:hover:text-white underline">
              Back to User Login
            </button>
          </p>
        )}

      </div>
    </div>
  );
};

export default Login;