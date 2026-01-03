import React from 'react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl text-white mb-8">Page Not Found</h2>
        <a 
          href="/dashboard" 
          className="btn-primary"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;