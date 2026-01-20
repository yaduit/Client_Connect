import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

const SearchForm = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const initialLat = searchParams.get("lat");
  const initialLng = searchParams.get("lng");
  const initialLabel = searchParams.get("label");

  const [coords, setCoords] = useState(
    initialLat && initialLng
    ? {lat: Number(initialLat), lng: Number(initialLng)}
    : null
  );
  const [locationText, setLocationText] = useState(initialLabel || "");

  const [radius, setRadius] = useState(10);
  const [sort, setSort] = useState("distance");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const { categories, loading: categoriesLoading } = useCategories();
  const selectedCategoryObj = categories.find(
    (cat) => cat._id === selectedCategory,
  );

        {/*Forward Geocoding */}
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

      {/*Reverse GeoCoding */}

      const reverseGeocode = async (lat,lng) => {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        return(
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
       const label = await reverseGeocode(lat,lng);
        setCoords({lat,lng});
        setLocationText(label)
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
    };

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
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-4 mb-6 py-4"
      >
        <h4 className="text-lg font-semibold text-gray-800">Search Services</h4>

        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={locating}
          className="text-sm text-green-600 hover:underline disabled:opacity-50"
        >
          {locating ? "Detecting Location..." : "Use my location"}
        </button>
        {locationError && (
          <p className="text-sm text-red-600">{locationError}</p>
        )}

        {/* Location input*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City, area, or place"
              value={locationText}
              onChange={
                (e) => {
                  setLocationText(e.target.value)
                  setCoords(null);
                }
              }
              className="border rounded px-3 py-2 w-full"
            />

        </div>

        {/* Radius */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Radius (km)
          </label>
          <select
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Category</label>
          <select
            value={selectedCategory}
            disabled={categoriesLoading}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select category"}
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        {selectedCategory && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              SubCategory
            </label>
            <select
              value={selectedSubCategory}
              disabled={!selectedCategoryObj?.subCategories?.length}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="border rounded px-3 py-2 w-full disabled:bg-gray-100"
            >
              <option value="">Select Subcategory</option>
              {selectedCategoryObj?.subCategories.map((sub) => (
                <option key={sub.slug} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
