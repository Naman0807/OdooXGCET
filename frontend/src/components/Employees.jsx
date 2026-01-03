import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Employees.css';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    position: '',
    salaryBasic: '',
    salaryAllowance: '',
    salaryDeduction: '',
    joinDate: '',
    phone: ''
  });

  useEffect(() => {
    if (user.role === 'admin') {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingEmployee 
        ? `http://localhost:5000/api/employees/${editingEmployee.id}`
        : 'http://localhost:5000/api/employees';
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          salaryBasic: parseFloat(formData.salaryBasic),
          salaryAllowance: parseFloat(formData.salaryAllowance) || 0,
          salaryDeduction: parseFloat(formData.salaryDeduction) || 0
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingEmployee ? 'update' : 'add'} employee`);
      }

      const result = await response.json();
      alert(result.message || `Employee ${editingEmployee ? 'updated' : 'added'} successfully`);
      
      setShowAddForm(false);
      setEditingEmployee(null);
      setFormData({
        fullName: '',
        email: '',
        department: '',
        position: '',
        salaryBasic: '',
        salaryAllowance: '',
        salaryDeduction: '',
        joinDate: '',
        phone: ''
      });
      
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      fullName: employee.fullName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salaryBasic: employee.salaryBasic.toString(),
      salaryAllowance: employee.salaryAllowance?.toString() || '0',
      salaryDeduction: employee.salaryDeduction?.toString() || '0',
      joinDate: employee.joinDate?.split('T')[0] || '',
      phone: employee.phone || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (employeeId) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      alert('Employee deleted successfully');
      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleEmployeeStatus = async (employeeId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update employee status');
      }

      fetchEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  if (user.role !== 'admin') {
    return (
      <div className="employees-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access employee management.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  return (
    <div className="employees-container">
      <div className="employees-header">
        <h1>Employee Management</h1>
        <button 
          className="add-employee-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showAddForm && (
        <div className="employee-form">
          <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name*</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email*</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Department*</label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Position*</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Basic Salary*</label>
                <input
                  type="number"
                  required
                  value={formData.salaryBasic}
                  onChange={(e) => setFormData({...formData, salaryBasic: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Allowance</label>
                <input
                  type="number"
                  value={formData.salaryAllowance}
                  onChange={(e) => setFormData({...formData, salaryAllowance: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Deduction</label>
                <input
                  type="number"
                  value={formData.salaryDeduction}
                  onChange={(e) => setFormData({...formData, salaryDeduction: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Join Date*</label>
                <input
                  type="date"
                  required
                  value={formData.joinDate}
                  onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingEmployee ? 'Update' : 'Add'} Employee
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEmployee(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="employees-list">
        <div className="employees-grid">
          {employees.map((employee) => (
            <div key={employee.id} className={`employee-card ${!employee.isActive ? 'inactive' : ''}`}>
              <div className="employee-header">
                <h3>{employee.fullName}</h3>
                <span className={`status-badge ${employee.isActive ? 'active' : 'inactive'}`}>
                  {employee.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="employee-details">
                <p><strong>ID:</strong> {employee.user?.employeeId || 'N/A'}</p>
                <p><strong>Email:</strong> {employee.email}</p>
                <p><strong>Department:</strong> {employee.department}</p>
                <p><strong>Position:</strong> {employee.position}</p>
                <p><strong>Salary:</strong> ₹{employee.salaryBasic?.toLocaleString() || 0}</p>
                <p><strong>Join Date:</strong> {employee.joinDate?.split('T')[0] || 'N/A'}</p>
                {employee.phone && <p><strong>Phone:</strong> {employee.phone}</p>}
              </div>
              
              <div className="employee-actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </button>
                <button 
                  className={`status-btn ${employee.isActive ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleEmployeeStatus(employee.id, employee.isActive)}
                >
                  {employee.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Employees;