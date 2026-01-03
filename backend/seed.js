const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./src/utils/jwt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding default users...');

  // Create default Admin user
  const adminPassword = hashPassword('admin123456');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      email: 'admin@dayflow.com',
      password: adminPassword,
      employeeId: 'ADMIN001',
      role: 'Admin',
      employee: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          department: 'IT',
          position: 'System Administrator',
          phone: '+1234567890',
          address: '123 Admin Street, Tech City',
          joiningDate: new Date('2024-01-01'),
          salaryBasic: 85000,
          salaryAllowance: 15000,
          salaryDeduction: 5000,
        }
      }
    },
    include: { employee: true }
  });

  // Create default Employee user
  const employeePassword = hashPassword('employee123456');
  const employee = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      email: 'employee@dayflow.com',
      password: employeePassword,
      employeeId: 'EMP001',
      role: 'Employee',
      employee: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          department: 'Engineering',
          position: 'Software Developer',
          phone: '+1234567891',
          address: '456 Employee Avenue, Dev City',
          joiningDate: new Date('2024-02-01'),
          salaryBasic: 75000,
          salaryAllowance: 10000,
          salaryDeduction: 3000,
        }
      }
    },
    include: { employee: true }
  });

  console.log('✅ Default users created successfully!');
  console.log('\n📋 DEFAULT LOGIN CREDENTIALS:');
  console.log('================================');
  console.log('🔑 ADMIN LOGIN:');
  console.log('   Email: admin@dayflow.com');
  console.log('   Password: admin123456');
  console.log('\n🔑 EMPLOYEE LOGIN:');
  console.log('   Email: employee@dayflow.com');
  console.log('   Password: employee123456');
  console.log('================================');

  // Generate sample salary data for the employee
  const currentYear = new Date().getFullYear();
  const sampleSalaries = [];
  
  for (let month = 1; month <= 6; month++) {
    sampleSalaries.push({
      employeeId: employee.employee.id,
      month,
      year: currentYear,
      basic: employee.employee.salaryBasic,
      allowance: employee.employee.salaryAllowance || 0,
      deduction: employee.employee.salaryDeduction || 0,
      netSalary: employee.employee.salaryBasic + (employee.employee.salaryAllowance || 0) - (employee.employee.salaryDeduction || 0)
    });
  }

  // Also generate for admin
  for (let month = 1; month <= 6; month++) {
    sampleSalaries.push({
      employeeId: admin.employee.id,
      month,
      year: currentYear,
      basic: admin.employee.salaryBasic,
      allowance: admin.employee.salaryAllowance || 0,
      deduction: admin.employee.salaryDeduction || 0,
      netSalary: admin.employee.salaryBasic + (admin.employee.salaryAllowance || 0) - (admin.employee.salaryDeduction || 0)
    });
  }

  await prisma.salary.createMany({
    data: sampleSalaries
  });

  console.log('💰 Sample salary data generated for the last 6 months');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });