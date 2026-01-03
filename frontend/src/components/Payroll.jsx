import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Payroll.css';

const Payroll = () => {
  const { user } = useAuth();
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = user.role === 'admin' ? '/api/payroll/all' : '/api/payroll/my';
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payroll data');
      }

      const data = await response.json();
      
      if (user.role === 'admin') {
        setPayrollData(data);
      } else {
        setPayrollData(data.salaries || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPayslip = async (month, year) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/payroll/payslip?month=${month}&year=${year}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate payslip');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payslip_${month}_${year}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePayroll = async () => {
    try {
      const token = localStorage.getItem('token');
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      
      const response = await fetch('http://localhost:5000/api/payroll/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          month: currentMonth,
          year: currentYear
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate payroll');
      }

      const result = await response.json();
      alert(`Payroll generated for ${result.results.length} employees`);
      fetchPayrollData();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatMonth = (month) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
  };

  if (loading) {
    return <div className="payroll-loading">Loading payroll data...</div>;
  }

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        {user.role === 'admin' && (
          <button className="generate-btn" onClick={generatePayroll}>
            Generate Current Month Payroll
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="payroll-content">
        {user.role === 'admin' ? (
          <div className="admin-payroll">
            <h2>All Employee Payroll</h2>
            <div className="payroll-grid">
              {payrollData.map((record, index) => (
                <div key={index} className="payroll-card">
                  <div className="employee-info">
                    <h3>{record.employee.user.employeeId}</h3>
                    <p>{record.employee.fullName}</p>
                    <p>{record.employee.department}</p>
                  </div>
                  <div className="salary-info">
                    <p><strong>Period:</strong> {formatMonth(record.month)} {record.year}</p>
                    <p><strong>Basic:</strong> ₹{record.basic?.toLocaleString() || 0}</p>
                    <p><strong>Allowance:</strong> ₹{record.allowance?.toLocaleString() || 0}</p>
                    <p><strong>Gross:</strong> ₹{record.grossSalary?.toLocaleString() || record.netSalary?.toLocaleString() || 0}</p>
                    <p><strong>Net:</strong> ₹{record.netSalary?.toLocaleString() || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="employee-payroll">
            <h2>My Salary History</h2>
            <div className="salary-history">
              {payrollData.map((salary, index) => (
                <div key={index} className="salary-record">
                  <div className="period">
                    <h3>{formatMonth(salary.month)} {salary.year}</h3>
                  </div>
                  <div className="salary-details">
                    <div className="earnings">
                      <h4>Earnings</h4>
                      <p>Basic: ₹{salary.basic?.toLocaleString() || 0}</p>
                      <p>Allowance: ₹{salary.allowance?.toLocaleString() || 0}</p>
                      {salary.overtime && <p>Overtime: ₹{salary.overtime.toLocaleString()}</p>}
                      {salary.bonus && <p>Bonus: ₹{salary.bonus.toLocaleString()}</p>}
                      <p><strong>Gross: ₹{salary.grossSalary?.toLocaleString() || (salary.basic + salary.allowance).toLocaleString()}</strong></p>
                    </div>
                    <div className="deductions">
                      <h4>Deductions</h4>
                      <p>Deduction: ₹{salary.deduction?.toLocaleString() || 0}</p>
                      {salary.tax && <p>Tax: ₹{salary.tax.toLocaleString()}</p>}
                      {salary.providentFund && <p>PF: ₹{salary.providentFund.toLocaleString()}</p>}
                      <p><strong>Net: ₹{salary.netSalary?.toLocaleString() || 0}</strong></p>
                    </div>
                  </div>
                  <div className="actions">
                    <button 
                      className="download-btn"
                      onClick={() => downloadPayslip(salary.month, salary.year)}
                    >
                      Download Payslip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;