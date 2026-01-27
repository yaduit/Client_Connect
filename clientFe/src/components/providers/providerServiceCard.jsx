const ProviderServiceCard = ({ provider }) => {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-xl font-semibold">{provider.businessName}</h3>

      <p className="text-gray-600 mt-1">
        {provider.categoryId?.name} • {provider.subCategorySlug}
      </p>

      <p className="text-gray-500 mt-1">
        📍 {provider.location.city}, {provider.location.state}
      </p>

      <span
        className={`inline-block mt-3 px-3 py-1 text-sm rounded-full ${
          provider.isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {provider.isActive ? "Active" : "Inactive"}
      </span>

      <div className="mt-4 flex gap-3">
        <button className="px-4 py-2 border rounded hover:bg-gray-50">
          Edit Service
        </button>
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Disable
        </button>
      </div>
    </div>
  );
};

export default ProviderServiceCard;
