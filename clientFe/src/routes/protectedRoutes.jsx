import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth.js";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requiredRole, allowSeeker = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // ✅ IMPROVED: Show professional loading state instead of null
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // ✅ Not logged in → redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  }

  // ✅ Role-based protection
  if (requiredRole) {
    // Special case: Provider onboarding allows seekers
    if (allowSeeker && user?.role === "seeker") {
      return children;
    }

    // If user doesn't have required role
    if (user?.role !== requiredRole) {
      // Better UX: If seeker tries to access provider routes, send to onboarding
      if (requiredRole === "provider" && user?.role === "seeker") {
        return <Navigate to="/provider/onboarding" replace />;
      }

      // If provider tries to access seeker-only routes (if you add them later)
      if (requiredRole === "seeker" && user?.role === "provider") {
        return <Navigate to="/provider/dashboard" replace />;
      }

      // Default: redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // ✅ All checks passed → render protected content
  return children;
};

export default ProtectedRoute;
