import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { registerProviderApi } from "../../api/provider.api.js";

const ProviderForm = () => {
  const { categories } = useCategories();

  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedCategory = categories.find(c => c._id === categoryId);

  const handleUseMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords([
          pos.coords.longitude,
          pos.coords.latitude,
        ]);
      },
      () => setError("Failed to get location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coords) {
      setError("Please set your service location");
      return;
    }

    try {
      setLoading(true);
      await registerProviderApi({
        businessName,
        categoryId,
        subCategorySlug,
        description,
        city,
        state,
        coordinates: coords,
      });
      alert("Service published successfully!");
    } catch (err) {
      setError(err.message || "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
      {error && <p className="text-red-600">{error}</p>}

      <input
        placeholder="Business Name"
        value={businessName}
        onChange={(e) => setBusinessName(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <select
        value={categoryId}
        onChange={(e) => {
          setCategoryId(e.target.value);
          setSubCategorySlug("");
        }}
        className="border p-2 w-full"
        required
      >
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      {selectedCategory && (
        <select
          value={subCategorySlug}
          onChange={(e) => setSubCategorySlug(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Subcategory</option>
          {selectedCategory.subCategories.map(sub => (
            <option key={sub.slug} value={sub.slug}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <div className="flex gap-2">
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <button
        type="button"
        onClick={handleUseMyLocation}
        className="text-green-600 underline"
      >
        Use my location
      </button>

      <button
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Publishing..." : "Publish Service"}
      </button>
    </form>
  );
};

export default ProviderForm;
