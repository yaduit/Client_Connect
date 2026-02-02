import React from 'react';
import ProviderCard from '../providers/providerCard.jsx';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';

const SearchResults = ({ providers, loading, error, page, setPage }) => {
  // Loading state
  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">Searching for providers...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-sm w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Search Failed</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No results state
  if (!loading && providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-sm w-full text-center">
          <SearchX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Providers Found</h3>
          <p className="text-gray-600 text-sm mb-4">
            Try expanding your search radius or removing filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {providers.length} Provider{providers.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {providers.length > 0 ? 'Sorted by ' + (new URLSearchParams(window.location.search).get('sort') === 'rating' ? 'highest rated' : 'distance') : ''}
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {providers.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>

      {/* Load More Button */}
      {providers.length > 0 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 hover:text-green-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;