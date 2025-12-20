import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const AdminLoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth(); // We will call the standard login context function

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // --- USE THE DEDICATED ADMIN LOGIN ENDPOINT ---
      const response = await apiClient.post('/auth/admin-login', {
        emailOrUsername,
        password,
      });

      // Response contains token and user object
      const { token, user } = response.data;
      
      // Save user state globally via AuthContext
      login(token, user); 
      
      // Redirect Admin to the dashboard
      navigate('/dashboard'); 

    } catch (err: any) {
      console.error('Admin login error:', err);
      const errorMessage = err.response?.data?.message || 'Login failed. Check server status.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
      <div className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-2xl bg-white dark:bg-slate-800">
        
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-extrabold text-red-600 dark:text-red-400">
              Admin Control Login
            </h2>
            <ThemeToggle />
        </div>
        
        <p className="text-sm text-gray-500 dark:text-slate-400">
            Access restricted to users with Admin or SuperAdmin privileges only.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email or Username */}
          <div>
            <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Admin Email or Username
            </label>
            <input
              id="emailOrUsername" type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login to Admin Panel'}
            </button>
          </div>
        </form>
        
        {/* Link back to standard login */}
        <div className="text-center text-sm">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Are you a standard Pharmacy User? Click here.
            </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;