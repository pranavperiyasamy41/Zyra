import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Mail, 
  CheckCircle2, 
  User, 
  Store, 
  Lock, 
  ShieldCheck, 
  Smartphone,
  ChevronRight,
  ArrowRight,
  Upload,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react';

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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- WIZARD STATE ---
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // --- FORM DATA ---
  const [formData, setFormData] = useState<any>({
    authProvider: 'email', 
    googleToken: '',
    otp: '',
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    pharmacyName: '',
    drugLicense: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    pharmacyContact: '',
    licenseDocument: null 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, licenseDocument: e.target.files[0] });
    }
  };

  // --- OTP HANDLERS ---
  const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return; 

    const currentOtp = formData.otp.split(''); 
    while (currentOtp.length < 6) currentOtp.push(''); 
    
    currentOtp[index] = val.slice(-1); 
    const newOtpString = currentOtp.join('').slice(0, 6);
    
    setFormData({ ...formData, otp: newOtpString });

    if (val && index < 5) {
        otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = formData.otp.split('');
    while (newOtp.length < 6) newOtp.push('');

    pastedData.forEach((char, i) => {
        if (i < 6 && !isNaN(Number(char))) newOtp[i] = char;
    });

    setFormData({ ...formData, otp: newOtp.join('').slice(0, 6) });
    otpRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // --- HANDLERS ---
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        const check = await apiClient.post('/auth/check-user', { email: userInfo.email });
        if (check.data.exists) {
            toast.error("Account already registered. Please Login.");
            return;
        }

        setFormData({
          ...formData,
          authProvider: 'google',
          googleToken: tokenResponse.access_token,
          email: userInfo.email,
          fullName: userInfo.name,
          password: '',
          confirmPassword: ''
        });
        setStep(2);
      } catch (err) {
        console.error("Google Profile Error:", err);
        setError("Failed to get Google Profile");
      }
    },
    onError: () => setError("Google Login Failed"),
  });

  const startEmailFlow = () => {
    setFormData({ ...formData, authProvider: 'email' });
    setStep(1);
  };

  const sendOtp = async () => {
    if (!formData.email) return toast.error("Email is required");
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/send-otp', { email: formData.email });
      toast.success(`OTP Sent to ${formData.email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (!formData.otp || formData.otp.length < 6) return toast.error("Please enter complete 6-digit OTP");
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
      setStep(2);
    } catch (err: any) {
      setError('Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleNextStep = (targetStep: number) => {
    setError('');
    if (step === 2 && targetStep === 3) {
        if (!formData.fullName || !formData.mobile || !formData.password || !formData.confirmPassword) {
            return setError("Please fill in all profile fields.");
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            return setError("Password must be 8+ chars, with Uppercase, Lowercase, Number & Special Char.");
        }
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.");
        }
    }
    if (step === 3 && targetStep === 4) {
        if (!formData.pharmacyName || !formData.drugLicense || !formData.licenseDocument) {
            return setError("Please complete pharmacy identity and upload license.");
        }
    }
    setStep(targetStep);
  };

  const handleSubmit = async () => {
    if (!formData.address || !formData.city || !formData.state || !formData.pincode) {
        return setError("Please complete all address details.");
    }

    setLoading(true); setError('');
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'licenseDocument' && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });
    if (formData.licenseDocument) {
      data.append('licenseDocument', formData.licenseDocument);
    }

    try {
      await apiClient.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStep(5);
    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || 'Registration Failed');
    } finally { setLoading(false); }
  };

  // --- UI STEPS ---
  const steps = [
    { num: 1, title: 'Verify' },
    { num: 2, title: 'Profile' },
    { num: 3, title: 'Entity' },
    { num: 4, title: 'Location' },
  ];

  const inputClasses = "w-full px-5 py-3.5 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-400/70 dark:text-white hover:bg-white dark:hover:bg-slate-800/60 hover:border-brand-primary/40 dark:hover:border-brand-highlight/40 hover:shadow-lg hover:shadow-brand-primary/5 dark:hover:shadow-[0_0_20px_rgba(205,235,139,0.05)] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary dark:focus:border-brand-highlight";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Heavy Animated Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-brand-dark/10 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-brand-highlight/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen dark:opacity-20 pointer-events-none"></div>

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-[500px] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out-expo px-2 sm:px-0">
        
        {/* Back navigation & Step Indicator */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center px-2">
            {(step > 0 && step < 5) ? (
                <button 
                    onClick={() => setStep(step - 1)}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-all"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Back</span>
                </button>
            ) : (
                <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-primary transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden sm:inline">Return to Home</span>
                </Link>
            )}
            
            {step > 0 && step < 5 && (
                <div className="flex gap-1 sm:gap-1.5">
                    {steps.map((s) => (
                        <div key={s.num} className={`h-1 w-4 sm:w-5 rounded-full transition-all duration-500 ${step >= s.num ? 'bg-gradient-to-r from-brand-btn-start to-brand-btn-end' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                </div>
            )}
        </div>

        {/* --- MAIN REGISTRATION CONTAINER --- */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl border border-white/60 dark:border-slate-700 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-brand-primary/10">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-6 sm:mb-8">
                <img src="/logo.png" alt="Zyra Logo" className="w-16 sm:w-20 h-auto mx-auto mb-3 sm:mb-4 object-contain drop-shadow-lg transform transition-transform hover:scale-110 hover:rotate-3" />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
                    {step === 5 ? "All Set!" : "Create Account"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest">
                    {step === 0 && "Choose Method"}
                    {step === 1 && "Identity Verification"}
                    {step === 2 && "Personal Profile"}
                    {step === 3 && "Pharmacy Identity"}
                    {step === 4 && "Pharmacy Location"}
                    {step === 5 && "Application Received"}
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold text-center mb-6 animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            {/* --- STEP 0: METHOD SELECTION --- */}
            {step === 0 && (
                <div className="space-y-3 sm:space-y-4 animate-in fade-in zoom-in duration-500">
                    <button 
                        onClick={() => googleLogin()}
                        className="w-full h-12 sm:h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-700 dark:text-white font-bold text-sm transition-all duration-300 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <GoogleIcon />
                        <span>Sign up with Google</span>
                    </button>
                    
                    <div className="relative flex py-2 sm:py-4 items-center">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Or</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>

                    <button 
                        onClick={startEmailFlow} 
                        className="w-full h-12 sm:h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-slate-700 dark:text-white font-bold text-sm transition-all duration-300 hover:border-brand-primary hover:shadow-lg hover:shadow-brand-primary/10 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-brand-highlight transition-colors" />
                        <span>Continue with Email</span>
                    </button>
                    
                    <p className="text-center text-slate-400 text-[10px] sm:text-xs mt-4 sm:mt-6">
                        Already have an account? <Link to="/login" className="text-brand-primary dark:text-brand-highlight font-bold hover:opacity-70 transition-colors">Log in</Link>
                    </p>
                </div>
            )}

            {/* --- STEP 1: EMAIL VERIFICATION --- */}
            {step === 1 && (
                <div className="space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Email</label>
                        <div className="flex gap-2">
                            <input 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                className={`${inputClasses} flex-1 text-sm py-3 md:py-3.5`}
                                placeholder="Enter your Email" 
                                autoFocus
                            />
                            <button 
                                onClick={sendOtp} 
                                disabled={loading || !formData.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/.test(formData.email)} 
                                className={`px-3 sm:px-4 rounded-xl md:rounded-2xl font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 ${ (formData.email && /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/.test(formData.email)) ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-[1.05] shadow-lg' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'}`}
                            >
                                {loading ? '...' : 'Get OTP'} 
                                {!loading && <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight">Enter OTP</label>
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">6-digit code</span>
                        </div>
                        <div className="flex gap-1.5 sm:gap-2 justify-between">
                            {[0, 1, 2, 3, 4, 5].map((index) => (
                                <input 
                                    key={index}
                                    ref={el => otpRefs.current[index] = el}
                                    type="text" 
                                    maxLength={1}
                                    value={formData.otp[index] || ''}
                                    onChange={(e) => handleOtpInput(e, index)}
                                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    onPaste={handleOtpPaste}
                                    className="w-full h-12 sm:h-14 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl md:rounded-2xl text-lg sm:text-xl font-black text-center outline-none transition-all dark:text-white hover:bg-white dark:hover:bg-slate-800/60 hover:border-brand-primary/40 dark:hover:border-brand-highlight/40 hover:shadow-lg focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary dark:focus:border-brand-highlight" 
                                />
                            ))}
                        </div>
                    </div>

                    <button 
                        onClick={verifyOtp} 
                        disabled={loading || formData.otp.length < 6} 
                        className={`group relative overflow-hidden w-full h-12 sm:h-14 rounded-xl md:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl transition-all transform flex items-center justify-center gap-2 ${formData.otp.length === 6 ? 'bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white shadow-brand-btn-start/30 hover:-translate-y-1 active:scale-[0.98]' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'}`}
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        <span className="relative flex items-center gap-2">Verify & Continue <ChevronRight className="w-4 h-4" /></span>
                    </button>
                </div>
            )}

            {/* --- STEP 2: PERSONAL PROFILE --- */}
            {step === 2 && (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`} 
                                    placeholder="Enter your name" 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Mobile</label>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="mobile" 
                                    value={formData.mobile} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`} 
                                    placeholder="Mobile number" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl border border-brand-primary/10 bg-brand-primary/5 dark:bg-brand-highlight/5 space-y-3 sm:space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="password" 
                                    type={showPwd ? "text" : "password"} 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="Create password" 
                                    className={`${inputClasses} pl-11 md:pl-12 pr-11 md:pr-12 text-sm py-3 md:py-3.5 !bg-white dark:!bg-slate-900`} 
                                />
                                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-3 md:top-3.5 text-slate-400 hover:text-brand-primary transition-colors">
                                    {showPwd ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="confirmPassword" 
                                    type={showConfirmPwd ? "text" : "password"} 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    placeholder="Confirm password" 
                                    className={`${inputClasses} pl-11 md:pl-12 pr-11 md:pr-12 text-sm py-3 md:py-3.5 !bg-white dark:!bg-slate-900`} 
                                />
                                <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-4 top-3 md:top-3.5 text-slate-400 hover:text-brand-primary transition-colors">
                                    {showConfirmPwd ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleNextStep(3)} 
                        className="group relative overflow-hidden w-full h-12 sm:h-14 bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white rounded-xl md:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-btn-start/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        <span className="relative flex items-center gap-2">Next Step <ArrowRight className="w-4 h-4" /></span>
                    </button>
                </div>
            )}

            {/* --- STEP 3: PHARMACY IDENTITY --- */}
            {step === 3 && (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Pharmacy Name</label>
                        <div className="relative group">
                            <Store className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input 
                                name="pharmacyName" 
                                value={formData.pharmacyName} 
                                onChange={handleChange} 
                                className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`} 
                                placeholder="Enter Pharmacy name" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Drug License No.</label>
                        <div className="relative group">
                            <ShieldCheck className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input 
                                name="drugLicense" 
                                value={formData.drugLicense} 
                                onChange={handleChange} 
                                className={`${inputClasses} pl-11 md:pl-12 font-mono text-sm py-3 md:py-3.5`} 
                                placeholder="Enter License number" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">License Document</label>
                        <div className="relative group">
                            <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                onChange={handleFileChange} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                            />
                            <div className={`w-full p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-2xl md:rounded-3xl transition-all duration-300 flex items-center gap-3 sm:gap-4 hover:border-brand-primary hover:bg-white dark:hover:bg-slate-800/60 ${formData.licenseDocument ? 'border-emerald-500 bg-emerald-50/5' : ''}`}>
                                <div className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl transition-all ${formData.licenseDocument ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-brand-primary group-hover:text-white'}`}>
                                    <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] ${formData.licenseDocument ? 'text-emerald-600 dark:text-emerald-400' : 'text-brand-primary dark:text-brand-highlight'}`}>
                                        {formData.licenseDocument ? 'File Ready' : 'Choose License'}
                                    </p>
                                    <p className="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                                        {formData.licenseDocument ? formData.licenseDocument.name : "Select file"}
                                    </p>
                                </div>
                                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ${formData.licenseDocument ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 scale-110 opacity-100' : 'opacity-0 scale-50'}`}>
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => handleNextStep(4)} 
                        className="group relative overflow-hidden w-full h-12 sm:h-14 bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white rounded-xl md:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-btn-start/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        <span className="relative flex items-center gap-2">Final Step <ArrowRight className="w-4 h-4" /></span>
                    </button>
                </div>
            )}

            {/* --- STEP 4: PHARMACY LOCATION --- */}
            {step === 4 && (
                <div className="space-y-4 sm:space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Street Address</label>
                        <div className="relative group">
                            <MapPin className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input 
                                name="address" 
                                value={formData.address} 
                                onChange={handleChange} 
                                className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`} 
                                placeholder="Street and building number" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">City</label>
                            <div className="relative group">
                                <Store className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="city" 
                                    value={formData.city} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`}
                                    placeholder="City" 
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">State</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input 
                                    name="state" 
                                    value={formData.state} 
                                    onChange={handleChange} 
                                    className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`}
                                    placeholder="State" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] sm:text-xs font-bold text-brand-primary dark:text-brand-highlight ml-1">Pincode</label>
                        <div className="relative group">
                            <Smartphone className="absolute left-4 top-3 md:top-3.5 w-4 h-4 md:w-5 md:h-5 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input 
                                name="pincode" 
                                value={formData.pincode} 
                                onChange={handleChange} 
                                className={`${inputClasses} pl-11 md:pl-12 text-sm py-3 md:py-3.5`}
                                placeholder="6-digit pincode" 
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit} 
                        disabled={loading} 
                        className="group relative overflow-hidden w-full h-12 sm:h-14 bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white rounded-xl md:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-brand-btn-start/30 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        <span className="relative flex items-center gap-2">
                            {loading ? 'Submitting...' : 'Complete Setup'} <CheckCircle2 className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            )}

            {/* --- STEP 5: SUCCESS --- */}
            {step === 5 && (
                <div className="text-center py-4 sm:py-6 animate-in zoom-in duration-500">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm">
                        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2">Application Received</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed px-4">
                        Your account is currently <b>Pending Approval</b>. We will notify you once verified.
                    </p>
                    <Link to="/login" className="group relative overflow-hidden block w-full bg-gradient-to-r from-brand-btn-start to-brand-btn-end text-white py-3 sm:py-4 rounded-xl md:rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-brand-btn-start/30 transition-all hover:scale-[1.02] text-center">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                        <span className="relative">Return to Login</span>
                    </Link>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Register;