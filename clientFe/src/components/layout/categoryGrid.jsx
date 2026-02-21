import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories.jsx";
import { Loader2, Package } from "lucide-react";

const CategoryGrid = () => {
  const { categories, loading, error } = useCategories();

  // Icon mapping - maps category names to icons
  const iconMap = {
    'Tourism & Travel': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    'IT & Office Services': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    'Household & Cleaning': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    'Agriculture Services': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    'Art, Education & Creative': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    'Health & Wellness': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    'Automotive Services': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    'Food & Catering': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    // Default icon for categories without specific mapping
    'default': (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  };

  // Subtitle mapping - you can customize these
  const subtitleMap = {
    'Tourism & Travel': 'Guides, tours, hospitality',
    'IT & Office Services': 'Tech support, software, consulting',
    'Household & Cleaning': 'Home care, maintenance, cleaning',
    'Agriculture Services': 'Farming, equipment, consulting',
    'Art, Education & Creative': 'Tutoring, design, creative services',
    'Health & Wellness': 'Medical, fitness, therapy',
    'Automotive Services': 'Repair, maintenance, detailing',
    'Food & Catering': 'Chefs, events, meal prep',
  };

  // Loading State
  if (loading) {
    return (
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              Browse Services by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find the right professional for your needs
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Unable to load categories</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (!categories || categories.length === 0) {
    return (
      <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
            Browse Services by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the right professional for your needs across various service categories
          </p>
        </div>

        {/* Category Grid - Now using REAL data from database */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              to={`/categories/${category.slug}`}
              key={category._id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border border-gray-100 hover:border-green-500 text-left group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-label={`Browse ${category.name}`}
            >
              {/* Icon - Use mapped icon or default */}
              <div className="text-green-600 mb-3 group-hover:scale-110 transition-transform duration-200">
                {iconMap[category.name] || iconMap['default']}
              </div>
              
              {/* Category Name */}
              <h3 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">
                {category.name}
              </h3>
              
              {/* Subtitle */}
              <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
                {subtitleMap[category.name] || `Browse ${category.name.toLowerCase()}`}
              </p>
              
              {/* Subcategory count (optional) */}
              {category.subCategories && category.subCategories.length > 0 && (
                <p className="text-xs text-green-600 mt-2 font-medium">
                  {category.subCategories.length} services
                </p>
              )}
            </Link>
          ))}
        </div>

        {/* View All Link - Optional */}
        <div className="text-center mt-10">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
          >
            View all categories
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CategoryGrid;
