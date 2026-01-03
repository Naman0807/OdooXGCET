const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Generate a unique employee ID based on department and count
 * Format: [DEPT_CODE][SERIAL_NUMBER]
 * Examples: EMP001, IT023, HR045
 */
const generateEmployeeId = async (department, position) => {
  // Department codes mapping
  const departmentCodes = {
    'IT': 'IT',
    'Information Technology': 'IT',
    'HR': 'HR',
    'Human Resources': 'HR',
    'Finance': 'FIN',
    'Accounting': 'ACC',
    'Marketing': 'MKT',
    'Sales': 'SAL',
    'Operations': 'OPS',
    'Administration': 'ADM',
    'Engineering': 'ENG',
    'Customer Service': 'CS',
    'Quality Assurance': 'QA'
  };

  // Get department code (fallback to department name first 3 chars if not found)
  const deptCode = departmentCodes[department] || 
                  departmentCodes[department.toUpperCase()] || 
                  department.substring(0, 3).toUpperCase();

  try {
    // Get the highest existing employee ID for this department
    const lastEmployee = await prisma.user.findFirst({
      where: {
        employeeId: {
          startsWith: deptCode
        }
      },
      orderBy: {
        employeeId: 'desc'
      }
    });

    let serialNumber = 1;
    
    if (lastEmployee) {
      // Extract numeric part from employee ID
      const lastSerial = parseInt(lastEmployee.employeeId.substring(deptCode.length));
      serialNumber = lastSerial + 1;
    }

    // Format with leading zeros (3 digits)
    const employeeId = `${deptCode}${serialNumber.toString().padStart(3, '0')}`;
    
    return employeeId;
  } catch (error) {
    console.error('Error generating employee ID:', error);
    // Fallback to timestamp-based ID
    const timestamp = Date.now().toString().slice(-6);
    return `${deptCode}${timestamp}`;
  }
};

/**
 * Validate employee ID format
 */
const validateEmployeeId = (employeeId) => {
  // Employee ID should be 6+ characters: 3 letters + 3+ numbers
  const pattern = /^[A-Z]{3,4}\d{3,}$/;
  return pattern.test(employeeId);
};

/**
 * Generate temporary employee ID for unverified users
 * Format: TEMP_[TIMESTAMP]_[RANDOM]
 */
const generateTempEmployeeId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TEMP_${timestamp}_${random}`;
};

/**
 * Convert temporary employee ID to permanent one
 */
const convertTempEmployeeId = async (tempId, permanentId) => {
  try {
    await prisma.user.updateMany({
      where: { employeeId: tempId },
      data: { employeeId: permanentId }
    });
    return true;
  } catch (error) {
    console.error('Error converting employee ID:', error);
    return false;
  }
};

module.exports = {
  generateEmployeeId,
  validateEmployeeId,
  generateTempEmployeeId,
  convertTempEmployeeId
};