import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import Navbar from "../../components/layout/navbar.jsx";
import Footer from "../../components/layout/footer.jsx";
import ReviewForm from "../../components/reviews/reviewForm.jsx";
import { useAuth } from "../../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { searchProvidersApi } from "../../api/search.api.js";

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError("Please enter a provider name or service");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Using search API with query parameter
      const data = await searchProvidersApi({
        query: searchQuery,
        limit: 10,
      });
      setProviders(data.providers || []);

      if (!data.providers || data.providers.length === 0) {
        setError("No providers found matching your search.");
      }
    } catch (err) {
      setError("Failed to search providers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Share Your Experience
            </h1>
            <p className="text-lg text-gray-600">
              Help others by writing a review about a service provider
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Thank You!
              </h3>
              <p className="text-green-600">
                Your review has been submitted successfully. It will appear after moderation.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setSelectedProvider(null);
                  setSearchQuery("");
                }}
                className="mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Write Another Review
              </button>
            </div>
          )}

          {!submitted && (
            <>
              {/* Search Section */}
              {!selectedProvider && (
                <div className="bg-gray-50 p-8 rounded-lg mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Find a Provider
                  </h2>

                  <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by provider name or service..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        <Search size={20} />
                        {loading ? "Searching..." : "Search"}
                      </button>
                    </div>
                  </form>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}

                  {/* Provider List */}
                  {providers.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Select a Provider:
                      </h3>
                      {providers.map((provider) => (
                        <div
                          key={provider._id}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800">
                              {provider.businessName || provider.name}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {provider.location?.city}, {provider.location?.state}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i}>
                                    {i < Math.round(provider.ratingAverage || 0)
                                      ? "★"
                                      : "☆"}
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                ({provider.totalReviews || 0} reviews)
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedProvider(provider)}
                            className="ml-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {providers.length === 0 && searchQuery && !loading && !error && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Start searching to find providers to review.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Review Form Section */}
              {selectedProvider && (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <div className="mb-8">
                    <button
                      onClick={() => setSelectedProvider(null)}
                      className="text-green-600 hover:text-green-700 font-semibold mb-4 flex items-center gap-1"
                    >
                      ← Back to search
                    </button>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {selectedProvider.businessName || selectedProvider.name}
                      </h3>
                      <p className="text-gray-600">
                        {selectedProvider.location?.city}, {selectedProvider.location?.state}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < Math.round(selectedProvider.ratingAverage || 0)
                                ? "★"
                                : "☆"}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({selectedProvider.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-8">
                    Write Your Review
                  </h2>

                  <ReviewForm
                    providerId={selectedProvider._id}
                    onSuccess={() => {
                      setSubmitted(true);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WriteReviewPage;
