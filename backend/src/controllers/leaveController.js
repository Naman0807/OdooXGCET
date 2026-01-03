const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Apply for leave
const applyLeave = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { leaveType, startDate, endDate, remarks } = req.body;
    
    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ error: 'Leave type, start date, and end date are required' });
    }

    // Find employee for this user
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId: employee.id,
        leaveType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        remarks: remarks || null,
        status: 'Pending'
      },
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
      }
    });

    res.status(201).json(leave);
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get my leaves
const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const employee = await prisma.employee.findUnique({
      where: { userId }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const leaves = await prisma.leave.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: 'desc' },
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
      }
    });

    res.json(leaves);
  } catch (error) {
    console.error('Get my leaves error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get pending leaves (Admin only)
const getPendingLeaves = async (req, res) => {
  try {
    const leaves = await prisma.leave.findMany({
      where: { status: 'Pending' },
      orderBy: { createdAt: 'desc' },
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
      }
    });

    res.json(leaves);
  } catch (error) {
    console.error('Get pending leaves error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Approve leave (Admin only)
const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComments } = req.body;
    
    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'Approved',
        adminComments: adminComments || null
      },
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
      }
    });

    res.json(leave);
  } catch (error) {
    console.error('Approve leave error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Reject leave (Admin only)
const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminComments } = req.body;
    
    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status: 'Rejected',
        adminComments: adminComments || null
      },
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
      }
    });

    res.json(leave);
  } catch (error) {
    console.error('Reject leave error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { applyLeave, getMyLeaves, getPendingLeaves, approveLeave, rejectLeave };