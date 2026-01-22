import { Link } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
  
  {/* Image */}
  <div className="h-40 bg-linear-to-br from-gray-100 to-gray-50 flex items-center justify-center relative overflow-hidden">
    <span className="text-gray-400 text-sm font-medium">Service Image</span>
    <div className="absolute inset-0 bg-green-600/0 group-hover:bg-green-600/5 transition-colors duration-300"></div>
  </div>

  {/* Content */}
  <div className="p-5 space-y-3">
    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-green-700 transition-colors">
      {provider.businessName}
    </h3>

    <p className="text-sm text-gray-600 leading-relaxed">
      <span className="font-medium text-gray-700">{provider.categoryId?.name}</span>
      <span className="text-gray-400 mx-1.5">•</span>
      <span className="text-gray-500">{provider.subCategorySlug}</span>
    </p>

    <p className="text-sm text-gray-500 flex items-start gap-1.5">
      <span className="text-base leading-none">📍</span>
      <span className="leading-relaxed">{provider.location.city}, {provider.location.state}</span>
    </p>

    {/* Rating */}
    <div className="flex items-center gap-2 text-sm pt-1">
      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
        <span className="text-amber-500 text-base leading-none">⭐</span>
        <span className="font-semibold text-gray-900">{provider.ratingAverage}</span>
      </div>
      <span className="text-gray-500">
        ({provider.totalReviews} {provider.totalReviews === 1 ? 'review' : 'reviews'})
      </span>
    </div>

    {/* Trust badges */}
    <div className="flex gap-3 text-xs font-semibold pt-1">
      <span className="text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
        ✓ Verified
      </span>
      <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
        Active
      </span>
    </div>

    {/* Actions */}
    <div className="flex gap-3 pt-4 border-t border-gray-100">
      <Link
        to={`/providers/${provider._id}`}
        className="flex-1 text-center bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-700 active:bg-green-800 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow"
      >
        View Details
      </Link>

      <button className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 font-medium text-sm">
        Contact
      </button>
    </div>
  </div>
</div>
  );
};

export default ProviderCard;
