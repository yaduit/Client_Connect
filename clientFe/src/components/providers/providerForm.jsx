import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories.jsx";
import { useAuth } from "../../context/auth/useAuth.js";
import {
  registerProviderApi,
  uploadProviderImagesApi,
} from "../../api/provider.api.js";
import ImageUploadSection from "./imageUploadSection.jsx";
import { MapPin, Loader2, Building2, FileText, MapPinned } from "lucide-react";

const ProviderForm = () => {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();
  const { user, updateUser } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategorySlug, setSubCategorySlug] = useState("");
  const [description, setDescription] = useState("");

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coords, setCoords] = useState(null);

  // ============ IMAGE UPLOAD STATE ============
  const [selectedImages, setSelectedImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [locationStatus, setLocationStatus] = useState("");

  const selectedCategory = categories.find((c) => c._id === categoryId);

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

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const data = await response.json();

          if (data.address) {
            setCity(data.address.city || data.address.town || "");
            setState(data.address.state || "");
          }

          setLocationStatus("Location detected successfully! ✅");
        } catch (error) {
          console.error(error);
          setError("Failed to get location details");
          setLocationStatus("");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setError("Failed to get location. Please enable location access.");
        setLocationStatus("");
        setLocationLoading(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

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

      // Step 1: Register provider (without images)
      const providerResponse = await registerProviderApi({
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

      // Step 2: Upload images if any selected
      if (selectedImages.length > 0) {
        try {
          await uploadProviderImagesApi(selectedImages);
        } catch (imageError) {
          console.error("Image upload failed:", imageError);
          // Don't fail the entire flow if image upload fails
          // Provider is already created
          setError(
            "Service published but image upload failed. Please add images later from your dashboard.",
          );
        }
      }

      // Update user role locally
      updateUser({
        ...user,
        role: providerResponse.data?.user?.role || "provider",
      });

      navigate("/provider/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Publish Your Service
          </h2>
          <p className="text-gray-600">
            Fill in the details below to start receiving service requests
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3">
            <svg
              className="w-5 h-5 mt-0.5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Categories Loading */}
        {categoriesLoading && (
          <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading categories...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Name */}
          <div className="space-y-2">
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-gray-700"
            >
              Business Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="businessName"
                type="text"
                placeholder="e.g., John's Plumbing Services"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                  fieldErrors.businessName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              />
            </div>
            {fieldErrors.businessName && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.businessName}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Service Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubCategorySlug("");
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 ${
                fieldErrors.categoryId ? "border-red-500" : "border-gray-300"
              }`}
              disabled={categoriesLoading}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.categoryId}
              </p>
            )}
          </div>

          {/* Subcategory */}
          {selectedCategory && (
            <div className="space-y-2">
              <label
                htmlFor="subcategory"
                className="block text-sm font-medium text-gray-700"
              >
                Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory"
                value={subCategorySlug}
                onChange={(e) => setSubCategorySlug(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 ${
                  fieldErrors.subCategorySlug
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a subcategory</option>
                {selectedCategory.subCategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {fieldErrors.subCategorySlug && (
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <span>•</span> {fieldErrors.subCategorySlug}
                </p>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Service Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                placeholder="Describe your services, experience, and what makes you stand out..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none ${
                  fieldErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                rows={4}
              />
            </div>
            {fieldErrors.description && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.description}
              </p>
            )}
          </div>

          {/* ============ IMAGE UPLOAD SECTION ============ */}
          <div className="bg-gray-50 rounded-lg p-6">
            <ImageUploadSection
              onImagesChange={setSelectedImages}
              maxImages={4}
              maxFileSize={5}
              existingImages={[]}
            />
          </div>

          {/* Location Section */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPinned className="w-5 h-5 text-green-600" />
                Service Location
              </h3>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className={`flex items-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  coords
                    ? "hidden" // Hide button once location is set
                    : "text-green-600 hover:text-green-700"
                }`}
              >
                {locationLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <MapPin className="w-4 h-4" />
                    Use my location
                  </>
                )}
              </button>
            </div>

            {locationStatus && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                {locationStatus}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                    fieldErrors.city ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.city && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span>•</span> {fieldErrors.city}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400 ${
                    fieldErrors.state ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                />
                {fieldErrors.state && (
                  <p className="text-red-600 text-sm flex items-center gap-1">
                    <span>•</span> {fieldErrors.state}
                  </p>
                )}
              </div>
            </div>

            {fieldErrors.location && (
              <p className="text-red-600 text-sm flex items-center gap-1">
                <span>•</span> {fieldErrors.location}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || categoriesLoading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing Service...
              </>
            ) : (
              "Publish Service"
            )}
          </button>

          <p className="text-sm text-gray-500 text-center">
            By publishing, you agree to our terms of service and privacy policy
          </p>
        </form>
      </div>
    </div>
  );
};

export default ProviderForm;
