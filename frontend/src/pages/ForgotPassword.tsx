import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiClient.post('/auth/forgot-password', { email });
      setLoading(false);
      setMessage(res.data.message);
      setStep(2);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Error sending OTP. Try again.');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await apiClient.post('/auth/reset-password', {
        email, otp, newPassword,
      });
      setLoading(false);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Password reset failed. Try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-900">
          Reset Your Password
        </h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p className="mb-4 text-center text-sm text-gray-600">
              Enter your email to receive a verification code.
            </p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="mt-4 flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetSubmit}>
            {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
            <div className="mb-4">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code (OTP)
              </label>
              <input
                id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                8+ chars, 1 uppercase, 1 number, 1 special char.
              </p>
            </div>
            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="mt-4 flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-white"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;