import ProviderCard from "../providers/providerCard.jsx";
import { useTopServicesNearYou } from "../../hooks/useTopServicesNearYou.jsx";

const TopServicesNearYou = () => {
  const { providers, loading, error } = useTopServicesNearYou();

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 text-center text-red-600">
        {error}
      </section>
    );
  }

  if (providers.length === 0) {
    return (
      <section className="py-16 text-center text-gray-600">
        No top services found near your location yet.
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Top Services Near You
          </h2>
          <p className="mt-2 text-gray-600">
            Highly rated professionals around your location
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <ProviderCard
              key={provider._id}
              provider={provider}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition">
            View more services →
          </button>
        </div>

      </div>
    </section>
  );
};

export default TopServicesNearYou;
