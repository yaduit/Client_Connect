import { Star, Shield, MapPin, Clock } from "lucide-react";
import { useState } from "react";

const ProviderHero = ({ provider }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="py-12 border-b border-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Image */}
        <div className="sm:col-span-1">
          <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
            {provider.image ? (
              <img
                src={provider.image}
                alt={provider.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-400">
                {provider.businessName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="sm:col-span-2">
          {/* Name & Category */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                {provider.businessName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {provider.categoryId?.name}
              </p>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {provider.verified && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-700">
                <Shield className="w-3 h-3" />
                Verified
              </span>
            )}
            {provider.isActive && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                <span className="w-2 h-2 bg-green-600 rounded-full" />
                Active
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(provider.ratingAverage)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-800">
              {provider.ratingAverage?.toFixed(1)} ({provider.totalReviews})
            </span>
          </div>

          {/* Location & Response */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {provider.location?.city}, {provider.location?.state}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Responds in ~{provider.responseTime || 24}h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderHero;
