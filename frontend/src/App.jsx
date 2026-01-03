import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import EmailVerification from './pages/EmailVerification';
import ResendVerification from './pages/ResendVerification';
import Rules from './components/RulesDashboard';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import LeaveManagement from './pages/LeaveManagement';
import Payroll from './components/Payroll';
import Employees from './components/Employees';
import LeaveApproval from './pages/LeaveApproval';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email/:token" element={<EmailVerification />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        <Route path="/rules" element={<Rules />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute requiredRole="Admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <Attendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/leave"
          element={
            <PrivateRoute>
              <LeaveManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/payroll"
          element={
            <PrivateRoute>
              <Payroll />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee-management"
          element={
            <PrivateRoute requiredRole="Admin">
              <Employees />
            </PrivateRoute>
          }
        />
        <Route
          path="/leave-approval"
          element={
            <PrivateRoute requiredRole="Admin">
              <LeaveApproval />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
