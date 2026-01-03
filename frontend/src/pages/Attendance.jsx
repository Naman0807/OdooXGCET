import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import { getUser } from '../utils/auth';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await attendanceAPI.getMyAttendance();
      setAttendance(response.data);
      
      // Find today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayRecord = response.data.find(record => 
        new Date(record.date).toISOString().split('T')[0] === today
      );
      setTodayAttendance(todayRecord);
    } catch (error) {
      setError('Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn();
      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.error || 'Check in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut();
      fetchAttendance();
    } catch (error) {
      setError(error.response?.data?.error || 'Check out failed');
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
        <h2 className="text-3xl font-bold text-white mb-2">Attendance Management</h2>
        <p className="text-gray-400">Track your daily attendance</p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Today's Status */}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4 text-primary">Today's Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-white">
              Status: {todayAttendance?.status || 'Not Marked'}
            </p>
            {todayAttendance?.checkInTime && (
              <p className="text-gray-400">
                Check In: {new Date(todayAttendance.checkInTime).toLocaleTimeString()}
              </p>
            )}
            {todayAttendance?.checkOutTime && (
              <p className="text-gray-400">
                Check Out: {new Date(todayAttendance.checkOutTime).toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="space-x-4">
            {!todayAttendance?.checkInTime ? (
              <button onClick={handleCheckIn} className="btn-primary">
                Check In
              </button>
            ) : !todayAttendance?.checkOutTime ? (
              <button onClick={handleCheckOut} className="btn-secondary">
                Check Out
              </button>
            ) : (
              <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
                Completed for Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4 text-primary">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Check In</th>
                <th className="text-left py-3 px-4">Check Out</th>
                <th className="text-left py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id} className="border-b border-gray-700">
                  <td className="py-3 px-4">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      record.status === 'Present' ? 'bg-green-600' :
                      record.status === 'Absent' ? 'bg-red-600' :
                      record.status === 'Half-day' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-gray-400">
                    {record.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {attendance.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No attendance records found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;