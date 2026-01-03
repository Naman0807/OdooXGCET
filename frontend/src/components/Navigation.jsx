import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUser } from '../utils/auth';

const Navigation = () => {
  const location = useLocation();
  const user = getUser();
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700';
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
                Dayflow HRMS
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>

              {/* Employee Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('employee')}
                  onMouseEnter={() => setOpenDropdown('employee')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    ['/profile', '/attendance'].includes(location.pathname) 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Employee
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'employee' && (
                  <div 
                    className="absolute z-10 mt-2 w-52 bg-gray-700 rounded-md shadow-lg"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                          location.pathname === '/profile' ? 'bg-primary text-white' : ''
                        }`}
                        onClick={closeDropdown}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/attendance"
                        className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                          location.pathname === '/attendance' ? 'bg-primary text-white' : ''
                        }`}
                        onClick={closeDropdown}
                      >
                        Attendance
                      </Link>
                    </div>
                  </div>
                )}
              </div>

               {/* HR Dropdown */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('hr')}
                  onMouseEnter={() => setOpenDropdown('hr')}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                    ['/leave', '/payroll', '/rules'].includes(location.pathname) 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  HR Management
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openDropdown === 'hr' && (
                  <div 
                    className="absolute z-10 mt-2 w-56 bg-gray-700 rounded-md shadow-lg"
                    onMouseLeave={closeDropdown}
                  >
                    <div className="py-2">
                      <Link
                        to="/leave"
                        className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                          location.pathname === '/leave' ? 'bg-primary text-white' : ''
                        }`}
                        onClick={closeDropdown}
                      >
                        Leave Requests
                      </Link>
                      <Link
                        to="/payroll"
                        className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                          location.pathname === '/payroll' ? 'bg-primary text-white' : ''
                        }`}
                        onClick={closeDropdown}
                      >
                        Payroll
                      </Link>
                      <Link
                        to="/rules"
                        className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                          location.pathname === '/rules' || location.pathname.startsWith('/rules/') ? 'bg-primary text-white' : ''
                        }`}
                        onClick={closeDropdown}
                      >
                        HR Rules & Policies
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Dropdown */}
              {user?.role === 'Admin' && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown('admin')}
                    onMouseEnter={() => setOpenDropdown('admin')}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      ['/admin-dashboard', '/employee-management', '/leave-approval'].includes(location.pathname) 
                        ? 'bg-primary text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Admin
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === 'admin' && (
                    <div 
                      className="absolute z-10 mt-2 w-56 bg-gray-700 rounded-md shadow-lg"
                      onMouseLeave={closeDropdown}
                    >
                      <div className="py-2">
                        <Link
                          to="/admin-dashboard"
                          className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                            location.pathname === '/admin-dashboard' ? 'bg-primary text-white' : ''
                          }`}
                          onClick={closeDropdown}
                        >
                          Admin Dashboard
                        </Link>
                        <Link
                          to="/employee-management"
                          className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                            location.pathname === '/employee-management' ? 'bg-primary text-white' : ''
                          }`}
                          onClick={closeDropdown}
                        >
                          Employee Management
                        </Link>
                        <Link
                          to="/leave-approval"
                          className={`block px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-600 hover:text-white transition-colors ${
                            location.pathname === '/leave-approval' ? 'bg-primary text-white' : ''
                          }`}
                          onClick={closeDropdown}
                        >
                          Leave Approval
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.employee?.firstName?.charAt(0)}{user?.employee?.lastName?.charAt(0)}
                </span>
              </div>
              <span className="text-gray-300 text-sm font-medium">
                {user?.employee?.firstName} {user?.employee?.lastName}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary text-sm px-4 py-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;