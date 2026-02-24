import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import toast from 'react-hot-toast';
import { Mail, KeyRound, ArrowLeft, ShieldCheck, Loader2, Lock } from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  
  // Form Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // OTP Input Refs
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Step 1: Request OTP ---
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setStep(2);
      toast.success('Verification code sent to your email'); // 🆕 Specific notification
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send code');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Verify OTP ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      toast.error("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      // We use the existing verify-otp endpoint
      await apiClient.post('/auth/verify-otp', { email, otp: otpValue });
      setStep(3);
      toast.success('Code verified successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 3: Reset Password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 🟢 Password Strength Check
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
        toast.error("Please set a strong password (min 8 chars, uppercase, lowercase, number, and special character).", {
            duration: 4000
        });
        return;
    }

    if (newPassword !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { email, otp: otp.join(''), newPassword });
      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // --- OTP Helper Functions ---
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only keep last char
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      
      {/* 🟢 Unified Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-400/20 dark:bg-teal-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/20 dark:bg-emerald-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 brightness-100 contrast-150 pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo & Brand */}
        <div className="text-center mb-6 group">
            <Link to="/" className="inline-block transition-transform duration-500 group-hover:scale-110">
                <img src="/logo.png" alt="Zyra Logo" className="h-14 w-auto mx-auto drop-shadow-[0_0_10px_rgba(45,212,191,0.2)]" />
            </Link>
            <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-[0.2em] opacity-80">Security</h2>
        </div>

        {/* Main Card */}
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl border border-white dark:border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden transition-colors">
            
            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-8">
                <div className={`h-1 transition-all duration-500 rounded-full ${step === 1 ? 'w-10 bg-teal-500' : 'w-4 bg-slate-200 dark:bg-white/10'}`}></div>
                <div className={`h-1 transition-all duration-500 rounded-full ${step === 2 ? 'w-10 bg-teal-500' : 'w-4 bg-slate-200 dark:bg-white/10'}`}></div>
                <div className={`h-1 transition-all duration-500 rounded-full ${step === 3 ? 'w-10 bg-teal-500' : 'w-4 bg-slate-200 dark:bg-white/10'}`}></div>
            </div>

            {/* STEP 1: EMAIL */}
            {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
                            <Mail className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Forgot Password?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed px-4">
                            Enter your email to receive a secure 6-digit verification code.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-500 transition-colors" />
                            <input 
                                type="email" 
                                required 
                                className="w-full pl-10 pr-4 py-3.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                placeholder="name@pharmacy.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:scale-[1.02] active:scale-[0.98] text-white font-black py-4 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Verification Code <ArrowLeft className="w-4 h-4 rotate-180" /></>}
                    </button>
                </form>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verify Code</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs px-2 leading-relaxed">
                            We've sent a 6-digit code to <br /><span className="text-emerald-600 dark:text-emerald-400 font-bold">{email}</span>
                        </p>
                    </div>

                    <div className="flex justify-between gap-2 sm:gap-3">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={el => otpRefs.current[idx] = el}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(idx, e.target.value)}
                                onKeyDown={e => handleKeyDown(idx, e)}
                                className="w-full h-12 sm:h-14 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-center text-xl font-bold focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                            />
                        ))}
                    </div>
                    
                    <div className="space-y-3">
                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:scale-[1.02] active:scale-[0.98] text-white font-black py-4 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Code"}
                        </button>

                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors uppercase tracking-widest text-center"
                        >
                            Edit Email Address
                        </button>
                    </div>
                </form>
            )}

            {/* STEP 3: NEW PASSWORD */}
            {step === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                            <Lock className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">New Password</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs px-2 leading-relaxed">
                            Create a strong new password for your Zyra account.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                            <div className="relative group">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="password" 
                                    required 
                                    autoFocus
                                    className="w-full pl-10 pr-4 py-3.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                    placeholder="Minimum 8 characters"
                                    value={newPassword}
                                    onChange={e => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    type="password" 
                                    required 
                                    className="w-full pl-10 pr-4 py-3.5 bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                    placeholder="Repeat your password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-btn-start to-brand-btn-end hover:scale-[1.02] active:scale-[0.98] text-white font-black py-4 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Secure Account"}
                    </button>
                </form>
            )}

            {/* Footer */}
            <div className="mt-8 text-center pt-6 border-t border-slate-100 dark:border-white/5">
                <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-all group uppercase tracking-widest">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>
            </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-6 text-slate-400 dark:text-slate-500 text-[10px] font-medium uppercase tracking-widest opacity-60">
            Need help? <Link to="/contact" className="text-teal-600 dark:text-teal-400 hover:underline">Contact Support</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;