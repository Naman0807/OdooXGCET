const { PrismaClient } = require('@prisma/client');
const { getUser } = require('../utils/auth');

const prisma = new PrismaClient();

// Check in
const checkIn = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Find employee for this user
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Check if already checked in today
    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: new Date(today)
        }
      }
    });

    if (existingAttendance && existingAttendance.checkInTime) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    // Create or update attendance
    const attendance = await prisma.attendance.upsert({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: new Date(today)
        }
      },
      update: {
        checkInTime: new Date(),
        status: 'Present'
      },
      create: {
        employeeId: employee.id,
        date: new Date(today),
        checkInTime: new Date(),
        status: 'Present'
      }
    });

    res.json(attendance);
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check out
const checkOut = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    
    const attendance = await prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: employee.id,
          date: new Date(today)
        }
      }
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ error: 'Not checked in today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ error: 'Already checked out today' });
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime: new Date()
      }
    });

    res.json(updatedAttendance);
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get my attendance
const getMyAttendance = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const attendance = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: 'desc' },
      take: 30 // Last 30 days
    });

    res.json(attendance);
  } catch (error) {
    console.error('Get my attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all attendance (Admin only)
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
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
      orderBy: { date: 'desc' },
      take: 100 // Last 100 records
    });

    res.json(attendance);
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { checkIn, checkOut, getMyAttendance, getAllAttendance };