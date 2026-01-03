import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUser } from '../utils/auth';

const PrivateRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole) {
    const user = getUser();
    if (user?.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default PrivateRoute;