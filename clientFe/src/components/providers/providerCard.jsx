import { Link } from "react-router-dom";
import ProviderDetailsSkeleton from "./providerDetailsSkeleton";

const ProviderCard = ({ provider, loading = false }) => {
  if (loading) {
    return <ProviderDetailsSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group max-w-sm w-full">
      {/* Image */}
      <div className="h-32 sm:h-36 bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
        <span className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wide">
          Service Image
        </span>
        <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300"></div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Title - Updated with elegant class */}
        <h3 className="text-elegant text-base sm:text-lg text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
          {provider.businessName}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-1">
          <span className="font-semibold text-gray-700">
            {provider.categoryId?.name}
          </span>
          <span className="text-gray-400 mx-1">•</span>
          <span className="text-gray-500">{provider.subCategorySlug}</span>
        </p>

        <p className="text-xs sm:text-sm text-gray-500 flex items-start gap-1.5 line-clamp-1">
          <span className="text-sm leading-none">📍</span>
          <span className="leading-relaxed">
            {provider.location.city}, {provider.location.state}
          </span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-xs sm:text-sm pt-0.5">
          <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
            <span className="text-amber-500 text-sm leading-none">⭐</span>
            <span className="font-bold text-gray-900">
              {provider.ratingAverage}
            </span>
          </div>
          <span className="text-gray-500 text-xs">
            ({provider.totalReviews})
          </span>
        </div>

        {/* Trust badges */}
        <div className="flex gap-2 text-xs font-semibold">
          <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
            ✓ Verified
          </span>
          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Actions - Updated with premium button */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <Link
            to={`/providers/${provider._id}`}
            className="flex-1 text-center bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 font-semibold text-xs sm:text-sm shadow-sm hover:shadow uppercase tracking-wide"
          >
            View Details
          </Link>

          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 font-medium text-xs sm:text-sm">
            Contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;