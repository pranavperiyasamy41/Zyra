import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Step 1: Request OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setStep(2);
      // Removed alert for cleaner UX
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { email, otp, newPassword });
      alert('🎉 Password Reset Successful! Please Login.');
      navigate('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700 relative z-10">
        
        {/* Header Icon */}
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 mb-4">
                {step === 1 ? '🔐' : '✨'}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
                {step === 1 ? 'Recover Account' : 'Reset Password'}
            </h1>
            <p className="text-slate-400 text-sm mt-2">
                {step === 1 ? 'Enter your email to receive a secure code.' : 'Create a strong new password.'}
            </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Email Address</label>
              <input 
                type="email" 
                required 
                className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                placeholder="you@pharmacy.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Enter OTP</label>
              <input 
                type="text" 
                required 
                className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-center tracking-[0.5em] font-mono text-xl transition-all"
                placeholder="XXXXXX"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">New Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-xl text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-slate-600"
                placeholder="Min 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Resetting...' : '🔒 Update Password'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;