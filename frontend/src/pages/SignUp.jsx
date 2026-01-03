import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Employee',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    phone: '',
    address: '',
    joiningDate: '',
    salaryBasic: '',
    salaryAllowance: '',
    salaryDeduction: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedEmployeeId, setGeneratedEmployeeId] = useState('');

  // Department options
  const departments = [
    'Information Technology',
    'Human Resources', 
    'Finance',
    'Accounting',
    'Marketing',
    'Sales',
    'Operations',
    'Administration',
    'Engineering',
    'Customer Service',
    'Quality Assurance'
  ];

  // Role options
  const roles = [
    { value: 'Employee', label: 'Employee' },
    { value: 'Admin', label: 'Admin / HR Officer' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.email) errors.push('Email is required');
    if (!formData.password) errors.push('Password is required');
    if (formData.password.length < 8) errors.push('Password must be at least 8 characters');
    if (!formData.firstName) errors.push('First name is required');
    if (!formData.lastName) errors.push('Last name is required');
    if (!formData.department) errors.push('Department is required');
    if (!formData.position) errors.push('Position is required');
    if (!formData.joiningDate) errors.push('Joining date is required');
    if (!formData.salaryBasic) errors.push('Basic salary is required');

    if (errors.length > 0) {
      setError(errors.join(', '));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signUp({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        department: formData.department,
        position: formData.position,
        phone: formData.phone,
        address: formData.address,
        joiningDate: formData.joiningDate,
        salaryBasic: parseFloat(formData.salaryBasic),
        salaryAllowance: parseFloat(formData.salaryAllowance) || 0,
        salaryDeduction: parseFloat(formData.salaryDeduction) || 0
      });

      setGeneratedEmployeeId(response.data.employeeId);
      setShowSuccess(true);
    } catch (error) {
      setError(error.response?.data?.error || 'Server error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');

    try {
      await authAPI.resendVerification({ email: formData.email });
      setError('Verification email sent successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  // Show success message after signup
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="card w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-400 mb-4">
              Your account has been created. Please check your email to verify your account.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300 mb-2">Your Employee ID:</p>
            <p className="text-xl font-bold text-primary">{generatedEmployeeId}</p>
            <p className="text-xs text-gray-400 mt-2">Please save this for your records</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              We've sent a verification link to: <span className="text-white font-medium">{formData.email}</span>
            </p>
            
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="btn-secondary w-full"
            >
              {loading ? 'Resending...' : 'Resend Verification Email'}
            </button>

            <Link
              to="/signin"
              className="block text-center text-primary hover:text-primary/80 text-sm"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Create Account</h2>
          <p className="text-gray-400">Join Dayflow HRMS to manage your HR operations</p>
        </div>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Min 8 characters"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="John"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position *</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Software Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  rows="2"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>
          </div>

          {/* Job Information */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 text-primary">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Joining Date *</label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Basic Salary *</label>
                <input
                  type="number"
                  name="salaryBasic"
                  value={formData.salaryBasic}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="50000"
                  min="0"
                  step="1000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salary Allowance</label>
                <input
                  type="number"
                  name="salaryAllowance"
                  value={formData.salaryAllowance}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="5000"
                  min="0"
                  step="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Salary Deduction</label>
                <input
                  type="number"
                  name="salaryDeduction"
                  value={formData.salaryDeduction}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
          <p className="text-gray-500 text-xs mt-2">
            By creating an account, you agree to our{' '}
            <a href="/rules" className="text-primary hover:underline">
              HRMS Rules and Policies
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;