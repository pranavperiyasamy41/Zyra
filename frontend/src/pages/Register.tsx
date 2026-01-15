import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

const Register: React.FC = () => {
  const navigate = useNavigate();

  // --- WIZARD STATE ---
  const [step, setStep] = useState<number>(0);
  // 0: Selection, 1: OTP, 2: User Details, 3: Pharmacy Details, 4: Success

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- FORM DATA ---
  const [formData, setFormData] = useState({
    authProvider: 'email', // 'email' or 'google'
    googleToken: '',
    otp: '',
    // Step 2: User
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    // Step 3: Pharmacy
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

  // ==========================
  // 🔹 STEP 0: SELECTION
  // ==========================

  // Handle Google Selection
  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);
    setFormData({
      ...formData,
      authProvider: 'google',
      googleToken: credentialResponse.credential,
      email: decoded.email,
      fullName: decoded.name,
      // ✅ HYBRID AUTH: We leave password empty so they MUST create one
      password: '',
      confirmPassword: ''
    });
    setStep(2); // Skip OTP, Go to User Details
  };

  // Handle Email Selection
  const startEmailFlow = () => {
    setFormData({ ...formData, authProvider: 'email' });
    setStep(1);
  };

  // ==========================
  // 🔹 STEP 1: OTP FLOW
  // ==========================
  const sendOtp = async () => {
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/send-otp', { email: formData.email });
      alert(`OTP Sent to ${formData.email}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/verify-otp', { email: formData.email, otp: formData.otp });
      setStep(2); // Success! Go to User Details
    } catch (err: any) {
      setError('Invalid OTP');
    } finally { setLoading(false); }
  };

  // ==========================
  // 🔹 FINAL SUBMISSION
  // ==========================
  const handleSubmit = async () => {
    // Validation
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match");
    if (!formData.drugLicense) return setError("Drug License is required");

    setLoading(true); setError('');
    try {
      await apiClient.post('/auth/register', formData);
      setStep(4); // Show Success Screen
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration Failed');
    } finally { setLoading(false); }
  };

  // ==========================
  // 🎨 RENDER WIZARD
  // ==========================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 dark:border-slate-700">

        {/* HEADER */}
        {step < 4 && <h2 className="text-3xl font-black text-center text-gray-900 dark:text-white mb-6">
          {step === 0 && "Join Smart Pharmacy"}
          {step === 1 && "Verify Email"}
          {step === 2 && "Owner Details"}
          {step === 3 && "Pharmacy Details"}
        </h2>}

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-bold text-center">{error}</div>}

        {/* --- STEP 0: CHOOSE METHOD --- */}
        {step === 0 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Failed")}
                theme="filled_blue"
                size="large"
                text="signup_with" // ✅ Correct Text
                shape="pill"
                width="100%"
              />
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <button onClick={startEmailFlow} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900">
              Continue with Email
            </button>
            <p className="text-center text-gray-500 mt-4">Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>
          </div>
        )}

        {/* --- STEP 1: EMAIL OTP --- */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="flex gap-2">
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="flex-1 p-3 rounded-xl border dark:bg-slate-900 dark:text-white" placeholder="you@example.com" />
                <button onClick={sendOtp} disabled={loading} className="bg-blue-600 text-white px-4 rounded-xl font-bold text-sm">Send OTP</button>
              </div>
            </div>
            <input name="otp" type="text" value={formData.otp} onChange={handleChange} placeholder="Enter 6-digit Code" className="w-full p-3 rounded-xl border text-center text-xl tracking-widest dark:bg-slate-900 dark:text-white" />
            <button onClick={verifyOtp} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold">Verify & Continue</button>
            <button onClick={() => setStep(0)} className="w-full text-gray-500 py-2">Back</button>
          </div>
        )}

        {/* --- STEP 2: USER DETAILS --- */}
        {step === 2 && (
          <div className="space-y-3">
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" required />
            <input name="email" value={formData.email} disabled className="w-full p-3 rounded-xl border bg-gray-100 dark:bg-slate-700 dark:text-gray-400 cursor-not-allowed" />
            <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" required />

            {/* ✅ HYBRID AUTH: Password fields are ALWAYS shown now */}
            <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl border border-blue-100 dark:border-slate-600">
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase">
                    {formData.authProvider === 'google' ? 'Create Backup Password' : 'Secure Your Account'}
                </p>
                <div className="space-y-2">
                    <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password (Min 8 chars)" className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:text-white" />
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className="w-full p-3 rounded-lg border dark:bg-slate-900 dark:text-white" />
                </div>
            </div>

            <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-2">Next: Pharmacy Details</button>
          </div>
        )}

        {/* --- STEP 3: PHARMACY DETAILS --- */}
        {step === 3 && (
          <div className="space-y-3 h-96 overflow-y-auto pr-2 custom-scrollbar">
            <input name="pharmacyName" value={formData.pharmacyName} onChange={handleChange} placeholder="Pharmacy Name" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
            <input name="drugLicense" value={formData.drugLicense} onChange={handleChange} placeholder="Drug License Number" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
            <div className="grid grid-cols-2 gap-2">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
            </div>
            <input name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />
            <input name="pharmacyContact" value={formData.pharmacyContact} onChange={handleChange} placeholder="Pharmacy Contact" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:text-white" />

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-600/30">
              {loading ? 'Submitting...' : 'Complete Registration'}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-gray-500 py-2">Back</button>
          </div>
        )}

        {/* --- STEP 4: SUCCESS --- */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your account has been created and is currently <b>Pending Approval</b>.
              <br />You will be notified once the admin approves your pharmacy.
            </p>
            <Link to="/login" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold">
              Return to Login
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Register;