import { ChevronRight, MapPin, Star, Loader } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getRelatedProvidersApi } from "../../api/provider.api";
import { useLocation } from "../../context/location/useLocation";

const RelatedProviders = ({ categoryId, currentProviderId }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { location } = useLocation();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Skip if no categoryId
    if (!categoryId) {
      setLoading(false);
      return;
    }

    // Create abort controller for cleanup
    abortControllerRef.current = new AbortController();

    const fetchRelatedProviders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build request params
        const params = {
          categoryId,
          excludeId: currentProviderId,
          limit: 6
        };

        // Add location if available
        if (location?.lat && location?.lng) {
          params.lat = location.lat;
          params.lng = location.lng;
        }

        // Fetch related providers
        const response = await getRelatedProvidersApi(params);

        if (response.success) {
          setProviders(response.providers || []);
        } else {
          setError(response.message || 'Failed to fetch related providers');
        }
      } catch (err) {
        // Ignore abort errors
        if (err.name === 'AbortError' || err.message?.includes('cancel')) {
          return;
        }
        
        console.error('Error fetching related providers:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load similar providers');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProviders();

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [categoryId, currentProviderId, location?.lat, location?.lng]);

  // Don't render if no categoryId or still loading with no data
  if (!categoryId) {
    return null;
  }

  // Loading skeleton
  if (loading) {
    return (
      <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="h-7 sm:h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 sm:p-5 animate-pulse">
              <div className="h-40 sm:h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Similar Providers</h2>
        </div>
        <div className="text-center py-8 sm:py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Try again
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (providers.length === 0) {
    return (
      <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Similar Providers</h2>
        </div>
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-600 mb-4">No similar providers found in this category.</p>
          <a
            href={`/search?categoryId=${categoryId}`}
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            View all providers in this category
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    );
  }

  // Success state with providers
  return (
    <section className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Similar Providers</h2>
        <a
          href={`/search?categoryId=${categoryId}`}
          className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1 text-sm sm:text-base"
        >
          View All <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {providers.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </section>
  );
};

// Provider Card Component
const ProviderCard = ({ provider }) => {
  const coverImage =
    provider.images && provider.images.length > 0
      ? provider.images[0].url
      : "https://via.placeholder.com/400x300?text=No+Image";

  const hasDistance = provider.distanceMeters !== null && provider.distanceMeters !== undefined;
  const distanceKm = hasDistance ? (provider.distanceMeters / 1000).toFixed(1) : null;

  return (
    <Link
      to={`/service/${provider.slug || provider.id}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-40 sm:h-48 bg-gradient-to-br from-gray-200 to-gray-300">
        <img
          src={coverImage}
          alt={provider.businessName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Distance Badge */}
        {hasDistance && (
          <div className="absolute top-3 right-3 bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {distanceKm} km away
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Business Name */}
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
          {provider.businessName}
        </h3>

        {/* Category/Subcategory */}
        {provider.subCategorySlug && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 capitalize">
            {provider.subCategorySlug.replace(/-/g, ' ')}
          </p>
        )}

        {/* Location */}
        {provider.location?.city && provider.location?.state && (
          <div className="flex items-center gap-1.5 text-gray-600 mb-3 text-xs sm:text-sm">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">
              {provider.location.city}, {provider.location.state}
            </span>
          </div>
        )}

        {/* Rating */}
        {provider.avgRating > 0 && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-900 text-sm">
                {provider.avgRating.toFixed(1)}
              </span>
            </div>
            {provider.totalReviews > 0 && (
              <span className="text-xs text-gray-500">
                ({provider.totalReviews} {provider.totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            )}
          </div>
        )}

        {/* Description preview (if available and no rating) */}
        {!provider.avgRating && provider.description && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-2">
            {provider.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default RelatedProviders;