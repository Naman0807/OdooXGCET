const { PrismaClient } = require('@prisma/client');
const { generateToken, hashPassword, comparePassword } = require('../utils/jwt');

const prisma = new PrismaClient();

// Sign Up
const signUp = async (req, res) => {
  try {
    const { email, password, employeeId, role, firstName, lastName, department, position, phone, address, joiningDate, salaryBasic, salaryAllowance, salaryDeduction } = req.body;

    // Validation
    if (!email || !password || !employeeId || !role || !firstName || !lastName || !department || !position || !joiningDate || !salaryBasic) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { employeeId }] },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Create user and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const hashedPassword = hashPassword(password);
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          employeeId,
          role,
        },
      });

      // Create employee
      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          department,
          position,
          phone: phone || null,
          address: address || null,
          joiningDate: new Date(joiningDate),
          salaryBasic: parseFloat(salaryBasic),
          salaryAllowance: parseFloat(salaryAllowance || 0),
          salaryDeduction: parseFloat(salaryDeduction || 0),
        },
      });

      return { user, employee };
    });

    const token = generateToken(result.user.id, result.user.role);
    res.status(201).json({ 
      message: 'User created successfully',
      token,
      user: { 
        id: result.user.id, 
        email: result.user.email, 
        role: result.user.role,
        employee: result.employee
      }
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Sign In
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { employee: true },
    });

    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        employee: user.employee,
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signUp, signIn };