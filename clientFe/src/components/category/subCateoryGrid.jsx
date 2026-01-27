import { ArrowRight, Package } from "lucide-react";

const SubCategoryGrid = ({ subCategories, onSelect }) => {
  if (!subCategories?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Subcategories Available
          </h3>
          <p className="text-gray-600">
            This category doesn't have any subcategories at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose a Service
        </h2>
        <p className="text-gray-600">
          Select a subcategory to find providers
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subCategories.map((sub) => (
          <button
            key={sub.slug}
            onClick={() => onSelect(sub.slug)}
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-gray-100 hover:border-green-500 text-left relative overflow-hidden"
          >
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

            {/* Icon Circle */}
            <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-colors">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-green-600 transition-colors">
              {sub.name}
            </h3>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 group-hover:text-green-600 font-medium transition-colors">
                View Providers
              </span>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-12 bg-linear-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">
              Can't find what you're looking for?
            </h4>
            <p className="text-sm text-gray-600">
              Try using the search feature or browse other categories to find the perfect service provider for your needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryGrid;