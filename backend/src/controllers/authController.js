const { PrismaClient } = require('@prisma/client');
const { generateToken, hashPassword, comparePassword } = require('../utils/jwt');
const EmailService = require('../services/emailService');
const EmailTemplates = require('../utils/emailTemplates');
const { generateEmployeeId, validateEmployeeId, generateTempEmployeeId } = require('../utils/employeeIdGenerator');

const prisma = new PrismaClient();
const emailService = new EmailService();

// Initialize email service
(async () => {
  await emailService.verifyConnection();
})();

// Sign Up with Email Verification
const signUp = async (req, res) => {
  try {
    const { 
      email, 
      password, 
      role, 
      firstName, 
      lastName, 
      department, 
      position, 
      phone, 
      address, 
      joiningDate, 
      salaryBasic, 
      salaryAllowance, 
      salaryDeduction 
    } = req.body;

    // Validation (employeeId is no longer required - will be generated)
    const requiredFields = ['email', 'password', 'role', 'firstName', 'lastName', 'department', 'position', 'joiningDate', 'salaryBasic'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Generate employee ID and verification token
    const finalEmployeeId = await generateEmployeeId(department, position);
    const verificationToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    // Create user and employee in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user (unverified initially)
      const hashedPassword = hashPassword(password);
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          employeeId: finalEmployeeId,
          role,
          emailVerificationToken: verificationToken,
          emailVerificationExpires: tokenExpiration,
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

      // Create email verification record
      await tx.emailVerification.create({
        data: {
          userId: user.id,
          token: verificationToken,
          email,
          purpose: 'registration',
          expiresAt: tokenExpiration,
        },
      });

      return { user, employee };
    });

    // Send verification email
    try {
      await emailService.sendVerificationEmail(
        email, 
        verificationToken, 
        `${firstName} ${lastName}`,
        'registration'
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration, but log the error
    }

    res.status(201).json({ 
      message: 'Registration successful! Please check your email to verify your account.',
      email: email,
      employeeId: finalEmployeeId,
      requiresVerification: true
    });
    
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Sign In (with email verification check)
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
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      // Check if verification token has expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(403).json({ 
          error: 'Email verification has expired. Please request a new verification email.',
          requiresVerification: true,
          verificationExpired: true
        });
      }
      
      return res.status(403).json({ 
        error: 'Please verify your email before signing in',
        requiresVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user.id, user.role);
    res.json({
      message: 'Sign in successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        employee: user.employee,
      },
    });
    
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Server error during sign in' });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // Find verification record
    const verification = await prisma.emailVerification.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!verification) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    // Check if token has expired
    if (new Date() > verification.expiresAt) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Check if token has already been used
    if (verification.usedAt) {
      return res.status(400).json({ error: 'Verification token has already been used' });
    }

    // Update user and verification record in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update user email verification status
      const updatedUser = await tx.user.update({
        where: { id: verification.userId },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });

      // Mark verification token as used
      await tx.emailVerification.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      });

      return updatedUser;
    });

    // Send welcome email
    try {
      const welcomeTemplate = EmailTemplates.getWelcomeTemplate(
        verification.user.employee?.firstName || 'User',
        `${process.env.FRONTEND_URL}/signin`
      );
      
      await emailService.transporter.sendMail({
        from: process.env.EMAIL_FROM || '"Dayflow HRMS" <noreply@dayflow.com>',
        to: verification.email,
        subject: welcomeTemplate.subject,
        html: welcomeTemplate.html,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.json({
      message: 'Email verified successfully! You can now sign in.',
      email: verification.email,
    });
    
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Server error during email verification' });
  }
};

// Resend Verification Email
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { employee: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'Email is already verified' });
    }

    // Rate limiting: Check if a verification email was sent recently
    const recentVerification = await prisma.emailVerification.findFirst({
      where: {
        userId: user.id,
        purpose: 'registration',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        }
      }
    });

    if (recentVerification) {
      return res.status(429).json({ 
        error: 'Please wait before requesting another verification email' 
      });
    }

    // Generate new verification token
    const newToken = emailService.generateVerificationToken();
    const tokenExpiration = emailService.getTokenExpiration();

    // Update user and create new verification record
    await prisma.$transaction(async (tx) => {
      // Update user with new token
      await tx.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: newToken,
          emailVerificationExpires: tokenExpiration,
        },
      });

      // Create new verification record
      await tx.emailVerification.create({
        data: {
          userId: user.id,
          token: newToken,
          email: user.email,
          purpose: 'registration',
          expiresAt: tokenExpiration,
        },
      });
    });

    // Send verification email
    await emailService.sendVerificationEmail(
      email,
      newToken,
      user.employee ? `${user.employee.firstName} ${user.employee.lastName}` : 'User',
      'registration'
    );

    res.json({
      message: 'Verification email sent successfully. Please check your inbox.',
      email: email,
    });
    
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Server error while resending verification email' });
  }
};

// Get User Status (for checking verification status)
const getUserStatus = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        emailVerificationExpires: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      verificationExpired: user.emailVerificationExpires ? 
        new Date() > user.emailVerificationExpires : false,
      accountCreated: user.createdAt,
    });
    
  } catch (error) {
    console.error('Get user status error:', error);
    res.status(500).json({ error: 'Server error while checking user status' });
  }
};

module.exports = { 
  signUp, 
  signIn, 
  verifyEmail, 
  resendVerification, 
  getUserStatus 
};