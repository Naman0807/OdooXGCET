import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    presentToday: 0,
    totalDepartments: 0
  });

  const user = getUser();

  useEffect(() => {
    // This would normally fetch from API
    setStats({
      totalEmployees: 25,
      pendingLeaves: 3,
      presentToday: 22,
      totalDepartments: 5
    });
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-dark p-6">
      <nav className="bg-gray-800 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">Dayflow HRMS - Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">
            Admin: {user.employee?.firstName} {user.employee?.lastName}
          </span>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.href = '/signin';
            }}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
        <p className="text-gray-400">Manage employees, attendance, and system settings</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Employees</p>
              <p className="text-3xl font-bold text-white">{stats.totalEmployees}</p>
            </div>
            <div className="bg-blue-800 bg-opacity-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-yellow-600 to-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Pending Leaves</p>
              <p className="text-3xl font-bold text-white">{stats.pendingLeaves}</p>
            </div>
            <div className="bg-yellow-700 bg-opacity-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-yellow-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Present Today</p>
              <p className="text-3xl font-bold text-white">{stats.presentToday}</p>
            </div>
            <div className="bg-green-700 bg-opacity-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Departments</p>
              <p className="text-3xl font-bold text-white">{stats.totalDepartments}</p>
            </div>
            <div className="bg-purple-700 bg-opacity-50 p-3 rounded-lg">
              <svg className="w-8 h-8 text-purple-200" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-primary">Employee Management</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary">View All Employees</button>
            <button className="btn-secondary">Add New Employee</button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-semibold mb-4 text-primary">Leave Management</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary">Pending Requests ({stats.pendingLeaves})</button>
            <button className="btn-secondary">Leave History</button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-primary">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">John Doe requested leave</p>
              <p className="text-gray-400 text-sm">Sick leave - 2 days</p>
            </div>
            <span className="text-yellow-400 text-sm">Pending</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">Jane Smith checked in</p>
              <p className="text-gray-400 text-sm">On time - 9:00 AM</p>
            </div>
            <span className="text-green-400 text-sm">Present</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <p className="text-white font-medium">New employee joined</p>
              <p className="text-gray-400 text-sm">Mike Johnson - Developer</p>
            </div>
            <span className="text-blue-400 text-sm">New</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;