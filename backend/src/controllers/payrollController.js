const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Get my payroll
const getMyPayroll = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        salaries: {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ],
          take: 12 // Last 12 months
        }
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Generate sample salary data if none exists
    if (employee.salaries.length === 0) {
      const currentYear = new Date().getFullYear();
      const sampleSalaries = [];
      
      for (let month = 1; month <= 6; month++) {
        sampleSalaries.push({
          employeeId: employee.id,
          month,
          year: currentYear,
          basic: employee.salaryBasic,
          allowance: employee.salaryAllowance || 0,
          deduction: employee.salaryDeduction || 0,
          netSalary: employee.salaryBasic + (employee.salaryAllowance || 0) - (employee.salaryDeduction || 0)
        });
      }

      await prisma.salary.createMany({
        data: sampleSalaries
      });

      // Fetch again
      const updatedEmployee = await prisma.employee.findUnique({
        where: { userId },
        include: {
          salaries: {
            orderBy: [
              { year: 'desc' },
              { month: 'desc' }
            ],
            take: 12
          }
        }
      });

      res.json(updatedEmployee);
    } else {
      res.json(employee);
    }
  } catch (error) {
    console.error('Get my payroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all payroll (Admin only)
const getAllPayroll = async (req, res) => {
  try {
    const payroll = await prisma.salary.findMany({
      include: {
        employee: {
          include: {
            user: {
              select: {
                email: true,
                employeeId: true
              }
            }
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      take: 100 // Last 100 records
    });

    res.json(payroll);
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMyPayroll, getAllPayroll };