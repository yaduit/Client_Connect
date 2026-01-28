const ProviderServiceCard = ({ provider }) => {
  const images = provider.images || [];
  const coverImage =
    images.length > 0
      ? images[0]
      : "https://via.placeholder.com/600x400?text=Service+Image";

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      
      {/* Image */}
      <div className="h-48 w-full bg-gray-100">
        <img
          src={coverImage}
          alt={provider.businessName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold">{provider.businessName}</h3>

        <p className="text-gray-600 mt-1">
          {provider.categoryId?.name} • {provider.subCategorySlug}
        </p>

        <p className="text-gray-500 mt-1">
          📍 {provider.location.city}, {provider.location.state}
        </p>

        {/* Status */}
        <span
          className={`inline-block mt-3 px-3 py-1 text-sm rounded-full ${
            provider.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {provider.isActive ? "Active" : "Inactive"}
        </span>

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          <button className="px-4 py-2 border rounded hover:bg-gray-50">
            Edit Service
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Disable
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderServiceCard;
