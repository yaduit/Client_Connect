import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, isAuthenticated, logout } = useAuth();

  const handleBecomeProvider = () => {
    if (loading) {
      return;
    }

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

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section: Logo */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-(--color-primary)">
                Client Connect
              </span>
            </Link>
          </div>

          {/* Center section: Main navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/services"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/write-review"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Write a Review
            </Link>

            {/* Location selector placeholder */}
            <button
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Select location"
              onClick={() => console.log("Location selector clicked")}
            >
              <span className="mr-1">📍</span>
              <span className="font-medium">Select location</span>
            </button>

            {/* Theme toggle placeholder */}
            <button
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle theme"
              onClick={() => console.log("Theme toggle clicked")}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            </button>
          </div>

          {/* Right section: Auth links and CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                {user?.role === "provider" && (
                  <Link
                    to="/provider/dashboard"
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-gray-700 font-medium">
                  Hi, {user?.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
            {(!isAuthenticated || user?.role === "seeker") && (
              <button
                onClick={handleBecomeProvider}
                disabled={loading}
                className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Become a Provider
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* CTA always visible on mobile */}
            <button
              onClick={handleBecomeProvider}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Provider
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
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

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-3">
            <Link
              to="/services"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/write-review"
              className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Write a Review
            </Link>

            <button
              className="flex items-center py-2 text-gray-700 hover:text-green-600 transition-colors w-full"
              aria-label="Select location"
              onClick={() => console.log("Location selector clicked")}
            >
              <span className="mr-1">📍</span>
              <span className="font-medium">Select location</span>
            </button>

            <button
              className="flex items-center py-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle theme"
              onClick={() => console.log("Theme toggle clicked")}
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <span className="font-medium">Dark mode</span>
            </button>

            <div className="pt-3 border-t border-gray-100 space-y-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Signup
                  </Link>
                </>
              ) : (
                <>
                  {user?.role === "provider" && (
                    <Link
                      to="/provider/dashboard"
                      className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin/dashboard"
                      className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-0 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Logout
                  </button>
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
