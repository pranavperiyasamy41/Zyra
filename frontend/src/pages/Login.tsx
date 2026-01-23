import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';
import { GoogleLogin } from '@react-oauth/google';

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

        // 🚫 BLOCK ADMINS from using this page
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        {/* ✅ UPDATED TEXT */}
        <p className="text-center text-gray-500 mb-8">
          Login to Zyra Smart Inventory
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold text-center border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Email or Username
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-600 transition-all"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-600 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login to Dashboard'}
          </button>
        </form>

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
      </div>
    </div>
  );
};

export default Login;