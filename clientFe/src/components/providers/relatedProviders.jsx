import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const RelatedProviders = ({ categoryId, currentProviderId }) => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch similar providers from API
    // For now, return null since we don't have this API yet
    setLoading(false);
  }, [categoryId, currentProviderId]);

  if (loading || providers.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Similar Providers</h2>
        <a href={`/search?categoryId=${categoryId}`} className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1">
          View All <ChevronRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder - will be populated by API */}
        <p className="text-gray-600 col-span-full">Loading similar providers...</p>
      </div>
    </section>
  );
};

export default RelatedProviders;
