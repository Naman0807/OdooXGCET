import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import { getUser } from '../utils/auth';
import Navigation from '../components/Navigation';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getUser();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      setError('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-dark flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-dark">
      <Navigation />
      <div className="p-6">

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Employee Management</h2>
        <p className="text-gray-400">View and manage all employees</p>
      </div>

      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-primary">All Employees</h3>
          <div className="text-gray-400">
            Total: {employees.length} employees
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="text-left py-3 px-4">Employee ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Department</th>
                <th className="text-left py-3 px-4">Position</th>
                <th className="text-left py-3 px-4">Joining Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-gray-700">
                  <td className="py-3 px-4">{employee.user.employeeId}</td>
                  <td className="py-3 px-4">
                    {employee.firstName} {employee.lastName}
                  </td>
                  <td className="py-3 px-4">{employee.user.email}</td>
                  <td className="py-3 px-4">{employee.department}</td>
                  <td className="py-3 px-4">{employee.position}</td>
                  <td className="py-3 px-4">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => window.location.href = `/profile/${employee.id}`}
                      className="btn-secondary text-sm"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No employees found
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;