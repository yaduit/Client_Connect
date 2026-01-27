import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { MapPin, Loader2, Search, Navigation, SlidersHorizontal } from "lucide-react";

const SearchForm = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialLat = searchParams.get("lat");
  const initialLng = searchParams.get("lng");
  const initialLabel = searchParams.get("label");
  const initialCategoryId = searchParams.get("categoryId");
  const initialSubCategorySlug = searchParams.get("subCategorySlug");

  const [coords, setCoords] = useState(
    initialLat && initialLng
      ? { lat: Number(initialLat), lng: Number(initialLng) }
      : null
  );
  const [locationText, setLocationText] = useState(initialLabel || "");

  const [radius, setRadius] = useState(10);
  const [sort, setSort] = useState("distance");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategorySlug || "");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const { categories, loading: categoriesLoading } = useCategories();
  const selectedCategoryObj = categories.find(
    (cat) => cat._id === selectedCategory,
  );

  const hasPreSelectedCategory = !!initialCategoryId;
  const hasPreSelectedSubCategory = !!initialSubCategorySlug;

  // Forward Geocoding
  const resolveLocationToCoords = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
      {
        headers: {
          "Accept": "application/json",
          "User-Agent": "service-finder-app",
        },
      }
    );

    const data = await res.json();

    if (!data.length) {
      throw new Error("Location not found");
    }

    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
      label: place,
    };
  };

  // Reverse GeoCoding
  const reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      "Nearby Location"
    );
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const label = await reverseGeocode(lat, lng);
        setCoords({ lat, lng });
        setLocationText(label);
        setLocating(false);
      },
      () => {
        setLocationError("Failed to get location");
        setLocating(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let finalCoords = coords;

      if (!finalCoords && locationText) {
        finalCoords = await resolveLocationToCoords(locationText);
        setCoords(finalCoords);
      }

      if (!finalCoords) {
        setLocationError("Please provide a location");
        return;
      }

      localStorage.setItem(
        "lastLocation",
        JSON.stringify({
          lat: finalCoords.lat,
          lng: finalCoords.lng,
        })
      );

      const searchParams = new URLSearchParams();
      searchParams.set("lat", finalCoords.lat);
      searchParams.set("lng", finalCoords.lng);
      searchParams.set("label", locationText);
      searchParams.set("radius", radius);
      searchParams.set("sort", sort);

      if (selectedCategory) searchParams.set("categoryId", selectedCategory);
      if (selectedSubCategory) {
        searchParams.set("subCategorySlug", selectedSubCategory);
      }

      navigate(`/search?${searchParams.toString()}`);
    } catch (err) {
      setLocationError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Find Services</h2>
              <p className="text-sm text-gray-500">Search for providers near you</p>
            </div>
          </div>
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
        </div>

        {/* Location Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={locating}
              className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {locating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Use my location
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Enter city, area, or place..."
              value={locationText}
              onChange={(e) => {
                setLocationText(e.target.value);
                setCoords(null);
              }}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {locationError && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {locationError}
            </div>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Radius */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Search Radius
            </label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
            >
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={25}>Within 25 km</option>
              <option value={50}>Within 50 km</option>
            </select>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
            >
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Category - Only show if not pre-selected */}
          {!hasPreSelectedCategory && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                value={selectedCategory}
                disabled={categoriesLoading}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {categoriesLoading ? "Loading categories..." : "All Categories"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subcategory - Only show if category is selected and not pre-selected */}
          {selectedCategory && !hasPreSelectedSubCategory && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Subcategory
              </label>
              <select
                value={selectedSubCategory}
                disabled={!selectedCategoryObj?.subCategories?.length}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Subcategories</option>
                {selectedCategoryObj?.subCategories.map((sub) => (
                  <option key={sub.slug} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-sm"
        >
          <Search className="w-5 h-5" />
          Search Services
        </button>
      </form>
    </div>
  );
};

export default SearchForm;