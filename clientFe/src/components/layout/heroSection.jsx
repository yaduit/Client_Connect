import { useState } from "react";
import { useNavigate } from "react-router-dom";
const HeroSection = () => {
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!service && !location) return;

    console.log("Search:", { service, location });
    const params = new URLSearchParams();

    if(service) params.append("service", service);
    if(location) params.append("location", location);

    navigate(`/search?${params.toString()}`);
  };

  const handleUseLocation = () => {
    setDetectingLocation(true);

    // later replace with navigator.geolocation
    setTimeout(() => {
      setLocation("Current location");
      setDetectingLocation(false);
    }, 1000);
  };

  return (
    <section className="relative bg-linear-to-br from-gray-50 via-white to-green-50 py-16 sm:py-24 lg:py-32">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
            Find Trusted Local Services{" "}
            <span className="text-green-600">Near You</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Search, compare, and connect with verified professionals in your area.
          </p>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="bg-white rounded-lg shadow-lg p-3 mb-8 max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Service input */}
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="Plumbers, electricians, cleaners..."
                className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Service search"
              />

              {/* Location input */}
              <div className="flex flex-1 items-center border border-gray-300 rounded-md px-3">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    detectingLocation
                      ? "Detecting location..."
                      : "City or zip code"
                  }
                  className="w-full py-3 focus:outline-none"
                  aria-label="Location"
                />
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="ml-2 p-2 hover:bg-gray-100 rounded"
                  aria-label="Use my location"
                >
                  📍
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-green-700 transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <span className="font-medium">✔ 10,000+ Verified Providers</span>
            <span className="hidden sm:block">•</span>
            <span className="font-medium">⭐ Trusted Reviews</span>
            <span className="hidden sm:block">•</span>
            <span className="font-medium">🔒 Secure Platform</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
