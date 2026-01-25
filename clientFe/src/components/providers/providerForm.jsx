import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories.jsx";
import { useAuth } from "../../context/auth/useAuth.js";
import { registerProviderApi } from "../../api/provider.api.js";

const ProviderForm = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user, login } = useAuth(); // ✅ Get auth context

  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  const [description, setDescription] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coords, setCoords] = useState(null);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [locationStatus, setLocationStatus] = useState("");

  const selectedCategory = categories.find(
    (c) => c._id === categoryId
  );

  const handleUseMyLocation = () => {
    setError(null);
    setFieldErrors({});
    setLocationStatus("Detecting location...");
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLocationStatus("");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { longitude, latitude } = pos.coords;
          setCoords([longitude, latitude]);

          // Reverse geocoding using OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.address) {
            setCity(data.address.city || data.address.town || "");
            setState(data.address.state || "");
          }

          setLocationStatus("Location detected ✅");
        } catch (err) {
          setError("Failed to get location details");
          setLocationStatus("");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setError("Failed to get location. Please enable location access.");
        setLocationStatus("");
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validate all required fields
    if (!businessName.trim()) {
      errors.businessName = "Business name is required";
    }
    if (!categoryId) {
      errors.categoryId = "Category is required";
    }
    if (!subCategorySlug) {
      errors.subCategorySlug = "Subcategory is required";
    }
    if (!description.trim()) {
      errors.description = "Description is required";
    }
    if (!city.trim()) {
      errors.city = "City is required";
    }
    if (!state.trim()) {
      errors.state = "State is required";
    }
    if (!coords) {
      errors.location = "Please detect your service location";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please fix all required fields");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFieldErrors({});

      const response = await registerProviderApi({
        businessName,
        categoryId,
        subCategorySlug,
        description,
        location: {
          city,
          state,
          geo: {
            coordinates: coords,
          },
        },
      });

      // ✅ Update user role in auth context
      if (response && response.user) {
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        login({
          user: response.user,
          token: storedAuth.token || user?.token,
        });
      } else {
        // Fallback: update user role to provider
        const storedAuth = JSON.parse(localStorage.getItem("auth") || "{}");
        login({
          user: { ...user, role: "provider" },
          token: storedAuth.token || user?.token,
        });
      }

      // Success → go to dashboard
      navigate("/provider/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to publish service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow"
    >
      <h2 className="text-xl font-semibold">
        Publish Your Service
      </h2>

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {categoriesLoading && (
        <p className="text-blue-600">Loading categories...</p>
      )}

      <div>
        <input
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className={`border p-2 w-full ${
            fieldErrors.businessName ? "border-red-500" : ""
          }`}
          required
        />
        {fieldErrors.businessName && (
          <p className="text-red-600 text-sm">
            {fieldErrors.businessName}
          </p>
        )}
      </div>

      <div>
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategorySlug("");
          }}
          className={`border p-2 w-full ${
            fieldErrors.categoryId ? "border-red-500" : ""
          }`}
          disabled={categoriesLoading}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {fieldErrors.categoryId && (
          <p className="text-red-600 text-sm">
            {fieldErrors.categoryId}
          </p>
        )}
      </div>

      {selectedCategory && (
        <div>
          <select
            value={subCategorySlug}
            onChange={(e) => setSubCategorySlug(e.target.value)}
            className={`border p-2 w-full ${
              fieldErrors.subCategorySlug ? "border-red-500" : ""
            }`}
            required
          >
            <option value="">Select Subcategory</option>
            {selectedCategory.subCategories.map((sub) => (
              <option key={sub.slug} value={sub.slug}>
                {sub.name}
              </option>
            ))}
          </select>
          {fieldErrors.subCategorySlug && (
            <p className="text-red-600 text-sm">
              {fieldErrors.subCategorySlug}
            </p>
          )}
        </div>
      )}

      <div>
        <textarea
          placeholder="Describe your service"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`border p-2 w-full ${
            fieldErrors.description ? "border-red-500" : ""
          }`}
          rows={4}
        />
        {fieldErrors.description && (
          <p className="text-red-600 text-sm">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`border p-2 w-full ${
              fieldErrors.city ? "border-red-500" : ""
            }`}
            required
          />
          {fieldErrors.city && (
            <p className="text-red-600 text-sm">{fieldErrors.city}</p>
          )}
        </div>
        <div className="flex-1">
          <input
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className={`border p-2 w-full ${
              fieldErrors.state ? "border-red-500" : ""
            }`}
            required
          />
          {fieldErrors.state && (
            <p className="text-red-600 text-sm">{fieldErrors.state}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={locationLoading}
        className="text-green-600 underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {locationLoading ? "Detecting location..." : "Use my location"}
      </button>

      {locationStatus && (
        <p className="text-sm text-gray-600">{locationStatus}</p>
      )}

      {fieldErrors.location && (
        <p className="text-red-600 text-sm">{fieldErrors.location}</p>
      )}

      <button
        type="submit"
        disabled={loading || categoriesLoading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Publishing..." : "Publish Service"}
      </button>
    </form>
  );
};

export default ProviderForm;
