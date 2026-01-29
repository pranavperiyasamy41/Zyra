import React, { useState } from 'react';
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
  ArrowRight
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

  // --- WIZARD STATE ---
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
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
    pharmacyContact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLERS ---
  
  // Custom Google Login Hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch User Info using the access token
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        }).then(res => res.json());

        // Check if user already exists
        const check = await apiClient.post('/auth/check-user', { email: userInfo.email });
        if (check.data.exists) {
            toast.error("Account already registered. Please Login.");
            return;
        }

        setFormData({
          ...formData,
          authProvider: 'google',
          googleToken: tokenResponse.access_token, // Send access token to backend
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
    if (!formData.otp) return toast.error("Please enter OTP");
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
      setStep(2);
    } catch (err: any) {
      setError('Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (!formData.drugLicense) return setError("Drug License is required");

    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/register', formData);
      setStep(4);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally { setLoading(false); }
  };

  // --- UI STEPS ---
  const steps = [
    { num: 1, title: 'Identity' },
    { num: 2, title: 'Profile' },
    { num: 3, title: 'Entity' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-sans flex items-center justify-center p-4 relative">
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="w-full max-w-[500px] relative z-10">
        
        {/* Back navigation */}
        <div className="mb-8 flex justify-between items-center px-2">
            {(step > 1 && step < 4) ? (
                <button 
                    onClick={() => setStep(step - 1)}
                    className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
            ) : (
                <Link to="/" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Return to Home</span>
                </Link>
            )}
            {step > 0 && step < 4 && (
                <div className="flex gap-1.5">
                    {steps.map((s) => (
                        <div key={s.num} className={`h-1 w-6 rounded-full transition-all duration-500 ${step >= s.num ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                </div>
            )}
        </div>

        {/* --- MAIN REGISTRATION CONTAINER --- */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 transition-all duration-300">
            
            {/* BRANDING & HEADER */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white font-black text-2xl mb-6 shadow-xl shadow-blue-500/30">
                    Z
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">
                    Create Account
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {step === 0 && "Choose your preferred sign-up method."}
                    {step === 1 && "Secure your identity with email verification."}
                    {step === 2 && "Tell us about yourself."}
                    {step === 3 && "Register your pharmacy entity."}
                </p>
            </div>

            {/* ERROR DISPLAY */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-bold text-center mb-8 animate-in fade-in zoom-in duration-300">
                    {error}
                </div>
            )}

            {/* --- STEP 0: METHOD SELECTION --- */}
            {step === 0 && (
                <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    
                    {/* CUSTOM GOOGLE BUTTON */}
                    <button 
                        onClick={() => googleLogin()}
                        className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-white font-bold text-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <GoogleIcon />
                        <span>Sign up with Google</span>
                    </button>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Or</span>
                        <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                    </div>

                    {/* EMAIL BUTTON */}
                    <button 
                        onClick={startEmailFlow} 
                        className="w-full h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-700 dark:text-white font-bold text-sm transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group"
                    >
                        <Mail className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                        <span>Continue with Email</span>
                    </button>
                    
                    <p className="text-center text-slate-400 text-xs mt-6">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 transition-colors hover:underline underline-offset-4">Log in</Link>
                    </p>
                </div>
            )}

            {/* --- STEP 1: EMAIL VERIFICATION --- */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Work Email</label>
                            <div className="flex gap-2">
                                <input 
                                    name="email" 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all shadow-sm placeholder:text-slate-400"
                                    placeholder="Enter your email" 
                                    autoFocus
                                />
                            </div>
                             <button 
                                onClick={sendOtp} 
                                disabled={loading || !formData.email} 
                                className={`w-full h-12 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${formData.email ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:scale-[1.02] shadow-lg' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'}`}
                            >
                                {loading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-sm font-bold text-slate-900 dark:text-white">Verification Code</label>
                                <span className="text-[10px] text-slate-400 font-medium">Check your inbox</span>
                            </div>
                            <input 
                                name="otp" 
                                type="text" 
                                maxLength={6}
                                value={formData.otp} 
                                onChange={handleChange} 
                                placeholder="Enter 6-digit code" 
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white transition-all shadow-sm placeholder:text-slate-400 tracking-widest font-mono" 
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            onClick={verifyOtp} 
                            disabled={loading} 
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Verify & Continue <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        <button onClick={() => setStep(0)} className="w-full mt-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-xs uppercase tracking-widest transition-colors">Change Method</button>
                    </div>
                </div>
            )}

            {/* --- STEP 2: OWNER PROFILE --- */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                                    placeholder="e.g. John Smith" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Primary Mobile</label>
                            <div className="relative group">
                                <Smartphone className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    name="mobile" 
                                    value={formData.mobile} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                                    placeholder="10-digit number" 
                                />
                            </div>
                        </div>

                        <div className="p-6 rounded-[2rem] border border-blue-50 dark:border-blue-900/20 bg-blue-50/30 dark:bg-blue-900/10 space-y-4">
                            <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400">
                                <Lock className="w-4 h-4" />
                                <span className="text-sm font-bold uppercase tracking-tight">Security Access</span>
                            </div>
                            <input 
                                name="password" 
                                type="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Create Access Password" 
                                className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                            />
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                value={formData.confirmPassword} 
                                onChange={handleChange} 
                                placeholder="Confirm Access Password" 
                                className="w-full px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-4">
                        <button 
                            onClick={() => setStep(formData.authProvider === 'google' ? 0 : 1)} 
                            className="px-8 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            Back
                        </button>
                        <button 
                            onClick={() => setStep(3)} 
                            className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            Next: Entity Setup <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 3: PHARMACY ENTITY --- */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Pharmacy Name</label>
                            <div className="relative group">
                                <Store className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    name="pharmacyName" 
                                    value={formData.pharmacyName} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                                    placeholder="Registered Entity Name" 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Drug License Identification</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input 
                                    name="drugLicense" 
                                    value={formData.drugLicense} 
                                    onChange={handleChange} 
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white font-mono shadow-sm transition-all" 
                                    placeholder="DL-XXXXXX" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-900 dark:text-white ml-1">Physical Address</label>
                        <input 
                            name="address" 
                            value={formData.address} 
                            onChange={handleChange} 
                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                            placeholder="Street, Building, Suite..." 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            placeholder="City" 
                            className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                        />
                        <input 
                            name="pincode" 
                            value={formData.pincode} 
                            onChange={handleChange} 
                            placeholder="Zip/Pin" 
                            className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white shadow-sm transition-all" 
                        />
                    </div>

                    <div className="pt-2 flex gap-4">
                        <button 
                            onClick={() => setStep(2)} 
                            className="px-8 h-14 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                        >
                            Back
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading} 
                            className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating...' : 'Complete Setup'} <CheckCircle2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* --- STEP 4: SUCCESS --- */}
            {step === 4 && (
                <div className="text-center py-8 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">All Set!</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed px-4">
                        Your account is currently <b>Pending Approval</b>. <br/> We will notify you once verified.
                    </p>
                    <Link to="/login" className="block w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all hover:scale-[1.02]">
                        Go to Login
                    </Link>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Register;