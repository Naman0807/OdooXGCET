import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { getUser } from '../utils/auth';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await employeeAPI.getById(user.employee?.id);
      setProfile(response.data);
      setFormData({
        phone: response.data.phone || '',
        address: response.data.address || '',
      });
    } catch (error) {
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await employeeAPI.update(user.employee?.id, formData);
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
      
      // Update user in localStorage
      const updatedUser = { ...user, employee: response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark p-6">
      <nav className="bg-gray-800 rounded-lg p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">Dayflow HRMS</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">
            {user.employee?.firstName} {user.employee?.lastName}
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
        <h2 className="text-3xl font-bold text-white mb-2">Profile Management</h2>
        <p className="text-gray-400">View and edit your personal information</p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-600 text-white p-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-primary">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary"
                >
                  Edit
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        phone: profile.phone || '',
                        address: profile.address || '',
                      });
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn-primary"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile?.firstName || ''}
                    disabled
                    className="input-field bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile?.lastName || ''}
                    disabled
                    className="input-field bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={user?.employeeId || ''}
                    disabled
                    className="input-field bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={isEditing ? formData.phone : (profile?.phone || '')}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={isEditing ? formData.address : (profile?.address || '')}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input-field"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Job Information */}
          <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-4 text-primary">Job Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <input
                  type="text"
                  value={profile?.department || ''}
                  disabled
                  className="input-field bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <input
                  type="text"
                  value={profile?.position || ''}
                  disabled
                  className="input-field bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Joining Date</label>
                <input
                  type="date"
                  value={profile?.joiningDate ? new Date(profile.joiningDate).toISOString().split('T')[0] : ''}
                  disabled
                  className="input-field bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Salary Information */}
        <div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-primary">Salary Structure</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Basic Salary:</span>
                <span className="font-semibold">${profile?.salaryBasic || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Allowances:</span>
                <span className="font-semibold">${profile?.salaryAllowance || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Deductions:</span>
                <span className="font-semibold text-red-400">-${profile?.salaryDeduction || 0}</span>
              </div>
              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Net Salary:</span>
                  <span className="font-bold text-green-400">
                    ${((profile?.salaryBasic || 0) + (profile?.salaryAllowance || 0) - (profile?.salaryDeduction || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;