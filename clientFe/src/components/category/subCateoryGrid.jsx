import { ArrowRight, Package } from "lucide-react";

const SubCategoryGrid = ({ subCategories, onSelect }) => {
  if (!subCategories?.length) {
    return (
      <div className="bg-gray-50 min-h-[400px] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="bg-white rounded-lg p-12 text-center max-w-sm mx-auto border border-gray-200 shadow-sm">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Services Available
            </h3>
            <p className="text-sm text-gray-600">
              This category doesn't have any subcategories at the moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subCategories.map((sub) => (
            <button
              key={sub.slug}
              onClick={() => onSelect(sub.slug)}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-500 text-left h-full hover:-translate-y-1"
            >
              {/* Top accent bar */}
              <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="w-12 h-12 bg-green-50 group-hover:bg-green-100 rounded-lg flex items-center justify-center mb-4 transition-colors duration-200">
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

                {/* Title - Updated with elegant class */}
                <h3 className="text-elegant text-base text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">
                  {sub.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs mb-4 line-clamp-2">
                  Browse available service providers
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-green-100 transition-colors">
                  <span className="text-xs font-medium text-gray-600 group-hover:text-green-600 transition-colors">
                    View Providers
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubCategoryGrid;