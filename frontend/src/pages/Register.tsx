import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

const RegisterPage = () => {
  // We need to track which step of the form we are on
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP + Details

  // Form fields
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Step 1: Handle Email Submission ---
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call the first backend endpoint
      await apiClient.post('/auth/register-email', { email });
      setLoading(false);
      // Move to the next step
      setStep(2); 
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error sending OTP. Try again.');
    }
  };

  // --- Step 2: Handle Final Registration ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple password match validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Call the second backend endpoint
      await apiClient.post('/auth/register-verify', {
        email,
        otp,
        username,
        password,
      });

      // On success, automatically navigate to the login page
      setLoading(false);
      navigate('/login');
      // We could also log them in directly here, but let's keep it simple
      
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  // --- JSX ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        
        {/* Header */}
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Create Your Account
        </h2>

        {/* ----- Step 1 Form (Email) ----- */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading ? 'Sending OTP...' : 'Get Verification Code'}
              </button>
            </div>
          </form>
        )}

        {/* ----- Step 2 Form (OTP + Details) ----- */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit}>
            <p className="mb-4 text-center text-sm text-gray-600">
              An OTP has been sent to <strong>{email}</strong>
            </p>
            {/* OTP */}
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code (OTP)
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                8+ chars, 1 uppercase, 1 number, 1 special char.
              </p>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-4">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>
        )}

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;