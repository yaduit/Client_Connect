import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProviderByIdApi } from "../../api/provider.api.js";
import ProviderDetailsSkeleton from "../../components/providers/providerDetailsSkeleton.jsx";
const ProviderDetails = () => {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const data = await getProviderByIdApi(id);
        setProvider(data.provider);
      } catch (error) {
        console.error(error);
        setError("Failed to load provider");
      } finally {
        setLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  if (loading) return <div><ProviderDetailsSkeleton/></div>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{provider.businessName}</h1>
        <p className="text-gray-600">
          {provider.categoryId.name} • {provider.subCategorySlug}
        </p>
        <p className="text-sm text-gray-500">
          📍 {provider.location.city}, {provider.location.state}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        ⭐ {provider.ratingAverage} ({provider.totalReviews} reviews)
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-2">About this service</h3>
        <p className="text-gray-700">{provider.description}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Contact Provider
        </button>
        <button className="border px-4 py-2 rounded">
          Book Service
        </button>
      </div>
    </div>
  );
};

export default ProviderDetails;
