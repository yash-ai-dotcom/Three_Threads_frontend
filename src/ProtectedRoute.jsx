import { Navigate } from 'react-router-dom';

function ProtectedRoute({ userRole, allowedRoles, children }) {
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/inventory" replace />;
  }

  return children;
}

export default ProtectedRoute;