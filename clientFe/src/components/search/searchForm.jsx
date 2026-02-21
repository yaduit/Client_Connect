import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { MapPin, Loader2, Search, Navigation, ChevronLeft } from "lucide-react";

const SearchForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialLat = searchParams.get("lat");
  const initialLng = searchParams.get("lng");
  const initialLabel = searchParams.get("label");
  const initialCategoryId = searchParams.get("categoryId");
  const initialSubCategorySlug = searchParams.get("subCategorySlug");
  const initialRadius = searchParams.get("radius") || "10";
  const initialSort = searchParams.get("sort") || "distance";

  const [coords, setCoords] = useState(
    initialLat && initialLng
      ? { lat: Number(initialLat), lng: Number(initialLng) }
      : null
  );
  const [locationText, setLocationText] = useState(initialLabel || "");
  const [radius, setRadius] = useState(initialRadius);
  const [sort, setSort] = useState(initialSort);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId || "");
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategorySlug || "");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const { categories } = useCategories();
  const selectedCategoryObj = categories.find((cat) => cat._id === selectedCategory);

  const hasPreSelectedCategory = !!initialCategoryId;
  const hasPreSelectedSubCategory = !!initialSubCategorySlug;

  const resolveLocationToCoords = async (place) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "service-finder-app",
        },
      }
    );
    const data = await res.json();
    if (!data.length) throw new Error("Location not found");
    return {
      lat: Number(data[0].lat),
      lng: Number(data[0].lon),
      label: place,
    };
  };

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

  const handleUseMyLocation = async () => {
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
      }
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

      const params = new URLSearchParams();
      params.set("lat", finalCoords.lat);
      params.set("lng", finalCoords.lng);
      params.set("label", locationText);
      params.set("radius", radius);
      params.set("sort", sort);

      if (selectedCategory) params.set("categoryId", selectedCategory);
      if (selectedSubCategory) params.set("subCategorySlug", selectedSubCategory);

      navigate(`/search?${params.toString()}`);
    } catch (err) {
      setLocationError(err.message);
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Style Search Bar */}
        <form onSubmit={handleSubmit} className="py-4">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-shrink-0 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors"
              title="Go Back"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">Back</span>
            </button>

            {/* Location Input - Centered */}
            <div className="flex-1 flex items-center gap-3 justify-center max-w-lg mx-auto">
              <div className="relative w-full">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationText}
                  onChange={(e) => {
                    setLocationText(e.target.value);
                    setCoords(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Quick Filters */}
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-700 bg-white"
              >
                <option value="5">5km</option>
                <option value="10">10km</option>
                <option value="25">25km</option>
                <option value="50">50km</option>
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-sm text-gray-700 bg-white"
              >
                <option value="distance">Distance</option>
                <option value="rating">Rating</option>
              </select>

              {/* My Location Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="flex-shrink-0 p-3 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Use my location"
              >
                {locating ? (
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                ) : (
                  <Navigation className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Search Button */}
              <button
                type="submit"
                className="flex-shrink-0 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-shrink-0 w-8 sm:hidden" />
          </div>

          {/* Error Message */}
          {locationError && (
            <p className="text-xs text-red-600 mt-2 text-center">{locationError}</p>
          )}
        </form>

        {/* Advanced Filters - Below (collapsible area) */}
        {(selectedCategory || selectedSubCategory || initialCategoryId || initialSubCategorySlug) && (
          <div className="py-2 px-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-3 text-xs">
            {!hasPreSelectedCategory && (
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-600">Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                  }}
                  className="px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCategory && !hasPreSelectedSubCategory && (
              <div className="flex items-center gap-2">
                <label className="font-medium text-gray-600">Type:</label>
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white"
                >
                  <option value="">All</option>
                  {selectedCategoryObj?.subCategories?.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
