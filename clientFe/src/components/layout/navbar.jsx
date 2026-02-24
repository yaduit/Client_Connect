import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { useLocation } from "../../context/location/useLocation";
import { useTheme } from "../../context/theme/useTheme";
import { LogoutApi } from "../../api/auth.api.js";
import { MapPin, Loader, Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const { location } = useLocation();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    console.log("🔍 Navbar Auth State Updated:", {
      isAuthenticated,
      userRole: user?.role,
      userName: user?.name,
      loading,
    });
  }, [isAuthenticated, user, loading]);

  const handleBecomeProvider = () => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate("/login?redirect=/provider/onboarding");
      return;
    }
    if (user.role === "provider") {
      navigate("/provider/dashboard");
      return;
    }
    navigate("/provider/onboarding");
  };

  const handleLogout = async () => {
    try {
      await LogoutApi();
      logout();
      navigate("/");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      logout();
      navigate("/");
    }
  };



  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleNavigation = (callback) => {
    closeMobileMenu();
    callback();
  };



  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Updated with elegant styling */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-green-600 tracking-tight">
                CLIENT CONNECT
              </span>
            </Link>
          </div>

          {/* Center navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/write-review"
              className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
            >
              Write a Review
            </Link>

            {/* Location Display */}
            <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm gap-2 px-3 py-2">
              {location?.loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span className="font-medium">Detecting location...</span>
                </>
              ) : location?.error ? (
                <>
                  <MapPin size={18} className="text-red-500" />
                  <span className="font-medium text-red-600 dark:text-red-400">Location denied</span>
                </>
              ) : (
                <>
                  <MapPin size={18} className="text-green-600" />
                  <span className="font-medium">
                    {location?.city ? `${location.city}, ${location.state}` : "Detecting..."}
                  </span>
                </>
              )}
            </div>

            <button
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
          </div>

          {/* Right section */}
          <div className="hidden lg:flex items-center space-x-4">
            {loading ? (
              <div className="text-gray-600 dark:text-gray-400 text-sm">Loading...</div>
            ) : (
              <>
                {!isAuthenticated && (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Signup
                    </Link>
                    {/* ✅ Premium LV-style button */}
                    <button
                      onClick={handleBecomeProvider}
                      className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow text-sm uppercase tracking-wide"
                    >
                      Become a Provider
                    </button>
                  </>
                )}

                {isAuthenticated && user?.role === "seeker" && (
                  <>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      Hi, {user.name}
                    </span>
                    <button
                      onClick={handleBecomeProvider}
                      className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow text-sm uppercase tracking-wide"
                    >
                      Become a Provider
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
                    >
                      Logout
                    </button>
                  </>
                )}

                {isAuthenticated && user?.role === "provider" && (
                  <>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      Hi, {user.name}
                    </span>
                    <Link
                      to="/provider/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
                    >
                      Logout
                    </button>
                  </>
                )}

                {isAuthenticated && user?.role === "admin" && (
                  <>
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                      Hi, {user.name}
                    </span>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Admin Panel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
                    >
                      Logout
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {!isAuthenticated && (
              <button
                onClick={() => handleNavigation(handleBecomeProvider)}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-xs uppercase tracking-wide disabled:opacity-50"
              >
                Provider
              </button>
            )}

            {isAuthenticated && user?.role === "provider" && (
              <Link
                to="/provider/dashboard"
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-xs uppercase tracking-wide"
              >
                Dashboard
              </Link>
            )}

            {isAuthenticated && user?.role === "seeker" && (
              <button
                onClick={() => handleNavigation(handleBecomeProvider)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-xs uppercase tracking-wide"
              >
                Provider
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/write-review"
              onClick={closeMobileMenu}
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
            >
              Write a Review
            </Link>

            {/* Mobile Location Display */}
            <div className="flex items-center py-2 text-gray-700 dark:text-gray-300 text-sm gap-2">
              {location?.loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span className="font-medium">Detecting...</span>
                </>
              ) : location?.error ? (
                <>
                  <MapPin size={18} className="text-red-500" />
                  <span className="font-medium text-red-600 dark:text-red-400">Location denied</span>
                </>
              ) : (
                <>
                  <MapPin size={18} className="text-green-600" />
                  <span className="font-medium">
                    {location?.city ? `${location.city}, ${location.state}` : "Detecting..."}
                  </span>
                </>
              )}
            </div>

            <button
              className="flex items-center py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors text-sm gap-2"
              onClick={toggleTheme}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
              <span className="font-medium">{isDark ? "Light mode" : "Dark mode"}</span>
            </button>

            <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
              {loading ? (
                <div className="text-gray-600 dark:text-gray-400 text-sm">Loading...</div>
              ) : (
                <>
                  {!isAuthenticated && (
                    <>
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={closeMobileMenu}
                        className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                      >
                        Signup
                      </Link>
                    </>
                  )}

                  {isAuthenticated && (
                    <div className="py-2 text-gray-700 dark:text-gray-300 font-medium text-sm">
                      Hi, {user?.name}
                    </div>
                  )}

                  {isAuthenticated && user?.role === "seeker" && (
                    <button
                      onClick={() =>
                        handleNavigation(handleBecomeProvider)
                      }
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors w-full text-left text-sm"
                    >
                      Become a Provider
                    </button>
                  )}

                  {isAuthenticated && user?.role === "provider" && (
                    <Link
                      to="/provider/dashboard"
                      onClick={closeMobileMenu}
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Dashboard
                    </Link>
                  )}

                  {isAuthenticated && user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMobileMenu}
                      className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium transition-colors text-sm"
                    >
                      Admin Panel
                    </Link>
                  )}

                  {isAuthenticated && (
                    <button
                      onClick={() =>
                        handleNavigation(handleLogout)
                      }
                      className="w-full text-left px-0 py-2 text-red-600 hover:text-red-700 font-medium transition-colors text-sm"
                    >
                      Logout
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
