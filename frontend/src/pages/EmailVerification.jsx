import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setStatus('loading');
      const response = await authAPI.verifyEmail(token);
      
      if (response.data) {
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
      }
    } catch (error) {
      setStatus('error');
      setError(error.response?.data?.error || 'Email verification failed');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifying...</h2>
            <p className="text-gray-400">Please wait while we verify your email.</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">{message}</p>
            
            <button
              onClick={() => navigate('/signin')}
              className="btn-primary w-full mb-4"
            >
              Sign In Now
            </button>
            
            <p className="text-sm text-gray-500">
              Your account is now active and ready to use.
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={verifyEmail}
                className="btn-primary w-full"
              >
                Try Again
              </button>
              
              <Link to="/resend-verification" className="block text-center">
                <button className="btn-secondary w-full">
                  Request New Verification Email
                </button>
              </Link>
              
              <Link 
                to="/signin" 
                className="text-center block text-primary hover:text-primary/80 text-sm"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="card w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerification;