import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function for navigation - replace with React Router's Link when integrated
  const handleNavClick = (e, path) => {
    e.preventDefault();
    console.log(`Navigate to: ${path}`);
    setIsMobileMenuOpen(false);
    // In production, replace with: navigate(path) or use <Link> from react-router-dom
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left section: Logo */}
          <div className="shrink-0">
            <a 
              href="/" 
              className="flex items-center"
              onClick={(e) => handleNavClick(e, '/')}
            >
              <span className="text-xl font-bold text-(--color-primary)">
                Client Connect
              </span>
            </a>
          </div>

          {/* Center section: Main navigation - hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-8">
            <a 
              href="/services" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/services')}
            >
              Services
            </a>
            <a 
              href="/write-review" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/write-review')}
            >
              Write a Review
            </a>
            
            {/* Location selector placeholder */}
            <button 
              className="flex items-center text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Select location"
              onClick={() => console.log('Location selector clicked')}
            >
              <span className="mr-1">📍</span>
              <span className="font-medium">Select location</span>
            </button>

            {/* Theme toggle placeholder */}
            <button 
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle theme"
              onClick={() => console.log('Theme toggle clicked')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
          </div>

          {/* Right section: Auth links and CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href="/login" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/login')}
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/signup')}
            >
              Signup
            </a>
            <a
              href="/become-provider"
              className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              onClick={(e) => handleNavClick(e, '/become-provider')}
            >
              Become a Provider
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            {/* CTA always visible on mobile */}
            <a
              href="/become-provider"
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
              onClick={(e) => handleNavClick(e, '/become-provider')}
            >
              Provider
            </a>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            <a 
              href="/services" 
              className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/services')}
            >
              Services
            </a>
            <a 
              href="/write-review" 
              className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
              onClick={(e) => handleNavClick(e, '/write-review')}
            >
              Write a Review
            </a>
            
            <button 
              className="flex items-center py-2 text-gray-700 hover:text-green-600 transition-colors w-full"
              aria-label="Select location"
              onClick={() => console.log('Location selector clicked')}
            >
              <span className="mr-1">📍</span>
              <span className="font-medium">Select location</span>
            </button>

            <button 
              className="flex items-center py-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label="Toggle theme"
              onClick={() => console.log('Theme toggle clicked')}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span className="font-medium">Dark mode</span>
            </button>

            <div className="pt-3 border-t border-gray-100 space-y-3">
              <a 
                href="/login" 
                className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick(e, '/login')}
              >
                Login
              </a>
              <a 
                href="/signup" 
                className="block py-2 text-gray-700 hover:text-green-600 font-medium transition-colors"
                onClick={(e) => handleNavClick(e, '/signup')}
              >
                Signup
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;