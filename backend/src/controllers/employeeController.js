const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get all employees (Admin only)
const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
          }
        }
      }
    });
    
    res.json(employees);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            employeeId: true,
            role: true,
          }
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update employee profile
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { phone, address, department, position, salaryBasic, salaryAllowance, salaryDeduction } = req.body;
    
    const employee = await prisma.employee.update({
      where: { id },
      data: {
        phone: phone || undefined,
        address: address || undefined,
        department: department || undefined,
        position: position || undefined,
        salaryBasic: salaryBasic ? parseFloat(salaryBasic) : undefined,
        salaryAllowance: salaryAllowance ? parseFloat(salaryAllowance) : undefined,
        salaryDeduction: salaryDeduction ? parseFloat(salaryDeduction) : undefined,
      }
    });

    res.json(employee);
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllEmployees, getEmployeeById, updateEmployee };