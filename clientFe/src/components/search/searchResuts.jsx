import React from 'react';
import ProviderCard from '../providers/providerCard.jsx';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';

const SearchResults = ({
  providers,
  loading,
  error,
  page,
  setPage
}) => {

  // Loading state for initial search
  if (loading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Searching for providers...</p>
        <p className="text-gray-400 text-sm mt-2">This won't take long</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Search Failed
          </h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No results state
  if (!loading && providers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-8 max-w-md text-center">
          <SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Providers Found
          </h3>
          <p className="text-gray-600 mb-4">
            We couldn't find any service providers matching your criteria.
          </p>
          <div className="space-y-2 text-sm text-gray-500 text-left">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Try expanding your search radius
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Remove category filters
            </p>
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
              Search in a different location
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Search Results
          </h3>
          <p className="text-gray-600 mt-1">
            Found {providers.length} provider{providers.length !== 1 ? 's' : ''} near you
          </p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => setPage(prev => prev + 1)}
          disabled={loading}
          className="px-8 py-3 bg-white border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 hover:text-green-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white flex items-center gap-3 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading more providers...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Load More Providers
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;