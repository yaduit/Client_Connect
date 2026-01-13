import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";

const SearchForm = ({ onSearch }) => {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState(10);
  const [sort, setSort] = useState("distance");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const selectedCategoryObj = categories.find(
    (cat) => cat._id === selectedCategory
  );

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocating(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("Failed to get Location");
        }
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({
      lat,
      lng,
      radius,
      ...(selectedCategory && { categoryId: selectedCategory }),
      ...(selectedSubCategory && { subCategorySlug: selectedSubCategory }),
      sort,
    });
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
        {/*location*/}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            step="any"
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />

          <input
            type="number"
            step="any"
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        {/*Radius*/}
        <div>
          <label htmlFor="" className="block text-sm text-gray-600 mb-1">
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

        {/*Category*/}
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
            {categories.map((cat) => {
              return (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              );
            })}
          </select>
        </div>

        {/*SubcategoryId*/}
        {selectedCategory && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              SubCategory
            </label>

            <select
              value={selectedSubCategory}
              disabled={!selectedCategoryObj?.subCategories?.length}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
              }}
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

        {/*Sort*/}
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

        {/* submit */}
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
