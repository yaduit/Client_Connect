import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth.js";

const ProtectedRoute = ({ children, requiredRole, allowSeeker }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or loader

  // Not logged in → go to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname}`}
        replace
      />
    );
  }

  // Role-based protection
  if (requiredRole) {
    // If allowSeeker=true, allow both the required role AND seekers
    if (allowSeeker && user?.role === "seeker") {
      return children;
    }
    
    if (user?.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
