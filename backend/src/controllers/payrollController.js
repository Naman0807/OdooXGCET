const { PrismaClient } = require('@prisma/client');
const PDFDocument = require('pdfkit');

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
    const { month, year, employeeId } = req.query;
    
    const whereClause = {};
    if (month && year) {
      whereClause.month = parseInt(month);
      whereClause.year = parseInt(year);
    }
    if (employeeId) {
      whereClause.employeeId = employeeId;
    }
    
    const payroll = await prisma.salary.findMany({
      where: whereClause,
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
      take: 100
    });

    res.json(payroll);
  } catch (error) {
    console.error('Get all payroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate payroll for a month
const generatePayroll = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    const employees = await prisma.employee.findMany({
      where: { isActive: true },
      include: {
        user: {
          select: {
            email: true,
            employeeId: true
          }
        }
      }
    });

    const payrollResults = [];
    
    for (const employee of employees) {
      const existingPayroll = await prisma.salary.findFirst({
        where: {
          employeeId: employee.id,
          month,
          year
        }
      });

      if (!existingPayroll) {
        const basic = employee.salaryBasic;
        const allowance = employee.salaryAllowance || 0;
        const deduction = employee.salaryDeduction || 0;
        const overtime = 0;
        const bonus = 0;
        
        const grossSalary = basic + allowance + overtime + bonus;
        const tax = grossSalary * 0.1;
        const providentFund = basic * 0.12;
        const totalDeductions = deduction + tax + providentFund;
        const netSalary = grossSalary - totalDeductions;

        const salary = await prisma.salary.create({
          data: {
            employeeId: employee.id,
            month,
            year,
            basic,
            allowance,
            deduction,
            overtime,
            bonus,
            tax,
            providentFund,
            grossSalary,
            netSalary
          }
        });

        payrollResults.push({
          employeeId: employee.id,
          employeeName: employee.fullName,
          netSalary
        });
      }
    }

    res.json({
      message: 'Payroll generated successfully',
      results: payrollResults
    });
  } catch (error) {
    console.error('Generate payroll error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Generate payslip PDF
const generatePayslip = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.userId;
    
    const employee = await prisma.employee.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            employeeId: true
          }
        },
        salaries: {
          where: {
            month: parseInt(month),
            year: parseInt(year)
          }
        }
      }
    });

    if (!employee || employee.salaries.length === 0) {
      return res.status(404).json({ error: 'Payslip not found' });
    }

    const salary = employee.salaries[0];
    
    const doc = new PDFDocument();
    const filename = `payslip_${employee.employeeId}_${month}_${year}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text('PAYSLIP', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Employee ID: ${employee.employeeId}`);
    doc.text(`Name: ${employee.fullName}`);
    doc.text(`Department: ${employee.department}`);
    doc.text(`Month: ${month}/${year}`);
    doc.moveDown();
    
    doc.text('EARNINGS:');
    doc.text(`Basic Salary: ₹${salary.basic.toLocaleString()}`);
    doc.text(`Allowance: ₹${salary.allowance.toLocaleString()}`);
    doc.text(`Overtime: ₹${salary.overtime.toLocaleString()}`);
    doc.text(`Bonus: ₹${salary.bonus.toLocaleString()}`);
    doc.text(`Gross Salary: ₹${salary.grossSalary.toLocaleString()}`);
    doc.moveDown();
    
    doc.text('DEDUCTIONS:');
    doc.text(`Deduction: ₹${salary.deduction.toLocaleString()}`);
    doc.text(`Tax (10%): ₹${salary.tax.toLocaleString()}`);
    doc.text(`Provident Fund (12%): ₹${salary.providentFund.toLocaleString()}`);
    doc.text(`Total Deductions: ₹${(salary.deduction + salary.tax + salary.providentFund).toLocaleString()}`);
    doc.moveDown();
    
    doc.fontSize(14).text(`NET SALARY: ₹${salary.netSalary.toLocaleString()}`);
    
    doc.end();
  } catch (error) {
    console.error('Generate payslip error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update salary details
const updateSalary = async (req, res) => {
  try {
    const { employeeId, basic, allowance, deduction } = req.body;
    
    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data: {
        salaryBasic: basic,
        salaryAllowance: allowance,
        salaryDeduction: deduction
      }
    });

    res.json(employee);
  } catch (error) {
    console.error('Update salary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  getMyPayroll, 
  getAllPayroll, 
  generatePayroll, 
  generatePayslip, 
  updateSalary 
};