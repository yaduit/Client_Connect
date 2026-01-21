import { useNavigate } from "react-router-dom";

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  const distanceKm = provider.distance
    ? (provider.distance / 1000).toFixed(1)
    : null;

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900">
          {provider.businessName}
        </h3>

        {provider.ratingAverage > 0 && (
          <div className="text-sm text-yellow-600 font-semibold">
            ⭐ {provider.ratingAverage.toFixed(1)}
            <span className="text-gray-500 font-normal">
              {" "}({provider.totalReviews})
            </span>
          </div>
        )}
      </div>

      {/* Category */}
      <div className="inline-block text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded mb-3">
        {provider.categoryId?.name} • {provider.subCategorySlug}
      </div>

      {/* Location */}
      <div className="text-sm text-gray-600 mb-4">
        📍 {provider.location?.city}, {provider.location?.state}
        {distanceKm && (
          <span className="ml-2 text-gray-500">
            • {distanceKm} km away
          </span>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate(`/providers/${provider._id}`)}
        className="text-green-600 font-semibold hover:underline"
      >
        View details →
      </button>
    </div>
  );
};

export default ProviderCard;
