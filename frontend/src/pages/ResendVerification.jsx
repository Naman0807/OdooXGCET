import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await authAPI.resendVerification({ email });
      
      if (response.data) {
        setSuccess(true);
        setMessage(response.data.message || 'Verification email sent successfully!');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="card w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
          <p className="text-gray-400 mb-6">{message}</p>
          
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 mb-2">Check your inbox for:</p>
            <p className="text-primary font-medium">{email}</p>
            <p className="text-xs text-gray-500 mt-2">Don't forget to check your spam folder!</p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false);
                setEmail('');
                setMessage('');
                setError('');
              }}
              className="btn-secondary w-full"
            >
              Send to Different Email
            </button>
            
            <Link to="/signin" className="block text-center text-primary hover:text-primary/80 text-sm">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Resend Verification</h2>
          <p className="text-gray-400">
            Didn't receive the verification email? We'll send it again.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-600 text-white p-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your.email@company.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Sending...' : 'Send Verification Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/signin" className="text-primary hover:text-primary/80 text-sm">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;