import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * Semantic Breadcrumb Navigation Component
 * Industry-standard accessibility & UX
 * 
 * @param {array} items - Array of breadcrumb items
 * Example: [
 *   { label: "Home", path: "/" },
 *   { label: "Categories", path: "/categories" },
 *   { label: "Cleaning", path: "/categories/cleaning" }
 * ]
 */
const Breadcrumb = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-4 overflow-x-auto">
          {/* Home Icon Link */}
          <Link
            to="/"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 transition-colors shrink-0 text-gray-600 hover:text-gray-800"
            aria-label="Home"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </Link>

          {/* Breadcrumb Items */}
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 shrink-0">
              {/* Separator */}
              <ChevronRight className="w-4 h-4 text-gray-400" />

              {/* Item */}
              {index === items.length - 1 ? (
                // Last item - not clickable (current page)
                <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                  {item.label}
                </span>
              ) : (
                // Clickable item
                <Link
                  to={item.path}
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Breadcrumb;
