import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth.js";

const ProtectedRoute = ({ children, role }) => {
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
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
