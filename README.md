# 🏢 Dayflow HRMS

A comprehensive Human Resource Management System built with React, Node.js, and Prisma

[Node.js](https://nodejs.org/) • [React](https://reactjs.org/) • [Prisma](https://www.prisma.io/)

[License](LICENSE)

## 📋 Overview

Dayflow HRMS is a full-stack Human Resource Management System designed to streamline HR operations with role-based access and approval workflows. Built with modern web technologies, it provides a comprehensive solution for employee management, attendance tracking, leave management, and payroll administration.

## ✨ Key Features

### 🔐 Authentication & Security

- **Email Verification**: Secure user registration with email verification
- **Role-Based Access**: Separate dashboards for Employees and Administrators
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Encrypted password storage with bcrypt

### 👤 Employee Management

- **Profile Management**: View and edit personal information
- **Employee ID Generation**: Auto-generated department-based employee IDs
- **Department Organization**: Structured employee data by department

### ⏰ Attendance System

- **Daily Check-in/Check-out**: Real-time attendance tracking
- **Attendance History**: View past attendance records
- **Status Management**: Present, Absent, Half-day, Leave status
- **Weekly/Monthly Views**: Comprehensive attendance reports

### 📅 Leave Management

- **Leave Application**: Apply for paid, sick, or unpaid leave
- **Approval Workflow**: Admin approval/rejection system
- **Leave Balance**: Track available leave days
- **Status Tracking**: Real-time leave request status updates

### 💰 Payroll Management

- **Salary Structure**: View detailed salary components
- **Salary History**: Historical payroll data
- **Department-Based**: Organized by employee roles
- **Read-Only Access**: Secure payroll information viewing

### 📊 Dashboard Analytics

- **Employee Dashboard**: Quick access to personal features
- **Admin Dashboard**: Comprehensive system overview
- **Real-time Updates**: Dynamic data synchronization
- **Navigation Hub**: Centralized access to all modules

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI framework
- **React Router 7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Vite** - Fast development build tool

### Backend

- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **Prisma 5** - Database ORM
- **SQLite** - Database (development)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **UUID** - Unique identifier generation

## 🏗️ Project Structure

```
hrms-dayflow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── attendanceController.js
│   │   │   ├── employeeController.js
│   │   │   ├── leaveController.js
│   │   │   └── payrollController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── attendance.js
│   │   │   ├── employees.js
│   │   │   ├── leave.js
│   │   │   ├── payroll.js
│   │   │   └── rules.js
│   │   ├── services/
│   │   │   └── emailService.js
│   │   ├── utils/
│   │   │   ├── emailTemplates.js
│   │   │   ├── employeeIdGenerator.js
│   │   │   └── jwt.js
│   │   ├── app.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   ├── ResendVerification.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Attendance.jsx
│   │   │   ├── LeaveManagement.jsx
│   │   │   ├── LeaveApproval.jsx
│   │   │   ├── Payroll.jsx
│   │   │   ├── EmployeeManagement.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Rules.jsx
│   │   │   ├── RuleCategory.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── auth.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
├── PRD.txt
├── LOGIN_CREDENTIALS.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hrms-dayflow
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Set up database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database Studio**: `npx prisma studio` (from backend directory)

## 🔧 Environment Configuration

### Backend Environment Variables (.env)

```
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email Configuration (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="Dayflow HRMS <noreply@dayflow.com>"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Server Port
PORT="5000"
```

## 📊 Database Schema

The application uses the following main entities:

### User & Authentication

- **User**: Basic user information with email verification
- **EmailVerification**: Token-based email verification system

### Core HR Entities

- **Employee**: Detailed employee profile with salary information
- **Attendance**: Daily attendance records with check-in/out times
- **Leave**: Leave requests with approval workflow
- **Salary**: Monthly salary records and history

### Relationships

- User ↔ Employee (1:1)
- Employee → Attendance (1:N)
- Employee → Leave (1:N)
- Employee → Salary (1:N)

## 🎯 User Roles & Permissions

### Employee Role

- View and edit personal profile
- Check-in/check-out attendance
- Apply for leave and view status
- View personal payroll information
- Access personal dashboard

### Admin Role

- All employee permissions
- View all employee profiles
- Approve/reject leave requests
- Access comprehensive admin dashboard
- View system-wide analytics
- Manage employee data

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/resend-verification` - Resend verification email

### Employee Management

- `GET /api/employees` - Get all employees (Admin)
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee profile

### Attendance

- `GET /api/attendance` - Get attendance records
- `POST /api/attendance/checkin` - Check-in
- `POST /api/attendance/checkout` - Check-out

### Leave Management

- `GET /api/leave` - Get leave requests
- `POST /api/leave` - Apply for leave
- `PUT /api/leave/:id/approve` - Approve leave (Admin)
- `PUT /api/leave/:id/reject` - Reject leave (Admin)

### Payroll

- `GET /api/payroll` - Get payroll information

## 🧪 Testing

### Run Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
```

### Manual Testing

Use the default credentials from [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md):

- **Admin**: admin@dayflow.com / admin123456
- **Employee**: employee@dayflow.com / employee123456

## 📸 Screenshots & Images

Note: Add screenshots of the application in action here when available

## 🔄 Development Workflow

### Feature Development

1. Create feature branch from main
2. Implement backend API endpoints
3. Create frontend components
4. Test functionality
5. Update documentation
6. Submit pull request

### Code Standards

- Follow ESLint configuration
- Use conventional commit messages
- Write meaningful component and function names
- Add appropriate error handling

## 🚀 Deployment

### Production Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Setup

- Configure production database
- Set up production environment variables
- Configure email service
- Set up reverse proxy (nginx/Apache)

## 🛡️ Security Features

- **Password Encryption**: bcryptjs for secure password hashing
- **JWT Authentication**: Stateless token-based authentication
- **Email Verification**: Prevents fake account creation
- **Role-Based Access**: Proper authorization checks
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin resource sharing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- Check the [PRD.txt](PRD.txt) for detailed requirements
- Refer to [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md) for access information
- Open an issue for bugs or feature requests

## 🗺️ Roadmap

### Completed Features ✅

- Core authentication with email verification
- Role-based dashboards
- Employee profile management
- Attendance tracking system
- Leave management with approval workflow
- Payroll viewing system

### Future Enhancements 📋

- Email notifications for leave approvals
- Advanced analytics dashboard
- Attendance report exports
- Leave balance calculations
- Profile picture uploads
- Performance review system
- Shift management
- Expense tracking
- Mobile application

---

Built with ❤️ for efficient HR management
