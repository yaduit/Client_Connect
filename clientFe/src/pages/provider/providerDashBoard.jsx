import { Link } from "react-router-dom";
import ProviderServiceCard from "../../components/providers/providerServiceCard.jsx";
import { useMyProviderService } from "../../hooks/useMyProviderService.jsx";

const ProviderDashBoard = () => {
  const { provider, loading, error } = useMyProviderService();

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  /* ---------------- Error ---------------- */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-600 font-semibold">
          {error}
        </p>
      </div>
    );
  }

  /* ---------------- No Provider Yet ---------------- */
  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">
            You haven’t published a service yet
          </h2>
          <p className="text-gray-600">
            Publish your service to start receiving customers.
          </p>
          <Link
            to="/provider/onboarding"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Publish Service
          </Link>
        </div>
      </div>
    );
  }

  /* ---------------- Dashboard ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Provider Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your service and track performance
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Service Card */}
          <div className="lg:col-span-2">
            <ProviderServiceCard provider={provider} />
          </div>

          {/* Stats / Actions Panel */}
          <div className="bg-white rounded-lg shadow p-5 space-y-4">
            <h3 className="font-semibold text-lg">
              Service Overview
            </h3>

            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium">Status:</span>{" "}
                {provider.isActive ? "Active" : "Inactive"}
              </p>
              <p>
                <span className="font-medium">Rating:</span>{" "}
                ⭐ {provider.ratingAverage || 0}
              </p>
              <p>
                <span className="font-medium">Total Reviews:</span>{" "}
                {provider.totalReviews || 0}
              </p>
            </div>

            <div className="pt-3 border-t space-y-2">
              <Link
                to="/provider/edit"
                className="block text-center px-4 py-2 border rounded hover:bg-gray-100"
              >
                Edit Service
              </Link>

              <button
                className="w-full px-4 py-2 border border-red-500 text-red-600 rounded hover:bg-red-50"
                disabled
              >
                Deactivate Service (coming soon)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderDashBoard;
