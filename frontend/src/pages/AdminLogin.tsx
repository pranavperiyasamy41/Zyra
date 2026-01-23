import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api';

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
      // 1. Use the specific Admin Login endpoint
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        
        <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Admin Portal
            </h2>
            <p className="text-gray-500 text-sm">
              Secure Access for Administrators
            </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold text-center border border-red-200 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Admin ID
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-600 transition-all"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter Admin ID"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-600 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 transform transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-8 text-center">
            <button onClick={() => navigate('/login')} className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
                ← Return to User Login
            </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;