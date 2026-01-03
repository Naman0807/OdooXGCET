import React, { useState, useEffect } from 'react';
import { leaveAPI } from '../services/api';
import { getUser } from '../utils/auth';
import Navigation from '../components/Navigation';

const LeaveApproval = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      const response = await leaveAPI.getPending();
      setPendingLeaves(response.data);
    } catch (error) {
      setError('Failed to fetch pending leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId, comments) => {
    try {
      await leaveAPI.approve(leaveId, { adminComments: comments });
      setSuccess('Leave request approved successfully');
      fetchPendingLeaves();
    } catch (error) {
      setError('Failed to approve leave request');
    }
  };

  const handleReject = async (leaveId, comments) => {
    try {
      await leaveAPI.reject(leaveId, { adminComments: comments });
      setSuccess('Leave request rejected successfully');
      fetchPendingLeaves();
    } catch (error) {
      setError('Failed to reject leave request');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      <div className="p-6">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Leave Approval</h2>
        <p className="text-gray-400">Review and approve pending leave requests</p>
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

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">Pending Leave Requests</h3>
          <div className="text-yellow-400 font-bold">
            {pendingLeaves.length} pending
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Employee</th>
                <th className="text-left py-3 px-4">Leave Type</th>
                <th className="text-left py-3 px-4">Start Date</th>
                <th className="text-left py-3 px-4">End Date</th>
                <th className="text-left py-3 px-4">Duration</th>
                <th className="text-left py-3 px-4">Remarks</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.map((leave) => {
                const startDate = new Date(leave.startDate);
                const endDate = new Date(leave.endDate);
                const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                
                return (
                  <tr key={leave.id} className="border-b border-gray-700">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">
                          {leave.employee.firstName} {leave.employee.lastName}
                        </div>
                        <div className="text-sm text-gray-400">
                          {leave.employee.user.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm ${
                        leave.leaveType === 'Paid' ? 'bg-blue-600' :
                        leave.leaveType === 'Sick' ? 'bg-green-600' :
                        'bg-gray-600'
                      }`}>
                        {leave.leaveType}
                      </span>
                    </td>
                    <td className="py-3 px-4">{formatDate(leave.startDate)}</td>
                    <td className="py-3 px-4">{formatDate(leave.endDate)}</td>
                    <td className="py-3 px-4">{duration} day{duration > 1 ? 's' : ''}</td>
                    <td className="py-3 px-4 text-gray-400">{leave.remarks || '-'}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            const comments = prompt('Enter approval comments (optional):');
                            if (comments !== null) {
                              handleApprove(leave.id, comments);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            const comments = prompt('Enter rejection reason:');
                            if (comments !== null) {
                              handleReject(leave.id, comments);
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {pendingLeaves.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No pending leave requests
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default LeaveApproval;