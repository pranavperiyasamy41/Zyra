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

  // 1. STANDARD LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔵 Attempting Standard Login...");
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/auth/login', { emailOrUsername, password });
      console.log("✅ Backend Responded:", res.data);

      if (res.data.token) {
        console.log("🔐 Token found. Logging in...");
        login(res.data.token, res.data.user);
        
        console.log("🚀 Navigating to Dashboard...");
        navigate('/dashboard');
      } else {
        console.error("❌ No token in response!");
        setError("Login succeeded but no token received.");
      }
    } catch (err: any) {
      console.error("❌ Login Error:", err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // 2. GOOGLE LOGIN
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("🔵 Google Popup Finished. Token:", credentialResponse.credential);
    try {
      const res = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      });
      console.log("✅ Google Backend Success:", res.data);
      
      login(res.data.token, res.data.user);
      console.log("🚀 Navigating to Dashboard...");
      navigate('/dashboard');
    } catch (err: any) {
      console.error("❌ Google Backend Error:", err);
      console.log("Error Details:", err.response?.data);
      setError("Google Login Failed. Check Console.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
        
        <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-8">Login to manage your pharmacy</p>

        {/* GOOGLE BUTTON */}
        <div className="flex justify-center mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error("❌ Google Button Error (Popup Failed)");
              setError("Google Login Failed");
            }}
            theme="filled_blue"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200 dark:border-slate-700"></div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email or Username</label>
            <input
              type="text"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-xl border bg-gray-50 dark:bg-slate-900 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-600 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;