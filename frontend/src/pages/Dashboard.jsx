import React from 'react';
import { getUser } from '../utils/auth';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const user = getUser();
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      <div className="p-6">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user.employee?.firstName}!
        </h2>
        <p className="text-gray-400">
          {user.employee?.position} at {user.employee?.department}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div onClick={() => window.location.href = '/profile'} className="card hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary bg-opacity-20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Profile</h3>
          <p className="text-gray-400 text-sm">View and edit your personal information</p>
        </div>

        <div onClick={() => window.location.href = '/attendance'} className="card hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-secondary bg-opacity-20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Attendance</h3>
          <p className="text-gray-400 text-sm">Check in/out and view attendance history</p>
        </div>

        <div onClick={() => window.location.href = '/leave'} className="card hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-600 bg-opacity-20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Leave Requests</h3>
          <p className="text-gray-400 text-sm">Apply for leave and check status</p>
        </div>

        <div onClick={() => window.location.href = '/payroll'} className="card hover:scale-105 transition-transform cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Payroll</h3>
          <p className="text-gray-400 text-sm">View salary structure and history</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;